import { z } from "zod";

export const eventSchema = z.object({
  title: z.string().min(2),
  slug: z
    .string()
    .min(2)
    .regex(/^[a-z0-9-]+$/, "Csak kisbetű, szám és kötőjel."),
  description: z.string().min(10),
  location: z.string().min(2),
  startTime: z.string().min(1),
  endTime: z.string().min(1),
  capacity: z.coerce.number().int().min(1),
  priceHUF: z.coerce.number().int().min(0),
});
