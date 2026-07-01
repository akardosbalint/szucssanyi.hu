import type { Metadata } from "next";
import Link from "next/link";
import { requireAdmin } from "@/lib/admin-guard";
import { prisma } from "@/lib/prisma";
import { createPractitionerAction, togglePractitionerActiveAction } from "@/actions/admin/practitioners";
import { PersonAvatar } from "@/components/ui/PersonAvatar";
import { ToggleActiveButton } from "@/components/admin/ToggleActiveButton";

export const metadata: Metadata = { title: "Szakemberek", robots: { index: false } };

export default async function AdminPractitionersPage({
  searchParams,
}: {
  searchParams: Promise<{ hiba?: string }>;
}) {
  await requireAdmin();
  const { hiba } = await searchParams;

  const practitioners = await prisma.practitioner.findMany({
    orderBy: { order: "asc" },
    include: { services: true },
  });

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-heading text-2xl font-bold text-primary-950">Szakemberek</h1>
        <p className="text-sm text-neutral-500">
          Új munkatárs felvétele automatikusan megjelenik a publikus Konzultáció oldalon.
        </p>
      </div>

      <div className="overflow-hidden rounded-2xl border border-neutral-200 bg-white">
        <div className="divide-y divide-neutral-100">
          {practitioners.map((p) => (
            <div key={p.id} className="flex items-center justify-between gap-4 px-6 py-4">
              <div className="flex items-center gap-3">
                <PersonAvatar name={p.name} photoUrl={p.photoUrl} size={40} />
                <div>
                  <Link
                    href={`/admin/szakemberek/${p.id}`}
                    className="font-semibold text-primary-950 hover:underline"
                  >
                    {p.name}
                  </Link>
                  <p className="text-xs text-neutral-500">
                    {p.services.length} szolgáltatás · {p.active ? "Aktív" : "Inaktív"}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <Link
                  href={`/admin/szakemberek/${p.id}/elerhetoseg`}
                  className="text-xs font-semibold text-primary-700 hover:underline"
                >
                  Elérhetőség
                </Link>
                <ToggleActiveButton
                  active={p.active}
                  action={togglePractitionerActiveAction.bind(null, p.id)}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-2xl border border-neutral-200 bg-white p-6">
        <h2 className="font-heading text-base font-bold text-primary-950">Új szakember felvétele</h2>
        {hiba ? <p className="mt-2 text-sm text-red-600">Kérlek, ellenőrizd a megadott adatokat.</p> : null}
        <form action={createPractitionerAction} className="mt-4 grid gap-3 sm:grid-cols-2">
          <input
            type="text"
            name="name"
            required
            placeholder="Név"
            className="rounded-xl border border-neutral-300 px-4 py-2.5 text-sm"
          />
          <input
            type="text"
            name="slug"
            required
            placeholder="slug (pl. kata)"
            className="rounded-xl border border-neutral-300 px-4 py-2.5 text-sm"
          />
          <input
            type="text"
            name="title"
            placeholder="Titulus (opcionális)"
            className="rounded-xl border border-neutral-300 px-4 py-2.5 text-sm sm:col-span-2"
          />
          <textarea
            name="bio"
            required
            rows={3}
            placeholder="Rövid bemutatkozás"
            className="rounded-xl border border-neutral-300 px-4 py-2.5 text-sm sm:col-span-2"
          />
          <input
            type="text"
            name="photoUrl"
            placeholder="Fotó URL (opcionális)"
            className="rounded-xl border border-neutral-300 px-4 py-2.5 text-sm sm:col-span-2"
          />
          <button
            type="submit"
            className="rounded-full bg-primary-700 px-6 py-2.5 text-sm font-semibold text-white hover:bg-primary-800 sm:col-span-2"
          >
            Hozzáadás
          </button>
        </form>
      </div>
    </div>
  );
}
