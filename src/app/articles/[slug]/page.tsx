import { notFound } from "next/navigation";
import { Suspense } from "react";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { PublicContentPage } from "@/components/cms/public-content-page";
import { getPublishedContentBySlug } from "@/lib/cms/data";

async function ArticleContent({ params }: PageProps<"/articles/[slug]">) {
  const { slug } = await params;
  const article = await getPublishedContentBySlug("article", slug);
  if (!article) notFound();
  return <><SiteHeader /><PublicContentPage item={article} /><SiteFooter /></>;
}

export default function ArticlePage(props: PageProps<"/articles/[slug]">) {
  return <Suspense fallback={<main aria-busy="true" className="public-content-page content-width" />}><ArticleContent {...props} /></Suspense>;
}
