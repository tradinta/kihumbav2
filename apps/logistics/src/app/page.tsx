"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "@/lib/auth-client";
import { api } from "@/lib/api";
import { 
  Truck, 
  Map as MapIcon, 
  Users, 
  Clock, 
  MapPin, 
  CheckCircle2, 
  AlertCircle,
  Search,
  ChevronRight,
  ShieldCheck,
  Signal
} from "lucide-react";

const activeDeliveries = [
  { id: "DEL-821", driver: "John W.", sacco: "Double M", from: "Riverside", to: "Westlands", status: "In Transit", eta: "12 mins" },
  { id: "DEL-795", driver: "Patrick K.", sacco: "Double M", from: "CBD", to: "Kilimani", status: "Pickup", eta: "5 mins" },
  { id: "DEL-780", driver: "Stephen N.", sacco: "Double M", from: "Lang'ata", to: "Karen", status: "Delivered", eta: "Delivered" },
];

export default function LogisticsDashboard() {
  const { data: session, isPending } = useSession();
  const router = useRouter();
  const [deliveries, setDeliveries] = useState<any[]>([]);

  useEffect(() => {
    if (session) {
      api.get("/marketplace/orders?role=admin") // Logistics admins see assigned orders
        .then(res => setDeliveries(res))
        .catch(err => console.error("Failed to fetch deliveries", err));
    }
  }, [session]);

  if (isPending) return <div className="h-screen bg-black flex items-center justify-center text-primary-gold font-bold animate-pulse">KIHUMBA LOGISTICS...</div>;
  return (
    <div className="flex h-screen bg-black">
      {/* Mini Sidebar */}
      <aside className="w-20 border-r border-custom flex flex-col items-center py-8 gap-10 shrink-0 bg-[#0a0a0a]">
        <div className="size-10 rounded-xl bg-primary-gold flex items-center justify-center font-bold text-black text-2xl">L</div>
        
        <nav className="flex flex-col gap-6">
          <SideIcon icon={<Truck size={20} />} active />
          <SideIcon icon={<MapIcon size={20} />} />
          <SideIcon icon={<Users size={20} />} />
          <SideIcon icon={<Signal size={20} />} />
          <SideIcon icon={<ShieldCheck size={20} />} />
        </nav>

        <div className="mt-auto">
          <div className="size-10 rounded-full border border-custom overflow-hidden">
             <img src="https://ui-avatars.com/api/?name=Admin&background=random" alt="Admin" />
          </div>
        </div>
      </aside>

      {/* Main Panel */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="h-20 border-b border-custom flex items-center justify-between px-8 bg-black/50 backdrop-blur-md z-10">
          <div className="flex items-center gap-4">
            <h2 className="text-xl font-bold tracking-tight">Double M SACCO — Dispatch</h2>
            <span className="px-3 py-1 rounded-full bg-green-500/10 text-green-400 text-[10px] font-bold uppercase tracking-widest border border-green-500/20">
              Operational
            </span>
          </div>

          <div className="flex items-center gap-6">
            <div className="relative hidden md:block">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-custom" size={14} />
              <input 
                type="text" 
                placeholder="Search Waybill or Driver..." 
                className="bg-white/5 border border-custom rounded-lg py-2 pl-9 pr-4 text-xs focus:outline-none focus:border-primary-gold w-64"
              />
            </div>
            <button className="bg-primary-gold text-black px-5 py-2 rounded-lg text-xs font-bold uppercase tracking-widest hover:brightness-110 transition-all">
              Assign Dispatch
            </button>
          </div>
        </header>

        {/* Content Area */}
        <div className="flex-1 flex overflow-hidden">
          {/* List Panel */}
          <main className="w-1/2 xl:w-2/5 border-r border-custom overflow-y-auto p-6 scrollbar-hide bg-[#050505]">
            <section className="mb-8">
              <h3 className="text-[10px] font-bold uppercase tracking-[0.3em] text-primary-gold mb-4">Active Fleet Performance</h3>
              <div className="grid grid-cols-3 gap-4">
                <StatBox icon={<Truck size={14} />} label="En Route" value="24" />
                <StatBox icon={<Clock size={14} />} label="At Pickup" value="12" />
                <StatBox icon={<AlertCircle size={14} />} label="Incidents" value="0" />
              </div>
            </section>

            <section>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-[10px] font-bold uppercase tracking-[0.3em] text-primary-gold">Live Deliveries</h3>
                <span className="text-[10px] text-muted-custom font-bold">Sort: Newest First</span>
              </div>
              
              <div className="space-y-3">
                {(deliveries.length > 0 ? deliveries : activeDeliveries).map((del) => (
                  <div key={del.id} className="card-surface p-4 rounded-xl border border-custom hover:border-primary-gold/30 transition-all group cursor-pointer">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <p className="text-[11px] font-mono font-bold text-primary-gold">{del.id.substring(0, 8)}</p>
                        <h4 className="text-sm font-bold flex items-center gap-2">
                          {del.driverName || "Unassigned"}
                          <span className="size-1.5 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.5)]" />
                        </h4>
                      </div>
                      <div className="text-right">
                        <p className="text-[10px] font-bold uppercase tracking-widest text-muted-custom">{del.status}</p>
                        <p className="text-xs font-bold">{del.status === 'DELIVERED' ? 'Delivered' : 'ETA 15m'}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3 pt-3 border-t border-white/5">
                      <div className="size-8 rounded bg-white/5 flex items-center justify-center text-primary-gold">
                        <MapPin size={16} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-[10px] text-muted-custom font-bold uppercase tracking-tighter">Route</p>
                        <p className="text-xs truncate font-bold">{del.listing?.area || "Nairobi"} <ChevronRight size={10} className="inline mx-1" /> {del.buyer?.fullName || "Buyer"}</p>
                      </div>
                      <button className="opacity-0 group-hover:opacity-100 transition-opacity p-2 hover:bg-white/10 rounded-lg">
                        <ChevronRight size={16} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </main>

          {/* Map Area (Mock) */}
          <aside className="hidden lg:flex flex-1 bg-[#111] relative items-center justify-center overflow-hidden">
            <div className="absolute inset-0 opacity-40 mix-blend-screen pointer-events-none">
                {/* SVG Mock Map Grid */}
                <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
                    <defs>
                        <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                            <path d="M 40 0 L 0 0 0 40" fill="none" stroke="white" strokeWidth="0.5" strokeOpacity="0.1"/>
                        </pattern>
                    </defs>
                    <rect width="100%" height="100%" fill="url(#grid)" />
                </svg>
            </div>

            {/* Mock Markers */}
            <div className="absolute top-[30%] left-[40%] text-primary-gold flex flex-col items-center gap-2 animate-bounce-slow">
              <div className="size-4 rounded-full bg-primary-gold shadow-[0_0_20px_#D4AF37]" />
              <span className="bg-black/80 backdrop-blur px-2 py-1 rounded text-[8px] font-bold uppercase tracking-widest border border-primary-gold/30">DEL-821</span>
            </div>

            <div className="absolute top-[60%] left-[65%] text-white flex flex-col items-center gap-2">
              <div className="size-3 rounded-full bg-white/40 border border-white" />
              <span className="bg-black/80 backdrop-blur px-2 py-1 rounded text-[8px] font-bold uppercase tracking-widest border border-white/20">DEL-795</span>
            </div>

            {/* Map Overlay HUD */}
            <div className="absolute top-6 left-6 flex flex-col gap-3">
              <div className="bg-black/80 backdrop-blur-lg border border-custom p-4 rounded-xl">
                 <h5 className="text-[10px] font-bold uppercase tracking-widest text-primary-gold mb-2">System Health</h5>
                 <div className="flex items-center gap-4">
                    <div>
                        <p className="text-[10px] text-muted-custom">GPS Uptime</p>
                        <p className="text-xs font-bold">99.9%</p>
                    </div>
                    <div className="w-px h-6 bg-white/10" />
                    <div>
                        <p className="text-[10px] text-muted-custom">Latency</p>
                        <p className="text-xs font-bold">14ms</p>
                    </div>
                 </div>
              </div>
            </div>

            <div className="absolute bottom-6 right-6 flex items-center gap-2">
                <button className="size-10 rounded-full bg-black/80 backdrop-blur border border-custom flex items-center justify-center hover:bg-primary-gold hover:text-black transition-all">
                    <MapIcon size={18} />
                </button>
            </div>

            <div className="text-center z-10 pointer-events-none">
              <p className="text-muted-custom text-xs font-bold uppercase tracking-[0.5em] mb-2">Live Map View</p>
              <h3 className="text-4xl font-extrabold tracking-widest opacity-20">NAIROBI_METRO</h3>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}

function SideIcon({ icon, active = false }: { icon: React.ReactNode, active?: boolean }) {
  return (
    <button className={`size-12 rounded-2xl flex items-center justify-center transition-all group ${active ? 'bg-primary-gold text-black shadow-[0_0_20px_rgba(212,175,55,0.3)]' : 'text-muted-custom hover:bg-white/5 hover:text-white'}`}>
      <span className={active ? '' : 'group-hover:scale-110 transition-transform'}>{icon}</span>
    </button>
  );
}

function StatBox({ icon, label, value }: { icon: React.ReactNode, label: string, value: string }) {
  return (
    <div className="card-surface p-3 rounded-xl border border-custom">
      <div className="flex items-center gap-2 text-muted-custom mb-1">
        {icon}
        <span className="text-[8px] font-bold uppercase tracking-widest">{label}</span>
      </div>
      <p className="text-lg font-bold">{value}</p>
    </div>
  );
}
