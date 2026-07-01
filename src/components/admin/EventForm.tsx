"use client";

import { useState, useTransition } from "react";
import { createEventAction } from "@/actions/admin/events";

export function EventForm() {
  const [isPending, startTransition] = useTransition();
  const [result, setResult] = useState<{ ok: boolean; message: string } | null>(null);

  return (
    <form
      action={(formData) =>
        startTransition(async () => {
          const res = await createEventAction(formData);
          setResult(res);
        })
      }
      className="grid gap-3 sm:grid-cols-2"
    >
      <input
        type="text"
        name="title"
        required
        placeholder="Cím"
        className="rounded-xl border border-neutral-300 px-4 py-2.5 text-sm sm:col-span-2"
      />
      <input
        type="text"
        name="slug"
        required
        placeholder="slug (pl. csaladallitas-2026-tel)"
        className="rounded-xl border border-neutral-300 px-4 py-2.5 text-sm sm:col-span-2"
      />
      <textarea
        name="description"
        required
        rows={3}
        placeholder="Leírás"
        className="rounded-xl border border-neutral-300 px-4 py-2.5 text-sm sm:col-span-2"
      />
      <input
        type="text"
        name="location"
        required
        placeholder="Helyszín"
        className="rounded-xl border border-neutral-300 px-4 py-2.5 text-sm sm:col-span-2"
      />
      <label className="text-xs text-neutral-500">
        Kezdés
        <input
          type="datetime-local"
          name="startTime"
          required
          className="mt-1 w-full rounded-xl border border-neutral-300 px-4 py-2.5 text-sm"
        />
      </label>
      <label className="text-xs text-neutral-500">
        Befejezés
        <input
          type="datetime-local"
          name="endTime"
          required
          className="mt-1 w-full rounded-xl border border-neutral-300 px-4 py-2.5 text-sm"
        />
      </label>
      <input
        type="number"
        name="capacity"
        required
        min={1}
        placeholder="Létszámkeret"
        className="rounded-xl border border-neutral-300 px-4 py-2.5 text-sm"
      />
      <input
        type="number"
        name="priceHUF"
        required
        min={0}
        step={500}
        placeholder="Ár (Ft)"
        className="rounded-xl border border-neutral-300 px-4 py-2.5 text-sm"
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
        {isPending ? "Létrehozás..." : "Esemény létrehozása"}
      </button>
    </form>
  );
}
