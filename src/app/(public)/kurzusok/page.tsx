import type { Metadata } from "next";
import { Section } from "@/components/ui/Section";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { formatHUF } from "@/lib/format";
import { prisma } from "@/lib/prisma";

export const metadata: Metadata = {
  title: "Kurzusok",
  description:
    "Önismereti online kurzusok Szűcs Sándortól: hiperérzékenység, egészséges párkapcsolat, önuralom. Egyszeri ár, örökös hozzáférés.",
};

export default async function CoursesPage() {
  const courses = await prisma.course.findMany({
    where: { active: true },
    orderBy: { order: "asc" },
  });

  return (
    <>
      <Section variant="dark" className="pb-16 pt-20 sm:pt-28 text-center">
        <Badge className="bg-white/10 text-white">Kurzusok</Badge>
        <h1 className="mx-auto mt-6 max-w-2xl font-heading text-4xl font-bold text-white sm:text-5xl">
          Saját tempódban, konkrét témákra.
        </h1>
        <p className="mx-auto mt-6 max-w-xl text-lg text-primary-100">
          Egyszeri vásárlás, örökös hozzáférés — nézd meg, amikor neked
          megfelel, ahányszor szükséged van rá.
        </p>
      </Section>

      <Section variant="light">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {courses.map((course) => (
            <Card key={course.id} className="flex flex-col">
              <div className="aspect-[4/3] w-full rounded-xl bg-gradient-to-br from-primary-100 to-primary-200" />
              <h2 className="mt-5 font-heading text-lg font-bold text-primary-950">
                {course.title}
              </h2>
              <p className="mt-2 grow text-sm leading-relaxed text-neutral-600">
                {course.shortPromise}
              </p>
              <div className="mt-4 flex items-center justify-between">
                <span className="font-heading text-xl font-bold text-primary-800">
                  {formatHUF(course.priceHUF)}
                </span>
                <Button href={`/kurzusok/${course.slug}`} variant="secondary">
                  Részletek
                </Button>
              </div>
            </Card>
          ))}
        </div>
      </Section>
    </>
  );
}
