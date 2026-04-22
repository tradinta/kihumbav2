'use client';

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import LeftSidebar from "@/components/LeftSidebar";
import RightSidebar from "@/components/RightSidebar";
import BottomNav from "@/components/BottomNav";
import TopBar from "@/components/TopBar";
import SettingsNav from "@/components/settings/SettingsNav";
import { 
  Palette, Type, Layout, Monitor, Sun, Moon, 
  Leaf, Eye, Zap, Layers, Maximize
} from "lucide-react";

const SectionHeader = ({ title, icon: Icon }: { title: string, icon: any }) => (
  <div className="flex items-center gap-3 mb-6 first:mt-0 pb-4 border-b border-[var(--border-color)]">
    <Icon size={16} className="text-primary-gold/70" strokeWidth={1.5} />
    <h3 className="text-[var(--text-main)] text-[10px] font-black uppercase tracking-[0.2em]">{title}</h3>
  </div>
);

const DisplayToggle = ({ label, description, defaultChecked = false, isPremium = false }: any) => {
  const [checked, setChecked] = useState(defaultChecked);
  return (
    <div 
      className="flex items-center justify-between py-5 group cursor-pointer border border-transparent hover:bg-black/5 dark:hover:bg-white/[0.02] px-4 -mx-4 transition-all rounded-lg" 
      onClick={() => setChecked(!checked)}
    >
      <div className="space-y-1.5 pr-8">
        <div className="flex items-center gap-2">
          <h4 className="text-xs font-bold text-[var(--text-main)] uppercase tracking-wide group-hover:text-primary-gold transition-colors">{label}</h4>
          {isPremium && <span className="text-[8px] bg-primary-gold/20 text-primary-gold px-1.5 py-0.5 rounded-full font-black uppercase tracking-widest">Plus</span>}
        </div>
        <p className="text-[11px] text-[var(--text-muted)] leading-relaxed font-medium">{description}</p>
      </div>
      <div className={`w-10 h-5 relative shrink-0 transition-all duration-300 rounded-full border ${checked ? 'bg-primary-gold border-primary-gold' : 'bg-[var(--pill-bg)] border-[var(--border-color)]'}`}>
        <div className={`absolute top-1 size-2.5 bg-white rounded-full transition-all duration-300 shadow-sm ${checked ? 'left-6' : 'left-1'}`} />
      </div>
    </div>
  );
};

const DisplaySelector = ({ label, description, options, defaultValue, isPremium = false }: any) => {
  const [value, setValue] = useState(defaultValue);
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between py-5 group border border-transparent hover:bg-black/5 dark:hover:bg-white/[0.02] px-4 -mx-4 transition-all rounded-lg gap-4">
      <div className="space-y-1.5 pr-8">
        <div className="flex items-center gap-2">
           <h4 className="text-xs font-bold text-[var(--text-main)] uppercase tracking-wide group-hover:text-primary-gold transition-colors">{label}</h4>
           {isPremium && <span className="text-[8px] bg-primary-gold/20 text-primary-gold px-1.5 py-0.5 rounded-full font-black uppercase tracking-widest">Plus</span>}
        </div>
        <p className="text-[11px] text-[var(--text-muted)] leading-relaxed font-medium">{description}</p>
      </div>
      <div className="shrink-0 flex gap-1 bg-[var(--pill-bg)] p-1 border border-[var(--border-color)] rounded-[4px]">
        {options.map((opt: string) => (
          <button
            key={opt}
            onClick={() => setValue(opt)}
            className={`px-4 py-1.5 text-[10px] font-black tracking-wide transition-all rounded-[4px] ${
              value === opt ? 'bg-[var(--text-main)] text-[var(--bg-color)] shadow-lg' : 'text-[var(--text-muted)] hover:text-[var(--text-main)]'
            }`}
          >
            {opt}
          </button>
        ))}
      </div>
    </div>
  );
};

import SettingsGuard from "@/components/settings/SettingsGuard";

export default function DisplaySettingsPage() {
  return (
    <SettingsGuard title="Interface Optics">
      <DisplayContent />
    </SettingsGuard>
  );
}

