import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import { SetupNotice } from "../../components/SetupNotice";
import { GroupEntryForm } from "../../components/mesa/GroupEntryForm";
import { LavenderDivider } from "../../components/wedding/InvitationArt";
import { appConfig, hasSupabaseConfig } from "../../lib/config";
import { getTableByCode } from "../../lib/repositories/tables.repository";
import { getActiveWedding } from "../../lib/repositories/weddings.repository";
import { displayGroupCode } from "../../lib/utils/group-labels";
import { getRememberedGroupCode } from "../../lib/utils/group-session";

export const dynamic = "force-dynamic";

export default async function GroupEntryPage({
  searchParams,
}: {
  searchParams: Promise<{ cambiar?: string }>;
}) {
  if (!hasSupabaseConfig()) return <SetupNotice />;

  const [{ cambiar }, wedding] = await Promise.all([searchParams, getActiveWedding()]);
  const shouldChangeGroup = cambiar === "1" || cambiar === "true";

  if (!shouldChangeGroup) {
    const rememberedCode = await getRememberedGroupCode();
    if (rememberedCode) {
      const table = await getTableByCode(wedding.id, rememberedCode);
      if (table) redirect(`/grupo/${encodeURIComponent(displayGroupCode(table.code))}`);
    }
  }

  return (
    <main className="page-shell paper-grain min-h-screen px-4 py-5 sm:px-6">
      <section className="mx-auto flex min-h-[calc(100dvh-2.5rem)] max-w-5xl flex-col">
        <nav className="flex items-center justify-between gap-4">
          <Link href="/" className="font-hand text-3xl font-bold text-vino">
            {appConfig.appName}
          </Link>
          <Link href="/ranking" className="rounded-[0.3rem] border border-tinta/20 bg-white/42 px-3 py-2 text-sm font-bold hover:bg-white/70">
            Ranking
          </Link>
        </nav>

        <div className="grid flex-1 items-center gap-7 py-8 lg:grid-cols-[1.05fr_0.95fr]">
          <section className="max-w-xl">
            <p className="hand-label text-lavanda">Mision de boda</p>
            <div className="mt-3 flex items-center gap-5">
              <h1 className="font-hand text-[clamp(4.2rem,11vw,7rem)] font-bold leading-[0.82] text-vino">
                {wedding.coupleName}
              </h1>
              <Image
                src="/brand/ilustracion-novios.png"
                alt="Luis y Oscar con su perro"
                width={245}
                height={320}
                priority
                className="h-auto w-24 shrink-0 sm:w-32"
              />
            </div>
            <div className="mt-5 max-w-md">
              <LavenderDivider label="Hotel Plati" />
            </div>
            <p className="mt-6 max-w-[54ch] text-xl leading-8 text-graphite">
              Escribid el nombre de vuestro grupo. Si ya existe, seguireis desde el mismo sitio; si no, se abrira uno nuevo.
            </p>
          </section>

          <GroupEntryForm />
        </div>
      </section>
    </main>
  );
}
