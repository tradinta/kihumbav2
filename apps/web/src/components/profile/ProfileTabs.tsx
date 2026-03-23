'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { FileText, ShoppingBag, Store, User } from 'lucide-react';

export type ProfileTab = 'posts' | 'marketplace' | 'kao' | 'about';

interface Props {
  active: ProfileTab;
  onChange: (tab: ProfileTab) => void;
}

const TABS: { id: ProfileTab; label: string; icon: React.ElementType }[] = [
  { id: 'posts', label: 'Posts', icon: FileText },
  { id: 'marketplace', label: 'Marketplace', icon: ShoppingBag },
  { id: 'kao', label: 'Kao', icon: Store },
  { id: 'about', label: 'About', icon: User },
];

export default function ProfileTabs({ active, onChange }: Props) {
  return (
    <div className="px-4 mb-6">
      <div className="flex gap-1 overflow-x-auto no-scrollbar">
        {TABS.map(tab => (
          <button
            key={tab.id}
            onClick={() => onChange(tab.id)}
            className={`relative px-4 py-2 rounded text-[9px] font-bold uppercase tracking-widest flex items-center gap-1.5 transition-all border whitespace-nowrap ${
              active === tab.id
                ? 'bg-primary-gold/15 text-primary-gold border-primary-gold/30'
                : 'card-surface text-muted-custom border-custom hover:text-primary-gold'
            }`}
          >
            <tab.icon size={12} />
            {tab.label}
            {active === tab.id && (
              <motion.div layoutId="profileTabIndicator" className="absolute bottom-0 inset-x-0 h-0.5 bg-primary-gold rounded-full" />
            )}
          </button>
        ))}
      </div>
    </div>
  );
}
