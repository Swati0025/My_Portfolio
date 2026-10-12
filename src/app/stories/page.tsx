import Link from "next/link";
import Image from "next/image";
import { Suspense } from "react";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { getPublishedContent } from "@/lib/cms/data";
import { contentPath } from "@/lib/cms/types";

async function StoriesContent() {
  const stories = await getPublishedContent("story");
  return <><SiteHeader /><main className="public-writing-page content-width"><p className="eyebrow">From the notebook</p><h1>Stories</h1><p className="writing-page-intro">Fiction, fragments, and the lives we imagine.</p>{stories.length ? <div className="public-writing-grid">{stories.map((story) => <article className="public-writing-card" key={story.id}>{story.cover_image && <Image alt="" height={210} src={story.cover_image} width={320} />}<p className="eyebrow">{story.category || "Story"}</p><h2><Link href={contentPath(story.type, story.slug)}>{story.title}</Link></h2><p>{story.excerpt}</p><Link className="text-link" href={contentPath(story.type, story.slug)}>Read story →</Link></article>)}</div> : <p className="public-writing-empty">New stories are on their way.</p>}</main><SiteFooter /></>;
}

export default function StoriesPage() {
  return <Suspense fallback={<main aria-busy="true" className="public-writing-page content-width"><p className="eyebrow">From the notebook</p><h1>Stories</h1></main>}><StoriesContent /></Suspense>;
}
