import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { 
  LayoutDashboard, 
  Video, 
  Megaphone, 
  BarChart3, 
  Wallet,
  ArrowLeft
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";

export default function StudioSidebar() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { user } = useAuth();
  const currentTab = searchParams.get('tab') || 'dashboard';

  const navItems = [
    { name: "Dashboard", icon: LayoutDashboard, tab: "overview", href: "/studio?tab=overview" },
    { name: "Content", icon: Video, tab: "content", href: "/studio?tab=content" },
    { name: "Campaigns", icon: Megaphone, tab: "campaigns", href: "/studio?tab=campaigns" },
    { name: "Analytics", icon: BarChart3, tab: "analytics", href: "/studio?tab=analytics" },
    { name: "Revenue", icon: Wallet, tab: "revenue", href: "/studio?tab=revenue" },
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
         <div className="size-20 rounded-full border-2 border-custom overflow-hidden mb-3 bg-white/5">
            <img 
              src={user?.image || user?.avatar || "https://images.unsplash.com/photo-1542361345-89e58247f2d5?q=80&w=400"} 
              alt={user?.name || "User"} 
              className="size-full object-cover"
            />
         </div>
         <h2 className="text-[11px] font-bold text-main">{user?.name || user?.fullName || "Kihumba Creator"}</h2>
         <p className="text-[10px] text-muted-custom">@{user?.username || "creator"}</p>
       </div>

       {/* Navigation */}
       <nav className="flex-1 px-4 space-y-1">
         {navItems.map((item) => {
           const isActive = currentTab === item.tab;

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
