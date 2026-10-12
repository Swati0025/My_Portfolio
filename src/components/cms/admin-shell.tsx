import Link from "next/link";
import { BookOpen, FileText, LayoutDashboard, LogOut, Settings, Image as ImageIcon, Feather, Star } from "lucide-react";
import { signOutAdmin } from "@/lib/cms/auth-actions";
import type { ReactNode } from "react";

const links = [
  { href: "/admin/dashboard", label: "Overview", icon: LayoutDashboard },
  { href: "/admin/story", label: "Stories", icon: BookOpen },
  { href: "/admin/poem", label: "Poems", icon: Feather },
  { href: "/admin/article", label: "Articles", icon: FileText },
  { href: "/admin/review", label: "Book reviews", icon: Star },
  { href: "/admin/media", label: "Media library", icon: ImageIcon },
  { href: "/admin/settings", label: "Profile settings", icon: Settings },
];

export function AdminShell({ children, activePath }: { children: ReactNode; activePath?: string }) {
  return (
    <div className="admin-app">
      <aside className="admin-sidebar">
        <Link className="admin-brand" href="/admin/dashboard"><Feather aria-hidden="true" /><span>Writer Studio<small>Swati Sharma</small></span></Link>
        <nav aria-label="Admin navigation" className="admin-nav">
          {links.map(({ href, label, icon: Icon }) => (
            <Link aria-current={activePath === href ? "page" : undefined} className={activePath === href ? "is-active" : ""} href={href} key={href}>
              <Icon aria-hidden="true" />{label}
            </Link>
          ))}
        </nav>
        <form action={signOutAdmin} className="admin-signout"><button type="submit"><LogOut aria-hidden="true" />Sign out</button></form>
      </aside>
      <main className="admin-main">{children}</main>
    </div>
  );
}
