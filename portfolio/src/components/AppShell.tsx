"use client";

import { useEffect, useState } from "react";
import LoadingScreen from "@/components/LoadingScreen";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import About from "@/components/About";
import Projects from "@/components/Projects";
import News from "@/components/News";
import Skills from "@/components/Skills";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";
import { usePortfolioData } from "@/hooks/usePortfolioData";
import { analyticsService } from "@/lib/services/analyticsService";

export default function AppShell() {
  const { data, isLoading } = usePortfolioData();
  const [loading, setLoading] = useState(true);
  const [theme, setTheme] = useState<"dark" | "light">("dark");

  useEffect(() => {
    if (!isLoading) {
      setLoading(false);
    }
  }, [isLoading]);

  useEffect(() => {
    const visited = window.localStorage.getItem("portfolio-visited");
    if (visited) {
      setLoading(false);
      return;
    }

    const timer = window.setTimeout(() => {
      window.localStorage.setItem("portfolio-visited", "true");
      setLoading(false);
    }, 1200);

    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.sessionStorage.getItem("portfolio-tracked")) return;
    window.sessionStorage.setItem("portfolio-tracked", "true");
    analyticsService
      .trackVisit({
        path: window.location.pathname,
        referrer: document.referrer || "",
      })
      .catch(() => null);
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const stored = window.localStorage.getItem("portfolio-theme");
    if (stored === "light" || stored === "dark") {
      setTheme(stored);
    }
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    window.localStorage.setItem("portfolio-theme", theme);
  }, [theme]);

  return (
    <div
      className="portfolio-root relative flex min-h-screen flex-col"
      data-theme={theme}
    >
      <LoadingScreen show={loading} />
      <Navbar
        siteName={data.profile.name}
        cvUrl={data.cvUrl}
        theme={theme}
        onToggleTheme={() =>
          setTheme((prev) => (prev === "dark" ? "light" : "dark"))
        }
      />
      <main className="flex-1">
        <Hero profile={data.profile} hero={data.hero} cvUrl={data.cvUrl} />
        <About profile={data.profile} about={data.about} stats={data.stats} />
        <Projects projects={data.projects} />
        <News news={data.news} />
        <Skills skills={data.skills} />
        <Contact profile={data.profile} />
      </main>
      <Footer siteName={data.profile.name} />
    </div>
  );
}
