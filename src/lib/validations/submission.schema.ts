import { z } from "zod";

export const submissionSchema = z.object({
  tableCode: z.string().trim().min(1, "Falta el codigo de mesa."),
  comment: z.string().trim().max(500, "El comentario no puede superar 500 caracteres.").optional(),
});

export const reviewSubmissionSchema = z.object({
  submissionId: z.string().uuid(),
  verdict: z.enum(["pending", "approved", "rejected"]),
  awardedPoints: z.coerce.number().int().min(0).optional(),
  adminNote: z.string().trim().max(500).optional(),
});

export type SubmissionInput = z.infer<typeof submissionSchema>;
