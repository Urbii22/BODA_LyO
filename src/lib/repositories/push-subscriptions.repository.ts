import type webPush from "web-push";
import { getSupabaseAdmin } from "../supabase/admin";
import type { Json } from "../supabase/database.types";

export type StoredPushSubscription = {
  endpoint: string;
  subscription: webPush.PushSubscription;
};

export async function upsertPushSubscription(input: {
  weddingId: string;
  tableId: string;
  subscription: webPush.PushSubscription;
  userAgent?: string | null;
}) {
  const { endpoint } = input.subscription;
  const now = new Date().toISOString();
  const { error } = await getSupabaseAdmin()
    .from("push_subscriptions")
    .upsert(
      {
        wedding_id: input.weddingId,
        table_id: input.tableId,
        endpoint,
        subscription: input.subscription as unknown as Json,
        user_agent: input.userAgent ?? null,
        updated_at: now,
        last_seen_at: now,
      },
      { onConflict: "endpoint" },
    );

  if (error) throw new Error(`No se pudo guardar la suscripcion push: ${error.message}`);
}

export async function listPushSubscriptionsForTable(tableId: string): Promise<StoredPushSubscription[]> {
  const { data, error } = await getSupabaseAdmin()
    .from("push_subscriptions")
    .select("endpoint, subscription")
    .eq("table_id", tableId)
    .returns<{ endpoint: string; subscription: Json }[]>();

  if (error) throw new Error(`No se pudieron cargar las suscripciones push: ${error.message}`);
  return data.map((row) => ({
    endpoint: row.endpoint,
    subscription: row.subscription as unknown as webPush.PushSubscription,
  }));
}

export async function deletePushSubscription(endpoint: string) {
  const { error } = await getSupabaseAdmin().from("push_subscriptions").delete().eq("endpoint", endpoint);
  if (error) throw new Error(`No se pudo borrar la suscripcion push: ${error.message}`);
}