function DisplayContent() {
  return (
    <div className="max-w-[1400px] mx-auto flex flex-col lg:flex-row min-h-screen lg:px-6 gap-6 overflow-x-hidden font-inter">
      <LeftSidebar />

      <main className="flex-1 w-full max-w-3xl mx-auto lg:mx-0 pt-0 lg:pt-4 pb-32 lg:pb-12 px-4 lg:px-0">
        <TopBar />

        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-8 mb-8"
        >
          <h1 className="text-4xl font-black tracking-tighter text-[var(--text-main)] mb-2">Interface Optics</h1>
          <p className="text-[var(--text-muted)] text-[10px] font-black uppercase tracking-[0.4em]">Visual & Sensory Experience</p>
        </motion.div>

        <SettingsNav />

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative border border-[var(--border-color)] bg-[var(--card-bg)] p-4 sm:p-8 rounded-[6px] shadow-2xl space-y-12"
        >
          {/* Theme Engine */}
          <section>
            <SectionHeader title="Theme Architecture" icon={Palette} />
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
              {[
                { id: 'dark', name: 'Dark Void', icon: Moon, desc: 'Deep black industrial.' },
                { id: 'white', name: 'Paper White', icon: Sun, desc: 'Clean high-contrast.' },
                { id: 'emerald', name: 'Emerald', icon: Leaf, desc: 'Lush biometric green.' },
              ].map((theme) => (
                <button 
                  key={theme.id}
                  className="flex flex-col items-center gap-3 p-6 rounded-[4px] border border-[var(--border-color)] bg-[var(--pill-bg)] hover:border-primary-gold/40 transition-all group"
                >
                  <theme.icon size={24} className="text-zinc-500 group-hover:text-primary-gold transition-colors" />
                  <div className="text-center">
                    <span className="text-[10px] font-black uppercase tracking-widest text-[var(--text-main)]">{theme.name}</span>
                    <p className="text-[9px] text-[var(--text-muted)] mt-1">{theme.desc}</p>
                  </div>
                </button>
              ))}
            </div>
            <div className="divide-y divide-[var(--border-color)]">
              <DisplayToggle label="Match System Settings" description="Automatically switch themes based on your device's OS." defaultChecked={true} />
              <DisplayToggle label="OLED True Black" description="Use absolute #000000 for pure pixels on OLED screens." isPremium defaultChecked={true} />
            </div>
          </section>

          {/* Typography & Scaling */}
          <section>
            <SectionHeader title="Optics & Scaling" icon={Type} />
            <div className="divide-y divide-[var(--border-color)]">
              <DisplaySelector label="Font Scale" description="Adjust the platform-wide text sizing for readability." options={["Tiny", "Default", "Large", "Mega"]} defaultValue="Default" />
              <DisplaySelector label="Line Density" description="Adjust vertical spacing between elements." options={["Compact", "Standard", "Cozy"]} defaultValue="Standard" />
              <DisplayToggle label="High Contrast" description="Increase border visibility and text sharpness." defaultChecked={false} />
            </div>
          </section>

          {/* Motion & Interaction */}
          <section>
            <SectionHeader title="Sensory & Motion" icon={Zap} />
            <div className="divide-y divide-[var(--border-color)]">
              <DisplayToggle label="Reduced Motion" description="Disable cinematic transitions and parallax effects." defaultChecked={false} />
              <DisplaySelector label="Glassmorphism" description="Adjust the intensity of the background blur effects." options={["None", "Soft", "Hard"]} defaultValue="Soft" />
              <DisplayToggle label="Haptic Feedback" description="Vibrate on key interactions (Mobile only)." defaultChecked={true} />
            </div>
          </section>

          {/* Layout Structure */}
          <section>
            <SectionHeader title="Core Layout" icon={Layout} />
            <div className="divide-y divide-[var(--border-color)]">
              <DisplaySelector label="Sidebar Style" description="Choose between full labels or minimalist icons." options={["Standard", "Collapsed"]} defaultValue="Standard" />
              <DisplaySelector label="Feed Width" description="Control the maximum width of the central feed." options={["Narrow", "Standard", "Wide"]} defaultValue="Standard" />
              <DisplayToggle label="Theater Mode Default" description="Always open videos in expanded theater mode." isPremium defaultChecked={false} />
            </div>
          </section>

        </motion.div>
      </main>

      <RightSidebar />
      <BottomNav />
    </div>
  );
}
