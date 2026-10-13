"use server";

import { revalidatePath, updateTag } from "next/cache";
import { redirect } from "next/navigation";
import { requireAdmin } from "./auth";
import { isAllowedMediaUrl, validateContentImages } from "./media-validation";
import { contentCollectionPath, contentPath, isContentType, type ContentType, type PublishStatus } from "./types";

const slugPattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

function field(formData: FormData, key: string) {
  const value = formData.get(key);
  return typeof value === "string" ? value.trim() : "";
}

function parseContent(formData: FormData) {
  const typeValue = field(formData, "type");
  const title = field(formData, "title");
  const slug = field(formData, "slug");
  const excerpt = field(formData, "excerpt");
  const contentText = field(formData, "content_json");
  const coverImage = field(formData, "cover_image");
  const category = field(formData, "category");
  const tags = field(formData, "tags").split(",").map((tag) => tag.trim()).filter(Boolean).slice(0, 20);
  const statusValue = field(formData, "status");

  if (!isContentType(typeValue)) throw new Error("Choose stories, poems, articles, or book reviews.");
  if (!title || title.length > 180) throw new Error("Title is required and must be under 180 characters.");
  if (!slugPattern.test(slug)) throw new Error("Use a URL-friendly slug with lowercase letters, numbers, and hyphens.");
  if (excerpt.length > 400) throw new Error("The excerpt must be 400 characters or fewer.");
  if (contentText.length > 1_000_000) throw new Error("This content is too large to save.");

  let content: Record<string, unknown>;
  try {
    content = JSON.parse(contentText) as Record<string, unknown>;
  } catch {
    throw new Error("The editor content could not be read. Please retry.");
  }
  if (content.type !== "doc") throw new Error("The document content is invalid.");
  if (!isAllowedMediaUrl(coverImage) || !validateContentImages(content)) throw new Error("Use images from the Media library or existing local portfolio assets.");

  const status: PublishStatus = statusValue === "published" ? "published" : "draft";
  return { type: typeValue, title, slug, excerpt, content, cover_image: coverImage || null, category: category || null, tags, status };
}

export async function saveContent(formData: FormData) {
  const { supabase } = await requireAdmin();
  let content: ReturnType<typeof parseContent>;
  try {
    content = parseContent(formData);
  } catch (error) {
    redirect(`/admin/${field(formData, "type") || "stories"}?error=${encodeURIComponent(error instanceof Error ? error.message : "Invalid content")}`);
  }

  const id = field(formData, "id");
  const { data, error } = id
    ? await supabase.from("content_items").update(content).eq("id", id).select("id,type,slug").single()
    : await supabase.from("content_items").insert(content).select("id,type,slug").single();

  if (error) {
    const message = error.code === "23505" ? "That slug is already in use for this content type." : error.message;
    redirect(`/admin/${content.type}?error=${encodeURIComponent(message)}`);
  }

  const kind = data.type as ContentType;
  updateTag("published-content");
  revalidatePath("/");
  revalidatePath(`/${contentCollectionPath(kind)}`);
  revalidatePath(contentPath(kind, data.slug));
  redirect(`/admin/${content.type}?saved=1`);
}

export async function deleteContent(formData: FormData) {
  const { supabase } = await requireAdmin();
  const id = field(formData, "id");
  const type = field(formData, "type");
  if (!id || !isContentType(type)) redirect("/admin/dashboard?error=Invalid item");

  const { data: item } = await supabase.from("content_items").select("slug,type").eq("id", id).maybeSingle();
  const { error } = await supabase.from("content_items").delete().eq("id", id);
  if (error) redirect(`/admin/${type}?error=${encodeURIComponent(error.message)}`);

  updateTag("published-content");
  revalidatePath("/");
  revalidatePath(`/${contentCollectionPath(type)}`);
  if (item?.slug) revalidatePath(contentPath(type, item.slug));
  redirect(`/admin/${type}?deleted=1`);
}
