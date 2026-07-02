import "server-only";

import { redirect } from "next/navigation";
import { isAdminSessionValid } from "./admin-session";

export async function assertAdmin() {
  if (!(await isAdminSessionValid())) {
    redirect("/admin");
  }
}
