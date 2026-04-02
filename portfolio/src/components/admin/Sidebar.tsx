"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

import {
  ExternalLink,
  FileText,
  LayoutDashboard,
  LogOut,
  Mail,
  Monitor,
  Settings,
  Sparkles,
  FolderKanban,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

import { cn } from "@/lib/utils";
import { useAuth } from "@/hooks/useAuth";

const navItems = [
  { label: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { label: "Projects", href: "/admin/projects", icon: FolderKanban },
  { label: "Skills", href: "/admin/skills", icon: Sparkles },
  { label: "Messages", href: "/admin/messages", icon: Mail },
  { label: "Analytics", href: "/admin/analytics", icon: Monitor },
  { label: "CV", href: "/admin/cv", icon: FileText },
  { label: "Settings", href: "/admin/settings", icon: Settings },
  { label: "Preview Site", href: "/", icon: ExternalLink, external: true },
];


type SidebarContentProps = {
  collapsed: boolean;
  onNavigate?: () => void;
};

export function SidebarContent({ collapsed, onNavigate }: SidebarContentProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { logout } = useAuth();

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  return (
    <div className="flex h-full flex-col">
      <div className={cn("flex items-center gap-3 px-4 py-6", collapsed && "justify-center")}>
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-500 text-white">K</div>
        {!collapsed && (
          <div>
            <p className="text-sm font-semibold text-white">Portfolio Admin</p>
            <p className="text-xs text-slate-400">Control center</p>
          </div>
        )}
      </div>

      <nav className={cn("flex flex-1 flex-col gap-2 px-3", collapsed && "items-center")}>
        {navItems.map((item) => {
          const isActive = item.href === "/admin"
            ? pathname === "/admin"
            : pathname.startsWith(item.href);

          const content = (
            <div
              className={cn(
                "flex items-center gap-3 rounded-full px-4 py-2 text-sm text-slate-200 transition",
                isActive ? "bg-cyan-500/20 text-cyan-200" : "hover:bg-slate-800",
                collapsed && "justify-center px-3"
              )}
            >
              <item.icon className="h-4 w-4" />
              {!collapsed && <span>{item.label}</span>}
            </div>
          );

          if (item.external) {
            return (
              <a
                key={item.label}
                href={item.href}
                target="_blank"
                rel="noreferrer"
                onClick={onNavigate}
              >
                {content}
              </a>
            );
          }

          return (
            <Link key={item.label} href={item.href} onClick={onNavigate}>
              {content}
            </Link>
          );
        })}
      </nav>

      <div className={cn("px-4 pb-6", collapsed && "flex justify-center")}>
        <button
          className={cn(
            "flex w-full items-center gap-3 rounded-full px-4 py-2 text-sm text-slate-200 hover:bg-slate-800",
            collapsed && "justify-center px-3"
          )}
          onClick={handleLogout}
        >
          <LogOut className="h-4 w-4" />
          {!collapsed && "Logout"}
        </button>
      </div>
    </div>
  );
}

type SidebarProps = {
  collapsed: boolean;
  onToggle: () => void;
};

export default function Sidebar({ collapsed, onToggle }: SidebarProps) {

  return (
    <aside
      className={cn(
        "hidden lg:fixed lg:inset-y-0 lg:flex lg:flex-col bg-slate-900 border-r border-slate-800 transition-all",
        collapsed ? "lg:w-20" : "lg:w-72"
      )}
    >
      <SidebarContent collapsed={collapsed} />
      <button
        className={cn(
          "absolute -right-4 top-10 flex h-8 w-8 items-center justify-center rounded-full border border-slate-700 bg-slate-900 text-slate-200 shadow",
          collapsed && "rotate-180"
        )}
        onClick={onToggle}
      >
        {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
      </button>
    </aside>
  );
}
