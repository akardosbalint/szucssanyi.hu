import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { requireStaff } from "@/lib/admin-guard";
import { prisma } from "@/lib/prisma";
import { formatDate } from "@/lib/format";
import { WEEKDAYS } from "@/lib/weekdays";
import {
  AvailabilityRuleForm,
  AvailabilityExceptionForm,
} from "@/components/admin/AvailabilityForms";
import { DeleteButton } from "@/components/admin/DeleteButton";
import {
  deleteAvailabilityRuleAction,
  deleteAvailabilityExceptionAction,
} from "@/actions/admin/practitioners";

export const metadata: Metadata = { title: "Elérhetőség kezelése", robots: { index: false } };

export default async function AdminAvailabilityPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await requireStaff();
  const { id } = await params;

  if (session.user.role !== "ADMIN" && session.user.practitionerId !== id) {
    notFound();
  }

  const practitioner = await prisma.practitioner.findUnique({
    where: { id },
    include: {
      availabilityRules: { orderBy: { weekday: "asc" } },
      availabilityExceptions: { orderBy: { date: "asc" }, where: { date: { gte: new Date() } } },
    },
  });
  if (!practitioner) notFound();

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-heading text-2xl font-bold text-primary-950">
          {practitioner.name} — elérhetőség
        </h1>
        <p className="text-sm text-neutral-500">
          A heti visszatérő szabályokból számolja a rendszer a publikusan foglalható
          időpontokat. Az itt tett módosítás azonnal tükröződik a publikus foglalási
          felületen.
        </p>
      </div>

      <div className="rounded-2xl border border-neutral-200 bg-white p-6">
        <h2 className="font-heading text-base font-bold text-primary-950">
          Heti visszatérő elérhetőség
        </h2>
        <div className="mt-4 divide-y divide-neutral-100">
          {practitioner.availabilityRules.length === 0 ? (
            <p className="py-3 text-sm text-neutral-500">Még nincs beállítva heti elérhetőség.</p>
          ) : (
            practitioner.availabilityRules.map((rule) => (
              <div key={rule.id} className="flex items-center justify-between py-3 text-sm">
                <span className="text-primary-950">
                  {WEEKDAYS[rule.weekday]}: {rule.startTime}–{rule.endTime}
                </span>
                <DeleteButton action={deleteAvailabilityRuleAction.bind(null, rule.id)} />
              </div>
            ))
          )}
        </div>
        <div className="mt-6 border-t border-neutral-100 pt-6">
          <AvailabilityRuleForm practitionerId={practitioner.id} />
        </div>
      </div>

      <div className="rounded-2xl border border-neutral-200 bg-white p-6">
        <h2 className="font-heading text-base font-bold text-primary-950">
          Egyedi kivételek (szabadnap / egyedi nyitvatartás)
        </h2>
        <div className="mt-4 divide-y divide-neutral-100">
          {practitioner.availabilityExceptions.length === 0 ? (
            <p className="py-3 text-sm text-neutral-500">Nincs jövőbeli kivétel rögzítve.</p>
          ) : (
            practitioner.availabilityExceptions.map((exception) => (
              <div key={exception.id} className="flex items-center justify-between py-3 text-sm">
                <span className="text-primary-950">
                  {formatDate(exception.date)} —{" "}
                  {exception.type === "CLOSED"
                    ? "Szabadnap"
                    : `Egyedi nyitvatartás: ${exception.startTime}–${exception.endTime}`}
                </span>
                <DeleteButton action={deleteAvailabilityExceptionAction.bind(null, exception.id)} />
              </div>
            ))
          )}
        </div>
        <div className="mt-6 border-t border-neutral-100 pt-6">
          <AvailabilityExceptionForm practitionerId={practitioner.id} />
        </div>
      </div>
    </div>
  );
}
