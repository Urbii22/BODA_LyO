import type { Mission } from "./mission";
import type { WeddingTable } from "./table";

export type SubmissionStatus = "pending" | "approved" | "rejected";

export type Submission = {
  id: string;
  weddingId: string;
  tableId: string;
  missionId: string;
  participantName: string;
  comment: string | null;
  mediaPath: string;
  status: SubmissionStatus;
  awardedPoints: number;
  adminNote: string | null;
  createdAt: string;
  reviewedAt: string | null;
  updatedAt: string;
};

export type SubmissionSummary = Pick<
  Submission,
  "id" | "participantName" | "comment" | "status" | "awardedPoints" | "createdAt" | "reviewedAt"
>;

export type SubmissionWithRelations = Submission & {
  table: WeddingTable;
  mission: Mission;
  signedMediaUrl: string;
};

export type NewSubmission = {
  id?: string;
  weddingId: string;
  tableId: string;
  missionId: string;
  participantName: string;
  comment?: string;
  mediaPath: string;
};
