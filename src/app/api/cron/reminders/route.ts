import { NextResponse } from "next/server";
import { addHours } from "date-fns";
import { prisma } from "@/lib/prisma";
import { formatDateTime } from "@/lib/format";
import { sendBookingReminderEmail } from "@/lib/email";

export const runtime = "nodejs";

/**
 * Élesben egy külső ütemező (pl. Vercel Cron) hívja óránként:
 * Authorization: Bearer <CRON_SECRET>. Minden CONFIRMED foglalásnak, ami a
 * következő 24-25 órában kezdődik és még nem kapott emlékeztetőt, elküldi
 * az emlékeztető e-mailt, és beállítja a reminderSentAt mezőt (ne menjen ki
 * kétszer).
 */
export async function GET(request: Request) {
  const authHeader = request.headers.get("authorization");
  const expected = `Bearer ${process.env.CRON_SECRET}`;

  if (!process.env.CRON_SECRET || authHeader !== expected) {
    return NextResponse.json({ error: "Jogosulatlan." }, { status: 401 });
  }

  const now = new Date();
  const windowStart = addHours(now, 24);
  const windowEnd = addHours(now, 25);

  const bookings = await prisma.booking.findMany({
    where: {
      status: "CONFIRMED",
      reminderSentAt: null,
      startTime: { gte: windowStart, lte: windowEnd },
    },
    include: { practitioner: true, service: true },
  });

  for (const booking of bookings) {
    await sendBookingReminderEmail({
      customerEmail: booking.customerEmail,
      customerName: booking.customerName,
      practitionerName: booking.practitioner.name,
      serviceName: booking.service.name,
      startTimeFormatted: formatDateTime(booking.startTime),
    });
    await prisma.booking.update({ where: { id: booking.id }, data: { reminderSentAt: now } });
  }

  return NextResponse.json({ ok: true, remindersSent: bookings.length });
}
