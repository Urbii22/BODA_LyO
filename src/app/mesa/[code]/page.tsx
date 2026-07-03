import { notFound } from "next/navigation";
import { SetupNotice } from "../../../components/SetupNotice";
import { MissionCard } from "../../../components/mesa/MissionCard";
import { SubmissionForm } from "../../../components/mesa/SubmissionForm";
import { SubmissionStatusList } from "../../../components/mesa/SubmissionStatusList";
import { Card } from "../../../components/ui/Card";
import { hasSupabaseConfig } from "../../../lib/config";
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
    <main className="min-h-screen px-4 py-6">
      <div className="mx-auto max-w-3xl space-y-5">
        <Card className="bg-tinta text-marfil">
          <p className="text-sm font-bold uppercase tracking-[0.18em] text-champagne">{table.code}</p>
          <h1 className="mt-2 font-serif text-4xl font-bold">{table.name}</h1>
        </Card>
        <MissionCard mission={table.mission} />
        <SubmissionForm tableCode={table.code} />
        <SubmissionStatusList submissions={submissions} />
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/brand/lavanda-divider.png" alt="" className="mx-auto w-44 opacity-85" />
      </div>
    </main>
  );
}
