"use client";

import { useState } from "react";
import { 
  Plus, 
  Search, 
  MoreVertical, 
  BarChart3, 
  Calendar,
  Eye,
  Trash2
} from "lucide-react";
import { useRouter } from "next/navigation";

const MOCK_EVENTS = [
  { id: "EVT-901", name: "Nairobi Jazz Festival", status: "Active", sold: "1,240", capacity: "2,500", revenue: "KES 2.4M", date: "Apr 25, 2026" },
  { id: "EVT-882", name: "Tech Summit 2026", status: "Draft", sold: "0", capacity: "1,000", revenue: "KES 0", date: "May 12, 2026" },
  { id: "EVT-773", name: "Art in the Park", status: "Completed", sold: "450", capacity: "500", revenue: "KES 650k", date: "Mar 10, 2026" },
];

export default function ExperiencesTab() {
  const router = useRouter();

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h2 className="text-2xl font-black tracking-tighter text-white">Experience Ledger</h2>
          <p className="text-xs font-bold text-muted-custom uppercase tracking-widest mt-1">Manage your active and historical event architectures.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 border border-white/5 focus-within:border-primary-gold/30 transition-all">
            <Search size={16} className="text-muted-custom" />
            <input 
              type="text" 
              placeholder="Filter experiences..." 
              className="bg-transparent border-none text-[11px] font-black focus:outline-none w-48 uppercase tracking-widest" 
            />
          </div>
          <button 
            onClick={() => router.push("/events/create")}
            className="flex items-center gap-2 px-6 py-3 rounded-xl bg-primary-gold text-black text-[11px] font-black uppercase tracking-widest hover:brightness-110 transition-all"
          >
            <Plus size={16} /> New Experience
          </button>
        </div>
      </div>

      <div className="border border-white/5 rounded-3xl overflow-hidden bg-white/[0.01]">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-white/5 bg-white/[0.02]">
              <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-muted-custom">Experience / ID</th>
              <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-muted-custom">Status</th>
              <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-muted-custom">Schedule</th>
              <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-muted-custom text-right">Attendance Yield</th>
              <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-muted-custom text-right">Revenue</th>
              <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-muted-custom text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {MOCK_EVENTS.map((evt) => (
              <tr key={evt.id} className="hover:bg-white/[0.02] transition-colors group">
                <td className="px-8 py-6">
                  <div className="flex items-center gap-4">
                    <div className="size-10 rounded-xl bg-white/5 flex items-center justify-center text-primary-gold border border-white/5">
                      <Calendar size={18} />
                    </div>
                    <div>
                      <p className="text-[12px] font-black text-white">{evt.name}</p>
                      <p className="text-[9px] font-bold text-muted-custom font-mono mt-0.5 tracking-tighter">{evt.id}</p>
                    </div>
                  </div>
                </td>
                <td className="px-8 py-6">
                  <div className="flex items-center gap-2">
                    <div className={`size-2 rounded-full ${
                      evt.status === 'Active' ? 'bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.3)]' : 
                      evt.status === 'Draft' ? 'bg-amber-500' : 
                      'bg-muted-custom'
                    }`} />
                    <span className="text-[10px] font-black uppercase tracking-widest text-white">{evt.status}</span>
                  </div>
                </td>
                <td className="px-8 py-6 text-[10px] font-black text-muted-custom uppercase tracking-widest">{evt.date}</td>
                <td className="px-8 py-6 text-right">
                  <p className="text-[11px] font-black text-white">{evt.sold} / {evt.capacity}</p>
                  <div className="w-24 h-1 bg-white/5 rounded-full ml-auto mt-2 overflow-hidden border border-white/5">
                    <div 
                      className="h-full bg-primary-gold shadow-[0_0_8px_rgba(255,215,0,0.2)]" 
                      style={{ width: `${(Number(evt.sold.replace(',', '')) / Number(evt.capacity.replace(',', ''))) * 100}%` }} 
                    />
                  </div>
                </td>
                <td className="px-8 py-6 text-right text-[12px] font-black text-primary-gold">{evt.revenue}</td>
                <td className="px-8 py-6 text-center">
                  <div className="flex justify-center gap-1">
                    <button className="p-2.5 rounded-xl hover:bg-white/5 text-muted-custom hover:text-white transition-all">
                      <BarChart3 size={18} />
                    </button>
                    <button className="p-2.5 rounded-xl hover:bg-white/5 text-muted-custom hover:text-white transition-all">
                      <Eye size={18} />
                    </button>
                    <button className="p-2.5 rounded-xl hover:bg-red-500/10 text-muted-custom hover:text-red-500 transition-all opacity-0 group-hover:opacity-100">
                      <Trash2 size={18} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
