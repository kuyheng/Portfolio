"use client";

import AnimatedCounter from "@/components/AnimatedCounter";
import type { AboutStat } from "@/data/aboutData";

type StatsGridProps = {
  items: ReadonlyArray<AboutStat>;
};

export default function StatsGrid({ items }: StatsGridProps) {
  if (!items.length) return null;

  return (
    <div className="grid gap-4 sm:grid-cols-3">
      {items.map((stat) => (
        <div key={stat.label} className="glass-card rounded-2xl p-4 text-center">
          <AnimatedCounter value={stat.value} suffix={stat.suffix} />
          <p className="mt-2 text-xs uppercase tracking-[0.3em] text-slate-400">
            {stat.label}
          </p>
        </div>
      ))}
    </div>
  );
}
