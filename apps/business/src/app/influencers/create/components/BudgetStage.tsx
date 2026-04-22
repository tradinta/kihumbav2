"use client";

import { DollarSign, Zap, TrendingUp, ShieldCheck } from "lucide-react";

export default function BudgetStage({ data, updateData }: any) {
  return (
    <div className="space-y-12">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        <div className="space-y-8">
           <div className="space-y-4">
              <label className="text-[10px] font-black uppercase tracking-widest text-muted-custom">Total Campaign Budget</label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-custom text-xs font-black">KES</span>
                <input 
                  type="number" 
                  placeholder="e.g. 250000" 
                  className="w-full bg-white/5 border border-white/10 rounded-xl pl-12 pr-4 py-4 text-sm font-black text-main focus:outline-none focus:border-purple-500/50 transition-all"
                  value={data.budget}
                  onChange={(e) => updateData({ budget: Number(e.target.value) })}
                />
              </div>
           </div>

           <div className="space-y-4">
              <label className="text-[10px] font-black uppercase tracking-widest text-muted-custom">Fee Per Deliverable (Avg)</label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-custom text-xs font-black">KES</span>
                <input 
                  type="number" 
                  placeholder="e.g. 5000" 
                  className="w-full bg-white/5 border border-white/10 rounded-xl pl-12 pr-4 py-4 text-sm font-black text-main focus:outline-none focus:border-purple-500/50 transition-all"
                  value={data.perDeliverableFee}
                  onChange={(e) => updateData({ perDeliverableFee: Number(e.target.value) })}
                />
              </div>
           </div>
        </div>

        <div className="space-y-6">
           <h3 className="text-xs font-black uppercase tracking-widest text-muted-custom">Financial Projection</h3>
           <div className="p-8 rounded-3xl border border-white/5 bg-white/[0.01] space-y-6">
              <div className="flex justify-between items-center text-[11px] font-black uppercase tracking-widest text-muted-custom">
                 <span>Deliverable Capacity</span>
                 <span className="text-white">{(data.budget / (data.perDeliverableFee || 1)).toFixed(0)} Content Units</span>
              </div>
              
              <div className="flex justify-between items-center text-[11px] font-black uppercase tracking-widest text-muted-custom">
                 <span>KPP Service Fee (5%)</span>
                 <span className="text-white">KES {(data.budget * 0.05).toLocaleString()}</span>
              </div>

              <div className="pt-6 border-t border-white/5 flex justify-between items-center">
                 <span className="text-xs font-black uppercase tracking-widest text-purple-500">Total Commitment</span>
                 <span className="text-xl font-black text-white">KES {(data.budget * 1.05).toLocaleString()}</span>
              </div>
           </div>

           <div className="p-6 rounded-2xl border border-emerald-500/20 bg-emerald-500/5 flex items-start gap-4">
              <ShieldCheck size={20} className="text-emerald-500 shrink-0 mt-1" />
              <div>
                 <h4 className="text-[10px] font-black uppercase tracking-widest text-emerald-500 mb-1">Escrow Protected</h4>
                 <p className="text-[11px] font-medium text-main/70 leading-relaxed uppercase">
                    Funds are held in the Kihumba Escrow Vault and only released upon successful deliverable audit and up-time compliance.
                 </p>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
}
