type SectionHeadingProps = {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  align?: "left" | "center";
};

export default function SectionHeading({
  eyebrow,
  title,
  subtitle,
  align = "center",
}: SectionHeadingProps) {
  const alignment = align === "left" ? "items-start text-left" : "items-center text-center";

  return (
    <div className={`flex flex-col gap-3 ${alignment}`}>
      {eyebrow ? (
        <span className="text-xs uppercase tracking-[0.4em] text-slate-400">
          {eyebrow}
        </span>
      ) : null}
      <h2 className="text-3xl font-semibold text-slate-100 sm:text-4xl">{title}</h2>
      {subtitle ? (
        <p className="max-w-2xl text-base text-slate-400 sm:text-lg">{subtitle}</p>
      ) : null}
    </div>
  );
}
