"use client";

import { Button } from "../components/ui/Button";
import { Card } from "../components/ui/Card";

export default function ErrorPage({ reset }: { reset: () => void }) {
  return (
    <main className="grid min-h-screen place-items-center px-4">
      <Card className="max-w-md text-center">
        <h1 className="font-serif text-3xl font-bold">Algo se ha torcido</h1>
        <p className="mt-3 text-tinta/70">Reintenta la carga. Si sigue fallando, el jurado tiene trabajo.</p>
        <Button type="button" onClick={reset} className="mt-5">Reintentar</Button>
      </Card>
    </main>
  );
}
