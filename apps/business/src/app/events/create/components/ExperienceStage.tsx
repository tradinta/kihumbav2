"use client";

import { Plus, Trash2, Clock, Music, FileText, ChevronRight } from "lucide-react";

export default function EventExperienceStage({ data, updateData }: any) {
  const addScheduleItem = () => {
    updateData({ 
      schedule: [...data.schedule, { time: '', title: '' }] 
    });
  };

  const removeScheduleItem = (index: number) => {
    const newSchedule = [...data.schedule];
    newSchedule.splice(index, 1);
    updateData({ schedule: newSchedule });
  };

  const updateScheduleItem = (index: number, updates: any) => {
    const newSchedule = [...data.schedule];
    newSchedule[index] = { ...newSchedule[index], ...updates };
    updateData({ schedule: newSchedule });
  };

  return (
    <div className="space-y-12">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
           <h3 className="text-xs font-black uppercase tracking-widest text-muted-custom flex items-center gap-2">
              <Clock size={14} /> Chronological Schedule
           </h3>
           <button 
             onClick={addScheduleItem}
             className="text-[10px] font-black uppercase tracking-widest text-primary-gold hover:underline transition-all flex items-center gap-1"
           >
              <Plus size={14} /> Add Item
           </button>
        </div>
        
        <div className="space-y-3">
          {data.schedule.map((item: any, idx: number) => (
            <div key={idx} className="flex items-center gap-3 group">
               <div className="w-24 shrink-0">
                  <input 
                    type="text" 
                    placeholder="8:00 PM" 
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-[10px] font-black text-main focus:outline-none focus:border-primary-gold/50 transition-all font-mono"
                    value={item.time}
                    onChange={(e) => updateScheduleItem(idx, { time: e.target.value })}
                  />
               </div>
               <div className="flex-1">
                  <input 
                    type="text" 
                    placeholder="e.g. Doors Open / Main Performance" 
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-[11px] font-black text-main focus:outline-none focus:border-primary-gold/50 transition-all"
                    value={item.title}
                    onChange={(e) => updateScheduleItem(idx, { title: e.target.value })}
                  />
               </div>
               <button 
                 onClick={() => removeScheduleItem(idx)}
                 className="p-2 rounded-lg hover:bg-white/5 text-muted-custom hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all"
               >
                  <Trash2 size={16} />
               </button>
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-6">
         <h3 className="text-xs font-black uppercase tracking-widest text-muted-custom flex items-center gap-2">
            <FileText size={14} /> The Narrative (About)
         </h3>
         <textarea 
            rows={8}
            placeholder="Tell people why they should attend this experience. What makes it unique?"
            className="w-full bg-white/5 border border-white/10 rounded-2xl p-6 text-sm font-medium text-main focus:outline-none focus:border-primary-gold/50 transition-all leading-relaxed custom-scrollbar"
            value={data.about}
            onChange={(e) => updateData({ about: e.target.value })}
         />
         <div className="flex items-center gap-2 text-[9px] font-bold text-muted-custom uppercase tracking-widest">
            <span className="px-1.5 py-0.5 rounded border border-white/10">Markdown Supported</span>
            <span>Min 100 characters for optimal discovery.</span>
         </div>
      </div>

      <div className="space-y-6">
         <div className="flex items-center justify-between">
            <h3 className="text-xs font-black uppercase tracking-widest text-muted-custom flex items-center gap-2">
               <Music size={14} /> Artist Lineup (Optional)
            </h3>
            <button className="text-[10px] font-black uppercase tracking-widest text-primary-gold hover:underline transition-all flex items-center gap-1">
               <Plus size={14} /> Add Artist
            </button>
         </div>
         <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 rounded-xl border border-dashed border-white/10 bg-white/[0.02] flex items-center justify-center gap-3 group cursor-pointer hover:bg-white/5 transition-all">
               <div className="size-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-muted-custom">
                  <Plus size={18} />
               </div>
               <p className="text-[10px] font-black uppercase tracking-widest text-muted-custom">Upload Artist Profile</p>
            </div>
         </div>
      </div>
    </div>
  );
}
