import Image from "next/image";
import { ArrowUpRight, BookOpen, Sparkles } from "lucide-react";

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
        <div className="hero-image-wrap">
          <div className="hero-photo-frame">
            <div className="hero-image-enter">
              <Image alt="A woman seated at a rooftop cafe table with a book and glasses" className="hero-image" fill priority sizes="(max-width: 760px) 90vw, 38vw" src="/images/swati-hero.jpeg" />
            </div>
          </div>
          <span className="hero-sparkle-float" aria-hidden="true"><span className="hero-sparkle"><span className="hero-sparkle-twinkle"><Sparkles /></span></span></span>
          <div className="chapter-note-float">
            <div className="chapter-note-enter">
              <div className="chapter-note"><BookOpen aria-hidden="true" /><span><small>Always between pages</small><strong>One more chapter...</strong></span></div>
            </div>
          </div>
        </div>
        <figcaption>A quiet moment, somewhere between pages.</figcaption>
      </figure>
    </section>
  );
}