import Link from "next/link";

export default function GrupoNotFound() {
  return (
    <main className="page-shell paper-grain grid min-h-screen place-items-center px-4">
      <div className="max-w-md text-center">
        <p className="hand-label text-lavanda">QR no reconocido</p>
        <h1 className="mt-1 font-serif text-4xl font-bold">Grupo no encontrado</h1>
        <p className="mt-3 text-graphite">Revisa el codigo o pide ayuda a los novios.</p>
        <Link href="/" className="mt-5 inline-flex font-bold text-vino">Volver</Link>
      </div>
    </main>
  );
}
