"use client";

import { useEffect } from "react";
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
import { useLocalStorageState } from "@/hooks/useLocalStorageState";
import { analyticsService } from "@/lib/services/analyticsService";

export default function AppShell() {
  const { data, isLoading } = usePortfolioData();
  const [hasVisited, setHasVisited] = useLocalStorageState("portfolio-visited", false, {
    serialize: (value) => String(value),
    deserialize: (value) => value === "true",
  });
  const [theme, setTheme] = useLocalStorageState<"dark" | "light">(
    "portfolio-theme",
    "dark",
    {
      serialize: (value) => value,
      deserialize: (value) => (value === "light" || value === "dark" ? value : "dark"),
    }
  );
  const loading = isLoading || !hasVisited;

  useEffect(() => {
    if (hasVisited) return;

    const timer = window.setTimeout(() => {
      setHasVisited(true);
    }, 1200);

    return () => window.clearTimeout(timer);
  }, [hasVisited, setHasVisited]);

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
        <About data={data.about} />
        <Projects projects={data.projects} />
        <News news={data.news} />
        <Skills skills={data.skills} />
        <Contact profile={data.profile} />
      </main>
      <Footer siteName={data.profile.name} />
    </div>
  );
}
