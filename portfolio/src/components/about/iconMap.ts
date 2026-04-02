import { Check, Compass, Layers, Sparkles, Star, Zap } from "lucide-react";
import type { LucideIcon } from "lucide-react";

const iconMap: Record<string, LucideIcon> = {
  check: Check,
  sparkles: Sparkles,
  layers: Layers,
  compass: Compass,
  star: Star,
  zap: Zap,
};

export const getIcon = (name: string | undefined, fallback: LucideIcon) =>
  (name && iconMap[name]) || fallback;
