"use client";

import { motion } from "framer-motion";
import SectionHeading from "@/components/SectionHeading";

type NewsItem = {
  id: string;
  title: string;
  category: string;
  date: string;
  excerpt: string;
  link?: string;
};

type NewsProps = {
  news: NewsItem[];
};

const formatDate = (value: string) => {
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return value;
  return parsed.toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

export default function News({ news }: NewsProps) {
  if (!news?.length) return null;

  return (
    <section id="news" className="py-24">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-12 px-6">
        <SectionHeading
          eyebrow="News"
          title="Latest updates and milestones"
          subtitle="Short notes about what I'm building, learning, and shipping."
        />

        <div className="grid gap-6 md:grid-cols-2">
          {news.map((item, index) => (
            <motion.article
              key={item.id}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.05 }}
              className="glass-card flex h-full flex-col gap-4 rounded-2xl p-6"
            >
              <div className="flex items-center justify-between text-xs uppercase tracking-[0.3em] text-slate-400">
                <span>{item.category}</span>
                <span>{formatDate(item.date)}</span>
              </div>
              <h3 className="text-lg font-semibold text-white">{item.title}</h3>
              <p className="text-sm text-slate-300">{item.excerpt}</p>
              {item.link ? (
                <a
                  className="mt-auto inline-flex items-center gap-2 text-sm font-semibold text-white transition hover:text-cyan-200"
                  href={item.link}
                  target="_blank"
                  rel="noreferrer"
                >
                  Read more
                  <span aria-hidden="true">{"->"}</span>
                </a>
              ) : (
                <span className="mt-auto text-xs uppercase tracking-[0.3em] text-slate-500">
                  More soon
                </span>
              )}
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
