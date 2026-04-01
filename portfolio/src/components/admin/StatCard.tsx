import { ReactNode } from "react";

import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";

type StatCardProps = {
  title: string;
  value: string | number;
  icon: ReactNode;
  trend: string;
};

export default function StatCard({ title, value, icon, trend }: StatCardProps) {
  return (
    <Card className="flex items-center justify-between p-6">
      <div>
        <p className="text-xs uppercase tracking-[0.3em] text-slate-500">{title}</p>
        <p className="mt-3 text-3xl font-semibold text-white">{value}</p>
        <Badge variant="accent" className="mt-3">
          {trend}
        </Badge>
      </div>
      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-500/20 text-blue-200">
        {icon}
      </div>
    </Card>
  );
}
