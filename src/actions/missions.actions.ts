"use server";

import { revalidatePath } from "next/cache";
import { assertAdmin } from "../lib/utils/assert-admin";
import {
  createMission as createMissionRecord,
  deleteMission as deleteMissionRecord,
  listMissions,
  setMissionActive,
  updateMission as updateMissionRecord,
} from "../lib/repositories/missions.repository";
import { getTableNotificationContext, listTables, setTableMission } from "../lib/repositories/tables.repository";
import { getActiveWedding } from "../lib/repositories/weddings.repository";
import { notifyTable } from "../lib/push/web-push";
import { displayGroupCode, displayGroupName } from "../lib/utils/group-labels";
import { missionFormSchema, missionLaunchSchema } from "../lib/validations/mission.schema";
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
  revalidatePath("/grupo/[code]", "page");
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
  if (missionValue) {
    try {
      const table = await getTableNotificationContext(tableId);
      if (table?.mission) {
        await notifyTable({
          tableId,
          title: "Nueva quest para vuestro grupo",
          body: `${displayGroupName(table.name)}: ${table.mission.title}`,
          url: `/grupo/${encodeURIComponent(displayGroupCode(table.code))}`,
          tag: `mission-${tableId}-${table.mission.id}`,
        });
      }
    } catch (error) {
      console.error("No se pudo enviar la notificacion de nueva mision", error);
    }
  }
  revalidateMissionViews();
}

export async function launchMission(
  _previousState: MissionActionState,
  formData: FormData,
): Promise<MissionActionState> {
  await assertAdmin();

  const parsed = missionLaunchSchema.safeParse({
    missionId: formData.get("missionId"),
    targetMode: formData.get("targetMode"),
    tableId: formData.get("tableId") || undefined,
    message: formData.get("message") || undefined,
  });

  if (!parsed.success) {
    return { ok: false, message: parsed.error.issues[0]?.message || "Lanzamiento no valido." };
  }

  const wedding = await getActiveWedding();
  const [missions, tables] = await Promise.all([
    listMissions(wedding.id),
    listTables(wedding.id),
  ]);
  const mission = missions.find((item) => item.id === parsed.data.missionId);

  if (!mission) return { ok: false, message: "La mision elegida ya no existe." };
  if (!mission.isActive) return { ok: false, message: "Activa la mision antes de lanzarla." };

  const targetTables = parsed.data.targetMode === "all"
    ? tables
    : tables.filter((table) => table.id === parsed.data.tableId);

  if (targetTables.length === 0) {
    return { ok: false, message: "No hay grupos preparados para recibir esta mision." };
  }

  await Promise.all(targetTables.map((table) => setTableMission(table.id, mission.id)));

  const notificationText = parsed.data.message?.trim() || "El jurado acaba de lanzar una nueva mision. Entrad y participad.";
  const launchTag = `mission-launch-${mission.id}-${Date.now()}`;
  let sent = 0;
  let skipped = false;
  let failed = 0;

  await Promise.all(targetTables.map(async (table) => {
    try {
      const result = await notifyTable({
        tableId: table.id,
        title: "Mision lanzada",
        body: `${displayGroupName(table.name)}: ${mission.title}. ${notificationText}`,
        url: `/grupo/${encodeURIComponent(displayGroupCode(table.code))}`,
        tag: `${launchTag}-${table.id}`,
      });
      sent += result.sent;
      skipped = skipped || result.skipped;
    } catch (error) {
      failed += 1;
      console.error("No se pudo enviar la notificacion de lanzamiento", error);
    }
  }));

  revalidateMissionViews();
  revalidatePath("/admin/tables");

  const groupCopy = targetTables.length === 1 ? "1 grupo" : `${targetTables.length} grupos`;
  const pushCopy = skipped
    ? "Los avisos push no estan configurados."
    : `${sent} dispositivo${sent === 1 ? "" : "s"} avisado${sent === 1 ? "" : "s"}.`;
  const failureCopy = failed > 0 ? ` ${failed} grupo${failed === 1 ? "" : "s"} tuvo error de aviso.` : "";

  return {
    ok: true,
    message: `Mision "${mission.title}" lanzada a ${groupCopy}. ${pushCopy}${failureCopy}`,
  };
}
