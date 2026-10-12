import Image from "next/image";
import Link from "next/link";
import { Suspense } from "react";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { getPublishedContent } from "@/lib/cms/data";
import { contentPath } from "@/lib/cms/types";

async function BookReviewsContent() {
  const reviews = await getPublishedContent("review");
  return <><SiteHeader /><main className="public-writing-page content-width"><p className="eyebrow">Notes from the TBR pile</p><h1>Book Reviews</h1><p className="writing-page-intro">Honest thoughts on beloved reads — and your next great book.</p>{reviews.length ? <div className="public-writing-grid">{reviews.map((review) => <article className="public-writing-card" key={review.id}>{review.cover_image && <Image alt="" height={210} src={review.cover_image} unoptimized width={320} />}<p className="eyebrow">{review.category || "Book review"}</p><h2><Link href={contentPath(review.type, review.slug)}>{review.title}</Link></h2><p>{review.excerpt}</p><Link className="text-link" href={contentPath(review.type, review.slug)}>Read review →</Link></article>)}</div> : <p className="public-writing-empty">New book reviews are on their way.</p>}</main><SiteFooter /></>;
}

export default function BookReviewsPage() {
  return <Suspense fallback={<main aria-busy="true" className="public-writing-page content-width"><p className="eyebrow">Notes from the TBR pile</p><h1>Book Reviews</h1></main>}><BookReviewsContent /></Suspense>;
}
