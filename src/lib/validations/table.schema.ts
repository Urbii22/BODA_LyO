import { z } from "zod";
import { normalizeTableCode } from "../utils/normalize-table-code";

export const tableFormSchema = z.object({
  name: z.string().trim().min(2, "El nombre de la mesa es muy corto.").max(80, "El nombre de la mesa es muy largo."),
  code: z.string()
    .trim()
    .min(2, "El codigo de la mesa es muy corto.")
    .max(40, "El codigo de la mesa es muy largo.")
    .transform(normalizeTableCode),
  displayOrder: z.coerce.number().int("El orden debe ser un numero entero.").min(0, "El orden no puede ser negativo.").max(999, "Orden demasiado alto."),
  missionId: z.string().uuid("Mision no valida.").optional().or(z.literal("")).transform((value) => value || null),
});

export type TableFormInput = z.infer<typeof tableFormSchema>;
