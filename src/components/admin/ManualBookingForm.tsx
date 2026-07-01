"use client";

import { useMemo, useState, useTransition } from "react";
import { createManualBookingAction } from "@/actions/admin/bookings";
import { formatHUF } from "@/lib/format";

type Practitioner = {
  id: string;
  name: string;
  services: { id: string; name: string; durationMinutes: number; priceHUF: number }[];
};

export function ManualBookingForm({ practitioners }: { practitioners: Practitioner[] }) {
  const [practitionerId, setPractitionerId] = useState(practitioners[0]?.id ?? "");
  const [isPending, startTransition] = useTransition();
  const [result, setResult] = useState<{ ok: boolean; message: string } | null>(null);

  const services = useMemo(
    () => practitioners.find((p) => p.id === practitionerId)?.services ?? [],
    [practitionerId, practitioners],
  );

  return (
    <form
      action={(formData) =>
        startTransition(async () => {
          const res = await createManualBookingAction(formData);
          setResult(res);
        })
      }
      className="grid gap-3 sm:grid-cols-2"
    >
      {practitioners.length > 1 ? (
        <select
          name="practitionerId"
          value={practitionerId}
          onChange={(e) => setPractitionerId(e.target.value)}
          className="rounded-xl border border-neutral-300 px-4 py-2.5 text-sm"
        >
          {practitioners.map((p) => (
            <option key={p.id} value={p.id}>
              {p.name}
            </option>
          ))}
        </select>
      ) : (
        <input type="hidden" name="practitionerId" value={practitionerId} />
      )}

      <select name="serviceId" required className="rounded-xl border border-neutral-300 px-4 py-2.5 text-sm">
        {services.map((s) => (
          <option key={s.id} value={s.id}>
            {s.name} — {formatHUF(s.priceHUF)}
          </option>
        ))}
      </select>

      <input
        type="datetime-local"
        name="startTime"
        required
        className="rounded-xl border border-neutral-300 px-4 py-2.5 text-sm"
      />
      <input
        type="text"
        name="customerName"
        required
        placeholder="Ügyfél neve"
        className="rounded-xl border border-neutral-300 px-4 py-2.5 text-sm"
      />
      <input
        type="email"
        name="customerEmail"
        required
        placeholder="Ügyfél e-mail címe"
        className="rounded-xl border border-neutral-300 px-4 py-2.5 text-sm"
      />
      <input
        type="tel"
        name="customerPhone"
        required
        placeholder="Ügyfél telefonszáma"
        className="rounded-xl border border-neutral-300 px-4 py-2.5 text-sm"
      />
      <textarea
        name="note"
        rows={2}
        placeholder="Megjegyzés (opcionális)"
        className="rounded-xl border border-neutral-300 px-4 py-2.5 text-sm sm:col-span-2"
      />

      {result ? (
        <p className={`sm:col-span-2 text-sm ${result.ok ? "text-primary-700" : "text-red-600"}`}>
          {result.message}
        </p>
      ) : null}

      <button
        type="submit"
        disabled={isPending}
        className="rounded-full bg-primary-700 px-6 py-2.5 text-sm font-semibold text-white hover:bg-primary-800 disabled:opacity-60 sm:col-span-2"
      >
        {isPending ? "Rögzítés..." : "Foglalás rögzítése"}
      </button>
    </form>
  );
}
