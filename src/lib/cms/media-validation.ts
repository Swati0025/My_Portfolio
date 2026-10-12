export function isAllowedMediaUrl(value: string) {
  if (!value) return true;
  if (value.startsWith("/images/") && !value.startsWith("//")) return true;
  const projectUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  if (!projectUrl) return false;
  try {
    const candidate = new URL(value);
    const project = new URL(projectUrl);
    return candidate.origin === project.origin && candidate.pathname.startsWith("/storage/v1/object/public/writer-media/");
  } catch {
    return false;
  }
}

export function validateContentImages(node: unknown): boolean {
  if (!node || typeof node !== "object") return true;
  const value = node as { type?: unknown; attrs?: { src?: unknown }; content?: unknown[] };
  if (value.type === "image" && (typeof value.attrs?.src !== "string" || !isAllowedMediaUrl(value.attrs.src))) return false;
  return !Array.isArray(value.content) || value.content.every(validateContentImages);
}