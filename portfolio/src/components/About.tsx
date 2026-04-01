"use client";

import { motion } from "framer-motion";
import { Check, Compass, Layers, Sparkles } from "lucide-react";
import SectionHeading from "@/components/SectionHeading";
import AnimatedCounter from "@/components/AnimatedCounter";

type AboutProps = {
  profile: {
    name: string;
    bio: string;
    photo?: string;
  };
  stats: Array<{ label: string; value: number; suffix?: string }>;
  about?: {
    title?: string;
    subtitle?: string;
    highlights?: string[];
    strengths?: Array<{ title: string; description: string }>;
    timeline?: Array<{ label: string; title: string; detail: string }>;
    toolbox?: string[];
    availability?: {
      label: string;
      detail?: string;
    };
  };
};

const strengthIcons = [Sparkles, Layers, Compass];

export default function About({ profile, stats, about }: AboutProps) {
  const highlights = about?.highlights ?? [];
  const strengths = about?.strengths ?? [];
  const timeline = about?.timeline ?? [];
  const toolbox = about?.toolbox ?? [];

  return (
    <section id="about" className="relative overflow-hidden py-24">
      <div className="absolute inset-0 -z-10">
        <div className="absolute left-10 top-16 h-40 w-40 rounded-full bg-blue-500/20 blur-3xl" />
        <div className="absolute bottom-10 right-10 h-64 w-64 rounded-full bg-violet-500/20 blur-3xl" />
      </div>

      <div className="mx-auto flex w-full max-w-6xl flex-col gap-12 px-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <SectionHeading
            eyebrow="About"
            title={about?.title ?? "Building digital experiences with clarity and care"}
            subtitle={
              about?.subtitle ??
              "I blend engineering, design, and strategy to deliver products that feel effortless for the end user."
            }
            align="left"
          />
          {about?.availability ? (
            <div className="flex items-center gap-3 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.3em] text-slate-300">
              <span className="h-2.5 w-2.5 rounded-full bg-emerald-400 shadow-[0_0_12px_rgba(52,211,153,0.6)]" />
              <span>{about.availability.label}</span>
              {about.availability.detail ? (
                <span className="text-slate-400">{about.availability.detail}</span>
              ) : null}
            </div>
          ) : null}
        </div>

        <div className="grid items-center gap-10 md:grid-cols-2">
          <motion.div
            className="relative mx-auto w-full max-w-sm"
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            <div className="absolute -inset-4 rounded-full bg-gradient-to-tr from-blue-500/40 to-violet-500/40 blur-2xl" />
            <div className="relative rounded-full border border-white/10 bg-white/5 p-3">
              <img
                src={profile.photo || "/profile.svg"}
                alt={`${profile.name} profile`}
                className="h-[380px] w-[380px] rounded-full object-cover"
                loading="lazy"
              />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="flex flex-col gap-6"
          >
            <p className="text-base text-slate-300 sm:text-lg">{profile.bio}</p>
            {highlights.length ? (
              <ul className="grid gap-3 text-sm text-slate-300">
                {highlights.map((item) => (
                  <li key={item} className="flex items-start gap-3">
                    <span className="mt-1 inline-flex h-5 w-5 items-center justify-center rounded-full bg-blue-500/20 text-blue-200">
                      <Check className="h-3 w-3" />
                    </span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            ) : null}
            <div className="grid gap-6 sm:grid-cols-3">
              {stats.map((stat) => (
                <div key={stat.label} className="glass-card rounded-2xl p-4 text-center">
                  <AnimatedCounter value={stat.value} suffix={stat.suffix} />
                  <p className="mt-2 text-xs uppercase tracking-[0.3em] text-slate-400">
                    {stat.label}
                  </p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {strengths.length ? (
          <div className="grid gap-6 md:grid-cols-3">
            {strengths.map((strength, index) => {
              const Icon = strengthIcons[index % strengthIcons.length];
              return (
                <div key={strength.title} className="glass-card rounded-2xl p-6">
                  <div className="flex items-center gap-3">
                    <span className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-white">
                      <Icon className="h-5 w-5" />
                    </span>
                    <h3 className="text-base font-semibold text-white">{strength.title}</h3>
                  </div>
                  <p className="mt-4 text-sm text-slate-300">{strength.description}</p>
                </div>
              );
            })}
          </div>
        ) : null}

        <div className="grid gap-6 lg:grid-cols-[1.2fr_1fr]">
          {timeline.length ? (
            <div className="glass-card rounded-2xl p-6">
              <h3 className="text-lg font-semibold text-white">Path</h3>
              <div className="mt-6 grid gap-4">
                {timeline.map((item) => (
                  <div key={item.label} className="rounded-xl border border-white/10 bg-white/5 p-4">
                    <span className="text-xs uppercase tracking-[0.3em] text-slate-400">
                      {item.label}
                    </span>
                    <p className="mt-2 text-sm font-semibold text-white">{item.title}</p>
                    <p className="mt-1 text-xs text-slate-400">{item.detail}</p>
                  </div>
                ))}
              </div>
            </div>
          ) : null}

          {toolbox.length ? (
            <div className="glass-card rounded-2xl p-6">
              <h3 className="text-lg font-semibold text-white">Toolbox</h3>
              <p className="mt-2 text-sm text-slate-400">
                The tools I use to move fast without breaking things.
              </p>
              <div className="mt-4 flex flex-wrap gap-2">
                {toolbox.map((tool) => (
                  <span
                    key={tool}
                    className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs uppercase tracking-[0.2em] text-slate-300"
                  >
                    {tool}
                  </span>
                ))}
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </section>
  );
}
