"use client";

import type { AboutJourneyItem } from "@/data/aboutData";

type JourneySectionProps = {
  title: string;
  items: ReadonlyArray<AboutJourneyItem>;
};

export default function JourneySection({ title, items }: JourneySectionProps) {
  if (!items.length) return null;

  return (
    <div className="glass-card rounded-2xl p-6">
      <h3 className="text-lg font-semibold text-white">{title}</h3>
      <div className="mt-6 grid gap-4">
        {items.map((item) => (
          <div key={item.id} className="rounded-xl border border-white/10 bg-white/5 p-4">
            <span className="text-xs uppercase tracking-[0.3em] text-slate-400">
              {item.label}
            </span>
            <p className="mt-2 text-sm font-semibold text-white">{item.title}</p>
            <p className="mt-1 text-xs text-slate-400">{item.detail}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
