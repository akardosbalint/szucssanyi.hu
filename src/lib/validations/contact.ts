import { z } from "zod";

export const contactMessageSchema = z.object({
  name: z.string().min(2, "Add meg a neved."),
  email: z.email("Adj meg egy érvényes e-mail címet."),
  message: z.string().min(10, "Írj néhány mondatot, hogy tudjunk segíteni."),
});

export type ContactMessageInput = z.infer<typeof contactMessageSchema>;
