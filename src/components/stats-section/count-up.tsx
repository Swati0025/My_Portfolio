"use client";

import { useEffect, useRef, useState } from "react";
import { observeInViewport } from "@/components/scroll-reveal";

type CountUpProps = { value: string };

function parseTarget(value: string) {
  const isThousands = value.toLowerCase().includes("k");
  const amount = Number.parseFloat(value.replace(/[+,k]/gi, ""));
  return { target: isThousands ? amount * 1000 : amount, isThousands };
}

function formatValue(amount: number, isThousands: boolean, complete: boolean) {
  const wholeAmount = Math.round(amount);
  if (wholeAmount === 0) return "0";
  if (isThousands && wholeAmount >= 1000) {
    return `${Math.round(wholeAmount / 1000)}k${complete ? "+" : ""}`;
  }
  return `${wholeAmount}${complete ? "+" : ""}`;
}

export function CountUp({ value }: CountUpProps) {
  const elementRef = useRef<HTMLElement | null>(null);
  const [display, setDisplay] = useState(value);

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    const { target, isThousands } = parseTarget(value);
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let frameId = 0;
    const stopObserving = observeInViewport(element, () => {
      if (document.visibilityState === "hidden") {
        setDisplay(value);
        return;
      }

      setDisplay("0");
      const startTime = performance.now();
      const duration = 950;

      const tick = (now: number) => {
        const progress = Math.min((now - startTime) / duration, 1);
        const eased = 1 - (1 - progress) ** 4;
        setDisplay(formatValue(target * eased, isThousands, progress === 1));
        if (progress < 1) frameId = requestAnimationFrame(tick);
      };

      frameId = requestAnimationFrame(tick);
    });

    return () => {
      stopObserving();
      cancelAnimationFrame(frameId);
    };
  }, [value]);

  return (
    <strong aria-label={value} ref={elementRef}>
      <span aria-hidden="true">{display}</span>
    </strong>
  );
}