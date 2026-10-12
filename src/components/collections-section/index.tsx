import { ArrowUpRight, BookOpen, Feather, Library, Sun } from "lucide-react";
import { Reveal } from "@/components/scroll-reveal";

const collections = [
  { icon: BookOpen, category: "Fiction", title: "Stories", text: "Imagined lives, familiar feelings. Stories that stay a little longer.", count: "Stories", href: "/stories" },
  { icon: Feather, category: "Verse & prose", title: "Poems", text: "Small moments, held in a few lines. For the things we cannot say.", count: "Poems", href: "/poems" },
  { icon: Sun, category: "Personal essays", title: "Reflections", text: "Notes on becoming, belonging, and the beautiful in-between.", count: "Articles", href: "/articles" },
  { icon: Library, category: "Recommendations", title: "Book reviews", text: "Honest thoughts on beloved reads — and your next great book.", count: "Book Reviews", href: "/book-reviews" },
];

export function CollectionsSection() {
  return (
    <section className="collections-section" id="collections" aria-labelledby="collections-title">
      <div className="content-width">
        <Reveal as="header" className="section-heading">
          <p className="eyebrow">Many moods. One love for words.</p>
          <h2 id="collections-title">My Written Collections</h2>
          <p>Find something for the reader in you.</p>
        </Reveal>
        <div className="collection-grid">
          {collections.map(({ icon: Icon, category, title, text, count, href }) => (
            <Reveal as="a" className="collection-card" href={href} key={title}>
              <span className="collection-icon"><Icon aria-hidden="true" /></span>
              <span className="eyebrow">{category}</span>
              <span className="collection-title">{title}</span>
              <span className="collection-description">{text}</span>
              <span className="collection-footer">{count}<span className="round-arrow"><ArrowUpRight aria-hidden="true" /></span></span>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}