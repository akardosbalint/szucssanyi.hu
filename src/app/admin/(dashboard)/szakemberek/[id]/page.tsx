import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { requireAdmin } from "@/lib/admin-guard";
import { prisma } from "@/lib/prisma";
import { formatHUF } from "@/lib/format";
import { PractitionerEditForm } from "@/components/admin/PractitionerEditForm";
import { ServiceForm } from "@/components/admin/ServiceForm";
import { ToggleActiveButton } from "@/components/admin/ToggleActiveButton";
import { toggleServiceActiveAction } from "@/actions/admin/practitioners";

export const metadata: Metadata = { title: "Szakember szerkesztése", robots: { index: false } };

export default async function AdminPractitionerDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await requireAdmin();
  const { id } = await params;

  const practitioner = await prisma.practitioner.findUnique({
    where: { id },
    include: { services: { orderBy: { order: "asc" } } },
  });
  if (!practitioner) notFound();

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-heading text-2xl font-bold text-primary-950">{practitioner.name}</h1>
          <p className="text-sm text-neutral-500">Adatok, szolgáltatások, elérhetőség kezelése.</p>
        </div>
        <Link
          href={`/admin/szakemberek/${practitioner.id}/elerhetoseg`}
          className="rounded-full border border-primary-300 px-4 py-2 text-sm font-semibold text-primary-700 hover:bg-primary-50"
        >
          Elérhetőség kezelése
        </Link>
      </div>

      <div className="rounded-2xl border border-neutral-200 bg-white p-6">
        <h2 className="font-heading text-base font-bold text-primary-950">Adatok</h2>
        <div className="mt-4">
          <PractitionerEditForm practitioner={practitioner} />
        </div>
      </div>

      <div className="rounded-2xl border border-neutral-200 bg-white p-6">
        <h2 className="font-heading text-base font-bold text-primary-950">Szolgáltatások</h2>
        <div className="mt-4 divide-y divide-neutral-100">
          {practitioner.services.map((service) => (
            <div key={service.id} className="flex items-center justify-between py-3 text-sm">
              <div>
                <p className="font-semibold text-primary-950">{service.name}</p>
                <p className="text-xs text-neutral-500">
                  {service.mode === "ONLINE" ? "Online" : "Személyes"} · {service.durationMinutes} perc ·{" "}
                  {formatHUF(service.priceHUF)}
                </p>
              </div>
              <ToggleActiveButton
                active={service.active}
                action={toggleServiceActiveAction.bind(null, service.id)}
              />
            </div>
          ))}
        </div>
        <div className="mt-6 border-t border-neutral-100 pt-6">
          <ServiceForm practitionerId={practitioner.id} />
        </div>
      </div>
    </div>
  );
}
