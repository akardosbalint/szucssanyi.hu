# Szűcs Sándor — weboldal, időpontfoglalás, admin panel

Next.js (App Router) + PostgreSQL/Prisma + Stripe alapú weboldal Szűcs Sándor
holisztikus önismereti mentor számára: publikus tartalmi oldalak, önkiszolgáló
időpontfoglalás fizetéssel, és egy admin panel a naptár/foglalások/kurzusok
kezeléséhez.

## Fejlesztői környezet beállítása

1. **Függőségek telepítése**

   ```bash
   npm install
   ```

   > Ha a Prisma engine letöltése `ECONNRESET` hibával elszáll (korlátozott
   > hálózatú sandboxban előfordul), futtasd: `./scripts/fetch-prisma-engines.sh`

2. **PostgreSQL** — helyi fejlesztéshez natív cluster vagy Docker is
   használható:

   ```bash
   pg_ctlcluster 16 main start   # ha natívan telepítve van
   ```

3. **Környezeti változók**

   ```bash
   cp .env.example .env
   ```

   Töltsd ki a `DATABASE_URL`-t, és generálj egy `AUTH_SECRET`/`CRON_SECRET`
   értéket: `openssl rand -base64 32`. A Stripe/SMTP/MailerLite/analitika
   kulcsok TODO placeholderek — élesítés előtt pótlandók (lásd lent).

4. **Adatbázis migráció + seed**

   ```bash
   npx prisma migrate dev
   npm run db:seed
   ```

   A seed létrehoz 3 szakembert (Sándor, Veronika, Andrea), mintaárakat,
   egy csoportos családállítás eseményt és 3 kurzust. A seed kimenete
   kiírja a fejlesztői admin belépési adatokat.

5. **Fejlesztői szerver**

   ```bash
   npm run dev
   ```

## Stripe teszt módban

1. Hozz létre egy Stripe fiókot (teszt módban ingyenes), és másold ki a
   *Publishable key* / *Secret key* párost a Dashboard "Developers → API
   keys" oldaláról a `.env`-be.
