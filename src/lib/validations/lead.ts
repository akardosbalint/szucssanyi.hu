import { z } from "zod";

export const leadSubscribeSchema = z.object({
  name: z.string().min(2, "Add meg a keresztneved."),
  email: z.email("Adj meg egy érvényes e-mail címet."),
});

export type LeadSubscribeInput = z.infer<typeof leadSubscribeSchema>;
