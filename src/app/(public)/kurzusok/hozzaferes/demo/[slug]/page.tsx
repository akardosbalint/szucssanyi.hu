import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Section } from "@/components/ui/Section";
import { Badge } from "@/components/ui/Badge";
import { getDummyCourseBySlug } from "@/lib/dummy-courses";
import { PlayCircle, Clock } from "lucide-react";

// IDEIGLENES (bemutatási céllal): ez a kurzus hozzáférési oldal dummy
// verziója — beépített minta-adatból dolgozik, valós vásárlás/token
// nélkül. A valós, adatbázis-alapú verzió a szomszédos [token] route-on
// változatlanul megmaradt.

export const metadata: Metadata = {
  title: "Kurzus hozzáférés",
  robots: { index: false },
};

export default async function DummyCourseAccessPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ nev?: string }>;
}) {
  const { slug } = await params;
  const { nev } = await searchParams;

  const course = getDummyCourseBySlug(slug);
  if (!course) notFound();

  return (
    <Section variant="muted" className="pt-20 sm:pt-28">
      <Badge>A kurzusod</Badge>
      <h1 className="mt-4 font-heading text-2xl font-bold text-primary-950 sm:text-3xl">
        {course.title}
      </h1>
      <p className="mt-2 text-neutral-600">
        Szia{nev ? ` ${nev}` : ""}! Örökös hozzáférésed van ehhez az anyaghoz —
        nézd meg saját tempódban.
      </p>

      <div className="mt-10 space-y-8">
        {course.modules.map((courseModule) => (
          <div key={courseModule.id}>
            <h2 className="font-heading text-lg font-bold text-primary-900">
              {courseModule.title}
            </h2>
            <div className="mt-3 space-y-2">
              {courseModule.lessons.map((lesson) => (
                <div
                  key={lesson.id}
                  className="flex items-center justify-between rounded-xl bg-white px-5 py-4 shadow-sm shadow-neutral-900/5"
                >
                  <span className="flex items-center gap-3 text-sm text-neutral-700">
                    <PlayCircle className="h-5 w-5 text-primary-500" />
                    {lesson.title}
                  </span>
                  <span className="flex items-center gap-3">
                    {lesson.durationMinutes ? (
                      <span className="flex items-center gap-1 text-xs text-neutral-400">
                        <Clock className="h-3.5 w-3.5" /> {lesson.durationMinutes} perc
                      </span>
                    ) : null}
                    <span className="text-xs text-neutral-400">Hamarosan</span>
                  </span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </Section>
  );
}
