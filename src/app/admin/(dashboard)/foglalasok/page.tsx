import type { Metadata } from "next";
import type { Prisma, BookingStatus } from "@prisma/client";
import { requireStaff } from "@/lib/admin-guard";
import { prisma } from "@/lib/prisma";
import { formatDateTime, formatHUF } from "@/lib/format";
import { ManualBookingForm } from "@/components/admin/ManualBookingForm";
import { BookingRowActions } from "@/components/admin/BookingRowActions";

export const metadata: Metadata = { title: "Foglalások", robots: { index: false } };

const STATUS_LABELS: Record<string, string> = {
  PENDING_PAYMENT: "Fizetésre vár",
  CONFIRMED: "Visszaigazolva",
  CANCELLED: "Lemondva",
  COMPLETED: "Lezajlott",
};

export default async function AdminBookingsPage({
  searchParams,
}: {
  searchParams: Promise<{ statusz?: string; szakember?: string }>;
}) {
  const session = await requireStaff();
  const { statusz, szakember } = await searchParams;
  const isAdmin = session.user.role === "ADMIN";

  const practitioners = await prisma.practitioner.findMany({
    where: isAdmin ? { active: true } : { id: session.user.practitionerId ?? "__none__" },
    orderBy: { order: "asc" },
    include: { services: { where: { active: true }, orderBy: { order: "asc" } } },
  });

  const where: Prisma.BookingWhereInput = {};
  if (!isAdmin) where.practitionerId = session.user.practitionerId ?? "__none__";
  else if (szakember) where.practitionerId = szakember;
  if (statusz) where.status = statusz as BookingStatus;

  const bookings = await prisma.booking.findMany({
    where,
    orderBy: { startTime: "desc" },
    take: 100,
    include: { practitioner: true, service: true },
  });

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-heading text-2xl font-bold text-primary-950">Foglalások</h1>
        <p className="text-sm text-neutral-500">
          Jövőbeli/lezajlott/lemondott foglalások áttekintése és kézi rögzítése.
        </p>
      </div>

      <div className="rounded-2xl border border-neutral-200 bg-white p-6">
        <h2 className="font-heading text-base font-bold text-primary-950">Kézi foglalás rögzítése</h2>
        <p className="mt-1 text-sm text-neutral-500">
          Pl. telefonon egyeztetett időpont — ez azonnal visszaigazoltnak számít.
        </p>
        <div className="mt-4">
          <ManualBookingForm practitioners={practitioners} />
        </div>
      </div>

      <form className="flex flex-wrap gap-3">
        {isAdmin ? (
          <select
            name="szakember"
            defaultValue={szakember || ""}
            className="rounded-xl border border-neutral-300 px-4 py-2 text-sm"
          >
            <option value="">Összes szakember</option>
            {practitioners.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </select>
        ) : null}
        <select
          name="statusz"
          defaultValue={statusz || ""}
          className="rounded-xl border border-neutral-300 px-4 py-2 text-sm"
        >
          <option value="">Összes státusz</option>
          {Object.entries(STATUS_LABELS).map(([value, label]) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </select>
        <button
          type="submit"
          className="rounded-xl bg-neutral-800 px-4 py-2 text-sm font-semibold text-white hover:bg-neutral-900"
        >
          Szűrés
        </button>
      </form>

      <div className="overflow-x-auto rounded-2xl border border-neutral-200 bg-white">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-neutral-200 text-xs uppercase tracking-wide text-neutral-400">
            <tr>
              <th className="px-6 py-3 font-semibold">Ügyfél</th>
              <th className="px-6 py-3 font-semibold">Szakember / szolgáltatás</th>
              <th className="px-6 py-3 font-semibold">Időpont</th>
              <th className="px-6 py-3 font-semibold">Ár</th>
              <th className="px-6 py-3 font-semibold">Státusz</th>
              <th className="px-6 py-3 font-semibold">Műveletek</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-100">
            {bookings.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-6 py-8 text-center text-neutral-500">
                  Nincs a szűrésnek megfelelő foglalás.
                </td>
              </tr>
            ) : (
              bookings.map((booking) => (
                <tr key={booking.id}>
                  <td className="px-6 py-4">
                    <p className="font-semibold text-primary-950">{booking.customerName}</p>
                    <p className="text-xs text-neutral-500">{booking.customerEmail}</p>
                  </td>
                  <td className="px-6 py-4 text-neutral-600">
                    {booking.practitioner.name} · {booking.service.name}
                  </td>
                  <td className="px-6 py-4 text-neutral-600">{formatDateTime(booking.startTime)}</td>
                  <td className="px-6 py-4 text-neutral-600">{formatHUF(booking.service.priceHUF)}</td>
                  <td className="px-6 py-4">
                    <span className="rounded-full bg-neutral-100 px-2.5 py-1 text-xs font-semibold text-neutral-700">
                      {STATUS_LABELS[booking.status] ?? booking.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <BookingRowActions bookingId={booking.id} status={booking.status} />
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
