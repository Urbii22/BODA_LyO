import { reviewSubmission } from "../../actions/admin.actions";
import type { SubmissionWithRelations } from "../../lib/types/submission";
import { formatDate } from "../../lib/utils/format-date";
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
  return (
    <Card className="grid gap-4 lg:grid-cols-[280px_1fr]">
      {submission.signedMediaUrl ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={submission.signedMediaUrl}
          alt={`Prueba enviada por ${submission.participantName}`}
          className="h-72 w-full rounded-md object-cover lg:h-full"
        />
      ) : (
        <div className="grid h-72 place-items-center rounded-md bg-marfil text-sm text-tinta/55">Sin imagen</div>
      )}
      <div>
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.12em] text-vino">{submission.table.name}</p>
            <h2 className="font-serif text-3xl font-bold">{submission.mission.title}</h2>
            <p className="mt-1 text-sm text-tinta/60">
              {submission.participantName} · {formatDate(submission.createdAt)}
            </p>
          </div>
          <Badge tone={statusTone[submission.status]}>{statusCopy[submission.status]}</Badge>
        </div>
        {submission.comment ? <p className="mt-4 rounded-md bg-marfil p-3 text-sm text-tinta/75">{submission.comment}</p> : null}
        <form action={reviewSubmission} className="mt-5 grid gap-3">
          <input type="hidden" name="submissionId" value={submission.id} />
          <div className="grid gap-3 sm:grid-cols-2">
            <label>
              <span className="text-sm font-semibold">Puntos</span>
              <Input name="awardedPoints" type="number" min={0} placeholder={String(submission.mission.points)} />
            </label>
            <label>
              <span className="text-sm font-semibold">Nota admin</span>
              <Input name="adminNote" placeholder="Opcional" />
            </label>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button name="verdict" value="approved" type="submit">Aprobar</Button>
            <Button name="verdict" value="rejected" type="submit" variant="danger">Rechazar</Button>
            <Button name="verdict" value="pending" type="submit" variant="ghost">Volver a pendiente</Button>
          </div>
        </form>
      </div>
    </Card>
  );
}
