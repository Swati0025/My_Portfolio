import Link from "next/link";
import { Suspense } from "react";
import { redirect } from "next/navigation";
import { connection } from "next/server";
import { Feather } from "lucide-react";
import { AdminNotice } from "@/components/cms/admin-notice";
import { signInAdmin } from "@/lib/cms/auth-actions";
import { getAdminContext } from "@/lib/cms/auth";

async function AdminLogin({ searchParams }: PageProps<"/admin/login">) {
  await connection();
  const params = await searchParams;
  const context = await getAdminContext();
  if (context.isAdmin) redirect("/admin/dashboard");
  const needsSetup = !context.configured || params.setup === "required";
  const needsMigration = context.configured && !context.schemaReady;
  return (
    <main className="admin-login-page">
      <Link className="login-home-link" href="/">← Back to portfolio</Link>
      <section className="admin-login-panel">
        <Link className="admin-brand login-brand" href="/"><Feather aria-hidden="true" /><span>Writer Studio<small>Private workspace</small></span></Link>
        <h1>Welcome back</h1>
        <p>Sign in to manage your writing and profile.</p>
        <AdminNotice searchParams={params} />
        {needsSetup || needsMigration ? (
          <div className="setup-message"><strong>{needsMigration ? "CMS database migration required" : "Supabase setup required"}</strong><p>{needsMigration ? <>The Supabase project is reachable, but its CMS tables are missing. Run <code>supabase/migrations/202610110001_writer_cms.sql</code> in the Supabase SQL Editor. Then create an Auth user and add its ID to <code>public.admin_users</code>.</> : <>Copy <code>.env.example</code> to <code>.env.local</code> and configure the project URL plus publishable/anon key. Apply <code>supabase/migrations/202610110001_writer_cms.sql</code>, create an Auth user, then add that user to <code>public.admin_users</code>.</>} Full steps are in the project README.</p></div>
        ) : params.access === "denied" ? (
          <p className="admin-notice is-error">This account is not authorized for the admin workspace.</p>
        ) : (
          <form action={signInAdmin} className="admin-login-form">
            <input name="next" type="hidden" value={typeof params.next === "string" ? params.next : ""} />
            <label className="admin-field">Email<input autoComplete="username" name="email" required type="email" /></label>
            <label className="admin-field">Password<input autoComplete="current-password" name="password" required type="password" /></label>
            <button className="admin-primary-button" type="submit">Sign in</button>
          </form>
        )}
      </section>
    </main>
  );
}

export default function AdminLoginPage(props: PageProps<"/admin/login">) {
  return <Suspense fallback={<main className="admin-login-page"><p>Loading sign-in…</p></main>}><AdminLogin {...props} /></Suspense>;
}
