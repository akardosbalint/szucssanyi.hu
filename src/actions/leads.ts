"use server";

import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { leadSubscribeSchema } from "@/lib/validations/lead";

export async function subscribeLeadAction(formData: FormData) {
  const parsed = leadSubscribeSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
  });

  if (!parsed.success) {
    redirect("/ingyenes-meditacio?hiba=ervenytelen-adat");
  }

  const { name, email } = parsed.data;

  await prisma.leadSubscriber.upsert({
    where: { email: email.toLowerCase().trim() },
    update: { name },
    create: { name, email: email.toLowerCase().trim(), source: "ingyenes_meditacio" },
  });

  // TODO: ha lesz MAILERLITE_API_KEY, itt szinkronizáljuk a feliratkozót
  // a MailerLite listájával, és onnan megy ki az automatikus e-mail a
  // meditációval. Egyelőre a feliratkozás a saját adatbázisban tárolódik.

  redirect("/ingyenes-meditacio/koszonjuk");
}
