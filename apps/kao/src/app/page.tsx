"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "@/lib/auth-client";
import { api } from "@/lib/api";
import { 
  Building2, 
  Home, 
  Compass, 
  ShieldCheck, 
  MapPin, 
  BadgeCheck,
  TrendingUp,
  Plus,
  Users2,
  Euro,
  Key
} from "lucide-react";

const mockProperties = [
  { name: "Riverside Heights", units: 48, occupied: 42, revenue: "KSh 1.2M", status: "Premium" },
  { name: "Kilimani Oasis", units: 24, occupied: 24, revenue: "KSh 840k", status: "Full" },
  { name: "Westlands Square", units: 60, occupied: 15, revenue: "KSh 450k", status: "New" },
];

export default function KaoProDashboard() {
  const { data: session, isPending } = useSession();
  const router = useRouter();
  const [properties, setProperties] = useState<any[]>([]);

  useEffect(() => {
    if (session) {
      // Professional listers fetch their own listings
      api.get("/kao/listings?pro=true") 
        .then(res => setProperties(res))
        .catch(err => console.error("Failed to fetch properties", err));
    }
  }, [session]);

  if (isPending) return <div className="h-screen bg-black flex items-center justify-center text-primary-gold font-bold animate-pulse">KAO PRO...</div>;
  return (
    <div className="min-h-screen bg-black text-white">
      {/* Top Navigation */}
      <nav className="border-b border-custom px-8 py-4 flex items-center justify-between sticky top-0 bg-black/80 backdrop-blur-xl z-50">
        <div className="flex items-center gap-8">
          <div className="flex items-center gap-2">
            <div className="size-9 rounded-full bg-primary-gold flex items-center justify-center">
              <Building2 size={20} className="text-black" />
            </div>
            <span className="font-bold tracking-widest text-lg">KAO <span className="text-primary-gold">PRO</span></span>
          </div>
          
          <div className="hidden md:flex items-center gap-1 bg-white/5 rounded-full p-1 border border-white/5">
             <button className="px-5 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest bg-primary-gold text-black shadow-lg">Portfolio</button>
             <button className="px-5 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest text-muted-custom hover:text-white transition-colors">Tenants</button>
             <button className="px-5 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest text-muted-custom hover:text-white transition-colors">Finances</button>
          </div>
        </div>

        <div className="flex items-center gap-4">
           <div className="hidden lg:flex flex-col items-end">
              <p className="text-xs font-bold">Nairobi Real Estate Ltd</p>
              <div className="flex items-center gap-1">
                <BadgeCheck size={12} className="text-primary-gold" />
                <span className="text-[9px] font-bold uppercase text-primary-gold tracking-widest">Verified Agency</span>
              </div>
           </div>
           <button className="size-10 rounded-full border border-custom overflow-hidden transition-transform hover:scale-105">
              <img src="https://ui-avatars.com/api/?name=NRE&background=D4AF37&color=000" alt="Agency" />
           </button>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto p-8 pt-12">
        {/* Hero Section */}
        <section className="mb-16 flex flex-col lg:flex-row justify-between items-start lg:items-center gap-8">
          <div>
            <h1 className="text-5xl font-extrabold tracking-tighter mb-4">Real Estate, <span className="text-primary-gold">Refined.</span></h1>
            <p className="text-muted-custom max-w-lg text-lg">Manage your entire property portfolio with cinematic data visualization and high-speed unit tracking.</p>
          </div>
          <div className="flex gap-4">
            <button className="bg-white text-black px-8 py-4 rounded-2xl font-bold flex items-center gap-3 hover:bg-primary-gold transition-colors">
              <Plus size={20} />
              <span className="uppercase text-xs tracking-widest">New Property</span>
            </button>
          </div>
        </section>

        {/* Stats Grid - Glassmorphic */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          <KaoStatCard icon={<Home />} label="Total Units" value="132" subValue="+12 recently added" />
          <KaoStatCard icon={<Users2 />} label="Active Tenants" value="81" subValue="92.4% Occupancy" />
          <KaoStatCard icon={<Compass />} label="Pending Maintenance" value="04" subValue="High Priority" color="border-primary-gold" />
        </div>

        {/* Portfolio View */}
        <section>
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-sm font-bold uppercase tracking-[0.4em] text-primary-gold">Your Portfolio</h3>
            <button className="text-xs font-bold uppercase tracking-widest border-b border-primary-gold pb-1 text-primary-gold">Filter by City</button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Property List */}
            <div className="space-y-4">
              {(properties.length > 0 ? properties : mockProperties).map((prop) => (
                <div key={prop.id || prop.name} className="card-surface p-8 rounded-[2rem] border border-custom flex justify-between items-center group cursor-pointer hover:border-primary-gold/50 transition-all">
                  <div className="flex items-center gap-6">
                    <div className="size-16 rounded-3xl bg-white/5 border border-white/10 flex items-center justify-center group-hover:bg-primary-gold group-hover:text-black transition-colors">
                      <Building2 size={32} />
                    </div>
                    <div>
                      <h4 className="text-xl font-bold mb-1">{prop.title || prop.name}</h4>
                      <div className="flex items-center gap-4">
                        <span className="text-xs font-bold text-muted-custom flex items-center gap-1">
                          <Key size={12} /> {prop.units || prop.vacantCount} Units
                        </span>
                        <div className="size-1 rounded-full bg-white/20" />
                        <span className="text-xs font-bold text-muted-custom">{prop.area}, {prop.county}</span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold text-primary-gold">KSh {prop.price?.toLocaleString() || prop.revenue}</p>
                    <span className="text-[9px] font-bold uppercase tracking-widest text-muted-custom">{prop.isVerified ? 'Verified' : 'Pending'}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Quick Actions / Unit HUD */}
            <div className="card-surface rounded-[2rem] border border-custom p-10 flex flex-col justify-center items-center relative overflow-hidden">
               <div className="absolute top-0 right-0 p-8 opacity-10">
                  <ShieldCheck size={120} />
               </div>
               
               <div className="text-center relative z-10">
                  <div className="size-20 rounded-full border border-primary-gold/30 flex items-center justify-center mx-auto mb-6 bg-primary-gold/5">
                    <BadgeCheck size={40} className="text-primary-gold" />
                  </div>
                  <h4 className="text-2xl font-bold mb-3 tracking-tight">Kao Verified Advantage</h4>
                  <p className="text-muted-custom text-sm mb-8 max-w-xs mx-auto">Verified properties receive 3.5x more inquiries and featured placement in the the main Kihumba social feed.</p>
                  
                  <button className="pill-surface px-10 py-4 text-xs font-bold uppercase tracking-[0.2em] text-black bg-white hover:bg-primary-gold transition-all">
                    Start Verification
                  </button>
               </div>
            </div>
          </div>
        </section>

        {/* Floating Background Effects */}
        <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 size-[600px] bg-primary-gold/5 blur-[150px] -z-10 rounded-full" />
      </main>
    </div>
  );
}

function KaoStatCard({ icon, label, value, subValue, color = "border-custom" }: { icon: React.ReactNode, label: string, value: string, subValue: string, color?: string }) {
  return (
    <div className={`card-surface p-10 rounded-[2.5rem] border ${color} relative overflow-hidden group hover:-translate-y-2 transition-transform duration-500`}>
        <div className="absolute -right-4 -top-4 size-32 bg-white/5 blur-3xl rounded-full" />
        <div className="mb-6 size-12 rounded-2xl bg-white/5 flex items-center justify-center border border-white/10 group-hover:bg-primary-gold group-hover:text-black transition-all">
          {icon}
        </div>
        <p className="text-xs font-bold uppercase tracking-[0.3em] text-muted-custom mb-2">{label}</p>
        <h3 className="text-5xl font-extrabold mb-4 tracking-tighter">{value}</h3>
        <p className="text-xs font-bold text-primary-gold flex items-center gap-2">
           <TrendingUp size={14} />
           {subValue}
        </p>
    </div>
  );
}
