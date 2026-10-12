import { notFound } from "next/navigation";
import { Suspense } from "react";
import { connection } from "next/server";
import { AdminShell } from "@/components/cms/admin-shell";
import { ContentEditorForm, DeleteContentForm } from "@/components/cms/content-editor-form";
import { requireAdmin } from "@/lib/cms/auth";
import { isContentType, type ContentItem } from "@/lib/cms/types";
import { AdminLoading } from "@/components/cms/admin-loading";

async function EditContent({ params }: PageProps<"/admin/[collection]/[id]">) {
  await connection();
  const { collection, id } = await params;
  if (!isContentType(collection)) notFound();
  const { supabase } = await requireAdmin();
  const { data, error } = await supabase.from("content_items").select("id,type,title,slug,excerpt,content,cover_image,category,tags,status,created_at,updated_at,published_at").eq("id", id).eq("type", collection).maybeSingle();
  if (error || !data) notFound();
  return <AdminShell activePath={`/admin/${collection}`}><ContentEditorForm item={data as ContentItem} type={collection} /><div className="editor-delete"><DeleteContentForm item={data as ContentItem} /></div></AdminShell>;
}

export default function EditContentPage(props: PageProps<"/admin/[collection]/[id]">) {
  return <Suspense fallback={<AdminLoading />}><EditContent {...props} /></Suspense>;
}
