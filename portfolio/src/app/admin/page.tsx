"use client";

import { Clock, Eye, FileText, LayoutGrid, Sparkles } from "lucide-react";
import { useQuery } from "@tanstack/react-query";

import StatCard from "@/components/admin/StatCard";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { statsService } from "@/lib/services/statsService";
import { contactService } from "@/lib/services/contactService";

export default function AdminDashboardPage() {
  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ["stats"],
    queryFn: statsService.getDashboardStats,
  });

  const { data: messages, isLoading: messagesLoading } = useQuery({
    queryKey: ["contacts"],
    queryFn: contactService.getMessages,
  });

  return (
    <div className="flex flex-col gap-8">
      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
        {statsLoading ? (
          Array.from({ length: 4 }).map((_, idx) => (
            <div
              key={idx}
              className="h-28 rounded-xl border border-slate-800 bg-slate-900/60 animate-pulse"
            />
          ))
        ) : (
          <>
            <StatCard
              title="Total Projects"
              value={stats?.totalProjects ?? 0}
              trend="+12%"
              icon={<LayoutGrid className="h-5 w-5" />}
            />
            <StatCard
              title="Total Skills"
              value={stats?.totalSkills ?? 0}
              trend="+5%"
              icon={<Sparkles className="h-5 w-5" />}
            />
            <StatCard
              title="CV Downloads"
              value={stats?.cvDownloads ?? 0}
              trend="+8%"
              icon={<FileText className="h-5 w-5" />}
            />
            <StatCard
              title="Unread Messages"
              value={stats?.unreadMessages ?? 0}
              trend="+18%"
              icon={<Eye className="h-5 w-5" />}
            />
          </>
        )}
      </div>

      <div className="grid gap-6 lg:grid-cols-[2fr_1fr]">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Recent Activity</CardTitle>
              <p className="text-sm text-slate-400">Latest contact messages</p>
            </div>
            <Clock className="h-5 w-5 text-slate-500" />
          </CardHeader>
          <CardContent className="space-y-4">
            {messagesLoading ? (
              Array.from({ length: 5 }).map((_, idx) => (
                <div
                  key={idx}
                  className="h-16 rounded-lg border border-slate-800 bg-slate-900/60 animate-pulse"
                />
              ))
            ) : (
              (messages || []).slice(0, 5).map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between rounded-lg border border-slate-800 bg-slate-900/60 px-4 py-3"
                >
                  <div>
                    <p className="text-sm text-slate-200">
                      {item.name} — {item.email}
                    </p>
                    <p className="text-xs text-slate-400">{item.message}</p>
                    <p className="text-xs text-slate-500">
                      {new Date(item.created_at).toLocaleString()}
                    </p>
                  </div>
                  <span className="text-xs uppercase tracking-[0.2em] text-slate-500">
                    {item.is_read ? "Read" : "New"}
                  </span>
                </div>
              ))
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <p className="text-sm text-slate-400">Jump into the most common tasks.</p>
          </CardHeader>
          <CardContent className="flex flex-col gap-3">
            <Button asChild>
              <a href="/admin/projects">Add Project</a>
            </Button>
            <Button variant="secondary" asChild>
              <a href="/admin/skills">Add Skill</a>
            </Button>
            <Button variant="secondary" asChild>
              <a href="/admin/messages">View Messages</a>
            </Button>
            <Button variant="outline" asChild>
              <a href="/admin/cv">Update CV</a>
            </Button>
            <Button variant="ghost" asChild>
              <a href="/" target="_blank" rel="noreferrer">
                Preview Site
              </a>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
