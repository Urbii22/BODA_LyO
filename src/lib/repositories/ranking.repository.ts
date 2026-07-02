import { getSupabaseAdmin } from "../supabase/admin";
import type { RankingRow } from "../types/ranking";
import { mapRankingRow, type RankingRowDb } from "./mappers";

export async function getRanking(weddingId: string): Promise<RankingRow[]> {
  const { data, error } = await getSupabaseAdmin()
    .from("ranking_view")
    .select("*")
    .eq("wedding_id", weddingId)
    .order("total_points", { ascending: false })
    .order("approved_count", { ascending: false })
    .order("first_approved_at", { ascending: true, nullsFirst: false })
    .order("display_order", { ascending: true })
    .returns<RankingRowDb[]>();

  if (error) throw new Error(`No se pudo cargar el ranking: ${error.message}`);
  return data.map(mapRankingRow);
}
