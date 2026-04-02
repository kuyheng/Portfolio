"use client";

type ToolboxSectionProps = {
  title: string;
  description?: string;
  items: ReadonlyArray<{ id: string; label: string }>;
};

export default function ToolboxSection({ title, description, items }: ToolboxSectionProps) {
  if (!items.length) return null;

  return (
    <div className="glass-card rounded-2xl p-6">
      <h3 className="text-lg font-semibold text-white">{title}</h3>
      {description ? (
        <p className="mt-2 text-sm text-slate-400">{description}</p>
      ) : null}
      <div className="mt-4 flex flex-wrap gap-2">
      {items.map((tool) => (
        <span
          key={tool.id}
          className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs uppercase tracking-[0.2em] text-slate-300"
        >
          {tool.label}
        </span>
      ))}
      </div>
    </div>
  );
}
