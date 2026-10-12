import { ArrowUpRight, ChevronDown, Feather } from "lucide-react";
import Link from "next/link";

const links = [
  ["Home", "/"], ["Portfolio", "/#about"], ["Stories", "/stories"],
  ["Poems", "/poems"], ["Book Reviews", "/book-reviews"], ["Reviews", "/#reviews"], ["Contact", "/#contact"],
];

export function SiteHeader() {
  return (
    <header className="site-header">
      <div className="header-inner">
        <Link className="wordmark" href="/" aria-label="Swati Sharma home"><Feather aria-hidden="true" /><span>Swati Sharma</span></Link>
        <nav className="desktop-nav" aria-label="Main navigation">
          {links.map(([label, href], index) => <Link className={index === 0 ? "is-current" : ""} href={href} key={label}>{label}</Link>)}
        </nav>
        <div className="header-actions">
          <Link className="button button-outline header-admin-cta" href="/admin/login">Admin</Link>
          <Link className="button button-olive header-cta" href="/#latest">Read My Blog <ArrowUpRight aria-hidden="true" /></Link>
        </div>
        <details className="site-menu">
          <summary><span>Menu</span><ChevronDown aria-hidden="true" /></summary>
          <nav aria-label="Main navigation">
            {links.map(([label, href]) => <Link className={label === "Home" ? "is-current" : ""} href={href} key={label}>{label}</Link>)}
            <Link className="menu-blog-link" href="/#latest">Read My Blog <ArrowUpRight aria-hidden="true" /></Link>
            <Link className="menu-admin-link" href="/admin/login">Admin</Link>
          </nav>
        </details>
      </div>
    </header>
  );
}