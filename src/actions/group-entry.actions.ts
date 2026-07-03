"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getActiveWedding } from "../lib/repositories/weddings.repository";
import { resolveOrCreateTableFromGroupName } from "../lib/repositories/tables.repository";
import { groupEntrySchema } from "../lib/validations/group-entry.schema";
import { displayGroupCode } from "../lib/utils/group-labels";
import { rememberGroupCode } from "../lib/utils/group-session";

export type GroupEntryActionState = {
  ok: boolean;
  message: string;
  groupName: string;
};

export async function enterGroup(
  _previousState: GroupEntryActionState,
  formData: FormData,
): Promise<GroupEntryActionState> {
  const rawGroupName = String(formData.get("groupName") || "");
  const parsed = groupEntrySchema.safeParse({ groupName: rawGroupName });

  if (!parsed.success) {
    return {
      ok: false,
      message: parsed.error.issues[0]?.message || "Revisa el nombre del grupo.",
      groupName: rawGroupName,
    };
  }

  let tableCode = "";
  let created = false;

  try {
    const wedding = await getActiveWedding();
    const result = await resolveOrCreateTableFromGroupName(wedding.id, parsed.data.groupName);
    tableCode = result.table.code;
    created = result.created;
  } catch (error) {
    return {
      ok: false,
      message: error instanceof Error ? error.message : "No se pudo entrar al grupo. Reintentalo en un momento.",
      groupName: parsed.data.groupName,
    };
  }

  await rememberGroupCode(tableCode);

  if (created) {
    revalidatePath("/admin");
    revalidatePath("/admin/tables");
    revalidatePath("/admin/qr");
    revalidatePath("/ranking");
    revalidatePath("/ranking/live");
  }

  redirect(`/grupo/${encodeURIComponent(displayGroupCode(tableCode))}`);
}
