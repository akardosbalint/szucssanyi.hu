import type { Metadata } from "next";
import Link from "next/link";
import { requireAdmin } from "@/lib/admin-guard";
import { prisma } from "@/lib/prisma";
import { formatHUF } from "@/lib/format";
import { ToggleActiveButton } from "@/components/admin/ToggleActiveButton";
import { toggleCourseActiveAction } from "@/actions/admin/courses";

export const metadata: Metadata = { title: "Kurzusok", robots: { index: false } };

export default async function AdminCoursesPage() {
  await requireAdmin();

  const courses = await prisma.course.findMany({
    orderBy: { order: "asc" },
    include: { purchases: { where: { status: "CONFIRMED" } } },
  });

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-heading text-2xl font-bold text-primary-950">Kurzusok</h1>
        <p className="text-sm text-neutral-500">
          Kurzus-tartalom (blokkok, leckék, videó linkek) kezelése.
        </p>
      </div>

      <div className="overflow-hidden rounded-2xl border border-neutral-200 bg-white">
        <div className="divide-y divide-neutral-100">
          {courses.map((course) => (
            <div key={course.id} className="flex items-center justify-between gap-4 px-6 py-4">
              <div>
                <Link
                  href={`/admin/kurzusok/${course.id}`}
                  className="font-semibold text-primary-950 hover:underline"
                >
                  {course.title}
                </Link>
                <p className="text-xs text-neutral-500">
                  {formatHUF(course.priceHUF)} · {course.purchases.length} eladott
                </p>
              </div>
              <ToggleActiveButton
                active={course.active}
                action={toggleCourseActiveAction.bind(null, course.id)}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
