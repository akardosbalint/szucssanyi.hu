import type { Metadata } from "next";
import { Section } from "@/components/ui/Section";

export const metadata: Metadata = {
  title: "Adatvédelmi tájékoztató",
  robots: { index: false },
};

// TODO (élesítés előtt): ezt a szöveget ügyvéddel/adatvédelmi szakértővel
// érdemes átnézetni — ez egy általános, GDPR-elveket követő tervezet.
export default function PrivacyPage() {
  return (
    <Section variant="light" narrow className="pt-20 sm:pt-28">
      <h1 className="font-heading text-3xl font-bold text-primary-950">
        Adatvédelmi tájékoztató
      </h1>
      <p className="mt-2 text-sm text-neutral-500">Hatályos: 2026. [TODO: dátum]</p>

      <div className="mt-8 space-y-6 text-[15px] leading-relaxed text-neutral-700">
        <section>
          <h2 className="font-heading text-lg font-bold text-primary-950">1. Adatkezelő</h2>
          <p>
            Szűcs Sándor e.v. [TODO: nyilvántartási szám, székhely,
            kapcsolattartási e-mail cím].
          </p>
        </section>

        <section>
          <h2 className="font-heading text-lg font-bold text-primary-950">
            2. Milyen adatokat kezelünk, és miért
          </h2>
          <ul className="ml-5 list-disc space-y-1.5">
            <li>
              <strong>Foglalás / jelentkezés</strong>: név, e-mail cím,
              telefonszám, választott szolgáltatás és időpont — a szolgáltatás
              teljesítéséhez és a kapcsolattartáshoz szükséges.
            </li>
            <li>
              <strong>Kurzusvásárlás</strong>: név, e-mail cím — a
              kurzusanyaghoz való hozzáférés biztosításához.
            </li>
            <li>
              <strong>Fizetés</strong>: a bankkártya-adatokat nem mi, hanem a
              Stripe fizetési szolgáltató kezeli, a saját adatvédelmi
              szabályzata szerint.
            </li>
            <li>
              <strong>Feliratkozás / kapcsolatfelvétel</strong>: név, e-mail
              cím, illetve az üzenet tartalma — a megkeresés
              megválaszolásához.
            </li>
            <li>
              <strong>Sütik</strong>: az oldal működéséhez szükséges
              alapsütik, valamint — hozzájárulás esetén — látogatottságmérési
              sütik.
            </li>
          </ul>
        </section>

        <section>
          <h2 className="font-heading text-lg font-bold text-primary-950">
            3. Adatkezelés időtartama
          </h2>
          <p>
            A foglalásokkal és vásárlásokkal kapcsolatos adatokat a számviteli
            és fogyasztóvédelmi kötelezettségek fennállásáig, a
            feliratkozói/kapcsolati adatokat a hozzájárulás visszavonásáig
            vagy a törlési kérelem teljesítéséig kezeljük.
          </p>
        </section>

        <section>
          <h2 className="font-heading text-lg font-bold text-primary-950">
            4. Az érintett jogai
          </h2>
          <p>
            Bármikor kérheted a rólad tárolt adatokhoz való hozzáférést, azok
            helyesbítését vagy törlését a Kapcsolat oldalon megadott
            elérhetőségen keresztül.
          </p>
        </section>

        <section>
          <h2 className="font-heading text-lg font-bold text-primary-950">5. Adatfeldolgozók</h2>
          <p>
            Fizetés: Stripe. Tárhely / adatbázis: [TODO: tárhelyszolgáltató
            neve]. E-mail küldés: [TODO: SMTP / e-mail szolgáltató neve].
          </p>
        </section>
      </div>
    </Section>
  );
}
