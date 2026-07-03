"use client";

import { Button } from "../../components/ui/Button";
import { Card } from "../../components/ui/Card";

export default function AdminError({ reset }: { reset: () => void }) {
  return (
    <main className="page-shell paper-grain grid min-h-screen place-items-center px-4">
      <Card className="max-w-md text-center">
        <p className="hand-label text-lavanda">Jurado en pausa</p>
        <h1 className="mt-1 font-serif text-4xl font-bold leading-none">El panel no ha cargado</h1>
        <p className="mt-3 text-graphite">Reintenta. Las decisiones del jurado pueden esperar diez segundos.</p>
        <Button type="button" onClick={reset} className="mt-5">Reintentar</Button>
      </Card>
    </main>
  );
}
