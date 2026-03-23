'use client';

import React, { useState } from 'react';
import LeftSidebar from '@/components/LeftSidebar';
import TopBar from '@/components/TopBar';
import BottomNav from '@/components/BottomNav';
import ProfileHero from '@/components/profile/ProfileHero';
import ProfileStats from '@/components/profile/ProfileStats';
import ProfileTabs, { type ProfileTab } from '@/components/profile/ProfileTabs';
import ProfilePosts from '@/components/profile/ProfilePosts';
import ProfileMarketplace from '@/components/profile/ProfileMarketplace';
import ProfileKao from '@/components/profile/ProfileKao';
import ProfileAbout from '@/components/profile/ProfileAbout';
import ProfileRightSidebar from '@/components/profile/ProfileRightSidebar';
import {
  mockUser, userPosts, userListings, userReviews,
  userProperties, achievements, similarProfiles,
} from '@/data/profileData';

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState<ProfileTab>('posts');
  const user = mockUser;

  return (
    <div className="max-w-[1400px] mx-auto flex flex-col lg:flex-row min-h-screen lg:px-6 gap-6">
      <LeftSidebar />

      <main className="flex-1 w-full max-w-2xl mx-auto lg:mx-0 pt-0 lg:pt-4 pb-32 lg:pb-12">
        <TopBar />

        {/* Hero */}
        <div className="pt-4">
          <ProfileHero user={user} />
        </div>

        {/* Stats */}
        <ProfileStats user={user} />

        {/* Tabs */}
        <ProfileTabs active={activeTab} onChange={setActiveTab} />

        {/* Tab Content */}
        {activeTab === 'posts' && <ProfilePosts posts={userPosts} />}
        {activeTab === 'marketplace' && (
          <ProfileMarketplace user={user} listings={userListings} reviews={userReviews} />
        )}
        {activeTab === 'kao' && <ProfileKao properties={userProperties} />}
        {activeTab === 'about' && <ProfileAbout user={user} />}
      </main>

      <ProfileRightSidebar user={user} achievements={achievements} similarProfiles={similarProfiles} />
      <BottomNav />
    </div>
  );
}
