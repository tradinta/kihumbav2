'use client';

import React, { useState, useEffect } from 'react';
import { UserX, AlertCircle, ShieldAlert, History, Search, Lock } from 'lucide-react';
import LeftSidebar from '@/components/LeftSidebar';
import TopBar from '@/components/TopBar';
import BottomNav from '@/components/BottomNav';
import ProfileHero from '@/components/profile/ProfileHero';
import ProfileStats from '@/components/profile/ProfileStats';
import ProfileTabs, { type ProfileTab } from '@/components/profile/ProfileTabs';
import ProfilePosts from '@/components/profile/ProfilePosts';
import ProfileMarketplace from '@/components/profile/ProfileMarketplace';
import ProfileKao from '@/components/profile/ProfileKao';
import ProfileBadges from '@/components/profile/ProfileBadges';
import ProfileRightSidebar from '@/components/profile/ProfileRightSidebar';
import ProfileSkeleton from '@/components/profile/ProfileSkeleton';
import EditProfileModal from '@/components/profile/EditProfileModal';
import SuggestedFollows from '@/components/profile/SuggestedFollows';
import SocialModal from '@/components/profile/SocialModal';
import { api } from '@/lib/api';
import { useAuth } from '@/context/AuthContext';
import { 
  userListings, userReviews, userProperties, 
  achievements, similarProfiles 
} from '@/data/profileData';

interface Props {
  username: string;
}

