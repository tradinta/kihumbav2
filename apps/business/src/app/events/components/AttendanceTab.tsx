"use client";

import { useState } from "react";
import { 
  Users, 
  CheckCircle2, 
  XCircle, 
  Search, 
  Loader2, 
  ScanLine,
  ChevronRight,
  Filter
} from "lucide-react";

const MOCK_ATTENDEES = [
  { id: "TK-4412", name: "Kuria Kamau", tier: "VIP", status: "Verified", time: "14:20 PM" },
  { id: "TK-5512", name: "Amara Okeke", tier: "Regular", status: "Verified", time: "14:15 PM" },
  { id: "TK-9921", name: "John Doe", tier: "Regular", status: "Pending", time: "-" },
  { id: "TK-1102", name: "Sarah Wanjiku", tier: "VVIP", status: "Verified", time: "14:02 PM" },
];

export default function AttendanceTab() {
  const [isScanning, setIsScanning] = useState(false);

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-500">
      
      {/* Live Gate Status */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <GateCard label="Total Expected" value="1,240" sub="Confirmed Bookings" icon={<Users size={20} />} />
        <GateCard label="Verified Entries" value="842" sub="Checked In" icon={<CheckCircle2 size={20} />} color="text-emerald-500" />
        <GateCard label="Remaining" value="398" sub="Yet to Arrive" icon={<XCircle size={20} />} color="text-amber-500" />
      </div>

      <div className="flex flex-col md:flex-row gap-6">
        {/* Guest List Management */}
        <div className="flex-1 space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-black uppercase tracking-widest text-muted-custom">Live Guest Registry</h3>
            <div className="flex items-center gap-3">
              <div className="relative">
                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-custom" />
                <input 
                  type="text" 
                  placeholder="Search guest or ticket..." 
                  className="pl-10 pr-4 py-2 bg-white/5 border border-white/10 rounded-xl text-[10px] font-black focus:outline-none focus:border-primary-gold/30 w-64 uppercase tracking-widest"
                />
              </div>
              <button className="p-2 rounded-xl bg-white/5 border border-white/10 text-muted-custom hover:text-white transition-all">
                <Filter size={16} />
              </button>
            </div>
          </div>

          <div className="border border-white/5 rounded-3xl overflow-hidden bg-white/[0.01]">
            <table className="w-full text-left border-collapse text-[11px]">
              <thead>
                <tr className="border-b border-white/5 bg-white/[0.02]">
                  <th className="px-6 py-4 font-black uppercase tracking-widest text-muted-custom">Attendee</th>
                  <th className="px-6 py-4 font-black uppercase tracking-widest text-muted-custom">Ticket ID</th>
                  <th className="px-6 py-4 font-black uppercase tracking-widest text-muted-custom">Tier</th>
                  <th className="px-6 py-4 font-black uppercase tracking-widest text-muted-custom text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {MOCK_ATTENDEES.map((att) => (
                  <tr key={att.id} className="hover:bg-white/[0.02] transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="size-8 rounded-lg bg-white/5 border border-white/5 flex items-center justify-center font-black text-primary-gold text-[10px]">
                          {att.name[0]}
                        </div>
                        <span className="font-black text-white">{att.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 font-mono font-bold text-muted-custom tracking-tighter">{att.id}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-0.5 rounded border text-[8px] font-black uppercase tracking-widest ${
                        att.tier === 'VVIP' ? 'border-primary-gold/30 text-primary-gold' : 
                        att.tier === 'VIP' ? 'border-purple-500/30 text-purple-500' : 
                        'border-white/10 text-muted-custom'
                      }`}>
                        {att.tier}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <span className={`text-[9px] font-black uppercase tracking-widest ${
                          att.status === 'Verified' ? 'text-emerald-500' : 'text-muted-custom'
                        }`}>{att.status}</span>
                        {att.status === 'Verified' ? <CheckCircle2 size={14} className="text-emerald-500" /> : <XCircle size={14} className="text-muted-custom" />}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Gate Scanner Interface */}
        <div className="w-full md:w-80 space-y-6">
           <h3 className="text-xs font-black uppercase tracking-widest text-muted-custom">Gate Operations</h3>
           <div className="p-8 rounded-3xl border border-primary-gold/20 bg-primary-gold/5 flex flex-col items-center justify-center text-center gap-6 group cursor-pointer hover:bg-primary-gold/10 transition-all border-dashed overflow-hidden relative">
              <div className="absolute inset-0 bg-gradient-to-b from-primary-gold/5 to-transparent pointer-events-none" />
              <div className="size-20 rounded-2xl bg-primary-gold/20 border border-primary-gold/30 flex items-center justify-center text-primary-gold relative z-10">
                 <ScanLine size={40} className="animate-pulse" />
              </div>
              <div className="relative z-10">
                <h4 className="text-sm font-black uppercase tracking-widest mb-2">Launch Gate Scanner</h4>
                <p className="text-[10px] font-bold text-muted-custom uppercase leading-relaxed">Validate QR codes via mobile camera or tethered hardware.</p>
              </div>
              <button className="w-full py-3 rounded-xl bg-primary-gold text-black text-[10px] font-black uppercase tracking-widest relative z-10 group-hover:scale-105 transition-transform">
                Initiate Session
              </button>
           </div>

           <div className="p-6 rounded-3xl border border-white/5 bg-white/[0.01] space-y-4">
              <h4 className="text-[10px] font-black uppercase tracking-widest text-white">Recent Activity</h4>
              <div className="space-y-4">
                 {[1, 2, 3].map(i => (
                   <div key={i} className="flex items-center justify-between text-[10px]">
                      <div className="flex items-center gap-2 text-muted-custom">
                         <div className="size-1.5 rounded-full bg-emerald-500" />
                         <span className="font-bold">Entry Verified</span>
                      </div>
                      <span className="font-mono text-muted-custom/50 tracking-tighter">14:{10+i} PM</span>
                   </div>
                 ))}
              </div>
           </div>
        </div>
      </div>
    </div>
  );
}

function GateCard({ label, value, sub, icon, color = "text-white" }: any) {
  return (
    <div className="p-6 rounded-3xl border border-white/5 bg-white/[0.01] space-y-3">
      <div className="flex items-center justify-between text-muted-custom">
        <span className="text-[9px] font-black uppercase tracking-widest">{label}</span>
        {icon}
      </div>
      <div>
        <p className={`text-3xl font-black tracking-tighter ${color}`}>{value}</p>
        <p className="text-[10px] font-bold text-muted-custom uppercase mt-1 tracking-widest">{sub}</p>
      </div>
    </div>
  );
}
