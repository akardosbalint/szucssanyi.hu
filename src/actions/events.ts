"use server";

import { redirect } from "next/navigation";
import { addMinutes } from "date-fns";
import { prisma } from "@/lib/prisma";
import { generateToken } from "@/lib/tokens";
import { getEventSpotsLeft } from "@/lib/events";
import { HOLD_DURATION_MINUTES, CANCELLATION_CUTOFF_HOURS } from "@/lib/booking";
import { eventRegistrationSchema } from "@/lib/validations/event-registration";
import { createEventRegistrationCheckoutSession, isStripeConfigured } from "@/lib/stripe";
import { sendEventRegistrationCancellationEmail } from "@/lib/email";
import { formatDateTime } from "@/lib/format";

export async function registerForEventAction(formData: FormData) {
  const parsed = eventRegistrationSchema.safeParse({
    eventId: formData.get("eventId"),
    customerName: formData.get("customerName"),
    customerEmail: formData.get("customerEmail"),
    customerPhone: formData.get("customerPhone"),
    note: formData.get("note") || undefined,
  });

  if (!parsed.success) {
    redirect(`/csoportos-csaladallitas?hiba=ervenytelen-adat`);
  }

  const { eventId, customerName, customerEmail, customerPhone, note } = parsed.data;

  const event = await prisma.event.findUnique({ where: { id: eventId } });
  if (!event || !event.active) {
    redirect(`/csoportos-csaladallitas?hiba=nem-talalhato`);
  }

  if (!isStripeConfigured()) {
    redirect(`/csoportos-csaladallitas?fizetes=nem-elerheto`);
  }

  const spotsLeft = await getEventSpotsLeft(eventId!);
  if (spotsLeft <= 0) {
    redirect(`/csoportos-csaladallitas?hiba=betelt`);
  }

  const registration = await prisma.eventRegistration.create({
    data: {
      eventId: eventId!,
      customerName,
      customerEmail,
      customerPhone,
      note,
      status: "PENDING_PAYMENT",
      holdExpiresAt: addMinutes(new Date(), HOLD_DURATION_MINUTES),
      manageToken: generateToken(),
    },
  });

  const checkoutUrl = await createEventRegistrationCheckoutSession({
    eventRegistrationId: registration.id,
    eventTitle: event!.title,
    priceHUF: event!.priceHUF,
    customerEmail,
  });

  redirect(checkoutUrl);
}

export async function cancelEventRegistrationAction(manageToken: string) {
  const registration = await prisma.eventRegistration.findUnique({
    where: { manageToken },
    include: { event: true },
  });
  if (!registration) return { ok: false, message: "A jelentkezés nem található." };
  if (registration.status === "CANCELLED")
    return { ok: false, message: "A jelentkezés már le van mondva." };
  if (registration.status === "COMPLETED")
    return { ok: false, message: "Az esemény már lezajlott." };

  const cutoff = new Date(
    registration.event.startTime.getTime() - CANCELLATION_CUTOFF_HOURS * 60 * 60 * 1000,
  );
  if (new Date() > cutoff) {
    return {
      ok: false,
      message: `Az esemény előtt ${CANCELLATION_CUTOFF_HOURS} órával már nem lehet önállóan lemondani — vedd fel velünk a kapcsolatot.`,
    };
  }

  await prisma.eventRegistration.update({
    where: { id: registration.id },
    data: { status: "CANCELLED" },
  });

  await sendEventRegistrationCancellationEmail({
    customerEmail: registration.customerEmail,
    customerName: registration.customerName,
    eventTitle: registration.event.title,
    startTimeFormatted: formatDateTime(registration.event.startTime),
  });

  return { ok: true, message: "A jelentkezésed sikeresen lemondva." };
}
