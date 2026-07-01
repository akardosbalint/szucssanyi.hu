import type { Metadata } from "next";
import { requireStaff } from "@/lib/admin-guard";
import { prisma } from "@/lib/prisma";
import { formatDateTime, formatHUF } from "@/lib/format";

export const metadata: Metadata = { title: "Áttekintés", robots: { index: false } };

export default async function AdminDashboardPage() {
  const session = await requireStaff();
  const isAdmin = session.user.role === "ADMIN";
  const practitionerFilter = isAdmin ? {} : { practitionerId: session.user.practitionerId ?? "__none__" };

  const [upcomingBookings, pendingCount, confirmedTodayCount, recentPayments] = await Promise.all([
    prisma.booking.findMany({
      where: { ...practitionerFilter, status: "CONFIRMED", startTime: { gte: new Date() } },
      orderBy: { startTime: "asc" },
      take: 8,
      include: { practitioner: true, service: true },
    }),
    prisma.booking.count({ where: { ...practitionerFilter, status: "PENDING_PAYMENT" } }),
    prisma.booking.count({
      where: {
        ...practitionerFilter,
        status: "CONFIRMED",
        startTime: { gte: new Date(new Date().setHours(0, 0, 0, 0)) },
        endTime: { lte: new Date(new Date().setHours(23, 59, 59, 999)) },
      },
    }),
    isAdmin
      ? prisma.payment.findMany({
          where: { status: "SUCCEEDED" },
          orderBy: { createdAt: "desc" },
          take: 5,
        })
      : Promise.resolve([]),
  ]);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-heading text-2xl font-bold text-primary-950">Áttekintés</h1>
        <p className="text-sm text-neutral-500">
          Szia, {session.user.name}! Itt egy gyors pillantás a mai napra.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border border-neutral-200 bg-white p-5">
          <p className="text-xs font-semibold uppercase tracking-wide text-neutral-400">
            Mai visszaigazolt foglalások
          </p>
          <p className="mt-2 font-heading text-3xl font-bold text-primary-800">
            {confirmedTodayCount}
          </p>
        </div>
        <div className="rounded-2xl border border-neutral-200 bg-white p-5">
          <p className="text-xs font-semibold uppercase tracking-wide text-neutral-400">
            Fizetésre váró foglalások
          </p>
          <p className="mt-2 font-heading text-3xl font-bold text-primary-800">{pendingCount}</p>
        </div>
        <div className="rounded-2xl border border-neutral-200 bg-white p-5">
          <p className="text-xs font-semibold uppercase tracking-wide text-neutral-400">
            Következő 8 foglalás
          </p>
          <p className="mt-2 font-heading text-3xl font-bold text-primary-800">
            {upcomingBookings.length}
          </p>
        </div>
      </div>

      <div className="rounded-2xl border border-neutral-200 bg-white">
        <div className="border-b border-neutral-200 px-6 py-4">
          <h2 className="font-heading text-base font-bold text-primary-950">Közelgő foglalások</h2>
        </div>
        <div className="divide-y divide-neutral-100">
          {upcomingBookings.length === 0 ? (
            <p className="px-6 py-6 text-sm text-neutral-500">Nincs közelgő visszaigazolt foglalás.</p>
          ) : (
            upcomingBookings.map((booking) => (
              <div key={booking.id} className="flex items-center justify-between px-6 py-4 text-sm">
                <div>
                  <p className="font-semibold text-primary-950">{booking.customerName}</p>
                  <p className="text-neutral-500">
                    {booking.service.name} · {booking.practitioner.name}
                  </p>
                </div>
                <p className="text-neutral-600">{formatDateTime(booking.startTime)}</p>
              </div>
            ))
          )}
        </div>
      </div>

      {isAdmin ? (
        <div className="rounded-2xl border border-neutral-200 bg-white">
          <div className="border-b border-neutral-200 px-6 py-4">
            <h2 className="font-heading text-base font-bold text-primary-950">Legutóbbi fizetések</h2>
          </div>
          <div className="divide-y divide-neutral-100">
            {recentPayments.length === 0 ? (
              <p className="px-6 py-6 text-sm text-neutral-500">Még nincs sikeres fizetés.</p>
            ) : (
              recentPayments.map((payment) => (
                <div key={payment.id} className="flex items-center justify-between px-6 py-4 text-sm">
                  <p className="text-neutral-600">{formatDateTime(payment.createdAt)}</p>
                  <p className="font-semibold text-primary-950">{formatHUF(payment.amountHUF)}</p>
                </div>
              ))
            )}
          </div>
        </div>
      ) : null}
    </div>
  );
}
