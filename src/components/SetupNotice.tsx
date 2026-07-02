import { Card } from "./ui/Card";

export function SetupNotice({ title = "Falta conectar Supabase" }: { title?: string }) {
  return (
    <main className="grid min-h-screen place-items-center px-4 py-10">
      <Card className="max-w-xl">
        <p className="text-sm font-bold uppercase tracking-[0.18em] text-vino">Setup pendiente</p>
        <h1 className="mt-3 font-serif text-3xl font-bold">{title}</h1>
        <p className="mt-3 text-tinta/70">
          Ejecuta `database/schema.sql`, `database/seed.sql`, crea el bucket privado `submissions` y completa `.env.local`.
        </p>
      </Card>
    </main>
  );
}
