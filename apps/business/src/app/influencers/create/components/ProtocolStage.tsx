"use client";

import { CheckCircle2, Zap, Clock, MessageSquare, Video, Layout } from "lucide-react";

export default function ProtocolStage({ data, updateData }: any) {
  const TYPES = [
    { id: "post", label: "Image Post", icon: <Layout size={18} /> },
    { id: "video", label: "Video Post / Short", icon: <Video size={18} /> },
    { id: "comment", label: "Pinned Comment", icon: <MessageSquare size={18} /> },
  ];

  return (
    <div className="space-y-12">
      <div className="space-y-4">
        <label className="text-[10px] font-black uppercase tracking-widest text-muted-custom">Deliverable Protocol Type</label>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {TYPES.map(type => (
            <button 
              key={type.id}
              onClick={() => updateData({ deliverableType: type.id })}
              className={`p-6 rounded-2xl border text-left transition-all flex flex-col gap-4 group ${
                data.deliverableType === type.id 
                  ? "bg-purple-500/10 border-purple-500 text-white" 
                  : "bg-white/5 border-white/10 text-muted-custom hover:border-white/20"
              }`}
            >
              <div className={`size-10 rounded-xl flex items-center justify-center transition-colors ${
                data.deliverableType === type.id ? "bg-purple-500 text-white" : "bg-white/5 text-muted-custom"
              }`}>
                {type.icon}
              </div>
              <div>
                 <h4 className="text-[11px] font-black uppercase tracking-widest">{type.label}</h4>
                 <p className="text-[9px] font-bold text-muted-custom uppercase mt-1 group-hover:text-muted-custom/80">KPP Verified</p>
              </div>
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
         <div className="space-y-8">
            <div className="space-y-4">
               <label className="text-[10px] font-black uppercase tracking-widest text-muted-custom">Mandatory Content Rules</label>
               <div className="space-y-3">
                  {[
                    "Tag the Brand Profile",
                    "Include Campaign #Hashtags",
                    "Pin the Comment for 24h",
                    "Link in Bio / Profile"
                  ].map(rule => (
                    <label key={rule} className="flex items-center gap-3 p-4 rounded-xl bg-white/5 border border-white/5 cursor-pointer hover:bg-white/10 transition-all">
                       <input 
                         type="checkbox" 
                         className="size-4 rounded border-white/10 bg-white/5 text-purple-500 focus:ring-purple-500"
                         checked={data.rules.includes(rule)}
                         onChange={(e) => {
                            const rules = e.target.checked 
                              ? [...data.rules, rule]
                              : data.rules.filter((r: string) => r !== rule);
                            updateData({ rules });
                         }}
                       />
                       <span className="text-[11px] font-black uppercase tracking-widest text-main">{rule}</span>
                    </label>
                  ))}
               </div>
            </div>
         </div>

         <div className="space-y-8">
            <div className="space-y-4">
               <label className="text-[10px] font-black uppercase tracking-widest text-muted-custom flex items-center gap-2">
                  <Clock size={14} className="text-purple-500" /> Compliance Up-time
               </label>
               <div className="space-y-4">
                  <input 
                    type="range" 
                    min="1" 
                    max="30" 
                    className="w-full h-1.5 bg-white/5 rounded-full appearance-none cursor-pointer accent-purple-500"
                    value={data.uptimeDays}
                    onChange={(e) => updateData({ uptimeDays: Number(e.target.value) })}
                  />
                  <div className="flex justify-between items-center">
                     <p className="text-2xl font-black text-white">{data.uptimeDays} Days</p>
                     <span className="text-[9px] font-black text-muted-custom uppercase px-2 py-1 bg-white/5 rounded border border-white/10 tracking-widest">Post Persistence</span>
                  </div>
               </div>
            </div>

            <div className="p-6 rounded-2xl border border-purple-500/20 bg-purple-500/5 space-y-3">
               <div className="flex items-center gap-2 text-purple-500">
                  <Zap size={18} />
                  <h4 className="text-[10px] font-black uppercase tracking-widest">KPP Content Guard</h4>
               </div>
               <p className="text-[11px] font-medium text-main/80 leading-relaxed uppercase">
                  Our system will automatically monitor the creator's profile daily. Payouts are forfeited if content is removed before the **{data.uptimeDays} Day** threshold.
               </p>
            </div>
         </div>
      </div>
    </div>
  );
}
