"use client";

import { useEffect, useState } from "react";
import { Button } from "../ui/Button";
import { Card } from "../ui/Card";

function urlBase64ToUint8Array(base64String: string) {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = `${base64String}${padding}`.replace(/-/g, "+").replace(/_/g, "/");
  const rawData = window.atob(base64);
  return Uint8Array.from([...rawData].map((char) => char.charCodeAt(0)));
}

type PushStatus = "checking" | "unsupported" | "unavailable" | "idle" | "subscribed" | "denied" | "saving";

export function PushNotificationCard({ tableCode }: { tableCode: string }) {
  const [status, setStatus] = useState<PushStatus>("checking");
  const [message, setMessage] = useState("");
  const [publicKey, setPublicKey] = useState("");

  useEffect(() => {
    async function checkSupport() {
      if (!("serviceWorker" in navigator) || !("PushManager" in window) || !("Notification" in window)) {
        setStatus("unsupported");
        return;
      }

      const response = await fetch("/api/push/subscribe", { method: "GET" });
      const config = await response.json() as { enabled?: boolean; publicKey?: string };
      if (!config.enabled || !config.publicKey) {
        setStatus("unavailable");
        return;
      }

      setPublicKey(config.publicKey);
      if (Notification.permission === "denied") {
        setStatus("denied");
        return;
      }

      const registration = await navigator.serviceWorker.register("/sw.js");
      const existing = await registration.pushManager.getSubscription();
      setStatus(existing ? "subscribed" : "idle");
    }

    checkSupport().catch(() => {
      setStatus("unsupported");
    });
  }, []);

  async function subscribe() {
    setStatus("saving");
    setMessage("");

    try {
      const permission = await Notification.requestPermission();
      if (permission !== "granted") {
        setStatus(permission === "denied" ? "denied" : "idle");
        setMessage("Permiso no concedido. Podeis activarlo luego desde el navegador.");
        return;
      }

      const registration = await navigator.serviceWorker.register("/sw.js");
      const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(publicKey),
      });

      const response = await fetch("/api/push/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tableCode, subscription }),
      });

      if (!response.ok) throw new Error("No se pudo guardar la suscripcion.");
      setStatus("subscribed");
      setMessage("Listo. Este dispositivo recibira avisos del grupo.");
    } catch (error) {
      setStatus("idle");
      setMessage(error instanceof Error ? error.message : "No se pudieron activar los avisos.");
    }
  }

  if (status === "checking") return null;

  const copy = {
    unsupported: "Este navegador no admite notificaciones push web.",
    unavailable: "Los avisos push aun no estan configurados.",
    denied: "Las notificaciones estan bloqueadas en este navegador.",
    idle: "Activad avisos para enteraros cuando llegue una nueva mision o el jurado revise una prueba.",
    subscribed: "Avisos activados en este dispositivo.",
    saving: "Activando avisos...",
  }[status];

  return (
    <Card>
      <p className="hand-label text-lavanda">Avisos del grupo</p>
      <h2 className="mt-1 font-serif text-4xl font-bold leading-none">Notificaciones</h2>
      <p className="mt-3 text-graphite">{copy}</p>
      {message ? <p className="mt-3 text-sm font-semibold text-vino">{message}</p> : null}
      {status === "idle" ? (
        <Button type="button" className="mt-4" onClick={subscribe}>
          Activar avisos
        </Button>
      ) : null}
    </Card>
  );
}
