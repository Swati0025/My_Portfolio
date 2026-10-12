export function AdminNotice({ searchParams }: { searchParams: Record<string, string | string[] | undefined> }) {
  const error = searchParams.error;
  const message = searchParams.saved ? "Changes saved." : searchParams.deleted ? "Item deleted." : searchParams.uploaded ? "Image uploaded." : Array.isArray(error) ? error[0] : error;
  if (!message) return null;
  let readableMessage = String(message);
  try { readableMessage = decodeURIComponent(readableMessage.replaceAll("+", " ")); } catch { /* Keep the original query value. */ }
  return <p aria-live="polite" className={`admin-notice${error ? " is-error" : ""}`}>{readableMessage}</p>;
}
