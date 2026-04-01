"use client";

import { useQuery } from "@tanstack/react-query";
import { analyticsService } from "@/lib/services/analyticsService";
import { Card } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

type AnalyticsSummary = {
  totalViews: number;
  uniqueVisitors: number;
  byDevice: Record<string, number>;
  recent: Array<{
    id: number;
    path: string;
    device_type: string;
    ip: string;
    user_agent: string;
    referrer: string;
    created_at: string;
  }>;
};

const deviceLabels: Record<string, string> = {
  desktop: "Desktop",
  mobile: "Mobile",
  tablet: "Tablet",
  bot: "Bot",
  other: "Other",
};

export default function AdminAnalyticsPage() {
  const { data, isLoading } = useQuery({
    queryKey: ["analytics"],
    queryFn: analyticsService.getSummary,
  });

  const summary = data as AnalyticsSummary | undefined;
  const devices = summary?.byDevice || {};

  return (
    <div className="grid gap-6">
      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
        <Card className="p-6">
          <p className="text-xs uppercase tracking-[0.3em] text-slate-500">Total Visits</p>
          <p className="mt-2 text-3xl font-semibold text-white">{summary?.totalViews ?? 0}</p>
        </Card>
        <Card className="p-6">
          <p className="text-xs uppercase tracking-[0.3em] text-slate-500">Unique Visitors</p>
          <p className="mt-2 text-3xl font-semibold text-white">{summary?.uniqueVisitors ?? 0}</p>
        </Card>
        <Card className="p-6">
          <p className="text-xs uppercase tracking-[0.3em] text-slate-500">Mobile Visits</p>
          <p className="mt-2 text-3xl font-semibold text-white">{devices.mobile ?? 0}</p>
        </Card>
        <Card className="p-6">
          <p className="text-xs uppercase tracking-[0.3em] text-slate-500">Desktop Visits</p>
          <p className="mt-2 text-3xl font-semibold text-white">{devices.desktop ?? 0}</p>
        </Card>
      </div>

      <Card className="p-6">
        <div>
          <h2 className="text-xl font-semibold text-white">Recent Visits</h2>
          <p className="text-sm text-slate-400">Latest visitors and their devices.</p>
        </div>
        <div className="mt-4">
          {isLoading ? (
            <div className="space-y-3">
              {Array.from({ length: 6 }).map((_, idx) => (
                <div key={idx} className="h-14 rounded-xl bg-slate-900/60 animate-pulse" />
              ))}
            </div>
          ) : summary?.recent?.length ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Device</TableHead>
                  <TableHead>Path</TableHead>
                  <TableHead>Referrer</TableHead>
                  <TableHead>IP</TableHead>
                  <TableHead>Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {summary.recent.map((visit) => (
                  <TableRow key={visit.id}>
                    <TableCell className="text-slate-200">
                      {deviceLabels[visit.device_type] || visit.device_type || "Other"}
                    </TableCell>
                    <TableCell className="text-slate-300">{visit.path}</TableCell>
                    <TableCell className="max-w-[240px] truncate text-slate-400">
                      {visit.referrer || "-"}
                    </TableCell>
                    <TableCell className="text-slate-400">{visit.ip || "-"}</TableCell>
                    <TableCell className="text-slate-400">
                      {new Date(visit.created_at).toLocaleString()}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="rounded-xl border border-dashed border-slate-800 bg-slate-900/40 p-6 text-sm text-slate-400">
              No visits tracked yet.
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}
