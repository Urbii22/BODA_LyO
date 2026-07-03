"use server";

import { revalidatePath } from "next/cache";
import { updateWedding as updateWeddingRecord } from "../lib/repositories/weddings.repository";
import { assertAdmin } from "../lib/utils/assert-admin";
import { weddingFormSchema } from "../lib/validations/wedding.schema";
import type { MissionActionState } from "./mission-action-state";

export async function updateWedding(
  _previousState: MissionActionState,
  formData: FormData,
): Promise<MissionActionState> {
  await assertAdmin();

  const weddingId = String(formData.get("weddingId") || "");
  if (!weddingId) return { ok: false, message: "Falta la boda." };

  const parsed = weddingFormSchema.safeParse({
    coupleName: formData.get("coupleName"),
    title: formData.get("title"),
    weddingDate: formData.get("weddingDate") || undefined,
  });

  if (!parsed.success) {
    return { ok: false, message: parsed.error.issues[0]?.message || "Datos no validos." };
  }

  await updateWeddingRecord(weddingId, parsed.data);
  revalidatePath("/");
  revalidatePath("/admin");
  revalidatePath("/admin/settings");
  revalidatePath("/ranking");
  revalidatePath("/ranking/live");
  revalidatePath("/mesa/[code]", "page");
  return { ok: true, message: "Datos de la boda actualizados." };
}
