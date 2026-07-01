import type { Metadata } from "next";
import Link from "next/link";
import { HeartHandshake, Users, GraduationCap, ArrowRight } from "lucide-react";
import { Section } from "@/components/ui/Section";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { TestimonialCard } from "@/components/ui/TestimonialCard";

export const metadata: Metadata = {
  title: "Holisztikus önismereti mentor Budapesten",
  description:
    "Egyéni konzultáció, csoportos családállítás és önismereti kurzusok Szűcs Sándorral. 2000+ egyéni ülés tapasztalata, valós idejű időpontfoglalással.",
};

const localBusinessJsonLd = {
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  name: "Szűcs Sándor — Holisztikus önismereti mentorálás",
  address: {
    "@type": "PostalAddress",
    addressLocality: "Budapest",
    addressCountry: "HU",
  },
  priceRange: "HUF",
  areaServed: "HU",
};

const SERVICES = [
  {
    icon: HeartHandshake,
    title: "Egyéni konzultáció",
    description:
      "Online vagy személyes ülés, ahol a saját tempódban dolgozzuk fel azt, ami most nehéz. Válassz szakembert, és foglalj időpontot pár kattintással.",
    href: "/konzultacio",
    cta: "Foglalj konzultációt",
  },
  {
    icon: Users,
    title: "Csoportos családállítás",
    description:
      "Egy délután, ahol a családi mintáid a csoport segítségével válnak láthatóvá — sokszor mélyebb belátást ad, mint hónapok magánbeszélgetése.",
    href: "/csoportos-csaladallitas",
    cta: "Jelentkezem az alkalomra",
  },
  {
    icon: GraduationCap,
    title: "Kurzusok",
    description:
      "Saját tempóban végigkövethető anyagok konkrét témákra: hiperérzékenység, párkapcsolati minták, önuralom. Egyszeri ár, örökös hozzáférés.",
    href: "/kurzusok",
    cta: "Nézd meg a kurzusokat",
  },
];

const TESTIMONIALS = [
  {
    quote:
      "Az első ülés után olyan dolgokat láttam tisztán a kapcsolatomban, amiket évek óta kerülgettem. Sándor nem mond ítéletet, csak segít odanézni.",
    name: "Nóra, 34",
    role: "Egyéni konzultáció",
  },
  {
    quote:
      "A családállításon egyetlen délután alatt megértettem, miért ismétlődik ugyanaz a minta a kapcsolataimban. Azóta másképp döntök.",
    name: "Gábor, 41",
    role: "Csoportos családállítás",
  },
  {
    quote:
      "A hiperérzékenység kurzus adott először olyan nyelvet, amivel el tudtam magyarázni a családomnak, mit érzek és miért.",
    name: "Eszter, 29",
    role: "Hiperérzékeny emberek kurzusa",
  },
];

export default function HomePage() {
  return (
    <>
      <Section variant="dark" className="pb-20 pt-20 sm:pt-28">
        <Badge className="bg-white/10 text-white">Budapest · Önismereti mentorálás</Badge>
        <h1 className="mt-6 max-w-2xl font-heading text-4xl font-bold leading-tight text-white sm:text-5xl">
          Segítek visszatalálni önmagadhoz, hogy tisztán láss, és nyugodtan merj dönteni.
        </h1>
        <p className="mt-6 max-w-xl text-lg leading-relaxed text-primary-100">
          Egyéni konzultáción, csoportos családállításon vagy önismereti kurzuson
          keresztül — azzal dolgozunk, ami most valóban visszahúz: szorongás,
          ismétlődő párkapcsolati minták vagy a saját érzéseiddel való nehéz
          viszony.
        </p>
        <div className="mt-8 flex flex-wrap gap-4">
          <Button href="/konzultacio" size="lg">
            Foglalj konzultációt
          </Button>
          <Button href="/rolam" variant="outline" size="lg" className="border-white/30 text-white hover:bg-white/10">
            Ismerd meg a módszereimet
          </Button>
        </div>
        <p className="mt-8 text-sm text-primary-300">
          2000+ egyéni ülés tapasztalata · Online és személyes konzultáció Budapesten
        </p>
      </Section>

      <Section variant="light" narrow className="text-center">
        <h2 className="font-heading text-2xl font-bold text-primary-950 sm:text-3xl">
          Szia, Szűcs Sándor vagyok.
        </h2>
        <p className="mt-6 text-lg leading-relaxed text-neutral-600">
          Több mint 2000 egyéni ülésen keresztül tanultam meg, hogy a legtöbb
          nehézségünk gyökere nem a jelenben, hanem a régen tanult mintáinkban
          van. Nem terapeutaként, hanem kísérőként dolgozom veled — konkrét
          módszerekkel, amiket magam is végigjártam. Nem ígérek varázslatot,
          de azt igen, hogy tisztábban fogsz látni a saját életedben.
        </p>
        <Link
          href="/rolam"
          className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-primary-700 hover:text-primary-800"
        >
          Tudj meg többet rólam <ArrowRight className="h-4 w-4" />
        </Link>
      </Section>

      <Section variant="muted">
        <div className="text-center">
          <h2 className="font-heading text-2xl font-bold text-primary-950 sm:text-3xl">
            Válaszd ki, hol tartasz most
          </h2>
          <p className="mt-3 text-neutral-600">Három út, egy cél: hogy tisztábban láss magadra.</p>
        </div>

        <div className="mt-12 grid gap-6 sm:grid-cols-3">
          {SERVICES.map((service) => (
            <Card key={service.title} className="flex flex-col">
              <service.icon className="h-8 w-8 text-accent-500" strokeWidth={1.5} />
              <h3 className="mt-4 font-heading text-lg font-bold text-primary-950">
                {service.title}
              </h3>
              <p className="mt-2 grow text-sm leading-relaxed text-neutral-600">
                {service.description}
              </p>
              <Button href={service.href} variant="secondary" className="mt-6 w-full">
                {service.cta}
              </Button>
            </Card>
          ))}
        </div>
      </Section>

      <Section variant="light">
        <div className="text-center">
          <h2 className="font-heading text-2xl font-bold text-primary-950 sm:text-3xl">
            Amit mások mondanak
          </h2>
        </div>
        <div className="mt-12 grid gap-6 sm:grid-cols-3">
          {TESTIMONIALS.map((t) => (
            <TestimonialCard key={t.name} {...t} />
          ))}
        </div>
      </Section>

      <Section variant="muted" narrow className="text-center">
        <h2 className="font-heading text-2xl font-bold text-primary-950 sm:text-3xl">
          Még nem állsz készen egy konzultációra?
        </h2>
        <p className="mt-4 text-neutral-600">
          Kezdd egy ingyenes, vezetett meditációval, ami visszarepít a sérült
          gyermeki részedhez — teljesen kockázatmentesen, feliratkozás után
          azonnal a postafiókodban.
        </p>
        <Button href="/ingyenes-meditacio" variant="outline" size="lg" className="mt-6">
          Kérem az ingyenes meditációt
        </Button>
      </Section>

      <Section variant="dark" className="text-center">
        <h2 className="font-heading text-3xl font-bold text-white">
          Készen állsz elkezdeni?
        </h2>
        <p className="mx-auto mt-4 max-w-lg text-primary-200">
          Foglalj időpontot most, és válaszd ki azt a szakembert és időpontot,
          ami neked a legjobban megfelel.
        </p>
        <Button href="/konzultacio" size="lg" className="mt-6">
          Foglalj konzultációt
        </Button>
      </Section>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessJsonLd) }}
      />
    </>
  );
}
