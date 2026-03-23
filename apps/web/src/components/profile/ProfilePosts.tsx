'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Pin, FileText } from 'lucide-react';
import PostCard from '@/components/feed/PostCard';
import type { ProfilePost } from '@/data/profileData';

interface Props {
  posts: ProfilePost[];
}

export default function ProfilePosts({ posts }: Props) {
  if (posts.length === 0) {
    return (
      <div className="px-4 py-12 text-center">
        <FileText size={28} className="text-primary-gold/20 mx-auto mb-3" />
        <p className="text-[10px] font-bold uppercase tracking-widest text-muted-custom">No posts yet</p>
      </div>
    );
  }

  // Separate pinned from rest
  const pinned = posts.find(p => p.isPinned);
  const rest = posts.filter(p => !p.isPinned);

  return (
    <div className="px-4 space-y-4 stagger-children">
      {/* Pinned post */}
      {pinned && (
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
          <div className="flex items-center gap-1.5 mb-2 px-1">
            <Pin size={10} className="text-primary-gold" />
            <span className="text-[8px] font-bold uppercase tracking-widest text-primary-gold">Pinned Post</span>
          </div>
          <div className="ring-1 ring-primary-gold/20 rounded-xl">
            <PostCard post={pinned as any} index={0} />
          </div>
        </motion.div>
      )}

      {/* Rest */}
      {rest.map((post, i) => (
        <PostCard key={post.id} post={post as any} index={i + 1} />
      ))}
    </div>
  );
}
