import Link from "next/link";
import { adminLogout } from "../../actions/admin.actions";
import { Button } from "../ui/Button";

export function AdminNav() {
  return (
    <nav className="no-print paper-grain sticky top-0 z-30 border-b border-tinta/20 bg-marfil/94 px-3 py-2 shadow-[0_10px_30px_rgba(45,42,40,0.08)] backdrop-blur sm:px-4">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-3">
        <Link href="/admin" className="shrink-0 font-hand text-3xl font-bold leading-none text-vino">
          MesaQuest
        </Link>
        <form action={adminLogout} className="shrink-0">
          <Button type="submit" variant="ghost" className="min-h-10 px-4 py-2">Salir</Button>
        </form>
      </div>
      <div className="-mx-3 mt-2 overflow-x-auto px-3 pb-1 sm:-mx-4 sm:px-4">
        <div className="mx-auto flex max-w-6xl gap-2 text-sm font-semibold">
          <Link className="shrink-0 rounded-[0.3rem] border border-tinta/10 bg-white/38 px-3 py-2 hover:bg-white/70" href="/admin">Panel</Link>
          <Link className="shrink-0 rounded-[0.3rem] border border-tinta/10 bg-white/38 px-3 py-2 hover:bg-white/70" href="/admin/submissions">Pruebas</Link>
          <Link className="shrink-0 rounded-[0.3rem] border border-tinta/10 bg-white/38 px-3 py-2 hover:bg-white/70" href="/admin/tables">Mesas</Link>
          <Link className="shrink-0 rounded-[0.3rem] border border-tinta/10 bg-white/38 px-3 py-2 hover:bg-white/70" href="/admin/missions">Misiones</Link>
          <Link className="shrink-0 rounded-[0.3rem] border border-tinta/10 bg-white/38 px-3 py-2 hover:bg-white/70" href="/admin/qr">QR</Link>
          <Link className="shrink-0 rounded-[0.3rem] border border-tinta/10 bg-white/38 px-3 py-2 hover:bg-white/70" href="/admin/settings">Ajustes</Link>
        </div>
      </div>
    </nav>
  );
}
