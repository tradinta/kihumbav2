"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  Building2, 
  Megaphone, 
  Users, 
  Wallet,
  Settings,
  ArrowLeft
} from "lucide-react";

export default function BusinessSidebar() {
  const pathname = usePathname();

  const navItems = [
    { name: "Overview", icon: Building2, href: "/business", exact: true },
    { name: "Ads Manager", icon: Megaphone, href: "/business/ads", exact: false },
    { name: "Campaigns", icon: Users, href: "/business/campaigns", exact: false },
    { name: "Billing", icon: Wallet, href: "/business/billing", exact: false },
    { name: "Settings", icon: Settings, href: "/business/settings", exact: false },
  ];

  return (
    <aside className="hidden lg:flex flex-col w-64 pt-6 pb-8 sticky-sidebar shrink-0 border-r border-custom h-screen bg-[var(--bg-color)]">
       {/* Business Suite Branding */}
       <div className="px-6 mb-8 flex items-center gap-3">
         <div className="size-10 rounded-xl bg-gradient-to-br from-blue-500/20 to-blue-500/5 border border-blue-500/30 flex items-center justify-center p-1 relative overflow-hidden">
           <div className="absolute inset-0 bg-blue-500 opacity-10 blur-md"></div>
           <Building2 size={24} className="text-blue-500 relative z-10" />
         </div>
         <div>
           <h1 className="text-[13px] font-black tracking-tight text-main">Business</h1>
           <p className="text-[9px] font-bold text-blue-500 uppercase tracking-[0.2em]">Command Center</p>
         </div>
       </div>

       {/* Business Info */}
       <div className="px-6 mb-8 flex flex-col items-center text-center">
         <div className="size-20 rounded-xl bg-[var(--pill-bg)] border-2 border-custom overflow-hidden flex items-center justify-center mb-3">
           <span className="text-3xl font-black text-muted-custom">SF</span>
         </div>
         <h2 className="text-[11px] font-bold">Safaricom PLC</h2>
         <p className="text-[10px] text-muted-custom border border-emerald-500/20 bg-emerald-500/10 text-emerald-500 px-2 py-0.5 rounded-full mt-2 font-bold uppercase tracking-widest text-[8px]">
           Verified Business
         </p>
       </div>

       {/* Navigation */}
       <nav className="flex-1 px-4 space-y-1">
         {navItems.map((item) => {
           const isActive = item.exact 
             ? pathname === item.href 
             : pathname.startsWith(item.href);

           return (
             <Link 
               key={item.href} 
               href={item.href}
               className={`flex items-center gap-4 px-4 py-3 rounded-lg transition-colors ${
                 isActive 
                   ? "bg-blue-500/10 text-blue-500 font-bold border border-blue-500/20" 
                   : "text-muted-custom font-bold hover:bg-[var(--pill-bg)] hover:text-main"
               }`}
             >
               <item.icon size={18} strokeWidth={isActive ? 2.5 : 2} />
               <span className="text-[11px] uppercase tracking-widest">{item.name}</span>
             </Link>
           );
         })}
       </nav>

       {/* Exit Suite */}
       <div className="px-4 mt-auto">
         <Link 
           href="/" 
           className="flex items-center justify-center gap-2 group w-full py-3 rounded-lg border border-custom text-muted-custom hover:text-main hover:border-blue-500/40 transition-all"
         >
           <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
           <span className="text-[10px] font-bold uppercase tracking-widest">Back to Personal</span>
         </Link>
       </div>
    </aside>
  );
}
