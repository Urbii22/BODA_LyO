import Link from "next/link";
import { adminLogout } from "../../actions/admin.actions";
import { Button } from "../ui/Button";

export function AdminNav() {
  return (
    <nav className="no-print flex flex-wrap items-center justify-between gap-3 border-b border-tinta/10 bg-marfil/85 px-4 py-3 backdrop-blur">
      <Link href="/admin" className="font-serif text-2xl font-bold text-vino">MesaQuest</Link>
      <div className="flex flex-wrap gap-2 text-sm font-semibold">
        <Link className="rounded-md px-3 py-2 hover:bg-white" href="/admin">Panel</Link>
        <Link className="rounded-md px-3 py-2 hover:bg-white" href="/admin/submissions">Pruebas</Link>
        <Link className="rounded-md px-3 py-2 hover:bg-white" href="/admin/qr">QR</Link>
        <form action={adminLogout}>
          <Button type="submit" variant="ghost">Salir</Button>
        </form>
      </div>
    </nav>
  );
}
