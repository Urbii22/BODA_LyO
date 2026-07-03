import Link from "next/link";
import { Card } from "../components/ui/Card";

export default function NotFound() {
  return (
    <main className="page-shell paper-grain grid min-h-screen place-items-center px-4">
      <Card className="max-w-md text-center">
        <p className="hand-label text-lavanda">Mapa equivocado</p>
        <h1 className="mt-1 font-serif text-4xl font-bold leading-none">Aqui no hay mision</h1>
        <p className="mt-3 text-graphite">Vuelve al inicio y busca la pista correcta.</p>
        <Link href="/" className="mt-5 inline-block font-bold text-vino">Volver</Link>
      </Card>
    </main>
  );
}
