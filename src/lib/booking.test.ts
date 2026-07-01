import { afterAll, afterEach, beforeAll, describe, expect, it } from "vitest";
import { addDays, addMinutes, nextMonday, setHours, setMinutes } from "date-fns";
import { prisma } from "@/lib/prisma";
import { getAvailableSlots, isSlotStillFree, releaseExpiredHolds, HOLD_DURATION_MINUTES } from "@/lib/booking";

// A teszt egy jövőbeli hétfőn dolgozik, hogy a "ne ajánljunk múltbeli
// időpontot" szűrő ne zavarja be az eredményt, függetlenül attól, mikor fut a teszt.
const TEST_MONDAY = nextMonday(addDays(new Date(), 7));

function dateKey(d: Date) {
  return d.toISOString().slice(0, 10);
}

describe("booking availability", () => {
  let practitionerId: string;
  const serviceDurationMinutes = 60;

  beforeAll(async () => {
    const practitioner = await prisma.practitioner.create({
      data: {
        slug: `test-${Date.now()}`,
        name: "Teszt Elek",
        bio: "teszt",
        availabilityRules: {
          create: [{ weekday: TEST_MONDAY.getDay(), startTime: "09:00", endTime: "12:00" }],
        },
      },
    });
    practitionerId = practitioner.id;
  });

  afterEach(async () => {
    await prisma.booking.deleteMany({ where: { practitionerId } });
  });

  afterAll(async () => {
    await prisma.availabilityRule.deleteMany({ where: { practitionerId } });
    await prisma.practitioner.delete({ where: { id: practitionerId } });
    await prisma.$disconnect();
  });

  it("returns slots within the recurring availability window", async () => {
    const rangeStart = setMinutes(setHours(TEST_MONDAY, 0), 0);
    const rangeEnd = addDays(rangeStart, 1);

    const slots = await getAvailableSlots({
      practitionerId,
      serviceDurationMinutes,
      rangeStart,
      rangeEnd,
    });

    // 09:00-12:00, 60 perces szolgáltatás, 30 perces léptetéssel: 09:00, 09:30, 10:00, 10:30, 11:00
    expect(slots.length).toBe(5);
  });

  it("excludes slots that overlap a CONFIRMED booking", async () => {
    const rangeStart = setMinutes(setHours(TEST_MONDAY, 0), 0);
    const rangeEnd = addDays(rangeStart, 1);

    const slotsBefore = await getAvailableSlots({
      practitionerId,
      serviceDurationMinutes,
      rangeStart,
      rangeEnd,
    });
    const targetSlot = slotsBefore[0];

    const service = await prisma.service.create({
      data: {
        practitionerId,
        name: "Teszt szolgáltatás",
        mode: "ONLINE",
        durationMinutes: serviceDurationMinutes,
        priceHUF: 10000,
      },
    });

    await prisma.booking.create({
      data: {
        practitionerId,
        serviceId: service.id,
        customerName: "Teszt Ügyfél",
        customerEmail: "test@example.com",
        customerPhone: "+36301234567",
        startTime: targetSlot,
        endTime: addMinutes(targetSlot, serviceDurationMinutes),
        status: "CONFIRMED",
        manageToken: `token-${Date.now()}`,
      },
    });

    const slotsAfter = await getAvailableSlots({
      practitionerId,
      serviceDurationMinutes,
      rangeStart,
      rangeEnd,
    });

    expect(slotsAfter).not.toContainEqual(targetSlot);
    // A 60 perces szolgáltatás miatt az átfedő szomszédos slot (09:30) is
    // kiesik a 09:00-as foglalás mellett, ezért csak azt várjuk, hogy
    // kevesebb legyen az elérhető slotok száma, nem pontosan eggyel.
    expect(slotsAfter.length).toBeLessThan(slotsBefore.length);

    const free = await isSlotStillFree({
      practitionerId,
      start: targetSlot,
      end: addMinutes(targetSlot, serviceDurationMinutes),
    });
    expect(free).toBe(false);
  });

  it("blocks slots held by a not-yet-expired PENDING_PAYMENT booking", async () => {
    const rangeStart = setMinutes(setHours(TEST_MONDAY, 0), 0);
    const rangeEnd = addDays(rangeStart, 1);

    const slotsBefore = await getAvailableSlots({
      practitionerId,
      serviceDurationMinutes,
      rangeStart,
      rangeEnd,
    });
    const targetSlot = slotsBefore[0];

    const service = await prisma.service.create({
      data: {
        practitionerId,
        name: "Teszt szolgáltatás 2",
        mode: "ONLINE",
        durationMinutes: serviceDurationMinutes,
        priceHUF: 10000,
      },
    });

    await prisma.booking.create({
      data: {
        practitionerId,
        serviceId: service.id,
        customerName: "Fizetésre váró ügyfél",
        customerEmail: "pending@example.com",
        customerPhone: "+36301234567",
        startTime: targetSlot,
        endTime: addMinutes(targetSlot, serviceDurationMinutes),
        status: "PENDING_PAYMENT",
        holdExpiresAt: addMinutes(new Date(), HOLD_DURATION_MINUTES),
        manageToken: `token-${Date.now()}`,
      },
    });

    const slotsAfter = await getAvailableSlots({
      practitionerId,
      serviceDurationMinutes,
      rangeStart,
      rangeEnd,
    });

    expect(slotsAfter).not.toContainEqual(targetSlot);
  });

  it("releases an expired PENDING_PAYMENT hold so the slot frees up again", async () => {
    const rangeStart = setMinutes(setHours(TEST_MONDAY, 0), 0);
    const rangeEnd = addDays(rangeStart, 1);

    const slotsBefore = await getAvailableSlots({
      practitionerId,
      serviceDurationMinutes,
      rangeStart,
      rangeEnd,
    });
    const targetSlot = slotsBefore[0];

    const service = await prisma.service.create({
      data: {
        practitionerId,
        name: "Teszt szolgáltatás 3",
        mode: "ONLINE",
        durationMinutes: serviceDurationMinutes,
        priceHUF: 10000,
      },
    });

    const expiredBooking = await prisma.booking.create({
      data: {
        practitionerId,
        serviceId: service.id,
        customerName: "Lejárt hold ügyfél",
        customerEmail: "expired@example.com",
        customerPhone: "+36301234567",
        startTime: targetSlot,
        endTime: addMinutes(targetSlot, serviceDurationMinutes),
        status: "PENDING_PAYMENT",
        holdExpiresAt: addMinutes(new Date(), -1), // már lejárt
        manageToken: `token-${Date.now()}`,
      },
    });

    const slotsAfter = await getAvailableSlots({
      practitionerId,
      serviceDurationMinutes,
      rangeStart,
      rangeEnd,
    });

    expect(slotsAfter).toContainEqual(targetSlot);

    const refreshed = await prisma.booking.findUniqueOrThrow({ where: { id: expiredBooking.id } });
    expect(refreshed.status).toBe("CANCELLED");
  });

  it("returns no slots on a day marked CLOSED via an exception", async () => {
    const rangeStart = setMinutes(setHours(TEST_MONDAY, 0), 0);
    const rangeEnd = addDays(rangeStart, 1);

    await prisma.availabilityException.create({
      data: { practitionerId, date: new Date(dateKey(TEST_MONDAY)), type: "CLOSED" },
    });

    const slots = await getAvailableSlots({
      practitionerId,
      serviceDurationMinutes,
      rangeStart,
      rangeEnd,
    });

    expect(slots.length).toBe(0);

    await prisma.availabilityException.deleteMany({ where: { practitionerId } });
  });
});

describe("releaseExpiredHolds", () => {
  it("is safe to call with no pending holds", async () => {
    await expect(releaseExpiredHolds()).resolves.toBeUndefined();
  });
});
