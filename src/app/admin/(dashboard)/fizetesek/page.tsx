import type { Metadata } from "next";
import { ExternalLink } from "lucide-react";
import { requireAdmin } from "@/lib/admin-guard";
import { prisma } from "@/lib/prisma";
import { formatDateTime, formatHUF } from "@/lib/format";

export const metadata: Metadata = { title: "Fizetések", robots: { index: false } };

const STATUS_LABELS: Record<string, string> = {
  PENDING: "Folyamatban",
  SUCCEEDED: "Sikeres",
  FAILED: "Sikertelen / lejárt",
  REFUNDED: "Visszatérítve",
};

function describePayment(payment: {
  booking: { customerName: string; service: { name: string } } | null;
  eventRegistration: { customerName: string; event: { title: string } } | null;
  coursePurchase: { customerName: string; course: { title: string } } | null;
}) {
  if (payment.booking) return `${payment.booking.customerName} — ${payment.booking.service.name}`;
  if (payment.eventRegistration)
    return `${payment.eventRegistration.customerName} — ${payment.eventRegistration.event.title}`;
  if (payment.coursePurchase)
    return `${payment.coursePurchase.customerName} — ${payment.coursePurchase.course.title}`;
  return "—";
}

export default async function AdminPaymentsPage() {
  await requireAdmin();

  const payments = await prisma.payment.findMany({
    orderBy: { createdAt: "desc" },
    take: 200,
    include: {
      booking: { include: { service: true } },
      eventRegistration: { include: { event: true } },
      coursePurchase: { include: { course: true } },
    },
  });

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-heading text-2xl font-bold text-primary-950">Fizetések</h1>
        <p className="text-sm text-neutral-500">
          Stripe-on keresztül teljesített fizetések (konzultáció, esemény, kurzus).
        </p>
      </div>

      <div className="overflow-x-auto rounded-2xl border border-neutral-200 bg-white">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-neutral-200 text-xs uppercase tracking-wide text-neutral-400">
            <tr>
              <th className="px-6 py-3 font-semibold">Dátum</th>
              <th className="px-6 py-3 font-semibold">Mi történt</th>
              <th className="px-6 py-3 font-semibold">Összeg</th>
              <th className="px-6 py-3 font-semibold">Státusz</th>
              <th className="px-6 py-3 font-semibold">Stripe</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-100">
            {payments.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-6 py-8 text-center text-neutral-500">
                  Még nincs rögzített fizetés.
                </td>
              </tr>
            ) : (
              payments.map((payment) => (
                <tr key={payment.id}>
                  <td className="px-6 py-4 text-neutral-600">{formatDateTime(payment.createdAt)}</td>
                  <td className="px-6 py-4 text-primary-950">{describePayment(payment)}</td>
                  <td className="px-6 py-4 font-semibold text-primary-950">
                    {formatHUF(payment.amountHUF)}
                  </td>
                  <td className="px-6 py-4">
                    <span className="rounded-full bg-neutral-100 px-2.5 py-1 text-xs font-semibold text-neutral-700">
                      {STATUS_LABELS[payment.status] ?? payment.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <a
                      href={`https://dashboard.stripe.com/test/checkout/sessions/${payment.stripeCheckoutSessionId}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 text-xs font-semibold text-primary-700 hover:underline"
                    >
                      Megnyitás <ExternalLink className="h-3.5 w-3.5" />
                    </a>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      <p className="text-xs text-neutral-400">
        Megjegyzés: a Stripe link teszt módra mutat. Éles kulcsokra váltás után
        cseréld a linket `dashboard.stripe.com/checkout/sessions/…` formára
        (lásd `src/app/admin/(dashboard)/fizetesek/page.tsx`).
      </p>
    </div>
  );
}
