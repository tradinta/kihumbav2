"use client";

import { Target, FileText, Zap } from "lucide-react";

export default function BriefStage({ data, updateData }: any) {
  return (
    <div className="space-y-12">
      <div className="space-y-4">
        <label className="text-[10px] font-black uppercase tracking-widest text-muted-custom">Campaign Narrative Title</label>
        <div className="relative">
          <Target size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-custom" />
          <input 
            type="text" 
            placeholder="e.g. Summer Sneaker Drop 2026" 
            className="w-full bg-white/5 border border-white/10 rounded-xl pl-12 pr-4 py-4 text-sm font-black text-main focus:outline-none focus:border-purple-500/50 transition-all"
            value={data.name}
            onChange={(e) => updateData({ name: e.target.value })}
          />
        </div>
      </div>

      <div className="space-y-4">
        <label className="text-[10px] font-black uppercase tracking-widest text-muted-custom">Campaign Goal & KPI</label>
        <textarea 
          rows={4}
          placeholder="What is the primary objective? (e.g. Drive awareness for the new recycled sole technology)"
          className="w-full bg-white/5 border border-white/10 rounded-2xl p-6 text-sm font-medium text-main focus:outline-none focus:border-purple-500/50 transition-all leading-relaxed"
          value={data.goal}
          onChange={(e) => updateData({ goal: e.target.value })}
        />
      </div>

      <div className="space-y-6">
         <div className="flex items-center justify-between">
            <h3 className="text-[10px] font-black uppercase tracking-widest text-purple-500 flex items-center gap-2">
               <FileText size={14} /> The Message (Talking Points)
            </h3>
            <span className="text-[9px] font-black text-muted-custom uppercase px-2 py-1 bg-white/5 rounded border border-white/10">Creator Guidance</span>
         </div>
         <textarea 
            rows={6}
            placeholder="Key talking points for the creators. (e.g. Comfort, Style, Sustainable Materials)"
            className="w-full bg-white/5 border border-white/10 rounded-2xl p-6 text-sm font-medium text-main focus:outline-none focus:border-purple-500/50 transition-all leading-relaxed"
            value={data.message}
            onChange={(e) => updateData({ message: e.target.value })}
         />
      </div>
    </div>
  );
}
