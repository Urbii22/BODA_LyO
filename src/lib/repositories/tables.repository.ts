import { getSupabaseAdmin } from "../supabase/admin";
import type { Mission } from "../types/mission";
import type { TableWithMission, WeddingTable } from "../types/table";
import { buildGroupCodeFromName } from "../utils/group-identity";
import { getLookupCodesFromGroupCode } from "../utils/group-labels";
import { normalizeTableCode } from "../utils/normalize-table-code";
import type { TableFormInput } from "../validations/table.schema";
import { mapMission, mapTable, type MissionRow, type TableRow } from "./mappers";

type TableWithMissionRow = TableRow & {
  missions: MissionRow | null;
};

export async function getTableByCode(weddingId: string, code: string): Promise<TableWithMission | null> {
  const normalizedCode = normalizeTableCode(code);
  const lookupCodes = getLookupCodesFromGroupCode(normalizedCode);
  const { data, error } = await getSupabaseAdmin()
    .from("tables")
    .select("*, missions(*)")
    .eq("wedding_id", weddingId)
    .in("code", lookupCodes)
    .order("code", { ascending: true })
    .limit(1)
    .maybeSingle<TableWithMissionRow>();

  if (error) throw new Error(`No se pudo cargar el grupo: ${error.message}`);
  if (!data) return null;

  const mission: Mission | null = data.missions ? mapMission(data.missions) : null;
  return { ...mapTable(data), mission };
}

export async function setTableMission(tableId: string, missionId: string | null): Promise<void> {
  const { error } = await getSupabaseAdmin()
    .from("tables")
    .update({ mission_id: missionId, updated_at: new Date().toISOString() })
    .eq("id", tableId);

  if (error) throw new Error(`No se pudo asignar la mision: ${error.message}`);
}

export async function getTableNotificationContext(tableId: string): Promise<TableWithMission | null> {
  const { data, error } = await getSupabaseAdmin()
    .from("tables")
    .select("*, missions(*)")
    .eq("id", tableId)
    .maybeSingle<TableWithMissionRow>();

  if (error) throw new Error(`No se pudo cargar el grupo: ${error.message}`);
  if (!data) return null;

  return {
    ...mapTable(data),
    mission: data.missions ? mapMission(data.missions) : null,
  };
}

export async function createTable(weddingId: string, input: TableFormInput): Promise<WeddingTable> {
  const { data, error } = await getSupabaseAdmin()
    .from("tables")
    .insert({
      wedding_id: weddingId,
      code: input.code,
      name: input.name,
      display_order: input.displayOrder,
      mission_id: input.missionId,
    })
    .select("*")
    .single<TableRow>();

  if (error) throw new Error(`No se pudo crear el grupo: ${error.message}`);
  return mapTable(data);
}

export type ResolvedGroupTable = {
  table: TableWithMission;
  created: boolean;
};

export async function resolveOrCreateTableFromGroupName(
  weddingId: string,
  groupName: string,
): Promise<ResolvedGroupTable> {
  const code = buildGroupCodeFromName(groupName);
  const existing = await getTableByCode(weddingId, code);
  if (existing) return { table: existing, created: false };

  const [missionId, displayOrder] = await Promise.all([
    getLeastUsedActiveMissionId(weddingId),
    getNextDisplayOrder(weddingId),
  ]);

  const { data, error } = await getSupabaseAdmin()
    .from("tables")
    .insert({
      wedding_id: weddingId,
      code,
      name: groupName,
      display_order: displayOrder,
      mission_id: missionId,
    })
    .select("*, missions(*)")
    .single<TableWithMissionRow>();

  if (error) {
    if (error.code === "23505") {
      const racedTable = await getTableByCode(weddingId, code);
      if (racedTable) return { table: racedTable, created: false };
    }
    throw new Error(`No se pudo preparar el grupo: ${error.message}`);
  }

  const mission: Mission | null = data.missions ? mapMission(data.missions) : null;
  return { table: { ...mapTable(data), mission }, created: true };
}

