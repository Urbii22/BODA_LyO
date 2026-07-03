"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { assertAdmin } from "../lib/utils/assert-admin";
import {
  clearAdminSession,
  createAdminSession,
  sleepOnFailedLogin,
  verifyAdminPassword,
} from "../lib/utils/admin-session";
import {
  deleteSubmission as deleteSubmissionRecord,
  reviewSubmission as reviewSubmissionRecord,
} from "../lib/repositories/submissions.repository";
import { notifyTable } from "../lib/push/web-push";
import { displayGroupCode, displayGroupName } from "../lib/utils/group-labels";
import { reviewSubmissionSchema } from "../lib/validations/submission.schema";

export type AdminLoginState = {
  ok: boolean;
  message: string;
};

export async function adminLogin(
  _previousState: AdminLoginState,
  formData: FormData,
): Promise<AdminLoginState> {
  const password = String(formData.get("password") || "");

  if (await verifyAdminPassword(password)) {
    await createAdminSession();
    redirect("/admin");
  }

  await sleepOnFailedLogin();
  return { ok: false, message: "Contraseña incorrecta." };
}

export async function adminLogout() {
  await assertAdmin();
  await clearAdminSession();
  redirect("/admin");
}

export async function reviewSubmission(formData: FormData) {
  await assertAdmin();

  const parsed = reviewSubmissionSchema.safeParse({
    submissionId: formData.get("submissionId"),
    verdict: formData.get("verdict"),
    awardedPoints: formData.get("awardedPoints") || undefined,
    adminNote: formData.get("adminNote") || undefined,
  });

  if (!parsed.success) {
    throw new Error(parsed.error.issues[0]?.message || "Revision no valida.");
  }

  const reviewed = await reviewSubmissionRecord(
    parsed.data.submissionId,
    parsed.data.verdict,
    parsed.data.awardedPoints,
    parsed.data.adminNote,
  );

  try {
    if (reviewed.status === "approved") {
      await notifyTable({
        tableId: reviewed.tableId,
        title: "Quest verificada",
        body: `${displayGroupName(reviewed.tableName)} suma ${reviewed.awardedPoints} puntos por "${reviewed.missionTitle}".`,
        url: `/grupo/${encodeURIComponent(displayGroupCode(reviewed.tableCode))}`,
        tag: `submission-${reviewed.id}-approved`,
      });
    } else if (reviewed.status === "rejected") {
      await notifyTable({
        tableId: reviewed.tableId,
        title: "Quest rechazada",
        body: `${displayGroupName(reviewed.tableName)}: esta prueba no ha sido validada. Podeis intentar otra.`,
        url: `/grupo/${encodeURIComponent(displayGroupCode(reviewed.tableCode))}`,
        tag: `submission-${reviewed.id}-rejected`,
      });
    }
  } catch (error) {
    console.error("No se pudo enviar la notificacion de revision", error);
  }

  revalidatePath("/ranking");
  revalidatePath("/ranking/live");
  revalidatePath("/mesa/[code]", "page");
  revalidatePath("/grupo/[code]", "page");
  revalidatePath("/admin");
  revalidatePath("/admin/submissions");
}

export async function deleteSubmission(formData: FormData) {
  await assertAdmin();

  const submissionId = String(formData.get("submissionId") || "");
  if (!submissionId) throw new Error("Falta el envio.");

  await deleteSubmissionRecord(submissionId);

  revalidatePath("/ranking");
  revalidatePath("/ranking/live");
  revalidatePath("/mesa/[code]", "page");
  revalidatePath("/grupo/[code]", "page");
  revalidatePath("/admin");
  revalidatePath("/admin/submissions");
  revalidatePath("/admin/tables");
}
