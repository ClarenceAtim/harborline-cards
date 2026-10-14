"use server";

import { cookies, headers } from "next/headers";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { ADMIN_COOKIE, checkPassword, isAdmin, sessionValue } from "@/lib/admin-auth";
import { updateOrderStatus } from "@/lib/admin-orders";

// Best-effort brute-force guard: 5 wrong passwords per 15 minutes per IP (per server instance).
const fails = new Map<string, number[]>();

export async function login(formData: FormData) {
  const h = await headers();
  const ip = h.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  const now = Date.now();
  const recent = (fails.get(ip) ?? []).filter((t) => now - t < 15 * 60_000);
  if (recent.length >= 5) redirect("/admin?error=locked");

  const password = String(formData.get("password") ?? "");
  if (!checkPassword(password)) {
    recent.push(now);
    fails.set(ip, recent);
    if (fails.size > 2000) fails.clear();
    redirect("/admin?error=bad");
  }

  (await cookies()).set(ADMIN_COOKIE, sessionValue(), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/admin",
    maxAge: 60 * 60 * 24 * 7,
  });
  redirect("/admin");
}

export async function logout() {
  (await cookies()).delete({ name: ADMIN_COOKIE, path: "/admin" });
  redirect("/admin");
}

export async function setStatus(formData: FormData) {
  if (!(await isAdmin())) redirect("/admin");
  const id = String(formData.get("id") ?? "");
  const status = String(formData.get("status") ?? "");
  await updateOrderStatus(id, status);
  revalidatePath("/admin");
}