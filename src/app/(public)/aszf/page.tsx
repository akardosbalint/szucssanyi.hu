import type { Metadata } from "next";
import { Section } from "@/components/ui/Section";

export const metadata: Metadata = {
  title: "Általános Szerződési Feltételek",
  robots: { index: false },
};

// TODO (élesítés előtt): ezt a szöveget ügyvéddel/könyvelővel érdemes
// átnézetni, mielőtt élesbe kerül — ez egy általános tervezet, ami a
// szolgáltatás jellegéhez igazodik, de nem helyettesíti a jogi ellenőrzést.
export default function TermsPage() {
  return (
    <Section variant="light" narrow className="pt-20 sm:pt-28">
      <h1 className="font-heading text-3xl font-bold text-primary-950">
        Általános Szerződési Feltételek
      </h1>
      <p className="mt-2 text-sm text-neutral-500">Hatályos: 2026. [TODO: dátum]</p>

      <div className="prose-content mt-8 space-y-6 text-[15px] leading-relaxed text-neutral-700">
        <section>
          <h2 className="font-heading text-lg font-bold text-primary-950">1. Szolgáltató adatai</h2>
          <p>
            Szolgáltató: Szűcs Sándor e.v. [TODO: nyilvántartási szám, adószám,
            székhely]. Elérhetőség: [TODO: e-mail cím], szucssanyi.hu.
          </p>
        </section>

        <section>
          <h2 className="font-heading text-lg font-bold text-primary-950">2. A szolgáltatások köre</h2>
          <p>
            A Szolgáltató egyéni konzultációt, csoportos családállítás
            alkalmakat és önismereti online kurzusokat kínál. A szolgáltatások
            részletes leírása, ára és időtartama a vonatkozó aloldalakon és a
            foglalási folyamat során jelenik meg.
          </p>
        </section>

        <section>
          <h2 className="font-heading text-lg font-bold text-primary-950">3. Foglalás és fizetés</h2>
          <p>
            Az egyéni konzultáció és a csoportos családállítás foglalása a
            weboldalon keresztül, előre fizetéssel történik. A fizetés a
            Stripe biztonságos fizetési szolgáltatóján keresztül zajlik. A
            foglalás csak a sikeres fizetést követően minősül véglegesnek —
            a fizetésre váró, de még be nem fejezett foglalások egy rövid
            időkorlát után automatikusan felszabadulnak.
          </p>
          <p>
            Online kurzus vásárlása esetén a sikeres fizetést követően a
            Vásárló azonnal, e-mailben kapja meg az egyedi hozzáférési
            linket a kurzusanyaghoz.
          </p>
        </section>

        <section>
          <h2 className="font-heading text-lg font-bold text-primary-950">
            4. Lemondás, módosítás, elállás
          </h2>
          <p>
            Egyéni konzultáció és csoportos családállítás esetén a Vásárló a
            visszaigazoló e-mailben kapott egyedi linken keresztül, az
            időpont előtt legalább 24 órával díjmentesen lemondhatja vagy
            módosíthatja a foglalását.
          </p>
          <p>
            Online kurzus esetén a hatályos fogyasztóvédelmi szabályozás
            szerinti elállási jog [TODO: pontosítandó a digitális tartalom
            elállási szabályai szerint — a kurzushoz való hozzáférés
            megkezdése befolyásolhatja az elállási jogot].
          </p>
        </section>

        <section>
          <h2 className="font-heading text-lg font-bold text-primary-950">5. Panaszkezelés</h2>
          <p>
            Panasszal a Szolgáltató a Kapcsolat oldalon megadott
            elérhetőségein kereshető meg. [TODO: panaszkezelési és
            vitarendezési fórumok elérhetősége.]
          </p>
        </section>
      </div>
    </Section>
  );
}
