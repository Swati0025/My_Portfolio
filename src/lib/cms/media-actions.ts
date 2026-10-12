"use server";

import { randomUUID } from "node:crypto";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireAdmin } from "./auth";

const allowedTypes = new Set(["image/jpeg", "image/png", "image/webp", "image/avif"]);
const maximumSize = 5 * 1024 * 1024;
const extensionByType: Record<string, string> = { "image/jpeg": "jpg", "image/png": "png", "image/webp": "webp", "image/avif": "avif" };

export async function uploadMedia(formData: FormData) {
  const { supabase } = await requireAdmin();
  const file = formData.get("file");
  if (!(file instanceof File) || file.size === 0) redirect("/admin/media?error=Choose%20an%20image%20file");
  if (!allowedTypes.has(file.type)) redirect("/admin/media?error=Use%20a%20JPEG%2C%20PNG%2C%20WebP%2C%20or%20AVIF%20image");
  if (file.size > maximumSize) redirect("/admin/media?error=Images%20must%20be%205%20MB%20or%20smaller");

  const path = `${randomUUID()}.${extensionByType[file.type]}`;
  const { error } = await supabase.storage.from("writer-media").upload(path, file, { contentType: file.type, upsert: false });
  if (error) redirect(`/admin/media?error=${encodeURIComponent(error.message)}`);
  revalidatePath("/admin/media");
  redirect("/admin/media?uploaded=1");
}

export async function deleteMedia(formData: FormData) {
  const { supabase } = await requireAdmin();
  const path = String(formData.get("path") ?? "");
  if (!path || path.startsWith("/") || path.includes("..")) redirect("/admin/media?error=Invalid%20media%20path");
  const { error } = await supabase.storage.from("writer-media").remove([path]);
  if (error) redirect(`/admin/media?error=${encodeURIComponent(error.message)}`);
  revalidatePath("/admin/media");
  redirect("/admin/media?deleted=1");
}
