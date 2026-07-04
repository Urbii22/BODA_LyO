# MesaQuest

Juego social para la boda de Luis y Oscar: cada grupo escanea su QR, recibe misiones del jurado, sube una foto como prueba y compite en un ranking publico.

Produccion: https://boda-lyo.vercel.app

## Stack

- Next.js 15 App Router, Server Components y Server Actions.
- Tailwind v4 con tokens en `src/app/globals.css`.
- Supabase Postgres + Storage privado.
- Admin por PIN con cookie HTTP-only firmada.
- Push web con VAPID para avisos de misiones y revisiones.

## Directo del jurado

En `/admin/missions`, el jurado puede lanzar una mision activa a todos los grupos registrados o a un grupo concreto. El lanzamiento actualiza la mision visible en la pagina del grupo y envia una notificacion push a los dispositivos que hayan activado avisos.

## Desarrollo

```bash
npm install
npm run dev
```

Abre `http://localhost:3000`.

## Supabase

1. Ejecuta `database/schema.sql` en Supabase Studio.
2. Ejecuta `database/seed.sql`.
3. Ejecuta `database/storage.sql` para crear el bucket privado `submissions` con limite 5 MB y MIME allowlist `image/jpeg,image/png,image/webp`.
4. Copia `.env.local.example` a `.env.local` y completa las variables.
5. En Vercel, completa las variables secretas que faltan: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`, `ADMIN_PIN` o `ADMIN_PASSWORD`, `SESSION_SECRET`, `NEXT_PUBLIC_VAPID_PUBLIC_KEY`, `VAPID_PRIVATE_KEY` y `VAPID_SUBJECT`.

## Checks

```bash
npm run lint
npm run build
```
