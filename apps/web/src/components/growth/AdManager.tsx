"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, ArrowLeft, TrendingUp, Anchor, BarChart3, Clock, MonitorPlay } from "lucide-react";
import AdFormatSelector from "./AdFormatSelector";
import { growthData } from "@/data/growthData";

export default function AdManager() {
  const [isCreating, setIsCreating] = useState(false);
  const [selectedFormat, setSelectedFormat] = useState<string | null>(null);

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {!isCreating ? (
        <>
          {/* Dashboard Header */}
          <div className="px-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-bold">Campaigns</h2>
              <p className="text-[10px] uppercase font-bold tracking-widest text-muted-custom">Manage your advertising</p>
            </div>
            <button 
              onClick={() => setIsCreating(true)}
              className="bg-primary-gold text-black px-4 py-2 rounded-lg text-[10px] font-bold uppercase tracking-widest hover:brightness-110 transition-all flex items-center gap-2 w-fit"
            >
              <Plus size={14} /> Create Campaign
            </button>
          </div>

          {/* Quick Stats */}
          <div className="px-4 grid grid-cols-2 lg:grid-cols-4 gap-3">
            {[
              { label: "Active Spend", value: "KES 4,700", icon: TrendingUp },
              { label: "Total Reach", value: "23.1K", icon: BarChart3 },
              { label: "Avg CTR", value: "3.4%", icon: Anchor },
              { label: "Active Ads", value: "2", icon: Clock },
            ].map((stat, i) => (
              <div key={i} className="card-surface p-4 rounded-xl text-center">
                <stat.icon size={16} className="text-primary-gold/40 mx-auto mb-2" />
                <span className="block text-sm font-bold">{stat.value}</span>
                <span className="block text-[8px] font-bold uppercase tracking-widest text-muted-custom mt-1">{stat.label}</span>
              </div>
            ))}
          </div>

          {/* Table */}
          <div className="px-4">
            <div className="card-surface rounded-xl overflow-hidden">
              <div className="w-full overflow-x-auto no-scrollbar">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-custom bg-[var(--pill-bg)]">
                      <th className="p-4 text-[9px] font-bold uppercase tracking-widest text-muted-custom whitespace-nowrap">Campaign Name</th>
                      <th className="p-4 text-[9px] font-bold uppercase tracking-widest text-muted-custom whitespace-nowrap">Format</th>
                      <th className="p-4 text-[9px] font-bold uppercase tracking-widest text-muted-custom whitespace-nowrap">Spend</th>
                      <th className="p-4 text-[9px] font-bold uppercase tracking-widest text-muted-custom whitespace-nowrap">Impressions</th>
                      <th className="p-4 text-[9px] font-bold uppercase tracking-widest text-muted-custom whitespace-nowrap">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {growthData.activeAds.map(ad => (
                      <tr key={ad.id} className="border-b border-custom last:border-0 hover:bg-white/5 transition-colors">
                        <td className="p-4">
                          <span className="text-[11px] font-bold text-primary-gold whitespace-nowrap">{ad.name}</span>
                        </td>
                        <td className="p-4">
                          <span className="text-[10px] font-bold text-muted-custom whitespace-nowrap">{ad.type}</span>
                        </td>
                        <td className="p-4">
                          <span className="text-[11px] font-bold whitespace-nowrap">KES {ad.spend.toLocaleString()}</span>
                        </td>
                        <td className="p-4">
                          <span className="text-[11px] font-bold whitespace-nowrap">{ad.impressions}</span>
                        </td>
                        <td className="p-4">
                          <span className={`px-2 py-0.5 rounded text-[8px] font-bold uppercase tracking-widest border ${
                            ad.status === 'Active' 
                              ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' 
                              : 'bg-primary-gold/10 text-primary-gold border-primary-gold/20'
                          }`}>
                            {ad.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </>
      ) : (
        <div className="px-4 space-y-6">
          <div className="flex items-center gap-3 mb-6">
            <button 
              onClick={() => {
                if (selectedFormat) setSelectedFormat(null);
                else setIsCreating(false);
              }} 
              className="p-2 -ml-2 text-muted-custom hover:text-primary-gold transition-colors rounded-full hover:bg-primary-gold/10"
            >
              <ArrowLeft size={20} />
            </button>
            <div>
              <h2 className="text-lg font-bold">{selectedFormat ? 'Configure Details' : 'Select Ad Format'}</h2>
              <p className="text-[10px] uppercase font-bold tracking-widest text-muted-custom">
                {selectedFormat ? 'Step 2 of 3' : 'Step 1 of 3: Choose placement'}
              </p>
            </div>
          </div>

          <AnimatePresence mode="wait">
            {!selectedFormat ? (
              <motion.div 
                key="selector"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
              >
                <AdFormatSelector onSelect={setSelectedFormat} />
              </motion.div>
            ) : (
              <motion.div 
                key="form"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="card-surface p-6 rounded-xl text-center pb-12"
              >
                <div className="size-16 rounded-full bg-primary-gold/10 border border-primary-gold/30 mx-auto flex items-center justify-center mb-4">
                  <MonitorPlay size={24} className="text-primary-gold" />
                </div>
                <h3 className="text-sm font-bold text-primary-gold uppercase tracking-widest mb-2">Campaign Drafted</h3>
                <p className="text-[11px] font-bold text-muted-custom leading-relaxed max-w-sm mx-auto mb-6">
                  You selected a format. From here, advertisers would upload media, set their KES budget, select target demographics (county, interests), and launch.
                </p>
                <button 
                  onClick={() => setIsCreating(false)}
                  className="bg-primary-gold text-black px-6 py-2 rounded-lg text-[10px] font-bold uppercase tracking-widest hover:brightness-110 transition-all"
                >
                  Return to Dashboard
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}

    </div>
  );
}
