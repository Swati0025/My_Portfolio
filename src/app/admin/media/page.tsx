import Image from "next/image";
import { Suspense } from "react";
import { connection } from "next/server";
import { AdminShell } from "@/components/cms/admin-shell";
import { AdminNotice } from "@/components/cms/admin-notice";
import { DeleteMediaForm, MediaUploadForm } from "@/components/cms/media-upload-form";
import { requireAdmin } from "@/lib/cms/auth";
import { AdminLoading } from "@/components/cms/admin-loading";

async function AdminMediaContent({ searchParams }: PageProps<"/admin/media">) {
  await connection();
  const [{ supabase }, params] = await Promise.all([requireAdmin(), searchParams]);
  const { data, error } = await supabase.storage.from("writer-media").list("", { limit: 100, sortBy: { column: "created_at", order: "desc" } });
  const files = (data ?? []).filter((file) => file.id);
  return (
    <AdminShell activePath="/admin/media">
      <div className="admin-page-heading"><div><p className="admin-kicker">Library</p><h1>Media</h1><p>Images stored in your persistent Supabase media bucket.</p></div></div>
      <AdminNotice searchParams={params} />
      <section className="admin-panel media-upload-panel"><div><h2>Upload an image</h2><p>Use uploaded image URLs in writing covers and your profile settings.</p></div><MediaUploadForm /></section>
      {error && <p className="admin-notice is-error">Could not list media: {error.message}</p>}
      {files.length ? <div className="media-grid">{files.map((file) => {
        const path = file.name;
        const { data: publicData } = supabase.storage.from("writer-media").getPublicUrl(path);
        return <article className="media-card" key={path}><Image alt={file.name} height={220} src={publicData.publicUrl} unoptimized width={320} /><div><strong>{file.name}</strong><a href={publicData.publicUrl} rel="noreferrer" target="_blank">Open image</a><DeleteMediaForm path={path} /></div></article>;
      })}</div> : <div className="admin-panel admin-empty"><h2>Your media library is empty</h2><p>Upload a profile photo or cover image to get started.</p></div>}
    </AdminShell>
  );
}

export default function AdminMediaPage(props: PageProps<"/admin/media">) {
  return <Suspense fallback={<AdminLoading />}><AdminMediaContent {...props} /></Suspense>;
}
