import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Section } from "@/components/ui/Section";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { formatDateTime, formatHUF } from "@/lib/format";
import { getDummyEventBySlug, getDummyEventSpotsLeft } from "@/lib/dummy-events";
import { registerForDummyEventAction } from "@/actions/events-dummy";

// IDEIGLENES (bemutatási céllal): az esemény-adatok beépített minta-adatok,
// nem adatbázisból jönnek — lásd src/lib/dummy-events.ts.

export async function generateMetadata({
  params,
}: {
  params: Promise<{ eventSlug: string }>;
}): Promise<Metadata> {
  const { eventSlug } = await params;
  const event = getDummyEventBySlug(eventSlug);
  if (!event) return {};
  return { title: `Jelentkezés — ${event.title}`, robots: { index: false } };
}

export default async function EventRegistrationPage({
  params,
}: {
  params: Promise<{ eventSlug: string }>;
}) {
  const { eventSlug } = await params;

  const event = getDummyEventBySlug(eventSlug);
  if (!event) notFound();

  const spotsLeft = getDummyEventSpotsLeft(event);

  return (
    <Section variant="muted" narrow className="pt-20 sm:pt-28">
      <Badge>Jelentkezés</Badge>
      <h1 className="mt-4 font-heading text-2xl font-bold text-primary-950 sm:text-3xl">
        {event.title}
      </h1>
      <p className="mt-2 text-neutral-600">
        {formatDateTime(event.startTime)} · {event.location}
      </p>

      <Card className="mt-8">
        {spotsLeft <= 0 ? (
          <p className="text-sm text-neutral-600">
            Sajnos ez az alkalom időközben betelt — nézd meg a következő
            időpontokat a csoportos családállítás oldalon.
          </p>
        ) : (
          <form action={registerForDummyEventAction} className="space-y-3">
            <input type="hidden" name="eventSlug" value={event.slug} />
            <div className="grid gap-3 sm:grid-cols-2">
              <input
                type="text"
                name="customerName"
                required
                placeholder="Teljes neved"
                className="rounded-xl border border-neutral-300 px-4 py-2.5 text-sm focus:border-primary-400 focus:outline-none focus:ring-2 focus:ring-primary-200"
              />
              <input
                type="tel"
                name="customerPhone"
                required
                placeholder="Telefonszám"
                className="rounded-xl border border-neutral-300 px-4 py-2.5 text-sm focus:border-primary-400 focus:outline-none focus:ring-2 focus:ring-primary-200"
              />
            </div>
            <input
              type="email"
              name="customerEmail"
              required
              placeholder="E-mail cím"
              className="w-full rounded-xl border border-neutral-300 px-4 py-2.5 text-sm focus:border-primary-400 focus:outline-none focus:ring-2 focus:ring-primary-200"
            />
            <p className="text-xs text-neutral-500">
              A helyed {formatHUF(event.priceHUF)} áron véglegesítjük — a
              jelentkezés elküldése után e-mailben visszaigazoljuk.
            </p>
            <button
              type="submit"
              className="w-full rounded-full bg-accent-500 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-accent-600"
            >
              Jelentkezés véglegesítése
            </button>
          </form>
        )}
      </Card>
    </Section>
  );
}
