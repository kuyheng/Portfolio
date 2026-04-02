"use client";

import { motion } from "framer-motion";
import Image from "next/image";

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

type ProjectCardProps = {
  project: Project;
};

export default function ProjectCard({ project }: ProjectCardProps) {
  return (
    <motion.div
      layout
      whileHover={{ y: -6 }}
      className="glass-card group relative flex h-full flex-col overflow-hidden rounded-2xl"
    >
      <div className="relative h-44 overflow-hidden">
        <Image
          src={project.image}
          alt={project.title}
          fill
          sizes="(max-width: 768px) 100vw, 50vw"
          className="object-cover transition duration-500 group-hover:scale-110"
          unoptimized
        />
        <div className="absolute inset-0 project-overlay" />
        <div className="absolute inset-0 flex items-center justify-center gap-3 bg-black/50 opacity-0 transition duration-300 group-hover:opacity-100">
          <a
            className="rounded-full border border-white/20 px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-white"
            href={project.github}
            target="_blank"
            rel="noreferrer"
          >
            Code
          </a>
          <a
            className="accent-gradient rounded-full px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-white"
            href={project.demo}
            target="_blank"
            rel="noreferrer"
          >
            Live
          </a>
        </div>
      </div>
      <div className="flex flex-1 flex-col gap-4 p-6">
        <div>
          <h3 className="text-xl font-semibold text-white">{project.title}</h3>
          <p className="mt-2 text-sm text-slate-400">{project.description}</p>
        </div>
        <div className="flex flex-wrap gap-2">
          {project.tech.map((tech) => (
            <span
              key={tech}
              className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs uppercase tracking-[0.2em] text-slate-300"
            >
              {tech}
            </span>
          ))}
        </div>
        <div className="mt-auto flex items-center gap-4 text-sm font-medium text-slate-300">
          <a className="hover:text-white" href={project.github} target="_blank" rel="noreferrer">
            GitHub
          </a>
          <a className="hover:text-white" href={project.demo} target="_blank" rel="noreferrer">
            Live Demo
          </a>
        </div>
      </div>
      <div className="pointer-events-none absolute inset-0 opacity-0 transition duration-300 group-hover:opacity-100">
        <div className="absolute inset-0 rounded-2xl border border-cyan-400/40 shadow-[0_0_30px_rgba(34,211,238,0.35)]" />
      </div>
    </motion.div>
  );
}
