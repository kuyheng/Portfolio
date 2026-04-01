import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-full border border-slate-700 px-2.5 py-0.5 text-xs font-semibold text-slate-200",
  {
    variants: {
      variant: {
        default: "bg-slate-800/60",
        accent: "bg-blue-500/20 text-blue-200 border-blue-500/40",
        success: "bg-emerald-500/20 text-emerald-200 border-emerald-500/40",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />;
}

export { Badge, badgeVariants };
