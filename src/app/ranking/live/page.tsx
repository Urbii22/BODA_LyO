import Link from "next/link";
import { LiveRefresh } from "../../../components/ranking/LiveRefresh";
import { RankingTable } from "../../../components/ranking/RankingTable";
import { SetupNotice } from "../../../components/SetupNotice";
import { appConfig, hasSupabaseConfig } from "../../../lib/config";
import { getRanking } from "../../../lib/repositories/ranking.repository";
import { getActiveWedding } from "../../../lib/repositories/weddings.repository";

export const revalidate = 10;

export default async function LiveRankingPage() {
  if (!hasSupabaseConfig()) return <SetupNotice />;

  const wedding = await getActiveWedding();
  const ranking = (await getRanking(wedding.id)).slice(0, 5);

  return (
    <main className="paper-grain min-h-screen px-4 py-6">
      <LiveRefresh />
      <div className="mx-auto w-[calc(100vw-32px)] max-w-[640px]">
        <nav className="flex items-center justify-between gap-4">
          <Link href="/" className="font-serif text-2xl font-bold text-vino">{appConfig.appName}</Link>
          <Link href="/ranking" className="rounded-md px-3 py-2 text-sm font-semibold hover:bg-white/70">
            Ranking
          </Link>
        </nav>
        <p className="mt-5 text-sm font-bold uppercase tracking-[0.24em] text-oro-viejo">Ranking en directo</p>
        <div className="mt-3 flex flex-wrap items-center gap-4 sm:gap-5">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/brand/escudos.png" alt="" className="h-12 sm:h-14" />
          <h1 className="font-serif text-5xl font-bold leading-none">La liga del banquete</h1>
        </div>
        <div className="mt-5">
          <RankingTable rows={ranking} highlightTop />
        </div>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/brand/lavanda-divider.png" alt="" className="mx-auto mt-6 w-[170px] opacity-85" />
      </div>
    </main>
  );
}
