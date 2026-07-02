# MesaQuest / Wedding Missions — Plan de Implementación V2 (refinado)

> Plan técnico accionable para implementar por fases con Codex.
> Prioridades: simplicidad, coste 0, fiabilidad, rapidez.
> V2: revisado críticamente — menos piezas, pitfalls de Codex explícitos, seguridad corregida.

---

## 0. Reglas globales para Codex (leer antes de cada fase)

Estas reglas aplican a TODAS las fases. Violarlas = fase no aceptada.

1. **Sin API routes.** Lecturas = Server Components. Escrituras = Server Actions en `src/actions/`. Nada en `app/api/`.
2. **El cliente nunca habla con Supabase.** Todo acceso a datos pasa por `lib/repositories/*`, que usan el cliente service-role de `lib/supabase/admin.ts` (con `import 'server-only'` en la primera línea).
3. **Caché explícita por ruta.** Páginas públicas (`/`, `/mesa/[code]`, `/ranking`, `/ranking/live`): `export const revalidate = 10;`. Rutas admin: `export const dynamic = 'force-dynamic';`. No confiar en defaults de Next.
4. **Next 15: `cookies()` y `params` son async.** Siempre `await cookies()`, `const { code } = await params`.
5. **Tailwind v4: NO existe `tailwind.config.js`.** Tokens de tema en CSS con `@theme` dentro de `globals.css`. No generar archivos de config de Tailwind.
6. **Toda Server Action admin empieza con `await assertAdmin()`.** Las Server Actions son endpoints públicos; el guard del layout NO protege las actions.
7. **Dependencias cerradas.** Prod: `next`, `react`, `react-dom`, `@supabase/supabase-js`, `zod`, `qrcode`, `browser-image-compression`. Dev extra: `@types/qrcode`. **No añadir ninguna otra** sin justificarlo.
8. **TypeScript estricto, sin `any`.** Mapeo snake_case (BD) → camelCase (TS) solo dentro de repositories.
9. **No implementar nada marcado "fuera de V1"** aunque parezca fácil.
10. **Textos de UI en español**, tono divertido-elegante (boda, no dashboard corporativo).

---

## 1. Resumen del producto

Juego social por mesas para una boda: cada mesa escanea su QR → ve su misión secreta → sube foto como prueba → el admin aprueba/rechaza → ranking público con puntos. Sin login de invitados. Un solo evento. Mobile-first. Coste 0.

**Métrica de diseño:** camino QR → misión → foto → enviado en **menos de 60 segundos**.

## 2. Stack final

| Capa | Elección |
|---|---|
| Framework | Next.js 15 App Router, Server Components + Server Actions |
| Lenguaje | TypeScript estricto |
| Estilos | Tailwind v4 (tokens vía `@theme` en CSS) |
| BD + Storage | Supabase Free (Postgres + bucket privado) |
| Validación | Zod (schemas compartidos) |
| Imagen | `browser-image-compression` en cliente |
| QR | `qrcode` (data-URLs, sin servicios externos) |
| Auth admin | PIN + cookie HTTP-only firmada con HMAC |
| Deploy | Vercel Hobby |

Descartado conscientemente: Prisma, React Hook Form, Supabase Auth, next/image para fotos de pruebas, realtime/websockets, API routes.

## 3. Arquitectura

```
Invitado móvil ──GET /mesa/MESA-1──►┌─ Vercel / Next.js ─────────────────┐
Proyector ──GET /ranking/live──────►│ Server Components (leer)           │
Admin ──/admin + cookie HMAC───────►│ Server Actions (escribir)          │
                                    │        │                           │
                                    │  lib/repositories/* (única puerta) │
                                    └────────┼───────────────────────────┘
                                             │ SERVICE_ROLE_KEY (solo server)
                                    ┌─ Supabase ─────────────────────────┐
                                    │ Postgres (RLS deny-all para anon)  │
                                    │ Storage: bucket privado            │
                                    └────────────────────────────────────┘
```

- Imagen se comprime en cliente (≤1 MB) y viaja en `FormData` a la Server Action → servidor la sube a Storage. Sin subida directa cliente→Storage (RLS trivial, validación centralizada).
- Ranking = vista SQL `ranking_view`. Live = polling con `router.refresh()` cada 15 s.
- Bucket privado; imágenes visibles solo para admin vía signed URLs (TTL 1 h).
- `revalidatePath` de ranking y mesa al aprobar/rechazar.

