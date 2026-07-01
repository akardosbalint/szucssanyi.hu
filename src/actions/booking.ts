"use server";

import { redirect } from "next/navigation";
import { addMinutes } from "date-fns";
import { prisma } from "@/lib/prisma";
import { generateToken } from "@/lib/tokens";
import {
  getAvailableSlots,
  isSlotStillFree,
  HOLD_DURATION_MINUTES,
  CANCELLATION_CUTOFF_HOURS,
} from "@/lib/booking";
import { bookingDetailsSchema } from "@/lib/validations/booking";
import { createBookingCheckoutSession, isStripeConfigured } from "@/lib/stripe";

export async function getSlotsForDayAction(input: {
  practitionerId: string;
  serviceId: string;
  dateKey: string; // "2026-07-15"
}) {
  const service = await prisma.service.findUnique({ where: { id: input.serviceId } });
  if (!service || service.practitionerId !== input.practitionerId) return [];

  const rangeStart = new Date(`${input.dateKey}T00:00:00.000Z`);
  const rangeEnd = addMinutes(rangeStart, 24 * 60);

  const slots = await getAvailableSlots({
    practitionerId: input.practitionerId,
    serviceDurationMinutes: service.durationMinutes,
    rangeStart,
    rangeEnd,
  });

  return slots.map((s) => s.toISOString());
}

export async function createBookingAction(formData: FormData) {
  const parsed = bookingDetailsSchema.safeParse({
    practitionerId: formData.get("practitionerId"),
    serviceId: formData.get("serviceId"),
    startTime: formData.get("startTime"),
    customerName: formData.get("customerName"),
    customerEmail: formData.get("customerEmail"),
    customerPhone: formData.get("customerPhone"),
    note: formData.get("note") || undefined,
  });

  if (!parsed.success) {
    redirect(`/konzultacio?hiba=ervenytelen-adat`);
  }

  const { practitionerId, serviceId, startTime, customerName, customerEmail, customerPhone, note } =
    parsed.data;

  const [practitioner, service] = await Promise.all([
    prisma.practitioner.findUnique({ where: { id: practitionerId } }),
    prisma.service.findUnique({ where: { id: serviceId } }),
  ]);

  if (!practitioner || !service || service.practitionerId !== practitionerId) {
    redirect(`/konzultacio?hiba=nem-talalhato`);
  }

  const start = new Date(startTime);
  const end = new Date(start.getTime() + service!.durationMinutes * 60_000);

  if (!isStripeConfigured()) {
    redirect(
      `/konzultacio/foglalas/${practitioner!.slug}?fizetes=nem-elerheto&szolgaltatas=${service!.id}`,
    );
  }

  const stillFree = await isSlotStillFree({ practitionerId: practitionerId!, start, end });
  if (!stillFree) {
    redirect(
      `/konzultacio/foglalas/${practitioner!.slug}?hiba=idopont-mar-foglalt&szolgaltatas=${service!.id}`,
    );
  }

  const booking = await prisma.booking.create({
    data: {
      practitionerId: practitionerId!,
      serviceId: serviceId!,
      customerName,
      customerEmail,
      customerPhone,
      note,
      startTime: start,
      endTime: end,
      status: "PENDING_PAYMENT",
      holdExpiresAt: addMinutes(new Date(), HOLD_DURATION_MINUTES),
      manageToken: generateToken(),
    },
  });

  const checkoutUrl = await createBookingCheckoutSession({
    bookingId: booking.id,
    serviceName: `${service!.name} — ${practitioner!.name}`,
    priceHUF: service!.priceHUF,
    customerEmail,
  });

  redirect(checkoutUrl);
}

export async function cancelBookingAction(manageToken: string) {
  const booking = await prisma.booking.findUnique({ where: { manageToken } });
  if (!booking) return { ok: false, message: "A foglalás nem található." };
  if (booking.status === "CANCELLED") return { ok: false, message: "A foglalás már le van mondva." };
  if (booking.status === "COMPLETED") return { ok: false, message: "A foglalás már lezajlott." };

  const cutoff = new Date(booking.startTime.getTime() - CANCELLATION_CUTOFF_HOURS * 60 * 60 * 1000);
  if (new Date() > cutoff) {
    return {
      ok: false,
      message: `Az időpont előtt ${CANCELLATION_CUTOFF_HOURS} órával már nem lehet önállóan lemondani — vedd fel velünk a kapcsolatot.`,
    };
  }

  await prisma.booking.update({ where: { id: booking.id }, data: { status: "CANCELLED" } });

  // TODO (Fázis 6): lemondás e-mail értesítés kiküldése a kliensnek és a szakembernek.

  return { ok: true, message: "A foglalásod sikeresen lemondva." };
}
