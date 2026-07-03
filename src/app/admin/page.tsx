import Link from "next/link";
import { SetupNotice } from "../../components/SetupNotice";
import { Card } from "../../components/ui/Card";
import { hasSupabaseConfig } from "../../lib/config";
import { listMissions } from "../../lib/repositories/missions.repository";
import { getAdminStats } from "../../lib/repositories/submissions.repository";
import { listTables } from "../../lib/repositories/tables.repository";
import { getActiveWedding } from "../../lib/repositories/weddings.repository";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  if (!hasSupabaseConfig()) return <SetupNotice />;

  const wedding = await getActiveWedding();
  const [stats, tables, missions] = await Promise.all([
    getAdminStats(wedding.id),
    listTables(wedding.id),
    listMissions(wedding.id),
  ]);

  return (
    <main className="page-shell paper-grain mx-auto max-w-6xl px-4 py-8">
      <p className="hand-label text-lavanda">Zona del jurado</p>
      <h1 className="mt-1 font-serif text-6xl font-bold leading-none">Panel del jurado</h1>
      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          ["Pendientes", stats.pending],
          ["Aprobadas", stats.approved],
          ["Rechazadas", stats.rejected],
          ["Mesas con puntos", stats.tablesWithApproved],
        ].map(([label, value]) => (
          <Card key={label}>
            <p className="text-sm font-bold uppercase tracking-[0.12em] text-vino">{label}</p>
            <p className="mt-2 font-hand text-6xl font-bold leading-none tabular-nums">{value}</p>
          </Card>
        ))}
      </div>
      <div className="mt-8 grid gap-4 lg:grid-cols-2">
        <Card>
          <div className="flex items-center justify-between gap-3">
            <h2 className="font-serif text-4xl font-bold leading-none">Mesas</h2>
            <Link href="/admin/qr" className="text-sm font-bold text-vino">Ver QR</Link>
          </div>
          <ul className="mt-4 divide-y divide-tinta/10">
            {tables.map((table) => (
              <li key={table.id} className="flex justify-between gap-3 py-2 text-sm font-semibold">
                <span>{table.name}</span>
                <span className="font-semibold text-vino">{table.code}</span>
              </li>
            ))}
          </ul>
        </Card>
        <Card>
          <div className="flex items-center justify-between gap-3">
            <h2 className="font-serif text-4xl font-bold leading-none">Misiones</h2>
            <Link href="/admin/missions" className="text-sm font-bold text-vino">Gestionar</Link>
          </div>
          <ul className="mt-4 divide-y divide-tinta/10">
            {missions.map((mission) => (
              <li key={mission.id} className="py-2 text-sm">
                <span className="font-semibold">{mission.title}</span>
                <span className="ml-2 text-vino">{mission.points} pts</span>
              </li>
            ))}
          </ul>
        </Card>
      </div>
    </main>
  );
}
