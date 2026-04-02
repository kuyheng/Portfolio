"use client";

import { motion } from "framer-motion";
import TypingTitle from "@/components/TypingTitle";

const badges = ["React", "Next.js", "Node.js", "TypeScript", "Tailwind"];

type HeroProps = {
  profile: {
    name: string;
    bio: string;
    location: string;
  };
  hero: {
    roles: string[];
    cta: {
      primary: string;
      secondary: string;
    };
  };
  cvUrl: string;
};

export default function Hero({ profile, hero, cvUrl }: HeroProps) {
  return (
    <section id="home" className="relative flex min-h-screen items-center overflow-hidden pb-24 pt-32">
      <div className="absolute inset-0 -z-10">
        <div className="absolute left-1/2 top-16 h-[420px] w-[420px] -translate-x-1/2 rounded-full blur-3xl opacity-70 accent-gradient animate-[glowPulse_10s_ease-in-out_infinite]" />
        <div className="absolute bottom-20 right-10 h-[260px] w-[260px] rounded-full bg-cyan-500/20 blur-3xl" />
      </div>

      <div className="mx-auto flex w-full max-w-6xl flex-col items-center px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="flex flex-col items-center gap-6"
        >
          <span className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs uppercase tracking-[0.4em] text-slate-400">
            {profile.location}
          </span>
          <h1 className="text-4xl font-semibold text-white sm:text-5xl lg:text-6xl">
            Hi, I&apos;m <span className="text-gradient">{profile.name}</span>
          </h1>
          <TypingTitle roles={hero.roles} />
          <p className="max-w-2xl text-base text-slate-300 sm:text-lg">{profile.bio}</p>

          <div className="flex flex-wrap items-center justify-center gap-4">
            <a
              href="#projects"
              className="accent-gradient rounded-full px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-cyan-500/30"
            >
              {hero.cta.primary}
            </a>
            <a
              href={cvUrl}
              download
              className="rounded-full border border-white/20 px-6 py-3 text-sm font-semibold text-white transition hover:border-white/40"
            >
              {hero.cta.secondary}
            </a>
          </div>
        </motion.div>

        <div className="mt-14 flex flex-wrap items-center justify-center gap-3">
          {badges.map((badge, index) => (
            <motion.span
              key={badge}
              className="glass-card rounded-full px-4 py-2 text-xs font-medium uppercase tracking-[0.2em] text-slate-200"
              animate={{ y: [0, -8, 0] }}
              transition={{ duration: 3 + index, repeat: Infinity, ease: "easeInOut" }}
            >
              {badge}
            </motion.span>
          ))}
        </div>

        <motion.div
          className="mt-16 flex flex-col items-center gap-2 text-slate-400"
          animate={{ y: [0, 6, 0] }}
          transition={{ duration: 2.5, repeat: Infinity }}
        >
          <span className="text-xs uppercase tracking-[0.4em]">Scroll</span>
          <span className="text-2xl">v</span>
        </motion.div>
      </div>
    </section>
  );
}
