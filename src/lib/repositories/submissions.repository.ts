import { getSupabaseAdmin } from "../supabase/admin";
import type {
  NewSubmission,
  Submission,
  SubmissionStatus,
  SubmissionSummary,
  SubmissionWithRelations,
} from "../types/submission";
import { mapMission, mapSubmission, mapTable, type MissionRow, type SubmissionRow, type TableRow } from "./mappers";

type SubmissionWithRelationsRow = SubmissionRow & {
  tables: TableRow | null;
  missions: MissionRow | null;
};

export async function createSubmission(input: NewSubmission): Promise<Submission> {
  const { data, error } = await getSupabaseAdmin()
    .from("submissions")
    .insert({
      id: input.id,
      wedding_id: input.weddingId,
      table_id: input.tableId,
      mission_id: input.missionId,
      participant_name: input.participantName,
      comment: input.comment || null,
      media_path: input.mediaPath,
    })
    .select("*")
    .single<SubmissionRow>();

  if (error) throw new Error(`No se pudo guardar la prueba: ${error.message}`);
  return mapSubmission(data);
}

export async function listSubmissionsByTable(tableId: string): Promise<SubmissionSummary[]> {
  const { data, error } = await getSupabaseAdmin()
    .from("submissions")
    .select("id, participant_name, comment, status, awarded_points, created_at, reviewed_at")
    .eq("table_id", tableId)
    .order("created_at", { ascending: false })
    .returns<
      Pick<
        SubmissionRow,
        "id" | "participant_name" | "comment" | "status" | "awarded_points" | "created_at" | "reviewed_at"
      >[]
    >();

  if (error) throw new Error(`No se pudieron cargar los envios: ${error.message}`);

  return data.map((row) => ({
    id: row.id,
    participantName: row.participant_name,
    comment: row.comment,
    status: row.status,
    awardedPoints: row.awarded_points,
    createdAt: row.created_at,
    reviewedAt: row.reviewed_at,
  }));
}

export async function listSubmissionsForAdmin(
  weddingId: string,
  status?: SubmissionStatus,
): Promise<SubmissionWithRelations[]> {
  let query = getSupabaseAdmin()
    .from("submissions")
    .select("*, tables(*), missions(*)")
    .eq("wedding_id", weddingId)
    .order("created_at", { ascending: false });

  if (status) query = query.eq("status", status);

  const { data, error } = await query.returns<SubmissionWithRelationsRow[]>();

  if (error) throw new Error(`No se pudo cargar la cola: ${error.message}`);

  return Promise.all(
    data.map(async (row) => {
      if (!row.tables || !row.missions) {
        throw new Error("Hay un envio sin mesa o mision asociada.");
      }

      return {
        ...mapSubmission(row),
        table: mapTable(row.tables),
        mission: mapMission(row.missions),
        signedMediaUrl: await getSignedMediaUrl(row.media_path),
      };
    }),
  );
}

export async function reviewSubmission(
  id: string,
  verdict: SubmissionStatus,
  awardedPoints?: number,
  adminNote?: string,
): Promise<void> {
  const { data: current, error: currentError } = await getSupabaseAdmin()
    .from("submissions")
    .select("id, missions(points)")
    .eq("id", id)
    .single<{ id: string; missions: { points: number } | null }>();

  if (currentError) throw new Error(`No se pudo cargar el envio: ${currentError.message}`);

  const points =
    verdict === "approved" ? (awardedPoints ?? current.missions?.points ?? 0) : 0;

  const { error } = await getSupabaseAdmin()
    .from("submissions")
    .update({
      status: verdict,
      awarded_points: points,
      admin_note: adminNote || null,
      reviewed_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    })
    .eq("id", id);

  if (error) throw new Error(`No se pudo revisar el envio: ${error.message}`);
}

export async function getAdminStats(weddingId: string): Promise<{
  pending: number;
  approved: number;
  rejected: number;
  tablesWithApproved: number;
}> {
  const [pending, approved, rejected, tables] = await Promise.all([
    countSubmissions(weddingId, "pending"),
    countSubmissions(weddingId, "approved"),
    countSubmissions(weddingId, "rejected"),
    getSupabaseAdmin()
      .from("submissions")
      .select("table_id")
      .eq("wedding_id", weddingId)
      .eq("status", "approved")
      .returns<{ table_id: string }[]>(),
  ]);

  if (tables.error) throw new Error(`No se pudieron calcular las mesas con puntos: ${tables.error.message}`);

  return {
    pending,
    approved,
    rejected,
    tablesWithApproved: new Set(tables.data.map((row) => row.table_id)).size,
  };
}

export async function getSignedMediaUrl(mediaPath: string): Promise<string> {
  if (!mediaPath) return "";

  const { data, error } = await getSupabaseAdmin()
    .storage
    .from("submissions")
    .createSignedUrl(mediaPath, 3600);

  if (error) throw new Error(`No se pudo firmar la imagen: ${error.message}`);
  return data.signedUrl;
}

async function countSubmissions(weddingId: string, status: SubmissionStatus) {
  const { count, error } = await getSupabaseAdmin()
    .from("submissions")
    .select("id", { count: "exact", head: true })
    .eq("wedding_id", weddingId)
    .eq("status", status);

  if (error) throw new Error(`No se pudo contar ${status}: ${error.message}`);
  return count ?? 0;
}
