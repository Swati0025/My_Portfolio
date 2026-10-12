import { AdminShell } from "@/components/cms/admin-shell";
import { Suspense } from "react";
import { connection } from "next/server";
import { AdminNotice } from "@/components/cms/admin-notice";
import { ProfileForm } from "@/components/cms/profile-form";
import { requireAdmin } from "@/lib/cms/auth";
import type { WriterProfile } from "@/lib/cms/types";
import { AdminLoading } from "@/components/cms/admin-loading";

const defaultProfile: WriterProfile = { id: true, display_name: "Swati Sharma", biography: "", profile_image: null, email: null, social_links: {}, updated_at: "" };

async function AdminSettings({ searchParams }: PageProps<"/admin/settings">) {
  await connection();
  const [{ supabase }, params] = await Promise.all([requireAdmin(), searchParams]);
  const { data, error } = await supabase.from("writer_profile").select("id,display_name,biography,profile_image,email,social_links,updated_at").eq("id", true).maybeSingle();
  return <AdminShell activePath="/admin/settings"><div className="admin-page-heading"><div><p className="admin-kicker">Public details</p><h1>Profile settings</h1><p>These details are used on your public portfolio.</p></div></div><AdminNotice searchParams={params} />{error && <p className="admin-notice is-error">Could not load profile: {error.message}</p>}<section className="admin-panel settings-panel"><ProfileForm profile={(data as WriterProfile | null) ?? defaultProfile} /></section></AdminShell>;
}

export default function AdminSettingsPage(props: PageProps<"/admin/settings">) {
  return <Suspense fallback={<AdminLoading />}><AdminSettings {...props} /></Suspense>;
}
