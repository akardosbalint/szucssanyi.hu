import { addMinutes, isBefore } from "date-fns";
import { fromZonedTime, toZonedTime } from "date-fns-tz";
import { prisma } from "@/lib/prisma";

export const TIME_ZONE = "Europe/Budapest";

// Stripe Checkout Session-nek legalább 30 perc lejárati idő kell — a
// foglalás-hold ezzel van szinkronban, hogy ne fordulhasson elő, hogy a
// Stripe session még élne, miközben a helyünket már felszabadítottuk.
export const HOLD_DURATION_MINUTES = 30;
export const CANCELLATION_CUTOFF_HOURS = 24;
const SLOT_INTERVAL_MINUTES = 30;

/** "2026-07-15" + "09:00" (Europe/Budapest) -> a megfelelő UTC időpont. */
function zonedDateTime(dateKey: string, timeStr: string): Date {
  return fromZonedTime(`${dateKey}T${timeStr}:00`, TIME_ZONE);
}

function dateKeyInZone(date: Date): string {
  const zoned = toZonedTime(date, TIME_ZONE);
  const y = zoned.getFullYear();
  const m = String(zoned.getMonth() + 1).padStart(2, "0");
  const d = String(zoned.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

function weekdayInZone(date: Date): number {
  return toZonedTime(date, TIME_ZONE).getDay();
}

/** Lejárt "fizetésre vár" foglalásokat/jelentkezéseket lemond státuszra vált, hogy a helyük felszabaduljon. */
export async function releaseExpiredHolds() {
  const now = new Date();
  await prisma.booking.updateMany({
    where: { status: "PENDING_PAYMENT", holdExpiresAt: { lt: now } },
    data: { status: "CANCELLED" },
  });
  await prisma.eventRegistration.updateMany({
    where: { status: "PENDING_PAYMENT", holdExpiresAt: { lt: now } },
    data: { status: "CANCELLED" },
  });
}

export async function getAvailableSlots(params: {
  practitionerId: string;
  serviceDurationMinutes: number;
  rangeStart: Date;
  rangeEnd: Date;
}): Promise<Date[]> {
  await releaseExpiredHolds();

  const { practitionerId, serviceDurationMinutes, rangeStart, rangeEnd } = params;

  const [rules, exceptions, busyBookings] = await Promise.all([
    prisma.availabilityRule.findMany({ where: { practitionerId } }),
    prisma.availabilityException.findMany({
      where: { practitionerId, date: { gte: rangeStart, lte: rangeEnd } },
    }),
    prisma.booking.findMany({
      where: {
        practitionerId,
        status: { in: ["PENDING_PAYMENT", "CONFIRMED"] },
        startTime: { lt: rangeEnd },
        endTime: { gt: rangeStart },
      },
      select: { startTime: true, endTime: true },
    }),
  ]);

  const exceptionsByDate = new Map(exceptions.map((e) => [dateKeyInZone(e.date), e]));
  const slots: Date[] = [];
  const now = new Date();

  for (
    let cursor = new Date(rangeStart);
    isBefore(cursor, rangeEnd);
    cursor = addMinutes(cursor, 24 * 60)
  ) {
    const dateKey = dateKeyInZone(cursor);
    const weekday = weekdayInZone(cursor);
    const exception = exceptionsByDate.get(dateKey);

    let windows: { start: string; end: string }[] = [];

    if (exception?.type === "CLOSED") {
      windows = [];
    } else if (exception?.type === "CUSTOM_HOURS" && exception.startTime && exception.endTime) {
      windows = [{ start: exception.startTime, end: exception.endTime }];
    } else {
      windows = rules
        .filter((r) => r.weekday === weekday)
        .map((r) => ({ start: r.startTime, end: r.endTime }));
    }

    for (const window of windows) {
      const windowStart = zonedDateTime(dateKey, window.start);
      const windowEnd = zonedDateTime(dateKey, window.end);

      for (
        let slotStart = windowStart;
        isBefore(addMinutes(slotStart, serviceDurationMinutes), addMinutes(windowEnd, 1));
        slotStart = addMinutes(slotStart, SLOT_INTERVAL_MINUTES)
      ) {
        const slotEnd = addMinutes(slotStart, serviceDurationMinutes);
        if (!isBefore(now, slotStart)) continue; // ne ajánljunk múltbeli időpontot

        const overlaps = busyBookings.some(
          (b) => isBefore(b.startTime, slotEnd) && isBefore(slotStart, b.endTime),
        );
        if (!overlaps) slots.push(slotStart);
      }
    }
  }

  return slots;
}

export async function isSlotStillFree(params: {
  practitionerId: string;
  start: Date;
  end: Date;
}) {
  await releaseExpiredHolds();

  const conflict = await prisma.booking.findFirst({
    where: {
      practitionerId: params.practitionerId,
      status: { in: ["PENDING_PAYMENT", "CONFIRMED"] },
      startTime: { lt: params.end },
      endTime: { gt: params.start },
    },
  });

  return !conflict;
}
