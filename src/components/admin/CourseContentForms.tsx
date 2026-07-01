"use client";

import { useState, useTransition } from "react";
import {
  createCourseModuleAction,
  createCourseLessonAction,
  updateLessonVideoUrlAction,
} from "@/actions/admin/courses";

export function CourseModuleForm({ courseId }: { courseId: string }) {
  const [isPending, startTransition] = useTransition();
  const [result, setResult] = useState<{ ok: boolean; message: string } | null>(null);

  return (
    <form
      action={(formData) =>
        startTransition(async () => setResult(await createCourseModuleAction(formData)))
      }
      className="flex gap-3"
    >
      <input type="hidden" name="courseId" value={courseId} />
      <input
        type="text"
        name="title"
        required
        placeholder="Új blokk címe"
        className="flex-1 rounded-xl border border-neutral-300 px-4 py-2.5 text-sm"
      />
      <button
        type="submit"
        disabled={isPending}
        className="rounded-full bg-primary-700 px-5 py-2.5 text-sm font-semibold text-white hover:bg-primary-800 disabled:opacity-60"
      >
        Hozzáadás
      </button>
      {result && !result.ok ? <p className="text-sm text-red-600">{result.message}</p> : null}
    </form>
  );
}

export function CourseLessonForm({ moduleId }: { moduleId: string }) {
  const [isPending, startTransition] = useTransition();
  const [result, setResult] = useState<{ ok: boolean; message: string } | null>(null);

  return (
    <form
      action={(formData) =>
        startTransition(async () => setResult(await createCourseLessonAction(formData)))
      }
      className="mt-2 grid grid-cols-2 gap-2 sm:grid-cols-4"
    >
      <input type="hidden" name="moduleId" value={moduleId} />
      <input
        type="text"
        name="title"
        required
        placeholder="Lecke címe"
        className="rounded-lg border border-neutral-300 px-3 py-2 text-xs sm:col-span-2"
      />
      <input
        type="number"
        name="durationMinutes"
        placeholder="Perc"
        min={1}
        className="rounded-lg border border-neutral-300 px-3 py-2 text-xs"
      />
      <input
        type="text"
        name="videoUrl"
        placeholder="Videó URL"
        className="rounded-lg border border-neutral-300 px-3 py-2 text-xs"
      />
      <button
        type="submit"
        disabled={isPending}
        className="col-span-2 rounded-lg bg-neutral-800 px-3 py-2 text-xs font-semibold text-white hover:bg-neutral-900 disabled:opacity-60 sm:col-span-4"
      >
        Lecke hozzáadása
      </button>
      {result && !result.ok ? <p className="col-span-full text-xs text-red-600">{result.message}</p> : null}
    </form>
  );
}

export function LessonVideoUrlForm({ lessonId, videoUrl }: { lessonId: string; videoUrl: string | null }) {
  const [isPending, startTransition] = useTransition();
  const [result, setResult] = useState<{ ok: boolean; message: string } | null>(null);

  return (
    <form
      action={(formData) =>
        startTransition(async () => setResult(await updateLessonVideoUrlAction(formData)))
      }
      className="flex items-center gap-2"
    >
      <input type="hidden" name="lessonId" value={lessonId} />
      <input
        type="text"
        name="videoUrl"
        defaultValue={videoUrl ?? ""}
        placeholder="Videó URL"
        className="w-40 rounded-lg border border-neutral-300 px-2 py-1 text-xs"
      />
      <button
        type="submit"
        disabled={isPending}
        className="text-xs font-semibold text-primary-700 hover:underline disabled:opacity-60"
      >
        Mentés
      </button>
      {result ? (
        <span className={result.ok ? "text-xs text-primary-700" : "text-xs text-red-600"}>
          {result.ok ? "✓" : result.message}
        </span>
      ) : null}
    </form>
  );
}
