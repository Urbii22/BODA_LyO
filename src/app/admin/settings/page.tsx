import { WeddingSettingsForm } from "../../../components/admin/WeddingSettingsForm";
import { SetupNotice } from "../../../components/SetupNotice";
import { Card } from "../../../components/ui/Card";
import { appConfig, hasSupabaseConfig } from "../../../lib/config";
import { getActiveWedding } from "../../../lib/repositories/weddings.repository";

export const dynamic = "force-dynamic";

export default async function AdminSettingsPage() {
  if (!hasSupabaseConfig()) return <SetupNotice />;

  const wedding = await getActiveWedding();

  return (
    <main className="page-shell paper-grain mx-auto max-w-5xl px-4 py-8">
      <p className="hand-label text-lavanda">Configuracion</p>
      <h1 className="mt-1 font-serif text-6xl font-bold leading-none">Ajustes</h1>
      <p className="mt-3 max-w-[64ch] text-graphite">
        Cambios pensados para hacer desde el movil sin desplegar codigo. Los QR siguen dependiendo del dominio configurado en Vercel.
      </p>

      <div className="mt-6 grid gap-4 lg:grid-cols-[1fr_0.9fr]">
        <WeddingSettingsForm wedding={wedding} />
        <Card>
          <p className="hand-label text-lavanda">Dominio QR</p>
          <h2 className="font-serif text-4xl font-bold leading-none">Enlaces</h2>
          <dl className="mt-4 space-y-3 text-sm">
            <div>
              <dt className="font-bold uppercase tracking-[0.1em] text-graphite">URL publica</dt>
              <dd className="mt-1 break-all font-semibold text-vino">{appConfig.siteUrl}</dd>
            </div>
            <div>
              <dt className="font-bold uppercase tracking-[0.1em] text-graphite">Slug activo</dt>
              <dd className="mt-1 font-semibold">{wedding.slug}</dd>
            </div>
          </dl>
          <p className="mt-4 text-sm text-graphite">
            Si cambia el dominio final, hay que actualizar `NEXT_PUBLIC_SITE_URL` en Vercel antes de imprimir QR definitivos.
          </p>
        </Card>
      </div>
    </main>
  );
}
