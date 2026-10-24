"use client";

import Image from "next/image";
import { BookOpen, Sparkles } from "lucide-react";
import { useEffect, useState } from "react";

const slides = [
  {
    src: "/hero/reading-at-the-bookshop.jpg",
    alt: "A woman reading an open book among warm-lit bookstore shelves",
    card: "One more chapter...",
    caption: "A quiet moment, somewhere between pages.",
    objectPosition: "center 42%",
  },
  {
    src: "/hero/reading-between-shelves.jpg",
    alt: "A reader holding a book in front of her face between bookstore shelves",
    card: "Currently reading",
    caption: "Lost in someone else's world.",
    objectPosition: "center 42%",
  },
  {
    src: "/hero/coffee-and-verses-rooftop.jpg",
    alt: "A woman at a rooftop cafe table with a menu and glasses at dusk",
    card: "Coffee and verses",
    caption: "Notes taken between sips.",
    objectPosition: "center 45%",
  },
  {
    src: "/hero/browsing-biography-shelves.jpg",
    alt: "A woman browsing books on a biography shelf",
    card: "Wonder seeking",
    caption: "Stories hide in ordinary places.",
    objectPosition: "center 38%",
  },
  {
    src: "/hero/look-closer-bookshop.jpeg",
    alt: "A reader holding a book among colorful bookstore shelves",
    card: "Look closer",
    caption: "Behind every book, a reader wondering what comes next.",
    objectPosition: "center 56%",
  },
];

export function HeroCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const slide = slides[currentIndex];

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const updatePreference = () => setPrefersReducedMotion(mediaQuery.matches);
    updatePreference();
    mediaQuery.addEventListener("change", updatePreference);
    return () => mediaQuery.removeEventListener("change", updatePreference);
  }, []);

  useEffect(() => {
    if (isHovered || prefersReducedMotion) return;

    const intervalId = window.setInterval(() => {
      setCurrentIndex((index) => (index + 1) % slides.length);
    }, 4000);

    return () => window.clearInterval(intervalId);
  }, [isHovered, prefersReducedMotion]);

  return (
    <>
      <div
        className="hero-image-wrap"
        onPointerEnter={() => setIsHovered(true)}
        onPointerLeave={() => setIsHovered(false)}
      >
        <div className="hero-photo-frame">
          <div className="hero-image-enter">
            <Image
              key={slide.src}
              alt={slide.alt}
              className="hero-image"
              fill
              priority={currentIndex === 0}
              sizes="(max-width: 760px) 90vw, 38vw"
              src={slide.src}
              style={{ objectPosition: slide.objectPosition }}
            />
          </div>
        </div>
        <span className="hero-sparkle-float" aria-hidden="true">
          <span className="hero-sparkle">
            <span className="hero-sparkle-twinkle"><Sparkles /></span>
          </span>
        </span>
        <div className="chapter-note-float" aria-live="polite">
          <div className="chapter-note-enter">
            <div className="chapter-note">
              <BookOpen aria-hidden="true" />
              <span>
                <small>Always between pages</small>
                <strong>{slide.card}</strong>
              </span>
            </div>
          </div>
        </div>
      </div>
      <figcaption>{slide.caption}</figcaption>
    </>
  );
}