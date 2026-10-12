import Link from "next/link";
import { Suspense } from "react";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { getPublishedContent } from "@/lib/cms/data";
import { contentPath } from "@/lib/cms/types";

async function PoemsContent() {
  const poems = await getPublishedContent("poem");
  return <><SiteHeader /><main className="public-writing-page content-width poem-list-page"><p className="eyebrow">Verse &amp; prose</p><h1>Poems</h1><p className="writing-page-intro">Small moments, held in a few lines.</p>{poems.length ? <div className="poem-list">{poems.map((poem) => <article className="poem-list-item" key={poem.id}><div><p className="eyebrow">{poem.category || "Poem"}</p><h2><Link href={contentPath(poem.type, poem.slug)}>{poem.title}</Link></h2>{poem.excerpt && <p>{poem.excerpt}</p>}</div><Link aria-label={`Read ${poem.title}`} className="text-link" href={contentPath(poem.type, poem.slug)}>Read →</Link></article>)}</div> : <p className="public-writing-empty">New poems are on their way.</p>}</main><SiteFooter /></>;
}

export default function PoemsPage() {
  return <Suspense fallback={<main aria-busy="true" className="public-writing-page content-width"><p className="eyebrow">Verse &amp; prose</p><h1>Poems</h1></main>}><PoemsContent /></Suspense>;
}
