"use client";

import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import SectionHeading from "@/components/SectionHeading";
import ProjectCard from "@/components/ProjectCard";

type Project = {
  id: string;
  title: string;
  category: string;
  description: string;
  tech: string[];
  github: string;
  demo: string;
  image: string;
};

type ProjectsProps = {
  projects: Project[];
};

const filters = ["All", "Web", "Mobile", "UI/UX"];

export default function Projects({ projects }: ProjectsProps) {
  const [activeFilter, setActiveFilter] = useState("All");

  const filtered = useMemo(() => {
    if (activeFilter === "All") return projects;
    return projects.filter((project) => project.category === activeFilter);
  }, [activeFilter, projects]);

  return (
    <section id="projects" className="py-24">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-12 px-6">
        <SectionHeading
          eyebrow="Projects"
          title="Selected work crafted for impact"
          subtitle="A mix of production builds, design systems, and experimental product ideas."
        />

        <div className="flex flex-wrap items-center justify-center gap-3">
          {filters.map((filter) => (
            <button
              key={filter}
              className={`rounded-full px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] transition ${
                activeFilter === filter
                  ? "accent-gradient text-white"
                  : "border border-white/10 bg-white/5 text-slate-300 hover:border-white/30"
              }`}
              onClick={() => setActiveFilter(filter)}
            >
              {filter}
            </button>
          ))}
        </div>

        <motion.div layout className="grid gap-6 md:grid-cols-2">
          <AnimatePresence mode="popLayout">
            {filtered.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </AnimatePresence>
        </motion.div>

        <div className="flex justify-center">
          <button
            className="rounded-full border border-white/20 px-6 py-3 text-sm font-semibold text-white transition hover:border-white/40"
            onClick={() => setActiveFilter("All")}
          >
            View All Projects
          </button>
        </div>
      </div>
    </section>
  );
}
