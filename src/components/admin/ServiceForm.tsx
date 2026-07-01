"use client";

import { useState, useTransition } from "react";
import { createServiceAction } from "@/actions/admin/practitioners";

export function ServiceForm({ practitionerId }: { practitionerId: string }) {
  const [isPending, startTransition] = useTransition();
  const [result, setResult] = useState<{ ok: boolean; message: string } | null>(null);

  return (
    <form
      action={(formData) =>
        startTransition(async () => {
          const res = await createServiceAction(formData);
          setResult(res);
        })
      }
      className="grid gap-3 sm:grid-cols-2"
    >
      <input type="hidden" name="practitionerId" value={practitionerId} />
      <input
        type="text"
        name="name"
        required
        placeholder="Szolgáltatás neve (pl. Online konzultáció (60 perc))"
        className="rounded-xl border border-neutral-300 px-4 py-2.5 text-sm sm:col-span-2"
      />
      <select name="mode" className="rounded-xl border border-neutral-300 px-4 py-2.5 text-sm">
        <option value="ONLINE">Online</option>
        <option value="IN_PERSON">Személyes</option>
      </select>
      <input
        type="number"
        name="durationMinutes"
        required
        placeholder="Időtartam (perc)"
        min={15}
        step={5}
        className="rounded-xl border border-neutral-300 px-4 py-2.5 text-sm"
      />
      <input
        type="number"
        name="priceHUF"
        required
        placeholder="Ár (Ft)"
        min={0}
        step={500}
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
        {isPending ? "Hozzáadás..." : "Szolgáltatás hozzáadása"}
      </button>
    </form>
  );
}
