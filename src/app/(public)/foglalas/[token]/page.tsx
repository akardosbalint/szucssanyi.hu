import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Section } from "@/components/ui/Section";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { prisma } from "@/lib/prisma";
import { formatDateTime, formatHUF } from "@/lib/format";
import { CancelBookingButton } from "@/components/booking/CancelBookingButton";

export const metadata: Metadata = {
  title: "Foglalásod kezelése",
  robots: { index: false },
};

const STATUS_LABELS: Record<string, string> = {
  PENDING_PAYMENT: "Fizetésre vár",
  CONFIRMED: "Visszaigazolva",
  CANCELLED: "Lemondva",
  COMPLETED: "Lezajlott",
};

export default async function ManageBookingPage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = await params;

  const booking = await prisma.booking.findUnique({
    where: { manageToken: token },
    include: { practitioner: true, service: true },
  });

  if (!booking) notFound();

  return (
    <Section variant="muted" narrow className="pt-20 sm:pt-28">
      <Badge>Foglalásod</Badge>
      <h1 className="mt-4 font-heading text-2xl font-bold text-primary-950 sm:text-3xl">
        {booking.customerName}, itt kezelheted a foglalásod
      </h1>

      <Card className="mt-8 space-y-3">
        <div className="flex justify-between text-sm">
          <span className="text-neutral-500">Szakember</span>
          <span className="font-semibold text-primary-950">{booking.practitioner.name}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-neutral-500">Szolgáltatás</span>
          <span className="font-semibold text-primary-950">{booking.service.name}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-neutral-500">Időpont</span>
          <span className="font-semibold text-primary-950">
            {formatDateTime(booking.startTime)}
          </span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-neutral-500">Ár</span>
          <span className="font-semibold text-primary-950">
            {formatHUF(booking.service.priceHUF)}
          </span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-neutral-500">Státusz</span>
          <span className="font-semibold text-primary-950">
            {STATUS_LABELS[booking.status] ?? booking.status}
          </span>
        </div>

        {booking.status === "CONFIRMED" ? (
          <div className="border-t border-neutral-200 pt-4">
            <CancelBookingButton manageToken={booking.manageToken} />
          </div>
        ) : null}
      </Card>
    </Section>
  );
}
