import Link from "next/link";
import { appConfig } from "../lib/config";
import { Button } from "../components/ui/Button";

export const revalidate = 10;

export default function Home() {
  return (
    <main className="paper-grain min-h-screen px-4 py-6">
      <section className="mx-auto flex min-h-[calc(100vh-3rem)] max-w-6xl flex-col justify-between">
        <nav className="flex items-center justify-between gap-4">
          <p className="font-serif text-2xl font-bold text-vino">{appConfig.appName}</p>
          <Link href="/ranking" className="rounded-md px-3 py-2 text-sm font-semibold hover:bg-white/70">
            Ranking
          </Link>
        </nav>
        <div className="grid items-end gap-10 py-12 lg:grid-cols-[1.05fr_0.95fr]">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.24em] text-oro-viejo">Mision de boda</p>
            <h1 className="mt-4 max-w-3xl font-serif text-6xl font-extrabold leading-[0.95] text-tinta sm:text-7xl lg:text-8xl">
              {appConfig.coupleName}
            </h1>
            <p className="mt-6 max-w-2xl text-xl leading-8 text-tinta/72">{appConfig.copy.intro}</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/ranking"><Button type="button">Ver ranking</Button></Link>
              <Link href="/mesa/MESA-1"><Button type="button" variant="ghost">Probar mesa 1</Button></Link>
            </div>
          </div>
          <div className="rounded-lg border border-tinta/10 bg-white/70 p-4 shadow-[0_24px_60px_rgba(38,33,29,0.1)]">
            <div className="grid gap-3">
              {["Escanea el QR de tu mesa", "Cumple la mision secreta", "Sube foto y suma gloria"].map((step, index) => (
                <div key={step} className="flex items-center gap-4 rounded-md bg-marfil p-4">
                  <span className="grid size-11 shrink-0 place-items-center rounded-md bg-vino font-serif text-xl font-bold text-white">
                    {index + 1}
                  </span>
                  <p className="font-semibold">{step}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
        <footer className="flex items-center justify-between gap-4 border-t border-tinta/10 py-4 text-sm text-tinta/55">
          <span>{appConfig.copy.tagline}</span>
          <Link href="/admin" className="hover:text-vino">Admin</Link>
        </footer>
      </section>
    </main>
  );
}
