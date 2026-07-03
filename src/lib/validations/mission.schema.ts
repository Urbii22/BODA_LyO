import { z } from "zod";

export const missionFormSchema = z.object({
  title: z.string().trim().min(2, "El titulo es muy corto.").max(120, "El titulo es muy largo."),
  description: z.string().trim().min(4, "Falta la descripcion.").max(600, "La descripcion es muy larga."),
  points: z.coerce.number().int("Puntos sin decimales.").min(1, "Los puntos deben ser mayores que 0.").max(1000, "Demasiados puntos."),
  difficulty: z.enum(["easy", "medium", "hard", "epic"]),
  category: z.enum(["social", "photo", "dance", "emotional", "funny"]),
});

export type MissionFormInput = z.infer<typeof missionFormSchema>;
