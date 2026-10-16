"use server";

import { revalidatePath, updateTag } from "next/cache";
import { redirect } from "next/navigation";
import { requireAdmin } from "./auth";
import { isAllowedMediaUrl } from "./media-validation";

export async function saveProfile(formData: FormData) {
  const { supabase } = await requireAdmin();
  const displayName = String(formData.get("display_name") ?? "").trim();
  const biography = String(formData.get("biography") ?? "").trim();
  const profileImage = String(formData.get("profile_image") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim();
  const instagram = String(formData.get("instagram") ?? "").trim();
  const linkedin = String(formData.get("linkedin") ?? "").trim();
  const substack = String(formData.get("substack") ?? "").trim();
  if (!displayName || displayName.length > 100) redirect("/admin/settings?error=Name%20is%20required%20and%20must%20be%20under%20100%20characters");
  if (biography.length > 3000) redirect("/admin/settings?error=Biography%20must%20be%20under%203000%20characters");
  if (!isAllowedMediaUrl(profileImage)) redirect("/admin/settings?error=Use%20an%20image%20from%20the%20Media%20library%20or%20an%20existing%20portfolio%20asset");

  const { error } = await supabase.from("writer_profile").upsert({
    id: true,
    display_name: displayName,
    biography,
    profile_image: profileImage || null,
    email: email || null,
    social_links: { instagram, linkedin, substack },
  }, { onConflict: "id" });
  if (error) redirect(`/admin/settings?error=${encodeURIComponent(error.message)}`);
  updateTag("writer-profile");
  revalidatePath("/");
  revalidatePath("/admin/settings");
  redirect("/admin/settings?saved=1");
}
