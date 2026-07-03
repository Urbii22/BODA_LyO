import { notFound } from "next/navigation";
import { SetupNotice } from "../../../components/SetupNotice";
import { MesaMissionFlow } from "../../../components/mesa/MesaMissionFlow";
import { SubmissionStatusList } from "../../../components/mesa/SubmissionStatusList";
import { LavenderDivider } from "../../../components/wedding/InvitationArt";
import { hasSupabaseConfig } from "../../../lib/config";
import { listSubmissionsByTable } from "../../../lib/repositories/submissions.repository";
import { getTableByCode } from "../../../lib/repositories/tables.repository";
import { getActiveWedding } from "../../../lib/repositories/weddings.repository";
import { normalizeTableCode } from "../../../lib/utils/normalize-table-code";

type MesaPageProps = {
  params: Promise<{ code: string }>;
};

export default async function MesaPage({ params }: MesaPageProps) {
  if (!hasSupabaseConfig()) return <SetupNotice />;

  const { code } = await params;
  const wedding = await getActiveWedding();
  const table = await getTableByCode(wedding.id, normalizeTableCode(code));

  if (!table) notFound();

  const submissions = await listSubmissionsByTable(table.id);

  return (
    <main className="page-shell paper-grain min-h-screen px-4 py-5">
      <div className="mx-auto max-w-3xl space-y-5">
        <section className="overflow-hidden rounded-[0.35rem] border border-tinta bg-tinta p-5 text-marfil shadow-[0_18px_50px_rgba(45,42,40,0.18)]">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="hand-label text-lavanda-suave">{table.code}</p>
              <h1 className="mt-1 font-serif text-5xl font-bold leading-none">{table.name}</h1>
            </div>
            <span className="rounded-[0.25rem] border border-marfil/30 px-3 py-1 text-xs font-bold uppercase tracking-[0.16em] text-champagne">
              Sobre abierto
            </span>
          </div>
          <div className="mt-5 text-marfil/82">
            <LavenderDivider label="mision secreta" />
          </div>
        </section>
        <MesaMissionFlow mission={table.mission} tableCode={table.code} />
        <SubmissionStatusList submissions={submissions} />
      </div>
    </main>
  );
}