## 4. Decisiones cerradas

| Tema | Decisión |
|---|---|
| Imagen | **Obligatoria** (la prueba es la foto) |
| Envíos por mesa | **Ilimitados** (admin decide cuáles puntúan) |
| Estado visible al invitado | Lista de envíos de su mesa: nombre + estado, sin imagen |
| Confirmación | Inline en `/mesa/[code]`, sin ruta `/gracias` |
| Gestión mesas/misiones | Solo seed SQL; admin las ve read-only |
| Puntos al aprobar | Default = puntos de la misión; input opcional para custom/bonus |
| Nombre de la app | Centralizado en `lib/config.ts` |

## 5. SQL schema (`database/schema.sql`)

```sql
create table weddings (
  id            uuid primary key default gen_random_uuid(),
  slug          text not null unique,
  couple_name   text not null,
  title         text not null,
  wedding_date  date,
  is_active     boolean not null default true,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

create table missions (
  id          uuid primary key default gen_random_uuid(),
  wedding_id  uuid not null references weddings(id) on delete cascade,
  title       text not null,
  description text not null,
  points      integer not null check (points > 0),
  difficulty  text not null check (difficulty in ('easy','medium','hard','epic')),
  category    text not null check (category in ('social','photo','dance','emotional','funny')),
  is_active   boolean not null default true,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

create table tables (
  id            uuid primary key default gen_random_uuid(),
  wedding_id    uuid not null references weddings(id) on delete cascade,
  code          text not null,          -- siempre MAYÚSCULAS: MESA-1
  name          text not null,
  display_order integer not null default 0,
  mission_id    uuid references missions(id),
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now(),
  unique (wedding_id, code)
);

create table submissions (
  id               uuid primary key default gen_random_uuid(),
  wedding_id       uuid not null references weddings(id) on delete cascade,
  table_id         uuid not null references tables(id) on delete cascade,
  mission_id       uuid not null references missions(id),
  participant_name text not null check (char_length(participant_name) between 2 and 80),
  comment          text check (char_length(comment) <= 500),
  media_path       text not null,       -- path en Storage; URLs firmadas al vuelo
  status           text not null default 'pending'
                   check (status in ('pending','approved','rejected')),
  awarded_points   integer not null default 0 check (awarded_points >= 0),
  admin_note       text,
  created_at       timestamptz not null default now(),
  reviewed_at      timestamptz,
  updated_at       timestamptz not null default now()
);

create index idx_tables_wedding_code on tables (wedding_id, code);
create index idx_submissions_status  on submissions (wedding_id, status, created_at desc);
create index idx_submissions_table   on submissions (table_id, created_at desc);

-- IMPORTANTE: security_invoker. Sin él, la vista corre como owner y se salta RLS,
-- y Supabase da grants por defecto a anon sobre objetos del schema public.
create view ranking_view with (security_invoker = true) as
select
  t.id          as table_id,
  t.wedding_id,
  t.name        as table_name,
  t.code        as table_code,
  t.display_order,
  coalesce(sum(s.awarded_points) filter (where s.status = 'approved'), 0) as total_points,
  count(s.id)   filter (where s.status = 'approved')                      as approved_count,
  min(s.reviewed_at) filter (where s.status = 'approved')                 as first_approved_at
from tables t
left join submissions s on s.table_id = t.id
group by t.id;

-- RLS: deny-all para anon/authenticated. service_role la bypasea (es lo que usa el servidor).
alter table weddings    enable row level security;
alter table missions    enable row level security;
alter table tables      enable row level security;
alter table submissions enable row level security;
-- Cero policies = nadie externo lee ni escribe.
revoke all on ranking_view from anon, authenticated;
```

Cambios vs V1 del plan: eliminadas columnas `media_url` (no se usa; riesgo de que Codex guarde URL pública) y `media_type` (V1 = solo imagen; añadir columna cuando exista vídeo). Vista con `security_invoker` + revoke (agujero corregido).

**`database/seed.sql`:** 1 boda, 12 misiones (sección 13), mesas reales `MESA-1..N` con misión asignada. Códigos en MAYÚSCULAS.

**Bucket Storage:** nombre `submissions`, **privado**, file size limit 5 MB, MIME allowlist `image/jpeg, image/png, image/webp` (configurado en el bucket = defensa aunque el server valide mal). Paths: `weddings/{slug}/tables/{code}/{submissionId}.jpg`.

