import Link from "next/link";
import { Card } from "../components/ui/Card";

export default function NotFound() {
  return (
    <main className="grid min-h-screen place-items-center px-4">
      <Card className="max-w-md text-center">
        <h1 className="font-serif text-3xl font-bold">Aqui no hay mision</h1>
        <p className="mt-3 text-tinta/70">Vuelve al inicio y busca la pista correcta.</p>
        <Link href="/" className="mt-5 inline-block font-semibold text-vino">Volver</Link>
      </Card>
    </main>
  );
}
