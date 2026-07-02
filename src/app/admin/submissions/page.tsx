import Link from "next/link";
import { SubmissionReviewCard } from "../../../components/admin/SubmissionReviewCard";
import { SetupNotice } from "../../../components/SetupNotice";
import { hasSupabaseConfig } from "../../../lib/config";
import { listSubmissionsForAdmin } from "../../../lib/repositories/submissions.repository";
import { getActiveWedding } from "../../../lib/repositories/weddings.repository";
import type { SubmissionStatus } from "../../../lib/types/submission";

export const dynamic = "force-dynamic";

const statuses: Array<{ label: string; value?: SubmissionStatus }> = [
  { label: "Todas" },
  { label: "Pendientes", value: "pending" },
  { label: "Aprobadas", value: "approved" },
  { label: "Rechazadas", value: "rejected" },
];

export default async function AdminSubmissionsPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  if (!hasSupabaseConfig()) return <SetupNotice />;

  const { status } = await searchParams;
  const activeStatus = status === "all" ? undefined : isSubmissionStatus(status) ? status : "pending";
  const wedding = await getActiveWedding();
  const submissions = await listSubmissionsForAdmin(wedding.id, activeStatus);

  return (
    <main className="mx-auto max-w-6xl px-4 py-8">
      <h1 className="font-serif text-5xl font-bold">Cola de pruebas</h1>
      <div className="mt-5 flex flex-wrap gap-2">
        {statuses.map((item) => (
          <Link
            key={item.label}
            href={item.value ? `/admin/submissions?status=${item.value}` : "/admin/submissions?status=all"}
            className={`rounded-md border px-3 py-2 text-sm font-semibold ${
              (item.value ?? "all") === (status ?? "pending") ? "border-vino bg-vino text-white" : "border-tinta/10 bg-white/60"
            }`}
          >
            {item.label}
          </Link>
        ))}
      </div>
      <div className="mt-6 space-y-4">
        {submissions.length === 0 ? (
          <p className="rounded-md bg-white/70 p-4 text-tinta/65">No hay pruebas en esta vista.</p>
        ) : (
          submissions.map((submission) => (
            <SubmissionReviewCard key={submission.id} submission={submission} />
          ))
        )}
      </div>
    </main>
  );
}

function isSubmissionStatus(value: string | undefined): value is SubmissionStatus {
  return value === "pending" || value === "approved" || value === "rejected";
}
