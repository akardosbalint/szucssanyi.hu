import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Section } from "@/components/ui/Section";
import { Badge } from "@/components/ui/Badge";
import { PersonAvatar } from "@/components/ui/PersonAvatar";
import { prisma } from "@/lib/prisma";
import { BookingWizard } from "@/components/booking/BookingWizard";

const ERROR_MESSAGES: Record<string, string> = {
  "idopont-mar-foglalt": "Sajnos ezt az időpontot közben más lefoglalta — válassz egy másikat.",
  "ervenytelen-adat": "Kérlek, ellenőrizd a megadott adatokat, és próbáld újra.",
  "nem-talalhato": "A kiválasztott szolgáltatás nem található.",
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ practitionerSlug: string }>;
}): Promise<Metadata> {
  const { practitionerSlug } = await params;
  const practitioner = await prisma.practitioner.findUnique({ where: { slug: practitionerSlug } });
  if (!practitioner) return {};
  return {
    title: `Időpontfoglalás — ${practitioner.name}`,
    robots: { index: false },
  };
}

export default async function BookingPage({
  params,
  searchParams,
}: {
  params: Promise<{ practitionerSlug: string }>;
  searchParams: Promise<{ hiba?: string; fizetes?: string; szolgaltatas?: string }>;
}) {
  const { practitionerSlug } = await params;
  const { hiba, fizetes, szolgaltatas } = await searchParams;

  const practitioner = await prisma.practitioner.findUnique({
    where: { slug: practitionerSlug },
    include: { services: { where: { active: true }, orderBy: { order: "asc" } } },
  });

  if (!practitioner || !practitioner.active) notFound();

  return (
    <Section variant="muted" className="pt-20 sm:pt-28">
      <Badge>Időpontfoglalás</Badge>
      <div className="mt-4 flex items-center gap-4">
        <PersonAvatar name={practitioner.name} photoUrl={practitioner.photoUrl} size={56} />
        <div>
          <h1 className="font-heading text-2xl font-bold text-primary-950 sm:text-3xl">
            Foglalj időpontot — {practitioner.name}
          </h1>
          {practitioner.title ? <p className="text-sm text-neutral-500">{practitioner.title}</p> : null}
        </div>
      </div>

      <div className="mt-10 max-w-xl">
        <BookingWizard
          practitionerId={practitioner.id}
          services={practitioner.services}
          initialServiceId={szolgaltatas}
          initialErrorMessage={hiba ? ERROR_MESSAGES[hiba] : undefined}
          paymentUnavailable={fizetes === "nem-elerheto"}
        />
      </div>
    </Section>
  );
}
