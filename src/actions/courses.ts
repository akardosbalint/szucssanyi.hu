"use server";

import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { generateToken } from "@/lib/tokens";
import { coursePurchaseSchema } from "@/lib/validations/course-purchase";
import { createCourseCheckoutSession, isStripeConfigured } from "@/lib/stripe";

export async function purchaseCourseAction(formData: FormData) {
  const parsed = coursePurchaseSchema.safeParse({
    courseId: formData.get("courseId"),
    customerName: formData.get("customerName"),
    customerEmail: formData.get("customerEmail"),
  });

  if (!parsed.success) {
    redirect(`/kurzusok?hiba=ervenytelen-adat`);
  }

  const { courseId, customerName, customerEmail } = parsed.data;

  const course = await prisma.course.findUnique({ where: { id: courseId } });
  if (!course || !course.active) {
    redirect(`/kurzusok?hiba=nem-talalhato`);
  }

  if (!isStripeConfigured()) {
    // Stripe kulcsok még nincsenek beállítva (lásd .env.example) — a
    // vásárlást nem hozzuk létre hamis fizetéssel, hanem jelezzük.
    redirect(`/kurzusok/${course!.slug}?fizetes=nem-elerheto`);
  }

  const coursePurchase = await prisma.coursePurchase.create({
    data: {
      courseId: course!.id,
      customerName,
      customerEmail,
      accessToken: generateToken(),
    },
  });

  const checkoutUrl = await createCourseCheckoutSession({
    coursePurchaseId: coursePurchase.id,
    courseTitle: course!.title,
    priceHUF: course!.priceHUF,
    customerEmail,
  });

  redirect(checkoutUrl);
}
