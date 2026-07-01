import { prisma } from "@/lib/prisma";

export type CustomerSummary = {
  email: string;
  name: string;
  phone: string | null;
  bookingsCount: number;
  eventRegistrationsCount: number;
  coursePurchasesCount: number;
  lastActivity: Date;
};

export async function getCustomerSummaries(): Promise<CustomerSummary[]> {
  const [bookings, registrations, purchases, leads] = await Promise.all([
    prisma.booking.findMany({
      select: { customerName: true, customerEmail: true, customerPhone: true, createdAt: true },
    }),
    prisma.eventRegistration.findMany({
      select: { customerName: true, customerEmail: true, customerPhone: true, createdAt: true },
    }),
    prisma.coursePurchase.findMany({
      select: { customerName: true, customerEmail: true, createdAt: true },
    }),
    prisma.leadSubscriber.findMany({ select: { name: true, email: true, createdAt: true } }),
  ]);

  const byEmail = new Map<string, CustomerSummary>();

  function upsert(
    email: string,
    name: string,
    phone: string | null,
    createdAt: Date,
    field: "bookingsCount" | "eventRegistrationsCount" | "coursePurchasesCount" | null,
  ) {
    const key = email.toLowerCase();
    const existing = byEmail.get(key);
    if (existing) {
      if (field) existing[field] += 1;
      if (createdAt > existing.lastActivity) existing.lastActivity = createdAt;
      if (phone && !existing.phone) existing.phone = phone;
    } else {
      byEmail.set(key, {
        email: key,
        name,
        phone,
        bookingsCount: field === "bookingsCount" ? 1 : 0,
        eventRegistrationsCount: field === "eventRegistrationsCount" ? 1 : 0,
        coursePurchasesCount: field === "coursePurchasesCount" ? 1 : 0,
        lastActivity: createdAt,
      });
    }
  }

  for (const b of bookings) upsert(b.customerEmail, b.customerName, b.customerPhone, b.createdAt, "bookingsCount");
  for (const r of registrations)
    upsert(r.customerEmail, r.customerName, r.customerPhone, r.createdAt, "eventRegistrationsCount");
  for (const p of purchases)
    upsert(p.customerEmail, p.customerName, null, p.createdAt, "coursePurchasesCount");
  for (const l of leads) upsert(l.email, l.name, null, l.createdAt, null);

  return Array.from(byEmail.values()).sort(
    (a, b) => b.lastActivity.getTime() - a.lastActivity.getTime(),
  );
}
