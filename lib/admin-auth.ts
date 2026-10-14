// Server-only admin authentication. The admin password is the ADMIN_TOKEN environment variable.
// The browser never stores the token itself: after login it holds a signed (HMAC) session value,
// and rotating ADMIN_TOKEN logs every admin out.

import { createHmac, timingSafeEqual } from "crypto";
import { cookies } from "next/headers";

export const ADMIN_COOKIE = "hl_admin";

function secret(): string | null {
  const t = process.env.ADMIN_TOKEN;
  return t && t.length >= 16 ? t : null;
}

export const adminEnabled = () => secret() !== null;

function safeEqual(a: string, b: string) {
  const x = Buffer.from(a);
  const y = Buffer.from(b);
  return x.length === y.length && timingSafeEqual(x, y);
}

const digest = (key: string, data: string) => createHmac("sha256", key).update(data).digest("hex");

export function checkPassword(input: string): boolean {
  const s = secret();
  if (!s) return false;
  // Compare fixed-length digests so the comparison time does not depend on the input.
  return safeEqual(digest("login", input), digest("login", s));
}

export function sessionValue(): string {
  return digest(secret()!, "harborline-admin-session-v1");
}

export async function isAdmin(): Promise<boolean> {
  if (!secret()) return false;
  const value = (await cookies()).get(ADMIN_COOKIE)?.value;
  return !!value && safeEqual(value, sessionValue());
}