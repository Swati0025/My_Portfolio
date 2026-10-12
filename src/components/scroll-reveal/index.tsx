"use client";

import {
  type ComponentPropsWithoutRef,
  type ElementType,
  type ReactNode,
  useEffect,
  useRef,
  useState,
} from "react";

type RevealProps<T extends ElementType> = {
  as?: T;
  children: ReactNode;
  className?: string;
} & Omit<ComponentPropsWithoutRef<T>, "as" | "children" | "className">;

const revealCallbacks = new Map<Element, () => void>();
let revealObserver: IntersectionObserver | null = null;
let listenersAttached = false;

function revealElement(element: Element) {
  const bounds = element.getBoundingClientRect();
  if (bounds.bottom < 0 || bounds.top > window.innerHeight * 0.94) return;

  const callback = revealCallbacks.get(element);
  if (!callback) return;
  revealCallbacks.delete(element);
  revealObserver?.unobserve(element);
  callback();
}

function checkVisibleElements() {
  revealCallbacks.forEach((_, element) => revealElement(element));
}

export function observeInViewport(element: Element, onReveal: () => void) {
  if (!revealObserver) {
    revealObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) revealElement(entry.target);
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -5% 0px" });
  }

  revealCallbacks.set(element, onReveal);
  revealObserver.observe(element);
  if (!listenersAttached) {
    window.addEventListener("scroll", checkVisibleElements, { passive: true });
    window.addEventListener("resize", checkVisibleElements, { passive: true });
    listenersAttached = true;
  }
  revealElement(element);

  return () => {
    revealCallbacks.delete(element);
    revealObserver?.unobserve(element);
    if (revealCallbacks.size === 0) {
      revealObserver?.disconnect();
      revealObserver = null;
      window.removeEventListener("scroll", checkVisibleElements);
      window.removeEventListener("resize", checkVisibleElements);
      listenersAttached = false;
    }
  };
}

export function Reveal<T extends ElementType = "div">({
  as,
  children,
  className = "",
  ...props
}: RevealProps<T>) {
  const Tag = as ?? "div";
  const elementRef = useRef<Element | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const element = elementRef.current;
    if (!element || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    return observeInViewport(element, () => setIsVisible(true));
  }, []);

  const stateClass = isVisible ? "scroll-reveal-visible" : "scroll-reveal-pending";

  return (
    <Tag
      {...props}
      ref={(element: Element | null) => {
        elementRef.current = element;
      }}
      className={`scroll-reveal ${stateClass} ${className}`.trim()}
    >
      {children}
    </Tag>
  );
}