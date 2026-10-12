import type { Metadata } from "next";
import { DM_Sans, Lora } from "next/font/google";
import "./globals.css";

const dmSans = DM_Sans({
  variable: "--font-body",
  subsets: ["latin"],
});

const lora = Lora({ variable: "--font-display", subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Swati Sharma | Words that breathe life into thoughts",
  description: "Stories, poems, reflections, and book reviews by Swati Sharma.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${dmSans.variable} ${lora.variable}`}>
      <body suppressHydrationWarning>
        <noscript>
          <style>{`.scroll-reveal-pending { opacity: 1 !important; transform: none !important; } .scroll-reveal-pending .about-image, .scroll-reveal-pending .story-image { clip-path: none !important; }`}</style>
        </noscript>
        {children}
      </body>
    </html>
  );
}
