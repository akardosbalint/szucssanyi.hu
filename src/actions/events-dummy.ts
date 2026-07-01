"use server";

// IDEIGLENES: amíg nincs éles adatbázis/Stripe, a csoportos családállítás
// jelentkezés ezt az action-t hívja a valós `registerForEventAction`
// helyett — nem hoz létre adatbázis-rekordot és nem indít Stripe
// fizetést, csak egy "sikeres" visszaigazoló oldalra irányít bemutatási
// céllal.

import { redirect } from "next/navigation";
import { z } from "zod";
import { getDummyEventBySlug } from "@/lib/dummy-events";
import { formatDateTime } from "@/lib/format";

const dummyEventRegistrationSchema = z.object({
  eventSlug: z.string().min(1),
  customerName: z.string().min(2),
  customerEmail: z.email(),
  customerPhone: z.string().min(6),
});

export async function registerForDummyEventAction(formData: FormData) {
  const parsed = dummyEventRegistrationSchema.safeParse({
    eventSlug: formData.get("eventSlug"),
    customerName: formData.get("customerName"),
    customerEmail: formData.get("customerEmail"),
    customerPhone: formData.get("customerPhone"),
  });

  if (!parsed.success) {
    redirect(`/csoportos-csaladallitas?hiba=ervenytelen-adat`);
  }

  const { eventSlug, customerName } = parsed.data;
  const event = getDummyEventBySlug(eventSlug);

  if (!event) {
    redirect(`/csoportos-csaladallitas?hiba=nem-talalhato`);
  }

  const params = new URLSearchParams({
    dummy: "1",
    nev: customerName,
    esemeny: event!.title,
    idopont: formatDateTime(event!.startTime),
    helyszin: event!.location,
  });

  redirect(`/csoportos-csaladallitas/koszonjuk?${params.toString()}`);
}
