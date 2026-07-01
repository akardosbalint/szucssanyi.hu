"use client";

import { useState, useTransition } from "react";
import { updatePractitionerAction } from "@/actions/admin/practitioners";

type Practitioner = {
  id: string;
  name: string;
  slug: string;
  title: string | null;
  bio: string;
  photoUrl: string | null;
};

export function PractitionerEditForm({ practitioner }: { practitioner: Practitioner }) {
  const [isPending, startTransition] = useTransition();
  const [result, setResult] = useState<{ ok: boolean; message: string } | null>(null);

  return (
    <form
      action={(formData) =>
        startTransition(async () => {
          const res = await updatePractitionerAction(practitioner.id, formData);
          setResult(res ?? null);
        })
      }
      className="grid gap-3 sm:grid-cols-2"
    >
      <input
        type="text"
        name="name"
        defaultValue={practitioner.name}
        required
        placeholder="Név"
        className="rounded-xl border border-neutral-300 px-4 py-2.5 text-sm"
      />
      <input
        type="text"
        name="slug"
        defaultValue={practitioner.slug}
        required
        placeholder="slug"
        className="rounded-xl border border-neutral-300 px-4 py-2.5 text-sm"
      />
      <input
        type="text"
        name="title"
        defaultValue={practitioner.title ?? ""}
        placeholder="Titulus"
        className="rounded-xl border border-neutral-300 px-4 py-2.5 text-sm sm:col-span-2"
      />
      <textarea
        name="bio"
        defaultValue={practitioner.bio}
        required
        rows={4}
        placeholder="Bemutatkozás"
        className="rounded-xl border border-neutral-300 px-4 py-2.5 text-sm sm:col-span-2"
      />
      <input
        type="text"
        name="photoUrl"
        defaultValue={practitioner.photoUrl ?? ""}
        placeholder="Fotó URL"
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
        {isPending ? "Mentés..." : "Mentés"}
      </button>
    </form>
  );
}
