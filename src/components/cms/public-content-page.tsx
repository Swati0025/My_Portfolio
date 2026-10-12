import Image from "next/image";
import Link from "next/link";
import { ContentRenderer } from "./content-renderer";
import { contentCollectionPath, contentLabel, contentPath, type ContentItem } from "@/lib/cms/types";

export function PublicContentPage({ item }: { item: ContentItem }) {
  return (
    <main className={`public-content-page content-width${item.type === "poem" ? " public-poem-page" : ""}`}>
      <Link className="public-content-back" href={`/${contentCollectionPath(item.type)}`}>← All {contentLabel(item.type).toLowerCase()}</Link>
      <article>
        <header className="public-content-heading"><p className="eyebrow">{item.category || contentLabel(item.type).slice(0, -1)}{item.published_at ? ` · ${new Date(item.published_at).toLocaleDateString("en", { year: "numeric", month: "long", day: "numeric" })}` : ""}</p><h1>{item.title}</h1>{item.excerpt && <p className="public-content-excerpt">{item.excerpt}</p>}</header>
        {item.cover_image && <div className="public-content-cover"><Image alt="" height={420} src={item.cover_image} unoptimized width={1200} /></div>}
        <ContentRenderer content={item.content} poem={item.type === "poem"} />
        {item.tags.length > 0 && <ul aria-label="Tags" className="public-content-tags">{item.tags.map((tag) => <li key={tag}>{tag}</li>)}</ul>}
      </article>
      <Link className="public-content-more" href={contentPath(item.type, item.slug)}>Share this piece</Link>
    </main>
  );
}
