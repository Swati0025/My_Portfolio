import { Reveal } from "@/components/scroll-reveal";
import Link from "next/link";
import { BriefcaseBusiness, Camera } from "lucide-react";
import { getWriterProfile } from "@/lib/cms/data";

const exploreLinks = [
  ["Home", "/"], ["Portfolio", "/#about"], ["Stories", "/stories"],
  ["Poems", "/poems"], ["Articles", "/articles"], ["Book Reviews", "/book-reviews"], ["Contact", "/#contact"],
];

export async function SiteFooter() {
  const profile = await getWriterProfile();
  const socialLinks = profile?.social_links ?? {};
  const socials = [
    ["Instagram", typeof socialLinks.instagram === "string" && socialLinks.instagram.startsWith("https://") ? socialLinks.instagram : "https://instagram.com/dazeddd_serene?dlrf=b215azN4cTQyN2kw"],
    ["LinkedIn", typeof socialLinks.linkedin === "string" && socialLinks.linkedin.startsWith("https://") ? socialLinks.linkedin : "https://www.linkedin.com/in/swati-sharma-6a6620296"],
    ["Substack", socialLinks.substack],
  ].filter((entry): entry is [string, string] => typeof entry[1] === "string" && entry[1].startsWith("https://"));
  return (
    <footer className="site-footer">
      <div className="footer-inner content-width">
        <Reveal className="footer-top">
          <div className="footer-brand"><Link href="/">{profile?.display_name || "Swati Sharma"}</Link><p>A life in stories. A heart full of books.</p></div>
          <div className="footer-nav-group"><p className="eyebrow">Explore</p><nav aria-label="Footer navigation">{exploreLinks.map(([label, href]) => <Link href={href} key={label}>{label}</Link>)}</nav></div>
          {socials.length > 0 && <div className="footer-nav-group footer-socials"><p className="eyebrow">Elsewhere</p><nav aria-label="Social links">{socials.map(([label, href]) => <a href={href} key={label} rel="noreferrer" target="_blank">{label === "Instagram" ? <Camera aria-hidden="true" /> : label === "LinkedIn" ? <BriefcaseBusiness aria-hidden="true" /> : label === "Substack" ? <svg aria-hidden="true" fill="#FF6719" viewBox="0 0 24 24"><path d="M22.539 8.242H1.46V5.406h21.08v2.836zM1.46 10.812V24L12 18.11 22.54 24V10.812H1.46zM22.54 0H1.46v2.836h21.08V0z" /></svg> : null}{label}</a>)}</nav></div>}
        </Reveal>
        <Reveal className="footer-bottom"><p>© 2026 Swati Sharma. All words, lovingly written.</p><p>Made for the love of words.</p></Reveal>
      </div>
    </footer>
  );
}