import Link from "next/link";
import { Card } from "../../../components/ui/Card";

export default function MesaNotFound() {
  return (
    <main className="page-shell paper-grain grid min-h-screen place-items-center px-4">
      <Card className="max-w-md text-center">
        <p className="hand-label text-lavanda">QR despistado</p>
        <h1 className="mt-1 font-serif text-4xl font-bold">Mesa no encontrada</h1>
        <p className="mt-3 text-graphite">Pregunta a los novios o revisa el QR. Seguro que vuestra mision existe.</p>
        <Link href="/" className="mt-5 inline-block font-bold text-vino">Volver al inicio</Link>
      </Card>
    </main>
  );
}
