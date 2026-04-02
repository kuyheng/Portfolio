import type { LucideIcon } from "lucide-react";
import { Check, Compass, Layers, Sparkles } from "lucide-react";

export type AboutCta = {
  label: string;
  href: string;
  variant?: "default" | "secondary" | "outline" | "ghost";
};

export type AboutHighlight = {
  text: string;
  icon?: LucideIcon;
};

export type AboutStat = {
  label: string;
  value: number;
  suffix?: string;
};

export type AboutFeature = {
  title: string;
  description: string;
  icon?: LucideIcon;
};

export type AboutJourneyItem = {
  label: string;
  title: string;
  detail: string;
};

export const aboutData = {
  section: {
    id: "about",
    enabled: true,
    eyebrow: "About",
    title: "Curious builder focused on outcomes",
    subtitle:
      "I care about clear UX, reliable APIs, and measurable impact for the teams I support.",
  },
  availability: {
    enabled: true,
    label: "Open to freelance",
    detail: "Available in Q2 2026",
  },
  hero: {
    description:
      "I build fast, accessible web apps with modern React and reliable APIs. I care about clean UX, performance, and maintainable code that scales with the team.",
    avatar: {
      src: "/profile.svg",
      alt: "Kuyheng Thoeng profile",
    },
    ctas: [
      { label: "View Projects", href: "#projects", variant: "default" },
      { label: "Contact Me", href: "#contact", variant: "outline" },
    ] as AboutCta[],
  },
  highlights: {
    enabled: true,
    items: [
      {
        text: "Built and shipped production web apps with Next.js and Node.js",
        icon: Check,
      },
      {
        text: "Improved dashboard load time from 3.1s to 1.2s through UI and API tuning",
        icon: Check,
      },
      {
        text: "Designed a reusable UI kit used across 12+ screens",
        icon: Check,
      },
    ] as AboutHighlight[],
  },
  stats: {
    enabled: true,
    items: [
      { label: "Years Experience", value: 5, suffix: "+" },
      { label: "Projects Delivered", value: 38, suffix: "+" },
      { label: "Happy Clients", value: 12, suffix: "+" },
    ] as AboutStat[],
  },
  features: {
    enabled: true,
    title: "What I bring",
    items: [
      {
        title: "Frontend craft",
        description: "Polished UI, micro-interactions, and accessibility with modern React.",
        icon: Sparkles,
      },
      {
        title: "Backend reliability",
        description: "Clean APIs, solid data modeling, and thoughtful error handling.",
        icon: Layers,
      },
      {
        title: "Product sense",
        description: "I ask the right questions to ship what users actually need.",
        icon: Compass,
      },
    ] as AboutFeature[],
  },
  journey: {
    enabled: true,
    title: "Path",
    items: [
      {
        label: "Now",
        title: "Building web apps and dashboards",
        detail: "Focused on speed, clarity, and maintainable systems.",
      },
      {
        label: "Previously",
        title: "Freelance projects for local businesses",
        detail: "Delivered marketing sites, admin tools, and e-commerce flows.",
      },
      {
        label: "Next",
        title: "Open to product-focused teams",
        detail: "Especially fintech, education, and SaaS.",
      },
    ] as AboutJourneyItem[],
  },
  toolbox: {
    enabled: true,
    title: "Toolbox",
    description: "The tools I use to move fast without breaking things.",
    items: [
      "Next.js",
      "TypeScript",
      "React",
      "Node.js",
      "PostgreSQL",
      "Tailwind",
      "Framer Motion",
      "Figma",
    ],
  },
} as const;

export type AboutData = typeof aboutData;
