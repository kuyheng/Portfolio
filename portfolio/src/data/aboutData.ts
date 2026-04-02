export type AboutCta = {
  id: string;
  label: string;
  href: string;
  variant?: "default" | "secondary" | "outline" | "ghost";
  enabled?: boolean;
};

export type AboutHighlight = {
  id: string;
  text: string;
  icon?: string;
};

export type AboutStat = {
  id: string;
  label: string;
  value: number;
  suffix?: string;
};

export type AboutFeature = {
  id: string;
  title: string;
  description: string;
  icon?: string;
};

export type AboutJourneyItem = {
  id: string;
  label: string;
  title: string;
  detail: string;
};

export type AboutTool = {
  id: string;
  label: string;
};

export type AboutData = {
  section: {
    id: string;
    enabled: boolean;
    eyebrow: string;
    title: string;
    subtitle: string;
  };
  availability: {
    enabled: boolean;
    label: string;
    detail?: string;
  };
  hero: {
    description: string;
    avatar: {
      src: string;
      alt: string;
    };
    ctas: AboutCta[];
  };
  highlights: {
    enabled: boolean;
    items: AboutHighlight[];
  };
  stats: {
    enabled: boolean;
    items: AboutStat[];
  };
  features: {
    enabled: boolean;
    title: string;
    items: AboutFeature[];
  };
  journey: {
    enabled: boolean;
    title: string;
    items: AboutJourneyItem[];
  };
  toolbox: {
    enabled: boolean;
    title: string;
    description?: string;
    items: AboutTool[];
  };
};

export const aboutData: AboutData = {
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
      { id: "cta-1", label: "View Projects", href: "#projects", variant: "default", enabled: true },
      { id: "cta-2", label: "Contact Me", href: "#contact", variant: "outline", enabled: true },
    ],
  },
  highlights: {
    enabled: true,
    items: [
      {
        id: "highlight-1",
        text: "Built and shipped production web apps with Next.js and Node.js",
        icon: "check",
      },
      {
        id: "highlight-2",
        text: "Improved dashboard load time from 3.1s to 1.2s through UI and API tuning",
        icon: "check",
      },
      {
        id: "highlight-3",
        text: "Designed a reusable UI kit used across 12+ screens",
        icon: "check",
      },
    ],
  },
  stats: {
    enabled: true,
    items: [
      { id: "stat-1", label: "Years Experience", value: 5, suffix: "+" },
      { id: "stat-2", label: "Projects Delivered", value: 38, suffix: "+" },
      { id: "stat-3", label: "Happy Clients", value: 12, suffix: "+" },
    ],
  },
  features: {
    enabled: true,
    title: "What I bring",
    items: [
      {
        id: "feature-1",
        title: "Frontend craft",
        description: "Polished UI, micro-interactions, and accessibility with modern React.",
        icon: "sparkles",
      },
      {
        id: "feature-2",
        title: "Backend reliability",
        description: "Clean APIs, solid data modeling, and thoughtful error handling.",
        icon: "layers",
      },
      {
        id: "feature-3",
        title: "Product sense",
        description: "I ask the right questions to ship what users actually need.",
        icon: "compass",
      },
    ],
  },
  journey: {
    enabled: true,
    title: "Path",
    items: [
      {
        id: "journey-1",
        label: "Now",
        title: "Building web apps and dashboards",
        detail: "Focused on speed, clarity, and maintainable systems.",
      },
      {
        id: "journey-2",
        label: "Previously",
        title: "Freelance projects for local businesses",
        detail: "Delivered marketing sites, admin tools, and e-commerce flows.",
      },
      {
        id: "journey-3",
        label: "Next",
        title: "Open to product-focused teams",
        detail: "Especially fintech, education, and SaaS.",
      },
    ],
  },
  toolbox: {
    enabled: true,
    title: "Toolbox",
    description: "The tools I use to move fast without breaking things.",
    items: [
      { id: "tool-1", label: "Next.js" },
      { id: "tool-2", label: "TypeScript" },
      { id: "tool-3", label: "React" },
      { id: "tool-4", label: "Node.js" },
      { id: "tool-5", label: "PostgreSQL" },
      { id: "tool-6", label: "Tailwind" },
      { id: "tool-7", label: "Framer Motion" },
      { id: "tool-8", label: "Figma" },
    ],
  },
};
