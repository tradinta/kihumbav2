"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, 
  Video, 
  Megaphone, 
  BarChart3, 
  Wallet,
  ArrowLeft
} from "lucide-react";

export default function StudioSidebar() {
  const pathname = usePathname();

  const navItems = [
    { name: "Dashboard", icon: LayoutDashboard, href: "/studio", exact: true },
    { name: "Content", icon: Video, href: "/studio/content", exact: false },
    { name: "Campaigns", icon: Megaphone, href: "/studio/campaigns", exact: false },
    { name: "Analytics", icon: BarChart3, href: "/studio/analytics", exact: false },
    { name: "Earn", icon: Wallet, href: "/studio/earn", exact: false },
  ];

  return (
    <aside className="hidden lg:flex flex-col w-64 pt-6 pb-8 sticky-sidebar shrink-0 border-r border-custom h-screen bg-[var(--bg-color)]">
       {/* Studio Branding */}
       <div className="px-6 mb-8 flex items-center gap-3">
         <div className="size-10 rounded-xl bg-gradient-to-br from-primary-gold/20 to-primary-gold/5 border border-primary-gold/30 flex items-center justify-center p-1 relative overflow-hidden">
           <div className="absolute inset-0 bg-primary-gold opacity-10 blur-md"></div>
           <svg viewBox="0 0 24 24" fill="none" className="w-6 h-6 text-primary-gold relative z-10" stroke="currentColor" strokeWidth="2">
             <polygon points="5 3 19 12 5 21 5 3" fill="currentColor" opacity="0.2"/>
             <polygon points="5 3 19 12 5 21 5 3"/>
           </svg>
         </div>
         <div>
           <h1 className="text-[13px] font-black tracking-tight text-main">Studio</h1>
           <p className="text-[9px] font-bold text-primary-gold uppercase tracking-[0.2em]">Creator Portal</p>
         </div>
       </div>

       {/* Author Info */}
       <div className="px-6 mb-8 flex flex-col items-center text-center">
         <img 
           src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=400" 
           alt="Your Profile" 
           className="size-20 rounded-full object-cover mb-3 border-2 border-custom"
         />
         <h2 className="text-[11px] font-bold">Kamau Njoroge</h2>
         <p className="text-[10px] text-muted-custom">@kamau_n</p>
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
                   ? "bg-primary-gold/10 text-primary-gold font-bold border border-primary-gold/20" 
                   : "text-muted-custom font-bold hover:bg-[var(--pill-bg)] hover:text-main"
               }`}
             >
               <item.icon size={18} strokeWidth={isActive ? 2.5 : 2} />
               <span className="text-[11px] uppercase tracking-widest">{item.name}</span>
             </Link>
           );
         })}
       </nav>

       {/* Exit Studio */}
       <div className="px-4 mt-auto">
         <Link 
           href="/" 
           className="flex items-center justify-center gap-2 group w-full py-3 rounded-lg border border-custom text-muted-custom hover:text-main hover:border-primary-gold/40 transition-all"
         >
           <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
           <span className="text-[10px] font-bold uppercase tracking-widest">Exit Studio</span>
         </Link>
       </div>
    </aside>
  );
}
