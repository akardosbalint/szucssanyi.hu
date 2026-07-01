import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Section } from "@/components/ui/Section";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { prisma } from "@/lib/prisma";
import { formatDateTime, formatHUF } from "@/lib/format";
import { CancelEventRegistrationButton } from "@/components/booking/CancelEventRegistrationButton";

export const metadata: Metadata = {
  title: "Jelentkezésed kezelése",
  robots: { index: false },
};

const STATUS_LABELS: Record<string, string> = {
  PENDING_PAYMENT: "Fizetésre vár",
  CONFIRMED: "Visszaigazolva",
  CANCELLED: "Lemondva",
  COMPLETED: "Lezajlott",
};

export default async function ManageEventRegistrationPage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = await params;

  const registration = await prisma.eventRegistration.findUnique({
    where: { manageToken: token },
    include: { event: true },
  });

  if (!registration) notFound();

  return (
    <Section variant="muted" narrow className="pt-20 sm:pt-28">
      <Badge>Jelentkezésed</Badge>
      <h1 className="mt-4 font-heading text-2xl font-bold text-primary-950 sm:text-3xl">
        {registration.customerName}, itt kezelheted a jelentkezésed
      </h1>

      <Card className="mt-8 space-y-3">
        <div className="flex justify-between text-sm">
          <span className="text-neutral-500">Esemény</span>
          <span className="font-semibold text-primary-950">{registration.event.title}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-neutral-500">Időpont</span>
          <span className="font-semibold text-primary-950">
            {formatDateTime(registration.event.startTime)}
          </span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-neutral-500">Ár</span>
          <span className="font-semibold text-primary-950">
            {formatHUF(registration.event.priceHUF)}
          </span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-neutral-500">Státusz</span>
          <span className="font-semibold text-primary-950">
            {STATUS_LABELS[registration.status] ?? registration.status}
          </span>
        </div>

        {registration.status === "CONFIRMED" ? (
          <div className="border-t border-neutral-200 pt-4">
            <CancelEventRegistrationButton manageToken={registration.manageToken} />
          </div>
        ) : null}
      </Card>
    </Section>
  );
}
