import { z } from "zod";

export const manualBookingSchema = z.object({
  practitionerId: z.string().min(1),
  serviceId: z.string().min(1),
  startTime: z.string().min(1), // "2026-07-15T09:00"
  customerName: z.string().min(2),
  customerEmail: z.email(),
  customerPhone: z.string().min(6),
  note: z.string().max(1000).optional(),
});