## 6. Seguridad

- **RLS deny-all** (arriba). La anon key queda sin uso real en V1.
- **Server Actions admin:** `await assertAdmin()` como primera línea, sin excepciones.
- **Login PIN:**
  - Comparación: SHA-256 de ambos lados y luego `crypto.timingSafeEqual` (directo sobre strings lanza excepción si difieren longitudes — pitfall conocido).
  - PIN fallido → `await sleep(500)` antes de responder. (No rate-limit en memoria: inútil en serverless.)
  - Cookie `admin_session`: HTTP-only, `Secure`, `SameSite=Lax`, `maxAge` 24 h. Valor = `HMAC-SHA256(SESSION_SECRET, 'mesaquest-admin-v1')` en hex. Verificar = recomputar y comparar con hash-then-timingSafeEqual.
  - `SESSION_SECRET` separado del PIN a propósito: un HMAC cuya clave es un PIN de 6 dígitos se fuerza offline en segundos.
- **Server-only garantizado en build:** `import 'server-only'` en `lib/supabase/admin.ts` y `lib/utils/admin-session.ts` → si Codex los importa en un client component, el build falla (bien).
- **Validación de subida (server):** `file.size <= 2 * 1024 * 1024` (llega comprimida; margen), `file.type` en allowlist. Sin magic-bytes (el bucket ya filtra MIME; overkill aquí).

**Variables de entorno (7):**

```
NEXT_PUBLIC_SITE_URL=            # base para URLs de QR
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=   # requerida por el SDK; sin uso directo en V1
SUPABASE_SERVICE_ROLE_KEY=       # SOLO servidor; jamás prefijo NEXT_PUBLIC
ADMIN_PIN=                       # 6+ dígitos
SESSION_SECRET=                  # aleatorio ≥32 bytes (openssl rand -hex 32)
WEDDING_SLUG=                    # ej. ana-marcos-2026
```

`next.config.ts`:
```ts
experimental: { serverActions: { bodySizeLimit: '4mb' } }
```

## 7. Estructura de carpetas

```
src/
  app/
    globals.css                # @theme con tokens (marfil, champagne, tipografías)
    layout.tsx
    page.tsx                   # landing
    mesa/[code]/page.tsx       # revalidate = 10
    ranking/page.tsx           # revalidate = 10
    ranking/live/page.tsx      # revalidate = 10
    admin/
      layout.tsx               # force-dynamic; sin cookie → <AdminLogin/>
      page.tsx                 # dashboard: stats + listas read-only
      submissions/page.tsx
      qr/page.tsx
  actions/
    submissions.actions.ts     # createSubmission
    admin.actions.ts           # adminLogin, adminLogout, reviewSubmission
  components/
    ui/                        # Button, Card, Input, Textarea, Badge  (5, no más)
    mesa/                      # MissionCard, SubmissionForm, SubmissionStatusList
    ranking/                   # RankingTable, LiveRefresh
    admin/                     # AdminLogin, SubmissionReviewCard, AdminNav
    qr/                        # QRCard, QRGrid
  lib/
    config.ts                  # nombre app, textos pareja — único sitio
    supabase/admin.ts          # 'server-only'; singleton service-role
    repositories/              # weddings / tables / missions / submissions / ranking
    validations/submission.schema.ts
    types/                     # wedding, table, mission, submission, ranking
    utils/                     # normalize-table-code, generate-qr-url, format-date,
                               # compress-image ('use client'), admin-session ('server-only')
database/
  schema.sql
  seed.sql
```

Estados loading/empty/error: `loading.tsx` + `error.tsx` + `not-found.tsx` por ruta e inline — sin componentes genéricos `EmptyState`/`LoadingState` (abstracción prematura).

## 8. Rutas

| Ruta | Caché | Contenido |
|---|---|---|
| `/` | estática | Nombre, pareja, explicación en 3 pasos, botón ranking, enlace discreto a `/admin` en footer |
| `/mesa/[code]` | `revalidate = 10` | Misión + estado de envíos de la mesa + formulario. Código normalizado (trim+upper). Inexistente → "Mesa no encontrada, pregunta a los novios" |
| `/ranking` | `revalidate = 10` | Tabla completa, top 3 destacado |
| `/ranking/live` | `revalidate = 10` + refresh cliente 15 s | Proyector: tipografía enorme, top 5, sin nav |
| `/admin` | dinámica | Login o dashboard |
| `/admin/submissions` | dinámica | Cola de revisión, `?status=` (default pending) |
| `/admin/qr` | dinámica | Grid QR + versión imprimible (`@media print`) |

