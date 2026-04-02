"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import SectionHeading from "@/components/SectionHeading";
import { Button } from "@/components/ui/button";
import type { AboutData } from "@/data/aboutData";
import HighlightsList from "@/components/about/HighlightsList";
import StatsGrid from "@/components/about/StatsGrid";

type AboutHeroProps = {
  section: AboutData["section"];
  availability: AboutData["availability"];
  hero: AboutData["hero"];
  highlights: AboutData["highlights"];
  stats: AboutData["stats"];
};

export default function AboutHero({
  section,
  availability,
  hero,
  highlights,
  stats,
}: AboutHeroProps) {
  return (
    <div className="flex flex-col gap-10">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <SectionHeading
          eyebrow={section.eyebrow}
          title={section.title}
          subtitle={section.subtitle}
          align="left"
        />
        {availability.enabled ? (
          <div className="flex items-center gap-3 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.3em] text-slate-300">
            <span className="h-2.5 w-2.5 rounded-full bg-emerald-400 shadow-[0_0_12px_rgba(52,211,153,0.6)]" />
            <span>{availability.label}</span>
            {availability.detail ? (
              <span className="text-slate-400">{availability.detail}</span>
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
          <div className="absolute -inset-4 rounded-full bg-gradient-to-tr from-cyan-500/40 to-sky-500/40 blur-2xl" />
          <div className="relative rounded-full border border-white/10 bg-white/5 p-3">
            <Image
              src={hero.avatar.src}
              alt={hero.avatar.alt}
              width={380}
              height={380}
              className="h-[280px] w-[280px] rounded-full object-cover sm:h-[340px] sm:w-[340px] lg:h-[380px] lg:w-[380px]"
              unoptimized
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
          <p className="text-base text-slate-300 sm:text-lg">{hero.description}</p>
          {highlights.enabled ? <HighlightsList items={highlights.items} /> : null}
          {stats.enabled ? <StatsGrid items={stats.items} /> : null}
          {hero.ctas?.length ? (
            <div className="flex flex-wrap gap-3">
              {hero.ctas.filter((cta) => cta.enabled !== false).map((cta) => (
                <Button key={cta.id} variant={cta.variant} asChild>
                  <a href={cta.href}>{cta.label}</a>
                </Button>
              ))}
            </div>
          ) : null}
        </motion.div>
      </div>
    </div>
  );
}
