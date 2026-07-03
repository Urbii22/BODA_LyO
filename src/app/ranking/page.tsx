import Link from "next/link";
import { RankingTable } from "../../components/ranking/RankingTable";
import { SetupNotice } from "../../components/SetupNotice";
import { LavenderDivider } from "../../components/wedding/InvitationArt";
import { hasSupabaseConfig } from "../../lib/config";
import { getRanking } from "../../lib/repositories/ranking.repository";
import { getActiveWedding } from "../../lib/repositories/weddings.repository";

export const revalidate = 10;

export default async function RankingPage() {
  if (!hasSupabaseConfig()) return <SetupNotice />;

  const wedding = await getActiveWedding();
  const ranking = await getRanking(wedding.id);

  return (
    <main className="page-shell paper-grain min-h-screen px-4 py-6">
      <div className="mx-auto max-w-4xl">
        <Link href="/" className="text-sm font-bold text-vino">Volver a la invitacion</Link>
        <div className="invitation-frame paper-grain mt-5 rounded-[0.2rem] px-5 py-7 text-center">
          <p className="hand-label text-lavanda">Ranking de grupos</p>
          <h1 className="mt-2 text-balance font-serif text-[clamp(3.3rem,8vw,6.4rem)] font-bold leading-[0.86]">
            La liga del banquete
          </h1>
          <div className="mx-auto mt-5 max-w-lg">
            <LavenderDivider label="en directo" />
          </div>
          <p className="mx-auto mt-5 max-w-[54ch] text-lg text-graphite">
            El honor se actualiza cuando el jurado aprueba pruebas.
          </p>
        </div>
        <div className="mt-8">
          <RankingTable rows={ranking} highlightTop />
        </div>
      </div>
    </main>
  );
}
