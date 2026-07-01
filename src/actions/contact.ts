"use server";

import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { contactMessageSchema } from "@/lib/validations/contact";

export async function sendContactMessageAction(formData: FormData) {
  const parsed = contactMessageSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    message: formData.get("message"),
  });

  if (!parsed.success) {
    redirect("/kapcsolat?hiba=ervenytelen-adat");
  }

  const { name, email, message } = parsed.data;

  await prisma.contactMessage.create({ data: { name, email, message } });

  // TODO: MAILERLITE_API_KEY beállítása esetén itt lehet szinkronizálni /
  // értesítő e-mailt küldeni az adminnak (lásd .env.example, src/lib/email.ts).

  redirect("/kapcsolat?siker=1");
}
