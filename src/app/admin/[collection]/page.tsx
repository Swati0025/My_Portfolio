import Link from "next/link";
import { Suspense } from "react";
import { connection } from "next/server";
import { Plus, Search } from "lucide-react";
import { AdminShell } from "@/components/cms/admin-shell";
import { AdminNotice } from "@/components/cms/admin-notice";
import { requireAdmin } from "@/lib/cms/auth";
import { contentLabel, isContentType } from "@/lib/cms/types";
import { AdminLoading } from "@/components/cms/admin-loading";

async function ContentList({ params, searchParams }: PageProps<"/admin/[collection]">) {
  await connection();
  const [{ collection: rawType }, query] = await Promise.all([params, searchParams]);
  if (!isContentType(rawType)) return <div className="admin-error-page">Choose stories, poems, articles, or book reviews from the dashboard.</div>;
  const { supabase } = await requireAdmin();
  let request = supabase.from("content_items").select("id,type,title,slug,excerpt,status,updated_at,published_at").eq("type", rawType).order("updated_at", { ascending: false });
  if (typeof query.q === "string" && query.q.trim()) request = request.ilike("title", `%${query.q.trim().replace(/[%_,]/g, " ")}%`);
  if (query.status === "draft" || query.status === "published") request = request.eq("status", query.status);
  const { data, error } = await request;
  const items = data ?? [];
  const label = contentLabel(rawType);

  return (
    <AdminShell activePath={`/admin/${rawType}`}>
      <div className="admin-page-heading"><div><p className="admin-kicker">Library</p><h1>{label}</h1><p>Manage drafts and published {label.toLowerCase()}.</p></div><Link className="admin-primary-link" href={`/admin/${rawType}/new`}><Plus aria-hidden="true" />New {rawType}</Link></div>
      <AdminNotice searchParams={query} />
      {error && <p className="admin-notice is-error">Could not load {label.toLowerCase()}: {error.message}</p>}
      <form className="admin-filters" method="get">
        <label className="admin-search"><Search aria-hidden="true" /><input aria-label="Search by title" defaultValue={typeof query.q === "string" ? query.q : ""} name="q" placeholder={`Search ${label.toLowerCase()}`} /></label>
        <label className="visually-hidden" htmlFor="content-status">Filter by status</label><select id="content-status" name="status" defaultValue={typeof query.status === "string" ? query.status : "all"}><option value="all">All statuses</option><option value="draft">Drafts</option><option value="published">Published</option></select>
        <button className="admin-secondary-button" type="submit">Filter</button>
      </form>
      {items.length ? <div className="admin-panel admin-table-wrap"><table className="admin-table"><thead><tr><th>Title</th><th>Status</th><th>Published</th><th>Last edited</th><th><span className="visually-hidden">Actions</span></th></tr></thead><tbody>{items.map((item) => <tr key={item.id}><td><Link className="admin-item-title" href={`/admin/${rawType}/${item.id}`}>{item.title}</Link><small>{item.excerpt}</small></td><td><span className={`status-pill status-${item.status}`}>{item.status}</span></td><td>{item.published_at ? new Date(item.published_at).toLocaleDateString() : "—"}</td><td>{new Date(item.updated_at).toLocaleDateString()}</td><td><Link className="admin-row-action" href={`/admin/${rawType}/${item.id}`}>Edit</Link></td></tr>)}</tbody></table></div> : <div className="admin-panel admin-empty"><h2>No {label.toLowerCase()} yet</h2><p>Start a draft to see it in this list. Drafts stay private until published.</p><Link className="admin-primary-link" href={`/admin/${rawType}/new`}><Plus aria-hidden="true" />Create {rawType}</Link></div>}
    </AdminShell>
  );
}

export default function ContentListPage(props: PageProps<"/admin/[collection]">) {
  return <Suspense fallback={<AdminLoading />}><ContentList {...props} /></Suspense>;
}
