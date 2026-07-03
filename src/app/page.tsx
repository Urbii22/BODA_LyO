import Link from "next/link";
import { appConfig } from "../lib/config";
import { Button } from "../components/ui/Button";

export const revalidate = 10;

export default function Home() {
  return (
    <main className="paper-grain flex min-h-screen flex-col justify-between gap-8 px-4 py-6">
      <section className="mx-auto w-[calc(100vw-32px)] max-w-[420px]">
        <nav className="flex items-center justify-between gap-4">
          <p className="font-serif text-2xl font-bold text-vino">{appConfig.appName}</p>
          <Link href="/ranking" className="rounded-md px-3 py-2 text-sm font-semibold hover:bg-white/70">
            Ranking
          </Link>
        </nav>
        <p className="mt-6 text-sm font-bold uppercase tracking-[0.24em] text-oro-viejo">Misión de boda</p>
        <h1 className="mt-4 font-serif text-[56px] font-extrabold leading-[0.95] text-tinta">{appConfig.coupleName}</h1>
        <p className="mt-6 text-lg leading-[1.7] text-tinta/72">{appConfig.copy.intro}</p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link href="/ranking"><Button type="button">Ver ranking</Button></Link>
          <Link href="/mesa/MESA-1"><Button type="button" variant="ghost">Probar mesa 1</Button></Link>
        </div>
        <div className="mt-10 rounded-lg border border-tinta/10 bg-white/70 p-4 shadow-[0_24px_60px_rgba(38,33,29,0.1)]">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/brand/ilustracion-novios.png" alt="Luis y Óscar con su perro" className="mx-auto mb-3 h-[150px] rounded-md" />
          <div className="grid gap-3">
            {["Escanea el QR de tu mesa", "Cumple la misión secreta", "Sube foto y suma gloria"].map((step, index) => (
              <div key={step} className="flex items-center gap-4 rounded-md bg-marfil p-4">
                <span className="grid size-11 shrink-0 place-items-center rounded-md bg-vino font-serif text-xl font-bold text-white">
                  {index + 1}
                </span>
                <p className="font-semibold">{step}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      <div className="mx-auto w-[calc(100vw-32px)] max-w-[420px]">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/brand/lavanda-divider.png" alt="" className="mx-auto w-[170px] opacity-85" />
        <footer className="mt-2 flex items-center justify-between gap-4 border-t border-tinta/10 pt-4 text-[13px] text-tinta/55">
          <span>{appConfig.copy.tagline}</span>
          <Link href="/admin" className="hover:text-vino">Admin</Link>
        </footer>
      </div>
    </main>
  );
}
