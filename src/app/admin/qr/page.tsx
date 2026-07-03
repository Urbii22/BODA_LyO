import { UniqueQRCard } from "../../../components/qr/UniqueQRCard";
import { SetupNotice } from "../../../components/SetupNotice";
import { hasSupabaseConfig } from "../../../lib/config";

export const dynamic = "force-dynamic";

export default async function AdminQrPage() {
  if (!hasSupabaseConfig()) return <SetupNotice />;

  return (
    <main className="page-shell paper-grain mx-auto max-w-3xl px-4 py-8 print:max-w-none print:px-0">
      <div className="no-print mb-6">
        <p className="hand-label text-lavanda">Entrada comun</p>
        <h1 className="mt-1 font-serif text-6xl font-bold leading-none">QR unico</h1>
        <p className="mt-2 text-graphite">Imprime esta pantalla o guarda como PDF.</p>
      </div>
      <UniqueQRCard />
    </main>
  );
}
