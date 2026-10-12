import { Reveal } from "@/components/scroll-reveal";
import { CountUp } from "./count-up";

const stats = [
  { value: "200+", label: "Stories & Poems" },
  { value: "50+", label: "Book Reviews" },
  { value: "10k+", label: "Monthly Readers" },
];

export function StatsSection() {
  return (
    <section className="stats-band" aria-label="Writing highlights">
      <Reveal className="stats-inner content-width">
        <p className="stats-promise">Little words.<br />Lasting connections.</p>
        {stats.map((stat) => <div className="stat-item" key={stat.label}><CountUp value={stat.value} /><span>{stat.label}</span></div>)}
      </Reveal>
    </section>
  );
}