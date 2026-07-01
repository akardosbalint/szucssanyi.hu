import { PrismaClient, ServiceMode } from "@prisma/client";
import bcrypt from "bcryptjs";
import { randomBytes } from "crypto";

const prisma = new PrismaClient();

function token() {
  return randomBytes(24).toString("base64url");
}

async function upsertStaff(params: {
  email: string;
  password: string;
  name: string;
  role: "ADMIN" | "PRACTITIONER";
}) {
  const passwordHash = await bcrypt.hash(params.password, 10);
  return prisma.user.upsert({
    where: { email: params.email },
    update: {},
    create: {
      email: params.email,
      passwordHash,
      name: params.name,
      role: params.role,
    },
  });
}

async function main() {
  console.log("Seed: staff felhasználók létrehozása...");

  const sandorUser = await upsertStaff({
    email: process.env.ADMIN_EMAIL || "sandor@szucssanyi.hu",
    password: process.env.ADMIN_PASSWORD || "ChangeMe123!",
    name: "Szűcs Sándor",
    role: "ADMIN",
  });

  const veronikaUser = await upsertStaff({
    email: "veronika@szucssanyi.hu",
    password: "ChangeMe123!",
    name: "Veronika",
    role: "PRACTITIONER",
  });

  const andreaUser = await upsertStaff({
    email: "andrea@szucssanyi.hu",
    password: "ChangeMe123!",
    name: "Andrea",
    role: "PRACTITIONER",
  });

  console.log("Seed: szakemberek...");

  const sandor = await prisma.practitioner.upsert({
    where: { slug: "sandor" },
    update: {},
    create: {
      slug: "sandor",
      name: "Szűcs Sándor",
      title: "Holisztikus önismereti mentor, alapító",
      bio: "2000+ egyéni ülés tapasztalatával kísérem az embereket az önismeret útján. Konzultáción és családállításon keresztül azt segítek meglátni, ami a jelenlegi nehézségeid gyökerében áll.",
      order: 0,
      userId: sandorUser.id,
      services: {
        create: [
          {
            name: "Online konzultáció (60 perc)",
            mode: ServiceMode.ONLINE,
            durationMinutes: 60,
            priceHUF: 25000,
            order: 0,
          },
          {
            name: "Személyes konzultáció (60 perc)",
            mode: ServiceMode.IN_PERSON,
            durationMinutes: 60,
            priceHUF: 28000,
            order: 1,
          },
        ],
      },
      availabilityRules: {
        create: [1, 2, 3, 4, 5].map((weekday) => ({
          weekday,
          startTime: "09:00",
          endTime: "16:00",
        })),
      },
    },
  });

  const veronika = await prisma.practitioner.upsert({
    where: { slug: "veronika" },
    update: {},
    create: {
      slug: "veronika",
      name: "Veronika",
      title: "Önismereti tanácsadó",
      bio: "A párkapcsolati mintákra és a szorongás kezelésére specializálódtam. Nyugodt, támogató jelenléttel kísérlek végig a folyamaton.",
      order: 1,
      userId: veronikaUser.id,
      services: {
        create: [
          {
            name: "Online konzultáció (60 perc)",
            mode: ServiceMode.ONLINE,
            durationMinutes: 60,
            priceHUF: 22000,
            order: 0,
          },
        ],
      },
      availabilityRules: {
        create: [2, 4].map((weekday) => ({
          weekday,
          startTime: "10:00",
          endTime: "18:00",
        })),
      },
    },
  });

  const andrea = await prisma.practitioner.upsert({
    where: { slug: "andrea" },
    update: {},
    create: {
      slug: "andrea",
      name: "Andrea",
      title: "Önismereti tanácsadó",
      bio: "A hiperérzékeny és introvertált ügyfelekkel dolgozom szívesen — sokan náluk találják meg először azt a nyelvet, amivel ki tudják fejezni, amit éreznek.",
      order: 2,
      userId: andreaUser.id,
      services: {
        create: [
          {
            name: "Online konzultáció (60 perc)",
            mode: ServiceMode.ONLINE,
            durationMinutes: 60,
            priceHUF: 22000,
            order: 0,
          },
          {
            name: "Személyes konzultáció (60 perc)",
            mode: ServiceMode.IN_PERSON,
            durationMinutes: 60,
            priceHUF: 25000,
            order: 1,
          },
        ],
      },
      availabilityRules: {
        create: [1, 3, 5].map((weekday) => ({
          weekday,
          startTime: "09:00",
          endTime: "13:00",
        })),
      },
    },
  });

  console.log("Seed: csoportos családállítás esemény...");

  const eventDate = new Date();
  eventDate.setDate(eventDate.getDate() + 21);
  eventDate.setHours(10, 0, 0, 0);
  const eventEnd = new Date(eventDate);
  eventEnd.setHours(16, 0, 0, 0);

  await prisma.event.upsert({
    where: { slug: "csaladallitas-2026-osz" },
    update: {},
    create: {
      slug: "csaladallitas-2026-osz",
      title: "Csoportos családállítás",
      description:
        "Egy délután, ahol a családi mintáid a csoport segítségével válnak láthatóvá — sokszor mélyebb belátást ad, mint hónapok magánbeszélgetése.",
      location: "Budapest, belváros — pontos cím a jelentkezés visszaigazolásában",
      startTime: eventDate,
      endTime: eventEnd,
      capacity: 12,
      priceHUF: 18000,
    },
  });

  console.log("Seed: kurzusok...");

  await prisma.course.upsert({
    where: { slug: "hiperszenzitiv-emberek-kurzusa" },
    update: {},
    create: {
      slug: "hiperszenzitiv-emberek-kurzusa",
      title: "Hiperérzékeny emberek kurzusa",
      shortPromise:
        "Érd meg és fogadd el az érzékenységed — nyugtasd meg a túlpörgő idegrendszered konkrét technikákkal.",
      priceHUF: 9990,
      order: 0,
      description:
        "Ha gyakran hallod, hogy túlérzékeny vagy, ez a kurzus segít mélyebben megérteni önmagad, és olyan konkrét gyakorlatokat ad, amikkel megnyugtathatod a túlpörgő idegrendszered.",
      modules: {
        create: [
          {
            title: "Alapok: a megtört biztonságérzet oka és gyógyítása",
            order: 0,
            lessons: {
              create: [
                { title: "Bevezető gondolatok", order: 0, durationMinutes: 5 },
                { title: "Hogyan fogadd el a mélyen érző részed", order: 1, durationMinutes: 12 },
                { title: "Konkrét technikák az idegrendszer megnyugtatására", order: 2, durationMinutes: 15 },
                { title: "Miért merítenek le az emberek — és mit tegyél ellene", order: 3, durationMinutes: 10 },
              ],
            },
          },
          {
            title: "Kérdések (folyamatosan bővülő anyag)",
            order: 1,
            lessons: {
              create: [
                { title: "Hogyan lehet visszaépíteni a megsérült bizalmat", order: 0, durationMinutes: 8 },
                { title: "Hogyan mondd el az érzéseidet a párodnak", order: 1, durationMinutes: 9 },
              ],
            },
          },
          {
            title: "Bónusz: blokkoldó meditáció",
            order: 2,
            lessons: {
              create: [
                { title: "25 perces belső gyermek meditáció", order: 0, durationMinutes: 25 },
              ],
            },
          },
        ],
      },
    },
  });

  await prisma.course.upsert({
    where: { slug: "egeszseges-parkapcsolat-alapjai" },
    update: {},
    create: {
      slug: "egeszseges-parkapcsolat-alapjai",
      title: "Egészséges Párkapcsolat Alapjai",
      shortPromise:
        "Bontsd le a téves hitrendszereidet, és tanulj konkrét kommunikációs eszközöket, amikkel meghúzhatod a határaidat.",
      priceHUF: 9990,
      order: 1,
      description:
        "Ha újra és újra ugyanazokat a mérgező köröket futod a párkapcsolataidban, ez a kurzus segít lebontani a mögöttes mintákat, és konkrét eszközöket ad a kezedbe.",
      modules: {
        create: [
          {
            title: "Alapok",
            order: 0,
            lessons: {
              create: [
                { title: "Adok-kapok egyensúlya", order: 0, durationMinutes: 16 },
                { title: "Kötődési sebek feloldása", order: 1, durationMinutes: 13 },
                { title: "A megmentő szerep pszichológiája", order: 2, durationMinutes: 10 },
                { title: "Tudatos konfliktuskezelés konkrét példákkal", order: 3, durationMinutes: 5 },
                { title: "A társfüggőség gyökere és megoldása", order: 4, durationMinutes: 7 },
              ],
            },
          },
          {
            title: "Kérdések (folyamatosan bővülő anyag)",
            order: 1,
            lessons: { create: [{ title: "Élő kérdés-válasz gyűjtemény", order: 0 }] },
          },
        ],
      },
    },
  });

  await prisma.course.upsert({
    where: { slug: "urald-az-orgazmusodat" },
    update: {},
    create: {
      slug: "urald-az-orgazmusodat",
      title: "Urald az orgazmusodat",
      shortPromise:
        "Gyakorlatias, szakmai kurzus férfiaknak a korai magömlés hátterének megértéséhez és kezeléséhez.",
      priceHUF: 12990,
      order: 2,
      description:
        "Ha zavar, hogy hamarabb sülsz el az ágyban, mint szeretnéd, ez a kurzus végigvezet azon, hogyan érdemes megérteni és kezelni ezt — magabiztos, támogató hangvétellel.",
      modules: {
        create: [
          {
            title: "Értsd az okokat és az érzéseidet",
            order: 0,
            lessons: {
              create: [
                { title: "A korai magömlés biológiai háttere", order: 0, durationMinutes: 6 },
                { title: "A korábbi felsülések lelki terhe", order: 1, durationMinutes: 7 },
                { title: "Testtudatosság: izgalom vagy szorongás?", order: 2, durationMinutes: 8 },
              ],
            },
          },
          {
            title: "Gyakorlati lépések",
            order: 1,
            lessons: {
              create: [
                { title: "Tudatos szokások kialakítása", order: 0, durationMinutes: 9 },
                { title: "Légzéstechnika és jelenlét", order: 1, durationMinutes: 8 },
              ],
            },
          },
          {
            title: "Mindset és kommunikáció",
            order: 2,
            lessons: {
              create: [
                { title: "Hogyan kommunikáld az igényeidet a partnerednek", order: 0, durationMinutes: 9 },
              ],
            },
          },
        ],
      },
    },
  });

  console.log("Seed kész.");
  console.log("--- Belépési adatok (fejlesztői környezet) ---");
  console.log(`Admin: ${sandorUser.email} / ${process.env.ADMIN_PASSWORD || "ChangeMe123!"}`);
  console.log(`Veronika: veronika@szucssanyi.hu / ChangeMe123!`);
  console.log(`Andrea: andrea@szucssanyi.hu / ChangeMe123!`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
