import Stripe from "stripe";

let stripeClient: Stripe | null = null;

export function isStripeConfigured() {
  return Boolean(process.env.STRIPE_SECRET_KEY);
}

function getStripe(): Stripe {
  if (!process.env.STRIPE_SECRET_KEY) {
    throw new Error(
      "STRIPE_SECRET_KEY nincs beállítva — lásd .env.example. Élesítés előtt pótlandó.",
    );
  }
  if (!stripeClient) {
    stripeClient = new Stripe(process.env.STRIPE_SECRET_KEY);
  }
  return stripeClient;
}

const siteUrl = () => process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

export async function createCourseCheckoutSession(params: {
  coursePurchaseId: string;
  courseTitle: string;
  priceHUF: number;
  customerEmail: string;
}) {
  const stripe = getStripe();

  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    customer_email: params.customerEmail,
    line_items: [
      {
        quantity: 1,
        price_data: {
          currency: "huf",
          unit_amount: params.priceHUF,
          product_data: { name: params.courseTitle },
        },
      },
    ],
    metadata: {
      kind: "course_purchase",
      coursePurchaseId: params.coursePurchaseId,
    },
    success_url: `${siteUrl()}/kurzusok/koszonjuk?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${siteUrl()}/kurzusok`,
    expires_at: Math.floor(Date.now() / 1000) + 30 * 60,
  });

  await import("@/lib/prisma").then(({ prisma }) =>
    prisma.payment.create({
      data: {
        stripeCheckoutSessionId: session.id,
        amountHUF: params.priceHUF,
        coursePurchaseId: params.coursePurchaseId,
      },
    }),
  );

  if (!session.url) {
    throw new Error("Stripe nem adott vissza checkout URL-t.");
  }

  return session.url;
}

export async function createBookingCheckoutSession(params: {
  bookingId: string;
  serviceName: string;
  priceHUF: number;
  customerEmail: string;
}) {
  const stripe = getStripe();

  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    customer_email: params.customerEmail,
    line_items: [
      {
        quantity: 1,
        price_data: {
          currency: "huf",
          unit_amount: params.priceHUF,
          product_data: { name: params.serviceName },
        },
      },
    ],
    metadata: {
      kind: "booking",
      bookingId: params.bookingId,
    },
    success_url: `${siteUrl()}/konzultacio/koszonjuk?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${siteUrl()}/konzultacio`,
    expires_at: Math.floor(Date.now() / 1000) + 32 * 60, // Stripe minimum: 30 perc
  });

  const { prisma } = await import("@/lib/prisma");
  await prisma.payment.create({
    data: {
      stripeCheckoutSessionId: session.id,
      amountHUF: params.priceHUF,
      bookingId: params.bookingId,
    },
  });

  if (!session.url) {
    throw new Error("Stripe nem adott vissza checkout URL-t.");
  }

  return session.url;
}

export async function createEventRegistrationCheckoutSession(params: {
  eventRegistrationId: string;
  eventTitle: string;
  priceHUF: number;
  customerEmail: string;
}) {
  const stripe = getStripe();

  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    customer_email: params.customerEmail,
    line_items: [
      {
        quantity: 1,
        price_data: {
          currency: "huf",
          unit_amount: params.priceHUF,
          product_data: { name: params.eventTitle },
        },
      },
    ],
    metadata: {
      kind: "event_registration",
      eventRegistrationId: params.eventRegistrationId,
    },
    success_url: `${siteUrl()}/csoportos-csaladallitas/koszonjuk?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${siteUrl()}/csoportos-csaladallitas`,
    expires_at: Math.floor(Date.now() / 1000) + 32 * 60, // Stripe minimum: 30 perc
  });

  const { prisma } = await import("@/lib/prisma");
  await prisma.payment.create({
    data: {
      stripeCheckoutSessionId: session.id,
      amountHUF: params.priceHUF,
      eventRegistrationId: params.eventRegistrationId,
    },
  });

  if (!session.url) {
    throw new Error("Stripe nem adott vissza checkout URL-t.");
  }

  return session.url;
}

export function getStripeClient() {
  return getStripe();
}
