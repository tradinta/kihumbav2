"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import { 
  Users, Lock, Globe, Shield, MessageSquare, 
  Settings, UserPlus, LogOut, Check, AlertCircle,
  MoreVertical, Share2, Info, TrendingUp, Zap, 
  Search, Filter, LayoutGrid, Calendar, Bell,
  ShieldCheck, BarChart3, UserCheck, Ban, Trash2,
  ChevronRight, Camera, Sparkles, Plus, MapPin,
  Heart, Flame, MessageCircle, ChevronDown,
  User, UserMinus, Eye, Hash, Send, Repeat2,
  Bookmark, AlertTriangle
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { api } from "@/lib/api";
import { useSession } from "@/lib/auth-client";
import LeftSidebar from "@/components/LeftSidebar";
import TopBar from "@/components/TopBar";
import BottomNav from "@/components/BottomNav";
import AdSidebar from "@/components/AdSidebar";
import PostCard from "@/components/feed/PostCard";
import { TribeDetailSkeleton } from "@/components/tribes/TribeSkeletons";
import TribeManagement from "@/components/tribes/TribeManagement";
import StatusModal from "@/components/shared/StatusModal";
import { usePostContext } from "@/context/PostContext";

interface Tribe {
  id: string;
  internalId: string;
  name: string;
  slug: string;
  bio: string;
  category: string;
  privacy: 'PUBLIC' | 'PRIVATE' | 'SECRET';
  logo: string | null;
  cover: string | null;
  memberCount: number;
  weeklyVisits: number;
  weeklyPosts: number;
  rules: string[];
  userRole: 'ADMIN' | 'MODERATOR' | 'MEMBER' | null;
  isBanned: boolean;
  questions: { id: string; text: string }[];
  creatorId: string;
  postVisibility: 'EVERYONE' | 'MEMBERS';
  creator: {
    id: string;
    username: string;
    fullName: string;
    avatar: string | null;
  };
  createdAt: string;
}

type TribeTab = 'FEED' | 'FIRES' | 'MEMBERS' | 'CHAT' | 'EVENTS' | 'MANAGEMENT';
type SortMode = 'TOP' | 'NEW' | 'RANDOM';

