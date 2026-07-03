import Image from "next/image";
import Link from "next/link";
import { appConfig, hasSupabaseConfig } from "../lib/config";
import { Button } from "../components/ui/Button";
import { LavenderDivider } from "../components/wedding/InvitationArt";
import { getActiveWedding } from "../lib/repositories/weddings.repository";

export const revalidate = 10;

function splitCoupleName(coupleName: string) {
  const parts = coupleName.split(/\s+y\s+/i);
  if (parts.length >= 2) return [parts[0], parts.slice(1).join(" y ")] as const;
  return [coupleName, ""] as const;
}

export default async function Home() {
  const wedding = hasSupabaseConfig() ? await getActiveWedding() : null;
  const coupleName = wedding?.coupleName ?? appConfig.coupleName;
  const [firstName, secondName] = splitCoupleName(coupleName);

  return (
    <main className="page-shell paper-grain min-h-screen px-4 py-5 sm:px-6">
      <section className="mx-auto flex min-h-[calc(100dvh-2.5rem)] max-w-6xl flex-col">
        <nav className="flex items-center justify-between gap-4">
          <p className="font-hand text-3xl font-bold text-vino">{appConfig.appName}</p>
          <Link href="/ranking" className="rounded-[0.3rem] border border-tinta/20 bg-white/42 px-3 py-2 text-sm font-bold hover:bg-white/70">
            Ranking
          </Link>
        </nav>

        <div className="flex flex-1 flex-col justify-center py-8 lg:py-10">
          <p className="hand-label text-lavanda">Mision de boda</p>
          <div className="mt-3 flex max-w-2xl items-center justify-between gap-6">
            <h1 className="max-w-3xl text-balance font-hand text-[clamp(4.2rem,10vw,8.2rem)] font-bold leading-[0.82] text-vino">
              <span className="block">{firstName}</span>
              {secondName ? (
                <>
                  <span className="block text-center text-[0.52em] leading-[0.7] text-lavanda">&</span>
                  <span className="block">{secondName}</span>
                </>
              ) : null}
            </h1>
            <Image
              src="/brand/ilustracion-novios.png"
              alt="Luis y Oscar con su perro"
              width={245}
              height={320}
              priority
              className="h-auto w-28 shrink-0 sm:w-36 lg:w-44"
            />
          </div>
          <div className="mt-5 max-w-xl">
            <LavenderDivider label="Hotel Plati" />
          </div>
          <p className="mt-6 max-w-[58ch] text-xl leading-8 text-graphite">{appConfig.copy.intro}</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/ranking"><Button type="button">Ver ranking</Button></Link>
            <Link href="/mesa/MESA-2"><Button type="button" variant="ghost">Ver mesa 2</Button></Link>
          </div>
        </div>

        <div className="grid gap-3 pb-6 md:grid-cols-3">
          {["Escanead el QR de vuestra mesa", "Completad la mision secreta", "Subid una foto y sumad gloria"].map((step, index) => (
            <article key={step} className="sketch-card rounded-[0.35rem] p-4">
              <span className="font-hand text-3xl font-bold text-vino">0{index + 1}</span>
              <p className="mt-2 text-lg font-semibold leading-6">{step}</p>
            </article>
          ))}
        </div>

        <footer className="flex flex-wrap items-center justify-between gap-4 border-t border-tinta/20 py-4 text-sm text-graphite">
          <span>{appConfig.copy.tagline}</span>
          <Link href="/admin" className="font-bold hover:text-vino">Jurado</Link>
        </footer>
      </section>
    </main>
  );
}
