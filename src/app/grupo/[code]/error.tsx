"use client";

import { Button } from "../../../components/ui/Button";

export default function GrupoError({ reset }: { reset: () => void }) {
  return (
    <main className="page-shell paper-grain grid min-h-screen place-items-center px-4">
      <div className="sketch-card max-w-md rounded-[0.35rem] p-6 text-center">
        <p className="hand-label text-lavanda">Algo se ha torcido</p>
        <h1 className="mt-1 font-serif text-4xl font-bold leading-none">No pudimos cargar el grupo</h1>
        <p className="mt-3 text-graphite">Vuelve a intentarlo en unos segundos.</p>
        <Button type="button" className="mt-5" onClick={reset}>Reintentar</Button>
      </div>
    </main>
  );
}
