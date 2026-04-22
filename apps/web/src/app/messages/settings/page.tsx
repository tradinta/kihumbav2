'use client';

import React, { useState } from 'react';
import { 
  Shield, Eye, EyeOff, MessageSquare, Archive, 
  ChevronLeft, ToggleLeft, ToggleRight, CheckCircle2, 
  Globe, Bell, Clock, Trash2, X
} from 'lucide-react';
import Link from 'next/link';
import { motion } from 'framer-motion';

export default function MessagesSettingsPage() {
  const [settings, setSettings] = useState({
    keepArchived: true,
    readReceipts: true,
    showOnlineStatus: false,
    notifications: true,
    autoPurge: false
  });

  const toggleSetting = (key: keyof typeof settings) => {
    setSettings(prev => ({ ...prev, [key]: !prev[key] }));
    // In production, this would call api.post('/users/settings/messaging', ...)
  };

  const SettingRow = ({ 
    icon: Icon, 
    title, 
    description, 
    active, 
    onClick 
  }: { 
    icon: any, 
    title: string, 
    description: string, 
    active: boolean, 
    onClick: () => void 
  }) => (
    <div className="flex items-center justify-between p-4 rounded-2xl bg-white/[0.02] border border-white/5 hover:border-primary-gold/20 transition-all group">
      <div className="flex items-center gap-4">
        <div className={`size-10 rounded-xl flex items-center justify-center border ${active ? 'bg-primary-gold/10 border-primary-gold/20 text-primary-gold' : 'bg-white/5 border-white/10 text-muted-custom'}`}>
          <Icon size={18} />
        </div>
        <div className="flex flex-col gap-0.5">
          <h3 className="text-[11px] font-black uppercase tracking-widest text-white">{title}</h3>
          <p className="text-[9px] text-muted-custom font-bold uppercase tracking-tighter opacity-60 max-w-[280px]">
            {description}
          </p>
        </div>
      </div>
      <button 
        onClick={onClick}
        className={`size-12 rounded-xl flex items-center justify-center transition-all ${active ? 'text-primary-gold' : 'text-muted-custom/40 hover:text-muted-custom'}`}
      >
        {active ? <ToggleRight size={32} /> : <ToggleLeft size={32} />}
      </button>
    </div>
  );

  return (
    <div className="flex-1 flex flex-col bg-black">
      {/* Header */}
      <div className="p-6 border-b border-white/5 flex items-center gap-6">
        <Link 
          href="/messages"
          className="size-10 rounded-full bg-white/5 flex items-center justify-center text-muted-custom hover:text-primary-gold transition-all"
        >
          <ChevronLeft size={20} />
        </Link>
        <div className="flex flex-col">
          <h1 className="text-sm font-black uppercase tracking-[0.4em] text-primary-gold">Vault Configuration</h1>
          <p className="text-[9px] font-bold text-muted-custom uppercase tracking-widest opacity-40">Manage secure messaging protocols</p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto no-scrollbar p-6">
        <div className="max-w-2xl mx-auto space-y-8">
          
          {/* Privacy Section */}
          <section className="space-y-4">
            <div className="flex items-center gap-3 px-1">
              <Shield size={14} className="text-primary-gold" />
              <h2 className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-custom">Privacy & Sovereignty</h2>
            </div>
            
            <div className="grid gap-2">
              <SettingRow 
                icon={EyeOff}
                title="Conceal Online Status"
                description="Disable real-time presence indicators. Peers will not see when you are active in the vault."
                active={settings.showOnlineStatus}
                onClick={() => toggleSetting('showOnlineStatus')}
              />
              <SettingRow 
                icon={CheckCircle2}
                title="Read Receipts"
                description="Allow others to see when you have decrypted and read their transmissions."
                active={settings.readReceipts}
                onClick={() => toggleSetting('readReceipts')}
              />
            </div>
          </section>

          {/* Archive Section */}
          <section className="space-y-4">
            <div className="flex items-center gap-3 px-1">
              <Archive size={14} className="text-primary-gold" />
              <h2 className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-custom">Data Management</h2>
            </div>
            
            <div className="grid gap-2">
              <SettingRow 
                icon={Archive}
                title="Persistent Archive"
                description="Keep archived chats hidden even when new messages are received. Manual unarchive required."
                active={settings.keepArchived}
                onClick={() => toggleSetting('keepArchived')}
              />
              <SettingRow 
                icon={Clock}
                title="Ephemeral Notifications"
                description="Mute background activity for archived conversations to reduce cognitive load."
                active={settings.notifications}
                onClick={() => toggleSetting('notifications')}
              />
            </div>
          </section>

          {/* Dangerous Zone */}
          <section className="pt-8 mt-8 border-t border-white/5 space-y-4">
             <div className="flex items-center gap-3 px-1">
                <Trash2 size={14} className="text-red-500" />
                <h2 className="text-[10px] font-black uppercase tracking-[0.2em] text-red-500/60">Dangerous Protocols</h2>
             </div>
             
             <button className="w-full p-4 rounded-2xl bg-red-500/5 border border-red-500/10 hover:bg-red-500/10 hover:border-red-500/30 transition-all flex items-center justify-between group">
                <div className="flex flex-col items-start gap-0.5">
                   <span className="text-[11px] font-black uppercase tracking-widest text-red-500">Wipe All Vault History</span>
                   <span className="text-[9px] font-bold text-red-500/40 uppercase tracking-tighter">Permanently delete every message and connection.</span>
                </div>
                <div className="size-10 rounded-xl bg-red-500/10 flex items-center justify-center text-red-500 group-hover:scale-110 transition-transform">
                   <Trash2 size={18} />
                </div>
             </button>
          </section>

        </div>
      </div>
    </div>
  );
}
