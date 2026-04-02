"use client";

import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";

const links = [
  { label: "Home", href: "#home" },
  { label: "About", href: "#about" },
  { label: "Projects", href: "#projects" },
  { label: "News", href: "#news" },
  { label: "Skills", href: "#skills" },
  { label: "Contact", href: "#contact" },
];

type NavbarProps = {
  siteName: string;
  cvUrl: string;
  theme: "dark" | "light";
  onToggleTheme: () => void;
};

export default function Navbar({ siteName, cvUrl, theme, onToggleTheme }: NavbarProps) {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 40);
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <div className="fixed left-1/2 top-6 z-50 w-[90%] max-w-3xl -translate-x-1/2">
        <nav
          className={`glass-card flex items-center justify-between rounded-full px-6 py-3 transition-all duration-300 ${
            scrolled ? "bg-white/10 border-white/20" : "bg-white/5"
          }`}
        >
          <span className="text-sm font-semibold uppercase tracking-[0.3em] text-slate-300">
            {siteName}
          </span>
          <div className="hidden items-center gap-5 md:flex">
            <ul className="flex items-center gap-6">
              {links.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    className="text-sm font-medium text-slate-300 transition hover:text-white"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
            <button
              className="flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white transition hover:border-white/30"
              aria-label="Toggle theme"
              onClick={onToggleTheme}
            >
              {theme === "light" ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
            </button>
          </div>
          <div className="flex items-center gap-3 md:hidden">
            <button
              className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white"
              aria-label="Toggle theme"
              onClick={onToggleTheme}
            >
              {theme === "light" ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
            </button>
            <button
              className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white"
              aria-label="Toggle navigation"
              onClick={() => setOpen((prev) => !prev)}
            >
              <span className="sr-only">Menu</span>
              <div className="flex flex-col gap-1">
                <span className="h-0.5 w-5 rounded bg-white" />
                <span className="h-0.5 w-5 rounded bg-white" />
                <span className="h-0.5 w-5 rounded bg-white" />
              </div>
            </button>
          </div>
        </nav>
      </div>

      <a
        href={cvUrl}
        download
        className="accent-gradient fixed right-6 top-6 z-50 hidden items-center gap-2 rounded-full px-5 py-2 text-sm font-semibold text-white shadow-lg shadow-cyan-500/20 transition hover:shadow-cyan-500/40 lg:flex"
      >
        Download CV
      </a>

      {open ? (
        <div className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm md:hidden">
          <div className="glass-card absolute right-4 top-20 w-[85%] rounded-2xl p-6">
            <div className="flex items-center justify-between">
              <span className="text-xs uppercase tracking-[0.4em] text-slate-400">
                Navigation
              </span>
              <button
                className="rounded-full border border-white/10 p-2"
                onClick={() => setOpen(false)}
              >
                X
              </button>
            </div>
            <ul className="mt-6 flex flex-col gap-4">
              {links.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    className="text-base font-medium text-slate-200"
                    onClick={() => setOpen(false)}
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
            <button
              className="mt-5 flex w-full items-center justify-center gap-2 rounded-full border border-white/10 bg-white/5 px-5 py-2 text-sm font-semibold text-white"
              onClick={() => {
                onToggleTheme();
                setOpen(false);
              }}
            >
              {theme === "light" ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
              Switch Theme
            </button>
            <a
              href={cvUrl}
              download
              className="accent-gradient mt-6 inline-flex items-center justify-center rounded-full px-5 py-2 text-sm font-semibold text-white"
            >
              Download CV
            </a>
          </div>
        </div>
      ) : null}
    </>
  );
}
