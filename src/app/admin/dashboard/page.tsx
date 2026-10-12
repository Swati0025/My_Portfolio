import Link from "next/link";
import { Suspense } from "react";
import { connection } from "next/server";
import { ArrowUpRight, BookOpen, FileText, Feather, PenLine, Star } from "lucide-react";
import { AdminShell } from "@/components/cms/admin-shell";
import { AdminNotice } from "@/components/cms/admin-notice";
import { requireAdmin } from "@/lib/cms/auth";
import { contentLabel, contentTypes } from "@/lib/cms/types";
import { AdminLoading } from "@/components/cms/admin-loading";

async function DashboardContent({ searchParams }: PageProps<"/admin/dashboard">) {
  await connection();
  const [{ supabase }, params] = await Promise.all([requireAdmin(), searchParams]);
  const { data: items, error } = await supabase.from("content_items").select("id,type,title,slug,status,updated_at,published_at").order("updated_at", { ascending: false });
  const records = items ?? [];
  const counts = Object.fromEntries(contentTypes.map((type) => [type, records.filter((item) => item.type === type && item.status === "published").length]));
  const drafts = records.filter((item) => item.status === "draft").length;
  const icons = { story: BookOpen, poem: Feather, article: FileText, review: Star };

  return (
    <AdminShell activePath="/admin/dashboard">
      <div className="admin-page-heading"><div><p className="admin-kicker">Writer Studio</p><h1>Overview</h1><p>Your words, all in one place.</p></div><Link className="admin-primary-link" href="/admin/story/new"><PenLine />Write something new</Link></div>
      <AdminNotice searchParams={params} />
      {error && <p className="admin-notice is-error">Could not load dashboard data: {error.message}</p>}
      <section aria-label="Content summary" className="admin-metric-grid">
        {contentTypes.map((type) => { const Icon = icons[type]; return <article className="admin-metric" key={type}><span><Icon aria-hidden="true" />{contentLabel(type)}</span><strong>{counts[type]}</strong><small>Published</small></article>; })}
        <article className="admin-metric"><span><PenLine aria-hidden="true" />Drafts</span><strong>{drafts}</strong><small>Not public</small></article>
      </section>
      <section className="admin-panel">
        <div className="admin-panel-heading"><div><h2>Recently edited</h2><p>Your latest changes across all writing.</p></div><Link href="/admin/story">All writing <ArrowUpRight aria-hidden="true" /></Link></div>
        {records.length ? <div className="admin-table-wrap"><table className="admin-table"><thead><tr><th>Title</th><th>Type</th><th>Status</th><th>Last updated</th></tr></thead><tbody>{records.slice(0, 8).map((item) => <tr key={item.id}><td><Link href={`/admin/${item.type}/${item.id}`}>{item.title}</Link></td><td>{contentLabel(item.type as (typeof contentTypes)[number]).slice(0, -1)}</td><td><span className={`status-pill status-${item.status}`}>{item.status}</span></td><td>{new Date(item.updated_at).toLocaleDateString()}</td></tr>)}</tbody></table></div> : <div className="admin-empty"><PenLine aria-hidden="true" /><h3>Your writing starts here</h3><p>Create a draft or publish a piece to see it in your workspace.</p><Link className="admin-primary-link" href="/admin/story/new">Create your first story</Link></div>}
      </section>
    </AdminShell>
  );
}

export default function AdminDashboardPage(props: PageProps<"/admin/dashboard">) {
  return <Suspense fallback={<AdminLoading />}><DashboardContent {...props} /></Suspense>;
}
