import { appConfig } from "../config";
import { getSupabaseAdmin } from "../supabase/admin";
import type { Wedding } from "../types/wedding";
import type { WeddingFormInput } from "../validations/wedding.schema";
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

export async function updateWedding(id: string, input: WeddingFormInput): Promise<Wedding> {
  const { data, error } = await getSupabaseAdmin()
    .from("weddings")
    .update({
      couple_name: input.coupleName,
      title: input.title,
      wedding_date: input.weddingDate,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id)
    .select("*")
    .single<WeddingRow>();

  if (error) throw new Error(`No se pudo actualizar la boda: ${error.message}`);
  activeWeddingPromise = null;
  return mapWedding(data);
}
