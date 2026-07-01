"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin-guard";
import { courseModuleSchema, courseLessonSchema, lessonVideoUrlSchema } from "@/lib/validations/admin-course";

export async function toggleCourseActiveAction(courseId: string) {
  await requireAdmin();
  const course = await prisma.course.findUniqueOrThrow({ where: { id: courseId } });
  await prisma.course.update({ where: { id: courseId }, data: { active: !course.active } });
  revalidatePath("/admin/kurzusok");
  revalidatePath("/kurzusok");
}

export async function createCourseModuleAction(formData: FormData) {
  await requireAdmin();
  const parsed = courseModuleSchema.safeParse({
    courseId: formData.get("courseId"),
    title: formData.get("title"),
  });
  if (!parsed.success) return { ok: false, message: "Kérlek, ellenőrizd az adatokat." };

  const count = await prisma.courseModule.count({ where: { courseId: parsed.data.courseId } });
  await prisma.courseModule.create({ data: { ...parsed.data, order: count } });

  revalidatePath(`/admin/kurzusok/${parsed.data.courseId}`);
  revalidatePath("/kurzusok");
  return { ok: true, message: "Blokk hozzáadva." };
}

export async function createCourseLessonAction(formData: FormData) {
  await requireAdmin();
  const parsed = courseLessonSchema.safeParse({
    moduleId: formData.get("moduleId"),
    title: formData.get("title"),
    durationMinutes: formData.get("durationMinutes") || undefined,
    videoUrl: formData.get("videoUrl") || undefined,
  });
  if (!parsed.success) return { ok: false, message: "Kérlek, ellenőrizd az adatokat." };

  const courseModule = await prisma.courseModule.findUniqueOrThrow({
    where: { id: parsed.data.moduleId },
  });
  const count = await prisma.courseLesson.count({ where: { moduleId: parsed.data.moduleId } });
  await prisma.courseLesson.create({ data: { ...parsed.data, order: count } });

  revalidatePath(`/admin/kurzusok/${courseModule.courseId}`);
  revalidatePath("/kurzusok");
  return { ok: true, message: "Lecke hozzáadva." };
}

export async function updateLessonVideoUrlAction(formData: FormData) {
  await requireAdmin();
  const parsed = lessonVideoUrlSchema.safeParse({
    lessonId: formData.get("lessonId"),
    videoUrl: formData.get("videoUrl") || undefined,
  });
  if (!parsed.success) return { ok: false, message: "Kérlek, ellenőrizd az adatokat." };

  const lesson = await prisma.courseLesson.update({
    where: { id: parsed.data.lessonId },
    data: { videoUrl: parsed.data.videoUrl },
    include: { module: true },
  });

  revalidatePath(`/admin/kurzusok/${lesson.module.courseId}`);
  return { ok: true, message: "Videó link mentve." };
}
