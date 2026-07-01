"use server";

import { revalidatePath } from "next/cache";
import { fromZonedTime } from "date-fns-tz";
import { prisma } from "@/lib/prisma";
import { generateToken } from "@/lib/tokens";
import { isSlotStillFree, TIME_ZONE } from "@/lib/booking";
import { manualBookingSchema } from "@/lib/validations/admin-booking";
import { requireStaff } from "@/lib/admin-guard";
import { sendBookingCancellationEmail, sendBookingConfirmationEmail } from "@/lib/email";
import { formatDateTime } from "@/lib/format";

export async function createManualBookingAction(formData: FormData) {
  const session = await requireStaff();

  const parsed = manualBookingSchema.safeParse({
    practitionerId: formData.get("practitionerId"),
    serviceId: formData.get("serviceId"),
    startTime: formData.get("startTime"),
    customerName: formData.get("customerName"),
    customerEmail: formData.get("customerEmail"),
    customerPhone: formData.get("customerPhone"),
    note: formData.get("note") || undefined,
  });

  if (!parsed.success) {
    return { ok: false, message: "Kérlek, ellenőrizd a megadott adatokat." };
  }

  const { practitionerId, serviceId, startTime, customerName, customerEmail, customerPhone, note } =
    parsed.data;

  if (session.user.role !== "ADMIN" && session.user.practitionerId !== practitionerId) {
    return { ok: false, message: "Nincs jogosultságod más szakember nevében foglalni." };
  }

  const service = await prisma.service.findUnique({ where: { id: serviceId } });
  if (!service || service.practitionerId !== practitionerId) {
    return { ok: false, message: "A szolgáltatás nem található." };
  }

  const start = fromZonedTime(startTime, TIME_ZONE);
  const end = new Date(start.getTime() + service.durationMinutes * 60_000);

  const stillFree = await isSlotStillFree({ practitionerId, start, end });
  if (!stillFree) {
    return { ok: false, message: "Erre az időpontra már van foglalás." };
  }

  const manageToken = generateToken();

  const booking = await prisma.booking.create({
    data: {
      practitionerId,
      serviceId,
      customerName,
      customerEmail,
      customerPhone,
      note,
      startTime: start,
      endTime: end,
      status: "CONFIRMED",
      manageToken,
    },
    include: { practitioner: true },
  });

  await sendBookingConfirmationEmail({
    customerEmail: booking.customerEmail,
    customerName: booking.customerName,
    practitionerName: booking.practitioner.name,
    serviceName: service.name,
    startTimeFormatted: formatDateTime(booking.startTime),
    manageUrl: `${process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"}/foglalas/${manageToken}`,
  });

  revalidatePath("/admin/foglalasok");
  revalidatePath("/admin");

  return { ok: true, message: "Foglalás rögzítve." };
}

export async function adminCancelBookingAction(bookingId: string) {
  const session = await requireStaff();

  const booking = await prisma.booking.findUnique({ where: { id: bookingId }, include: { service: true } });
  if (!booking) return { ok: false, message: "A foglalás nem található." };

  if (session.user.role !== "ADMIN" && session.user.practitionerId !== booking.practitionerId) {
    return { ok: false, message: "Nincs jogosultságod ehhez a foglaláshoz." };
  }

  await prisma.booking.update({ where: { id: bookingId }, data: { status: "CANCELLED" } });

  await sendBookingCancellationEmail({
    customerEmail: booking.customerEmail,
    customerName: booking.customerName,
    serviceName: booking.service.name,
    startTimeFormatted: formatDateTime(booking.startTime),
  });

  revalidatePath("/admin/foglalasok");
  revalidatePath("/admin");

  return { ok: true, message: "Foglalás lemondva." };
}

export async function adminMarkBookingCompletedAction(bookingId: string) {
  const session = await requireStaff();

  const booking = await prisma.booking.findUnique({ where: { id: bookingId } });
  if (!booking) return { ok: false, message: "A foglalás nem található." };

  if (session.user.role !== "ADMIN" && session.user.practitionerId !== booking.practitionerId) {
    return { ok: false, message: "Nincs jogosultságod ehhez a foglaláshoz." };
  }

  await prisma.booking.update({ where: { id: bookingId }, data: { status: "COMPLETED" } });

  revalidatePath("/admin/foglalasok");

  return { ok: true, message: "Foglalás lezajlottra jelölve." };
}
