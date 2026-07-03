import { getSupabaseAdmin } from "../supabase/admin";
import type { Mission } from "../types/mission";
import type { MissionFormInput } from "../validations/mission.schema";
import { mapMission, type MissionRow } from "./mappers";

export async function listMissions(weddingId: string): Promise<Mission[]> {
  const { data, error } = await getSupabaseAdmin()
    .from("missions")
    .select("*")
    .eq("wedding_id", weddingId)
    .order("created_at", { ascending: true })
    .returns<MissionRow[]>();

  if (error) throw new Error(`No se pudieron cargar las misiones: ${error.message}`);
  return data.map(mapMission);
}

export async function createMission(weddingId: string, input: MissionFormInput): Promise<Mission> {
  const { data, error } = await getSupabaseAdmin()
    .from("missions")
    .insert({ wedding_id: weddingId, ...input })
    .select("*")
    .single<MissionRow>();

  if (error) throw new Error(`No se pudo crear la mision: ${error.message}`);
  return mapMission(data);
}

export async function updateMission(id: string, input: MissionFormInput): Promise<Mission> {
  const { data, error } = await getSupabaseAdmin()
    .from("missions")
    .update({ ...input, updated_at: new Date().toISOString() })
    .eq("id", id)
    .select("*")
    .single<MissionRow>();

  if (error) throw new Error(`No se pudo actualizar la mision: ${error.message}`);
  return mapMission(data);
}

export async function setMissionActive(id: string, isActive: boolean): Promise<void> {
  const { error } = await getSupabaseAdmin()
    .from("missions")
    .update({ is_active: isActive, updated_at: new Date().toISOString() })
    .eq("id", id);

  if (error) throw new Error(`No se pudo actualizar la mision: ${error.message}`);
}

export async function deleteMission(id: string): Promise<void> {
  const { error } = await getSupabaseAdmin().from("missions").delete().eq("id", id);
  if (error) throw new Error(`No se pudo borrar la mision: ${error.message}`);
}

export type MissionUsage = Record<string, { tables: number; submissions: number }>;

export async function getMissionUsage(weddingId: string): Promise<MissionUsage> {
  const admin = getSupabaseAdmin();
  const [tablesRes, submissionsRes] = await Promise.all([
    admin.from("tables").select("mission_id").eq("wedding_id", weddingId).returns<{ mission_id: string | null }[]>(),
    admin.from("submissions").select("mission_id").eq("wedding_id", weddingId).returns<{ mission_id: string }[]>(),
  ]);

  if (tablesRes.error) throw new Error(`No se pudo calcular el uso: ${tablesRes.error.message}`);
  if (submissionsRes.error) throw new Error(`No se pudo calcular el uso: ${submissionsRes.error.message}`);

  const usage: MissionUsage = {};
  const bump = (id: string | null, key: "tables" | "submissions") => {
    if (!id) return;
    usage[id] ??= { tables: 0, submissions: 0 };
    usage[id][key] += 1;
  };

  tablesRes.data.forEach((row) => bump(row.mission_id, "tables"));
  submissionsRes.data.forEach((row) => bump(row.mission_id, "submissions"));
  return usage;
}
