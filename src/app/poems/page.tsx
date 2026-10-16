import Link from "next/link";
import { Suspense } from "react";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { getPublishedContentPage } from "@/lib/cms/data";
import { contentPath } from "@/lib/cms/types";
import { PublicPagination } from "@/components/cms/public-pagination";

type PoemsPageProps = { searchParams: Promise<{ page?: string | string[] }> };

async function PoemsContent({ searchParams }: PoemsPageProps) {
  const params = await searchParams;
  const requestedPage = Number(Array.isArray(params.page) ? params.page[0] : params.page) || 1;
  const { items: poems, page, totalPages } = await getPublishedContentPage("poem", requestedPage);
  return <><SiteHeader /><main className="public-writing-page content-width poem-list-page"><p className="eyebrow">Verse &amp; prose</p><h1>Poems</h1><p className="writing-page-intro">Small moments, held in a few lines.</p>{poems.length ? <div className="poem-list">{poems.map((poem) => <article className="poem-list-item" key={poem.id}><div><p className="eyebrow">{poem.category || "Poem"}</p><h2><Link href={contentPath(poem.type, poem.slug)}>{poem.title}</Link></h2>{poem.excerpt && <p>{poem.excerpt}</p>}</div><Link aria-label={`Read ${poem.title}`} className="text-link" href={contentPath(poem.type, poem.slug)}>Read →</Link></article>)}</div> : <p className="public-writing-empty">New poems are on their way.</p>}<PublicPagination page={page} totalPages={totalPages} /></main><SiteFooter /></>;
}

export default function PoemsPage(props: PoemsPageProps) {
  return <Suspense fallback={<main aria-busy="true" className="public-writing-page content-width"><p className="eyebrow">Verse &amp; prose</p><h1>Poems</h1></main>}><PoemsContent searchParams={props.searchParams} /></Suspense>;
}
