"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin-guard";

/**
 * GDPR törlési kérelem teljesítése: a személyes adatokat (név, e-mail,
 * telefon) anonimizáljuk a foglalás/jelentkezés/vásárlás rekordokon (a
 * számviteli/audit adat marad, de személyazonosításra alkalmatlanná válik),
 * a lead/kapcsolat üzeneteket pedig teljesen töröljük.
 */
export async function anonymizeCustomerAction(email: string) {
  await requireAdmin();
  const normalizedEmail = email.toLowerCase();
  const anonymizedEmail = `torolt-${Date.now()}@anonim.szucssanyi.hu`;

  await prisma.$transaction([
    prisma.booking.updateMany({
      where: { customerEmail: normalizedEmail },
      data: { customerName: "Törölt ügyfél", customerEmail: anonymizedEmail, customerPhone: "törölve", note: null },
    }),
    prisma.eventRegistration.updateMany({
      where: { customerEmail: normalizedEmail },
      data: { customerName: "Törölt ügyfél", customerEmail: anonymizedEmail, customerPhone: "törölve", note: null },
    }),
    prisma.coursePurchase.updateMany({
      where: { customerEmail: normalizedEmail },
      data: { customerName: "Törölt ügyfél", customerEmail: anonymizedEmail },
    }),
    prisma.leadSubscriber.deleteMany({ where: { email: normalizedEmail } }),
    prisma.contactMessage.deleteMany({ where: { email: normalizedEmail } }),
  ]);

  revalidatePath("/admin/ugyfelek");
  return { ok: true, message: "Az ügyfél adatai anonimizálva/törölve lettek." };
}
