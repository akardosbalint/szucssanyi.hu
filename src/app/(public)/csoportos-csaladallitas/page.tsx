import type { Metadata } from "next";
import { Section } from "@/components/ui/Section";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { TestimonialCard } from "@/components/ui/TestimonialCard";
import { formatHUF, formatDate, formatTime } from "@/lib/format";
import { prisma } from "@/lib/prisma";
import { MapPin, Users } from "lucide-react";

export const metadata: Metadata = {
  title: "Csoportos családállítás",
  description:
    "Csoportos családállítás alkalmak Budapesten — fedezd fel a családi mintáid hatását egy délután alatt. Korlátozott létszám, online jelentkezéssel.",
};

const TESTIMONIALS = [
  {
    quote:
      "Egyetlen délután alatt megértettem, miért ismétlődik ugyanaz a minta a kapcsolataimban. Azóta másképp döntök.",
    name: "Gábor, 41",
  },
  {
    quote:
      "Nem hittem volna, hogy ennyire mélyre lehet jutni egy csoportos alkalommal. Megérte minden percét.",
    name: "Zsófia, 37",
  },
];

export default async function FamilyConstellationPage() {
  const events = await prisma.event.findMany({
    where: { active: true, startTime: { gte: new Date() } },
    orderBy: { startTime: "asc" },
    include: { _count: { select: { registrations: { where: { status: "CONFIRMED" } } } } },
  });

  return (
    <>
      <Section variant="dark" className="pb-16 pt-20 sm:pt-28">
        <Badge className="bg-white/10 text-white">Csoportos családállítás</Badge>
        <h1 className="mt-6 max-w-2xl font-heading text-4xl font-bold text-white sm:text-5xl">
          Egy délután, ahol a családi mintáid láthatóvá válnak.
        </h1>
        <p className="mt-6 max-w-xl text-lg text-primary-100">
          A családállítás egy csoportos módszer, amiben a résztvevők
          segítségével olyan összefüggések válnak láthatóvá a családi
          történetedben, amikhez egyénileg nehezebb hozzáférni.
        </p>
      </Section>

      <Section variant="light" narrow>
        <h2 className="font-heading text-2xl font-bold text-primary-950">Kinek szól?</h2>
        <p className="mt-4 text-lg leading-relaxed text-neutral-600">
          Azoknak, akik érzik, hogy egy ismétlődő minta — párkapcsolati,
          szülői vagy testvéri — nem a jelenben gyökerezik, hanem valahol a
          családi történetükben. Nem kell hozzá előzetes tapasztalat, elég a
          nyitottság és a részvételi szándék.
        </p>
      </Section>

      <Section variant="muted" id="idopontok">
        <h2 className="text-center font-heading text-2xl font-bold text-primary-950 sm:text-3xl">
          Következő alkalmak
        </h2>

        <div className="mt-10 space-y-6">
          {events.length === 0 ? (
            <Card className="text-center text-neutral-600">
              Jelenleg nincs meghirdetett alkalom — írj a kapcsolat oldalon, és
              értesítünk, amint lesz.
            </Card>
          ) : (
            events.map((event) => {
              const spotsLeft = event.capacity - event._count.registrations;
              return (
                <Card key={event.id} className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="font-heading text-lg font-bold text-primary-950">
                      {formatDate(event.startTime)}
                    </p>
                    <p className="mt-1 text-sm text-neutral-600">
                      {formatTime(event.startTime)}–{formatTime(event.endTime)}
                    </p>
                    <p className="mt-2 flex items-center gap-1.5 text-sm text-neutral-500">
                      <MapPin className="h-4 w-4" /> {event.location}
                    </p>
                    <p className="mt-1 flex items-center gap-1.5 text-sm text-neutral-500">
                      <Users className="h-4 w-4" />
                      {spotsLeft > 0
                        ? `${spotsLeft} szabad hely a ${event.capacity}-ből`
                        : "Betelt"}
                    </p>
                  </div>
                  <div className="flex flex-col items-start gap-3 sm:items-end">
                    <p className="font-heading text-2xl font-bold text-primary-800">
                      {formatHUF(event.priceHUF)}
                    </p>
                    {spotsLeft > 0 ? (
                      <Button href={`/csoportos-csaladallitas/jelentkezes/${event.slug}`}>
                        Jelentkezem az alkalomra
                      </Button>
                    ) : (
                      <Button variant="outline" className="pointer-events-none opacity-50" href="#idopontok">
                        Betelt
                      </Button>
                    )}
                  </div>
                </Card>
              );
            })
          )}
        </div>
      </Section>

      <Section variant="light">
        <h2 className="text-center font-heading text-2xl font-bold text-primary-950 sm:text-3xl">
          Amit a résztvevők mondanak
        </h2>
        <div className="mt-10 grid gap-6 sm:grid-cols-2">
          {TESTIMONIALS.map((t) => (
            <TestimonialCard key={t.name} {...t} />
          ))}
        </div>
      </Section>

      <Section variant="dark" className="text-center">
        <h2 className="font-heading text-2xl font-bold text-white sm:text-3xl">
          Foglald le a helyed a következő alkalomra
        </h2>
        <Button href="#idopontok" size="lg" className="mt-6">
          Jelentkezem az alkalomra
        </Button>
      </Section>
    </>
  );
}
