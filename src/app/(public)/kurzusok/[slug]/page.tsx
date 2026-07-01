import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Section } from "@/components/ui/Section";
import { Badge } from "@/components/ui/Badge";
import { FaqAccordion } from "@/components/ui/FaqAccordion";
import { formatHUF } from "@/lib/format";
import { prisma } from "@/lib/prisma";
import { purchaseCourseAction } from "@/actions/courses";
import { Clock, PlayCircle } from "lucide-react";

const COURSE_FAQ = [
  {
    question: "Mennyi ideig érhető el a kurzus?",
    answer: "A vásárlás után örökre hozzáférsz az anyaghoz — saját tempódban, ahányszor csak szeretnéd.",
  },
  {
    question: "Mi történik a fizetés után?",
    answer:
      "Azonnal e-mailt kapsz egy egyedi hozzáférési linkkel, amin keresztül bármikor eléred a kurzus anyagát.",
  },
  {
    question: "Van lehetőség kérdezni a kurzus közben?",
    answer:
      "Igen — a kurzus dinamikusan bővül a felmerülő kérdésekkel, amiket a hozzáférési oldalon tudsz feltenni.",
  },
];

export async function generateStaticParams() {
  const courses = await prisma.course.findMany({ where: { active: true }, select: { slug: true } });
  return courses.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const course = await prisma.course.findUnique({ where: { slug } });
  if (!course) return {};
  return {
    title: course.title,
    description: course.shortPromise,
  };
}

export default async function CourseDetailPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ fizetes?: string }>;
}) {
  const { slug } = await params;
  const { fizetes } = await searchParams;

  const course = await prisma.course.findUnique({
    where: { slug },
    include: { modules: { orderBy: { order: "asc" }, include: { lessons: { orderBy: { order: "asc" } } } } },
  });

  if (!course || !course.active) notFound();

  return (
    <>
      <Section variant="dark" className="pb-16 pt-20 sm:pt-28">
        <Badge className="bg-white/10 text-white">Kurzus</Badge>
        <h1 className="mt-6 max-w-2xl font-heading text-4xl font-bold text-white sm:text-5xl">
          {course.title}
        </h1>
        <p className="mt-6 max-w-xl text-lg text-primary-100">{course.shortPromise}</p>
        <p className="mt-8 font-heading text-3xl font-bold text-white">
          {formatHUF(course.priceHUF)}
        </p>

        {fizetes === "nem-elerheto" ? (
          <p className="mt-4 max-w-md rounded-lg bg-white/10 px-4 py-3 text-sm text-primary-100">
            A fizetés jelenleg beüzemelés alatt áll — írj nekünk a kapcsolat
            oldalon, és személyesen intézzük a hozzáférésed.
          </p>
        ) : null}

        <form action={purchaseCourseAction} className="mt-6">
          <input type="hidden" name="courseId" value={course.id} />
          <div className="flex flex-col gap-3 sm:flex-row">
            <input
              type="text"
              name="customerName"
              required
              placeholder="Teljes neved"
              className="rounded-full border border-white/20 bg-white/10 px-5 py-3 text-sm text-white placeholder:text-primary-300 focus:outline-none focus:ring-2 focus:ring-white/40"
            />
            <input
              type="email"
              name="customerEmail"
              required
              placeholder="E-mail címed"
              className="rounded-full border border-white/20 bg-white/10 px-5 py-3 text-sm text-white placeholder:text-primary-300 focus:outline-none focus:ring-2 focus:ring-white/40"
            />
            <button
              type="submit"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-accent-500 px-7 py-3 text-base font-semibold text-white transition-colors hover:bg-accent-600"
            >
              Megveszem a kurzust
            </button>
          </div>
        </form>
      </Section>

      <Section variant="light" narrow>
        <div className="flex aspect-video items-center justify-center rounded-2xl bg-primary-100 text-primary-400">
          <PlayCircle className="h-16 w-16" strokeWidth={1.2} />
        </div>
        <p className="mt-3 text-center text-sm text-neutral-500">
          Bemutató videó — hamarosan
        </p>

        <p className="mt-10 text-lg leading-relaxed text-neutral-700">{course.description}</p>
      </Section>

      <Section variant="muted" narrow>
        <h2 className="font-heading text-2xl font-bold text-primary-950">A kurzus felépítése</h2>
        <div className="mt-8 space-y-6">
          {course.modules.map((courseModule) => (
            <div key={courseModule.id}>
              <h3 className="font-heading text-base font-bold text-primary-800">
                {courseModule.title}
              </h3>
              <ul className="mt-3 space-y-2">
                {courseModule.lessons.map((lesson) => (
                  <li
                    key={lesson.id}
                    className="flex items-center justify-between rounded-lg bg-white px-4 py-3 text-sm text-neutral-700 shadow-sm shadow-neutral-900/5"
                  >
                    <span>{lesson.title}</span>
                    {lesson.durationMinutes ? (
                      <span className="flex items-center gap-1 text-xs text-neutral-400">
                        <Clock className="h-3.5 w-3.5" /> {lesson.durationMinutes} perc
                      </span>
                    ) : null}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </Section>

      <Section variant="light" narrow>
        <h2 className="font-heading text-2xl font-bold text-primary-950">Gyakori kérdések</h2>
        <div className="mt-8">
          <FaqAccordion items={COURSE_FAQ} />
        </div>
      </Section>

      <Section variant="dark" className="text-center">
        <h2 className="font-heading text-2xl font-bold text-white sm:text-3xl">
          Kezdd el most, saját tempódban
        </h2>
        <p className="mx-auto mt-3 max-w-md text-primary-200">
          {formatHUF(course.priceHUF)} · egyszeri vásárlás, örökös hozzáférés
        </p>
        <a
          href="#top"
          className="mt-6 inline-flex items-center justify-center gap-2 rounded-full bg-accent-500 px-7 py-3.5 text-base font-semibold text-white transition-colors hover:bg-accent-600"
        >
          Megveszem a kurzust
        </a>
      </Section>
    </>
  );
}
