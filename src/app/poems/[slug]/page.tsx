import { notFound } from "next/navigation";
import { Suspense } from "react";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { PublicContentPage } from "@/components/cms/public-content-page";
import { getPublishedContentBySlug } from "@/lib/cms/data";

async function PoemContent({ params }: PageProps<"/poems/[slug]">) {
  const { slug } = await params;
  const poem = await getPublishedContentBySlug("poem", slug);
  if (!poem) notFound();
  return <><SiteHeader /><PublicContentPage item={poem} /><SiteFooter /></>;
}

export default function PoemPage(props: PageProps<"/poems/[slug]">) {
  return <Suspense fallback={<main aria-busy="true" className="public-content-page content-width" />}><PoemContent {...props} /></Suspense>;
}
