// IDEIGLENES: a dummy (adatbázis nélküli) foglalási felülethez tartozó
// rendelkezésre állás — heti minta-szabályok gyakorlatilag ugyanazok, mint
// a valós seed adatban, de nincs mögötte adatbázis, és minden időpont
// mindig "szabadnak" számít (nincs ütközés-ellenőrzés, hiszen nincs valós
// foglalás sem).

const DUMMY_WEEKLY_RULES: Record<string, { weekday: number; startTime: string; endTime: string }[]> = {
  sandor: [1, 2, 3, 4, 5].map((weekday) => ({ weekday, startTime: "09:00", endTime: "16:00" })),
  veronika: [2, 4].map((weekday) => ({ weekday, startTime: "10:00", endTime: "18:00" })),
  andrea: [1, 3, 5].map((weekday) => ({ weekday, startTime: "09:00", endTime: "13:00" })),
};

const SLOT_INTERVAL_MINUTES = 30;

function timeToMinutes(time: string) {
  const [h, m] = time.split(":").map(Number);
  return h * 60 + m;
}

/** dateKey: "2026-07-15" (a látogató böngészőjének helyi napja). Visszaadott értékek ugyanarra a napra, helyi "HH:MM" időpontok. */
export function getDummySlotsForDay(
  practitionerSlug: string,
  serviceDurationMinutes: number,
  dateKey: string,
): string[] {
  const rules = DUMMY_WEEKLY_RULES[practitionerSlug] ?? DUMMY_WEEKLY_RULES.sandor;
  const [y, m, d] = dateKey.split("-").map(Number);
  const weekday = new Date(y, m - 1, d).getDay();

  const windows = rules.filter((r) => r.weekday === weekday);
  const slots: string[] = [];

  const now = new Date();
  const isToday =
    now.getFullYear() === y && now.getMonth() === m - 1 && now.getDate() === d;
  const nowMinutes = now.getHours() * 60 + now.getMinutes();

  for (const window of windows) {
    const start = timeToMinutes(window.startTime);
    const end = timeToMinutes(window.endTime);

    for (
      let minutes = start;
      minutes + serviceDurationMinutes <= end;
      minutes += SLOT_INTERVAL_MINUTES
    ) {
      if (isToday && minutes <= nowMinutes) continue;
      const h = String(Math.floor(minutes / 60)).padStart(2, "0");
      const mm = String(minutes % 60).padStart(2, "0");
      slots.push(`${h}:${mm}`);
    }
  }

  return slots;
}
