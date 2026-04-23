"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { MoreHorizontal, ShieldCheck, Repeat2, Pin, Trash2, AlertCircle, UserPlus, UserMinus, VolumeX, UserX, Volume2, ExternalLink, MapPin, Camera, FileText, Sparkles, BarChart, ExternalLink as ExtIcon, Eye, Download, Edit2, ShieldAlert, X, Heart } from "lucide-react";
import ImpressionsBar from "./ImpressionsBar";
import InteractionBar from "./InteractionBar";
import { timeAgo, renderContent } from "@/lib/utils";
import UserIdentity from "../shared/UserIdentity";
import { useAuth } from "@/context/AuthContext";
import { useSnackbar } from "@/context/SnackbarContext";
import { api } from "@/lib/api";
import { motion, AnimatePresence } from "framer-motion";
import MuxPlayer from "../shared/MuxPlayer";
import Portal from "../shared/Portal";
import FilePreviewModal from "../shared/FilePreviewModal";

// Local Badge component matching Marketplace style
const Badge = ({ children, gold, className }: { children: React.ReactNode; gold?: boolean; className?: string }) => (
  <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[8px] font-bold uppercase tracking-widest border ${
    gold ? 'bg-primary-gold/10 text-primary-gold border-primary-gold/30' : 'pill-surface text-muted-custom border-custom'
  } ${className ?? ''}`}>{children}</span>
);

export interface PostData {
  id: string;
  content: string;
  contentType: 'TEXT' | 'PHOTO' | 'VIDEO' | 'RESHARE' | 'QUOTE';
  media?: { type: 'image' | 'video'; src: string; alt?: string }[];
  author: {
    id: string;
    username: string;
    fullName?: string;
    avatar?: string;
    isVerified?: boolean;
    isFollowing: boolean;
    isMuted: boolean;
    isBlocked: boolean;
    subscriptionTier?: string;
    accountType?: string;
    isPremium?: boolean;
  };
  tribe?: { id: string; name: string; slug: string };
  originalPost?: PostData;
  marketListing?: any; 
  kaoListing?: any;
  _count: { comments: number; interactions: number; reshares: number };
  userInteraction?: {
    hasUpvoted: boolean;
    hasDownvoted: boolean;
    hasBookmarked: boolean;
    hasReshared: boolean;
  };
  isPinned?: boolean;
  viewCount: number;
  createdAt: string;
  likesCount: number;
  repliesCount: number;
  repostsCount: number;
  impressions: number;
  videoId?: string;
  video?: {
      id: string;
      title: string;
      isSpark: boolean;
      playbackId: string;
      duration: number;
      thumbnailUrl?: string;
  };

  poll?: {
      id: string;
      question: string;
      isQuiz: boolean;
      allowMultiple: boolean;
      endsAt?: string;
      options: { id: string; text: string; isCorrect: boolean; _count: { votes: number } }[];
      _count: { votes: number };
  };
}

interface PostCardProps {
  post: PostData;
  index?: number;
  isEmbedded?: boolean;
  layout?: 'default' | 'cinematic';
}

function profileHref(handle: string) {
  return `/profile/${handle}`;
}

export default function PostCard({ post, index = 0, isEmbedded = false, layout = 'default' }: PostCardProps) {
  const { user: currentUser } = useAuth();
  const [isExpanded, setIsExpanded] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [menuView, setMenuView] = useState<'actions' | 'analytics' | 'delete'>('actions');
  const [isPinned, setIsPinned] = useState(post.isPinned);
  const [isInfoModalOpen, setIsInfoModalOpen] = useState(false);
  const [viewingDoc, setViewingDoc] = useState<any>(null);
  const [socialState, setSocialState] = useState({
      isFollowing: post.author.isFollowing,
      isMuted: post.author.isMuted,
      isBlocked: post.author.isBlocked
  });

  const { show } = useSnackbar();
  const isReshare = post.contentType === 'RESHARE';
  const isQuote = post.contentType === 'QUOTE';
  const isAuthor = currentUser?.username === post.author.username || currentUser?.id === (post as any).authorId;
  const displayPost = isReshare && post.originalPost ? post.originalPost : post;

  const [localPoll, setLocalPoll] = useState(displayPost.poll);
  const [expandedDoc, setExpandedDoc] = useState<string | null>(null);

  // Sync local poll state when displayPost prop changes
  useEffect(() => {
    setLocalPoll(displayPost.poll);
  }, [displayPost.poll]);
  
  // 💡 NORMALIZE MEDIA: Prisma JSON might return an object or array. We need an array for .some/.filter
  const rawMedia = displayPost.media;
  const mediaArray: any[] = Array.isArray(rawMedia) ? rawMedia : (rawMedia ? [rawMedia] : []);
  
  const content = displayPost.content || "";
  const shouldTruncate = content.length > 280 && !isExpanded;
  const displayContent = shouldTruncate ? content.slice(0, 280) + "..." : content;



  const handleSocialAction = async (action: 'follow' | 'mute' | 'block') => {
      const authorId = displayPost.author.id;
      if (!authorId) return;

      try {
          if (action === 'follow') {
              const method = socialState.isFollowing ? 'unfollow' : 'follow';
              await api.post(`/users/${authorId}/${method}`);
              setSocialState(prev => ({ ...prev, isFollowing: !prev.isFollowing }));
          } else if (action === 'mute') {
              if (socialState.isMuted) {
                  await api.delete(`/users/${authorId}/mute`);
              } else {
                  await api.post(`/users/${authorId}/mute`);
              }
              setSocialState(prev => ({ ...prev, isMuted: !prev.isMuted }));
          } else if (action === 'block') {
              if (socialState.isBlocked) {
                  await api.delete(`/users/${authorId}/block`);
              } else {
                  await api.post(`/users/${authorId}/block`);
              }
              setSocialState(prev => ({ ...prev, isBlocked: !prev.isBlocked }));
          }
          setIsMenuOpen(false);
      } catch (err: any) {
      }
  };

  const handleTogglePin = async () => {
    try {
      if (isPinned) {
        await api.delete(`/posts/${post.id}/pin`);
      } else {
        await api.post(`/posts/${post.id}/pin`);
      }
      setIsPinned(!isPinned);
      setIsMenuOpen(false);
    } catch (err) {
      console.error('Failed to toggle pin', err);
    }
  };

  const handleDeletePost = async () => {
    try {
      await api.delete(`/posts/${post.id}`);
      setIsMenuOpen(false);
      window.location.reload(); 
    } catch (err) {
      console.error('Failed to delete post', err);
    }
  };

  const detailHref = displayPost.contentType === 'VIDEO' || !!displayPost.videoId ? `/videos/${displayPost.id}` : `/post/${displayPost.id}`;

  return (
    <article
      className={`card-surface shadow-sm relative ${isMenuOpen ? 'overflow-visible z-[60]' : 'overflow-hidden z-10'} ${!isEmbedded ? 'rounded-2xl animate-fade-in-up' : 'rounded-xl border-primary-gold/10 bg-black/10 transition-all hover:border-primary-gold/30 hover:bg-black/20'}`}
      style={!isEmbedded ? { animationDelay: `${index * 50}ms` } : undefined}
    >
      {isEmbedded && (
        <Link href={detailHref} className="absolute inset-0 z-10" aria-label="View original content" />
      )}
      {/* Pin Badge */}
      {isPinned && !isEmbedded && (
          <div className="absolute top-3 right-10 z-10 flex items-center gap-1 px-1.5 py-0.5 rounded bg-primary-gold/10 border border-primary-gold/20">
              <Pin size={8} className="text-primary-gold" />
              <span className="text-[7px] font-bold uppercase tracking-widest text-primary-gold">Pinned</span>
          </div>
      )}
      
      {/* Normalized Author for consistent tier detection */}
      {(() => {
        const normalizedAuthor = isAuthor ? { ...displayPost.author, ...currentUser } : displayPost.author;
        const reshareAuthor = post.author.username === currentUser?.username ? { ...post.author, ...currentUser } : post.author;
        
        return (
          <>
            {/* Reshare Header */}
            {isReshare && !isEmbedded && (
              <div className="px-4 pt-3 pb-1 flex items-center gap-2 text-muted-custom">
                <Repeat2 size={12} className="shrink-0" />
                <UserIdentity 
                  user={reshareAuthor} 
                  size="xs" 
                  hideHandle 
                  className="flex-1 opacity-80" 
                />
                <span className="text-[10px] font-bold uppercase tracking-widest opacity-40 shrink-0">reshared</span>
              </div>
            )}

            {/* Tribe Header */}
            {post.tribe && !isEmbedded && (
              <div className="px-4 pt-3 pb-0 flex items-center gap-2">
                <Link 
                  href={`/tribes/${post.tribe.slug}`}
                  className="text-[10px] font-black uppercase tracking-widest text-primary-gold bg-primary-gold/10 px-2 py-0.5 rounded border border-primary-gold/20 hover:bg-primary-gold/20 transition-colors"
                >
                  {post.tribe.name}
                </Link>
              </div>
            )}

            {/* Author Info */}
            <div className="px-4 py-3 flex items-center justify-between gap-3">
              <UserIdentity user={normalizedAuthor} size="md" className="flex-1" />
              
              <div className="flex items-center gap-2 relative z-20">
                <Link href={detailHref} className="text-[11px] text-muted-custom shrink-0 hover:text-primary-gold transition-colors">
                  · {timeAgo(displayPost.createdAt)}
                </Link>
                {!isEmbedded && (
                  <div className="relative">
                    <button 
                      onClick={() => setIsMenuOpen(!isMenuOpen)}
                      aria-label="More options" 
                      className={`transition-all flex gap-[3px] p-2 -m-2 group ${isMenuOpen ? 'scale-110' : 'hover:scale-110'}`}
                    >
                      {[1, 2, 3].map((i) => (
                        <div 
                          key={i} 
                          className={`size-[4px] rounded-full shadow-[0_1px_2px_rgba(0,0,0,0.5)] transition-all ${
                            isMenuOpen 
                              ? 'bg-primary-gold shadow-[0_0_8px_rgba(197,160,89,0.4)]' 
                              : 'bg-primary-gold/40 group-hover:bg-primary-gold bg-gradient-to-br from-white/20 to-transparent'
                          }`} 
                        />
                      ))}
                    </button>

                    <AnimatePresence>
                      {isMenuOpen && (
                        <Portal>
                          <div className="fixed inset-0 z-[500] flex items-center justify-center p-4">
                            <motion.div 
                              initial={{ opacity: 0 }} 
                              animate={{ opacity: 1 }} 
                              exit={{ opacity: 0 }}
                              className="absolute inset-0 bg-black/80 backdrop-blur-md"
                              onClick={() => { setIsMenuOpen(false); setMenuView('actions'); }}
                            />
                            <motion.div 
                              initial={{ opacity: 0, scale: 0.95, y: 20 }}
                              animate={{ opacity: 1, scale: 1, y: 0 }}
                              exit={{ opacity: 0, scale: 0.95, y: 20 }}
                              className="relative w-full max-w-2xl bg-main border border-white/10 rounded-2xl shadow-[0_40px_100px_rgba(0,0,0,1)] z-[501] overflow-hidden flex flex-col md:flex-row h-[600px] md:h-auto max-h-[90vh]"
                            >
                              {/* Left Side: Post Preview */}
                              <div className="md:w-5/12 border-r border-white/5 bg-white/[0.02] flex flex-col">
                                 <div className="p-4 border-b border-white/5">
                                    <p className="text-[9px] font-bold uppercase tracking-widest text-primary-gold">Live Preview</p>
                                 </div>
                                 <div className="flex-1 overflow-y-auto p-6 custom-scrollbar">
                                    <div className="opacity-80 scale-[0.9] origin-top pointer-events-none">
                                       <div className="flex items-center gap-3 mb-4">
                                          <UserIdentity 
                                            user={normalizedAuthor} 
                                            size="sm" 
                                            isLink={false}
                                          />
                                       </div>
                                       <p className="text-[13px] text-main mb-4 leading-relaxed line-clamp-6">{displayPost.content}</p>
                                       {mediaArray?.[0] && (
                                          <div className="aspect-video bg-white/5 rounded-xl border border-white/5 overflow-hidden">
                                             {mediaArray[0].type === 'image' && <img src={mediaArray[0].src} className="size-full object-cover" alt="" />}
                                             {mediaArray[0].type === 'video' && <div className="size-full flex items-center justify-center bg-black/40"><Eye size={24} className="text-white/20" /></div>}
                                          </div>
                                       )}
                                    </div>
                                 </div>
                                 <div className="p-4 bg-white/[0.03] border-t border-white/5">
                                    <div className="flex items-center justify-between text-[9px] font-bold uppercase tracking-widest text-muted-custom">
                                       <span>Deployed</span>
                                       <span>{timeAgo(displayPost.createdAt)}</span>
                                    </div>
                                 </div>
                              </div>

                              {/* Right Side: Actions/Analytics/Delete */}
                              <div className="flex-1 flex flex-col">
                                {/* Modal Header */}
                                <div className="p-4 border-b border-white/5 flex items-center justify-between bg-white/[0.01]">
                                  <h2 className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary-gold">
                                    {menuView === 'actions' ? 'Post Management' : 
                                     menuView === 'analytics' ? 'Performance Insights' : 
                                     'Security Clearance'}
                                  </h2>
                                  <button onClick={() => { setIsMenuOpen(false); setMenuView('actions'); }} className="p-2 hover:bg-white/5 rounded-lg transition-colors text-muted-custom">
                                    <X size={16} />
                                  </button>
                                </div>

                                {/* Modal Body */}
                                <div className="flex-1 overflow-y-auto p-2 custom-scrollbar">
                                  {menuView === 'actions' && (
                                     <div className="space-y-1">
                                       {[
                                         { icon: Pin, label: isPinned ? 'Unpin from Profile' : 'Pin to Profile', active: isPinned, onClick: handleTogglePin },
                                         { icon: Edit2, label: 'Edit Post Content', onClick: () => { /* edit logic */ } },
                                         { icon: BarChart, label: 'Post Performance Analytics', onClick: () => setMenuView('analytics') },
                                         { icon: UserX, label: 'Anonymize Tribe Post', show: !!post.tribe, onClick: () => { /* anonymize logic */ } },
                                       ].filter(item => item.show !== false).map((item, i) => (
                                         <button 
                                           key={i}
                                           onClick={item.onClick}
                                           className="w-full flex items-center gap-4 px-4 py-4 rounded-xl hover:bg-white/5 transition-all group text-left"
                                         >
                                           <div className={`size-10 rounded-xl flex items-center justify-center border border-white/5 transition-all ${item.active ? 'bg-primary-gold/10 text-primary-gold border-primary-gold/20' : 'bg-white/5 text-muted-custom group-hover:text-main'}`}>
                                             <item.icon size={18} strokeWidth={1.5} />
                                           </div>
                                           <span className="text-xs font-semibold text-main opacity-80 group-hover:opacity-100 transition-opacity uppercase tracking-wider">{item.label}</span>
                                         </button>
                                       ))}

                                       <div className="h-px bg-white/5 my-2 mx-2" />

                                       <button 
                                         onClick={() => setMenuView('delete')}
                                         className="w-full flex items-center gap-4 px-4 py-4 rounded-xl hover:bg-red-500/5 transition-all group text-left"
                                       >
                                         <div className="size-10 rounded-xl bg-red-500/5 text-red-500/70 flex items-center justify-center border border-red-500/10 group-hover:bg-red-500/10 group-hover:text-red-500 transition-all">
                                           <Trash2 size={18} strokeWidth={1.5} />
                                         </div>
                                         <span className="text-xs font-semibold text-red-500/70 group-hover:text-red-500 transition-opacity uppercase tracking-wider">Delete Permanently</span>
                                       </button>
                                     </div>
                                  )}

                                  {menuView === 'analytics' && (
                                     <div className="p-4 space-y-6">
                                        <div className="grid grid-cols-2 gap-4">
                                           {[
                                              { label: 'Impressions', value: displayPost.impressions || 0, icon: Eye, color: 'text-blue-500' },
                                              { label: 'Interactions', value: (displayPost.likesCount + displayPost.repliesCount + displayPost.repostsCount) || 0, icon: Heart, color: 'text-red-500' },
                                              { label: 'Profile Visits', value: Math.floor((displayPost.impressions || 0) * 0.05), icon: UserPlus, color: 'text-primary-gold' },
                                              { label: 'Viral Reach', value: (displayPost.repostsCount * 12) || 0, icon: Repeat2, color: 'text-green-500' },
                                           ].map((stat, i) => (
                                              <div key={i} className="bg-white/5 border border-white/5 p-4 rounded-2xl">
                                                 <div className="flex items-center justify-between mb-2">
                                                    <stat.icon size={14} className={stat.color} />
                                                    <span className="text-[9px] font-bold text-muted-custom uppercase tracking-widest">{stat.label}</span>
                                                 </div>
                                                 <p className="text-xl font-bold text-main">{stat.value.toLocaleString()}</p>
                                              </div>
                                           ))}
                                        </div>
                                        
                                        <div className="bg-primary-gold/5 border border-primary-gold/10 p-4 rounded-2xl">
                                           <p className="text-[9px] font-bold text-primary-gold uppercase tracking-widest mb-3">Engagement Breakdown</p>
                                           <div className="space-y-3">
                                              {[
                                                 { label: 'Likes', count: displayPost.likesCount, color: 'bg-red-500' },
                                                 { label: 'Replies', count: displayPost.repliesCount, color: 'bg-blue-500' },
                                                 { label: 'Reposts', count: displayPost.repostsCount, color: 'bg-green-500' },
                                              ].map((item, i) => (
                                                 <div key={i} className="flex items-center gap-3">
                                                    <div className="flex-1 h-1 bg-white/10 rounded-full overflow-hidden">
                                                       <div className={`h-full ${item.color}`} style={{ width: `${Math.min(100, (item.count / (displayPost.impressions || 1)) * 1000)}%` }} />
                                                    </div>
                                                    <span className="text-[10px] font-bold text-main w-12">{item.count}</span>
                                                 </div>
                                              ))}
                                           </div>
                                        </div>

                                        <button 
                                          onClick={() => setMenuView('actions')}
                                          className="w-full py-4 rounded-xl border border-white/10 text-[9px] font-bold uppercase tracking-widest hover:bg-white/5 transition-all"
                                        >
                                          Back to Management
                                        </button>
                                     </div>
                                  )}

                                  {menuView === 'delete' && (
                                     <div className="p-6 flex flex-col items-center justify-center h-full text-center">
                                        <div className="size-20 rounded-3xl bg-red-500/10 flex items-center justify-center text-red-500 mb-6 border border-red-500/20 shadow-[0_0_50px_rgba(239,68,68,0.1)]">
                                           <Trash2 size={40} strokeWidth={1.5} />
                                        </div>
                                        <h3 className="text-lg font-bold text-main mb-2">Permanent Deletion</h3>
                                        <p className="text-xs text-muted-custom mb-8 leading-relaxed max-w-[250px]">
                                           This action is irreversible. All interactions, media, and analytics associated with this node will be purged.
                                        </p>
                                        <div className="w-full space-y-3">
                                           <button 
                                             onClick={handleDeletePost}
                                             className="w-full py-4 rounded-xl bg-red-500 text-white text-[10px] font-bold uppercase tracking-widest hover:brightness-110 active:scale-95 transition-all shadow-lg shadow-red-500/20"
                                           >
                                             Confirm Deletion
                                           </button>
                                           <button 
                                             onClick={() => setMenuView('actions')}
                                             className="w-full py-4 rounded-xl border border-white/10 text-[10px] font-bold uppercase tracking-widest hover:bg-white/5 transition-all"
                                           >
                                             Abort Mission
                                           </button>
                                        </div>
                                     </div>
                                  )}
                                </div>

                                {/* Modal Footer */}
                                {menuView === 'actions' && (
                                   <div className="p-4 border-t border-white/5 bg-white/[0.01]">
                                     <button 
                                       onClick={() => setIsMenuOpen(false)}
                                       className="w-full py-4 rounded-xl border border-white/10 text-[10px] font-bold uppercase tracking-widest hover:bg-white/5 transition-all active:scale-95"
                                     >
                                       Dismiss
                                     </button>
                                   </div>
                                )}
                              </div>
                            </motion.div>
                          </div>
                        </Portal>
                      )}
                    </AnimatePresence>
                  </div>
                )}
              </div>
            </div>
          </>
        );
      })()}
      
      {/* Body Content (Link to detail page if not embedded) */}
      <div className="group/post-content">
        {content && (() => {
          const contentHref = displayPost.contentType === 'VIDEO' || !!displayPost.videoId ? `/videos/${displayPost.id}` : `/post/${displayPost.id}`;
          const Wrapper = (isEmbedded ? 'div' : Link) as any;
          
          return (
            <Wrapper 
              {...(!isEmbedded ? { href: contentHref } : {})}
              className="block px-4 pb-1 cursor-pointer relative z-20"
            >
              <div className={`text-sm text-main leading-relaxed font-normal ${!isExpanded && content.length > 280 ? "line-clamp-4" : ""}`}>
                {renderContent(displayContent)}
                {content.length > 280 && (
                  <button 
                    onClick={(e) => { e.preventDefault(); e.stopPropagation(); setIsExpanded(!isExpanded); }}
                    className="mt-2 text-[11px] font-semibold text-primary-gold uppercase tracking-widest hover:brightness-125 transition-all"
                  >
                    {isExpanded ? "Read less ←" : "Read more →"}
                  </button>
                )}
              </div>
            </Wrapper>
          );
        })()}

        {/* Quote Component (Embedded Card) */}
        {isQuote && post.originalPost && (
          <div className="px-4 pb-4">
            <PostCard post={post.originalPost} isEmbedded={true} />
          </div>
        )}

        {/* Embedded Marketplace Item */}
        {displayPost.marketListing && (
          <div className="px-4 pb-4 relative z-20">
            <div 
              className="relative rounded-2xl border border-primary-gold/20 bg-white/[0.03] backdrop-blur-md overflow-hidden group/market p-4 shadow-2xl transition-all hover:border-primary-gold/40"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex gap-4">
                <div className="relative size-20 rounded-xl overflow-hidden shrink-0 border border-white/10 shadow-lg">
                   <img 
                     src={displayPost.marketListing.images?.[0] || "https://images.unsplash.com/photo-1592750475338-74b7b21085ab"} 
                     alt={displayPost.marketListing.title}
                     className="w-full h-full object-cover group-hover/market:scale-110 transition-transform duration-700"
                   />
                </div>
                
                <div className="flex-1 min-w-0 flex flex-col justify-between py-0.5">
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <Badge gold className="text-[7px]">Marketplace Item</Badge>
                      <span className="text-xs font-black text-primary-gold gold-glow">
                        {displayPost.marketListing.price ? `KES ${displayPost.marketListing.price.toLocaleString()}` : 'Price TBD'}
                      </span>
                    </div>
                    <h4 className="text-[13px] font-black uppercase tracking-wider text-main truncate group-hover/market:text-primary-gold transition-colors">
                      {displayPost.marketListing.title}
                    </h4>
                    <div className="flex items-center gap-2 mt-1.5 opacity-80">
                      <div className="size-4 rounded-full bg-zinc-800 border border-white/10 overflow-hidden">
                         <img src={displayPost.marketListing.seller?.avatar || "/default-avatar.png"} alt="" className="w-full h-full object-cover" />
                      </div>
                      <span className="text-[9px] font-bold tracking-widest uppercase text-muted-custom">Listed by @{displayPost.marketListing.seller?.username}</span>
                    </div>
                  </div>

                  <Link 
                    href={`/marketplace/${displayPost.marketListing.id}`}
                    className="mt-3 h-8 px-4 rounded-lg bg-primary-gold text-black text-[9px] font-black uppercase tracking-[0.2em] flex items-center justify-center gap-2 hover:brightness-110 transition-all active:scale-95 w-fit shadow-lg shadow-primary-gold/10"
                  >
                    View Item <ExternalLink size={10} />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Embedded KAO Listing */}
        {(displayPost.kaoListing || (post.contentType === 'QUOTE' && (post as any).kaoListing)) && (
          <div className="px-4 pb-4 relative z-20">
            {(() => {
              const item = displayPost.kaoListing || (post as any).kaoListing;
              if (!item) return null;
              
              return (
                <div 
                  className="relative rounded-2xl border border-primary-gold/20 bg-white/[0.03] backdrop-blur-md overflow-hidden group/kao p-4 shadow-2xl transition-all hover:border-primary-gold/40"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="flex gap-4">
                    <div className="relative size-20 rounded-xl overflow-hidden shrink-0 border border-white/10 shadow-lg bg-zinc-900">
                       {(() => {
                         const imgSrc = item.images?.[0] || item.image;
                         if (imgSrc && imgSrc.length > 0) {
                           return (
                             <img 
                               src={imgSrc} 
                               alt={item.title}
                               className="w-full h-full object-cover group-hover/kao:scale-110 transition-transform duration-700"
                             />
                           );
                         }
                         return (
                           <div className="w-full h-full flex flex-col items-center justify-center text-zinc-700 gap-1 bg-zinc-900">
                              <Camera size={20} strokeWidth={1} />
                              <span className="text-[6px] font-black uppercase tracking-wider">No Photo</span>
                           </div>
                         );
                       })()}
                    </div>
                    
                    <div className="flex-1 min-w-0 flex flex-col justify-between py-0.5">
                      <div>
                        <div className="flex items-center justify-between gap-2 mb-1">
                          <Badge gold className="text-[7px]">Real Estate (KAO)</Badge>
                          <span className="text-xs font-black text-primary-gold gold-glow">
                            {item.price ? `KES ${item.price.toLocaleString()}` : 'Price TBD'}
                          </span>
                        </div>
                        <h4 className="text-[13px] font-black uppercase tracking-wider text-main truncate group-hover/kao:text-primary-gold transition-colors">
                          {item.title}
                        </h4>
                        <div className="flex items-center gap-2 mt-1.5 opacity-80">
                          <MapPin size={10} className="text-primary-gold" />
                          <span className="text-[9px] font-bold tracking-widest uppercase text-muted-custom">{item.area}, {item.county}</span>
                        </div>
                      </div>

                      <Link 
                        href={`/kao/${item.id}`}
                        className="mt-3 h-8 px-4 rounded-lg bg-primary-gold text-black text-[9px] font-black uppercase tracking-[0.2em] flex items-center justify-center gap-2 hover:brightness-110 transition-all active:scale-95 w-fit shadow-lg shadow-primary-gold/10"
                      >
                        View Property <ExternalLink size={10} />
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })()}
          </div>
        )}
        
        {/* Video Content */}
        {(displayPost.video || (displayPost.contentType === 'VIDEO' && mediaArray?.[0]?.type === 'video')) && (
          <div className={`${isEmbedded ? 'px-0 pb-0' : 'px-4 pb-4'} space-y-3 relative z-20`}>
            {(displayPost.video?.title || (mediaArray?.[0] as any)?.title) && !isEmbedded && (
              <div className="flex items-center gap-2">
                 <h3 className="text-sm font-bold text-main leading-tight">{displayPost.video?.title || (mediaArray?.[0] as any)?.title}</h3>
                 {displayPost.video?.isSpark && <Badge gold>Spark</Badge>}
              </div>
            )}
            <div 
              className={`${isEmbedded ? 'aspect-[16/10] rounded-lg' : 'aspect-video rounded-xl'} bg-black overflow-hidden shadow-lg group-hover/post-content:shadow-primary-gold/5 transition-all`}
              onClick={(e) => e.stopPropagation()}
            >
               <MuxPlayer 
                 playbackId={displayPost.video?.playbackId || (mediaArray?.[0] as any)?.playbackId}
                 videoUrl={(displayPost.video as any)?.videoUrl || (mediaArray?.[0] as any)?.src || (mediaArray?.[0] as any)?.url}
                 title={displayPost.video?.title || (mediaArray?.[0] as any)?.title}
                 poster={displayPost.video?.thumbnailUrl || (mediaArray?.[0] as any)?.thumbnailUrl}
                 className="w-full h-full object-cover"
               />
            </div>
          </div>
        )}



        {/* Poll Rendering */}
        {localPoll && (() => {
          const isEnded = localPoll.endsAt && new Date(localPoll.endsAt) < new Date();
          const hasVoted = (localPoll as any).userHasVoted;
          const totalVotes = localPoll._count?.votes || 0;
          
          return (
            <div className="px-4 pb-4 relative z-20">
               <div className="p-5 rounded-lg border border-white/5 bg-white/[0.02] shadow-inner dark:bg-white/[0.02] bg-black/[0.02]">
                  <Link href={detailHref} className="block group/poll-head mb-4">
                    <h4 className="text-sm font-bold text-main leading-tight group-hover/poll-head:text-primary-gold transition-colors flex items-center justify-between gap-2">
                      <span>{localPoll.question}</span>
                      <div className="flex gap-1.5 shrink-0">
                        {localPoll.isQuiz && <span className="text-[8px] px-1.5 py-0.5 rounded-sm bg-blue-500/10 text-blue-400 border border-blue-500/20 uppercase tracking-widest">Quiz</span>}
                        {isEnded && <span className="text-[8px] px-1.5 py-0.5 rounded-sm bg-zinc-500/10 text-zinc-400 border border-white/10 uppercase tracking-widest">Final Results</span>}
                        {hasVoted && !isEnded && <span className="text-[8px] px-1.5 py-0.5 rounded-sm bg-primary-gold/10 text-primary-gold border border-primary-gold/20 uppercase tracking-widest">Voted</span>}
                      </div>
                    </h4>
                  </Link>
                  <div className="space-y-2">
                    {localPoll.options.map((opt: any) => {
                      const percentage = totalVotes > 0 ? Math.round(((opt._count?.votes || 0) / totalVotes) * 100) : 0;
                      
                      return (
                        <button 
                          key={opt.id}
                          disabled={isEnded || hasVoted}
                          onClick={async (e) => {
                            e.stopPropagation();
                            if (isEnded || hasVoted) return;

                            // 🚀 Optimistic Update
                            const previousPoll = { ...localPoll };
                            const newOptions = localPoll.options.map((o: any) => {
                               if (o.id === opt.id) {
                                 return { ...o, _count: { ...o._count, votes: (o._count?.votes || 0) + 1 } };
                               }
                               return o;
                            });
                            
                            setLocalPoll({
                               ...localPoll,
                               userHasVoted: true, // Mark as voted immediately
                               options: newOptions,
                               _count: { ...localPoll._count, votes: (localPoll._count?.votes || 0) + 1 }
                            } as any);

                            try {
                              await api.post(`/posts/poll/${localPoll.id}/vote`, { optionId: opt.id });
                              show({ type: 'success', message: 'Your vote has been cast!', duration: 2000 });
                            } catch (err: any) {
                              setLocalPoll(previousPoll); // Revert
                              const errorMsg = err.response?.data?.message || err.message || "Unknown error";
                              show({ 
                                type: 'error', 
                                message: `VOTE FAILED: ${errorMsg}`, 
                                duration: 5000 
                              });
                            }
                          }}
                          className={`group/opt relative w-full h-12 rounded-md border overflow-hidden transition-all ${
                            (isEnded || hasVoted) 
                              ? 'border-white/5 bg-white/[0.01] cursor-default' 
                              : 'border-white/10 bg-white/[0.04] hover:border-primary-gold/20 active:scale-[0.99]'
                          }`}
                        >
                          <motion.div 
                            initial={false}
                            animate={{ width: `${percentage}%` }}
                            transition={{ type: "spring", stiffness: 300, damping: 30 }}
                            className={`absolute inset-y-0 left-0 border-r ${isEnded ? 'bg-white/5 border-white/10' : 'bg-primary-gold/10 border-primary-gold/20'}`}
                          />
                          <div className="absolute inset-0 flex items-center justify-between px-4">
                            <span className="text-xs font-bold text-main opacity-80 group-hover/opt:opacity-100 transition-opacity">{opt.text}</span>
                            <span className="text-[10px] font-black text-main opacity-40">{percentage}%</span>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                  <div className="mt-4 flex items-center justify-between">
                     <div className="flex items-center gap-3">
                        <p className="text-[9px] font-black text-main opacity-30 uppercase tracking-[0.2em]">{totalVotes} Participants</p>
                        {!isEmbedded && (
                           <Link href={detailHref} className="text-[9px] font-black text-primary-gold uppercase tracking-[0.2em] hover:underline">
                              View Discussion
                           </Link>
                        )}
                     </div>
                     {localPoll.endsAt && (
                       <p className="text-[9px] font-black text-main opacity-30 uppercase tracking-[0.2em]">
                         {isEnded ? `Ended ${timeAgo(localPoll.endsAt)}` : `Ends ${timeAgo(localPoll.endsAt)}`}
                       </p>
                     )}
                  </div>
               </div>
            </div>
          );
        })()}

        {/* Documents Rendering */}
        {mediaArray?.some(m => m.type === 'document') && (
          <div className="px-4 pb-4 relative z-20 space-y-3">
             <div className="p-4 rounded-2xl bg-amber-500/5 border border-amber-500/10 flex items-center justify-between shadow-sm">
                <div className="flex items-center gap-3">
                  <ShieldAlert size={16} className="text-amber-500" />
                  <p className="text-[11px] font-medium text-amber-500/90 font-inter">
                    Heads up! Make sure you trust <span className="font-bold underline">@{displayPost.author.username}</span> before opening this file safety first.
                  </p>
                </div>
                <button 
                  onClick={(e) => { e.stopPropagation(); setIsInfoModalOpen(true); }}
                  className="size-6 rounded-full bg-amber-500/10 flex items-center justify-center text-amber-500 hover:bg-amber-500/20 transition-all shrink-0"
                >
                  <AlertCircle size={12} />
                </button>
             </div>

             <div className="space-y-2">
               {mediaArray.filter(m => m.type === 'document').map((doc, idx) => {
                 const isPdf = doc.src.toLowerCase().endsWith('.pdf');
                 const isPreviewable = isPdf || doc.src.match(/\.(docx|xlsx|pptx|txt)$/i);
                 
                 return (
                   <div 
                     key={idx}
                     onClick={(e) => {
                       e.stopPropagation();
                       if (isPreviewable) setViewingDoc(doc);
                     }}
                     className="flex items-center gap-4 p-3 rounded-2xl bg-white/5 border border-white/5 hover:bg-white/10 hover:border-primary-gold/20 transition-all group/doc cursor-pointer"
                   >
                     <div className="size-10 rounded-xl bg-white/5 flex items-center justify-center text-primary-gold group-hover/doc:bg-primary-gold/10 transition-all border border-white/5">
                        <FileText size={20} strokeWidth={1.5} />
                     </div>
                     <div className="flex-1 min-w-0">
                        <p className="text-[11px] font-bold text-main truncate font-inter uppercase tracking-wider">{doc.name}</p>
                        <p className="text-[9px] font-medium text-muted-custom uppercase tracking-widest font-inter mt-0.5">
                           {(doc.size / 1024 / 1024).toFixed(2)} MB · {isPreviewable ? 'Instant Preview' : 'Direct Download'}
                        </p>
                     </div>
                     <div className="flex gap-2">
                       {isPreviewable && (
                         <div className="size-8 rounded-lg border border-white/10 flex items-center justify-center text-muted-custom group-hover/doc:text-primary-gold group-hover/doc:border-primary-gold/40 transition-all bg-black/5 shadow-sm">
                            <Eye size={14} />
                         </div>
                       )}
                       <a 
                         href={doc.src} 
                         download 
                         onClick={(e) => e.stopPropagation()}
                         className="size-8 rounded-lg border border-white/10 flex items-center justify-center text-muted-custom hover:text-primary-gold hover:border-primary-gold/40 transition-all bg-black/5 shadow-sm"
                       >
                          <Download size={14} />
                       </a>
                     </div>
                   </div>
                 );
               })}
             </div>
          </div>
        )}

        {/* Media Grid */}
        {mediaArray?.some(item => item.type === 'image' && !!item.src) && (
          <div className={`grid gap-1 ${
            mediaArray.filter(item => item.type === 'image').length === 1 ? 'grid-cols-1' :
            mediaArray.filter(item => item.type === 'image').length === 2 ? 'grid-cols-2 aspect-[4/3]' :
            mediaArray.filter(item => item.type === 'image').length === 3 ? 'grid-cols-2 aspect-square' :
            'grid-cols-2 aspect-square'
          } ${!isEmbedded ? 'px-4 pb-4' : 'px-0 pb-0'} relative z-20`}>
            
            {mediaArray.filter(item => item.type === 'image' && !!item.src).map((item, i) => (
              <div 
                key={i} 
                className={`relative bg-black/20 overflow-hidden ${
                  displayPost.media!.length === 3 && i === 0 ? 'row-span-2' : ''
                } ${displayPost.media!.length === 1 ? 'rounded-xl max-h-[500px]' : (isEmbedded ? '' : 'rounded-lg')}`}
              >
                <img 
                  src={item.src} 
                  alt={`Post media ${i + 1}`}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-700 cursor-pointer"
                  onClick={(e) => { e.stopPropagation(); /* image preview logic */ }}
                />
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Interactions are disabled on embedded (quoted) cards */}
      {!isEmbedded && (
        <>
          <ImpressionsBar count={(displayPost.viewCount ?? 0).toString()} icon="eye" />
          <InteractionBar
            postId={post.id}
            likes={post._count?.interactions || 0}
            comments={post._count?.comments || 0}
            reshares={post._count?.reshares || 0}
            initialLiked={post.userInteraction?.hasUpvoted}
            initialBookmarked={post.userInteraction?.hasBookmarked}
            initialReshared={post.userInteraction?.hasReshared}
          />
        </>
      )}

      {/* Document Safety Modal */}
      <AnimatePresence>
        {isInfoModalOpen && (
          <Portal>
            <div className="fixed inset-0 z-[700] flex items-center justify-center p-4">
              <motion.div 
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="absolute inset-0 bg-black/60 backdrop-blur-md"
                onClick={() => setIsInfoModalOpen(false)}
              />
              <motion.div 
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                className="relative w-full max-w-sm bg-main border border-white/10 p-8 rounded-2xl shadow-[0_30px_100px_rgba(0,0,0,0.3)] overflow-hidden font-inter z-[701]"
              >
                <button 
                  onClick={() => setIsInfoModalOpen(false)}
                  className="absolute top-6 right-6 size-8 rounded-full bg-white/5 flex items-center justify-center text-main opacity-40 hover:opacity-100 hover:bg-white/10 transition-all"
                >
                  <X size={16} />
                </button>
                <div className="absolute top-0 left-0 w-full h-1.5 bg-amber-500" />
                <div className="size-14 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-500 mb-6 border border-amber-500/20">
                  <ShieldAlert size={28} strokeWidth={1.5} />
                </div>
                <h2 className="text-xl font-bold text-main mb-3 tracking-tight">Safety First</h2>
                <p className="text-[14px] text-main opacity-80 mb-8 leading-relaxed font-medium">
                  Kihumba is a social community. Your safety depends on trusting the people you interact with.
                </p>
                
                <div className="space-y-6 mb-10">
                  {[
                    { title: "Trust the Sender", text: "Only open files from @"+displayPost.author.username+" if you trust them." },
                    { title: "Watch for Risks", text: "Be careful with files that look suspicious or unfamiliar." },
                    { title: "Use the Preview", text: "Always check the 'Instant Preview' before downloading." }
                  ].map((item, i) => (
                    <div key={i} className="flex gap-4">
                      <div className="size-1.5 rounded-full bg-amber-500 mt-2 shrink-0 shadow-[0_0_10px_rgba(245,158,11,0.5)]" />
                      <div>
                        <p className="text-[14px] font-bold text-main mb-0.5">{item.title}</p>
                        <p className="text-[12px] text-main opacity-60 leading-relaxed font-medium">{item.text}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <button 
                  onClick={() => setIsInfoModalOpen(false)}
                  className="w-full py-4 rounded-xl bg-amber-500 text-black text-xs font-black uppercase tracking-[0.2em] hover:brightness-110 transition-all active:scale-95 shadow-lg shadow-amber-500/20"
                >
                  Understood
                </button>
              </motion.div>
            </div>
          </Portal>
        )}
      </AnimatePresence>

      {/* File Preview Modal */}
      <FilePreviewModal 
        isOpen={!!viewingDoc} 
        onClose={() => setViewingDoc(null)} 
        file={viewingDoc} 
      />
    </article>
  );
}
