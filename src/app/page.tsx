import Link from "next/link";
import { appConfig } from "../lib/config";
import { Button } from "../components/ui/Button";
import { InvitationArt, LavenderDivider } from "../components/wedding/InvitationArt";

export const revalidate = 10;

export default function Home() {
  return (
    <main className="page-shell paper-grain min-h-screen px-4 py-5 sm:px-6">
      <section className="mx-auto flex min-h-[calc(100dvh-2.5rem)] max-w-6xl flex-col">
        <nav className="flex items-center justify-between gap-4">
          <p className="font-hand text-3xl font-bold text-vino">{appConfig.appName}</p>
          <Link href="/ranking" className="rounded-[0.3rem] border border-tinta/20 bg-white/42 px-3 py-2 text-sm font-bold hover:bg-white/70">
            Ranking
          </Link>
        </nav>

        <div className="grid flex-1 items-center gap-9 py-8 lg:grid-cols-[0.92fr_1.08fr] lg:py-10">
          <div className="order-2 lg:order-1">
            <InvitationArt />
          </div>

          <div className="order-1 lg:order-2">
            <p className="hand-label text-lavanda">Mision de boda</p>
            <h1 className="mt-3 max-w-3xl text-balance font-hand text-[clamp(4.2rem,10vw,8.2rem)] font-bold leading-[0.82] text-vino">
              <span className="block">Luis</span>
              <span className="block text-[0.52em] leading-[0.7] text-lavanda">&</span>
              <span className="block">Oscar</span>
            </h1>
            <div className="mt-5 max-w-xl">
              <LavenderDivider label="Hotel Plati" />
            </div>
            <p className="mt-6 max-w-[58ch] text-xl leading-8 text-graphite">{appConfig.copy.intro}</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/ranking"><Button type="button">Ver ranking</Button></Link>
              <Link href="/mesa/MESA-2"><Button type="button" variant="ghost">Ver mesa 2</Button></Link>
            </div>
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
