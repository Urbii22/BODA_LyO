export type SubmissionMode = "normal" | "bold";

const boldModeMarker = "[[mesaquest-mode:bold]]";

export const boldModeMultiplier = 1.25;

export function getSubmissionModeLabel(mode: SubmissionMode) {
  return mode === "bold" ? "Sin verguenza" : "Normal";
}

export function getSubmissionModeShortLabel(mode: SubmissionMode) {
  return mode === "bold" ? "x1,25" : "x1";
}

export function calculateSubmissionPoints(basePoints: number, mode: SubmissionMode) {
  return mode === "bold" ? Math.round(basePoints * boldModeMultiplier) : basePoints;
}

export function storeSubmissionMode(comment: string | undefined, mode: SubmissionMode) {
  const cleanComment = comment?.trim();

  if (mode === "normal") return cleanComment;
  return [boldModeMarker, cleanComment].filter(Boolean).join("\n");
}

export function parseStoredSubmissionMode(comment: string | null | undefined): {
  comment: string | null;
  mode: SubmissionMode;
} {
  if (!comment?.startsWith(boldModeMarker)) {
    return { comment: comment || null, mode: "normal" };
  }

  const cleanComment = comment.slice(boldModeMarker.length).trim();
  return {
    comment: cleanComment || null,
    mode: "bold",
  };
}
