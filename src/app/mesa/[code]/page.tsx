import { notFound } from "next/navigation";
import Link from "next/link";
import { SetupNotice } from "../../../components/SetupNotice";
import { MissionCard } from "../../../components/mesa/MissionCard";
import { SubmissionForm } from "../../../components/mesa/SubmissionForm";
import { SubmissionStatusList } from "../../../components/mesa/SubmissionStatusList";
import { appConfig, hasSupabaseConfig } from "../../../lib/config";
import { listSubmissionsByTable } from "../../../lib/repositories/submissions.repository";
import { getTableByCode } from "../../../lib/repositories/tables.repository";
import { getActiveWedding } from "../../../lib/repositories/weddings.repository";
import { normalizeTableCode } from "../../../lib/utils/normalize-table-code";

export const revalidate = 10;

export default async function MesaPage({ params }: { params: Promise<{ code: string }> }) {
  if (!hasSupabaseConfig()) return <SetupNotice />;

  const { code } = await params;
  const wedding = await getActiveWedding();
  const table = await getTableByCode(wedding.id, normalizeTableCode(code));

  if (!table) notFound();

  const submissions = await listSubmissionsByTable(table.id);

  return (
    <main className="paper-grain min-h-screen px-4 py-6">
      <div className="mx-auto grid w-[calc(100vw-32px)] max-w-[420px] gap-4">
        <nav className="flex items-center justify-between gap-4">
          <p className="font-serif text-2xl font-bold text-vino">{appConfig.appName}</p>
          <Link href="/ranking" className="rounded-md px-3 py-2 text-sm font-semibold hover:bg-white/70">
            Ranking
          </Link>
        </nav>
        <div>
          <p className="text-sm font-bold uppercase tracking-[0.12em] text-vino">{table.code}</p>
          <h1 className="mt-1 font-serif text-4xl font-bold">{table.name}</h1>
        </div>
        <MissionCard mission={table.mission} />
        <SubmissionForm tableCode={table.code} />
        {submissions.length > 0 ? <SubmissionStatusList submissions={submissions} /> : null}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/brand/lavanda-divider.png" alt="" className="mx-auto mt-1 w-[170px] opacity-85" />
      </div>
    </main>
  );
}
