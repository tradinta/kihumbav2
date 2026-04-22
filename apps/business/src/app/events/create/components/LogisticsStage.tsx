"use client";

import { Calendar, MapPin, Map, Clock } from "lucide-react";

export default function EventLogisticsStage({ data, updateData }: any) {
  return (
    <div className="space-y-12">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-4">
          <label className="text-[10px] font-black uppercase tracking-widest text-muted-custom">Event Date</label>
          <div className="relative">
            <Calendar size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-custom" />
            <input 
              type="date" 
              className="w-full bg-white/5 border border-white/10 rounded-xl pl-12 pr-4 py-4 text-sm font-black text-main focus:outline-none focus:border-primary-gold/50 transition-all appearance-none"
              value={data.date}
              onChange={(e) => updateData({ date: e.target.value })}
            />
          </div>
        </div>

        <div className="space-y-4">
          <label className="text-[10px] font-black uppercase tracking-widest text-muted-custom">Gate Open Time</label>
          <div className="relative">
            <Clock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-custom" />
            <input 
              type="time" 
              className="w-full bg-white/5 border border-white/10 rounded-xl pl-12 pr-4 py-4 text-sm font-black text-main focus:outline-none focus:border-primary-gold/50 transition-all appearance-none"
              value={data.time}
              onChange={(e) => updateData({ time: e.target.value })}
            />
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <label className="text-[10px] font-black uppercase tracking-widest text-muted-custom">Venue & Neighborhood</label>
        <div className="relative">
          <MapPin size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-custom" />
          <input 
            type="text" 
            placeholder="e.g. Uhuru Gardens, Lang'ata" 
            className="w-full bg-white/5 border border-white/10 rounded-xl pl-12 pr-4 py-4 text-sm font-black text-main focus:outline-none focus:border-primary-gold/50 transition-all"
            value={data.venue}
            onChange={(e) => updateData({ venue: e.target.value })}
          />
        </div>
      </div>

      <div className="aspect-video w-full bg-white/5 rounded-2xl border border-white/10 overflow-hidden relative group cursor-crosshair">
         <div className="absolute inset-0 opacity-[0.2] bg-[url('https://maps.googleapis.com/maps/api/staticmap?center=-1.286389,36.817223&zoom=13&size=800x400&maptype=roadmap&style=feature:all|element:labels|visibility:off')] bg-cover" />
         <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-10 z-10">
            <div className="size-16 rounded-full bg-primary-gold/10 border border-primary-gold/30 flex items-center justify-center text-primary-gold mb-4 group-hover:scale-110 transition-transform">
               <Map size={32} />
            </div>
            <h4 className="text-sm font-black uppercase tracking-widest mb-2">Venue Pin Isolation</h4>
            <p className="text-[10px] font-bold text-muted-custom uppercase tracking-widest max-w-xs">Precise coordinates are required for Kao audience targeting and attendee navigation.</p>
         </div>
         <div className="absolute bottom-6 right-6 px-4 py-2 rounded-lg bg-black border border-white/10 text-[9px] font-black uppercase tracking-widest flex items-center gap-2 z-10">
            <span className="size-2 rounded-full bg-emerald-500 animate-pulse" /> GPS Locked
         </div>
      </div>
    </div>
  );
}
