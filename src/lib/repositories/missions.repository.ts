import { getSupabaseAdmin } from "../supabase/admin";
import type { Mission } from "../types/mission";
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
