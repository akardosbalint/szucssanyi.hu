// IDEIGLENES: amíg nincs éles adatbázis/Stripe bekötve, a publikus
// Konzultáció/időpontfoglalás rész ezekkel a beépített minta-adatokkal
// működik, bemutatási céllal — nem ér DB-hez vagy Stripe-hoz. Az admin
// panel és a többi rész továbbra is az adatbázist használja.
// Ha az adatbázis élesben elérhető, ez a fájl és a rá hivatkozó
// dummy oldalak/action-ök visszaállíthatók a valós (prisma-alapú) verzióra.

export type DummyService = {
  id: string;
  name: string;
  mode: "ONLINE" | "IN_PERSON";
  durationMinutes: number;
  priceHUF: number;
};

export type DummyPractitioner = {
  id: string;
  slug: string;
  name: string;
  title: string;
  bio: string;
  photoUrl: string | null;
  services: DummyService[];
};

export const DUMMY_PRACTITIONERS: DummyPractitioner[] = [
  {
    id: "dummy-sandor",
    slug: "sandor",
    name: "Szűcs Sándor",
    title: "Holisztikus önismereti mentor, alapító",
    bio: "2000+ egyéni ülés tapasztalatával kísérem az embereket az önismeret útján. Konzultáción és családállításon keresztül azt segítek meglátni, ami a jelenlegi nehézségeid gyökerében áll.",
    photoUrl: null,
    services: [
      {
        id: "dummy-sandor-online",
        name: "Online konzultáció (60 perc)",
        mode: "ONLINE",
        durationMinutes: 60,
        priceHUF: 25000,
      },
      {
        id: "dummy-sandor-inperson",
        name: "Személyes konzultáció (60 perc)",
        mode: "IN_PERSON",
        durationMinutes: 60,
        priceHUF: 28000,
      },
    ],
  },
  {
    id: "dummy-veronika",
    slug: "veronika",
    name: "Veronika",
    title: "Önismereti tanácsadó",
    bio: "A párkapcsolati mintákra és a szorongás kezelésére specializálódtam. Nyugodt, támogató jelenléttel kísérlek végig a folyamaton.",
    photoUrl: null,
    services: [
      {
        id: "dummy-veronika-online",
        name: "Online konzultáció (60 perc)",
        mode: "ONLINE",
        durationMinutes: 60,
        priceHUF: 22000,
      },
    ],
  },
  {
    id: "dummy-andrea",
    slug: "andrea",
    name: "Andrea",
    title: "Önismereti tanácsadó",
    bio: "A hiperérzékeny és introvertált ügyfelekkel dolgozom szívesen — sokan náluk találják meg először azt a nyelvet, amivel ki tudják fejezni, amit éreznek.",
    photoUrl: null,
    services: [
      {
        id: "dummy-andrea-online",
        name: "Online konzultáció (60 perc)",
        mode: "ONLINE",
        durationMinutes: 60,
        priceHUF: 22000,
      },
      {
        id: "dummy-andrea-inperson",
        name: "Személyes konzultáció (60 perc)",
        mode: "IN_PERSON",
        durationMinutes: 60,
        priceHUF: 25000,
      },
    ],
  },
];

export function getDummyPractitionerBySlug(slug: string) {
  return DUMMY_PRACTITIONERS.find((p) => p.slug === slug) ?? null;
}

export function getDummyServiceById(practitioner: DummyPractitioner, serviceId: string) {
  return practitioner.services.find((s) => s.id === serviceId) ?? null;
}
