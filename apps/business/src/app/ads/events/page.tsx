"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { 
  Plus, 
  Calendar, 
  ArrowLeft, 
  Ticket,
  Users,
  TrendingUp,
  Award,
  MoreVertical,
  Search,
  Zap,
  MapPin
} from "lucide-react";

const MOCK_EVENT_ADS = [
  { id: "EVT-901", name: "Nairobi Jazz Festival", status: "Active", reach: "85,000", rsvps: "1,240", conv: "1.45%", spend: "KES 25,000", type: "Featured Event" },
  { id: "EVT-882", name: "Tech Summit Sponsor", status: "Active", reach: "42,000", rsvps: "N/A", conv: "0.2%", spend: "KES 15,000", type: "Sponsor Spotlight" },
  { id: "EVT-773", name: "Art in the Park", status: "Completed", reach: "12,000", rsvps: "450", conv: "3.7%", spend: "KES 5,500", type: "Category Banner" },
];

export default function EventsAdsManager() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-main font-inter text-main selection:bg-primary-gold/30">
      <header className="border-b border-custom bg-black/20 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-4">
             <button 
               onClick={() => router.push("/ads")}
               className="p-2 rounded-lg bg-white/5 border border-custom text-muted-custom hover:text-main transition-colors"
             >
                <ArrowLeft size={18} />
             </button>
             <div>
                <h1 className="text-sm font-black uppercase tracking-widest flex items-center gap-2">
                   <Calendar size={16} className="text-primary-gold" /> Experience Manager
                </h1>
                <p className="text-[10px] font-bold text-muted-custom uppercase tracking-widest mt-0.5">Events • Ticket Performance</p>
             </div>
          </div>
          
          <button 
            onClick={() => router.push("/ads/create/events")}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary-gold text-black text-[11px] font-black uppercase tracking-widest hover:brightness-110 transition-all shadow-lg shadow-primary-gold/20"
          >
             <Plus size={16} /> New Event Ad
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-10 space-y-12">
        <section className="grid grid-cols-1 md:grid-cols-4 gap-4">
           <MetricCard label="Total Reach" value="139k" sub="Event discovery" icon={<Users size={18} />} />
           <MetricCard label="RSVPs Generated" value="1.6k" sub="Last 30 Days" icon={<Ticket size={18} />} />
           <MetricCard label="RSVP Rate" value="1.2%" sub="+0.3% vs avg" icon={<TrendingUp size={18} />} />
           <MetricCard label="Total Spent" value="KES 45.5k" sub="Active campaigns" icon={<Zap size={18} />} />
        </section>

        <section className="space-y-6">
           <div className="flex items-center justify-between">
              <h2 className="text-xs font-black uppercase tracking-widest text-muted-custom">Experience Ledger</h2>
              <div className="flex items-center gap-3">
                 <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/5 border border-custom">
                    <Search size={14} className="text-muted-custom" />
                    <input type="text" placeholder="Filter Event ID..." className="bg-transparent border-none text-[10px] font-bold focus:outline-none w-32" />
                 </div>
              </div>
           </div>

           <div className="border border-custom rounded-2xl overflow-hidden bg-white/[0.02]">
              <table className="w-full text-left border-collapse">
                 <thead>
                    <tr className="border-b border-custom bg-white/5">
                       <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-muted-custom">Event / Experience</th>
                       <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-muted-custom">Status</th>
                       <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-muted-custom">Format</th>
                       <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-muted-custom text-right">Reach</th>
                       <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-muted-custom text-right">RSVPs</th>
                       <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-muted-custom text-right">Spend</th>
                       <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-muted-custom text-center">Actions</th>
                    </tr>
                 </thead>
                 <tbody className="divide-y divide-custom">
                    {MOCK_EVENT_ADS.map((ad) => (
                       <tr key={ad.id} className="hover:bg-white/[0.02] transition-colors group">
                          <td className="px-6 py-4">
                             <p className="text-[11px] font-black text-main">{ad.name}</p>
                             <p className="text-[9px] font-bold text-muted-custom font-mono mt-0.5">{ad.id}</p>
                          </td>
                          <td className="px-6 py-4">
                             <div className="flex items-center gap-2">
                                <div className={`size-1.5 rounded-full ${
                                   ad.status === 'Active' ? 'bg-emerald-500' : 
                                   ad.status === 'Paused' ? 'bg-amber-500' : 
                                   'bg-muted-custom'
                                }`} />
                                <span className="text-[10px] font-black uppercase tracking-widest">{ad.status}</span>
                             </div>
                          </td>
                          <td className="px-6 py-4 text-[10px] font-black text-muted-custom uppercase">{ad.type}</td>
                          <td className="px-6 py-4 text-right text-[11px] font-black text-main">{ad.reach}</td>
                          <td className="px-6 py-4 text-right">
                             <p className="text-[11px] font-black text-main">{ad.rsvps}</p>
                             <p className="text-[9px] font-bold text-emerald-500">{ad.conv} Conv.</p>
                          </td>
                          <td className="px-6 py-4 text-right text-[11px] font-black text-primary-gold">{ad.spend}</td>
                          <td className="px-6 py-4 text-center">
                             <button className="p-2 rounded-lg hover:bg-white/5 text-muted-custom hover:text-main transition-colors">
                                <MoreVertical size={16} />
                             </button>
                          </td>
                       </tr>
                    ))}
                 </tbody>
              </table>
           </div>
        </section>
      </main>
    </div>
  );
}

function MetricCard({ label, value, sub, icon }: any) {
   return (
      <div className="p-6 rounded-2xl border border-custom bg-white/[0.02] space-y-4">
         <div className="flex items-center justify-between text-muted-custom">
            <span className="text-[9px] font-black uppercase tracking-widest">{label}</span>
            {icon}
         </div>
         <div>
            <p className="text-2xl font-black text-main tracking-tight">{value}</p>
            <p className="text-[10px] font-bold text-muted-custom mt-1 uppercase tracking-widest">{sub}</p>
         </div>
      </div>
   );
}
