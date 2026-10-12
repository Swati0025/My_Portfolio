import { redirect } from "next/navigation";
import { hasSupabaseConfig } from "@/lib/supabase/config";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export async function getAdminContext() {
  if (!hasSupabaseConfig()) return { configured: false, schemaReady: false, user: null, isAdmin: false };

  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  const { error: schemaError } = await supabase
    .from("writer_profile")
    .select("id")
    .eq("id", true)
    .maybeSingle();
  if (schemaError) return { configured: true, schemaReady: false, user, isAdmin: false };
  if (!user) return { configured: true, schemaReady: true, user: null, isAdmin: false };

  const { data: admin } = await supabase
    .from("admin_users")
    .select("user_id")
    .eq("user_id", user.id)
    .maybeSingle();

  return { configured: true, schemaReady: true, user, isAdmin: Boolean(admin) };
}

export async function requireAdmin() {
  const context = await getAdminContext();
  if (!context.configured) redirect("/admin/login?setup=required");
  if (!context.schemaReady) redirect("/admin/login?schema=required");
  if (!context.user) redirect("/admin/login");
  if (!context.isAdmin) redirect("/admin/login?access=denied");
  return { user: context.user, supabase: await createSupabaseServerClient() };
}
