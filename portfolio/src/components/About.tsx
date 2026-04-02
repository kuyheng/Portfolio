"use client";

import type { AboutData } from "@/data/aboutData";
import AboutHero from "@/components/about/AboutHero";
import FeatureCards from "@/components/about/FeatureCards";
import JourneySection from "@/components/about/JourneySection";
import ToolboxSection from "@/components/about/ToolboxSection";

type AboutProps = {
  data: AboutData;
};

export default function About({ data }: AboutProps) {
  const { section, availability, hero, highlights, stats, features, journey, toolbox } =
    data;

  if (!section.enabled || !section.id) return null;

  return (
    <section id={section.id} className="relative overflow-hidden py-24 sm:py-28">
      <div className="absolute inset-0 -z-10">
        <div className="absolute left-10 top-16 h-40 w-40 rounded-full bg-cyan-500/20 blur-3xl" />
        <div className="absolute bottom-10 right-10 h-64 w-64 rounded-full bg-sky-500/20 blur-3xl" />
      </div>

      <div className="mx-auto flex w-full max-w-6xl flex-col gap-12 px-6 sm:gap-14">
        <AboutHero
          section={section}
          availability={availability}
          hero={hero}
          highlights={highlights}
          stats={stats}
        />

        {features.enabled ? (
          <FeatureCards title={features.title} items={features.items} />
        ) : null}

        {journey.enabled || toolbox.enabled ? (
          <div className="grid gap-6 lg:grid-cols-[1.2fr_1fr]">
            {journey.enabled ? (
              <JourneySection title={journey.title} items={journey.items} />
            ) : null}
            {toolbox.enabled ? (
              <ToolboxSection
                title={toolbox.title}
                description={toolbox.description}
                items={toolbox.items}
              />
            ) : null}
          </div>
        ) : null}
      </div>
    </section>
  );
}
