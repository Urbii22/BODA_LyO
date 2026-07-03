import "server-only";

import webPush from "web-push";
import { deletePushSubscription, listPushSubscriptionsForTable } from "../repositories/push-subscriptions.repository";

let configured = false;

export function getPushPublicKey() {
  return process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY || "";
}

export function hasPushConfig() {
  return Boolean(process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY && process.env.VAPID_PRIVATE_KEY);
}

function configureWebPush() {
  if (configured || !hasPushConfig()) return;
  webPush.setVapidDetails(
    process.env.VAPID_SUBJECT || "mailto:admin@example.com",
    process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY || "",
    process.env.VAPID_PRIVATE_KEY || "",
  );
  configured = true;
}

export async function notifyTable(input: {
  tableId: string;
  title: string;
  body: string;
  url: string;
  tag: string;
}) {
  if (!hasPushConfig()) return { sent: 0, skipped: true };
  configureWebPush();

  const subscriptions = await listPushSubscriptionsForTable(input.tableId);
  let sent = 0;

  await Promise.all(
    subscriptions.map(async ({ endpoint, subscription }) => {
      try {
        await webPush.sendNotification(
          subscription,
          JSON.stringify({
            title: input.title,
            body: input.body,
            url: input.url,
            tag: input.tag,
          }),
        );
        sent += 1;
      } catch (error) {
        const statusCode = typeof error === "object" && error && "statusCode" in error
          ? Number((error as { statusCode?: unknown }).statusCode)
          : 0;
        if (statusCode === 404 || statusCode === 410) {
          await deletePushSubscription(endpoint);
          return;
        }
        console.error("No se pudo enviar una notificacion push", error);
      }
    }),
  );

  return { sent, skipped: false };
}
