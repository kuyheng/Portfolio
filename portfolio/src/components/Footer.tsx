"use client";

const links = [
  { label: "Home", href: "#home" },
  { label: "About", href: "#about" },
  { label: "Projects", href: "#projects" },
  { label: "News", href: "#news" },
  { label: "Skills", href: "#skills" },
  { label: "Contact", href: "#contact" },
];

type FooterProps = {
  siteName: string;
};

export default function Footer({ siteName }: FooterProps) {
  return (
    <footer className="border-t border-white/10 py-10">
      <div className="mx-auto flex w-full max-w-6xl flex-col items-center gap-6 px-6 text-center text-sm text-slate-400">
        <span className="text-xs uppercase tracking-[0.4em] text-slate-500">
          {siteName}
        </span>
        <div className="flex flex-wrap items-center justify-center gap-4">
          {links.map((link) => (
            <a key={link.href} href={link.href} className="hover:text-white">
              {link.label}
            </a>
          ))}
        </div>
        <button
          className="rounded-full border border-white/10 px-4 py-2 text-xs uppercase tracking-[0.3em] text-slate-400 transition hover:border-white/30 hover:text-white"
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        >
          Back to top
        </button>
        <span className="text-xs text-slate-500">
          Copyright {new Date().getFullYear()} {siteName}. All rights reserved.
        </span>
      </div>
    </footer>
  );
}
