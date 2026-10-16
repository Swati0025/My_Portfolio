import { BriefcaseBusiness, Camera, Mail } from "lucide-react";
import { ContactForm } from "./contact-form";
import { Reveal } from "@/components/scroll-reveal";
import { getWriterProfile } from "@/lib/cms/data";

export async function ContactSection() {
  const profile = await getWriterProfile();
  const email = profile?.email && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(profile.email) ? profile.email : "sharma.swati2673@gmail.com";
  const socialLinks = profile?.social_links ?? {};
  const instagram = typeof socialLinks.instagram === "string" && socialLinks.instagram.startsWith("https://") ? socialLinks.instagram : "https://instagram.com/dazeddd_serene?dlrf=b215azN4cTQyN2kw";
  const linkedin = typeof socialLinks.linkedin === "string" && socialLinks.linkedin.startsWith("https://") ? socialLinks.linkedin : "https://www.linkedin.com/in/swati-sharma-6a6620296";
  return (
    <section className="contact-section" id="contact" aria-labelledby="contact-title">
      <div className="contact-inner content-width">
        <Reveal className="contact-copy">
          <p className="eyebrow">Every conversation begins with a word</p>
          <h2 id="contact-title">Write With Me</h2>
          <p>Have a story to share, a book to recommend, or a creative idea in mind? I’d love to hear from you.</p>
          <a className="contact-email" href={`mailto:${email}`}><Mail aria-hidden="true" /> {email}</a>
          <nav aria-label="Contact and social links" className="contact-social-links">
            <a aria-label="Instagram (opens in a new tab)" href={instagram} rel="noreferrer" target="_blank"><Camera aria-hidden="true" /><span>Instagram</span></a>
            <a aria-label="LinkedIn (opens in a new tab)" href={linkedin} rel="noreferrer" target="_blank"><BriefcaseBusiness aria-hidden="true" /><span>LinkedIn</span></a>
          </nav>
          <p className="contact-signoff">Here’s to words that bring us closer.</p>
        </Reveal>
        <ContactForm />
      </div>
    </section>
  );
}