// IDEIGLENES: amíg nincs éles adatbázis bekötve, a publikus Kurzusok rész
// ezekkel a beépített minta-adatokkal működik, bemutatási céllal — nem ér
// DB-hez vagy Stripe-hoz. Az admin panel továbbra is az adatbázist
// használja. Ha az adatbázis élesben elérhető, ez a fájl és a rá
// hivatkozó dummy oldalak/action-ök visszaállíthatók a valós (prisma-
// alapú) verzióra — a tartalom szándékosan megegyezik a seed adatokéval.

export type DummyLesson = {
  id: string;
  title: string;
  durationMinutes?: number;
};

export type DummyModule = {
  id: string;
  title: string;
  lessons: DummyLesson[];
};

export type DummyCourse = {
  id: string;
  slug: string;
  title: string;
  shortPromise: string;
  description: string;
  priceHUF: number;
  modules: DummyModule[];
};

export const DUMMY_COURSES: DummyCourse[] = [
  {
    id: "dummy-hiperszenzitiv",
    slug: "hiperszenzitiv-emberek-kurzusa",
    title: "Hiperérzékeny emberek kurzusa",
    shortPromise:
      "Érd meg és fogadd el az érzékenységed — nyugtasd meg a túlpörgő idegrendszered konkrét technikákkal.",
    description:
      "Ha gyakran hallod, hogy túlérzékeny vagy, ez a kurzus segít mélyebben megérteni önmagad, és olyan konkrét gyakorlatokat ad, amikkel megnyugtathatod a túlpörgő idegrendszered.",
    priceHUF: 9990,
    modules: [
      {
        id: "m1",
        title: "Alapok: a megtört biztonságérzet oka és gyógyítása",
        lessons: [
          { id: "l1", title: "Bevezető gondolatok", durationMinutes: 5 },
          { id: "l2", title: "Hogyan fogadd el a mélyen érző részed", durationMinutes: 12 },
          { id: "l3", title: "Konkrét technikák az idegrendszer megnyugtatására", durationMinutes: 15 },
          { id: "l4", title: "Miért merítenek le az emberek — és mit tegyél ellene", durationMinutes: 10 },
        ],
      },
      {
        id: "m2",
        title: "Kérdések (folyamatosan bővülő anyag)",
        lessons: [
          { id: "l5", title: "Hogyan lehet visszaépíteni a megsérült bizalmat", durationMinutes: 8 },
          { id: "l6", title: "Hogyan mondd el az érzéseidet a párodnak", durationMinutes: 9 },
        ],
      },
      {
        id: "m3",
        title: "Bónusz: blokkoldó meditáció",
        lessons: [{ id: "l7", title: "25 perces belső gyermek meditáció", durationMinutes: 25 }],
      },
    ],
  },
  {
    id: "dummy-parkapcsolat",
    slug: "egeszseges-parkapcsolat-alapjai",
    title: "Egészséges Párkapcsolat Alapjai",
    shortPromise:
      "Bontsd le a téves hitrendszereidet, és tanulj konkrét kommunikációs eszközöket, amikkel meghúzhatod a határaidat.",
    description:
      "Ha újra és újra ugyanazokat a mérgező köröket futod a párkapcsolataidban, ez a kurzus segít lebontani a mögöttes mintákat, és konkrét eszközöket ad a kezedbe.",
    priceHUF: 9990,
    modules: [
      {
        id: "m1",
        title: "Alapok",
        lessons: [
          { id: "l1", title: "Adok-kapok egyensúlya", durationMinutes: 16 },
          { id: "l2", title: "Kötődési sebek feloldása", durationMinutes: 13 },
          { id: "l3", title: "A megmentő szerep pszichológiája", durationMinutes: 10 },
          { id: "l4", title: "Tudatos konfliktuskezelés konkrét példákkal", durationMinutes: 5 },
          { id: "l5", title: "A társfüggőség gyökere és megoldása", durationMinutes: 7 },
        ],
      },
      {
        id: "m2",
        title: "Kérdések (folyamatosan bővülő anyag)",
        lessons: [{ id: "l6", title: "Élő kérdés-válasz gyűjtemény" }],
      },
    ],
  },
  {
    id: "dummy-orgazmus",
    slug: "urald-az-orgazmusodat",
    title: "Urald az orgazmusodat",
    shortPromise:
      "Gyakorlatias, szakmai kurzus férfiaknak a korai magömlés hátterének megértéséhez és kezeléséhez.",
    description:
      "Ha zavar, hogy hamarabb sülsz el az ágyban, mint szeretnéd, ez a kurzus végigvezet azon, hogyan érdemes megérteni és kezelni ezt — magabiztos, támogató hangvétellel.",
    priceHUF: 12990,
    modules: [
      {
        id: "m1",
        title: "Értsd az okokat és az érzéseidet",
        lessons: [
          { id: "l1", title: "A korai magömlés biológiai háttere", durationMinutes: 6 },
          { id: "l2", title: "A korábbi felsülések lelki terhe", durationMinutes: 7 },
          { id: "l3", title: "Testtudatosság: izgalom vagy szorongás?", durationMinutes: 8 },
        ],
      },
      {
        id: "m2",
        title: "Gyakorlati lépések",
        lessons: [
          { id: "l4", title: "Tudatos szokások kialakítása", durationMinutes: 9 },
          { id: "l5", title: "Légzéstechnika és jelenlét", durationMinutes: 8 },
        ],
      },
      {
        id: "m3",
        title: "Mindset és kommunikáció",
        lessons: [{ id: "l6", title: "Hogyan kommunikáld az igényeidet a partnerednek", durationMinutes: 9 }],
      },
    ],
  },
];

export function getDummyCourseBySlug(slug: string) {
  return DUMMY_COURSES.find((c) => c.slug === slug) ?? null;
}
