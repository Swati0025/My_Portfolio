import { notFound } from "next/navigation";
import { Suspense } from "react";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { PublicContentPage } from "@/components/cms/public-content-page";
import { getPublishedContentBySlug } from "@/lib/cms/data";

async function StoryContent({ params }: PageProps<"/stories/[slug]">) {
  const { slug } = await params;
  const story = await getPublishedContentBySlug("story", slug);
  if (!story) notFound();
  return <><SiteHeader /><PublicContentPage item={story} /><SiteFooter /></>;
}

export default function StoryPage(props: PageProps<"/stories/[slug]">) {
  return <Suspense fallback={<main aria-busy="true" className="public-content-page content-width" />}><StoryContent {...props} /></Suspense>;
}