## 9. Repositorios (contrato exacto)

```ts
// weddings.repository.ts
getActiveWedding(): Promise<Wedding>   // por WEDDING_SLUG; cachear en module scope

// tables.repository.ts
getTableByCode(weddingId: string, code: string): Promise<TableWithMission | null>
listTables(weddingId: string): Promise<WeddingTable[]>          // orden display_order

// missions.repository.ts
listMissions(weddingId: string): Promise<Mission[]>

// submissions.repository.ts
createSubmission(input: NewSubmission): Promise<Submission>
listSubmissionsByTable(tableId: string): Promise<SubmissionSummary[]>  // sin media_path
listSubmissionsForAdmin(weddingId: string, status?: SubmissionStatus)
  : Promise<SubmissionWithRelations[]>        // join mesa+misión, con signed URL resuelta
reviewSubmission(id: string, verdict: SubmissionStatus,
                 awardedPoints?: number, adminNote?: string): Promise<void>
getAdminStats(weddingId: string): Promise<{ pending: number; approved: number;
  rejected: number; tablesWithApproved: number }>
getSignedMediaUrl(mediaPath: string): Promise<string>            // TTL 3600

// ranking.repository.ts
getRanking(weddingId: string): Promise<RankingRow[]>
// orden: total_points desc, approved_count desc, first_approved_at asc nulls last, display_order asc
```

Regla `reviewSubmission`: `approved` → `awarded_points = custom ?? mission.points`, `reviewed_at = now()`. `rejected` o `pending` → `awarded_points = 0`, `reviewed_at = now()` (null si vuelve a pending... no: mantener `now()` como último toque; simple). Siempre `updated_at = now()`.

## 10. Flujos

### Invitado
1. QR → `/mesa/MESA-4` → normalizar código → `getTableByCode`. Null → pantalla amable.
2. Ve `MissionCard` (título, descripción, puntos, badges) + `SubmissionStatusList` + `SubmissionForm`.
3. Rellena nombre (2-80), comentario (≤500 opcional), foto (`accept="image/jpeg,image/png,image/webp"`; iOS entrega JPEG desde cámara aunque el original sea HEIC).
4. Cliente: Zod → comprimir (`{ maxSizeMB: 1, maxWidthOrHeight: 1600, useWebWorker: true }`) → botón deshabilitado + "Enviando…" → `FormData` a `createSubmission`.
5. Server Action: Zod de nuevo + size/type del File → mesa y misión existen → `crypto.randomUUID()` → upload a Storage (`upsert: false`) → insert `pending`. Insert falla → `storage.remove(path)` en try/catch best-effort (huérfano ocasional es aceptable, no bloquear al invitado por la limpieza).
6. Confirmación inline: "✅ Prueba enviada. Pendiente de revisión. Si se aprueba, vuestra mesa sumará puntos." + botón "Enviar otra".
7. Error → mensaje claro + "Reintentar" conservando lo escrito.

### Admin
1. `/admin` sin cookie válida → `AdminLogin` → action `adminLogin` (hash-compare tiempo constante, sleep 500 ms si falla) → cookie 24 h.
2. Dashboard: 4 números (`getAdminStats`) + enlaces + listas read-only de mesas y misiones.
3. `/admin/submissions?status=pending`: cards con `<img>` (signed URL — **no** `next/image`: URLs firmadas cambian y queman cuota de optimización), mesa, misión, participante, comentario, fecha.
4. Aprobar (input puntos opcional, placeholder = puntos de misión) / Rechazar / Volver a pendiente → action con `assertAdmin()` → `reviewSubmission` → `revalidatePath('/ranking')`, `('/ranking/live')`, `('/mesa/[code]', 'page')`. Sin UI optimista: revalidación y listo.

### Ranking
`getRanking()` lee `ranking_view` + ordena. `/ranking/live`: componente cliente `LiveRefresh` con `setInterval(() => router.refresh(), 15000)`. Aprobar → visible en ≤15 s.

