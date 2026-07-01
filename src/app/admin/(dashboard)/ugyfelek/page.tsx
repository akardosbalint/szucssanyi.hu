import type { Metadata } from "next";
import { requireAdmin } from "@/lib/admin-guard";
import { getCustomerSummaries } from "@/lib/customers";
import { formatDateTime } from "@/lib/format";
import { DeleteButton } from "@/components/admin/DeleteButton";
import { anonymizeCustomerAction } from "@/actions/admin/customers";

export const metadata: Metadata = { title: "Ügyfelek", robots: { index: false } };

export default async function AdminCustomersPage() {
  await requireAdmin();
  const customers = await getCustomerSummaries();

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-heading text-2xl font-bold text-primary-950">Ügyfelek</h1>
        <p className="text-sm text-neutral-500">
          Alap ügyfél-áttekintés a foglalások, jelentkezések, vásárlások és
          feliratkozások alapján. A törlés gomb GDPR törlési kérelem
          teljesítésére szolgál.
        </p>
      </div>

      <div className="overflow-x-auto rounded-2xl border border-neutral-200 bg-white">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-neutral-200 text-xs uppercase tracking-wide text-neutral-400">
            <tr>
              <th className="px-6 py-3 font-semibold">Név</th>
              <th className="px-6 py-3 font-semibold">Elérhetőség</th>
              <th className="px-6 py-3 font-semibold">Aktivitás</th>
              <th className="px-6 py-3 font-semibold">Utolsó aktivitás</th>
              <th className="px-6 py-3 font-semibold">Művelet</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-100">
            {customers.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-6 py-8 text-center text-neutral-500">
                  Még nincs ügyfél-adat.
                </td>
              </tr>
            ) : (
              customers.map((customer) => (
                <tr key={customer.email}>
                  <td className="px-6 py-4 font-semibold text-primary-950">{customer.name}</td>
                  <td className="px-6 py-4 text-neutral-600">
                    <p>{customer.email}</p>
                    {customer.phone ? <p className="text-xs text-neutral-400">{customer.phone}</p> : null}
                  </td>
                  <td className="px-6 py-4 text-xs text-neutral-500">
                    {customer.bookingsCount} konzultáció · {customer.eventRegistrationsCount} esemény ·{" "}
                    {customer.coursePurchasesCount} kurzus
                  </td>
                  <td className="px-6 py-4 text-neutral-600">{formatDateTime(customer.lastActivity)}</td>
                  <td className="px-6 py-4">
                    <DeleteButton
                      confirmMessage="Biztosan törlöd/anonimizálod ennek az ügyfélnek az adatait? Ez nem visszavonható."
                      action={anonymizeCustomerAction.bind(null, customer.email)}
                    />
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
