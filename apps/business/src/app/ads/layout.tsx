import { ReactNode } from "react";
import Link from "next/link";
import { 
  LayoutDashboard, 
  Wand2, 
  Eye, 
  BarChart3, 
  Settings, 
  ArrowLeft 
} from "lucide-react";

export default function AdsLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex h-screen bg-main overflow-hidden font-display selection:bg-primary-gold/30 selection:text-main">
      {/* Ad Manager Sidebar */}
      <aside className="w-64 border-r border-custom bg-main shrink-0 flex flex-col">
        <div className="p-6 border-b border-custom flex items-center gap-3">
          <Link href="/" className="size-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 transition-colors">
             <ArrowLeft size={16} className="text-muted-custom" />
          </Link>
          <div>
            <h1 className="text-[13px] font-black tracking-tight text-main uppercase">Ad Manager</h1>
            <p className="text-[9px] font-bold text-primary-gold uppercase tracking-widest">Command Center</p>
          </div>
        </div>

        <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto no-scrollbar">
           <SidebarItem icon={<LayoutDashboard size={16} />} label="Dashboard" active />
           <SidebarItem icon={<Wand2 size={16} />} label="AI Architect" />
           <SidebarItem icon={<Eye size={16} />} label="Placement Previews" />
           <SidebarItem icon={<BarChart3 size={16} />} label="Performance" />
        </nav>

        <div className="p-4 mt-auto border-t border-custom">
           <SidebarItem icon={<Settings size={16} />} label="Ad Settings" />
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto custom-scrollbar relative">
        {children}
      </main>
    </div>
  );
}

function SidebarItem({ icon, label, active = false }: { icon: React.ReactNode, label: string, active?: boolean }) {
  return (
    <button className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
      active 
        ? "bg-primary-gold/10 text-primary-gold border border-primary-gold/20 shadow-[0_0_15px_rgba(197,160,89,0.1)]" 
        : "text-muted-custom hover:bg-white/5 hover:text-main"
    }`}>
      {icon}
      <span className="text-[10px] font-black uppercase tracking-widest">{label}</span>
    </button>
  );
}
