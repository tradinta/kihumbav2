"use client";

import { BarChart3, Eye, TrendingUp } from "lucide-react";

interface ImpressionsBarProps {
  count: string;
  icon?: "chart" | "eye";
  trending?: string;
}

export default function ImpressionsBar({ count, icon = "chart", trending }: ImpressionsBarProps) {
  return (
    <div className="px-4 py-2.5 flex items-center justify-between border-y border-custom bg-black/5">
      <div className="flex items-center gap-2">
        {icon === "chart" ? (
          <BarChart3 size={14} className="text-primary-gold" />
        ) : (
          <Eye size={14} className="text-primary-gold" />
        )}
        <span className="text-[10px] font-bold uppercase tracking-widest text-muted-custom">
          {count} Impressions
        </span>
      </div>
      {trending && (
        <div className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-primary-gold/10 border border-primary-gold/20">
          <TrendingUp size={10} className="text-primary-gold" />
          <span className="text-[9px] font-bold text-primary-gold uppercase tracking-wider">{trending}</span>
        </div>
      )}
    </div>
  );
}
