"use server";

// IDEIGLENES: amíg nincs éles adatbázis/Stripe, a publikus kurzus-vásárlás
// ezt az action-t hívja a valós `purchaseCourseAction` helyett — nem hoz
// létre adatbázis-rekordot és nem indít Stripe fizetést, csak egy
// "sikeres" visszaigazoló + hozzáférési oldalra irányít bemutatási céllal.

import { redirect } from "next/navigation";
import { z } from "zod";
import { getDummyCourseBySlug } from "@/lib/dummy-courses";

const dummyCoursePurchaseSchema = z.object({
  courseSlug: z.string().min(1),
  customerName: z.string().min(2),
  customerEmail: z.email(),
});

export async function purchaseDummyCourseAction(formData: FormData) {
  const parsed = dummyCoursePurchaseSchema.safeParse({
    courseSlug: formData.get("courseSlug"),
    customerName: formData.get("customerName"),
    customerEmail: formData.get("customerEmail"),
  });

  if (!parsed.success) {
    redirect(`/kurzusok?hiba=ervenytelen-adat`);
  }

  const { courseSlug, customerName } = parsed.data;
  const course = getDummyCourseBySlug(courseSlug);

  if (!course) {
    redirect(`/kurzusok?hiba=nem-talalhato`);
  }

  const params = new URLSearchParams({
    dummy: "1",
    kurzus: course!.slug,
    cim: course!.title,
    nev: customerName,
  });

  redirect(`/kurzusok/koszonjuk?${params.toString()}`);
}
