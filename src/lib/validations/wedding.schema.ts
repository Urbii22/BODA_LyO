import { z } from "zod";

export const weddingFormSchema = z.object({
  coupleName: z.string().trim().min(2, "El nombre es muy corto.").max(120, "El nombre es muy largo."),
  title: z.string().trim().min(2, "El titulo es muy corto.").max(160, "El titulo es muy largo."),
  weddingDate: z.string().trim().optional().transform((value) => value || null),
});

export type WeddingFormInput = z.infer<typeof weddingFormSchema>;
