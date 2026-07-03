self.addEventListener("push", (event) => {
  let payload = {};
  try {
    payload = event.data ? event.data.json() : {};
  } catch {
    payload = {};
  }

  const title = payload.title || "GrupoQuest";
  const options = {
    body: payload.body || "Hay novedades para vuestro grupo.",
    tag: payload.tag || "grupoquest",
    renotify: true,
    icon: "/brand/ilustracion-novios.png",
    badge: "/brand/ilustracion-novios.png",
    data: {
      url: payload.url || "/",
    },
  };

  event.waitUntil(self.registration.showNotification(title, options));
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  const url = event.notification.data?.url || "/";
  event.waitUntil(
    clients.matchAll({ type: "window", includeUncontrolled: true }).then((clientList) => {
      for (const client of clientList) {
        if ("focus" in client && client.url.includes(url)) return client.focus();
      }
      return clients.openWindow(url);
    }),
  );
});
