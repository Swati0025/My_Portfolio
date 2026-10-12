"use server";

import { redirect } from "next/navigation";
import { hasSupabaseConfig } from "@/lib/supabase/config";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export async function signInAdmin(formData: FormData) {
  if (!hasSupabaseConfig()) redirect("/admin/login?setup=required");
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  const requestedPath = String(formData.get("next") ?? "");
  if (!email || !password) redirect("/admin/login?error=Enter%20your%20email%20and%20password");

  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error || !data.user) redirect("/admin/login?error=Sign-in%20failed.%20Check%20your%20credentials.");

  const { data: admin } = await supabase.from("admin_users").select("user_id").eq("user_id", data.user.id).maybeSingle();
  if (!admin) {
    await supabase.auth.signOut();
    redirect("/admin/login?access=denied");
  }

  const destination = requestedPath.startsWith("/admin/") && !requestedPath.startsWith("/admin/login")
    ? requestedPath
    : "/admin/dashboard";
  redirect(destination);
}

export async function signOutAdmin() {
  if (hasSupabaseConfig()) {
    const supabase = await createSupabaseServerClient();
    await supabase.auth.signOut();
  }
  redirect("/admin/login");
}
