"use client";

import { 
  Truck, 
  MapPin, 
  Navigation, 
  Package, 
  Clock, 
  CheckCircle2,
  AlertCircle,
  BarChart3,
  ExternalLink
} from "lucide-react";

const ACTIVE_FLEETS = [
  { id: "FLT-901", partner: "Sendy Fleet", status: "Active", assignments: 12, performance: "98%" },
  { id: "FLT-902", partner: "G4S Secure", status: "Active", assignments: 5, performance: "99%" },
  { id: "FLT-903", partner: "Kihumba Express", status: "Scaling", assignments: 2, performance: "N/A" },
];

export default function LogisticsTab() {
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-500">
      
      {/* Logistics Network Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <LogisticsCard label="Average Transit Time" value="2.4h" sub="Nairobi Metropolitan" icon={<Clock size={20} />} />
        <LogisticsCard label="Fleet Saturation" value="84%" sub="Active Distribution" icon={<Truck size={20} />} color="text-blue-500" />
        <LogisticsCard label="On-Time Delivery" value="96.8%" sub="via Smart Routing" icon={<BarChart3 size={20} />} color="text-emerald-500" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Fleet Partners */}
        <div className="md:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-black uppercase tracking-widest text-muted-custom">Fleet Sync Registry</h3>
            <button className="text-[10px] font-black uppercase tracking-widest text-primary-gold hover:underline transition-all flex items-center gap-1">
              <Plus size={14} /> Connect Partner
            </button>
          </div>

          <div className="border border-white/5 rounded-3xl overflow-hidden bg-white/[0.01]">
            <table className="w-full text-left border-collapse text-[11px]">
              <thead>
                <tr className="border-b border-white/5 bg-white/[0.02]">
                  <th className="px-6 py-4 font-black uppercase tracking-widest text-muted-custom">Fleet Partner</th>
                  <th className="px-6 py-4 font-black uppercase tracking-widest text-muted-custom">Status</th>
                  <th className="px-6 py-4 font-black uppercase tracking-widest text-muted-custom text-center">Assignments</th>
                  <th className="px-6 py-4 font-black uppercase tracking-widest text-muted-custom">KPI</th>
                  <th className="px-6 py-4 font-black uppercase tracking-widest text-muted-custom text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {ACTIVE_FLEETS.map((flt) => (
                  <tr key={flt.id} className="hover:bg-white/[0.02] transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                         <div className="size-8 rounded-lg bg-white/5 border border-white/5 flex items-center justify-center text-blue-500">
                            <Truck size={16} />
                         </div>
                         <span className="font-black text-white">{flt.partner}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <div className={`size-1.5 rounded-full ${
                          flt.status === 'Active' ? 'bg-emerald-500' : 'bg-amber-500'
                        }`} />
                        <span className="text-[10px] font-black uppercase tracking-widest text-white">{flt.status}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center font-black text-white">{flt.assignments}</td>
                    <td className="px-6 py-4">
                       <span className="px-2 py-0.5 rounded border border-emerald-500/30 text-emerald-500 font-black text-[9px]">{flt.performance}</span>
                    </td>
                    <td className="px-6 py-4 text-right">
                       <button className="p-2 rounded-xl hover:bg-white/5 text-muted-custom hover:text-white transition-all">
                          <ExternalLink size={14} />
                       </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Dispatch Operations */}
        <div className="space-y-6">
           <h3 className="text-xs font-black uppercase tracking-widest text-muted-custom">Logistics Architecture</h3>
           <div className="p-6 rounded-3xl border border-white/5 bg-white/[0.01] space-y-8">
              <div className="space-y-4">
                 <div className="flex items-center gap-3 text-white">
                    <Navigation size={18} className="text-primary-gold" />
                    <h4 className="text-[10px] font-black uppercase tracking-widest">Zone Optimization</h4>
                 </div>
                 <p className="text-[11px] font-medium text-muted-custom leading-relaxed uppercase">
                    Smart routing is currently prioritizing **Nairobi North** (High Volume).
                 </p>
              </div>

              <div className="space-y-4">
                 <div className="flex items-center gap-3 text-white">
                    <MapPin size={18} className="text-primary-gold" />
                    <h4 className="text-[10px] font-black uppercase tracking-widest">Active Pickup Points</h4>
                 </div>
                 <div className="grid grid-cols-2 gap-2">
                    <div className="p-2 rounded border border-white/10 bg-white/5 text-[9px] font-black uppercase text-center">GTC Westlands</div>
                    <div className="p-2 rounded border border-white/10 bg-white/5 text-[9px] font-black uppercase text-center">CBD Hub</div>
                 </div>
              </div>

              <div className="pt-6 border-t border-white/5">
                 <div className="p-4 rounded-xl bg-amber-500/5 border border-amber-500/10">
                    <p className="text-[10px] font-black uppercase tracking-widest text-amber-500 mb-2 flex items-center gap-2">
                       <AlertCircle size={14} /> Traffic Advisory
                    </p>
                    <p className="text-[11px] font-medium text-muted-custom/80 leading-relaxed italic uppercase">
                       Congestion on **Mombasa Rd** may delay afternoon deliveries by 20-30 mins.
                    </p>
                 </div>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
}

function LogisticsCard({ label, value, sub, icon, color = "text-white" }: any) {
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
