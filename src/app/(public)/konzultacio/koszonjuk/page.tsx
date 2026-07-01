import type { Metadata } from "next";
import { CheckCircle2, Clock } from "lucide-react";
import { Section } from "@/components/ui/Section";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { prisma } from "@/lib/prisma";
import { formatDateTime } from "@/lib/format";

export const metadata: Metadata = {
  title: "Köszönjük a foglalást",
  robots: { index: false },
};

export default async function BookingThankYouPage({
  searchParams,
}: {
  searchParams: Promise<{
    session_id?: string;
    dummy?: string;
    nev?: string;
    szakember?: string;
    szolgaltatas?: string;
    idopont?: string;
  }>;
}) {
  const { session_id: sessionId, dummy, nev, szakember, szolgaltatas, idopont } = await searchParams;

  // IDEIGLENES (bemutatási céllal): a Konzultáció/időpontfoglalás jelenleg
  // adatbázis és Stripe nélkül működik — lásd src/actions/booking-dummy.ts.
  if (dummy === "1") {
    return (
      <Section variant="muted" narrow className="pt-20 sm:pt-28 text-center">
        <CheckCircle2 className="mx-auto h-14 w-14 text-primary-600" strokeWidth={1.5} />
        <h1 className="mt-6 font-heading text-2xl font-bold text-primary-950 sm:text-3xl">
          Visszaigazoltuk a foglalásod!
        </h1>
        <p className="mt-3 text-neutral-600">
          {nev ? `Köszönjük, ${nev}! ` : ""}Visszaigazoló e-mailt küldtünk a megadott címre.
        </p>
        <Card className="mx-auto mt-8 max-w-sm text-left">
          <div className="flex justify-between text-sm">
            <span className="text-neutral-500">Szakember</span>
            <span className="font-semibold text-primary-950">{szakember}</span>
          </div>
          <div className="mt-2 flex justify-between text-sm">
            <span className="text-neutral-500">Szolgáltatás</span>
            <span className="font-semibold text-primary-950">{szolgaltatas}</span>
          </div>
          <div className="mt-2 flex justify-between text-sm">
            <span className="text-neutral-500">Időpont</span>
            <span className="font-semibold text-primary-950">{idopont}</span>
          </div>
        </Card>
      </Section>
    );
  }

  const payment = sessionId
    ? await prisma.payment.findUnique({
        where: { stripeCheckoutSessionId: sessionId },
        include: { booking: { include: { practitioner: true, service: true } } },
      })
    : null;

  const booking = payment?.booking;

  return (
    <Section variant="muted" narrow className="pt-20 sm:pt-28 text-center">
      {booking?.status === "CONFIRMED" ? (
        <>
          <CheckCircle2 className="mx-auto h-14 w-14 text-primary-600" strokeWidth={1.5} />
          <h1 className="mt-6 font-heading text-2xl font-bold text-primary-950 sm:text-3xl">
            Visszaigazoltuk a foglalásod!
          </h1>
          <p className="mt-3 text-neutral-600">
            Visszaigazoló e-mailt küldtünk a megadott címre.
          </p>
          <Card className="mx-auto mt-8 max-w-sm text-left">
            <div className="flex justify-between text-sm">
              <span className="text-neutral-500">Szakember</span>
              <span className="font-semibold text-primary-950">{booking.practitioner.name}</span>
            </div>
            <div className="mt-2 flex justify-between text-sm">
              <span className="text-neutral-500">Szolgáltatás</span>
              <span className="font-semibold text-primary-950">{booking.service.name}</span>
            </div>
            <div className="mt-2 flex justify-between text-sm">
              <span className="text-neutral-500">Időpont</span>
              <span className="font-semibold text-primary-950">
                {formatDateTime(booking.startTime)}
              </span>
            </div>
          </Card>
          <a
            href={`/foglalas/${booking.manageToken}`}
            className="mt-4 inline-block text-sm text-primary-700 underline underline-offset-2"
          >
            Foglalás kezelése / lemondása
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
