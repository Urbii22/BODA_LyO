"use client";

import { Button } from "../../components/ui/Button";
import { Card } from "../../components/ui/Card";

export default function RankingError({ reset }: { reset: () => void }) {
  return (
    <main className="page-shell paper-grain grid min-h-screen place-items-center px-4">
      <Card className="max-w-md text-center">
        <p className="hand-label text-lavanda">Marcador dormido</p>
        <h1 className="mt-1 font-serif text-4xl font-bold leading-none">El marcador no responde</h1>
        <p className="mt-3 text-graphite">Reintenta para traer los puntos mas recientes.</p>
        <Button type="button" onClick={reset} className="mt-5">Reintentar</Button>
      </Card>
    </main>
  );
}
