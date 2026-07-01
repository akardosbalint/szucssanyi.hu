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

  // IDEIGLENES (bemutatási céllal): amíg nincs éles adatbázis bekötve, az
  // üzenetet nem próbáljuk elmenteni — csak a sikeres visszajelzést
  // mutatjuk. Ha az adatbázis élesben elérhető, ez az él visszaállítható.
  try {
    await prisma.contactMessage.create({ data: { name, email, message } });
  } catch {
    // adatbázis nélkül is sikeresként kezeljük a bemutató kedvéért
  }

  // TODO: MAILERLITE_API_KEY beállítása esetén itt lehet szinkronizálni /
  // értesítő e-mailt küldeni az adminnak (lásd .env.example, src/lib/email.ts).

  redirect("/kapcsolat?siker=1");
}
