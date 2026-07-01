"use client";

import { useState, useTransition } from "react";
import {
  createAvailabilityRuleAction,
  createAvailabilityExceptionAction,
} from "@/actions/admin/practitioners";
import { WEEKDAYS } from "@/lib/weekdays";

export function AvailabilityRuleForm({ practitionerId }: { practitionerId: string }) {
  const [isPending, startTransition] = useTransition();
  const [result, setResult] = useState<{ ok: boolean; message: string } | null>(null);

  return (
    <form
      action={(formData) =>
        startTransition(async () => {
          const res = await createAvailabilityRuleAction(formData);
          setResult(res);
        })
      }
      className="grid grid-cols-2 gap-3 sm:grid-cols-4"
    >
      <input type="hidden" name="practitionerId" value={practitionerId} />
      <select name="weekday" className="rounded-xl border border-neutral-300 px-3 py-2 text-sm">
        {WEEKDAYS.map((day, index) => (
          <option key={day} value={index}>
            {day}
          </option>
        ))}
      </select>
      <input
        type="time"
        name="startTime"
        required
        defaultValue="09:00"
        className="rounded-xl border border-neutral-300 px-3 py-2 text-sm"
      />
      <input
        type="time"
        name="endTime"
        required
        defaultValue="17:00"
        className="rounded-xl border border-neutral-300 px-3 py-2 text-sm"
      />
      <button
        type="submit"
        disabled={isPending}
        className="rounded-full bg-primary-700 px-4 py-2 text-sm font-semibold text-white hover:bg-primary-800 disabled:opacity-60"
      >
        Hozzáadás
      </button>
      {result && !result.ok ? (
        <p className="col-span-full text-sm text-red-600">{result.message}</p>
      ) : null}
    </form>
  );
}

export function AvailabilityExceptionForm({ practitionerId }: { practitionerId: string }) {
  const [type, setType] = useState<"CLOSED" | "CUSTOM_HOURS">("CLOSED");
  const [isPending, startTransition] = useTransition();
  const [result, setResult] = useState<{ ok: boolean; message: string } | null>(null);

  return (
    <form
      action={(formData) =>
        startTransition(async () => {
          const res = await createAvailabilityExceptionAction(formData);
          setResult(res);
        })
      }
      className="grid grid-cols-2 gap-3 sm:grid-cols-5"
    >
      <input type="hidden" name="practitionerId" value={practitionerId} />
      <input type="date" name="date" required className="rounded-xl border border-neutral-300 px-3 py-2 text-sm" />
      <select
        name="type"
        value={type}
        onChange={(e) => setType(e.target.value as "CLOSED" | "CUSTOM_HOURS")}
        className="rounded-xl border border-neutral-300 px-3 py-2 text-sm"
      >
        <option value="CLOSED">Szabadnap</option>
        <option value="CUSTOM_HOURS">Egyedi nyitvatartás</option>
      </select>
      {type === "CUSTOM_HOURS" ? (
        <>
          <input
            type="time"
            name="startTime"
            required
            className="rounded-xl border border-neutral-300 px-3 py-2 text-sm"
          />
          <input
            type="time"
            name="endTime"
            required
            className="rounded-xl border border-neutral-300 px-3 py-2 text-sm"
          />
        </>
      ) : null}
      <button
        type="submit"
        disabled={isPending}
        className="rounded-full bg-primary-700 px-4 py-2 text-sm font-semibold text-white hover:bg-primary-800 disabled:opacity-60"
      >
        Mentés
      </button>
      {result && !result.ok ? (
        <p className="col-span-full text-sm text-red-600">{result.message}</p>
      ) : null}
    </form>
  );
}
