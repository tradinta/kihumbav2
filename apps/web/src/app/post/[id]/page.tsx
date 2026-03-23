"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, MoreHorizontal, ShieldCheck, Heart, MessageCircle, Share2, Send } from "lucide-react";
import { motion } from "framer-motion";

import LeftSidebar from "@/components/LeftSidebar";
import RightSidebar from "@/components/RightSidebar";
import BottomNav from "@/components/BottomNav";
import PostCard from "@/components/feed/PostCard";
import { mockPost, mockComments, type CommentData } from "@/data/postData";

export default function PostDetailsPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [replyText, setReplyText] = useState("");

  const profileHref = (handle: string) => `/profile/${handle.replace('@', '')}`;

  return (
    <div className="max-w-[1400px] mx-auto flex flex-col lg:flex-row min-h-screen lg:px-6 gap-6">
      <LeftSidebar />

      <main className="flex-1 w-full max-w-2xl mx-auto lg:mx-0 pt-0 lg:pt-4 pb-32 lg:pb-12 relative flex flex-col">
        {/* Header */}
        <div className="sticky top-0 z-40 nav-surface border-b border-custom px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button onClick={() => router.back()} className="p-2 -ml-2 text-muted-custom hover:text-primary-gold transition-colors rounded-full hover:bg-primary-gold/10">
              <ArrowLeft size={20} />
            </button>
            <h1 className="text-sm font-bold tracking-widest uppercase text-primary-gold">Post</h1>
          </div>
          <button className="text-muted-custom hover:text-primary-gold transition-colors">
            <MoreHorizontal size={20} />
          </button>
        </div>

        {/* Post Content */}
        <div className="mt-4 px-4 bg-[var(--bg-color)]">
          {/* We render PostCard inside a wrapper to prevent its internal Link from navigating again since we are already on the post page */}
          <div className="pointer-events-auto ring-1 ring-primary-gold/10 rounded-xl overflow-hidden shadow-lg shadow-black/5">
            <PostCard post={mockPost} index={0} />
          </div>
        </div>

        {/* Comments Section */}
        <div className="flex-1 mt-6 border-t border-custom pt-4 px-4 pb-20">
          <h2 className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary-gold mb-6">Comments ({mockComments.length})</h2>
          
          <div className="space-y-6">
            {mockComments.map((comment, i) => (
              <motion.div
                key={comment.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 + i * 0.05 }}
                className="flex gap-3"
              >
                <Link href={profileHref(comment.author.handle)} className="shrink-0 pt-1">
                  <div className="size-8 rounded-full border border-custom overflow-hidden">
                    <img src={comment.author.avatar} alt={comment.author.name} className="size-full object-cover" />
                  </div>
                </Link>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2 mb-0.5">
                    <div className="flex items-center gap-1.5 min-w-0">
                      <Link href={profileHref(comment.author.handle)} className="hover:underline hover:text-primary-gold truncate">
                        <span className="text-[11px] font-bold">{comment.author.name}</span>
                      </Link>
                      {comment.author.verified && <ShieldCheck size={10} className="text-primary-gold shrink-0" />}
                      <span className="text-[9px] text-muted-custom truncate">{comment.author.handle}</span>
                      <span className="text-[9px] text-muted-custom ml-1 shrink-0">· {comment.timestamp}</span>
                    </div>
                  </div>
                  
                  <p className="text-[11px] font-bold text-muted-custom leading-relaxed mt-1">
                    {comment.content}
                  </p>

                  <div className="flex items-center gap-4 mt-2.5">
                    <button className="flex items-center gap-1.5 text-muted-custom hover:text-primary-gold transition-colors group">
                      <Heart size={12} className="group-active:scale-90 transition-transform" />
                      <span className="text-[9px] font-bold">{comment.likes}</span>
                    </button>
                    <button className="flex items-center gap-1.5 text-muted-custom hover:text-primary-gold transition-colors group">
                      <MessageCircle size={12} className="group-active:scale-90 transition-transform" />
                      {comment.replies && <span className="text-[9px] font-bold">{comment.replies} Replies</span>}
                    </button>
                    <button className="flex items-center gap-1.5 text-muted-custom hover:text-primary-gold transition-colors group">
                      <Share2 size={12} className="group-active:scale-90 transition-transform" />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Reply Input Sticky Bottom */}
        <div className="fixed lg:absolute bottom-0 left-0 right-0 lg:left-auto lg:right-auto lg:w-full nav-surface border-t border-custom p-3 lg:bottom-0 mb-14 lg:mb-0 z-40">
          <div className="flex items-center gap-2 max-w-2xl mx-auto">
            <div className="size-8 rounded-full border border-primary-gold/30 p-0.5 shrink-0">
              <img src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=100" className="size-full rounded-full object-cover" alt="You" />
            </div>
            <div className="flex-1 relative">
              <input
                type="text"
                placeholder="Reply to this post..."
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                className="w-full bg-[var(--pill-bg)] border border-custom rounded-full pl-4 pr-10 py-2.5 text-[11px] font-bold text-main placeholder:text-muted-custom focus:outline-none focus:border-primary-gold/50 transition-colors"
              />
              <button 
                disabled={!replyText.trim()}
                className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 text-primary-gold disabled:opacity-30 disabled:hover:scale-100 hover:scale-110 transition-all"
              >
                <Send size={14} />
              </button>
            </div>
          </div>
        </div>
      </main>

      <RightSidebar />
      <BottomNav />
    </div>
  );
}
