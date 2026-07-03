"use server";

import { revalidatePath } from "next/cache";
import { assertAdmin } from "../lib/utils/assert-admin";
import {
  createTable as createTableRecord,
  deleteTable as deleteTableRecord,
  updateTable as updateTableRecord,
} from "../lib/repositories/tables.repository";
import { getActiveWedding } from "../lib/repositories/weddings.repository";
import { tableFormSchema } from "../lib/validations/table.schema";
import type { MissionActionState } from "./mission-action-state";

function readTableForm(formData: FormData) {
  return tableFormSchema.safeParse({
    name: formData.get("name"),
    code: formData.get("code"),
    displayOrder: formData.get("displayOrder"),
    missionId: formData.get("missionId") || undefined,
  });
}

function revalidateTableViews() {
  revalidatePath("/admin");
  revalidatePath("/admin/tables");
  revalidatePath("/admin/missions");
  revalidatePath("/admin/qr");
  revalidatePath("/ranking");
  revalidatePath("/ranking/live");
  revalidatePath("/mesa/[code]", "page");
}

export async function createTable(
  _previousState: MissionActionState,
  formData: FormData,
): Promise<MissionActionState> {
  await assertAdmin();

  const parsed = readTableForm(formData);
  if (!parsed.success) {
    return { ok: false, message: parsed.error.issues[0]?.message || "Datos no validos." };
  }

  const wedding = await getActiveWedding();
  await createTableRecord(wedding.id, parsed.data);
  revalidateTableViews();
  return { ok: true, message: `Mesa "${parsed.data.name}" creada.` };
}

export async function updateTable(
  _previousState: MissionActionState,
  formData: FormData,
): Promise<MissionActionState> {
  await assertAdmin();

  const tableId = String(formData.get("tableId") || "");
  if (!tableId) return { ok: false, message: "Falta la mesa." };

  const parsed = readTableForm(formData);
  if (!parsed.success) {
    return { ok: false, message: parsed.error.issues[0]?.message || "Datos no validos." };
  }

  await updateTableRecord(tableId, parsed.data);
  revalidateTableViews();
  return { ok: true, message: "Mesa actualizada." };
}

export async function deleteTable(formData: FormData) {
  await assertAdmin();
  const tableId = String(formData.get("tableId") || "");
  if (!tableId) return;
  await deleteTableRecord(tableId);
  revalidateTableViews();
}
