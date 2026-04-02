"use client";

import type { AboutFeature } from "@/data/aboutData";
import { Sparkles } from "lucide-react";
import { getIcon } from "@/components/about/iconMap";

type FeatureCardsProps = {
  title: string;
  items: ReadonlyArray<AboutFeature>;
};

export default function FeatureCards({ title, items }: FeatureCardsProps) {
  if (!items.length) return null;

  return (
    <div className="grid gap-6">
      <h3 className="text-lg font-semibold text-white">{title}</h3>
      <div className="grid gap-6 md:grid-cols-3">
        {items.map((feature) => {
          const Icon = getIcon(feature.icon, Sparkles);
          return (
            <div key={feature.id} className="glass-card rounded-2xl p-6">
              <div className="flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-white">
                  <Icon className="h-5 w-5" />
                </span>
                <h4 className="text-base font-semibold text-white">{feature.title}</h4>
              </div>
              <p className="mt-4 text-sm text-slate-300">{feature.description}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
