import type { ReactNode } from "react";
import Image from "next/image";

type Node = { type?: string; text?: string; attrs?: Record<string, unknown>; marks?: Array<{ type?: string; attrs?: Record<string, unknown> }>; content?: Node[] };

function safeHref(value: unknown) {
  if (typeof value !== "string") return undefined;
  try {
    const url = new URL(value, "https://portfolio.invalid");
    return ["http:", "https:", "mailto:"].includes(url.protocol) ? value : undefined;
  } catch {
    return undefined;
  }
}

function renderNodes(nodes: Node[] = [], keyPrefix = "node"): ReactNode[] {
  return nodes.map((node, index) => {
    const key = `${keyPrefix}-${index}`;
    const children = renderNodes(node.content, key);
    const text = node.text ?? "";
    const content = text || children;
    switch (node.type) {
      case "doc": return <div key={key}>{children}</div>;
      case "paragraph": return <p key={key}>{children}</p>;
      case "heading": {
        const level = Number(node.attrs?.level);
        if (level === 1) return <h2 key={key}>{children}</h2>;
        if (level === 3) return <h4 key={key}>{children}</h4>;
        return <h3 key={key}>{children}</h3>;
      }
      case "bulletList": return <ul key={key}>{children}</ul>;
      case "orderedList": return <ol key={key}>{children}</ol>;
      case "listItem": return <li key={key}>{children}</li>;
      case "blockquote": return <blockquote key={key}>{children}</blockquote>;
      case "hardBreak": return <br key={key} />;
      case "image": {
        const src = safeHref(node.attrs?.src);
        if (!src) return null;
        const alt = typeof node.attrs?.alt === "string" ? node.attrs.alt : "";
        return <figure className="written-image" key={key}><Image src={src} alt={alt} height={800} width={1200} unoptimized loading="lazy" /></figure>;
      }
      case "text": {
        return (node.marks ?? []).reduce<ReactNode>((value, mark, markIndex) => {
          if (mark.type === "bold") return <strong key={`${key}-bold-${markIndex}`}>{value}</strong>;
          if (mark.type === "italic") return <em key={`${key}-italic-${markIndex}`}>{value}</em>;
          if (mark.type === "strike") return <s key={`${key}-strike-${markIndex}`}>{value}</s>;
          if (mark.type === "code") return <code key={`${key}-code-${markIndex}`}>{value}</code>;
          if (mark.type === "link") {
            const href = safeHref(mark.attrs?.href);
            return href ? <a href={href} key={`${key}-link-${markIndex}`} rel="noreferrer">{value}</a> : value;
          }
          return value;
        }, content);
      }
      default: return <span key={key}>{children}</span>;
    }
  });
}

export function ContentRenderer({ content, poem = false }: { content: Record<string, unknown>; poem?: boolean }) {
  const document = content as Node;
  return <div className={`written-content${poem ? " written-poem" : ""}`}>{renderNodes(document.content)}</div>;
}
