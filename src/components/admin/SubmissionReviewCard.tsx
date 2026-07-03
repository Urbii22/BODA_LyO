import { reviewSubmission } from "../../actions/admin.actions";
import type { SubmissionWithRelations } from "../../lib/types/submission";
import { formatDate } from "../../lib/utils/format-date";
import {
  calculateSubmissionPoints,
  getSubmissionModeLabel,
  getSubmissionModeShortLabel,
} from "../../lib/utils/submission-mode";
import { Badge } from "../ui/Badge";
import { Button } from "../ui/Button";
import { Card } from "../ui/Card";
import { Input } from "../ui/Input";

const statusTone = {
  pending: "gold" as const,
  approved: "green" as const,
  rejected: "red" as const,
};

const statusCopy = {
  pending: "pendiente",
  approved: "aprobada",
  rejected: "rechazada",
};

export function SubmissionReviewCard({ submission }: { submission: SubmissionWithRelations }) {
  const defaultPoints = calculateSubmissionPoints(submission.mission.points, submission.mode);

  return (
    <Card className="grid gap-4 lg:grid-cols-[280px_1fr]">
      {submission.signedMediaUrl ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={submission.signedMediaUrl}
          alt={`Prueba enviada por ${submission.table.name}`}
          className="h-72 w-full rounded-[0.3rem] border border-tinta/15 object-cover lg:h-full"
        />
      ) : (
        <div className="grid h-72 place-items-center rounded-[0.3rem] bg-marfil text-sm text-graphite">Sin imagen</div>
      )}
      <div>
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <p className="hand-label text-lavanda">{submission.table.name}</p>
            <h2 className="mt-1 font-serif text-4xl font-bold leading-none">{submission.mission.title}</h2>
            <p className="mt-2 text-sm font-semibold text-graphite">
              Enviada por {submission.participantName} · {formatDate(submission.createdAt)}
            </p>
          </div>
          <Badge tone={statusTone[submission.status]}>{statusCopy[submission.status]}</Badge>
        </div>
        <div className="mt-3 flex flex-wrap gap-2">
          <Badge tone={submission.mode === "bold" ? "red" : "green"}>
            {getSubmissionModeLabel(submission.mode)} ({getSubmissionModeShortLabel(submission.mode)} puntos)
          </Badge>
        </div>
        {submission.comment ? (
          <p className="mt-4 rounded-[0.3rem] border border-tinta/10 bg-marfil p-3 text-sm text-graphite">
            {submission.comment}
          </p>
        ) : null}
        <form action={reviewSubmission} className="mt-5 grid gap-3">
          <input type="hidden" name="submissionId" value={submission.id} />
          <div className="grid gap-3 sm:grid-cols-2">
            <label>
              <span className="text-sm font-bold uppercase tracking-[0.08em] text-graphite">Puntos</span>
              <Input name="awardedPoints" type="number" min={0} placeholder={String(defaultPoints)} />
            </label>
            <label>
              <span className="text-sm font-bold uppercase tracking-[0.08em] text-graphite">Nota admin</span>
              <Input name="adminNote" placeholder="Opcional" />
            </label>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button name="verdict" value="approved" type="submit">
              Aprobar +{defaultPoints}
            </Button>
            <Button name="verdict" value="rejected" type="submit" variant="danger">
              Rechazar
            </Button>
            <Button name="verdict" value="pending" type="submit" variant="ghost">
              Volver a pendiente
            </Button>
          </div>
        </form>
      </div>
    </Card>
  );
}
