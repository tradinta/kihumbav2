"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, ArrowLeft, Anchor, MousePointer2, Users } from "lucide-react";
import AdFormatSelector from "@/components/growth/AdFormatSelector";
import { businessData } from "@/data/businessData";

export default function AdsManager() {
  const [isCreating, setIsCreating] = useState(false);
  const { activeAds } = businessData;

  const StatusPill = ({ status }: { status: string }) => {
    const isPaused = status === "Paused";
    return (
      <span className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-widest border ${
        isPaused ? 'bg-amber-500/10 text-amber-500 border-amber-500/20' : 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20'
      }`}>
        {status}
      </span>
    );
  };

  return (
    <div className="relative overflow-hidden min-h-full pb-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <AnimatePresence mode="wait">
        {!isCreating ? (
          <motion.div
            key="dashboard"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-black tracking-tight mb-1">Ads Manager</h2>
                <p className="text-[11px] font-bold text-muted-custom uppercase tracking-widest">
                  Manage self-serve programmatic campaigns
                </p>
              </div>
              <button 
                onClick={() => setIsCreating(true)}
                className="bg-blue-500 text-white px-4 py-2.5 rounded-lg flex items-center justify-center gap-2 hover:bg-blue-600 transition-colors shadow-lg shadow-blue-500/20 group"
              >
                <Plus size={16} className="group-hover:rotate-90 transition-transform" />
                <span className="text-[10px] font-bold uppercase tracking-widest">Create Ad</span>
              </button>
            </div>

            <div className="card-surface rounded-xl border border-custom overflow-hidden">
              <div className="w-full overflow-x-auto no-scrollbar">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-custom bg-[var(--pill-bg)]">
                      <th className="p-4 text-[10px] font-bold uppercase tracking-widest text-muted-custom">Campaign Name</th>
                      <th className="p-4 text-[10px] font-bold uppercase tracking-widest text-muted-custom">Format</th>
                      <th className="p-4 text-[10px] font-bold uppercase tracking-widest text-muted-custom">Status</th>
                      <th className="p-4 text-[10px] font-bold uppercase tracking-widest text-muted-custom text-right">Spend</th>
                      <th className="p-4 text-[10px] font-bold uppercase tracking-widest text-muted-custom text-right">Reach</th>
                      <th className="p-4 text-[10px] font-bold uppercase tracking-widest text-muted-custom text-right">CPC</th>
                    </tr>
                  </thead>
                  <tbody>
                    {activeAds.map((ad, i) => (
                      <motion.tr 
                        key={ad.id}
                        initial={{ opacity: 0, y: 5 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.05 }}
                        className="border-b border-custom/50 hover:bg-white/5 transition-colors cursor-pointer"
                      >
                        <td className="p-4">
                          <span className="text-[12px] font-bold text-main">{ad.name}</span>
                        </td>
                        <td className="p-4">
                          <span className="text-[11px] font-bold text-muted-custom">{ad.type}</span>
                        </td>
                        <td className="p-4">
                          <StatusPill status={ad.status} />
                        </td>
                        <td className="p-4 text-right">
                          <span className="text-[11px] font-bold">KES {ad.spend.toLocaleString()}</span>
                        </td>
                        <td className="p-4 text-right">
                          <span className="text-[11px] font-bold">{ad.reach.toLocaleString()}</span>
                        </td>
                        <td className="p-4 text-right">
                          <span className="text-[11px] font-bold text-emerald-400">KES {ad.cpc}</span>
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="builder"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="space-y-6"
          >
            <button 
              onClick={() => setIsCreating(false)}
              className="flex items-center gap-2 text-[10px] font-bold text-muted-custom hover:text-main transition-colors uppercase tracking-widest group"
            >
              <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" /> Back to Dashboard
            </button>
            <AdFormatSelector onSelect={(format) => alert(`Selected ${format}. Proceeding to targeting...`)} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
