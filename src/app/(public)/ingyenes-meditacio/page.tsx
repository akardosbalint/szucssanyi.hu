import type { Metadata } from "next";
import { Section } from "@/components/ui/Section";
import { Badge } from "@/components/ui/Badge";
import { subscribeLeadAction } from "@/actions/leads";

export const metadata: Metadata = {
  title: "Ingyenes vezetett meditáció",
  description:
    "Kérd az ingyenes belső gyermek meditációt Szűcs Sándortól — vezetett gyakorlat, ami visszarepít a sérült gyermeki részedhez.",
};

export default async function FreeMeditationPage({
  searchParams,
}: {
  searchParams: Promise<{ hiba?: string }>;
}) {
  const { hiba } = await searchParams;

  return (
    <Section variant="muted" className="pt-20 sm:pt-28">
      <div className="grid items-center gap-10 sm:grid-cols-2">
        <div className="aspect-square rounded-2xl bg-gradient-to-br from-primary-100 to-primary-300" />
        <div>
          <Badge>Ingyenes meditáció</Badge>
          <h1 className="mt-6 font-heading text-3xl font-bold leading-tight text-primary-950 sm:text-4xl">
            Egy vezetett meditáció, ami visszarepít a sérült gyermeki
            részedhez
          </h1>
          <p className="mt-5 text-neutral-600">
            Kérd ezt az ingyenes meditációt, és adj meg magadnak mindazt, ami
            gyermekként hiányzott. 15 perc, amit bárhol meghallgathatsz.
          </p>

          <form action={subscribeLeadAction} className="mt-8 flex flex-col gap-3">
            <input
              type="text"
              name="name"
              required
              placeholder="Keresztnév"
              className="rounded-full border border-neutral-300 bg-white px-5 py-3 text-sm focus:border-primary-400 focus:outline-none focus:ring-2 focus:ring-primary-200"
            />
            <input
              type="email"
              name="email"
              required
              placeholder="E-mail cím"
              className="rounded-full border border-neutral-300 bg-white px-5 py-3 text-sm focus:border-primary-400 focus:outline-none focus:ring-2 focus:ring-primary-200"
            />
            <button
              type="submit"
              className="rounded-full bg-primary-600 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-primary-700"
            >
              Kérem az ingyenes meditációt
            </button>
            {hiba ? (
              <p className="text-sm text-red-600">
                Kérlek, ellenőrizd a megadott adatokat, és próbáld újra.
              </p>
            ) : null}
          </form>
          <p className="mt-3 text-xs text-neutral-400">
            A feliratkozással elfogadod az{" "}
            <a href="/adatvedelem" className="underline">
              adatvédelmi tájékoztatót
            </a>
            . Bármikor leiratkozhatsz.
          </p>
        </div>
      </div>
    </Section>
  );
}
