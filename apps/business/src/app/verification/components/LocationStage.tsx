"use client";

import { MapPin } from "lucide-react";

export default function LocationStage({ data, updateData }: any) {
  return (
    <div className="space-y-12">
      <div>
        <h2 className="text-4xl font-black tracking-tighter leading-none mb-4">Define your operations hub.</h2>
        <p className="text-sm font-medium text-muted-custom">Physical presence is required for Marketplace logistics and Kao targeting.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-6">
          <div className="space-y-4">
            <label className="text-[10px] font-black uppercase tracking-widest text-muted-custom">City / Region</label>
            <select 
              value={data.city}
              onChange={(e) => updateData({ city: e.target.value })}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-6 py-4 text-sm font-black text-main focus:outline-none transition-all appearance-none"
            >
              <option>Nairobi</option>
              <option>Mombasa</option>
              <option>Kisumu</option>
              <option>Nakuru</option>
            </select>
          </div>
          <div className="space-y-4">
            <label className="text-[10px] font-black uppercase tracking-widest text-muted-custom">Street / Neighborhood</label>
            <input 
              type="text" 
              placeholder="e.g. Westlands, Lower Kabete Rd" 
              className="w-full bg-white/5 border border-white/10 rounded-xl px-6 py-4 text-sm font-black text-main focus:outline-none focus:border-primary-gold/50 transition-all"
              value={data.street}
              onChange={(e) => updateData({ street: e.target.value })}
            />
          </div>
          <div className="space-y-4">
            <label className="text-[10px] font-black uppercase tracking-widest text-muted-custom">Building & Floor</label>
            <input 
              type="text" 
              placeholder="e.g. Global Trade Centre, 14th Floor" 
              className="w-full bg-white/5 border border-white/10 rounded-xl px-6 py-4 text-sm font-black text-main focus:outline-none focus:border-primary-gold/50 transition-all"
              value={data.building}
              onChange={(e) => updateData({ building: e.target.value })}
            />
          </div>
        </div>

        <div className="aspect-square bg-white/5 rounded-2xl border border-white/10 flex flex-col items-center justify-center p-10 text-center gap-6 group cursor-crosshair relative overflow-hidden">
          <div className="absolute inset-0 opacity-[0.1] bg-[url('https://maps.googleapis.com/maps/api/staticmap?center=-1.286389,36.817223&zoom=13&size=600x600&maptype=roadmap')] bg-cover" />
          <MapPin size={48} className="text-primary-gold relative z-10 animate-bounce" />
          <div className="relative z-10">
            <p className="text-xs font-black uppercase tracking-widest mb-2">Location Lock</p>
            <p className="text-[10px] font-medium text-muted-custom">Click to pinpoint your precise business entry for delivery fleets.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
