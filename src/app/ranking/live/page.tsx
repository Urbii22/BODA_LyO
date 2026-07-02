import { LiveRefresh } from "../../../components/ranking/LiveRefresh";
import { RankingTable } from "../../../components/ranking/RankingTable";
import { SetupNotice } from "../../../components/SetupNotice";
import { hasSupabaseConfig } from "../../../lib/config";
import { getRanking } from "../../../lib/repositories/ranking.repository";
import { getActiveWedding } from "../../../lib/repositories/weddings.repository";

export const revalidate = 10;

export default async function LiveRankingPage() {
  if (!hasSupabaseConfig()) return <SetupNotice />;

  const wedding = await getActiveWedding();
  const ranking = (await getRanking(wedding.id)).slice(0, 5);

  return (
    <main className="min-h-screen bg-noche px-6 py-8 text-marfil">
      <LiveRefresh />
      <div className="mx-auto max-w-5xl">
        <p className="text-sm font-bold uppercase tracking-[0.22em] text-champagne">Ranking en directo</p>
        <h1 className="mt-3 font-serif text-7xl font-bold">La liga del banquete</h1>
        <div className="mt-10 text-tinta">
          <RankingTable rows={ranking} highlightTop />
        </div>
      </div>
    </main>
  );
}
