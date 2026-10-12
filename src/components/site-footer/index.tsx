import { Reveal } from "@/components/scroll-reveal";
import Link from "next/link";
import { getWriterProfile } from "@/lib/cms/data";

const exploreLinks = [
  ["Home", "/"], ["Portfolio", "/#about"], ["Stories", "/stories"],
  ["Poems", "/poems"], ["Articles", "/articles"], ["Book Reviews", "/book-reviews"], ["Contact", "/#contact"],
];

export async function SiteFooter() {
  const profile = await getWriterProfile();
  const socialLinks = profile?.social_links ?? {};
  const socials = [
    ["Instagram", socialLinks.instagram],
    ["Substack", socialLinks.substack],
  ].filter((entry): entry is [string, string] => typeof entry[1] === "string" && entry[1].startsWith("https://"));
  return (
    <footer className="site-footer">
      <div className="footer-inner content-width">
        <Reveal className="footer-top">
          <div className="footer-brand"><Link href="/">{profile?.display_name || "Swati Sharma"}</Link><p>A life in stories. A heart full of books.</p></div>
          <div className="footer-nav-group"><p className="eyebrow">Explore</p><nav aria-label="Footer navigation">{exploreLinks.map(([label, href]) => <Link href={href} key={label}>{label}</Link>)}</nav></div>
          {socials.length > 0 && <div className="footer-nav-group footer-socials"><p className="eyebrow">Elsewhere</p><nav aria-label="Social links">{socials.map(([label, href]) => <a href={href} key={label} rel="noreferrer" target="_blank">{label}</a>)}</nav></div>}
        </Reveal>
        <Reveal className="footer-bottom"><p>© 2026 Swati Sharma. All words, lovingly written.</p><p>Made for the love of words.</p></Reveal>
      </div>
    </footer>
  );
}