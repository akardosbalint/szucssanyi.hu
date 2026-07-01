import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Section } from "@/components/ui/Section";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { formatDateTime, formatHUF } from "@/lib/format";
import { prisma } from "@/lib/prisma";
import { getEventSpotsLeft } from "@/lib/events";
import { registerForEventAction } from "@/actions/events";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ eventSlug: string }>;
}): Promise<Metadata> {
  const { eventSlug } = await params;
  const event = await prisma.event.findUnique({ where: { slug: eventSlug } });
  if (!event) return {};
  return { title: `Jelentkezés — ${event.title}`, robots: { index: false } };
}

export default async function EventRegistrationPage({
  params,
}: {
  params: Promise<{ eventSlug: string }>;
}) {
  const { eventSlug } = await params;

  const event = await prisma.event.findUnique({ where: { slug: eventSlug } });
  if (!event || !event.active) notFound();

  const spotsLeft = await getEventSpotsLeft(event.id);

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
          <form action={registerForEventAction} className="space-y-3">
            <input type="hidden" name="eventId" value={event.id} />
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
            <textarea
              name="note"
              rows={3}
              placeholder="Megjegyzés (opcionális)"
              className="w-full rounded-xl border border-neutral-300 px-4 py-2.5 text-sm focus:border-primary-400 focus:outline-none focus:ring-2 focus:ring-primary-200"
            />
            <p className="text-xs text-neutral-500">
              A helyed {formatHUF(event.priceHUF)} áron, a következő lépésben
              biztonságos bankkártyás fizetéssel (Stripe) tudod
              véglegesíteni. Fizetésig a helyet 30 percig tartjuk fenn.
            </p>
            <button
              type="submit"
              className="w-full rounded-full bg-accent-500 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-accent-600"
            >
              Tovább a fizetéshez
            </button>
          </form>
        )}
      </Card>
    </Section>
  );
}
