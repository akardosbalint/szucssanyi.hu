"use server";

// IDEIGLENES: amíg nincs éles adatbázis/Stripe, a publikus foglalási
// wizard ezt az action-t hívja a valós `createBookingAction` helyett —
// nem hoz létre adatbázis-rekordot és nem indít Stripe fizetést, csak
// egy "sikeres" visszaigazoló oldalra irányít bemutatási céllal.

import { redirect } from "next/navigation";
import { z } from "zod";
import { getDummyPractitionerBySlug, getDummyServiceById } from "@/lib/dummy-practitioners";

const dateFormatter = new Intl.DateTimeFormat("hu-HU", {
  timeZone: "Europe/Budapest",
  year: "numeric",
  month: "long",
  day: "numeric",
});

function formatDummyStartTime(value: string) {
  // "2026-07-02 10:00" -> "2026. július 2. 10:00"
  const [datePart, timePart] = value.split(" ");
  const [y, m, d] = datePart.split("-").map(Number);
  const formattedDate = dateFormatter.format(new Date(y, m - 1, d));
  return `${formattedDate} ${timePart}`;
}

const dummyBookingSchema = z.object({
  practitionerSlug: z.string().min(1),
  serviceId: z.string().min(1),
  startTime: z.string().min(1),
  customerName: z.string().min(2),
  customerEmail: z.email(),
  customerPhone: z.string().min(6),
});

export async function createDummyBookingAction(formData: FormData) {
  const parsed = dummyBookingSchema.safeParse({
    practitionerSlug: formData.get("practitionerSlug"),
    serviceId: formData.get("serviceId"),
    startTime: formData.get("startTime"),
    customerName: formData.get("customerName"),
    customerEmail: formData.get("customerEmail"),
    customerPhone: formData.get("customerPhone"),
  });

  if (!parsed.success) {
    redirect(`/konzultacio?hiba=ervenytelen-adat`);
  }

  const { practitionerSlug, serviceId, startTime, customerName } = parsed.data;

  const practitioner = getDummyPractitionerBySlug(practitionerSlug);
  const service = practitioner ? getDummyServiceById(practitioner, serviceId) : null;

  if (!practitioner || !service) {
    redirect(`/konzultacio?hiba=nem-talalhato`);
  }

  const params = new URLSearchParams({
    dummy: "1",
    nev: customerName,
    szakember: practitioner!.name,
    szolgaltatas: service!.name,
    idopont: formatDummyStartTime(startTime),
  });

  redirect(`/konzultacio/koszonjuk?${params.toString()}`);
}
