import { AboutSection } from "@/components/about-section";
import { CollectionsSection } from "@/components/collections-section";
import { ContactSection } from "@/components/contact-section";
import { HeroSection } from "@/components/hero-section";
import { LatestSection } from "@/components/latest-section";
import { ReviewsSection } from "@/components/reviews-section";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { StatsSection } from "@/components/stats-section";
import { Suspense } from "react";

export default function Home() {
  return (
    <>
      <SiteHeader />
      <main>
        <HeroSection />
        <StatsSection />
        <Suspense fallback={<section aria-hidden="true" className="about-section content-width" />}><AboutSection /></Suspense>
        <CollectionsSection />
        <Suspense fallback={<section aria-hidden="true" className="latest-section" />}><LatestSection /></Suspense>
        <ReviewsSection />
        <Suspense fallback={<section aria-hidden="true" className="contact-section" />}><ContactSection /></Suspense>
      </main>
      <Suspense fallback={<footer aria-hidden="true" className="site-footer" />}><SiteFooter /></Suspense>
    </>
  );
}