2. Telepítsd a [Stripe CLI](https://docs.stripe.com/stripe-cli)-t, és
   futtasd helyben a webhookok átirányítását:

   ```bash
   stripe listen --forward-to localhost:3000/api/webhooks/stripe
   ```

   A parancs kiír egy `whsec_...` webhook secretet — ezt másold a
   `STRIPE_WEBHOOK_SECRET` env változóba.
3. Teszt bankkártya sikeres fizetéshez: `4242 4242 4242 4242`, tetszőleges
   jövőbeli lejárat és CVC.
4. Amíg a Stripe kulcsok nincsenek beállítva, a foglalás/jelentkezés/kurzus-
   vásárlás form graceful módon jelez (nem hoz létre "árva" fizetésre váró
   rekordot), és a kapcsolat oldalra irányítja a látogatót.

## Admin bejelentkezés (fejlesztői környezet)

A `npm run db:seed` a következő fejlesztői fiókokat hozza létre:

| Szerepkör | E-mail | Jelszó |
| --- | --- | --- |
| ADMIN (Sándor) | `sandor@szucssanyi.hu` | `ChangeMe123!` |
| PRACTITIONER (Veronika) | `veronika@szucssanyi.hu` | `ChangeMe123!` |
| PRACTITIONER (Andrea) | `andrea@szucssanyi.hu` | `ChangeMe123!` |

Élesítés előtt mindenképp cseréld le ezeket a jelszavakat — jelenleg nincs
"jelszócsere" felület az admin panelben, ezt a `User.passwordHash` mező
közvetlen frissítésével (pl. egy kisegítő szkripttel, `bcrypt.hash`
használatával) vagy a seed script újrafuttatásával lehet megoldani.

## Élesítés előtt pótlandó integrációk

Ezek a rendszer TODO/placeholder pontjai — kódban is jelölve, itt
összefoglalva:

| Integráció | Hol | Teendő |
| --- | --- | --- |
| Stripe (fizetés) | `STRIPE_SECRET_KEY`, `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`, `STRIPE_WEBHOOK_SECRET` | Teszt/éles kulcsok a Stripe Dashboardból |
| SMTP (tranzakciós e-mail) | `SMTP_*` env változók, `src/lib/email.ts` | Saját SMTP fiók (visszaigazolás, emlékeztető, lemondás e-mailek) |
| MailerLite | `MAILERLITE_API_KEY` | Ha szeretnéd szinkronizálni a feliratkozókat/kapcsolat üzeneteket |
| Google Analytics / Meta Pixel | `NEXT_PUBLIC_GA_ID`, `NEXT_PUBLIC_META_PIXEL_ID` | ID-k beillesztése |
| Social linkek | `NEXT_PUBLIC_FACEBOOK_URL` stb. | Valós URL-ek |
| Számlázás | — | Nincs implementálva (a döntés szerint jelenleg nem prioritás) |
| Cron ütemezés | `CRON_SECRET`, `/api/cron/*`, `vercel.json` | Vercelen a `vercel.json` crons szekciója automatikusan ütemezi (Vercel a `CRON_SECRET` env változóból állítja be az Authorization headert); más hosztingnál külső ütemező (pl. cron-job.org) szükséges |

## Szkriptek

- `npm run dev` / `npm run build` / `npm run start`
- `npm run lint`
- `npm test` — Vitest (foglalás-ütközés / hold-lejárat logika)
- `npm run db:migrate` — Prisma migráció
- `npm run db:seed` — minta adatok betöltése
- `npm run db:studio` — Prisma Studio (adatbázis böngésző)

## Architektúra röviden

- `prisma/schema.prisma` — teljes adatmodell (szakemberek, szolgáltatások,
  elérhetőség, foglalások, események, kurzusok, fizetések, leadek).
- `src/app/(public)/*` — publikus, SEO-optimalizált oldalak, közös
  Navbar/Footer/CookieConsent réteggel.
- `src/app/admin/*` — bejelentkezés mögötti admin panel (Auth.js,
  szerepkör-alapú jogosultsággal).
- `src/app/api/webhooks/stripe` — Stripe webhook, ez a fizetési állapot
  egyetlen megbízható forrása (nem a kliens-oldali redirect).
- `src/lib/` — megosztott logika (Prisma kliens, auth, foglalás/rendelkezésre
  állás számítás, Stripe, e-mail, formázás).

## Ismert korlátok / amit érdemes tudni élesítés előtt

- **Tartalom**: a szakember-fotók, oklevelek, valós vélemények és a "Rólam"
  oldal hitelesítő adatai jelenleg minta/placeholder tartalmak — ezeket
  Sanyinak kell valós anyagra cserélnie (admin panel: Szakemberek; kód:
  `src/app/(public)/rolam/page.tsx`, `src/app/(public)/page.tsx`).
- **ÁSZF / Adatvédelmi tájékoztató**: általános tervezet, jogi
  felülvizsgálat nélkül — a `[TODO: ...]` jelölt részeket (cégadatok,
  dátumok) mindenképp ki kell tölteni, és érdemes ügyvéddel átnézetni.
- **Jelszókezelés**: nincs "elfelejtett jelszó" / jelszócsere felület az
  admin panelben — ezt egy következő menetben érdemes hozzáadni, ha
  szükséges.
- **Számlázás**: nincs implementálva (a jelen állapot szerint nem
  prioritás) — ha szükség lenne rá, a `Payment` modellre épülő Számlázz.hu
  (vagy hasonló) integrációt külön menetben kell megépíteni.
- **Függőségek**: `npm audit` jelez néhány, jelenleg még javítás nélküli
  nodemailer sérülékenységet (a `next-auth`/`@auth/core` révén beágyazva).
  A saját e-mail kódunk (`src/lib/email.ts`) nem használja az érintett
  funkciókat (jsonTransport, raw option, egyedi envelope/OAuth2), és minden
  bemenő e-mail címet zod validál — ettől függetlenül érdemes figyelni a
  nodemailer/next-auth frissítéseit, és lecserélni, amint elérhető javított
  verzió.
- **Fejlesztői sandboxban tapasztalt jelenség**: a Turbopack dev szerver
  perzisztens cache-e (`.next/dev/cache`) néha korruptálódik hosszú
  fejlesztői munkamenetben — ha ez történik, `rm -rf .next` és újraindítás
  megoldja. Ez nem érinti a `next build`/`next start` production módot.

## Verifikáció (elvégezve ebben a fejlesztési menetben)

- `npm run lint`, `npm run build`, `npm test` — mind zöld.
- Böngészős, végponttól végpontig tesztelve (Playwright): teljes foglalási
  folyamat (szakember → szolgáltatás → naptár → adatok → Stripe-hiány esetén
  graceful üzenet), foglalás lemondása egyedi linkről, csoportos
  családállítás jelentkezés + lemondás, kurzusvásárlás form, ingyenes
  meditáció feliratkozás, kapcsolat form.
- Admin panel: bejelentkezés, szerepkör-alapú hozzáférés-korlátozás (a
  szakember nem éri el az admin-only oldalakat), kézi foglalás rögzítése
  azonnal blokkolja a publikus naptárat (nincs dupla foglalás), elérhetőség-
  szerkesztés (heti szabály + kivétel) azonnal tükröződik a publikus
  oldalon, kurzus-tartalom szerkesztés, ügyfél-anonimizálás.
- SEO: minden publikus oldalon egyedi title/description, egy H1/oldal
  helyes heading-hierarchiával, `sitemap.xml`/`robots.txt`, Person és
  LocalBusiness JSON-LD.
- Konzolhiba-mentes bejárás minden publikus oldalon.
