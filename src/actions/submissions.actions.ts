"use server";

import { revalidatePath } from "next/cache";
import { getSupabaseAdmin } from "../lib/supabase/admin";
import { getActiveWedding } from "../lib/repositories/weddings.repository";
import { getTableByCode } from "../lib/repositories/tables.repository";
import { createSubmission as createSubmissionRecord } from "../lib/repositories/submissions.repository";
import { submissionSchema } from "../lib/validations/submission.schema";
import { normalizeTableCode } from "../lib/utils/normalize-table-code";

const allowedImageTypes = new Set(["image/jpeg", "image/png", "image/webp"]);
const maxFileSize = 2 * 1024 * 1024;

export type SubmissionActionState = {
  ok: boolean;
  message: string;
};

export async function createSubmission(
  _previousState: SubmissionActionState,
  formData: FormData,
): Promise<SubmissionActionState> {
  const parsed = submissionSchema.safeParse({
    tableCode: formData.get("tableCode"),
    participantName: formData.get("participantName"),
    comment: formData.get("comment") || undefined,
  });

  if (!parsed.success) {
    return { ok: false, message: parsed.error.issues[0]?.message || "Revisa los datos del envio." };
  }

  const file = formData.get("photo");
  if (!(file instanceof File) || file.size === 0) {
    return { ok: false, message: "La prueba necesita una foto." };
  }

  if (!allowedImageTypes.has(file.type)) {
    return { ok: false, message: "La foto debe ser JPG, PNG o WEBP." };
  }

  if (file.size > maxFileSize) {
    return { ok: false, message: "La foto pesa demasiado. Prueba con otra imagen o espera a que se comprima." };
  }

  try {
    const wedding = await getActiveWedding();
    const tableCode = normalizeTableCode(parsed.data.tableCode);
    const table = await getTableByCode(wedding.id, tableCode);

    if (!table) {
      return { ok: false, message: "Mesa no encontrada. Pregunta a los novios y volvemos a intentarlo." };
    }

    if (!table.mission) {
      return { ok: false, message: "La mision de esta mesa aun esta en preparacion." };
    }

    const submissionId = crypto.randomUUID();
    const mediaPath = `weddings/${wedding.slug}/tables/${table.code}/${submissionId}.jpg`;
    const bytes = await file.arrayBuffer();
    const { error: uploadError } = await getSupabaseAdmin()
      .storage
      .from("submissions")
      .upload(mediaPath, bytes, {
        contentType: file.type,
        upsert: false,
      });

    if (uploadError) {
      return { ok: false, message: `No se pudo subir la foto: ${uploadError.message}` };
    }

    try {
      await createSubmissionRecord({
        id: submissionId,
        weddingId: wedding.id,
        tableId: table.id,
        missionId: table.mission.id,
        participantName: parsed.data.participantName,
        comment: parsed.data.comment,
        mediaPath,
      });
    } catch (error) {
      await getSupabaseAdmin().storage.from("submissions").remove([mediaPath]).catch(() => undefined);
      throw error;
    }

    revalidatePath(`/mesa/${table.code}`);
    return {
      ok: true,
      message: "Prueba enviada. Pendiente de revision. Si se aprueba, vuestra mesa sumara puntos.",
    };
  } catch (error) {
    return {
      ok: false,
      message: error instanceof Error ? error.message : "No se pudo enviar la prueba. Reintentalo en un momento.",
    };
  }
}
