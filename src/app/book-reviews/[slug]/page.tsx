import { Suspense } from "react";
import { notFound } from "next/navigation";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { PublicContentPage } from "@/components/cms/public-content-page";
import { getPublishedContentBySlug } from "@/lib/cms/data";

async function BookReviewContent({ params }: PageProps<"/book-reviews/[slug]">) {
  const { slug } = await params;
  const review = await getPublishedContentBySlug("review", slug);
  if (!review) notFound();
  return <><SiteHeader /><PublicContentPage item={review} /><SiteFooter /></>;
}

export default function BookReviewPage(props: PageProps<"/book-reviews/[slug]">) {
  return <Suspense fallback={<main aria-busy="true" className="public-content-page content-width" />}><BookReviewContent {...props} /></Suspense>;
}
