import { getSupabaseAdmin } from "../supabase/admin";
import type { Mission } from "../types/mission";
import type { TableWithMission, WeddingTable } from "../types/table";
import { normalizeTableCode } from "../utils/normalize-table-code";
import { mapMission, mapTable, type MissionRow, type TableRow } from "./mappers";

type TableWithMissionRow = TableRow & {
  missions: MissionRow | null;
};

export async function getTableByCode(weddingId: string, code: string): Promise<TableWithMission | null> {
  const normalizedCode = normalizeTableCode(code);
  const { data, error } = await getSupabaseAdmin()
    .from("tables")
    .select("*, missions(*)")
    .eq("wedding_id", weddingId)
    .eq("code", normalizedCode)
    .maybeSingle<TableWithMissionRow>();

  if (error) throw new Error(`No se pudo cargar la mesa: ${error.message}`);
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

export async function listTables(weddingId: string): Promise<WeddingTable[]> {
  const { data, error } = await getSupabaseAdmin()
    .from("tables")
    .select("*")
    .eq("wedding_id", weddingId)
    .order("display_order", { ascending: true })
    .returns<TableRow[]>();

  if (error) throw new Error(`No se pudieron cargar las mesas: ${error.message}`);
  return data.map(mapTable);
}
