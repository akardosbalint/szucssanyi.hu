"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { requireAdmin, requireStaff } from "@/lib/admin-guard";
import {
  practitionerSchema,
  serviceSchema,
  availabilityRuleSchema,
  availabilityExceptionSchema,
} from "@/lib/validations/admin-practitioner";

export async function createPractitionerAction(formData: FormData) {
  await requireAdmin();

  const parsed = practitionerSchema.safeParse({
    name: formData.get("name"),
    slug: formData.get("slug"),
    title: formData.get("title") || undefined,
    bio: formData.get("bio"),
    photoUrl: formData.get("photoUrl") || undefined,
  });
  if (!parsed.success) redirect("/admin/szakemberek?hiba=ervenytelen-adat");

  const count = await prisma.practitioner.count();
  await prisma.practitioner.create({ data: { ...parsed.data, order: count } });

  revalidatePath("/admin/szakemberek");
  revalidatePath("/konzultacio");
  redirect("/admin/szakemberek");
}

export async function updatePractitionerAction(practitionerId: string, formData: FormData) {
  await requireAdmin();

  const parsed = practitionerSchema.safeParse({
    name: formData.get("name"),
    slug: formData.get("slug"),
    title: formData.get("title") || undefined,
    bio: formData.get("bio"),
    photoUrl: formData.get("photoUrl") || undefined,
  });
  if (!parsed.success) return { ok: false, message: "Kérlek, ellenőrizd az adatokat." };

  await prisma.practitioner.update({ where: { id: practitionerId }, data: parsed.data });

  revalidatePath("/admin/szakemberek");
  revalidatePath("/konzultacio");
  return { ok: true, message: "Mentve." };
}

export async function togglePractitionerActiveAction(practitionerId: string) {
  await requireAdmin();
  const practitioner = await prisma.practitioner.findUniqueOrThrow({ where: { id: practitionerId } });
  await prisma.practitioner.update({
    where: { id: practitionerId },
    data: { active: !practitioner.active },
  });
  revalidatePath("/admin/szakemberek");
  revalidatePath("/konzultacio");
}

export async function createServiceAction(formData: FormData) {
  const practitionerId = formData.get("practitionerId") as string;
  await assertPractitionerAccess(practitionerId);

  const parsed = serviceSchema.safeParse({
    practitionerId,
    name: formData.get("name"),
    mode: formData.get("mode"),
    durationMinutes: formData.get("durationMinutes"),
    priceHUF: formData.get("priceHUF"),
  });
  if (!parsed.success) return { ok: false, message: "Kérlek, ellenőrizd az adatokat." };

  const count = await prisma.service.count({ where: { practitionerId } });
  await prisma.service.create({ data: { ...parsed.data, order: count } });

  revalidatePath(`/admin/szakemberek/${practitionerId}`);
  revalidatePath("/konzultacio");
  return { ok: true, message: "Szolgáltatás hozzáadva." };
}

export async function toggleServiceActiveAction(serviceId: string) {
  const service = await prisma.service.findUniqueOrThrow({ where: { id: serviceId } });
  await assertPractitionerAccess(service.practitionerId);

  await prisma.service.update({ where: { id: serviceId }, data: { active: !service.active } });
  revalidatePath(`/admin/szakemberek/${service.practitionerId}`);
  revalidatePath("/konzultacio");
}

async function assertPractitionerAccess(practitionerId: string) {
  const session = await requireStaff();
  if (session.user.role !== "ADMIN" && session.user.practitionerId !== practitionerId) {
    throw new Error("Nincs jogosultságod ehhez a szakemberhez.");
  }
  return session;
}

export async function createAvailabilityRuleAction(formData: FormData) {
  const practitionerId = formData.get("practitionerId") as string;
  await assertPractitionerAccess(practitionerId);

  const parsed = availabilityRuleSchema.safeParse({
    practitionerId,
    weekday: formData.get("weekday"),
    startTime: formData.get("startTime"),
    endTime: formData.get("endTime"),
  });
  if (!parsed.success) return { ok: false, message: "Kérlek, ellenőrizd az adatokat." };

  await prisma.availabilityRule.create({ data: parsed.data });
  revalidatePath(`/admin/szakemberek/${practitionerId}/elerhetoseg`);
  return { ok: true, message: "Hozzáadva." };
}

export async function deleteAvailabilityRuleAction(ruleId: string) {
  const rule = await prisma.availabilityRule.findUniqueOrThrow({ where: { id: ruleId } });
  await assertPractitionerAccess(rule.practitionerId);

  await prisma.availabilityRule.delete({ where: { id: ruleId } });
  revalidatePath(`/admin/szakemberek/${rule.practitionerId}/elerhetoseg`);
}

export async function createAvailabilityExceptionAction(formData: FormData) {
  const practitionerId = formData.get("practitionerId") as string;
  await assertPractitionerAccess(practitionerId);

  const parsed = availabilityExceptionSchema.safeParse({
    practitionerId,
    date: formData.get("date"),
    type: formData.get("type"),
    startTime: formData.get("startTime") || undefined,
    endTime: formData.get("endTime") || undefined,
  });
  if (!parsed.success) return { ok: false, message: "Kérlek, ellenőrizd az adatokat." };

  await prisma.availabilityException.upsert({
    where: {
      practitionerId_date: { practitionerId, date: new Date(parsed.data.date) },
    },
    update: {
      type: parsed.data.type,
      startTime: parsed.data.startTime,
      endTime: parsed.data.endTime,
    },
    create: {
      practitionerId,
      date: new Date(parsed.data.date),
      type: parsed.data.type,
      startTime: parsed.data.startTime,
      endTime: parsed.data.endTime,
    },
  });

  revalidatePath(`/admin/szakemberek/${practitionerId}/elerhetoseg`);
  return { ok: true, message: "Kivétel mentve." };
}

export async function deleteAvailabilityExceptionAction(exceptionId: string) {
  const exception = await prisma.availabilityException.findUniqueOrThrow({
    where: { id: exceptionId },
  });
  await assertPractitionerAccess(exception.practitionerId);

  await prisma.availabilityException.delete({ where: { id: exceptionId } });
  revalidatePath(`/admin/szakemberek/${exception.practitionerId}/elerhetoseg`);
}