export default function TribeDetailPage() {
  const { slug } = useParams();
  const router = useRouter();
  const { data: session } = useSession();
  const { setCreatePostOpen, setTribeTarget, registerPostCallback } = usePostContext();
  const [tribe, setTribe] = useState<Tribe | null>(null);
  const [posts, setPosts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isJoining, setIsJoining] = useState(false);
  const [activeTab, setActiveTab] = useState<TribeTab>('FEED');
  const [feedSort, setFeedSort] = useState<SortMode>('TOP');
  const [isJoinedDropdownOpen, setIsJoinedDropdownOpen] = useState(false);
  const [members, setMembers] = useState<any[]>([]);
  const [isMembersLoading, setIsMembersLoading] = useState(false);
  
  // Status Modal State
  const [modal, setModal] = useState<{ isOpen: boolean, title: string, message: string, type: 'error' | 'success', onAction?: () => void, actionLabel?: string }>({
    isOpen: false,
    title: '',
    message: '',
    type: 'error'
  });

  useEffect(() => {
    if (slug) fetchTribeData();
  }, [slug]);

  useEffect(() => {
    if (activeTab === 'MEMBERS' && tribe) {
      fetchMembers();
    }
  }, [activeTab, tribe]);

  useEffect(() => {
    registerPostCallback((post: any) => {
      // If the post was intended for this tribe, add it to our local list
      if (post.tribeId === tribe?.id) {
        setPosts(prev => [post, ...prev]);
      }
    });
    return () => registerPostCallback(null);
  }, [tribe?.id, registerPostCallback]);

  const fetchMembers = async () => {
    setIsMembersLoading(true);
    try {
      const data = await api.get(`/tribes/${tribe?.id}/members-roster`);
      setMembers(data);
    } catch (e) {
      console.error("Failed to fetch members:", e);
    } finally {
      setIsMembersLoading(false);
    }
  };

  const fetchTribeData = async () => {
    setIsLoading(true);
    try {
      // FIX: Correct API path (no /slug/ prefix)
      const data = await api.get(`/tribes/${slug}`);
      setTribe(data);
      
      // Record visit (silent)
      api.post(`/tribes/${data.id}/record-visit`, {}).catch(() => {});
      
      // Fetch posts for this tribe
      const postsData = await api.get(`/posts/tribe/${data.id}`);
      setPosts(postsData.posts || []);
    } catch (error) {
      console.error("Failed to fetch tribe:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleJoin = async () => {
    setIsJoining(true);
    try {
      await api.post(`/tribes/${tribe?.id}/join`, {});
      fetchTribeData();
    } catch (error: any) {
      const message = error.message || "Failed to join tribe.";
      setModal({
        isOpen: true,
        title: 'Access Restricted',
        message: message,
        type: 'error'
      });
    } finally {
      setIsJoining(false);
    }
  };

  const handleLeave = async () => {
    if (!window.confirm("Are you sure you want to leave this tribe?")) return;
    try {
      await api.post(`/tribes/${tribe?.id}/leave`, {});
      setIsJoinedDropdownOpen(false);
      fetchTribeData();
    } catch (error: any) {
      setModal({
        isOpen: true,
        title: 'Action Failed',
        message: error.message || "Failed to leave tribe.",
        type: 'error'
      });
    }
  };

  const [isInviting, setIsInviting] = useState(false);
  const [tribeInviteLink, setTribeInviteLink] = useState<string | null>(null);

  const handleInvite = async () => {
    if (tribeInviteLink) {
      setModal({
        isOpen: true,
        title: 'Community Invite',
        message: `Share this link to grow your tribe:\n\n${tribeInviteLink}`,
        type: 'success',
        onAction: () => {
          navigator.clipboard.writeText(tribeInviteLink);
        },
        actionLabel: 'Copy Link'
      });
      return;
    }

    setIsInviting(true);
    try {
      const data = await api.post(`/tribes/${tribe?.id}/invite`, {});
      const link = `${window.location.origin}/tribes/invite/${data.code}`;
      setTribeInviteLink(link);
      setModal({
        isOpen: true,
        title: 'Invite Generated',
        message: `Invite code: ${data.code}\nLink: ${link}`,
        type: 'success',
        onAction: () => {
          navigator.clipboard.writeText(link);
        },
        actionLabel: 'Copy Link'
      });
    } catch (error: any) {
      setModal({
        isOpen: true,
        title: 'Invite Failed',
        message: error.message || "Failed to generate invite.",
        type: 'error'
      });
    } finally {
      setIsInviting(false);
    }
  };

  if (isLoading) return <TribeDetailSkeleton />;
  if (!tribe) return <div className="p-20 text-center font-bold text-muted-custom uppercase tracking-[0.3em]">Tribe Not Found</div>;

  const isMember = !!tribe.userRole || (session?.user?.id === tribe.creatorId);
  const isAdmin = tribe.userRole === 'ADMIN' || (session?.user?.id === tribe.creatorId);
  const canSeeFeed = tribe.postVisibility === 'EVERYONE' || isMember;

  const tabs: { id: TribeTab, label: string, icon: any }[] = [
    { id: 'FEED', label: 'Feed', icon: MessageSquare },
    { id: 'FIRES', label: 'Fires', icon: Flame },
    { id: 'MEMBERS', label: 'Members', icon: Users },
    { id: 'EVENTS', label: 'Events', icon: Calendar },
    { id: 'CHAT', label: 'Chat', icon: MessageCircle },
  ];

  if (isAdmin) {
    tabs.push({ id: 'MANAGEMENT', label: 'Management', icon: Settings });
  }

  return (
    <div className="max-w-[1400px] mx-auto flex flex-col lg:flex-row min-h-screen lg:px-6 gap-6">
      <LeftSidebar />

      <main className="flex-1 w-full max-w-6xl mx-auto lg:mx-0 pt-0 lg:pt-4 pb-32 lg:pb-12">
        <TopBar />

        {/* --- High Fidelity Industrial Header --- */}
        <div className="relative group px-4">
          <div className="relative h-64 md:h-80 rounded-sm overflow-hidden border border-custom">
             <Image 
               src={tribe.cover || 'https://images.unsplash.com/photo-1541339907198-e08756ebafe1?auto=format&fit=crop&q=80&w=1200'} 
               alt="Cover" fill className="object-cover opacity-60 group-hover:scale-105 transition-transform duration-700" 
             />
             <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />
             {tribe.userRole === 'ADMIN' && (
               <button className="absolute top-4 right-4 size-10 rounded-sm bg-black/40 backdrop-blur-md border border-white/10 flex items-center justify-center hover:bg-black/60 transition-all text-white">
                 <Camera size={18} />
               </button>
             )}
          </div>

          <div className="relative -mt-16 px-8 flex flex-col md:flex-row items-end gap-6 justify-between">
             <div className="flex items-end gap-6">
                <div className="size-32 rounded-lg bg-card-surface border-4 border-bg-color shadow-2xl flex items-center justify-center text-6xl relative overflow-hidden">
                   {tribe.logo ? (
                      (tribe.logo.startsWith('http') || tribe.logo.startsWith('/')) ? (
                         <Image src={tribe.logo} alt="" fill className="object-cover" />
                      ) : tribe.logo
                   ) : '🌍'}
                </div>
                <div className="pb-4">
                   <div className="flex items-center gap-3">
                      <h1 className="text-3xl font-bold tracking-tight text-main">{tribe.name}</h1>
                      <div className="px-2 py-0.5 rounded-sm pill-surface border border-custom text-[8px] font-bold uppercase tracking-[0.1em] text-primary-gold">
                         {tribe.privacy}
                      </div>
                   </div>
                   <p className="text-[10px] font-bold text-muted-custom uppercase tracking-widest mt-2 flex items-center gap-2">
                      <Hash size={12} className="text-primary-gold" /> @{tribe.slug}
                      <span className="text-white/10 mx-1">|</span>
                      <Users size={12} className="text-primary-gold" /> {(tribe.memberCount || 0).toLocaleString()} Members
                   </p>
                </div>
             </div>

             <div className="pb-4 flex items-center gap-3 relative">
                <div className="relative">
                   {isMember ? (
                     <button 
                       onClick={() => setIsJoinedDropdownOpen(!isJoinedDropdownOpen)}
                       className="h-10 px-6 bg-primary-gold text-black rounded-sm font-bold text-[10px] uppercase tracking-widest flex items-center gap-2 hover:brightness-110 transition-all shadow-xl shadow-primary-gold/10"
                     >
                        <Check size={16} strokeWidth={3} /> Joined <ChevronDown size={14} className={`transition-transform ${isJoinedDropdownOpen ? 'rotate-180' : ''}`} />
                     </button>
                   ) : (
                     <button 
                       onClick={handleJoin}
                       disabled={isJoining}
                       className="h-10 px-8 bg-primary-gold text-black rounded-sm font-bold text-[10px] uppercase tracking-widest flex items-center gap-2 hover:brightness-110 transition-all shadow-xl shadow-primary-gold/10"
                     >
                        {isJoining ? 'Processing...' : 'Join Tribe'}
                     </button>
                   )}
                   
                   <AnimatePresence>
                     {isMember && isJoinedDropdownOpen && (
                       <motion.div 
                         initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }}
                         className="absolute top-full right-0 mt-2 w-48 card-surface border border-custom rounded-sm p-2 shadow-2xl z-50"
                       >
                          <button className="w-full h-11 flex items-center gap-3 px-4 rounded-sm hover:bg-white/5 text-muted-custom transition-all">
                             <Bell size={16} /> <span className="text-[10px] font-bold uppercase tracking-widest">Notifications</span>
                          </button>
                          <div className="h-px bg-white/5 my-1" />
                          <button 
                            onClick={handleLeave}
                            className="w-full h-11 flex items-center gap-3 px-4 rounded-sm hover:bg-red-500/10 text-red-500 transition-all"
                          >
                             <UserMinus size={16} /> <span className="text-[10px] font-bold uppercase tracking-widest">Leave Tribe</span>
                          </button>
                       </motion.div>
                     )}
                   </AnimatePresence>
                </div>
                <button 
                  onClick={handleInvite}
                  disabled={isInviting}
                  className="h-10 px-6 pill-surface border border-custom rounded-sm font-bold text-[10px] uppercase tracking-widest text-main hover:text-primary-gold transition-all flex items-center gap-2"
                >
                  {isInviting ? (
                    <div className="size-4 border-2 border-primary-gold/30 border-t-primary-gold rounded-full animate-spin" />
                  ) : null}
                  {isInviting ? 'Generating...' : 'Invite'}
                </button>
             </div>
          </div>
        </div>

        {/* --- Tab Navigation --- */}
        <div className="px-4 mt-8 sticky top-0 z-30 bg-bg-color/80 backdrop-blur-md py-2 -mx-4 lg:mx-0">
           <div className="relative group/tabs flex justify-start lg:justify-start">
              <div className="flex items-center gap-1 p-1 pill-surface rounded-sm border border-custom w-full lg:w-fit overflow-x-auto no-scrollbar scroll-smooth snap-x">
                 {tabs.map(tab => (
                   <button 
                     key={tab.id}
                     onClick={() => setActiveTab(tab.id)}
                     className={`h-9 px-6 rounded-sm flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest transition-all whitespace-nowrap snap-start ${
                       activeTab === tab.id ? 'bg-primary-gold text-black shadow-lg shadow-primary-gold/10' : 'text-muted-custom hover:text-main'
                     }`}
                   >
                     <tab.icon size={14} /> {tab.label}
                   </button>
                 ))}
              </div>
              
              {/* Classy Gradient Fade Indicators for Mobile Scroll */}
              <div className="absolute inset-y-0 left-0 w-8 bg-gradient-to-r from-bg-color to-transparent pointer-events-none opacity-0 lg:hidden" />
              <div className="absolute inset-y-0 right-0 w-8 bg-gradient-to-l from-bg-color to-transparent pointer-events-none opacity-100 lg:hidden" />
           </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-[1fr_380px] gap-8 mt-8 px-4">
          
          <div className="space-y-6">
            <AnimatePresence mode="wait">
              {activeTab === 'FEED' && (
                <motion.div 
                  key="feed" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
                  className="space-y-6"
                >
                  {canSeeFeed ? (
                    <>
                    {isMember && (
                        <div 
                          onClick={() => {
                            setTribeTarget({ id: tribe.id, name: tribe.name });
                            setCreatePostOpen(true);
                          }}
                          className="card-surface p-4 rounded-sm border border-custom flex items-center gap-4 cursor-pointer hover:border-primary-gold/40 transition-all group"
                        >
                           <div className="size-10 rounded-sm bg-white/5 relative overflow-hidden shrink-0 border border-custom">
                              {session?.user?.image && <Image src={session.user.image} alt="" fill className="object-cover" />}
                           </div>
                           <div className="flex-1 bg-pill-surface h-10 rounded-sm flex items-center px-4 border border-custom group-hover:bg-white/5 transition-colors">
                              <span className="text-[10px] font-black uppercase tracking-widest text-muted-custom">Curation Master: What's the vision for {tribe.name}?</span>
                           </div>
                           <div className="size-10 rounded-sm bg-primary-gold flex items-center justify-center text-black shadow-lg shadow-primary-gold/10">
                              <Plus size={20} />
                           </div>
                        </div>
                     )}
                    
                    {posts.map((post, i) => (
                      <PostCard key={post.id} post={post} index={i} />
                    ))}
                    
                    {posts.length === 0 && (
                      <div className="text-center py-20 text-muted-custom uppercase tracking-widest text-[9px] font-bold">No active discussions yet</div>
                    )}
                    </>
                  ) : (
                    <div className="card-surface p-12 rounded-sm border border-dashed border-custom text-center flex flex-col items-center gap-4">
                       <Lock size={32} className="text-muted-custom opacity-30" />
                       <h3 className="text-sm font-bold uppercase tracking-widest text-main">Private Feed</h3>
                       <p className="text-[10px] text-muted-custom font-medium uppercase tracking-widest max-w-xs">Join this tribe to view discussions and participate in the community.</p>
                       <button onClick={handleJoin} className="h-10 px-8 bg-primary-gold text-black rounded-sm font-bold text-[10px] uppercase tracking-widest mt-2">Join to unlock</button>
                    </div>
                  )}
                </motion.div>
              )}

              {activeTab === 'MEMBERS' && (
                <motion.div 
                   key="members" initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                   className="space-y-4"
                >
                   <div className="flex items-center justify-between mb-6">
                      <h3 className="text-xs font-black uppercase tracking-widest text-main">Tribe Members ({tribe.memberCount})</h3>
                      <div className="relative">
                         <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-custom" />
                         <input 
                           type="text" placeholder="Search members..." 
                           className="h-9 w-64 bg-white/5 border border-custom rounded-sm pl-10 pr-4 text-[10px] font-bold uppercase tracking-widest focus:border-primary-gold/50 outline-none transition-all"
                         />
                      </div>
                   </div>

                   {isMembersLoading ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                         {[...Array(6)].map((_, i) => (
                            <div key={i} className="h-24 card-surface rounded-sm border border-custom animate-pulse" />
                         ))}
                      </div>
                   ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                         {members.map((membership) => (
                            <div key={membership.user.id} className="card-surface p-4 rounded-sm border border-custom flex items-center gap-4 group hover:border-primary-gold/30 transition-all cursor-pointer">
                               <div className="size-12 rounded-sm bg-white/5 border border-custom relative overflow-hidden">
                                  {membership.user.avatar && <Image src={membership.user.avatar} alt="" fill className="object-cover" />}
                               </div>
                               <div className="flex-1">
                                  <div className="flex items-center gap-2">
                                     <h4 className="text-xs font-bold text-main uppercase tracking-widest">{membership.user.fullName || membership.user.username}</h4>
                                     {membership.role !== 'MEMBER' && (
                                        <span className="text-[8px] px-1.5 py-0.5 bg-primary-gold/10 text-primary-gold rounded-sm font-black uppercase tracking-tighter border border-primary-gold/20">
                                           {membership.role}
                                        </span>
                                     )}
                                  </div>
                                  <p className="text-[10px] text-muted-custom font-medium mt-1">@{membership.user.username}</p>
                               </div>
                               <ChevronRight size={16} className="text-muted-custom opacity-0 group-hover:opacity-100 transition-all" />
                            </div>
                         ))}
                      </div>
                   )}
                </motion.div>
              )}
              
              {activeTab === 'MANAGEMENT' && isAdmin && (
                <TribeManagement tribe={tribe} onUpdate={fetchTribeData} />
              )}
            </AnimatePresence>
          </div>

          {/* --- Sidebar Content --- */}
          <aside className="space-y-8 sticky-sidebar">
            
            {/* Community Standards & Info */}
            <section className="card-surface p-8 rounded-sm border border-custom">
               <div className="flex items-center gap-4 mb-8">
                  <div className="size-12 rounded-sm bg-white/5 border border-custom relative overflow-hidden shrink-0">
                     {tribe.creator?.avatar && <Image src={tribe.creator.avatar} alt="" fill className="object-cover" />}
                  </div>
                  <div>
                     <p className="text-[10px] font-black text-primary-gold uppercase tracking-[0.2em] mb-1">Founded By</p>
                     <p className="text-xs font-bold text-main uppercase tracking-widest">{tribe.creator?.fullName || tribe.creator?.username || "Original Founder"}</p>
                  </div>
               </div>

               <div className="space-y-8">
                  <div>
                     <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-main mb-4 flex items-center gap-2">
                        <Info size={14} className="text-primary-gold" /> Community Mission
                     </h3>
                     <p className="text-[11px] text-muted-custom leading-relaxed font-medium">
                        {tribe.bio || "No mission statement provided."}
                     </p>
                  </div>

                  <div className="pt-8 border-t border-custom">
                     <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-main mb-4 flex items-center gap-2">
                        <Shield size={14} className="text-primary-gold" /> Governance & Rules
                     </h3>
                     {tribe.rules && tribe.rules.length > 0 ? (
                        <ul className="space-y-4">
                           {tribe.rules.map((rule, i) => (
                              <li key={i} className="flex gap-3">
                                 <span className="text-[10px] font-black text-primary-gold opacity-40">{i + 1}</span>
                                 <p className="text-[10px] text-muted-custom font-medium leading-relaxed">{rule}</p>
                              </li>
                           ))}
                        </ul>
                     ) : (
                        <p className="text-[10px] text-muted-custom italic opacity-40">No specific rules set by the creator.</p>
                     )}
                  </div>

                  <div className="pt-8 border-t border-custom flex items-center justify-between">
                     <div className="flex items-center gap-2 text-[10px] font-bold text-muted-custom uppercase tracking-widest">
                        <Calendar size={12} className="text-primary-gold" /> Established
                     </div>
                     <div className="text-[10px] font-black text-main uppercase tracking-widest">
                        {new Date(tribe.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                     </div>
                  </div>
               </div>
            </section>

            {/* Tribe Analytics */}
            <section className="card-surface p-8 rounded-sm border border-custom">
               <h3 className="text-[10px] font-bold uppercase tracking-widest text-main mb-8 flex items-center gap-3">
                  <BarChart3 size={16} className="text-primary-gold" /> Tribe Analytics
               </h3>
               <div className="space-y-6">
                  <div className="flex items-center justify-between">
                     <div className="flex items-center gap-3">
                        <div className="size-8 rounded-sm bg-white/5 border border-custom flex items-center justify-center text-primary-gold">
                           <Eye size={14} />
                        </div>
                        <span className="text-[10px] font-bold uppercase tracking-widest text-muted-custom">Weekly Visits</span>
                     </div>
                     <span className="text-[11px] font-black text-main tracking-widest">{(tribe.weeklyVisits || 0).toLocaleString()}</span>
                  </div>
                  <div className="flex items-center justify-between">
                     <div className="flex items-center gap-3">
                        <div className="size-8 rounded-sm bg-white/5 border border-custom flex items-center justify-center text-primary-gold">
                           <MessageSquare size={14} />
                        </div>
                        <span className="text-[10px] font-bold uppercase tracking-widest text-muted-custom">Weekly Posts</span>
                     </div>
                     <span className="text-[11px] font-black text-main tracking-widest">{(tribe.weeklyPosts || 0).toLocaleString()}</span>
                  </div>
               </div>
            </section>

            <AdSidebar type="GENERAL" />
          </aside>
        </div>
      </main>
      <BottomNav />

      <StatusModal 
        isOpen={modal.isOpen}
        onClose={() => setModal(p => ({ ...p, isOpen: false }))}
        title={modal.title}
        message={modal.message}
        type={modal.type}
      />
    </div>
  );
}


