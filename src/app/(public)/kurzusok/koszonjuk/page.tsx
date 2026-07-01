import type { Metadata } from "next";
import { CheckCircle2, Clock } from "lucide-react";
import { Section } from "@/components/ui/Section";
import { Button } from "@/components/ui/Button";
import { prisma } from "@/lib/prisma";

export const metadata: Metadata = {
  title: "Köszönjük a vásárlást",
  robots: { index: false },
};

export default async function CourseThankYouPage({
  searchParams,
}: {
  searchParams: Promise<{
    session_id?: string;
    dummy?: string;
    kurzus?: string;
    cim?: string;
    nev?: string;
  }>;
}) {
  const { session_id: sessionId, dummy, kurzus, cim, nev } = await searchParams;

  // IDEIGLENES (bemutatási céllal): a kurzus-vásárlás jelenleg adatbázis
  // és Stripe nélkül működik — lásd src/actions/courses-dummy.ts.
  if (dummy === "1") {
    return (
      <Section variant="muted" narrow className="pt-20 sm:pt-28 text-center">
        <CheckCircle2 className="mx-auto h-14 w-14 text-primary-600" strokeWidth={1.5} />
        <h1 className="mt-6 font-heading text-2xl font-bold text-primary-950 sm:text-3xl">
          Sikeres vásárlás — {cim}
        </h1>
        <p className="mt-3 text-neutral-600">
          {nev ? `Köszönjük, ${nev}! ` : ""}Visszaigazoló e-mailt küldtünk a
          hozzáférési linkeddel. A kurzus azonnal elérhető.
        </p>
        <Button
          href={`/kurzusok/hozzaferes/demo/${kurzus}${nev ? `?nev=${encodeURIComponent(nev)}` : ""}`}
          size="lg"
          className="mt-6"
        >
          Ugrás a kurzushoz
        </Button>
      </Section>
    );
  }

  const payment = sessionId
    ? await prisma.payment.findUnique({
        where: { stripeCheckoutSessionId: sessionId },
        include: { coursePurchase: { include: { course: true } } },
      })
    : null;

  const purchase = payment?.coursePurchase;

  return (
    <Section variant="muted" narrow className="pt-20 sm:pt-28 text-center">
      {purchase?.status === "CONFIRMED" ? (
        <>
          <CheckCircle2 className="mx-auto h-14 w-14 text-primary-600" strokeWidth={1.5} />
          <h1 className="mt-6 font-heading text-2xl font-bold text-primary-950 sm:text-3xl">
            Sikeres vásárlás — {purchase.course.title}
          </h1>
          <p className="mt-3 text-neutral-600">
            Visszaigazoló e-mailt küldtünk a hozzáférési linkeddel. A kurzus
            azonnal elérhető.
          </p>
          <Button href={`/kurzusok/hozzaferes/${purchase.accessToken}`} size="lg" className="mt-6">
            Ugrás a kurzushoz
          </Button>
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
