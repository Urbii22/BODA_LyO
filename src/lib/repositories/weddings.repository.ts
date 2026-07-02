import { appConfig } from "../config";
import { getSupabaseAdmin } from "../supabase/admin";
import type { Wedding } from "../types/wedding";
import { mapWedding, type WeddingRow } from "./mappers";

let activeWeddingPromise: Promise<Wedding> | null = null;

export function getActiveWedding(): Promise<Wedding> {
  activeWeddingPromise ??= fetchActiveWedding();
  return activeWeddingPromise;
}

async function fetchActiveWedding() {
  const { data, error } = await getSupabaseAdmin()
    .from("weddings")
    .select("*")
    .eq("slug", appConfig.weddingSlug)
    .eq("is_active", true)
    .single<WeddingRow>();

  if (error) throw new Error(`No se pudo cargar la boda activa: ${error.message}`);
  return mapWedding(data);
}
