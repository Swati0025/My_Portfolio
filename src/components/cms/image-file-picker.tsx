"use client";

import Image from "next/image";
import { useState, type ChangeEvent } from "react";
import { createSupabaseBrowserClient } from "@/lib/supabase/browser";

const allowedTypes = new Set(["image/jpeg", "image/png", "image/webp", "image/avif"]);
const maxFileSize = 5 * 1024 * 1024;
const extensionByType: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/avif": "avif",
};

type ImageFilePickerProps = {
  value: string;
  onChange: (url: string) => void;
  label?: string;
  compact?: boolean;
};

export function ImageFilePicker({ value, onChange, label = "Cover image", compact = false }: ImageFilePickerProps) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  async function handleFileChange(event: ChangeEvent<HTMLInputElement>) {
    const input = event.currentTarget;
    const file = input.files?.[0];
    if (!file) return;
    setError("");

    if (!allowedTypes.has(file.type)) {
      setError("Choose a JPEG, PNG, WebP, or AVIF image.");
      input.value = "";
      return;
    }
    if (file.size > maxFileSize) {
      setError("Images must be 5 MB or smaller.");
      input.value = "";
      return;
    }

    setUploading(true);
    try {
      const supabase = createSupabaseBrowserClient();
      const path = `${crypto.randomUUID()}.${extensionByType[file.type]}`;
      const { error: uploadError } = await supabase.storage
        .from("writer-media")
        .upload(path, file, { contentType: file.type, upsert: false });
      if (uploadError) throw uploadError;

      const { data } = supabase.storage.from("writer-media").getPublicUrl(path);
      onChange(data.publicUrl);
    } catch (uploadError) {
      setError(uploadError instanceof Error ? uploadError.message : "Upload failed. Please try again.");
    } finally {
      setUploading(false);
      input.value = "";
    }
  }

  return (
    <div className={`image-file-picker${compact ? " is-compact" : ""}`}>
      {value && <Image alt={`${label} preview`} className="image-file-preview" height={compact ? 100 : 180} src={value} unoptimized width={compact ? 150 : 270} />}
      <label className="image-file-control">
        <span>{uploading ? "Uploading image…" : value ? "Replace image from device" : "Choose image from device"}</span>
        <input accept="image/jpeg,image/png,image/webp,image/avif" disabled={uploading} onChange={handleFileChange} type="file" />
      </label>
      {uploading && <span aria-live="polite" className="image-upload-status">Uploading to Media library…</span>}
      {error && <span aria-live="polite" className="image-upload-error">{error}</span>}
      {value && <button className="image-remove-button" disabled={uploading} onClick={() => { onChange(""); setError(""); }} type="button">Remove selected image</button>}
      <p className="image-file-hint">JPEG, PNG, WebP, or AVIF · up to 5 MB</p>
    </div>
  );
}
