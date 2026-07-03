import { z } from "zod";
import { normalizeTableCode } from "../utils/normalize-table-code";

export const tableFormSchema = z.object({
  name: z.string().trim().min(2, "El nombre del grupo es muy corto.").max(80, "El nombre del grupo es muy largo."),
  code: z.string()
    .trim()
    .min(2, "El codigo del grupo es muy corto.")
    .max(40, "El codigo del grupo es muy largo.")
    .transform(normalizeTableCode),
  displayOrder: z.coerce.number().int("El orden debe ser un numero entero.").min(0, "El orden no puede ser negativo.").max(999, "Orden demasiado alto."),
  manualPoints: z.coerce.number().int("Los puntos deben ser un numero entero.").min(-9999, "Ajuste demasiado bajo.").max(9999, "Ajuste demasiado alto."),
  missionId: z.string().uuid("Mision no valida.").optional().or(z.literal("")).transform((value) => value || null),
});

export type TableFormInput = z.infer<typeof tableFormSchema>;
