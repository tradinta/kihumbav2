'use client';

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { authClient } from "@/lib/auth-client";
import LeftSidebar from "@/components/LeftSidebar";
import RightSidebar from "@/components/RightSidebar";
import BottomNav from "@/components/BottomNav";
import TopBar from "@/components/TopBar";
import SettingsNav from "@/components/settings/SettingsNav";
import { 
  User, Globe, Sparkles, LogOut, ChevronRight, Edit2, 
  Bell, Languages, PlayCircle, Tag, ShieldCheck
} from "lucide-react";

const SectionHeader = ({ title, subtitle }: { title: string, subtitle?: string }) => (
  <div className="mb-6">
    <h3 className="text-primary-gold text-[10px] font-black uppercase tracking-[0.3em]">{title}</h3>
    {subtitle && <p className="text-[11px] text-[var(--text-muted)] mt-1 font-medium leading-relaxed">{subtitle}</p>}
  </div>
);

const PremiumCard = ({ children, onClick, className = "" }: { children: React.ReactNode, onClick?: () => void, className?: string }) => (
  <div 
    onClick={onClick}
    className={`border border-[var(--border-color)] bg-[var(--card-bg)] backdrop-blur-xl p-5 sm:p-6 hover:border-primary-gold/30 transition-all rounded-[6px] shadow-sm group ${className}`}
  >
    {children}
  </div>
);



import SettingsGuard from "@/components/settings/SettingsGuard";

export default function SettingsPage() {
  return (
    <SettingsGuard title="Account Hub">
      <AccountContent />
    </SettingsGuard>
  );
}

function AccountContent() {
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
          <h1 className="text-4xl font-black tracking-tighter text-[var(--text-main)] mb-2">Account Hub</h1>
          <p className="text-[var(--text-muted)] text-[10px] font-black uppercase tracking-[0.4em]">Core Configuration & Status</p>
        </motion.div>

        <SettingsNav />

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-12"
        >
          {/* Identity Section */}
          <section>
            <SectionHeader title="Public Identity" subtitle="Manage your outward-facing presence on the network." />
            <div className="space-y-3">
              <PremiumCard>
                <div className="flex items-start sm:items-center justify-between flex-col sm:flex-row gap-4">
                  <div className="flex items-center gap-5">
                    <div className="size-12 bg-[var(--pill-bg)] flex items-center justify-center text-primary-gold border border-[var(--border-color)] shrink-0 rounded-[4px]">
                      <User size={20} />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-[var(--text-main)] uppercase tracking-widest">Display Name & Bio</h4>
                      <p className="text-[10px] text-[var(--text-muted)] mt-1 font-medium">Configure your primary handle and status.</p>
                    </div>
                  </div>
                  <button className="text-[10px] font-black uppercase tracking-widest text-primary-gold px-5 py-2 bg-primary-gold/10 border border-primary-gold/20 hover:bg-primary-gold/20 transition-all rounded-[4px] flex items-center justify-center gap-2">
                    <Edit2 size={12} /> Edit Profile
                  </button>
                </div>
              </PremiumCard>

              <PremiumCard>
                <div className="flex items-start sm:items-center justify-between flex-col sm:flex-row gap-4">
                  <div className="flex items-center gap-5">
                    <div className="size-12 bg-[var(--pill-bg)] flex items-center justify-center text-primary-gold border border-[var(--border-color)] shrink-0 rounded-[4px]">
                      <Globe size={20} />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-[var(--text-main)] uppercase tracking-widest">Digital Presence</h4>
                      <p className="text-[10px] text-[var(--text-muted)] mt-1 font-medium">Link your external portfolio and socials.</p>
                    </div>
                  </div>
                  <span className="text-[9px] uppercase font-black tracking-widest text-[var(--text-muted)] bg-[var(--pill-bg)] px-4 py-1.5 border border-[var(--border-color)] rounded-[4px]">Not Linked</span>
                </div>
              </PremiumCard>
            </div>
          </section>

          {/* Personalization Section */}
          <section>
            <SectionHeader title="Experience" subtitle="Tailor the feed and interface to your rhythm." />
            <div className="grid sm:grid-cols-2 gap-3">
              <PremiumCard>
                <div className="flex items-center gap-4">
                  <PlayCircle size={18} className="text-[var(--text-muted)]" />
                  <div className="flex flex-col">
                    <span className="text-[11px] font-black text-[var(--text-main)] uppercase tracking-widest">Autoplay</span>
                    <span className="text-[10px] text-[var(--text-muted)] font-bold uppercase tracking-tighter">On Wifi Only</span>
                  </div>
                </div>
              </PremiumCard>
              <PremiumCard>
                <div className="flex items-center gap-4">
                  <Languages size={18} className="text-[var(--text-muted)]" />
                  <div className="flex flex-col">
                    <span className="text-[11px] font-black text-[var(--text-main)] uppercase tracking-widest">Language</span>
                    <span className="text-[10px] text-[var(--text-muted)] font-bold uppercase tracking-tighter">English (KE)</span>
                  </div>
                </div>
              </PremiumCard>
              <PremiumCard>
                <div className="flex items-center gap-4">
                  <Tag size={18} className="text-[var(--text-muted)]" />
                  <div className="flex flex-col">
                    <span className="text-[11px] font-black text-[var(--text-main)] uppercase tracking-widest">Interests</span>
                    <span className="text-[10px] text-[var(--text-muted)] font-bold uppercase tracking-tighter">7 Managed Topics</span>
                  </div>
                </div>
              </PremiumCard>
              <PremiumCard>
                <div className="flex items-center gap-4">
                  <Bell size={18} className="text-[var(--text-muted)]" />
                  <div className="flex flex-col">
                    <span className="text-[11px] font-black text-[var(--text-main)] uppercase tracking-widest">Digests</span>
                    <span className="text-[10px] text-[var(--text-muted)] font-bold uppercase tracking-tighter">Weekly Summary</span>
                  </div>
                </div>
              </PremiumCard>
            </div>
          </section>

          {/* Status Section */}
          <section>
            <SectionHeader title="Tier & Verification" />
            <PremiumCard className="!bg-gradient-to-br from-black to-zinc-900 border-primary-gold/20 !p-6 shadow-2xl">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-5">
                  <div className="size-14 bg-primary-gold flex items-center justify-center text-black shadow-[0_0_30px_rgba(197,160,89,0.3)] shrink-0 group-hover:scale-105 transition-transform rounded-[4px]">
                    <Sparkles size={24} />
                  </div>
                  <div>
                    <h4 className="text-sm font-black text-white uppercase tracking-widest">Kihumba Apex</h4>
                    <p className="text-[10px] text-primary-gold/70 uppercase font-black tracking-[0.2em] mt-1">Status: Infinite</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/5 rounded-[4px]">
                   <ShieldCheck size={14} className="text-primary-gold" />
                   <span className="text-[9px] font-black uppercase text-white tracking-widest">Verified</span>
                </div>
              </div>
            </PremiumCard>
          </section>
        </motion.div>
      </main>

      <RightSidebar />
      <BottomNav />
    </div>
  );
}
