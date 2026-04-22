'use client';

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import LeftSidebar from "@/components/LeftSidebar";
import RightSidebar from "@/components/RightSidebar";
import BottomNav from "@/components/BottomNav";
import TopBar from "@/components/TopBar";
import SettingsNav from "@/components/settings/SettingsNav";
import { 
  Shield, MessageSquare, Users, Home, FileText, 
  Lock, UserX, Database, Smartphone, Bell, ScanFace,
  Loader2
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { api } from "@/lib/api";
import { useSnackbar } from "@/context/SnackbarContext";

const SectionHeader = ({ title, icon: Icon }: { title: string, icon: any }) => (
  <div className="flex items-center gap-3 mb-6 first:mt-0 pb-4 border-b border-[var(--border-color)]">
    <Icon size={16} className="text-primary-gold/70" strokeWidth={1.5} />
    <h3 className="text-[var(--text-main)] text-[10px] font-black uppercase tracking-[0.2em]">{title}</h3>
  </div>
);

const SettingToggle = ({ label, description, checked, onChange, isPremium = false, disabled = false }: any) => {
  return (
    <div 
      className={`flex items-center justify-between py-5 group cursor-pointer border border-transparent hover:bg-black/5 dark:hover:bg-white/[0.02] px-4 -mx-4 transition-all rounded-lg ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`} 
      onClick={() => !disabled && onChange(!checked)}
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

const SettingSelect = ({ label, description, options, defaultValue }: any) => {
  const [value, setValue] = useState(defaultValue);
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between py-5 group border border-transparent hover:bg-black/5 dark:hover:bg-white/[0.02] px-4 -mx-4 transition-all rounded-lg gap-4">
      <div className="space-y-1.5 pr-8">
        <h4 className="text-xs font-bold text-[var(--text-main)] uppercase tracking-wide group-hover:text-primary-gold transition-colors">{label}</h4>
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

export default function PrivacySettingsPage() {
  return (
    <SettingsGuard title="Privacy Matrix">
      <PrivacyContent />
    </SettingsGuard>
  );
}

function PrivacyContent() {
  const { user } = useAuth();
  const { showSnackbar } = useSnackbar();
  const [activeTab, setActiveTab] = useState('identity');
  const [isSaving, setIsSaving] = useState(false);

  const [settings, setSettings] = useState({
    searchEngineIndexing: user?.searchEngineIndexing ?? true,
    privateAccount: user?.privateAccount ?? false,
    stealthMode: false,
    onlineStatus: true,
  });

  const handleUpdate = async (key: string, value: any) => {
    const newSettings = { ...settings, [key]: value };
    
    // Logic: Private Account ON forces Search Indexing OFF
    if (key === 'privateAccount' && value === true) {
      newSettings.searchEngineIndexing = false;
    }
    // Logic: Search Indexing ON forces Private Account OFF
    if (key === 'searchEngineIndexing' && value === true) {
      newSettings.privateAccount = false;
    }

    setSettings(newSettings);
    setIsSaving(true);
    
    try {
      await api.patch('/users/profile', {
        privateAccount: newSettings.privateAccount,
        searchEngineIndexing: newSettings.searchEngineIndexing,
      });
      showSnackbar("Your privacy settings have been updated.", "success");
    } catch (error: any) {
      const message = error.response?.data?.message || error.message || "Something went wrong";
      showSnackbar(`We couldn't save your changes: ${message}`, "error");
    } finally {
      setIsSaving(false);
    }
  };

  const tabs = [
    { id: 'identity', label: 'Identity', icon: Shield },
    { id: 'interact', label: 'Social', icon: MessageSquare },
    { id: 'media', label: 'Content', icon: FileText },
    { id: 'networks', label: 'Network', icon: Users },
    { id: 'specialized', label: 'Commerce', icon: Home },
    { id: 'security', label: 'Safety', icon: Lock },
  ];

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
          <h1 className="text-4xl font-black tracking-tighter text-[var(--text-main)] mb-2">Privacy Matrix</h1>
          <div className="flex items-center justify-between">
            <p className="text-[var(--text-muted)] text-[10px] font-black uppercase tracking-[0.3em]">Hyper-Granular Sovereignty</p>
            {isSaving && (
              <div className="flex items-center gap-2 text-primary-gold animate-pulse">
                <Loader2 size={12} className="animate-spin" />
                <span className="text-[9px] font-black uppercase tracking-widest">Syncing Matrix...</span>
              </div>
            )}
          </div>
        </motion.div>

        <SettingsNav />

        {/* Custom Tabbed Navigation */}
        <div className="flex gap-2 overflow-x-auto pb-6 scrollbar-hide no-scrollbar">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-3 py-2 rounded-[4px] border transition-all shrink-0 ${
                  activeTab === tab.id 
                    ? 'bg-primary-gold/10 border-primary-gold/30 text-primary-gold' 
                    : 'bg-[var(--card-bg)] border-[var(--border-color)] text-[var(--text-muted)] hover:border-primary-gold/20'
                }`}
              >
                <Icon size={14} strokeWidth={activeTab === tab.id ? 2.5 : 2} />
                <span className="text-[10px] font-black uppercase tracking-widest">{tab.label}</span>
              </button>
            )
          })}
        </div>

        <motion.div 
          layout
          className="relative border border-[var(--border-color)] bg-[var(--card-bg)] p-4 sm:p-8 rounded-[6px] shadow-2xl min-h-[600px]"
        >
          <AnimatePresence mode="wait">
            {activeTab === 'identity' && (
              <motion.section 
                key="identity"
                initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
                className="space-y-8"
              >
                <SectionHeader title="Digital Footprint" icon={Shield} />
                <div className="divide-y divide-[var(--border-color)]">
                  <SettingToggle 
                    label="Stealth Mode" 
                    description="Disappear from all 'Suggested' lists and activity feeds across Kihumba." 
                    checked={settings.stealthMode}
                    onChange={(v: boolean) => setSettings({...settings, stealthMode: v})}
                    isPremium 
                  />
                  <SettingToggle 
                    label="Search Engine Indexing" 
                    description="Allow external robots like Google to crawl and index your profile. Not recommended for maximum privacy." 
                    checked={settings.searchEngineIndexing}
                    onChange={(v: boolean) => handleUpdate('searchEngineIndexing', v)}
                    disabled={isSaving}
                  />
                  <SettingToggle 
                    label="Private Account" 
                    description="Full lockdown. Only mutual friends can see your footprint. Participation in public tribes will be restricted." 
                    checked={settings.privateAccount}
                    onChange={(v: boolean) => handleUpdate('privateAccount', v)}
                    disabled={isSaving}
                  />
                  <SettingSelect label="Profile Photo Visibility" description="Control who can render your high-res avatar." options={["Everyone", "Followers", "Nobody"]} defaultValue="Everyone" />
                  <SettingToggle 
                    label="Online Status" 
                    description="Display the pulse indicator when you are active." 
                    checked={settings.onlineStatus}
                    onChange={(v: boolean) => setSettings({...settings, onlineStatus: v})}
                  />
                </div>

                <SectionHeader title="Biometrics & Presence" icon={ScanFace} />
                <div className="divide-y divide-[var(--border-color)]">
                  <SettingToggle label="Face ID Lock" description="Require biometric authentication to open the Kihumba app." isPremium />
                  <SettingToggle label="Screenshot Notifications" description="Alert you if someone captures a screen of your private content." isPremium />
                  <SettingToggle label="Auto-Expire Presence" description="Profile goes dark (hidden) after 14 days of inactivity." defaultChecked={false} />
                </div>
              </motion.section>
            )}

            {activeTab === 'interact' && (
              <motion.section 
                key="interact"
                initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
                className="space-y-8"
              >
                <SectionHeader title="Signal Controls" icon={MessageSquare} />
                <div className="divide-y divide-[var(--border-color)]">
                  <SettingSelect label="Following Approval" description="Manual approval for all incoming follow requests." options={["Everyone", "Manual"]} defaultValue="Everyone" />
                  <SettingSelect label="Direct Messages" description="Who can start a signal thread with you." options={["Everyone", "Followers", "Nobody"]} defaultValue="Followers" />
                  <SettingToggle label="Mention Protection" description="Block @mentions from users you do not follow." defaultChecked={false} />
                  <SettingToggle label="Read Receipts" description="Show when you've decoded a message." defaultChecked={true} />
                </div>
              </motion.section>
            )}

            {activeTab === 'media' && (
              <motion.section 
                key="media"
                initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
                className="space-y-8"
              >
                <SectionHeader title="Asset Sovereignty" icon={FileText} />
                <div className="divide-y divide-[var(--border-color)]">
                  <SettingSelect label="Default Visibility" description="Audience for new posts, videos, and sparks." options={["Public", "Followers", "Private"]} defaultValue="Public" />
                  <SettingToggle label="Content Resharing" description="Allow others to rebroadcast your content." defaultChecked={true} />
                  <SettingToggle label="Status Ghosting" description="View others' fires without leaving a view record." isPremium />
                  <SettingToggle label="Video Remixing" description="Allow others to duet your video assets." defaultChecked={true} />
                </div>
              </motion.section>
            )}

            {activeTab === 'networks' && (
              <motion.section 
                key="networks"
                initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
                className="space-y-8"
              >
                <SectionHeader title="Tribe Dynamics" icon={Users} />
                <div className="divide-y divide-[var(--border-color)]">
                  <SettingToggle label="Anonymous Browsing" description="Hide your membership from Tribe member lists." isPremium />
                  <SettingToggle label="Publicize Memberships" description="Display your Tribe badges on your profile." defaultChecked={true} />
                  <SettingSelect label="Tribe Invites" description="Who can pull you into new Tribes." options={["Everyone", "Followers", "Nobody"]} defaultValue="Followers" />
                </div>
              </motion.section>
            )}

            {activeTab === 'specialized' && (
              <motion.section 
                key="specialized"
                initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
                className="space-y-8"
              >
                <SectionHeader title="Commerce Privacy" icon={Home} />
                <div className="divide-y divide-[var(--border-color)]">
                  <SettingToggle label="Phone Masking" description="Automatically mask your number on KAO/Market listings." defaultChecked={true} />
                  <SettingToggle label="Fuzzy Location" description="Show a generic 3km radius for your listings." defaultChecked={false} />
                  <SettingToggle label="Verified-Only Contact" description="Only allow ID-Verified users to send inquiries." isPremium />
                </div>
              </motion.section>
            )}

            {activeTab === 'security' && (
              <motion.section 
                key="security"
                initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
                className="space-y-8"
              >
                <SectionHeader title="Active Sessions" icon={Smartphone} />
                <div className="p-4 rounded-[4px] bg-[var(--pill-bg)] border border-[var(--border-color)] space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Smartphone size={16} className="text-primary-gold" />
                      <div className="flex flex-col">
                        <span className="text-xs font-black text-[var(--text-main)] uppercase tracking-widest">iPhone 15 Pro</span>
                        <span className="text-[9px] text-[var(--text-muted)] uppercase tracking-widest">Nairobi, Kenya • Active Now</span>
                      </div>
                    </div>
                    <button className="text-[9px] font-black uppercase text-red-500 hover:bg-red-500/10 px-3 py-1.5 rounded-[4px] transition-all">Revoke</button>
                  </div>
                </div>

                <SectionHeader title="Data & Sovereignty" icon={Database} />
                <div className="divide-y divide-[var(--border-color)]">
                  <button className="w-full flex items-center justify-between py-5 group">
                    <div className="text-left">
                      <h4 className="text-xs font-black text-[var(--text-main)] uppercase tracking-widest group-hover:text-primary-gold transition-colors">Download Data Vault</h4>
                      <p className="text-[10px] text-[var(--text-muted)] font-medium">Request a ZIP of all your posts, messages, and interactions.</p>
                    </div>
                  </button>
                  <button className="w-full flex items-center justify-between py-5 group">
                    <div className="text-left">
                      <h4 className="text-xs font-black text-red-500 uppercase tracking-widest group-hover:brightness-125 transition-all">Decommission Account</h4>
                      <p className="text-[10px] text-[var(--text-muted)] font-medium">Permanent deletion of all your Kihumba data and identity.</p>
                    </div>
                  </button>
                </div>
              </motion.section>
            )}
          </AnimatePresence>
        </motion.div>
      </main>

      <RightSidebar />
      <BottomNav />
    </div>
  );
}
