# MesaQuest

Juego social para la boda de Luis y Oscar: cada mesa escanea su QR, recibe una mision secreta, sube una foto como prueba y compite en un ranking publico.

Produccion: https://boda-lyo.vercel.app

## Stack

- Next.js 15 App Router, Server Components y Server Actions.
- Tailwind v4 con tokens en `src/app/globals.css`.
- Supabase Postgres + Storage privado.
- Admin por PIN con cookie HTTP-only firmada.

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
5. En Vercel, completa las variables secretas que faltan: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`, `ADMIN_PIN` y `SESSION_SECRET`.

## Checks

```bash
npm run lint
npm run build
```
