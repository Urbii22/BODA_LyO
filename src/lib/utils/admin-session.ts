import "server-only";

import crypto from "node:crypto";
import { cookies } from "next/headers";

const COOKIE_NAME = "admin_session";
const SESSION_PAYLOAD = "mesaquest-admin-v1";
const DAY_SECONDS = 24 * 60 * 60;

export async function createAdminSession() {
  const cookieStore = await cookies();
  cookieStore.set(COOKIE_NAME, signSession(), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: DAY_SECONDS,
    path: "/",
  });
}

export async function clearAdminSession() {
  const cookieStore = await cookies();
  cookieStore.delete(COOKIE_NAME);
}

export async function isAdminSessionValid() {
  const cookieStore = await cookies();
  const value = cookieStore.get(COOKIE_NAME)?.value;
  if (!value || !process.env.SESSION_SECRET) return false;
  return safeCompare(value, signSession());
}

export async function verifyAdminPin(pin: string) {
  const expected = process.env.ADMIN_PIN;
  if (!expected) return false;
  return safeCompare(hash(pin), hash(expected));
}

export async function sleepOnFailedLogin() {
  await new Promise((resolve) => setTimeout(resolve, 500));
}

function signSession() {
  const secret = process.env.SESSION_SECRET;
  if (!secret || secret.length < 32) {
    throw new Error("SESSION_SECRET debe tener al menos 32 caracteres.");
  }

  return crypto.createHmac("sha256", secret).update(SESSION_PAYLOAD).digest("hex");
}

function hash(value: string) {
  return crypto.createHash("sha256").update(value).digest();
}

function safeCompare(left: string | Buffer, right: string | Buffer) {
  const leftBuffer = typeof left === "string" ? Buffer.from(left) : left;
  const rightBuffer = typeof right === "string" ? Buffer.from(right) : right;

  if (leftBuffer.length !== rightBuffer.length) {
    return false;
  }

  return crypto.timingSafeEqual(leftBuffer, rightBuffer);
}
