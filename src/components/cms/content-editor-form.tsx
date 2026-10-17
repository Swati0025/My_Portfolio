"use client";

import Link from "next/link";
import { useState } from "react";
import { useFormStatus } from "react-dom";
import { saveContent, deleteContent } from "@/lib/cms/actions";
import { RichTextEditor } from "./rich-text-editor";
import { ImageFilePicker } from "./image-file-picker";
import { contentCollectionPath, contentSingularLabel, type ContentItem, type ContentType } from "@/lib/cms/types";

const emptyDocument = { type: "doc", content: [{ type: "paragraph" }] };

function slugify(value: string) {
  return value.normalize("NFKD").toLowerCase().replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

function SaveActions({ published }: { published: boolean }) {
  const { pending } = useFormStatus();
  return <><button className="admin-primary-button" disabled={pending} name="status" type="submit" value="draft">{pending ? "Saving…" : "Save draft"}</button><button className="admin-publish-button" disabled={pending} name="status" type="submit" value="published">{pending ? "Saving…" : published ? "Save & publish" : "Publish"}</button></>;
}

export function ContentEditorForm({ type, item }: { type: ContentType; item?: ContentItem }) {
  const [slug, setSlug] = useState(item?.slug ?? "");
  const [slugEdited, setSlugEdited] = useState(false);
  const [title, setTitle] = useState(item?.title ?? "");
  const [coverImage, setCoverImage] = useState(item?.cover_image ?? "");
  const [editorContent, setEditorContent] = useState<Record<string, unknown>>(() => item?.content ?? emptyDocument);
  const [contentJson, setContentJson] = useState<string>(() => JSON.stringify(item?.content ?? emptyDocument));
  const section = contentCollectionPath(type);

  return (
    <form action={saveContent} className="content-editor-form" onSubmit={(event) => {
      const input = event.currentTarget.querySelector<HTMLInputElement>('input[name="content_json"]');
      const nextValue = JSON.stringify(editorContent);
      setContentJson(nextValue);
      if (input) input.value = nextValue;
    }}>
      <input name="id" type="hidden" value={item?.id ?? ""} />
      <input name="type" type="hidden" value={type} />
      <input name="slug" type="hidden" value={slug} />
      <input name="cover_image" type="hidden" value={coverImage} />
      <input name="content_json" type="hidden" value={contentJson} />
      <div className="editor-page-heading"><div><Link className="admin-back-link" href={`/admin/${type}`}>Back to {section.replaceAll("-", " ")}</Link><h1>{item ? "Edit writing" : `New ${contentSingularLabel(type)}`}</h1><p>Save drafts freely. Published work appears on your public portfolio.</p></div></div>
      <div className="editor-layout">
        <div className="editor-primary">
          <label className="admin-field">Title<input autoComplete="off" maxLength={180} name="title" onChange={(event) => { setTitle(event.target.value); if (!slugEdited) setSlug(slugify(event.target.value)); }} placeholder="Give this piece a title" required value={title} /></label>
          <label className="admin-field">URL slug<div className="slug-input"><span>/</span><input onChange={(event) => { setSlug(event.target.value); setSlugEdited(true); }} pattern="[a-z0-9]+(?:-[a-z0-9]+)*" required value={slug} /></div><small>Lowercase letters, numbers, and hyphens.</small></label>
          <label className="admin-field">Excerpt<textarea maxLength={400} name="excerpt" placeholder="A short introduction for the listing page" rows={3} defaultValue={item?.excerpt ?? ""} /></label>
          <div className="admin-field"><span>Writing</span><RichTextEditor key={item?.id ?? "new-content"} initialContent={editorContent} onChange={(nextContent) => {
            setEditorContent(nextContent);
            setContentJson(JSON.stringify(nextContent));
          }} /></div>
        </div>
        <aside className="editor-settings">
          <h2>Publish settings</h2>
          <p className="current-status">Current status <span className={`status-pill status-${item?.status ?? "draft"}`}>{item?.status ?? "draft"}</span></p>
          <div className="admin-field"><span>Cover image</span><ImageFilePicker label="Cover image" onChange={setCoverImage} value={coverImage} /></div>
          <label className="admin-field">Category<input name="category" placeholder={type === "poem" ? "e.g. Hope, Nature" : "e.g. Fiction, Personal"} defaultValue={item?.category ?? ""} /></label>
          <label className="admin-field">Tags<input name="tags" placeholder="Separate tags with commas" defaultValue={item?.tags.join(", ") ?? ""} /></label>
          {item?.published_at && <p className="admin-date">Published {new Date(item.published_at).toLocaleDateString()}</p>}
          {item && <Link className="admin-secondary-button" href={`/admin/preview/${item.id}`}>Preview</Link>}
          <SaveActions published={item?.status === "published"} />
        </aside>
      </div>
    </form>
  );
}

export function DeleteContentForm({ item }: { item: ContentItem }) {
  return <form action={deleteContent} onSubmit={(event) => { if (!window.confirm(`Delete “${item.title}”? This cannot be undone.`)) event.preventDefault(); }}><input name="id" type="hidden" value={item.id} /><input name="type" type="hidden" value={item.type} /><button className="admin-danger-button" type="submit">Delete</button></form>;
}
