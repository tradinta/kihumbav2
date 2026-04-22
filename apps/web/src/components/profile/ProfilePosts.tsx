import React from 'react';
import { motion } from 'framer-motion';
import { FileText, Pin } from 'lucide-react';
import PostCard from '@/components/feed/PostCard';

interface Props {
  posts: any[];
  isSelf?: boolean;
}

export default function ProfilePosts({ posts = [], isSelf }: Props) {
  if (!posts || posts.length === 0) {
    return (
      <div className="px-4 py-12 text-center">
        <div className="size-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mx-auto mb-4 text-white/10">
            <FileText size={28} />
        </div>
        <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-custom">No contributions yet</p>
      </div>
    );
  }

  // Filter and Sort pinned posts (Most recent first)
  const pinnedPosts = posts
    .filter(p => p.isPinned)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    
  const regularPosts = posts.filter(p => !p.isPinned);

  return (
    <div className="px-4 space-y-4 stagger-children pb-12">
      {/* Pinned Showcase - Now vertical and ordered */}
      {pinnedPosts.length > 0 && (
        <div className="space-y-4 mb-8">
          <div className="flex items-center gap-2 px-1 mb-2">
            <Pin size={12} className="text-primary-gold" />
            <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-primary-gold gold-glow">
              Pinned Collection
            </h3>
          </div>
          {pinnedPosts.map((post, i) => (
            <PostCard key={`pinned-${post.id}`} post={post} index={i} />
          ))}
        </div>
      )}

      {/* Main Feed Header if there are pinned posts */}
      {pinnedPosts.length > 0 && regularPosts.length > 0 && (
        <div className="pt-4 pb-2 border-b border-white/5 mb-4">
            <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-custom">Recent Activity</h3>
        </div>
      )}

      {/* Regular Posts */}
      {regularPosts.map((post, i) => (
        <PostCard key={post.id} post={post} index={i} />
      ))}
    </div>
  );
}
