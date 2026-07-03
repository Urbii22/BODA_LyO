import "server-only";

import { cookies } from "next/headers";

const COOKIE_NAME = "mesaquest_group_code";
const DAY_SECONDS = 24 * 60 * 60;
const SESSION_SECONDS = 90 * DAY_SECONDS;

export async function rememberGroupCode(code: string) {
  const cookieStore = await cookies();
  cookieStore.set(COOKIE_NAME, code, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: SESSION_SECONDS,
    path: "/",
  });
}

export async function getRememberedGroupCode() {
  const cookieStore = await cookies();
  return cookieStore.get(COOKIE_NAME)?.value || "";
}
