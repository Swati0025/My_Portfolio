"use client";

import { deleteMedia, uploadMedia } from "@/lib/cms/media-actions";
import { useFormStatus } from "react-dom";

function UploadButton() {
  const { pending } = useFormStatus();
  return <button className="admin-primary-button" disabled={pending} type="submit">{pending ? "Uploading…" : "Upload image"}</button>;
}

export function MediaUploadForm() {
  return (
    <form action={uploadMedia} className="media-upload-form">
      <label className="admin-field">Choose an image<input accept="image/jpeg,image/png,image/webp,image/avif" name="file" required type="file" /></label>
      <p>JPEG, PNG, WebP, or AVIF. Maximum 5 MB.</p>
      <UploadButton />
    </form>
  );
}

export function DeleteMediaForm({ path }: { path: string }) {
  return <form action={deleteMedia} onSubmit={(event) => { if (!window.confirm("Remove this image from the media library?")) event.preventDefault(); }}><input name="path" type="hidden" value={path} /><button className="admin-danger-button" type="submit">Remove</button></form>;
}
