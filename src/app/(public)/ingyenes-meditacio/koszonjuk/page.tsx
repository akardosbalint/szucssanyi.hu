import type { Metadata } from "next";
import { CheckCircle2 } from "lucide-react";
import { Section } from "@/components/ui/Section";

export const metadata: Metadata = {
  title: "Köszönjük a feliratkozást",
  robots: { index: false },
};

export default function FreeMeditationThankYouPage() {
  return (
    <Section variant="muted" narrow className="pt-20 sm:pt-28 text-center">
      <CheckCircle2 className="mx-auto h-14 w-14 text-primary-600" strokeWidth={1.5} />
      <h1 className="mt-6 font-heading text-2xl font-bold text-primary-950 sm:text-3xl">
        Köszönjük, már úton van!
      </h1>
      <p className="mt-4 text-neutral-600">
        Nézd meg a postafiókod (a spam mappát is) — hamarosan megérkezik az
        e-mail a meditációval.
      </p>
    </Section>
  );
}