### QR
`generate-qr-url.ts`: `${NEXT_PUBLIC_SITE_URL}/mesa/${code}`. `QRCard`: `qrcode.toDataURL(url, { width: 512 })` en cliente, nombre, código, URL, botón copiar. `QRGrid` + CSS print: una tarjeta por página o 4/A4, sin nav.

## 11. Plan por fases — prompts para Codex

Orden estricto: **0 → 1 → 2 → 3 → 4 → 5 → 6 → 7**. No avanzar sin cumplir la aceptación. A cada sesión de Codex: pegarle la sección 0 (reglas), la fase correspondiente y las secciones referenciadas.

### Fase 0 — Setup (½ día)
Crear: proyecto `create-next-app` (TS, Tailwind, App Router, src/), estructura de carpetas §7 vacía, `lib/config.ts`, `.env.local.example`, `globals.css` con `@theme` (fondo marfil `#faf7f2`, acento champagne/dorado, `next/font`: una serif elegante para títulos + Inter), `layout.tsx`, landing placeholder.
**Aceptación:** `npm run dev` levanta; landing con estética base en móvil; `npm run build` limpio.
**No hacer:** ninguna página más, ningún componente de datos.

### Fase 1 — Supabase (½ día, mayormente manual)
Ejecutar en Supabase Studio: `schema.sql` (§5 completo, incl. RLS y revoke), `seed.sql` (1 boda, 12 misiones §13, mesas reales). Crear bucket `submissions` privado con límites. Copiar keys a `.env.local`.
**Aceptación:** en Studio, `select * from ranking_view` devuelve mesas con 0 puntos; petición REST con anon key a `/rest/v1/tables` devuelve vacío/error (RLS ok).

### Fase 2 — Tipos + repos (½ día)
Crear: `lib/types/*`, `lib/supabase/admin.ts` (`server-only`, singleton, `auth: { persistSession: false }`), 5 repositories §9, `validations/submission.schema.ts`.
**Aceptación:** compila estricto; página temporal `/debug` (se borra en Fase 7) que renderiza `getActiveWedding` + `getTableByCode('MESA-1')` + `getRanking` reales.

### Fase 3 — Público sin imagen (1 día)
Crear: `ui/*` (5 componentes), landing real, `/mesa/[code]` completa, `MissionCard`, `SubmissionStatusList`, `SubmissionForm` **sin campo de foto aún**, `createSubmission` sin media (temporal: `media_path = ''`), confirmación inline, mesa no encontrada, `/ranking` básico.
**Aceptación:** desde móvil real: abrir `/mesa/MESA-1`, enviar prueba de texto, fila `pending` en BD, aparece en `SubmissionStatusList`.

### Fase 4 — Imagen (½–1 día)
Crear: `utils/compress-image.ts`, campo file con preview en `SubmissionForm`, upload en `createSubmission` (flujo §10.5), `bodySizeLimit` en next.config.
**Aceptación:** foto 4 MB desde cámara del móvil → objeto ≤1 MB en Storage con path `weddings/{slug}/tables/MESA-1/{uuid}.jpg`, fila con `media_path`. Modo avión a mitad → error claro + reintento funciona.

### Fase 5 — Admin (1 día)
Crear: `utils/admin-session.ts`, `assert-admin.ts` (redirect si no), `admin.actions.ts`, `AdminLogin`, `admin/layout.tsx` guard, dashboard con stats y listas read-only, `/admin/submissions` con `SubmissionReviewCard` y filtro estado, revalidaciones.
**Aceptación:** ciclo completo desde móvil: login → ver pendiente con foto → aprobar con puntos custom → BD refleja `approved` + puntos + `reviewed_at` → rechazar otra → volver a pendiente una tercera. PIN erróneo → error genérico tras ~500 ms.

### Fase 6 — Ranking live + QR (½ día)
Crear: `/ranking/live` + `LiveRefresh`, pulir `/ranking` (top 3), `generate-qr-url.ts`, `QRCard`, `QRGrid`, `/admin/qr` con vista print.
**Aceptación:** aprobar prueba → live la refleja ≤15 s sin tocar nada. Imprimir a PDF y escanear QR de papel → abre mesa correcta.

### Fase 7 — Pulido + hardening (1 día)
- `loading.tsx` / `error.tsx` / `not-found.tsx` en rutas públicas; estados vacíos inline.
- Audit responsive 360 px; botones ≥44 px; textos revisados.
- Borrar `/debug`. Grep de seguridad: `SERVICE_ROLE` solo en `admin.ts`; toda action admin llama `assertAdmin`; `server-only` presente.
- Metadata/OG básico. Ejecutar checklists §14-15.
**Aceptación:** checklist de despliegue completo en verde.

