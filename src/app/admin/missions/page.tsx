import { MissionEditRow } from "../../../components/admin/MissionEditRow";
import { NewMissionCard } from "../../../components/admin/NewMissionCard";
import { TableMissionSelect } from "../../../components/admin/TableMissionSelect";
import { SetupNotice } from "../../../components/SetupNotice";
import { Card } from "../../../components/ui/Card";
import { hasSupabaseConfig } from "../../../lib/config";
import { getMissionUsage, listMissions } from "../../../lib/repositories/missions.repository";
import { listTables } from "../../../lib/repositories/tables.repository";
import { getActiveWedding } from "../../../lib/repositories/weddings.repository";

export const dynamic = "force-dynamic";

export default async function AdminMissionsPage() {
  if (!hasSupabaseConfig()) return <SetupNotice />;

  const wedding = await getActiveWedding();
  const [missions, tables, usage] = await Promise.all([
    listMissions(wedding.id),
    listTables(wedding.id),
    getMissionUsage(wedding.id),
  ]);

  const missionById = new Map(missions.map((mission) => [mission.id, mission]));

  return (
    <main className="page-shell paper-grain mx-auto max-w-6xl px-4 py-8">
      <p className="hand-label text-lavanda">Control de retos</p>
      <h1 className="mt-1 font-serif text-6xl font-bold leading-none">Misiones</h1>
      <p className="mt-3 max-w-[60ch] text-graphite">
        Crea, edita, oculta o borra retos sin tocar codigo. Abajo eliges que mision ve cada mesa; el cambio se guarda al instante.
      </p>

      <div className="mt-6">
        <NewMissionCard />
      </div>

      <section className="mt-8">
        <h2 className="font-serif text-4xl font-bold leading-none">Mision por mesa</h2>
        <p className="mt-1 text-sm text-graphite">Cambia el reto de una mesa en directo. Se aplica en su QR en segundos.</p>
        <Card className="mt-4">
          <ul className="grid gap-3 sm:grid-cols-2">
            {tables.map((table) => (
              <li key={table.id} className="grid gap-1">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-sm font-bold">{table.name}</span>
                  <span className="text-xs font-semibold text-vino">{table.code}</span>
                </div>
                <TableMissionSelect tableId={table.id} currentMissionId={table.missionId} missions={missions} />
                {table.missionId && !missionById.has(table.missionId) ? (
                  <span className="text-xs text-vino">La mision asignada ya no existe.</span>
                ) : null}
              </li>
            ))}
          </ul>
        </Card>
      </section>

      <section className="mt-8">
        <div className="flex items-baseline justify-between gap-3">
          <h2 className="font-serif text-4xl font-bold leading-none">Todas las misiones</h2>
          <span className="text-sm font-semibold text-graphite">{missions.length} retos</span>
        </div>
        <div className="mt-4 space-y-3">
          {missions.map((mission) => (
            <MissionEditRow
              key={mission.id}
              mission={mission}
              usage={usage[mission.id] ?? { tables: 0, submissions: 0 }}
            />
          ))}
        </div>
      </section>
    </main>
  );
}