export async function updateTable(id: string, input: TableFormInput): Promise<WeddingTable> {
  const { data, error } = await getSupabaseAdmin()
    .from("tables")
    .update({
      code: input.code,
      name: input.name,
      display_order: input.displayOrder,
      mission_id: input.missionId,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id)
    .select("*")
    .single<TableRow>();

  if (error) throw new Error(`No se pudo actualizar el grupo: ${error.message}`);
  return mapTable(data);
}

export async function deleteTable(id: string): Promise<void> {
  const { count, error: countError } = await getSupabaseAdmin()
    .from("submissions")
    .select("id", { count: "exact", head: true })
    .eq("table_id", id);

  if (countError) throw new Error(`No se pudo comprobar el grupo: ${countError.message}`);
  if ((count ?? 0) > 0) throw new Error("No se puede borrar un grupo con pruebas enviadas.");

  const { error } = await getSupabaseAdmin().from("tables").delete().eq("id", id);
  if (error) throw new Error(`No se pudo borrar el grupo: ${error.message}`);
}

export type TableUsage = Record<string, { submissions: number; approved: number; points: number }>;

export async function getTableUsage(weddingId: string): Promise<TableUsage> {
  const { data, error } = await getSupabaseAdmin()
    .from("submissions")
    .select("table_id, status, awarded_points")
    .eq("wedding_id", weddingId)
    .returns<{ table_id: string; status: "pending" | "approved" | "rejected"; awarded_points: number }[]>();

  if (error) throw new Error(`No se pudo calcular el uso de grupos: ${error.message}`);

  const usage: TableUsage = {};
  for (const row of data) {
    usage[row.table_id] ??= { submissions: 0, approved: 0, points: 0 };
    usage[row.table_id].submissions += 1;
    if (row.status === "approved") {
      usage[row.table_id].approved += 1;
      usage[row.table_id].points += row.awarded_points;
    }
  }
  return usage;
}

export async function listTables(weddingId: string): Promise<WeddingTable[]> {
  const { data, error } = await getSupabaseAdmin()
    .from("tables")
    .select("*")
    .eq("wedding_id", weddingId)
    .order("display_order", { ascending: true })
    .returns<TableRow[]>();

  if (error) throw new Error(`No se pudieron cargar los grupos: ${error.message}`);
  return data.map(mapTable);
}

async function getLeastUsedActiveMissionId(weddingId: string): Promise<string | null> {
  const admin = getSupabaseAdmin();
  const [missionsRes, tablesRes] = await Promise.all([
    admin
      .from("missions")
      .select("id")
      .eq("wedding_id", weddingId)
      .eq("is_active", true)
      .order("created_at", { ascending: true })
      .returns<Pick<MissionRow, "id">[]>(),
    admin
      .from("tables")
      .select("mission_id")
      .eq("wedding_id", weddingId)
      .returns<{ mission_id: string | null }[]>(),
  ]);

  if (missionsRes.error) throw new Error(`No se pudieron cargar las misiones: ${missionsRes.error.message}`);
  if (tablesRes.error) throw new Error(`No se pudo calcular el reparto de misiones: ${tablesRes.error.message}`);
  if (missionsRes.data.length === 0) return null;

  const usage = new Map<string, number>();
  for (const row of tablesRes.data) {
    if (!row.mission_id) continue;
    usage.set(row.mission_id, (usage.get(row.mission_id) ?? 0) + 1);
  }

  return missionsRes.data.reduce((best, mission) => {
    const bestUsage = usage.get(best.id) ?? 0;
    const missionUsage = usage.get(mission.id) ?? 0;
    return missionUsage < bestUsage ? mission : best;
  }, missionsRes.data[0]).id;
}

async function getNextDisplayOrder(weddingId: string): Promise<number> {
  const { data, error } = await getSupabaseAdmin()
    .from("tables")
    .select("display_order")
    .eq("wedding_id", weddingId)
    .order("display_order", { ascending: false })
    .limit(1)
    .maybeSingle<Pick<TableRow, "display_order">>();

  if (error) throw new Error(`No se pudo calcular el orden del grupo: ${error.message}`);
  return (data?.display_order ?? 0) + 1;
}
