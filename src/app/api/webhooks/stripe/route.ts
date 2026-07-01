import { NextResponse } from "next/server";
import Stripe from "stripe";
import { prisma } from "@/lib/prisma";
import { getStripeClient, isStripeConfigured } from "@/lib/stripe";
import { formatDateTime } from "@/lib/format";
import {
  sendBookingConfirmationEmail,
  sendPractitionerNewBookingEmail,
  sendEventRegistrationConfirmationEmail,
  sendCoursePurchaseEmail,
} from "@/lib/email";

export const runtime = "nodejs";

const siteUrl = () => process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

async function markPaymentSucceeded(session: Stripe.Checkout.Session) {
  const payment = await prisma.payment.findUnique({ where: { stripeCheckoutSessionId: session.id } });
  if (!payment) return;

  await prisma.payment.update({
    where: { id: payment.id },
    data: {
      status: "SUCCEEDED",
      stripePaymentIntentId:
        typeof session.payment_intent === "string" ? session.payment_intent : session.payment_intent?.id,
    },
  });

  const kind = session.metadata?.kind;

  if (kind === "booking" && payment.bookingId) {
    const booking = await prisma.booking.update({
      where: { id: payment.bookingId },
      data: { status: "CONFIRMED" },
      include: { practitioner: { include: { user: true } }, service: true },
    });

    await sendBookingConfirmationEmail({
      customerEmail: booking.customerEmail,
      customerName: booking.customerName,
      practitionerName: booking.practitioner.name,
      serviceName: booking.service.name,
      startTimeFormatted: formatDateTime(booking.startTime),
      manageUrl: `${siteUrl()}/foglalas/${booking.manageToken}`,
    });

    if (booking.practitioner.user?.email) {
      await sendPractitionerNewBookingEmail({
        practitionerEmail: booking.practitioner.user.email,
        customerName: booking.customerName,
        serviceName: booking.service.name,
        startTimeFormatted: formatDateTime(booking.startTime),
      });
    }
  } else if (kind === "event_registration" && payment.eventRegistrationId) {
    const registration = await prisma.eventRegistration.update({
      where: { id: payment.eventRegistrationId },
      data: { status: "CONFIRMED" },
      include: { event: true },
    });

    await sendEventRegistrationConfirmationEmail({
      customerEmail: registration.customerEmail,
      customerName: registration.customerName,
      eventTitle: registration.event.title,
      startTimeFormatted: formatDateTime(registration.event.startTime),
      location: registration.event.location,
      manageUrl: `${siteUrl()}/csoportos-csaladallitas/kezeles/${registration.manageToken}`,
    });
  } else if (kind === "course_purchase" && payment.coursePurchaseId) {
    const purchase = await prisma.coursePurchase.update({
      where: { id: payment.coursePurchaseId },
      data: { status: "CONFIRMED" },
      include: { course: true },
    });

    await sendCoursePurchaseEmail({
      customerEmail: purchase.customerEmail,
      customerName: purchase.customerName,
      courseTitle: purchase.course.title,
      accessUrl: `${siteUrl()}/kurzusok/hozzaferes/${purchase.accessToken}`,
    });
  }
}

async function markPaymentExpiredOrFailed(session: Stripe.Checkout.Session) {
  const payment = await prisma.payment.findUnique({ where: { stripeCheckoutSessionId: session.id } });
  if (!payment) return;

  await prisma.payment.update({ where: { id: payment.id }, data: { status: "FAILED" } });

  if (payment.bookingId) {
    await prisma.booking.updateMany({
      where: { id: payment.bookingId, status: "PENDING_PAYMENT" },
      data: { status: "CANCELLED" },
    });
  } else if (payment.eventRegistrationId) {
    await prisma.eventRegistration.updateMany({
      where: { id: payment.eventRegistrationId, status: "PENDING_PAYMENT" },
      data: { status: "CANCELLED" },
    });
  } else if (payment.coursePurchaseId) {
    await prisma.coursePurchase.updateMany({
      where: { id: payment.coursePurchaseId, status: "PENDING_PAYMENT" },
      data: { status: "CANCELLED" },
    });
  }
}

async function markPaymentRefunded(charge: Stripe.Charge) {
  const paymentIntentId =
    typeof charge.payment_intent === "string" ? charge.payment_intent : charge.payment_intent?.id;
  if (!paymentIntentId) return;

  await prisma.payment.updateMany({
    where: { stripePaymentIntentId: paymentIntentId },
    data: { status: "REFUNDED" },
  });
}

export async function POST(request: Request) {
  if (!isStripeConfigured() || !process.env.STRIPE_WEBHOOK_SECRET) {
    return NextResponse.json({ error: "Stripe nincs konfigurálva." }, { status: 503 });
  }

  const signature = request.headers.get("stripe-signature");
  if (!signature) {
    return NextResponse.json({ error: "Hiányzó Stripe aláírás." }, { status: 400 });
  }

  const rawBody = await request.text();
  const stripe = getStripeClient();

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(rawBody, signature, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Ismeretlen hiba.";
    return NextResponse.json({ error: `Webhook aláírás ellenőrzés sikertelen: ${message}` }, { status: 400 });
  }

  switch (event.type) {
    case "checkout.session.completed":
      await markPaymentSucceeded(event.data.object as Stripe.Checkout.Session);
      break;
    case "checkout.session.expired":
      await markPaymentExpiredOrFailed(event.data.object as Stripe.Checkout.Session);
      break;
    case "charge.refunded":
      await markPaymentRefunded(event.data.object as Stripe.Charge);
      break;
    default:
      break;
  }

  return NextResponse.json({ received: true });
}
