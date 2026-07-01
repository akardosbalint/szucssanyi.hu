// IDEIGLENES: amíg nincs éles adatbázis/Stripe bekötve, a publikus
// Csoportos családállítás rész ezekkel a beépített minta-adatokkal
// működik, bemutatási céllal. Az admin panel továbbra is az adatbázist
// használja.

export type DummyEvent = {
  id: string;
  slug: string;
  title: string;
  description: string;
  location: string;
  startTime: Date;
  endTime: Date;
  capacity: number;
  registeredCount: number;
  priceHUF: number;
};

function upcomingDate(daysFromNow: number, hour: number) {
  const d = new Date();
  d.setDate(d.getDate() + daysFromNow);
  d.setHours(hour, 0, 0, 0);
  return d;
}

export const DUMMY_EVENTS: DummyEvent[] = [
  {
    id: "dummy-event-1",
    slug: "csaladallitas-2026-osz",
    title: "Csoportos családállítás",
    description:
      "Egy délután, ahol a családi mintáid a csoport segítségével válnak láthatóvá — sokszor mélyebb belátást ad, mint hónapok magánbeszélgetése.",
    location: "Budapest, belváros — pontos cím a jelentkezés visszaigazolásában",
    startTime: upcomingDate(21, 10),
    endTime: upcomingDate(21, 16),
    capacity: 12,
    registeredCount: 4,
    priceHUF: 18000,
  },
];

export function getDummyEventBySlug(slug: string) {
  return DUMMY_EVENTS.find((e) => e.slug === slug) ?? null;
}

export function getDummyEventSpotsLeft(event: DummyEvent) {
  return event.capacity - event.registeredCount;
}
