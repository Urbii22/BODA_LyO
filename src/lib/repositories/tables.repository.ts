import { getSupabaseAdmin } from "../supabase/admin";
import type { Mission } from "../types/mission";
import type { TableWithMission, WeddingTable } from "../types/table";
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
