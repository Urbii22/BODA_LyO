import { z } from "zod";
import { normalizeGroupNameInput } from "../utils/group-identity";

export const groupEntrySchema = z.object({
  groupName: z.string()
    .trim()
    .min(2, "El nombre del grupo es muy corto.")
    .max(80, "El nombre del grupo es muy largo.")
    .transform(normalizeGroupNameInput),
});

export type GroupEntryInput = z.infer<typeof groupEntrySchema>;
