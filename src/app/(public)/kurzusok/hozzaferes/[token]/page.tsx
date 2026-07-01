import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Section } from "@/components/ui/Section";
import { Badge } from "@/components/ui/Badge";
import { prisma } from "@/lib/prisma";
import { PlayCircle, Clock, Lock } from "lucide-react";

export const metadata: Metadata = {
  title: "Kurzus hozzáférés",
  robots: { index: false },
};

export default async function CourseAccessPage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = await params;

  const purchase = await prisma.coursePurchase.findUnique({
    where: { accessToken: token },
    include: {
      course: {
        include: { modules: { orderBy: { order: "asc" }, include: { lessons: { orderBy: { order: "asc" } } } } },
      },
    },
  });

  if (!purchase) notFound();

  if (purchase.status !== "CONFIRMED") {
    return (
      <Section variant="muted" narrow className="pt-20 text-center sm:pt-28">
        <Lock className="mx-auto h-12 w-12 text-neutral-400" strokeWidth={1.5} />
        <h1 className="mt-6 font-heading text-2xl font-bold text-primary-950">
          A hozzáférés még nem aktív
        </h1>
        <p className="mt-3 text-neutral-600">
          Ha épp most fizettél, néhány másodperc múlva frissítsd az oldalt. Ha
          hosszabb ideje várakozik, írj nekünk a kapcsolat oldalon.
        </p>
      </Section>
    );
  }

  return (
    <Section variant="muted" className="pt-20 sm:pt-28">
      <Badge>A kurzusod</Badge>
      <h1 className="mt-4 font-heading text-2xl font-bold text-primary-950 sm:text-3xl">
        {purchase.course.title}
      </h1>
      <p className="mt-2 text-neutral-600">
        Szia {purchase.customerName}! Örökös hozzáférésed van ehhez az
        anyaghoz — nézd meg saját tempódban.
      </p>

      <div className="mt-10 space-y-8">
        {purchase.course.modules.map((courseModule) => (
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
                    {lesson.videoUrl ? (
                      <a
                        href={lesson.videoUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs font-semibold text-primary-700 underline underline-offset-2"
                      >
                        Megnézem
                      </a>
                    ) : (
                      <span className="text-xs text-neutral-400">Hamarosan</span>
                    )}
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
