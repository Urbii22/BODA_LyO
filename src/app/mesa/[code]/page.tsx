import { notFound } from "next/navigation";
import Link from "next/link";
import { SetupNotice } from "../../../components/SetupNotice";
import { MissionCard } from "../../../components/mesa/MissionCard";
import { SubmissionForm } from "../../../components/mesa/SubmissionForm";
import { SubmissionStatusList } from "../../../components/mesa/SubmissionStatusList";
import { LavenderDivider } from "../../../components/wedding/InvitationArt";
import { hasSupabaseConfig } from "../../../lib/config";
import { listSubmissionsByTable } from "../../../lib/repositories/submissions.repository";
import { getTableByCode } from "../../../lib/repositories/tables.repository";
import { getActiveWedding } from "../../../lib/repositories/weddings.repository";
import { displayGroupCode, displayGroupName } from "../../../lib/utils/group-labels";
import { normalizeTableCode } from "../../../lib/utils/normalize-table-code";

export const revalidate = 10;

export default async function MesaPage({ params }: { params: Promise<{ code: string }> }) {
  if (!hasSupabaseConfig()) return <SetupNotice />;

  const { code } = await params;
  const wedding = await getActiveWedding();
  const table = await getTableByCode(wedding.id, normalizeTableCode(code));

  if (!table) notFound();

  const submissions = await listSubmissionsByTable(table.id);
  const groupName = displayGroupName(table.name);
  const groupCode = displayGroupCode(table.code);

  return (
    <main className="page-shell paper-grain min-h-screen px-4 py-5">
      <div className="mx-auto max-w-3xl space-y-5">
        <section className="overflow-hidden rounded-[0.35rem] border border-tinta bg-tinta p-5 text-marfil shadow-[0_18px_50px_rgba(45,42,40,0.18)]">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="hand-label text-lavanda-suave">{groupCode}</p>
              <h1 className="mt-1 font-serif text-5xl font-bold leading-none">{groupName}</h1>
            </div>
            <div className="flex shrink-0 flex-col items-end gap-2">
              <span className="rounded-[0.25rem] border border-marfil/30 px-3 py-1 text-xs font-bold uppercase tracking-[0.16em] text-champagne">
                Sobre abierto
              </span>
              <Link href="/grupo?cambiar=1" className="text-xs font-bold uppercase tracking-[0.12em] text-marfil/72 hover:text-champagne">
                Cambiar grupo
              </Link>
            </div>
          </div>
          <div className="mt-5 text-marfil/82">
            <LavenderDivider label="misión secreta" />
          </div>
        </section>
        <MissionCard mission={table.mission} />
        <SubmissionForm tableCode={table.code} />
        <SubmissionStatusList submissions={submissions} />
      </div>
    </main>
  );
}
