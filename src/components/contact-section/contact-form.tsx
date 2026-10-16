"use client";

import { FormEvent, useState } from "react";
import { ArrowUpRight } from "lucide-react";
import { Reveal } from "@/components/scroll-reveal";

export function ContactForm() {
  const [status, setStatus] = useState("");
  const [isSending, setIsSending] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (isSending) return;
    const formElement = event.currentTarget;
    const form = new FormData(event.currentTarget);
    setIsSending(true);
    setStatus("");
    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.get("name"),
          email: form.get("email"),
          message: form.get("message"),
          website: form.get("website"),
        }),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(typeof result.error === "string" ? result.error : "Message could not be sent. Please try again.");
      setStatus(typeof result.id === "string" ? `Your message has been sent. Reference: ${result.id}` : "Your message has been sent. Thanks for writing.");
      formElement.reset();
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "Message could not be sent. Please try again.");
    } finally {
      setIsSending(false);
    }
  }

  return (
    <Reveal as="form" className="contact-form" onSubmit={handleSubmit}>
      <label aria-hidden="true" className="contact-honeypot">Leave this field empty<input autoComplete="off" name="website" tabIndex={-1} /></label>
      <div className="form-fields">
        <label>Your name<input autoComplete="name" maxLength={100} name="name" placeholder="What should I call you?" required /></label>
        <label>Email address<input autoComplete="email" maxLength={254} name="email" placeholder="you@example.com" required type="email" /></label>
      </div>
      <label className="message-field">Your message<textarea maxLength={5000} name="message" placeholder="Tell me what’s on your mind..." required rows={4} /></label>
      <div className="form-bottom"><p aria-live="polite">{status || "Just a conversation. Your details stay private."}</p><button className="button button-paper" disabled={isSending} type="submit">{isSending ? "Sending…" : "Send Message"} <ArrowUpRight aria-hidden="true" /></button></div>
    </Reveal>
  );
}