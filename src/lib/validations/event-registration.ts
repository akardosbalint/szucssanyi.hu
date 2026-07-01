import { z } from "zod";

export const eventRegistrationSchema = z.object({
  eventId: z.string().min(1),
  customerName: z.string().min(2, "Add meg a teljes neved."),
  customerEmail: z.email("Adj meg egy érvényes e-mail címet."),
  customerPhone: z.string().min(6, "Add meg a telefonszámod."),
  note: z.string().max(1000).optional(),
});

export type EventRegistrationInput = z.infer<typeof eventRegistrationSchema>;
