"use client";

import { motion } from "framer-motion";
import SectionHeading from "@/components/SectionHeading";

type Skill = { name: string; icon: string };

type SkillsProps = {
  skills: Record<string, Skill[]>;
};

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.08 },
  },
};

const item = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0 },
};

export default function Skills({ skills }: SkillsProps) {
  return (
    <section id="skills" className="py-24">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-12 px-6">
        <SectionHeading
          eyebrow="Skills"
          title="Tools I reach for daily"
          subtitle="A balanced toolkit across frontend engineering, backend systems, and product delivery."
        />

        <div className="grid gap-8 md:grid-cols-3">
          {Object.entries(skills).map(([category, list]) => (
            <div key={category} className="glass-card rounded-2xl p-6">
              <h3 className="text-lg font-semibold text-white">{category}</h3>
              <motion.div
                variants={container}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true }}
                className="mt-6 grid grid-cols-2 gap-4"
              >
                {list.map((skill) => (
                  <motion.div
                    key={skill.name}
                    variants={item}
                    className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-slate-300 transition hover:border-blue-500/40 hover:text-white"
                  >
                    {skill.icon.startsWith("http") || skill.icon.startsWith("data:") ? (
                      <img src={skill.icon} alt={skill.name} className="h-5 w-5" />
                    ) : (
                      <i className={`${skill.icon} text-xl`} />
                    )}
                    {skill.name}
                  </motion.div>
                ))}
              </motion.div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
