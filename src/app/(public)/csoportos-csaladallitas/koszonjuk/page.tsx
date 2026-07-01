import type { Metadata } from "next";
import { CheckCircle2, Clock } from "lucide-react";
import { Section } from "@/components/ui/Section";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { formatDateTime } from "@/lib/format";
import { prisma } from "@/lib/prisma";

export const metadata: Metadata = {
  title: "Köszönjük a jelentkezést",
  robots: { index: false },
};

export default async function EventRegistrationThankYouPage({
  searchParams,
}: {
  searchParams: Promise<{
    session_id?: string;
    dummy?: string;
    nev?: string;
    esemeny?: string;
    idopont?: string;
    helyszin?: string;
  }>;
}) {
  const { session_id: sessionId, dummy, nev, esemeny, idopont, helyszin } = await searchParams;

  // IDEIGLENES (bemutatási céllal): a jelentkezés jelenleg adatbázis és
  // Stripe nélkül működik — lásd src/actions/events-dummy.ts.
  if (dummy === "1") {
    return (
      <Section variant="muted" narrow className="pt-20 sm:pt-28 text-center">
        <CheckCircle2 className="mx-auto h-14 w-14 text-primary-600" strokeWidth={1.5} />
        <h1 className="mt-6 font-heading text-2xl font-bold text-primary-950 sm:text-3xl">
          Visszaigazoltuk a jelentkezésed!
        </h1>
        <p className="mt-3 text-neutral-600">
          {nev ? `Köszönjük, ${nev}! ` : ""}Visszaigazoló e-mailt küldtünk a
          megadott címre, benne a pontos helyszínnel.
        </p>
        <Card className="mx-auto mt-8 max-w-sm text-left">
          <div className="flex justify-between text-sm">
            <span className="text-neutral-500">Esemény</span>
            <span className="font-semibold text-primary-950">{esemeny}</span>
          </div>
          <div className="mt-2 flex justify-between text-sm">
            <span className="text-neutral-500">Időpont</span>
            <span className="font-semibold text-primary-950">{idopont}</span>
          </div>
          <div className="mt-2 flex justify-between text-sm">
            <span className="text-neutral-500">Helyszín</span>
            <span className="font-semibold text-primary-950">{helyszin}</span>
          </div>
        </Card>
      </Section>
    );
  }

  const payment = sessionId
    ? await prisma.payment.findUnique({
        where: { stripeCheckoutSessionId: sessionId },
        include: { eventRegistration: { include: { event: true } } },
      })
    : null;

  const registration = payment?.eventRegistration;

  return (
    <Section variant="muted" narrow className="pt-20 sm:pt-28 text-center">
      {registration?.status === "CONFIRMED" ? (
        <>
          <CheckCircle2 className="mx-auto h-14 w-14 text-primary-600" strokeWidth={1.5} />
          <h1 className="mt-6 font-heading text-2xl font-bold text-primary-950 sm:text-3xl">
            Visszaigazoltuk a jelentkezésed!
          </h1>
          <p className="mt-3 text-neutral-600">
            Visszaigazoló e-mailt küldtünk a megadott címre, benne a pontos
            helyszínnel.
          </p>
          <Card className="mx-auto mt-8 max-w-sm text-left">
            <div className="flex justify-between text-sm">
              <span className="text-neutral-500">Esemény</span>
              <span className="font-semibold text-primary-950">
                {registration.event.title}
              </span>
            </div>
            <div className="mt-2 flex justify-between text-sm">
              <span className="text-neutral-500">Időpont</span>
              <span className="font-semibold text-primary-950">
                {formatDateTime(registration.event.startTime)}
              </span>
            </div>
          </Card>
          <a
            href={`/csoportos-csaladallitas/kezeles/${registration.manageToken}`}
            className="mt-4 inline-block text-sm text-primary-700 underline underline-offset-2"
          >
            Jelentkezés kezelése / lemondása
          </a>
        </>
      ) : (
        <>
          <Clock className="mx-auto h-14 w-14 text-primary-400" strokeWidth={1.5} />
          <h1 className="mt-6 font-heading text-2xl font-bold text-primary-950 sm:text-3xl">
            A fizetésed feldolgozás alatt áll
          </h1>
          <p className="mt-3 text-neutral-600">
            Ha ez az üzenet nem tűnik el pár percen belül, nézd meg a
            postafiókod, vagy vedd fel velünk a kapcsolatot.
          </p>
          <Button href="/kapcsolat" variant="outline" className="mt-6">
            Kapcsolat
          </Button>
        </>
      )}
    </Section>
  );
}
