"use client";

import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import Image from "@tiptap/extension-image";
import { Bold, Heading2, ImagePlus, Italic, Link2, List, ListOrdered, Quote, Undo2, Redo2 } from "lucide-react";
import { useEffect } from "react";

type RichTextEditorProps = { initialContent?: Record<string, unknown>; fieldName?: string };

const starterDocument = { type: "doc", content: [{ type: "paragraph" }] };

export function RichTextEditor({ initialContent, fieldName = "content_json" }: RichTextEditorProps) {
  const editor = useEditor({
    immediatelyRender: false,
    extensions: [StarterKit, Link.configure({ openOnClick: false, autolink: true }), Image.configure({ inline: false, allowBase64: false })],
    content: initialContent ?? starterDocument,
    editorProps: { attributes: { class: "rich-editor-content", "aria-label": "Writing content" } },
  });

  useEffect(() => {
    if (!editor) return;
    const input = document.querySelector<HTMLInputElement>(`input[name="${fieldName}"]`);
    if (!input) return;
    const sync = () => { input.value = JSON.stringify(editor.getJSON()); };
    sync();
    editor.on("update", sync);
    return () => { editor.off("update", sync); };
  }, [editor, fieldName]);

  if (!editor) return <div aria-busy="true" className="rich-editor-loading">Preparing editor…</div>;

  const button = (label: string, icon: React.ReactNode, active: boolean, action: () => void) => (
    <button aria-label={label} aria-pressed={active} className={`editor-tool${active ? " is-active" : ""}`} onClick={action} title={label} type="button">{icon}</button>
  );

  return (
    <div className="rich-editor">
      <div aria-label="Text formatting" className="editor-toolbar" role="toolbar">
        {button("Bold", <Bold />, editor.isActive("bold"), () => editor.chain().focus().toggleBold().run())}
        {button("Italic", <Italic />, editor.isActive("italic"), () => editor.chain().focus().toggleItalic().run())}
        {button("Heading", <Heading2 />, editor.isActive("heading"), () => editor.chain().focus().toggleHeading({ level: 2 }).run())}
        {button("Bulleted list", <List />, editor.isActive("bulletList"), () => editor.chain().focus().toggleBulletList().run())}
        {button("Numbered list", <ListOrdered />, editor.isActive("orderedList"), () => editor.chain().focus().toggleOrderedList().run())}
        {button("Quote", <Quote />, editor.isActive("blockquote"), () => editor.chain().focus().toggleBlockquote().run())}
        {button("Add link", <Link2 />, editor.isActive("link"), () => {
          const href = window.prompt("Enter a link URL");
          if (href) editor.chain().focus().setLink({ href }).run();
        })}
        {button("Add image", <ImagePlus />, false, () => {
          const src = window.prompt("Paste the URL of an uploaded media image");
          if (src) editor.chain().focus().setImage({ src, alt: "" }).run();
        })}
        <span className="editor-tool-spacer" />
        {button("Undo", <Undo2 />, false, () => editor.chain().focus().undo().run())}
        {button("Redo", <Redo2 />, false, () => editor.chain().focus().redo().run())}
      </div>
      <EditorContent editor={editor} />
      <p className="editor-hint">Enter starts a new paragraph. Shift+Enter adds a line break, ideal for poetry.</p>
    </div>
  );
}
