import { Card } from "./ui/Card";

export function SetupNotice({ title = "Falta conectar Supabase" }: { title?: string }) {
  return (
    <main className="page-shell paper-grain grid min-h-screen place-items-center px-4 py-10">
      <Card className="max-w-xl">
        <p className="hand-label text-lavanda">Setup pendiente</p>
        <h1 className="mt-2 font-serif text-4xl font-bold leading-none">{title}</h1>
        <p className="mt-3 text-graphite">
          Ejecuta `database/schema.sql`, `database/seed.sql`, crea el bucket privado `submissions` y completa `.env.local`.
        </p>
      </Card>
    </main>
  );
}
