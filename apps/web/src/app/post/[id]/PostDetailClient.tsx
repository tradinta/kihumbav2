'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, MoreHorizontal, MessageSquare } from 'lucide-react';
import { api } from '@/lib/api';
import PostCard from '@/components/feed/PostCard';
import CommentThread from '@/components/shared/CommentThread';
import SkeletonPostDetails from '@/components/skeletons/SkeletonPostDetails';
import TopBar from '@/components/TopBar';
import LeftSidebar from '@/components/LeftSidebar';
import RightSidebar from '@/components/RightSidebar';
import BottomNav from '@/components/BottomNav';

interface Props {
  postId: string;
}

export default function PostDetailClient({ postId }: Props) {
  const router = useRouter();
  const [post, setPost] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    async function fetchPost() {
      try {
        const data = await api.get(`/posts/${postId}`);
        setPost(data);
      } catch (err) {
        console.error("Failed to fetch post", err);
        setError(true);
      } finally {
        setLoading(false);
      }
    }
    if (postId) fetchPost();
  }, [postId]);

  return (
    <div className="max-w-[1400px] mx-auto flex flex-col lg:flex-row min-h-screen lg:px-6 gap-6">
      <LeftSidebar />

      <main className="flex-1 w-full max-w-2xl mx-auto lg:mx-0 pt-0 lg:pt-4 pb-32 lg:pb-12 relative flex flex-col">
        {/* Header */}
        <div className="sticky top-0 z-40 bg-[var(--bg-color)]/80 backdrop-blur-md border-b border-custom px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button onClick={() => router.back()} className="p-2 -ml-2 text-muted-custom hover:text-primary-gold transition-colors rounded-full hover:bg-primary-gold/10">
              <ArrowLeft size={18} />
            </button>
            <h1 className="text-[10px] font-bold tracking-[0.2em] uppercase text-primary-gold">Post View</h1>
          </div>
          <button className="p-2 -mr-2 text-muted-custom hover:text-primary-gold transition-colors rounded-full hover:bg-primary-gold/10">
            <MoreHorizontal size={18} />
          </button>
        </div>

        <AnimatePresence mode="wait">
          {loading ? (
            <motion.div 
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <SkeletonPostDetails />
            </motion.div>
          ) : error ? (
            <motion.div 
              key="error"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex-1 flex flex-col items-center justify-center p-8 text-center gap-4"
            >
              <div className="size-16 rounded-2xl bg-red-500/10 flex items-center justify-center text-red-500 mb-2">
                <MessageSquare className="size-8 opacity-50" />
              </div>
              <div>
                <h2 className="text-sm font-bold uppercase tracking-widest text-primary-gold mb-1">Post Not Found</h2>
                <p className="text-[10px] text-muted-custom font-bold">The discussion you're looking for might have been deleted or is unavailable.</p>
              </div>
              <button 
                onClick={() => router.push('/')}
                className="mt-4 h-9 px-6 rounded-lg bg-primary-gold text-black text-[10px] font-bold uppercase tracking-widest hover:brightness-110 transition-all"
              >
                Back to Feed
              </button>
            </motion.div>
          ) : (
            <motion.div
              key="content"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="mt-4 flex flex-col gap-6"
            >
              <div className="px-4">
                <div className="pointer-events-auto ring-1 ring-primary-gold/10 rounded-xl overflow-hidden shadow-2xl shadow-black/20">
                  <PostCard post={post} index={0} />
                </div>
              </div>

              {/* Comment Section Header */}
              <div className="px-6 flex items-center justify-between">
                 <h3 className="text-[10px] font-bold uppercase tracking-widest text-primary-gold">Discussion</h3>
                 <span className="text-[9px] font-bold text-muted-custom">{post._count?.comments || 0} Comments</span>
              </div>

              <div className="px-4 pb-20">
                <CommentThread targetType="POST" targetId={postId} />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      <RightSidebar />
      <BottomNav />
    </div>
  );
}
