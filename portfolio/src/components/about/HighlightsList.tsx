"use client";

import type { AboutHighlight } from "@/data/aboutData";
import { Check } from "lucide-react";

type HighlightsListProps = {
  items: ReadonlyArray<AboutHighlight>;
};

export default function HighlightsList({ items }: HighlightsListProps) {
  if (!items.length) return null;

  return (
    <ul className="grid gap-3 text-sm text-slate-300 sm:grid-cols-2">
      {items.map((item) => {
        const Icon = item.icon ?? Check;
        return (
          <li key={item.text} className="flex items-start gap-3">
            <span className="mt-1 inline-flex h-5 w-5 items-center justify-center rounded-full bg-cyan-500/20 text-cyan-200">
              <Icon className="h-3.5 w-3.5" />
            </span>
            <span>{item.text}</span>
          </li>
        );
      })}
    </ul>
  );
}
