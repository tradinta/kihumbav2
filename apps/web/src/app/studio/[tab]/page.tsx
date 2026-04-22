"use client";

import React from 'react';
import { useParams } from 'next/navigation';
import { AnimatePresence } from 'framer-motion';
import { studioData } from '@/data/studioData';

// Modular Tab Imports
import { useStudioSync } from '@/hooks/useStudioSync';
import OverviewTab from '@/components/studio/tabs/OverviewTab';
import ContentTab from '@/components/studio/tabs/ContentTab';
import CampaignsTab from '@/components/studio/tabs/CampaignsTab';
import AnalyticsTab from '@/components/studio/tabs/AnalyticsTab';
import RevenueTab from '@/components/studio/tabs/RevenueTab';
import CommentsTab from '@/components/studio/tabs/CommentsTab';
import StudioSkeleton from '@/components/studio/StudioSkeleton';
import StudioTabs from '@/components/studio/StudioTabs';

// Global Layout Imports
import LeftSidebar from "@/components/LeftSidebar";
import TopBar from "@/components/TopBar";
import BottomNav from "@/components/BottomNav";

export default function StudioTabPage() {
  const params = useParams();
  const activeTab = params.tab as string || 'overview';
  const { partnerProfile, briefs, videos, loading, refresh } = useStudioSync();

  if (loading && !partnerProfile) {
    return (
      <div className="max-w-[1400px] mx-auto flex flex-col lg:flex-row min-h-screen lg:px-6 gap-6">
        <LeftSidebar />
        <main className="flex-1 w-full max-w-3xl mx-auto lg:mx-0 pt-0 lg:pt-4 pb-32 lg:pb-12">
          <StudioSkeleton />
        </main>
      </div>
    );
  }

  const totalViews = videos.reduce((acc, v) => acc + (v.viewCount || 0), 0);
  const totalUpvotes = videos.reduce((acc, v) => acc + (v._count?.interactions || 0), 0);

  const analytics = {
    totalViews,
    totalUpvotes,
    estimatedEarnings: partnerProfile?.totalEarned || 0,
    newSubscribers: 0,
    payouts: partnerProfile?.currentBalance || 0,
    pendingPayout: partnerProfile?.pendingBalance || 0,
    watchTimeHours: 0,
    viewsTrend: 12,
    subsTrend: 1,
    watchTimeTrend: 5,
    earningsTrend: 8,
  };

  return (
    <div className="max-w-[1400px] mx-auto flex flex-col lg:flex-row min-h-screen lg:px-6 gap-6">
      <LeftSidebar />

      <main className="flex-1 w-full max-w-3xl mx-auto lg:mx-0 pt-0 lg:pt-4 pb-32 lg:pb-12">
        <TopBar />

        {/* Studio Header */}
        <div className="px-4 pt-6 pb-2">
          <div className="flex items-center gap-2 mb-1">
            <h1 className="text-lg font-bold tracking-[0.2em] uppercase text-primary-gold gold-glow">Creator Studio</h1>
            <span className="px-2 py-0.5 rounded bg-primary-gold/10 text-primary-gold border border-primary-gold/30 text-[9px] font-bold uppercase tracking-widest">Partner</span>
          </div>
          <p className="text-[10px] text-muted-custom font-bold uppercase tracking-widest">Manage your content and earnings</p>
        </div>

        {/* Studio Navigation */}
        <div className="px-4 mb-6">
          <StudioTabs />
        </div>

        {/* Tab Content Area */}
        <div className="px-4">
          <AnimatePresence mode="wait">
            {activeTab === 'overview' && (
              <OverviewTab 
                  key="overview" 
                  data={analytics} 
                  content={videos} 
                  heatmap={partnerProfile?.audienceHeatmap || []} 
              />
            )}
            {activeTab === 'content' && (
              <ContentTab 
                  key="content" 
                  content={videos} 
                  refresh={refresh}
              />
            )}
            {activeTab === 'campaigns' && (
              <CampaignsTab 
                  key="campaigns" 
                  campaigns={briefs} 
                  partnerProfile={partnerProfile}
                  videos={videos}
                  refresh={refresh}
              />
            )}
            {activeTab === 'analytics' && (
              <AnalyticsTab 
                  key="analytics" 
                  data={analytics} 
                  content={videos} 
                  heatmap={studioData.audienceHeatmap} 
              />
            )}
            {activeTab === 'revenue' && (
              <RevenueTab 
                  key="revenue" 
                  data={analytics} 
                  payouts={analytics.estimatedEarnings} 
              />
            )}
            {activeTab === 'comments' && (
              <CommentsTab key="comments" content={videos} />
            )}
          </AnimatePresence>
        </div>
      </main>

      <BottomNav />
    </div>
  );
}
