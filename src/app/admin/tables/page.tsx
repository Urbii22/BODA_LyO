import { NewTableCard } from "../../../components/admin/NewTableCard";
import { TableEditRow } from "../../../components/admin/TableEditRow";
import { SetupNotice } from "../../../components/SetupNotice";
import { Card } from "../../../components/ui/Card";
import { hasSupabaseConfig } from "../../../lib/config";
import { listMissions } from "../../../lib/repositories/missions.repository";
import { getTableUsage, listTables } from "../../../lib/repositories/tables.repository";
import { getActiveWedding } from "../../../lib/repositories/weddings.repository";

export const dynamic = "force-dynamic";

export default async function AdminTablesPage() {
  if (!hasSupabaseConfig()) return <SetupNotice />;

  const wedding = await getActiveWedding();
  const [tables, missions, usage] = await Promise.all([
    listTables(wedding.id),
    listMissions(wedding.id),
    getTableUsage(wedding.id),
  ]);
  const missionById = new Map(missions.map((mission) => [mission.id, mission]));
  const nextOrder = tables.reduce((max, table) => Math.max(max, table.displayOrder), 0) + 1;

  return (
    <main className="page-shell paper-grain mx-auto max-w-6xl px-4 py-8">
      <p className="hand-label text-lavanda">Mapa de invitados</p>
      <h1 className="mt-1 font-serif text-6xl font-bold leading-none">Grupos</h1>
      <p className="mt-3 max-w-[64ch] text-graphite">
        Anade, reordena o edita grupos desde aqui. El codigo es el enlace del QR, asi que conviene cambiarlo solo antes de imprimir o compartir.
      </p>

      <div className="mt-6 grid gap-4 lg:grid-cols-[0.8fr_1.2fr]">
        <NewTableCard missions={missions} nextOrder={nextOrder} />
        <Card>
          <p className="hand-label text-lavanda">Resumen</p>
          <h2 className="font-serif text-4xl font-bold leading-none">{tables.length} grupos activos</h2>
          <div className="mt-4 grid gap-3 sm:grid-cols-3">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.1em] text-graphite">Envios</p>
              <p className="font-hand text-5xl font-bold leading-none">
                {Object.values(usage).reduce((sum, item) => sum + item.submissions, 0)}
              </p>
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.1em] text-graphite">Aprobadas</p>
              <p className="font-hand text-5xl font-bold leading-none">
                {Object.values(usage).reduce((sum, item) => sum + item.approved, 0)}
              </p>
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.1em] text-graphite">Puntos</p>
              <p className="font-hand text-5xl font-bold leading-none">
                {Object.values(usage).reduce((sum, item) => sum + item.points, 0)}
              </p>
            </div>
          </div>
        </Card>
      </div>

      <section className="mt-8">
        <div className="flex items-baseline justify-between gap-3">
          <h2 className="font-serif text-4xl font-bold leading-none">Todos los grupos</h2>
          <span className="text-sm font-semibold text-graphite">Orden del ranking y QR</span>
        </div>
        <div className="mt-4 space-y-3">
          {tables.map((table) => (
            <TableEditRow
              key={table.id}
              table={table}
              mission={table.missionId ? missionById.get(table.missionId) ?? null : null}
              missions={missions}
              usage={usage[table.id] ?? { submissions: 0, approved: 0, points: 0 }}
            />
          ))}
        </div>
      </section>
    </main>
  );
}
