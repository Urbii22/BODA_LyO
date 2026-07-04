import Link from "next/link";
import { SetupNotice } from "../../components/SetupNotice";
import { Badge } from "../../components/ui/Badge";
import { Card } from "../../components/ui/Card";
import { hasSupabaseConfig } from "../../lib/config";
import { listMissions } from "../../lib/repositories/missions.repository";
import { getAdminStats, getLatestSubmissionForAdmin } from "../../lib/repositories/submissions.repository";
import { getTableUsage, listTables } from "../../lib/repositories/tables.repository";
import { getActiveWedding } from "../../lib/repositories/weddings.repository";
import { formatDate } from "../../lib/utils/format-date";
import { displayGroupCode, displayGroupName } from "../../lib/utils/group-labels";

export const dynamic = "force-dynamic";

const actionClass =
  "flex min-h-16 items-center justify-between gap-3 rounded-[0.3rem] border border-tinta/15 bg-white/54 px-4 py-3 text-sm font-bold transition hover:-translate-y-0.5 hover:bg-white/80";

export default async function AdminPage() {
  if (!hasSupabaseConfig()) return <SetupNotice />;

  const wedding = await getActiveWedding();
  const [stats, tables, missions, tableUsage, latestSubmission] = await Promise.all([
    getAdminStats(wedding.id),
    listTables(wedding.id),
    listMissions(wedding.id),
    getTableUsage(wedding.id),
    getLatestSubmissionForAdmin(wedding.id),
  ]);
  const missionById = new Map(missions.map((mission) => [mission.id, mission]));
  const tablesWithoutMission = tables.filter((table) => !table.missionId);
  const tablesWithoutSubmissions = tables.filter((table) => !tableUsage[table.id]?.submissions);
  const hiddenAssignedMissions = tables.filter((table) => {
    if (!table.missionId) return false;
    return missionById.get(table.missionId)?.isActive === false;
  });
  const activeMissionIds = new Set(tables.map((table) => table.missionId).filter(Boolean));
  const activeMissionsWithoutTable = missions.filter((mission) => mission.isActive && !activeMissionIds.has(mission.id));
  const healthItems = [
    {
      label: "Grupos sin mision",
      value: tablesWithoutMission.length,
      href: "/admin/tables",
      ok: tablesWithoutMission.length === 0,
    },
    {
      label: "Misiones ocultas asignadas",
      value: hiddenAssignedMissions.length,
      href: "/admin/missions",
      ok: hiddenAssignedMissions.length === 0,
    },
    {
      label: "Grupos sin envio",
      value: tablesWithoutSubmissions.length,
      href: "/admin/tables",
      ok: tablesWithoutSubmissions.length === 0,
    },
    {
      label: "Misiones activas sin grupo",
      value: activeMissionsWithoutTable.length,
      href: "/admin/missions",
      ok: activeMissionsWithoutTable.length === 0,
    },
  ];
  const totalSubmissions = Object.values(tableUsage).reduce((sum, item) => sum + item.submissions, 0);
  const visibleTables = tables.slice(0, 8);
  const visibleMissions = missions.slice(0, 8);

  return (
    <main className="page-shell paper-grain mx-auto max-w-6xl px-3 py-5 sm:px-4 sm:py-8">
      <p className="hand-label text-lavanda">Zona del jurado</p>
      <h1 className="mt-1 font-serif text-[clamp(3.6rem,17vw,6rem)] font-bold leading-[0.88]">Panel del jurado</h1>
      <section className="mt-5 grid gap-4 lg:grid-cols-[1.15fr_0.85fr]">
        <section className="rounded-[0.35rem] border border-tinta bg-tinta p-5 text-marfil shadow-[0_18px_50px_rgba(45,42,40,0.18)]">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="hand-label text-lavanda-suave">Modo dia de boda</p>
              <h2 className="mt-1 font-serif text-[clamp(3rem,13vw,5rem)] font-bold leading-none">Control rapido</h2>
            </div>
            <Badge tone={stats.pending > 0 ? "gold" : "green"}>
              {stats.pending > 0 ? "hay cola" : "al dia"}
            </Badge>
          </div>
          <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
            <div className="rounded-[0.3rem] border border-marfil/20 bg-marfil/8 p-3">
              <p className="text-xs font-bold uppercase tracking-[0.12em] text-champagne">Pendientes</p>
              <p className="mt-2 font-hand text-4xl font-bold leading-none tabular-nums sm:text-5xl">{stats.pending}</p>
            </div>
            <div className="rounded-[0.3rem] border border-marfil/20 bg-marfil/8 p-3">
              <p className="text-xs font-bold uppercase tracking-[0.12em] text-champagne">Grupos</p>
              <p className="mt-2 font-hand text-4xl font-bold leading-none tabular-nums sm:text-5xl">{tables.length}</p>
            </div>
            <div className="rounded-[0.3rem] border border-marfil/20 bg-marfil/8 p-3">
              <p className="text-xs font-bold uppercase tracking-[0.12em] text-champagne">Envios</p>
              <p className="mt-2 font-hand text-4xl font-bold leading-none tabular-nums sm:text-5xl">{totalSubmissions}</p>
            </div>
            <div className="rounded-[0.3rem] border border-marfil/20 bg-marfil/8 p-3">
              <p className="text-xs font-bold uppercase tracking-[0.12em] text-champagne">Avisos</p>
              <p className="mt-2 font-hand text-4xl font-bold leading-none tabular-nums sm:text-5xl">
                {healthItems.filter((item) => !item.ok).length}
              </p>
            </div>
          </div>
          <div className="mt-5 border-t border-marfil/16 pt-4 text-sm text-marfil/82">
            {latestSubmission ? (
              <p>
                Ultimo envio: <span className="font-bold text-marfil">{displayGroupName(latestSubmission.tableName)}</span>,{" "}
                {latestSubmission.missionTitle} · {formatDate(latestSubmission.createdAt)}
              </p>
            ) : (
              <p>Aun no hay envios. Cuando llegue el primero aparecera aqui.</p>
            )}
          </div>
        </section>

        <Card>
          <p className="hand-label text-lavanda">Acciones rapidas</p>
          <h2 className="font-serif text-4xl font-bold leading-none">Ahora</h2>
          <div className="mt-4 grid gap-2">
            <Link href="/admin/submissions?status=pending" className={actionClass}>
              Revisar pendientes <span className="text-vino">{stats.pending}</span>
            </Link>
            <Link href="/admin/tables" className={actionClass}>
              Anadir o editar grupos <span className="text-vino">{tables.length}</span>
            </Link>
            <Link href="/admin/missions" className={actionClass}>
              Lanzar misiones <span className="text-vino">{missions.length}</span>
            </Link>
            <Link href="/admin/qr" className={actionClass}>
              Ver QR <span className="text-vino">imprimir</span>
            </Link>
            <Link href="/ranking/live" className={actionClass}>
              Ranking pantalla <span className="text-vino">directo</span>
            </Link>
          </div>
        </Card>
      </section>

      <section className="mt-6">
        <Card>
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="hand-label text-lavanda">Salud del evento</p>
              <h2 className="font-serif text-[clamp(2.5rem,10vw,4rem)] font-bold leading-none">Cosas a mirar</h2>
            </div>
            <Badge tone={healthItems.every((item) => item.ok) ? "green" : "gold"}>
              {healthItems.every((item) => item.ok) ? "listo" : "revisar"}
            </Badge>
          </div>
          <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {healthItems.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className="rounded-[0.3rem] border border-tinta/12 bg-white/45 p-4 transition hover:-translate-y-0.5 hover:bg-white/75"
              >
                <p className="text-xs font-bold uppercase tracking-[0.1em] text-graphite">{item.label}</p>
                <div className="mt-3 flex items-end justify-between gap-3">
                  <p className="font-hand text-5xl font-bold leading-none tabular-nums">{item.value}</p>
                  <Badge tone={item.ok ? "green" : "red"}>{item.ok ? "ok" : "ojo"}</Badge>
                </div>
              </Link>
            ))}
          </div>
        </Card>
      </section>

      <div className="mt-6 grid gap-4 lg:grid-cols-2">
        <Card>
          <div className="flex items-center justify-between gap-3">
            <div>
              <h2 className="font-serif text-4xl font-bold leading-none">Grupos</h2>
              <p className="mt-1 text-sm text-graphite">{tables.length} grupos configurados</p>
            </div>
            <div className="flex gap-3 text-sm font-bold text-vino">
              <Link href="/admin/tables">Gestionar</Link>
              <Link href="/admin/qr">Ver QR</Link>
            </div>
          </div>
          <ul className="mt-4 divide-y divide-tinta/10">
            {visibleTables.map((table) => (
              <li key={table.id} className="flex justify-between gap-3 py-2 text-sm font-semibold">
                <span>{displayGroupName(table.name)}</span>
                <span className="font-semibold text-vino">{displayGroupCode(table.code)}</span>
              </li>
            ))}
          </ul>
          {tables.length > visibleTables.length ? (
            <Link href="/admin/tables" className="mt-3 inline-flex text-sm font-bold text-vino">
              Ver {tables.length - visibleTables.length} grupos mas
            </Link>
          ) : null}
        </Card>
        <Card>
          <div className="flex items-center justify-between gap-3">
            <div>
              <h2 className="font-serif text-4xl font-bold leading-none">Misiones</h2>
              <p className="mt-1 text-sm text-graphite">{missions.length} retos disponibles</p>
            </div>
            <Link href="/admin/missions" className="text-sm font-bold text-vino">Gestionar</Link>
          </div>
          <ul className="mt-4 divide-y divide-tinta/10">
            {visibleMissions.map((mission) => (
              <li key={mission.id} className="py-2 text-sm">
                <span className="font-semibold">{mission.title}</span>
                <span className="ml-2 text-vino">{mission.points} pts</span>
              </li>
            ))}
          </ul>
          {missions.length > visibleMissions.length ? (
            <Link href="/admin/missions" className="mt-3 inline-flex text-sm font-bold text-vino">
              Ver {missions.length - visibleMissions.length} misiones mas
            </Link>
          ) : null}
        </Card>
      </div>
    </main>
  );
}
