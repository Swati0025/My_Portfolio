import { ArrowUpRight } from "lucide-react";
import { HeroCarousel } from "./hero-carousel";

export function HeroSection() {
  return (
    <section className="hero-section content-width" id="home" aria-labelledby="hero-title">
      <div className="hero-copy">
        <p className="eyebrow">Writer. Reader. Wonder seeker.</p>
        <h1 aria-label="Words that breathe life into thoughts" id="hero-title">
          <span aria-hidden="true" className="title-mask"><span>Words that breathe</span></span>
          <span aria-hidden="true" className="title-mask"><span className="title-accent">life into thoughts</span></span>
        </h1>
        <p className="hero-intro">Exploring the world through stories, finding myself in books — and sharing a little of both with you.</p>
        <div className="hero-actions">
          <a className="button button-olive" href="#latest">Read My Work <ArrowUpRight aria-hidden="true" /></a>
          <a className="button button-outline" href="#contact">Get in Touch <ArrowUpRight aria-hidden="true" /></a>
        </div>
        <p className="hero-note">A quiet corner of the internet, made of words.</p>
      </div>
      <figure className="hero-art">
        <HeroCarousel />
      </figure>
    </section>
  );
}