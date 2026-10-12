import Link from "next/link";
import Image from "next/image";
import { Suspense } from "react";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { getPublishedContent } from "@/lib/cms/data";
import { contentPath } from "@/lib/cms/types";

async function ArticlesContent() {
  const articles = await getPublishedContent("article");
  return <><SiteHeader /><main className="public-writing-page content-width"><p className="eyebrow">Personal essays</p><h1>Articles &amp; Reflections</h1><p className="writing-page-intro">Notes on becoming, belonging, and the in-between.</p>{articles.length ? <div className="public-writing-grid">{articles.map((article) => <article className="public-writing-card" key={article.id}>{article.cover_image && <Image alt="" height={210} src={article.cover_image} width={320} />}<p className="eyebrow">{article.category || "Article"}</p><h2><Link href={contentPath(article.type, article.slug)}>{article.title}</Link></h2><p>{article.excerpt}</p><Link className="text-link" href={contentPath(article.type, article.slug)}>Read article →</Link></article>)}</div> : <p className="public-writing-empty">New essays are on their way.</p>}</main><SiteFooter /></>;
}

export default function ArticlesPage() {
  return <Suspense fallback={<main aria-busy="true" className="public-writing-page content-width"><p className="eyebrow">Personal essays</p><h1>Articles &amp; Reflections</h1></main>}><ArticlesContent /></Suspense>;
}
