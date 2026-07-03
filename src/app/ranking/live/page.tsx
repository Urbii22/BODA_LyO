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
      <div className="paper-grain mx-auto max-w-5xl rounded-[0.25rem] border border-marfil/28 bg-marfil px-5 py-7 text-tinta shadow-[0_32px_100px_rgba(0,0,0,0.42)] sm:px-8">
        <p className="hand-label text-lavanda">Ranking en directo</p>
        <h1 className="mt-2 text-balance font-serif text-[clamp(4rem,9vw,7.5rem)] font-bold leading-[0.86]">
          La liga del banquete
        </h1>
        <div className="mt-8">
          <RankingTable rows={ranking} highlightTop />
        </div>
      </div>
    </main>
  );
}
