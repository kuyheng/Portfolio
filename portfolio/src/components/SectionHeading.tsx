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
  const eyebrowAlignment = align === "left" ? "justify-start" : "justify-center";

  return (
    <div className={`flex flex-col gap-3 ${alignment}`}>
      {eyebrow ? (
        <div className={`flex items-center gap-3 ${eyebrowAlignment}`}>
          <span className="accent-gradient h-px w-10" />
          <span className="text-xs uppercase tracking-[0.32em] text-slate-400">
            {eyebrow}
          </span>
        </div>
      ) : null}
      <h2 className="text-3xl font-semibold tracking-tight text-slate-100 sm:text-4xl lg:text-5xl">
        {title}
      </h2>
      {subtitle ? (
        <p className="max-w-2xl text-base text-slate-400 sm:text-lg">{subtitle}</p>
      ) : null}
    </div>
  );
}
