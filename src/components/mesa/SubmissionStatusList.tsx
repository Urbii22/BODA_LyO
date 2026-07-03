import type { SubmissionSummary } from "../../lib/types/submission";
import { formatDate } from "../../lib/utils/format-date";
import { getSubmissionModeShortLabel } from "../../lib/utils/submission-mode";
import { Badge } from "../ui/Badge";
import { Card } from "../ui/Card";

const statusCopy = {
  pending: { label: "pendiente", tone: "gold" as const },
  approved: { label: "aprobada", tone: "green" as const },
  rejected: { label: "rechazada", tone: "red" as const },
};

export function SubmissionStatusList({ submissions }: { submissions: SubmissionSummary[] }) {
  return (
    <Card>
      <h2 className="font-serif text-2xl font-bold">Pruebas de vuestra mesa</h2>
      {submissions.length === 0 ? (
        <p className="mt-3 text-sm text-tinta/65">Aun no hay pruebas. La primera vale doble en gloria.</p>
      ) : (
        <ul className="mt-4 space-y-3">
          {submissions.map((submission) => (
            <li key={submission.id} className="rounded-md border border-tinta/10 bg-marfil/70 p-3">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="font-semibold">Prueba enviada</p>
                  <p className="text-xs text-tinta/55">{formatDate(submission.createdAt)}</p>
                </div>
                <Badge tone={statusCopy[submission.status].tone}>{statusCopy[submission.status].label}</Badge>
              </div>
              {submission.mode === "bold" ? (
                <p className="mt-2 text-xs font-bold uppercase tracking-[0.12em] text-vino">
                  Sin verguenza - {getSubmissionModeShortLabel(submission.mode)}
                </p>
              ) : null}
              {submission.comment ? <p className="mt-2 text-sm text-tinta/70">{submission.comment}</p> : null}
            </li>
          ))}
        </ul>
      )}
    </Card>
  );
}
