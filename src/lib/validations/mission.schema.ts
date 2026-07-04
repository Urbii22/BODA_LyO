import { z } from "zod";

export const missionFormSchema = z.object({
  title: z.string().trim().min(2, "El titulo es muy corto.").max(120, "El titulo es muy largo."),
  description: z.string().trim().min(4, "Falta la descripcion.").max(600, "La descripcion es muy larga."),
  points: z.coerce.number().int("Puntos sin decimales.").min(1, "Los puntos deben ser mayores que 0.").max(1000, "Demasiados puntos."),
  difficulty: z.enum(["easy", "medium", "hard", "epic"]),
  category: z.enum(["social", "photo", "dance", "emotional", "funny"]),
});

export const missionLaunchSchema = z.object({
  missionId: z.string().uuid("Elige una mision."),
  targetMode: z.enum(["all", "group"]),
  tableId: z.string().uuid("Elige un grupo.").optional(),
  message: z.string().trim().max(180, "El aviso es demasiado largo.").optional(),
}).superRefine((value, ctx) => {
  if (value.targetMode === "group" && !value.tableId) {
    ctx.addIssue({
      code: "custom",
      path: ["tableId"],
      message: "Elige el grupo que recibira la mision.",
    });
  }
});

export type MissionFormInput = z.infer<typeof missionFormSchema>;
export type MissionLaunchInput = z.infer<typeof missionLaunchSchema>;
