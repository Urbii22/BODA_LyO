import { QRGrid } from "../../../components/qr/QRGrid";
import { SetupNotice } from "../../../components/SetupNotice";
import { hasSupabaseConfig } from "../../../lib/config";
import { listTables } from "../../../lib/repositories/tables.repository";
import { getActiveWedding } from "../../../lib/repositories/weddings.repository";

export const dynamic = "force-dynamic";

export default async function AdminQrPage() {
  if (!hasSupabaseConfig()) return <SetupNotice />;

  const wedding = await getActiveWedding();
  const tables = await listTables(wedding.id);

  return (
    <main className="page-shell paper-grain mx-auto max-w-5xl px-4 py-8 print:max-w-none print:px-0">
      <div className="no-print mb-6">
        <p className="hand-label text-lavanda">Sobres para repartir</p>
        <h1 className="mt-1 font-serif text-6xl font-bold leading-none">QR de grupos</h1>
        <p className="mt-2 text-graphite">Imprime esta pantalla o guarda como PDF.</p>
      </div>
      <QRGrid tables={tables} />
    </main>
  );
}
