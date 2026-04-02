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
};
