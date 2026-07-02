import Link from "next/link";
import { RankingTable } from "../../components/ranking/RankingTable";
import { SetupNotice } from "../../components/SetupNotice";
import { hasSupabaseConfig } from "../../lib/config";
import { getRanking } from "../../lib/repositories/ranking.repository";
import { getActiveWedding } from "../../lib/repositories/weddings.repository";

export const revalidate = 10;

export default async function RankingPage() {
  if (!hasSupabaseConfig()) return <SetupNotice />;

  const wedding = await getActiveWedding();
  const ranking = await getRanking(wedding.id);

  return (
    <main className="min-h-screen px-4 py-8">
      <div className="mx-auto max-w-4xl">
        <Link href="/" className="text-sm font-semibold text-vino">Inicio</Link>
        <h1 className="mt-4 font-serif text-5xl font-bold">Ranking de mesas</h1>
        <p className="mt-3 text-tinta/65">El honor se actualiza cuando el jurado aprueba pruebas.</p>
        <div className="mt-8">
          <RankingTable rows={ranking} highlightTop />
        </div>
      </div>
    </main>
  );
}
