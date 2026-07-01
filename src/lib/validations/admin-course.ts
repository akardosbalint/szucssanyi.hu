import { z } from "zod";

export const courseModuleSchema = z.object({
  courseId: z.string().min(1),
  title: z.string().min(2),
});

export const courseLessonSchema = z.object({
  moduleId: z.string().min(1),
  title: z.string().min(2),
  durationMinutes: z.coerce.number().int().min(1).optional(),
  videoUrl: z.string().optional(),
});

export const lessonVideoUrlSchema = z.object({
  lessonId: z.string().min(1),
  videoUrl: z.string().optional(),
});