**Total: 5-6 días efectivos.**

## 12. Riesgos y mitigación

| Riesgo | Mitigación |
|---|---|
| **Supabase Free pausa proyecto tras ~7 días inactivo** | Despertar y verificar T-2 días; semana previa visita diaria o cron gratuito (cron-job.org → `/ranking`) |
| Codex rompe caché/arquitectura Next | Sección 0 con reglas explícitas por ruta; pegársela en cada sesión |
| Mala conexión en el venue | App ligera, fotos ≤1 MB, ISR sirve caché, reintento conservando formulario |
| HEIC / formatos raros iOS | `accept` explícito, compresión re-codifica a JPEG, error server legible |
| Doble envío por doble-tap | Botón disabled durante submit + uuid por request |
| PIN visto por alguien | 6+ dígitos, cookie 24 h, blast radius mínimo (peor caso: aprobar fotos) |
| Admin saturado | Cola default pending, 1 tap para aprobar con puntos default, usable en móvil |
| Mesa sin misión en seed | Página tolera misión null ("misión en preparación") + ítem de checklist |
| Deploy roto el día D | **Congelar deploys T-2 días** + smoke test post-deploy |
| Límites free | Storage: >900 fotos de margen. Egress 5 GB: sobra (solo admin ve fotos). Vercel Hobby: tráfico de 100 invitados es trivial |

## 13. Seed de misiones (12)

Las del documento de requisitos, tal cual: Foto con los novios (photo/medium/50), Brindis creativo (emotional/medium/50), Alianza entre mesas (social/easy/25), Coreografía exprés (dance/hard/75), Portada de película (funny/medium/50), Consejo matrimonial (emotional/medium/50), Guardaespaldas de los novios (funny/medium/50), Mesa legendaria (funny/easy/25), Generaciones en pista (dance/hard/75), Anécdota secreta (social/medium/50), Foto real (photo/easy/25), Momento épico (funny/epic/100).

## 14. Checklist despliegue Vercel

- [ ] Repo GitHub conectado; `main` = producción.
- [ ] 7 env vars en Vercel Production; `SUPABASE_SERVICE_ROLE_KEY` y `SESSION_SECRET` sin prefijo `NEXT_PUBLIC_`.
- [ ] `NEXT_PUBLIC_SITE_URL` = URL de producción (afecta QRs).
- [ ] `ADMIN_PIN` de producción ≠ desarrollo; `SESSION_SECRET` regenerado.
- [ ] Schema + RLS + seed ejecutados en Supabase de producción; bucket privado con límites.
- [ ] `next build` local limpio antes de push.
- [ ] Smoke test producción: landing → mesa → envío con foto → admin → aprobar → ranking → live.
- [ ] QRs generados desde producción, impresos, escaneados en papel.

## 15. Checklist pruebas pre-boda

**T-7:** flujo completo iPhone Safari + Android Chrome · foto >4 MB cámara · foto galería y cámara · mesa inexistente → error amable · doble tap → 1 submission · admin móvil (aprobar/rechazar/pendiente/custom) · empate → desempate correcto · `/ranking/live` en el equipo y proyector reales · modo avión a mitad de envío → reintento ok.

**T-2:** Supabase activo (despertar) · datos finales (mesas y misiones revisadas por los novios) · borrar submissions de prueba (BD + Storage) · re-escanear 2-3 QRs impresos · **congelar deploys** · PIN memorizado, moderador(es) asignado(s) para el banquete.

**Día D:** smoke test matinal (QR real → enviar → aprobar → ranking) · live abierto en pantalla del venue.

## 16. Fuera de V1

Del documento: vídeo, chat, likes, comentarios públicos, registro/login invitados, push, emails, IA misiones, app nativa, moderación automática, pagos, multi-boda UI, roles, editor visual.

De este plan: galería pública de fotos aprobadas (**candidata V1.1 post-boda** — el modelo ya lo soporta), realtime websockets, CRUD mesas/misiones, ruta `/gracias`, Supabase Auth, Prisma, RHF, next/image para pruebas, dominio propio, analytics, PWA/offline, rate-limiting real, magic-bytes, UI optimista, animaciones de ranking, componentes genéricos de estado.
