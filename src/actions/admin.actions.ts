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

  await reviewSubmissionRecord(
    parsed.data.submissionId,
    parsed.data.verdict,
    parsed.data.awardedPoints,
    parsed.data.adminNote,
  );

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
