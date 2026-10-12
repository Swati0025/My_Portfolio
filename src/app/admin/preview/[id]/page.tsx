import { notFound } from "next/navigation";
import Link from "next/link";
import { ContentRenderer } from "@/components/cms/content-renderer";
import { requireAdmin } from "@/lib/cms/auth";
import { contentSingularLabel, isContentType, type ContentItem } from "@/lib/cms/types";
import { Suspense } from "react";
import { connection } from "next/server";

async function AdminPreview({ params }: PageProps<"/admin/preview/[id]">) {
  await connection();
  const { id } = await params;
  const { supabase } = await requireAdmin();
  const { data } = await supabase.from("content_items").select("id,type,title,slug,excerpt,content,cover_image,category,tags,status,created_at,updated_at,published_at").eq("id", id).maybeSingle();
  if (!data || !isContentType(data.type)) notFound();
  const item = data as ContentItem;
  return <main className="admin-preview"><Link className="admin-secondary-button" href={`/admin/${item.type}/${item.id}`}>Back to editor</Link><p className="admin-kicker">Private preview · {contentSingularLabel(item.type)}</p><h1>{item.title}</h1>{item.excerpt && <p className="preview-excerpt">{item.excerpt}</p>}<ContentRenderer content={item.content} poem={item.type === "poem"} /></main>;
}

export default function AdminPreviewPage(props: PageProps<"/admin/preview/[id]">) {
  return <Suspense fallback={<main aria-busy="true" className="admin-preview" />}><AdminPreview {...props} /></Suspense>;
}
