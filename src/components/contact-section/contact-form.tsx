"use client";

import { FormEvent, useState } from "react";
import { ArrowUpRight } from "lucide-react";
import { Reveal } from "@/components/scroll-reveal";

export function ContactForm({ recipient }: { recipient: string }) {
  const [status, setStatus] = useState("");

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const name = String(form.get("name") ?? "");
    const email = String(form.get("email") ?? "");
    const message = String(form.get("message") ?? "");
    const subject = encodeURIComponent(`A note from ${name}`);
    const body = encodeURIComponent(`${message}\n\nFrom ${name} (${email})`);
    window.location.href = `mailto:${recipient}?subject=${subject}&body=${body}`;
    setStatus("Your email app is ready with your note.");
    event.currentTarget.reset();
  }

  return (
    <Reveal as="form" className="contact-form" onSubmit={handleSubmit}>
      <div className="form-fields">
        <label>Your name<input autoComplete="name" name="name" placeholder="What should I call you?" required /></label>
        <label>Email address<input autoComplete="email" name="email" placeholder="you@example.com" required type="email" /></label>
      </div>
      <label className="message-field">Your message<textarea name="message" placeholder="Tell me what’s on your mind..." required rows={4} /></label>
      <div className="form-bottom"><p aria-live="polite">{status || "Just a conversation. Your details stay private."}</p><button className="button button-paper" type="submit">Send Message <ArrowUpRight aria-hidden="true" /></button></div>
    </Reveal>
  );
}