export default function ProfileClient({ username }: Props) {
  const { user: currentUser } = useAuth();
  const [user, setUser] = useState<any>(null);
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [socialModalState, setSocialModalState] = useState<{isOpen: boolean, tab: 'followers' | 'following'}>({ isOpen: false, tab: 'followers' });
  const [activeTab, setActiveTab] = useState<ProfileTab>('posts');

  const isSelf = currentUser?.username === username || currentUser?.id === user?.id;

  const fetchData = async () => {
    try {
      setLoading(true);
      const profileData = await api.get(`/users/profile/${username}`);
      setUser(profileData);

      // Fetch real posts for this user
      const { posts: postsData } = await api.get(`/posts/user/${profileData.id}`);
      setPosts(postsData);
    } catch (err) {
      console.error("Failed to fetch profile", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (username) fetchData();
  }, [username]);

  if (loading) return <ProfileSkeleton />;

  const isPrivateLock = user?.isPrivate && !user?.isFriend && !user?.isOwner;

  if (!user || isPrivateLock) return (
    <div className="max-w-[1400px] mx-auto flex flex-col lg:flex-row min-h-screen lg:px-6 gap-6">
      <LeftSidebar />

      <main className="flex-1 w-full max-w-2xl mx-auto lg:mx-0 pt-0 lg:pt-4 pb-32 lg:pb-12">
        <TopBar />
        
        <div className="pt-4 px-4 sm:px-0">
          <div className="card-surface rounded-2xl overflow-hidden border border-custom relative">
            {/* Ghost Cover */}
            <div className="h-48 bg-bg-color relative overflow-hidden">
               <div className="absolute inset-0 bg-[repeating-linear-gradient(45deg,transparent,transparent_10px,rgba(255,255,255,0.01)_10px,rgba(255,255,255,0.01)_20px)]" />
               <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />
            </div>

            {/* Ghost Avatar & Header */}
            <div className="relative px-6 pb-8">
               <div className="flex justify-between items-end -mt-16 mb-6">
                  <div className="size-32 rounded-2xl border-4 border-black bg-pill-surface backdrop-blur-md flex items-center justify-center relative overflow-hidden shadow-2xl">
                     {isPrivateLock ? (
                        <div className="absolute inset-0 flex items-center justify-center bg-black/60 z-20">
                           <Lock size={48} className="text-primary-gold animate-pulse" />
                        </div>
                     ) : !user ? (
                        <UserX size={48} className="text-white/10" />
                     ) : null}
                     
                     {/* Conditionally render gendered placeholders or real avatar */}
                     {(user?.avatar || isPrivateLock || !user) && (
                        <img 
                          src={user?.avatar || (user?.gender === 'FEMALE' ? '/placeholders/anonymous_woman.png' : '/placeholders/anonymous_man.png')} 
                          className={`absolute inset-0 size-full object-cover ${isPrivateLock ? 'blur-xl opacity-30' : ''}`} 
                          alt="Profile placeholder"
                        />
                     )}
                  </div>
                  <button disabled className="h-10 px-6 rounded-xl bg-white/5 text-muted-custom text-[10px] font-semibold uppercase tracking-widest cursor-not-allowed border border-white/5 flex items-center gap-2">
                     {isPrivateLock ? <Lock size={12} /> : null}
                     {isPrivateLock ? 'Locked' : 'Unavailable'}
                  </button>
               </div>
               
               <div className="space-y-1 mb-8">
                  {user?.fullName === 'IDENTITY_LOCKED' ? (
                     <div className="flex flex-col gap-2">
                        {/* Blurred Name Skeleton Strip */}
                        <div className="h-8 w-48 bg-white/10 rounded-sm blur-[6px] animate-pulse relative overflow-hidden">
                           <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent animate-shimmer" />
                        </div>
                        <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-primary-gold/40">@{user.username || username}</p>
                     </div>
                  ) : (
                     <>
                        <h1 className="text-2xl font-semibold text-white tracking-tight flex items-center gap-2">
                           {isPrivateLock ? user?.fullName : `@${username}`}
                           {isPrivateLock && <span className="text-[10px] bg-primary-gold/10 text-primary-gold px-2 py-0.5 rounded-full font-black tracking-widest">Private</span>}
                        </h1>
                        <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-primary-gold/40">
                           {isPrivateLock ? `@${user?.username}` : 'Ghost Profile'}
                        </p>
                     </>
                  )}
               </div>

               {/* Explanatory Section */}
               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {isPrivateLock ? (
                    <div className="p-8 rounded-sm bg-black/40 border border-primary-gold/20 flex flex-col items-center text-center col-span-2">
                      <ShieldAlert size={32} className="text-primary-gold mb-4" />
                      <h3 className="text-sm font-black uppercase tracking-[0.2em] text-white mb-3">This Account is Private</h3>
                      <p className="text-[11px] text-muted-custom font-medium leading-relaxed max-w-sm">
                        Access to this footprint is restricted. You must be a mutual friend to view this profile's content and activity feeds.
                      </p>
                      <div className="mt-8 flex gap-3">
                        <button className="h-10 px-8 rounded-sm bg-primary-gold text-black text-[10px] font-black uppercase tracking-widest hover:brightness-110 transition-all">
                          Follow to Request
                        </button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className="p-6 rounded-xl bg-black/40 border border-custom border-dashed flex flex-col items-center text-center">
                        <AlertCircle size={24} className="text-muted-custom/60 mb-3" />
                        <h3 className="text-[11px] font-semibold uppercase tracking-widest text-white/60 mb-2">Account Not Found</h3>
                        <p className="text-[10px] text-muted-custom font-medium leading-relaxed">
                            This username doesn't exist in our current registry. It may be a typo or the account hasn't been created yet.
                        </p>
                      </div>
                      
                      <div className="p-6 rounded-sm bg-black/40 border border-custom border-dashed flex flex-col items-center text-center">
                        <ShieldAlert size={24} className="text-muted-custom/60 mb-3" />
                        <h3 className="text-[11px] font-black uppercase tracking-widest text-white/60 mb-2">Suspended / Deleted</h3>
                        <p className="text-[10px] text-muted-custom font-medium leading-relaxed">
                            The user may have deactivated their account, or it was decommissioned for violating community protocols.
                        </p>
                      </div>
                    </>
                  )}
               </div>

               {!isPrivateLock && (
                  <div className="mt-8 pt-8 border-t border-custom flex flex-col items-center justify-center gap-4">
                     <p className="text-[10px] font-bold uppercase tracking-widest text-muted-custom">Looking for someone else?</p>
                     <div className="relative w-full max-w-sm">
                        <Search size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-custom" />
                        <input 
                          type="text" 
                          placeholder="Search the network..." 
                          className="w-full h-11 bg-white/5 border border-custom rounded-sm pl-12 pr-4 text-[11px] font-bold outline-none focus:border-primary-gold/30 transition-all text-white placeholder:text-muted-custom/50"
                        />
                     </div>
                  </div>
               )}
            </div>
          </div>
        </div>
      </main>

      {/* Ghost Right Sidebar */}
      <div className="hidden lg:block w-80 shrink-0 sticky-sidebar pt-4">
          <div className="card-surface rounded-sm p-6 border border-custom opacity-40 pointer-events-none">
              <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40 mb-6 flex items-center gap-2">
                 <History size={14} /> Network Echoes
              </h3>
              <div className="space-y-6">
                 {[1,2,3,4].map(i => (
                    <div key={i} className="flex gap-4">
                       <div className="size-10 rounded-sm bg-white/5 border border-white/5" />
                       <div className="flex-1 space-y-2 py-1">
                          <div className="h-2 w-24 bg-white/5 rounded" />
                          <div className="h-1.5 w-16 bg-white/5 rounded" />
                       </div>
                    </div>
                 ))}
              </div>
          </div>
      </div>
      
      <BottomNav />
    </div>
  );

  return (
    <div className="max-w-[1400px] mx-auto flex flex-col lg:flex-row min-h-screen lg:px-6 gap-6">
      <LeftSidebar />

      <main className="flex-1 w-full max-w-2xl mx-auto lg:mx-0 pt-0 lg:pt-4 pb-32 lg:pb-12">
        <TopBar />

        {/* Hero */}
        <div className="pt-4">
          <ProfileHero 
            user={user} 
            isSelf={isSelf} 
            onEditClick={() => setIsEditModalOpen(true)} 
          />
        </div>

        {/* Stats */}
        <ProfileStats 
          user={user} 
          onOpenSocials={(tab) => setSocialModalState({ isOpen: true, tab })} 
        />

        {/* Suggested to Follow - Collapsible */}
        {!isSelf && <SuggestedFollows />}

        {/* Tabs */}
        <ProfileTabs active={activeTab} onChange={setActiveTab} />

        {/* Tab Content */}
        {activeTab === 'posts' && <ProfilePosts posts={posts} isSelf={isSelf} />}
        {activeTab === 'marketplace' && (
          <ProfileMarketplace user={user} />
        )}
        {activeTab === 'kao' && <ProfileKao user={user} />}
        {activeTab === 'badges' && <ProfileBadges user={user} />}
      </main>

      <ProfileRightSidebar user={user} achievements={achievements} similarProfiles={similarProfiles} />
      <BottomNav />

      {/* Modals */}
      <EditProfileModal 
        isOpen={isEditModalOpen} 
        user={user} 
        onClose={() => setIsEditModalOpen(false)}
        onUpdate={(updated) => {
            setUser((prev: any) => ({ ...prev, ...updated }));
        }}
      />
      
      {user && (
        <SocialModal 
          isOpen={socialModalState.isOpen}
          onClose={() => setSocialModalState({ ...socialModalState, isOpen: false })}
          userId={user.id}
          initialTab={socialModalState.tab}
        />
      )}
    </div>
  );
}
