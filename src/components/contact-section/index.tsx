import { Mail } from "lucide-react";
import { ContactForm } from "./contact-form";
import { Reveal } from "@/components/scroll-reveal";
import { getWriterProfile } from "@/lib/cms/data";

export async function ContactSection() {
  const profile = await getWriterProfile();
  const email = profile?.email && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(profile.email) ? profile.email : "hello@swatisharma.com";
  return (
    <section className="contact-section" id="contact" aria-labelledby="contact-title">
      <div className="contact-inner content-width">
        <Reveal className="contact-copy">
          <p className="eyebrow">Every conversation begins with a word</p>
          <h2 id="contact-title">Write With Me</h2>
          <p>Have a story to share, a book to recommend, or a creative idea in mind? I’d love to hear from you.</p>
          <a className="contact-email" href={`mailto:${email}`}><Mail aria-hidden="true" /> {email}</a>
          <p className="contact-signoff">Here’s to words that bring us closer.</p>
        </Reveal>
        <ContactForm recipient={email} />
      </div>
    </section>
  );
}