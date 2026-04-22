"use client";

import React from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { 
  LayoutDashboard, Video, Megaphone, BarChart3, Wallet, MessageSquare
} from 'lucide-react';

const STUDIO_TABS = [
  { id: 'overview', name: 'Overview', icon: LayoutDashboard },
  { id: 'content', name: 'Content', icon: Video },
  { id: 'campaigns', name: 'Campaigns', icon: Megaphone },
  { id: 'analytics', name: 'Analytics', icon: BarChart3 },
  { id: 'revenue', name: 'Revenue', icon: Wallet },
  { id: 'comments', name: 'Comments', icon: MessageSquare },
];

export default function StudioTabs() {
  const pathname = usePathname();
  const activeTab = pathname.split('/').pop() || 'overview';

  return (
    <div className="flex gap-1.5 overflow-x-auto no-scrollbar pb-2">
      <div className="card-surface rounded-lg p-0.5 flex">
        {STUDIO_TABS.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <Link
              key={tab.id}
              href={`/studio/${tab.id}`}
              className={`px-4 py-2 rounded text-[9px] font-bold uppercase tracking-widest transition-all flex items-center gap-2 whitespace-nowrap ${
                isActive
                  ? "bg-primary-gold/15 text-primary-gold border border-primary-gold/30 shadow-lg shadow-primary-gold/5"
                  : "text-muted-custom border border-transparent hover:text-white"
              }`}
            >
              <tab.icon size={14} strokeWidth={isActive ? 3 : 2} />
              {tab.name}
            </Link>
          );
        })}
      </div>
    </div>
  );
}
