import { createClient } from "@supabase/supabase-js";
import { cacheLife, cacheTag } from "next/cache";
import { getSupabaseConfig, hasSupabaseConfig } from "@/lib/supabase/config";
import type { ContentItem, ContentType, WriterProfile } from "./types";

export async function getPublishedContent(type?: ContentType, limit?: number) {
  "use cache";
  cacheLife("hours");
  cacheTag("published-content");
  if (!hasSupabaseConfig()) return [] as ContentItem[];
  const { url, anonKey } = getSupabaseConfig();
  const supabase = createClient(url, anonKey, { auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false } });
  let query = supabase
    .from("content_items")
    .select("id,type,title,slug,excerpt,content,cover_image,category,tags,status,created_at,updated_at,published_at")
    .eq("status", "published")
    .order("published_at", { ascending: false });
  if (type) query = query.eq("type", type);
  if (limit) query = query.limit(limit);
  const { data, error } = await query;
  if (error) {
    console.error("Public content query failed:", error.message);
    return [] as ContentItem[];
  }
  return (data ?? []) as ContentItem[];
}

export async function getPublishedContentBySlug(type: ContentType, slug: string) {
  "use cache";
  cacheLife("hours");
  cacheTag("published-content");
  if (!hasSupabaseConfig()) return null;
  const { url, anonKey } = getSupabaseConfig();
  const supabase = createClient(url, anonKey, { auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false } });
  const { data, error } = await supabase
    .from("content_items")
    .select("id,type,title,slug,excerpt,content,cover_image,category,tags,status,created_at,updated_at,published_at")
    .eq("type", type)
    .eq("slug", slug)
    .eq("status", "published")
    .maybeSingle();
  if (error) {
    console.error("Public content query failed:", error.message);
    return null;
  }
  return data as ContentItem | null;
}

export async function getWriterProfile() {
  "use cache";
  cacheLife("hours");
  cacheTag("writer-profile");
  if (!hasSupabaseConfig()) return null;
  const { url, anonKey } = getSupabaseConfig();
  const supabase = createClient(url, anonKey, { auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false } });
  const { data, error } = await supabase
    .from("writer_profile")
    .select("id,display_name,biography,profile_image,email,social_links,updated_at")
    .eq("id", true)
    .maybeSingle();
  if (error) {
    console.error("Public profile query failed:", error.message);
    return null;
  }
  return data as WriterProfile | null;
}
