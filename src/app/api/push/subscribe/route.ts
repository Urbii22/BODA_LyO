import type webPush from "web-push";
import { NextResponse } from "next/server";
import { getTableByCode } from "../../../../lib/repositories/tables.repository";
import { upsertPushSubscription } from "../../../../lib/repositories/push-subscriptions.repository";
import { getActiveWedding } from "../../../../lib/repositories/weddings.repository";
import { getPushPublicKey, hasPushConfig } from "../../../../lib/push/web-push";
import { normalizeTableCode } from "../../../../lib/utils/normalize-table-code";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  return NextResponse.json({
    enabled: hasPushConfig(),
    publicKey: getPushPublicKey(),
  });
}

export async function POST(request: Request) {
  if (!hasPushConfig()) {
    return NextResponse.json({ ok: false, message: "Las notificaciones push no estan configuradas." }, { status: 503 });
  }

  const body = await request.json().catch(() => null) as {
    tableCode?: string;
    subscription?: webPush.PushSubscription;
  } | null;

  if (!body?.tableCode || !body.subscription?.endpoint) {
    return NextResponse.json({ ok: false, message: "Faltan datos de suscripcion." }, { status: 400 });
  }

  const wedding = await getActiveWedding();
  const table = await getTableByCode(wedding.id, normalizeTableCode(body.tableCode));
  if (!table) {
    return NextResponse.json({ ok: false, message: "Grupo no encontrado." }, { status: 404 });
  }

  await upsertPushSubscription({
    weddingId: wedding.id,
    tableId: table.id,
    subscription: body.subscription,
    userAgent: request.headers.get("user-agent"),
  });

  return NextResponse.json({ ok: true });
}
