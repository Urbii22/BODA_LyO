"use server";

import { revalidatePath } from "next/cache";
import { assertAdmin } from "../lib/utils/assert-admin";
import {
  createMission as createMissionRecord,
  deleteMission as deleteMissionRecord,
  setMissionActive,
  updateMission as updateMissionRecord,
} from "../lib/repositories/missions.repository";
import { setTableMission } from "../lib/repositories/tables.repository";
import { getActiveWedding } from "../lib/repositories/weddings.repository";
import { missionFormSchema } from "../lib/validations/mission.schema";
import type { MissionActionState } from "./mission-action-state";

function readMissionForm(formData: FormData) {
  return missionFormSchema.safeParse({
    title: formData.get("title"),
    description: formData.get("description"),
    points: formData.get("points"),
    difficulty: formData.get("difficulty"),
    category: formData.get("category"),
  });
}

function revalidateMissionViews() {
  revalidatePath("/admin");
  revalidatePath("/admin/missions");
  revalidatePath("/mesa/[code]", "page");
}

export async function createMission(
  _previousState: MissionActionState,
  formData: FormData,
): Promise<MissionActionState> {
  await assertAdmin();

  const parsed = readMissionForm(formData);
  if (!parsed.success) {
    return { ok: false, message: parsed.error.issues[0]?.message || "Datos no validos." };
  }

  const wedding = await getActiveWedding();
  await createMissionRecord(wedding.id, parsed.data);
  revalidateMissionViews();
  return { ok: true, message: `Mision "${parsed.data.title}" creada.` };
}

export async function updateMission(
  _previousState: MissionActionState,
  formData: FormData,
): Promise<MissionActionState> {
  await assertAdmin();

  const missionId = String(formData.get("missionId") || "");
  if (!missionId) return { ok: false, message: "Falta la mision." };

  const parsed = readMissionForm(formData);
  if (!parsed.success) {
    return { ok: false, message: parsed.error.issues[0]?.message || "Datos no validos." };
  }

  await updateMissionRecord(missionId, parsed.data);
  revalidateMissionViews();
  return { ok: true, message: "Mision actualizada." };
}

export async function toggleMissionActive(formData: FormData) {
  await assertAdmin();
  const missionId = String(formData.get("missionId") || "");
  const nextActive = formData.get("active") === "true";
  if (!missionId) return;
  await setMissionActive(missionId, nextActive);
  revalidateMissionViews();
}

export async function deleteMission(formData: FormData) {
  await assertAdmin();
  const missionId = String(formData.get("missionId") || "");
  if (!missionId) return;
  await deleteMissionRecord(missionId);
  revalidateMissionViews();
}

export async function assignTableMission(formData: FormData) {
  await assertAdmin();
  const tableId = String(formData.get("tableId") || "");
  const missionValue = String(formData.get("missionId") || "");
  if (!tableId) return;
  await setTableMission(tableId, missionValue || null);
  revalidateMissionViews();
}
