'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api';
import MuxPlayer from '@/components/shared/MuxPlayer';
import LeftSidebar from '@/components/LeftSidebar';
import BottomNav from '@/components/BottomNav';
import { 
  ArrowLeft, Eye, Plus
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import InteractionBar from '@/components/feed/InteractionBar';
import RelatedVideos from '@/components/video/RelatedVideos';
import CommentThread from '@/components/shared/CommentThread';
import { format } from 'date-fns';

// Local Badge component matching Marketplace style
const Badge = ({ children, gold, className }: { children: React.ReactNode; gold?: boolean; className?: string }) => (
  <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-widest border ${
    gold ? 'bg-primary-gold/10 text-primary-gold border-primary-gold/30' : 'pill-surface text-muted-custom border-custom'
  } ${className ?? ''}`}>{children}</span>
);

export default function VideoDetailClient({ videoId }: { videoId: string }) {
  const router = useRouter();
  const [video, setVideo] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [showDescription, setShowDescription] = useState(false);
  const [relatedVideos, setRelatedVideos] = useState<any[]>([]);
  const [isFollowing, setIsFollowing] = useState(false);

  useEffect(() => {
    async function fetchVideo() {
      try {
        const [videoData, relatedData] = await Promise.all([
          api.get(`/videos/${videoId}`),
          api.get('/videos/feed')
        ]);
        setVideo(videoData);
        setIsFollowing(videoData.author?.isFollowing || false);
        setRelatedVideos(relatedData.filter((v: any) => v.id !== videoId).slice(0, 6));
      } catch (err) {
        console.error("Failed to load video", err);
      } finally {
        setLoading(false);
      }
    }
    if (videoId) fetchVideo();
  }, [videoId]);

  const handleFollow = async () => {
      if (!video?.author?.id) return;
      try {
          const method = isFollowing ? 'unfollow' : 'follow';
          await api.post(`/users/${video.author.id}/${method}`);
          setIsFollowing(!isFollowing);
      } catch (err) {
          console.error("Follow action failed", err);
      }
  };

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center bg-page">
        <div className="size-10 border-2 border-primary-gold border-t-transparent animate-spin rounded-full" />
      </div>
    );
  }

  if (!video) {
    return (
      <div className="h-screen flex flex-col items-center justify-center bg-page text-main px-6 text-center">
        <h1 className="text-lg font-bold uppercase tracking-[0.2em] text-primary-gold mb-2">Video not found</h1>
        <p className="text-[10px] text-muted-custom font-bold uppercase tracking-widest mb-8">This content may have been removed.</p>
        <button 
          onClick={() => router.push('/studio')} 
          className="h-8 px-6 rounded bg-primary-gold text-black text-[9px] font-bold uppercase tracking-widest hover:brightness-110 transition-all active:scale-95"
        >
          Return to Studio
        </button>
      </div>
    );
  }

  const postData = video.post || {
    id: `v-${video.id}`,
    _count: { interactions: 0, comments: 0, reshares: 0 },
    userInteraction: {}
  };

  const exactDate = format(new Date(video.createdAt), "MMMM do, yyyy 'at' h:mm a");

  return (
    <div className="max-w-[1400px] mx-auto flex flex-col lg:flex-row min-h-screen lg:px-6 gap-6">
      <LeftSidebar />

      <main className="flex-1 w-full max-w-3xl mx-auto lg:mx-0 pt-0 lg:pt-4 pb-32 lg:pb-12">
        {/* Mobile Header */}
        <div className="lg:hidden px-4 flex items-center justify-between h-12 nav-surface sticky top-0 z-50 border-b border-custom">
           <button onClick={() => router.back()} className="text-main"><ArrowLeft size={16} /></button>
           <h1 className="text-[9px] font-bold uppercase tracking-[0.2em] text-primary-gold">Kihumba Video</h1>
           <div className="size-4" />
        </div>

        <div className="px-4 lg:px-0 mt-4 space-y-4">
          {/* Video Theater Card */}
          <div className="card-surface rounded-lg overflow-hidden shadow-sm" key={video.id}>
            <div className="aspect-video bg-black">
              <MuxPlayer 
                key={`player-${video.id}`}
                playbackId={video.playbackId}
                videoUrl={video.videoUrl}
                title={video.title}
                autoPlay={true}
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          {/* Engagement Ribbon - High Density */}
          <div className="card-surface rounded-lg p-4 space-y-4">
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2">
                 <h1 className="text-base lg:text-lg font-bold tracking-tight text-main leading-tight">{video.title}</h1>
                 {video.isSpark && <Badge gold>Spark</Badge>}
              </div>
              
              <div className="flex items-center gap-2">
                 <Badge gold><Eye size={10} /> {video.viewCount?.toLocaleString() || 0} Views</Badge>
                 <span className="text-[10px] font-bold text-muted-custom uppercase tracking-widest">{formatDistanceToNow(new Date(video.createdAt))} ago</span>
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-4 pt-3 border-t border-custom">
              <div className="flex items-center gap-3">
                <div className="size-10 rounded-full overflow-hidden border border-custom shrink-0">
                   <img src={video.author.avatar || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=100"} 
                     alt={video.author.username} className="size-full object-cover" />
                </div>
                <div className="flex flex-col gap-0.5">
                   <h3 className="text-sm font-bold text-main leading-none">{video.author.fullName || video.author.username}</h3>
                   <div className="flex items-center gap-2">
                      <span className="text-[10px] text-muted-custom">@{video.author.username}</span>
                      <span className="size-1 rounded-full bg-muted-custom/30" />
                      <span className="text-[9px] font-bold text-primary-gold uppercase tracking-widest">{video.author._count?.followers || 0} Followers</span>
                   </div>
                </div>
                <button 
                  onClick={handleFollow}
                  className={`h-7 px-4 ml-2 rounded transition-all active:scale-95 flex items-center gap-1 text-[9px] font-bold uppercase tracking-widest ${
                    isFollowing 
                    ? 'pill-surface text-muted-custom border border-custom' 
                    : 'bg-primary-gold text-black hover:brightness-110'
                  }`}
                >
                  {isFollowing ? 'Following' : <><Plus size={10} /> Follow</>}
                </button>
              </div>

              <div className="card-surface rounded-lg p-0.5">
                 <InteractionBar 
                    postId={postData.id}
                    likes={postData._count?.interactions || 0}
                    comments={postData._count?.comments || 0}
                    reshares={postData._count?.reshares || 0}
                    initialLiked={postData.userInteraction?.hasUpvoted}
                    initialBookmarked={postData.userInteraction?.hasBookmarked}
                    initialReshared={postData.userInteraction?.hasReshared}
                 />
              </div>
            </div>
          </div>

          {/* Description Card - High Density */}
          <div className="card-surface rounded-lg p-4">
            <div className="flex items-center justify-between mb-3">
               <h2 className="text-[9px] font-bold uppercase tracking-widest text-muted-custom">Description</h2>
               <button 
                 onClick={() => setShowDescription(!showDescription)}
                 className="text-[9px] font-black text-primary-gold uppercase tracking-widest"
               >
                 {showDescription ? 'Show Less' : 'Read More'}
               </button>
            </div>
            
            <div className={`text-sm text-main leading-relaxed whitespace-pre-wrap ${!showDescription ? 'line-clamp-2' : ''}`}>
              <span className="font-bold text-primary-gold mr-2">Posted on {exactDate}.</span>
              {video.description || "No description provided."}
            </div>
          </div>

          {/* Mobile Discussions */}
          <div className="lg:hidden space-y-6">
             <div className="flex items-center justify-between px-2">
                <h2 className="text-[9px] font-bold uppercase tracking-widest text-muted-custom">Discussions</h2>
                <Badge gold>{postData._count?.comments || 0}</Badge>
             </div>
             <div className="h-[400px]">
                <CommentThread targetType="POST" targetId={postData.id} />
             </div>
             
             <div className="space-y-4">
                <h2 className="text-[9px] font-bold uppercase tracking-widest text-muted-custom px-2">Up Next</h2>
                <RelatedVideos videos={relatedVideos} />
             </div>
          </div>
        </div>
      </main>

      {/* Right Sidebar */}
      <aside className="hidden lg:flex flex-col w-72 shrink-0 gap-6 pt-4">
         <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between px-2">
               <h2 className="text-[9px] font-bold uppercase tracking-widest text-muted-custom">Discussion</h2>
               <Badge gold className="text-[8px]">{postData._count?.comments || 0}</Badge>
            </div>
            <div className="h-[450px] card-surface rounded-lg overflow-hidden">
               <CommentThread targetType="POST" targetId={postData.id} />
            </div>
         </div>

         <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between px-2">
               <h2 className="text-[9px] font-bold uppercase tracking-widest text-muted-custom">Recommended</h2>
               <div className="h-px flex-1 bg-custom mx-4 opacity-50" />
            </div>
            <RelatedVideos videos={relatedVideos} />
         </div>
      </aside>

      <BottomNav />
    </div>
  );
}
