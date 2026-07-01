import { z } from "zod";

export const practitionerSchema = z.object({
  name: z.string().min(2),
  slug: z
    .string()
    .min(2)
    .regex(/^[a-z0-9-]+$/, "Csak kisbetű, szám és kötőjel."),
  title: z.string().optional(),
  bio: z.string().min(10),
  photoUrl: z.string().optional(),
});

export const serviceSchema = z.object({
  practitionerId: z.string().min(1),
  name: z.string().min(2),
  mode: z.enum(["ONLINE", "IN_PERSON"]),
  durationMinutes: z.coerce.number().int().min(15).max(480),
  priceHUF: z.coerce.number().int().min(0),
});

export const availabilityRuleSchema = z.object({
  practitionerId: z.string().min(1),
  weekday: z.coerce.number().int().min(0).max(6),
  startTime: z.string().regex(/^\d{2}:\d{2}$/),
  endTime: z.string().regex(/^\d{2}:\d{2}$/),
});

export const availabilityExceptionSchema = z.object({
  practitionerId: z.string().min(1),
  date: z.string().min(1),
  type: z.enum(["CLOSED", "CUSTOM_HOURS"]),
  startTime: z.string().optional(),
  endTime: z.string().optional(),
});
