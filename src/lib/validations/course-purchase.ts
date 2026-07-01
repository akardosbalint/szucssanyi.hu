import { z } from "zod";

export const coursePurchaseSchema = z.object({
  courseId: z.string().min(1),
  customerName: z.string().min(2, "Add meg a teljes neved."),
  customerEmail: z.email("Adj meg egy érvényes e-mail címet."),
});

export type CoursePurchaseInput = z.infer<typeof coursePurchaseSchema>;
