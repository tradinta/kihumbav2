'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { User, Lock, Shield, Palette, Bell } from 'lucide-react';
import { motion } from 'framer-motion';

const TABS = [
  { id: '/settings', label: 'Account', icon: User },
  { id: '/settings/privacy', label: 'Privacy', icon: Lock },
  { id: '/settings/security', label: 'Security & Access', icon: Shield },
  { id: '/settings/display', label: 'Display', icon: Palette },
  { id: '/settings/notifications', label: 'Alerts', icon: Bell },
];

export default function SettingsNav() {
  const pathname = usePathname();

  return (
    <div className="flex gap-1 border-b border-white/5 mb-8 overflow-x-auto no-scrollbar pb-px">
      {TABS.map((tab) => {
        const isActive = pathname === tab.id;
        return (
          <Link
            key={tab.id}
            href={tab.id}
            className={`relative flex items-center gap-2 px-5 py-4 text-[9px] font-semibold uppercase tracking-widest transition-colors whitespace-nowrap ${
              isActive ? 'text-primary-gold' : 'text-muted-custom hover:text-main hover:bg-white/5'
            }`}
          >
            <tab.icon size={14} />
            <span>{tab.label}</span>
            {isActive && (
              <motion.div
                layoutId="settings-nav-indicator"
                className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary-gold shadow-[0_0_8px_rgba(197,160,89,0.5)]"
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
              />
            )}
          </Link>
        );
      })}
    </div>
  );
}
