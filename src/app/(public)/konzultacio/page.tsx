import type { Metadata } from "next";
import { Section } from "@/components/ui/Section";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { PersonAvatar } from "@/components/ui/PersonAvatar";
import { FaqAccordion } from "@/components/ui/FaqAccordion";
import { formatHUF } from "@/lib/format";
import { DUMMY_PRACTITIONERS } from "@/lib/dummy-practitioners";
import { HeartCrack, MessagesSquare, ShieldQuestion } from "lucide-react";

// IDEIGLENES (bemutatási céllal): a szakember-lista jelenleg beépített
// minta-adat, nem adatbázisból jön — lásd src/lib/dummy-practitioners.ts.

export const metadata: Metadata = {
  title: "Konzultáció",
  description:
    "Egyéni konzultáció Szűcs Sándorral, Veronikával vagy Andreával — online vagy személyesen Budapesten. Foglalj időpontot valós idejű naptárból.",
};

const PROBLEMS = [
  {
    icon: HeartCrack,
    title: "Ugyanaz a mérgező minta ismétlődik a kapcsolataidban",
    description:
      "Újra és újra ugyanoda jutsz, akárhányszor újrakezded — és nem érted, miért.",
  },
  {
    icon: ShieldQuestion,
    title: "Szorongsz, de nem tudod pontosan, mitől",
    description:
      "Egy háttérzaj kísér a mindennapjaidban, ami nehezíti a döntéseidet és a jelenlétedet.",
  },
  {
    icon: MessagesSquare,
    title: "Nehéz kimondanod, amit valójában érzel",
    description:
      "A fontos beszélgetések előtt lefagysz, vagy csak jóval később jönnek meg a szavak.",
  },
];

const FAQ_ITEMS = [
  {
    question: "Hogyan zajlik egy konzultáció?",
    answer:
      "Az első ülésen átbeszéljük, mi hozott el hozzám, és közösen kijelöljük, min érdemes dolgoznunk. Utána a saját tempódban haladunk — van, akinek egy ülés is elég, van, aki hosszabb távon jár.",
  },
  {
    question: "Online vagy személyes ülésre menjek?",
    answer:
      "Mindkettő ugyanolyan hatékony. Az online ülés kényelmesebb, ha időhiányos vagy nem Budapesten élsz; a személyes ülés egyeseknek mélyebb jelenlétet ad. A foglalás során bármikor választhatsz.",
  },
  {
    question: "Mennyi idő alatt látok eredményt?",
    answer:
      "Sokan már az első ülés után tisztábban látják a saját helyzetüket. A tartós változáshoz jellemzően több alkalom szükséges — ezt az első beszélgetés után átbeszéljük.",
  },
  {
    question: "Mi történik, ha le kell mondanom az időpontot?",
    answer:
      "A visszaigazoló e-mailben kapott egyedi linken bármikor lemondhatod vagy módosíthatod a foglalásod, 24 órával az időpont előttig, adminisztrátori közreműködés nélkül.",
  },
];

export default function ConsultationPage() {
  const practitioners = DUMMY_PRACTITIONERS;

  return (
    <>
      <Section variant="dark" className="pb-16 pt-20 sm:pt-28">
        <Badge className="bg-white/10 text-white">Egyéni konzultáció</Badge>
        <h1 className="mt-6 max-w-2xl font-heading text-4xl font-bold text-white sm:text-5xl">
          Ülj le valakivel, aki valóban odafigyel.
        </h1>
        <p className="mt-6 max-w-xl text-lg text-primary-100">
          Online vagy személyesen, a hozzád illő szakemberrel — válassz
          időpontot, és a naptáramban azonnal látod, mikor van szabad hely.
        </p>
      </Section>

      <Section variant="light">
        <div className="text-center">
          <h2 className="font-heading text-2xl font-bold text-primary-950 sm:text-3xl">
            Ismerős valamelyik?
          </h2>
        </div>
        <div className="mt-10 grid gap-6 sm:grid-cols-3">
          {PROBLEMS.map((p) => (
            <Card key={p.title}>
              <p.icon className="h-7 w-7 text-accent-500" strokeWidth={1.5} />
              <h3 className="mt-4 font-heading text-base font-bold text-primary-950">
                {p.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-neutral-600">{p.description}</p>
            </Card>
          ))}
        </div>
      </Section>

      <Section variant="muted" id="szakemberek">
        <div className="text-center">
          <h2 className="font-heading text-2xl font-bold text-primary-950 sm:text-3xl">
            Válaszd ki a szakembert
          </h2>
          <p className="mt-3 text-neutral-600">
            Mindannyian ugyanazzal a bizalommal és odafigyeléssel dolgozunk —
            a jelenlétünk és a hangsúlyaink különböznek.
          </p>
        </div>

        <div className="mt-12 grid gap-6 lg:grid-cols-3">
          {practitioners.map((practitioner) => (
            <Card key={practitioner.id} className="flex flex-col">
              <div className="flex items-center gap-4">
                <PersonAvatar name={practitioner.name} photoUrl={practitioner.photoUrl} size={64} />
                <div>
                  <h3 className="font-heading text-lg font-bold text-primary-950">
                    {practitioner.name}
                  </h3>
                  {practitioner.title ? (
                    <p className="text-sm text-neutral-500">{practitioner.title}</p>
                  ) : null}
                </div>
              </div>
              <p className="mt-4 grow text-sm leading-relaxed text-neutral-600">
                {practitioner.bio}
              </p>
              <ul className="mt-4 space-y-1.5 border-t border-neutral-200 pt-4">
                {practitioner.services.map((service) => (
                  <li key={service.id} className="flex items-center justify-between text-sm">
                    <span className="text-neutral-700">{service.name}</span>
                    <span className="font-semibold text-primary-800">
                      {formatHUF(service.priceHUF)}
                    </span>
                  </li>
                ))}
              </ul>
              <Button href={`/konzultacio/foglalas/${practitioner.slug}`} className="mt-6 w-full">
                Időpontot foglalok
              </Button>
            </Card>
          ))}
        </div>
      </Section>

      <Section variant="light" narrow>
        <h2 className="text-center font-heading text-2xl font-bold text-primary-950 sm:text-3xl">
          Gyakori kérdések
        </h2>
        <div className="mt-8">
          <FaqAccordion items={FAQ_ITEMS} />
        </div>
      </Section>

      <Section variant="dark" className="text-center">
        <h2 className="font-heading text-2xl font-bold text-white sm:text-3xl">
          Foglald le az időpontod most
        </h2>
        <Button href="#szakemberek" size="lg" className="mt-6">
          Foglalj konzultációt
        </Button>
      </Section>
    </>
  );
}
