import { z } from "zod";

export const submissionSchema = z.object({
  tableCode: z.string().trim().min(1, "Falta el codigo de mesa."),
  submissionMode: z.enum(["normal", "bold"]).default("normal"),
  participantName: z.preprocess(
    (value) => (typeof value === "string" && value.trim() === "" ? undefined : value),
    z.string().trim().min(2, "El nombre necesita al menos 2 caracteres.").max(80, "El nombre no puede superar 80 caracteres.").optional(),
  ),
  comment: z.string().trim().max(450, "El comentario no puede superar 450 caracteres.").optional(),
});

export const reviewSubmissionSchema = z.object({
  submissionId: z.string().uuid(),
  verdict: z.enum(["pending", "approved", "rejected"]),
  awardedPoints: z.coerce.number().int().min(0).optional(),
  adminNote: z.string().trim().max(500).optional(),
});

export type SubmissionInput = z.infer<typeof submissionSchema>;
