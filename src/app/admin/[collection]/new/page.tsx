import { notFound } from "next/navigation";
import { Suspense } from "react";
import { connection } from "next/server";
import { AdminShell } from "@/components/cms/admin-shell";
import { ContentEditorForm } from "@/components/cms/content-editor-form";
import { requireAdmin } from "@/lib/cms/auth";
import { isContentType } from "@/lib/cms/types";
import { AdminLoading } from "@/components/cms/admin-loading";

async function NewContent({ params }: PageProps<"/admin/[collection]/new">) {
  await connection();
  await requireAdmin();
  const { collection } = await params;
  if (!isContentType(collection)) notFound();
  return <AdminShell activePath={`/admin/${collection}`}><ContentEditorForm type={collection} /></AdminShell>;
}

export default function NewContentPage(props: PageProps<"/admin/[collection]/new">) {
  return <Suspense fallback={<AdminLoading />}><NewContent {...props} /></Suspense>;
}
