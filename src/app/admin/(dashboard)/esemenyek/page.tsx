import type { Metadata } from "next";
import { requireAdmin } from "@/lib/admin-guard";
import { prisma } from "@/lib/prisma";
import { formatDateTime, formatHUF } from "@/lib/format";
import { EventForm } from "@/components/admin/EventForm";
import { ToggleActiveButton } from "@/components/admin/ToggleActiveButton";
import { DeleteButton } from "@/components/admin/DeleteButton";
import { toggleEventActiveAction, cancelEventRegistrationAdminAction } from "@/actions/admin/events";

export const metadata: Metadata = { title: "Csoportos családállítás", robots: { index: false } };

const STATUS_LABELS: Record<string, string> = {
  PENDING_PAYMENT: "Fizetésre vár",
  CONFIRMED: "Visszaigazolva",
  CANCELLED: "Lemondva",
  COMPLETED: "Lezajlott",
};

export default async function AdminEventsPage() {
  await requireAdmin();

  const events = await prisma.event.findMany({
    orderBy: { startTime: "desc" },
    include: { registrations: { orderBy: { createdAt: "desc" } } },
  });

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-heading text-2xl font-bold text-primary-950">Csoportos családállítás</h1>
        <p className="text-sm text-neutral-500">Alkalmak és jelentkezők kezelése.</p>
      </div>

      <div className="space-y-6">
        {events.map((event) => {
          const activeRegs = event.registrations.filter((r) =>
            ["PENDING_PAYMENT", "CONFIRMED"].includes(r.status),
          );
          return (
            <div key={event.id} className="rounded-2xl border border-neutral-200 bg-white p-6">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h2 className="font-heading text-base font-bold text-primary-950">{event.title}</h2>
                  <p className="text-sm text-neutral-500">
                    {formatDateTime(event.startTime)} · {event.location} · {formatHUF(event.priceHUF)}
                  </p>
                  <p className="mt-1 text-xs text-neutral-500">
                    {activeRegs.length} / {event.capacity} hely foglalt
                  </p>
                </div>
                <ToggleActiveButton
                  active={event.active}
                  action={toggleEventActiveAction.bind(null, event.id)}
                />
              </div>

              {event.registrations.length > 0 ? (
                <div className="mt-4 divide-y divide-neutral-100 border-t border-neutral-100 pt-2">
                  {event.registrations.map((reg) => (
                    <div key={reg.id} className="flex items-center justify-between py-2 text-sm">
                      <div>
                        <p className="font-medium text-primary-950">{reg.customerName}</p>
                        <p className="text-xs text-neutral-500">
                          {reg.customerEmail} · {STATUS_LABELS[reg.status] ?? reg.status}
                        </p>
                      </div>
                      {reg.status === "CONFIRMED" ? (
                        <DeleteButton
                          confirmMessage="Biztosan lemondod ezt a jelentkezést?"
                          action={cancelEventRegistrationAdminAction.bind(null, reg.id)}
                        />
                      ) : null}
                    </div>
                  ))}
                </div>
              ) : null}
            </div>
          );
        })}
      </div>

      <div className="rounded-2xl border border-neutral-200 bg-white p-6">
        <h2 className="font-heading text-base font-bold text-primary-950">Új alkalom létrehozása</h2>
        <div className="mt-4">
          <EventForm />
        </div>
      </div>
    </div>
  );
}
