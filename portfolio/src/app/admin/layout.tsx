"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";

import Sidebar from "@/components/admin/Sidebar";
import AdminTopbar from "@/components/admin/Topbar";
import { cn } from "@/lib/utils";
import ProtectedRoute from "@/components/ProtectedRoute";

const COLLAPSE_KEY = "admin-sidebar-collapsed";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);
  const isLogin = pathname === "/admin/login";

  useEffect(() => {
    if (typeof window === "undefined") return;
    const stored = window.localStorage.getItem(COLLAPSE_KEY);
    setCollapsed(stored === "true");
  }, []);

  const handleToggle = () => {
    setCollapsed((prev) => {
      const next = !prev;
      if (typeof window !== "undefined") {
        window.localStorage.setItem(COLLAPSE_KEY, String(next));
      }
      return next;
    });
  };

  if (isLogin) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100">
        {children}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <ProtectedRoute>
        <Sidebar collapsed={collapsed} onToggle={handleToggle} />
        <div className={cn("transition-all", collapsed ? "lg:pl-20" : "lg:pl-72")}>
          <AdminTopbar />
          <AnimatePresence mode="wait">
            <motion.div
              key={pathname}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.3 }}
              className="px-6 py-8"
            >
              {children}
            </motion.div>
          </AnimatePresence>
        </div>
      </ProtectedRoute>
    </div>
  );
}
