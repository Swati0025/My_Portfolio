"use client";

import Image from "next/image";
import { BookOpen, ChevronLeft, ChevronRight, Sparkles } from "lucide-react";
import { useEffect, useRef, useState } from "react";

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
  const [loadedSrc, setLoadedSrc] = useState<string | null>(null);
  const imageRef = useRef<HTMLImageElement | null>(null);
  const slide = slides[currentIndex];
  const isSlideLoaded = loadedSrc === slide.src;

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

  useEffect(() => {
    if (imageRef.current?.complete && imageRef.current.naturalWidth > 0) {
      setLoadedSrc(slide.src);
    }
  }, [slide.src]);

  return (
    <>
      <div
        className="hero-image-wrap"
        onPointerEnter={() => setIsHovered(true)}
        onPointerLeave={() => setIsHovered(false)}
      >
        <div className={`hero-photo-frame${isSlideLoaded ? " hero-photo-frame-loaded" : ""}`}>
          <div
            className={`hero-image-enter${isSlideLoaded ? "" : " hero-image-enter-pending"}`}
            key={slide.src}
          >
            <Image
              key={slide.src}
              ref={imageRef}
              alt={slide.alt}
              className={`hero-image${isSlideLoaded ? " hero-image-loaded" : ""}`}
              fill
              loading="eager"
              sizes="(max-width: 760px) 90vw, 38vw"
              src={slide.src}
              onLoad={() => setLoadedSrc(slide.src)}
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
      <div
        className="hero-carousel-controls"
        onPointerEnter={() => setIsHovered(true)}
        onPointerLeave={() => setIsHovered(false)}
        onFocus={() => setIsHovered(true)}
        onBlur={(event) => {
          if (!event.currentTarget.contains(event.relatedTarget)) setIsHovered(false);
        }}
        role="group"
        aria-label="Hero image carousel controls"
      >
          <button
            aria-label="Show previous image"
            onClick={() => setCurrentIndex((index) => (index - 1 + slides.length) % slides.length)}
            type="button"
          >
            <ChevronLeft aria-hidden="true" />
          </button>
          <div className="hero-carousel-indicators">
            {slides.map((item, index) => (
              <button
                aria-label={`Show image ${index + 1}: ${item.card}`}
                aria-pressed={currentIndex === index}
                className={currentIndex === index ? "is-active" : ""}
                key={item.src}
                onClick={() => setCurrentIndex(index)}
                type="button"
              />
            ))}
          </div>
          <button
            aria-label="Show next image"
            onClick={() => setCurrentIndex((index) => (index + 1) % slides.length)}
            type="button"
          >
            <ChevronRight aria-hidden="true" />
          </button>
      </div>
      <figcaption>{slide.caption}</figcaption>
    </>
  );
}