import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { requireAdmin } from "@/lib/admin-guard";
import { prisma } from "@/lib/prisma";
import {
  CourseModuleForm,
  CourseLessonForm,
  LessonVideoUrlForm,
} from "@/components/admin/CourseContentForms";

export const metadata: Metadata = { title: "Kurzus tartalma", robots: { index: false } };

export default async function AdminCourseDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await requireAdmin();
  const { id } = await params;

  const course = await prisma.course.findUnique({
    where: { id },
    include: {
      modules: { orderBy: { order: "asc" }, include: { lessons: { orderBy: { order: "asc" } } } },
    },
  });
  if (!course) notFound();

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-heading text-2xl font-bold text-primary-950">{course.title}</h1>
        <p className="text-sm text-neutral-500">
          Blokkok és leckék kezelése. A videó URL mezőt kell kitölteni ahhoz, hogy a
          vásárló a hozzáférési oldalon meg tudja nyitni az anyagot.
        </p>
      </div>

      <div className="space-y-6">
        {course.modules.map((courseModule) => (
          <div key={courseModule.id} className="rounded-2xl border border-neutral-200 bg-white p-6">
            <h2 className="font-heading text-base font-bold text-primary-950">
              {courseModule.title}
            </h2>
            <div className="mt-3 space-y-2">
              {courseModule.lessons.map((lesson) => (
                <div
                  key={lesson.id}
                  className="flex flex-wrap items-center justify-between gap-2 rounded-lg bg-neutral-50 px-4 py-2"
                >
                  <span className="text-sm text-primary-950">
                    {lesson.title}
                    {lesson.durationMinutes ? ` · ${lesson.durationMinutes} perc` : ""}
                  </span>
                  <LessonVideoUrlForm lessonId={lesson.id} videoUrl={lesson.videoUrl} />
                </div>
              ))}
            </div>
            <div className="mt-4 border-t border-neutral-100 pt-4">
              <CourseLessonForm moduleId={courseModule.id} />
            </div>
          </div>
        ))}
      </div>

      <div className="rounded-2xl border border-neutral-200 bg-white p-6">
        <h2 className="font-heading text-base font-bold text-primary-950">Új blokk</h2>
        <div className="mt-4">
          <CourseModuleForm courseId={course.id} />
        </div>
      </div>
    </div>
  );
}
