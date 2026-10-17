"use client";

import { useEffect, useState } from "react";

type Particle = {
  left: number;
  top: number;
  size: number;
  duration: number;
  delay: number;
};

function createParticles(count: number): Particle[] {
  return Array.from({ length: count }, () => ({
    left: Math.random() * 100,
    top: 20 + Math.random() * 80,
    size: 3 + Math.random() * 4,
    duration: 5 + Math.random() * 5,
    delay: -(Math.random() * 7),
  }));
}

export function AboutPhotoDust() {
  const [particles, setParticles] = useState<Particle[]>([]);

  useEffect(() => {
    const mobileQuery = window.matchMedia("(max-width: 760px)");
    const updateParticles = () => setParticles(createParticles(mobileQuery.matches ? 16 : 28));

    updateParticles();
    mobileQuery.addEventListener("change", updateParticles);
    return () => mobileQuery.removeEventListener("change", updateParticles);
  }, []);

  return (
    <div aria-hidden="true" className="about-dust">
      {particles.map((particle, index) => (
        <span
          className="about-dust-particle"
          key={index}
          style={{
            left: `${particle.left}%`,
            top: `${particle.top}%`,
            width: `${particle.size}px`,
            height: `${particle.size}px`,
            animationDuration: `${particle.duration}s`,
            animationDelay: `${particle.delay}s`,
          }}
        />
      ))}
    </div>
  );
}