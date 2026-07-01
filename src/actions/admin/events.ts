"use server";

import { revalidatePath } from "next/cache";
import { fromZonedTime } from "date-fns-tz";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin-guard";
import { TIME_ZONE } from "@/lib/booking";
import { eventSchema } from "@/lib/validations/admin-event";

export async function createEventAction(formData: FormData) {
  await requireAdmin();

  const parsed = eventSchema.safeParse({
    title: formData.get("title"),
    slug: formData.get("slug"),
    description: formData.get("description"),
    location: formData.get("location"),
    startTime: formData.get("startTime"),
    endTime: formData.get("endTime"),
    capacity: formData.get("capacity"),
    priceHUF: formData.get("priceHUF"),
  });
  if (!parsed.success) return { ok: false, message: "Kérlek, ellenőrizd az adatokat." };

  await prisma.event.create({
    data: {
      ...parsed.data,
      startTime: fromZonedTime(parsed.data.startTime, TIME_ZONE),
      endTime: fromZonedTime(parsed.data.endTime, TIME_ZONE),
    },
  });

  revalidatePath("/admin/esemenyek");
  revalidatePath("/csoportos-csaladallitas");
  return { ok: true, message: "Esemény létrehozva." };
}

export async function toggleEventActiveAction(eventId: string) {
  await requireAdmin();
  const event = await prisma.event.findUniqueOrThrow({ where: { id: eventId } });
  await prisma.event.update({ where: { id: eventId }, data: { active: !event.active } });
  revalidatePath("/admin/esemenyek");
  revalidatePath("/csoportos-csaladallitas");
}

export async function cancelEventRegistrationAdminAction(registrationId: string) {
  await requireAdmin();
  await prisma.eventRegistration.update({
    where: { id: registrationId },
    data: { status: "CANCELLED" },
  });
  revalidatePath("/admin/esemenyek");
}
