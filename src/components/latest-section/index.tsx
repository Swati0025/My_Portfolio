import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import { Reveal } from "@/components/scroll-reveal";
import { getPublishedContent } from "@/lib/cms/data";
import { hasSupabaseConfig } from "@/lib/supabase/config";
import { contentPath } from "@/lib/cms/types";

const stories = [
  { image: "/images/story-home.png", alt: "A quiet home tucked into a leafy lane", type: "Story", words: "1,850 words", title: "The house that remembered", excerpt: "Some homes hold more than our belongings. They hold who we used to be.", date: "Sep 28, 2026" },
  { image: "/images/story-rain.png", alt: "Rain falling softly beyond a window", type: "Poem", words: "240 words", title: "Between the rain & light", excerpt: "A small ode to the skies we carry within us, and the hope that breaks through.", date: "Sep 21, 2026" },
  { image: "/images/story-writing.png", alt: "An open journal beside a warm cup of coffee", type: "Reflection", words: "920 words", title: "The art of starting again", excerpt: "On quiet courage, unfinished chapters, and giving ourselves another chance.", date: "Sep 14, 2026" },
  { image: "/images/story-books.png", alt: "A stack of well-loved books on a linen cover", type: "Book review", words: "780 words", title: "A book to come home to", excerpt: "Why The Namesake still feels like a conversation about belonging.", date: "Sep 07, 2026" },
];

export async function LatestSection() {
  const published = await getPublishedContent(undefined, 4);
  const entries = hasSupabaseConfig()
    ? published.map((item) => ({
        id: item.id,
        image: item.cover_image,
        alt: item.title,
        type: item.type === "story" ? "Story" : item.type === "poem" ? "Poem" : item.type === "review" ? "Book review" : "Article",
        words: item.category || "Writing",
        title: item.title,
        excerpt: item.excerpt,
        date: item.published_at ? new Date(item.published_at).toLocaleDateString("en", { month: "short", day: "2-digit", year: "numeric" }) : "",
        href: contentPath(item.type, item.slug),
      }))
    : stories.map((story) => ({ ...story, id: story.title, href: "#contact" }));

  return (
    <section className="latest-section" id="latest" aria-labelledby="latest-title">
      <div className="content-width">
        <Reveal className="latest-heading">
          <div><p className="eyebrow">Fresh from my notebook</p><h2 id="latest-title">Recent Releases &amp; Readers’ Favorites</h2></div>
          <a className="latest-all-link" href={hasSupabaseConfig() ? "/stories" : "#collections"}>Visit the blog <ArrowUpRight aria-hidden="true" /></a>
        </Reveal>
        {entries.length ? <div className="story-grid">
          {entries.map((story) => (
            <Reveal as="article" className="story-card" key={story.id}>
              {story.image && <Image alt={story.alt} className="story-image" height={205} src={story.image} unoptimized={story.image.startsWith("http")} width={306} />}
              <div className="story-meta"><span>{story.type}</span><span>{story.words}</span></div>
              <h3>{story.title}</h3><p>{story.excerpt}</p>
              <div className="story-footer"><time>{story.date}</time><a href={story.href}>Read <ArrowUpRight aria-hidden="true" /></a></div>
            </Reveal>
          ))}
        </div> : <p className="latest-empty">New writing is on its way.</p>}
        <p className="latest-signoff">For slow mornings, late nights, and all the moments in between.</p>
      </div>
    </section>
  );
}