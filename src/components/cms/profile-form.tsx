"use client";

import { useState } from "react";
import { saveProfile } from "@/lib/cms/profile-actions";
import type { WriterProfile } from "@/lib/cms/types";
import { ImageFilePicker } from "./image-file-picker";

export function ProfileForm({ profile }: { profile: WriterProfile }) {
  const [profileImage, setProfileImage] = useState(profile.profile_image ?? "");
  const social = profile.social_links ?? {};
  return (
    <form action={saveProfile} className="profile-form">
      <label className="admin-field">Display name<input autoComplete="name" maxLength={100} name="display_name" required defaultValue={profile.display_name} /></label>
      <label className="admin-field">Biography<textarea maxLength={3000} name="biography" rows={7} defaultValue={profile.biography} /></label>
      <div className="admin-field"><span>Profile image</span><ImageFilePicker compact label="Profile image" onChange={setProfileImage} value={profileImage} /></div>
      <input name="profile_image" type="hidden" value={profileImage} />
      <label className="admin-field">Contact email<input autoComplete="email" name="email" type="email" defaultValue={profile.email ?? "sharma.swati2673@gmail.com"} /></label>
      <label className="admin-field">Instagram URL<input name="instagram" type="url" defaultValue={typeof social.instagram === "string" ? social.instagram : "https://instagram.com/dazeddd_serene?dlrf=b215azN4cTQyN2kw"} /></label>
      <label className="admin-field">LinkedIn URL<input name="linkedin" type="url" defaultValue={typeof social.linkedin === "string" ? social.linkedin : "https://www.linkedin.com/in/swati-sharma-6a6620296"} /></label>
      <label className="admin-field">Substack URL<input name="substack" type="url" defaultValue={typeof social.substack === "string" ? social.substack : ""} /></label>
      <button className="admin-primary-button" type="submit">Save profile</button>
    </form>
  );
}
