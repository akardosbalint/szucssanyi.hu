import type { Metadata } from "next";
import { CheckCircle2 } from "lucide-react";
import { Section } from "@/components/ui/Section";
import { Badge } from "@/components/ui/Badge";
import { sendContactMessageAction } from "@/actions/contact";

export const metadata: Metadata = {
  title: "Kapcsolat",
  description: "Vedd fel a kapcsolatot Szűcs Sándorral kérdés vagy egyeztetés esetén.",
};

export default async function ContactPage({
  searchParams,
}: {
  searchParams: Promise<{ siker?: string; hiba?: string }>;
}) {
  const { siker, hiba } = await searchParams;

  return (
    <Section variant="muted" narrow className="pt-20 sm:pt-28">
      <Badge>Kapcsolat</Badge>
      <h1 className="mt-6 font-heading text-3xl font-bold text-primary-950 sm:text-4xl">
        Kérdésed van? Vedd fel velem a kapcsolatot.
      </h1>
      <p className="mt-3 text-neutral-600">
        Az üzeneted elküldését követően pár munkanapon belül válaszolok.
      </p>

      {siker ? (
        <div className="mt-8 flex items-center gap-3 rounded-2xl bg-white px-6 py-5 shadow-sm shadow-neutral-900/5">
          <CheckCircle2 className="h-6 w-6 shrink-0 text-primary-600" />
          <p className="text-sm text-neutral-700">
            Köszönöm az üzeneted! Hamarosan válaszolok.
          </p>
        </div>
      ) : (
        <form action={sendContactMessageAction} className="mt-8 space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <input
              type="text"
              name="name"
              required
              placeholder="Keresztnév"
              className="rounded-xl border border-neutral-300 bg-white px-4 py-3 text-sm focus:border-primary-400 focus:outline-none focus:ring-2 focus:ring-primary-200"
            />
            <input
              type="email"
              name="email"
              required
              placeholder="E-mail cím"
              className="rounded-xl border border-neutral-300 bg-white px-4 py-3 text-sm focus:border-primary-400 focus:outline-none focus:ring-2 focus:ring-primary-200"
            />
          </div>
          <textarea
            name="message"
            required
            rows={6}
            placeholder="Üzenet"
            className="w-full rounded-xl border border-neutral-300 bg-white px-4 py-3 text-sm focus:border-primary-400 focus:outline-none focus:ring-2 focus:ring-primary-200"
          />
          {hiba ? (
            <p className="text-sm text-red-600">
              Kérlek, ellenőrizd a megadott adatokat, és próbáld újra.
            </p>
          ) : null}
          <button
            type="submit"
            className="rounded-full bg-primary-600 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-primary-700"
          >
            Elküldöm
          </button>
        </form>
      )}
    </Section>
  );
}
