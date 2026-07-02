import { AdminLogin } from "../../components/admin/AdminLogin";
import { AdminNav } from "../../components/admin/AdminNav";
import { isAdminSessionValid } from "../../lib/utils/admin-session";

export const dynamic = "force-dynamic";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const isValid = await isAdminSessionValid();

  if (!isValid) {
    return <AdminLogin />;
  }

  return (
    <div className="min-h-screen">
      <AdminNav />
      {children}
    </div>
  );
}
