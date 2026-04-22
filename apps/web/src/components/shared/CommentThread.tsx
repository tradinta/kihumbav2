'use client';

import React, { useState } from 'react';
import { Send, Loader2, MessageSquare, Sparkles, Trophy, Clock, Image as LucideImage, X, Reply } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useComments, CommentTargetType, SortingType } from '@/hooks/useComments';
import CommentItem from './CommentItem';

interface CommentThreadProps {
  targetType: CommentTargetType;
  targetId: string;
}

export default function CommentThread({ targetType, targetId }: CommentThreadProps) {
  const { 
    comments, 
    isLoading, 
    isLoadingMore, 
    hasMore, 
    error, 
    sortBy, 
    setSortBy, 
    loadMore, 
    loadReplies, 
    addComment, 
    toggleHeart, 
    deleteComment 
  } = useComments(targetType, targetId);

  const [newComment, setNewComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [replyTo, setReplyTo] = useState<{ id: string; username: string } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim() || isSubmitting) return;

    setIsSubmitting(true);
    try {
      await addComment(newComment, [], replyTo?.id);
      setNewComment("");
      setReplyTo(null);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReply = (parentId: string, username: string) => {
    setReplyTo({ id: parentId, username });
    const input = document.getElementById("comment-input");
    input?.focus();
  };

  const sortingTabs: { id: SortingType; label: string; icon: any }[] = [
    { id: 'RANDOM', label: 'Shuffle', icon: Sparkles },
    { id: 'LOVED', label: 'Top', icon: Trophy },
    { id: 'RECENT', label: 'New', icon: Clock },
  ];

  const CommentSkeleton = () => (
    <div className="space-y-6">
      {[1, 2, 3].map((i) => (
        <div key={i} className="flex gap-3 px-2 animate-fade-in-up" style={{ animationDelay: `${i * 100}ms` }}>
          <div className="size-9 rounded-full animate-shimmer flex-shrink-0" />
          <div className="flex-1 space-y-3">
            <div className="flex items-center gap-2">
              <div className="h-2.5 w-24 rounded-full animate-shimmer" />
              <div className="h-2 w-10 rounded-full animate-shimmer opacity-50" />
            </div>
            <div className="h-3 w-full rounded-md animate-shimmer" />
            <div className="h-3 w-2/3 rounded-md animate-shimmer" />
            <div className="flex gap-4 mt-2">
              <div className="h-3 w-6 rounded-md animate-shimmer" />
              <div className="h-3 w-12 rounded-md animate-shimmer" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <div className="flex flex-col h-full nav-surface rounded-[24px] border border-custom overflow-hidden shadow-2xl ring-1 ring-white/5">
      {/* Header & Sorting */}
      <div className="px-6 py-4 border-b border-custom flex items-center justify-between">
        <div className="flex items-center gap-4">
          {sortingTabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setSortBy(tab.id)}
              className={`flex items-center gap-1.5 transition-all relative ${
                sortBy === tab.id ? 'text-primary-gold' : 'text-muted-custom hover:text-main'
              }`}
            >
              <tab.icon size={12} strokeWidth={sortBy === tab.id ? 2.5 : 2} />
              <span className="text-[10px] font-bold uppercase tracking-widest">{tab.label}</span>
              {sortBy === tab.id && (
                <motion.div layoutId="sort-pill" className="absolute -bottom-[18px] left-0 right-0 h-[2px] bg-primary-gold rounded-full shadow-[0_0_8px_rgba(197, 160, 89, 0.5)]" />
              )}
            </button>
          ))}
        </div>
        <div className="text-[9px] font-bold text-muted-custom pill-surface px-3 py-1 rounded-full border border-custom tabular-nums">
           {comments.length}{hasMore ? '+' : ''} Voices
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 custom-scrollbar min-h-[400px]">
        <AnimatePresence mode="popLayout">
          {isLoading ? (
            <motion.div 
               initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
               className="py-4"
            >
              <CommentSkeleton />
            </motion.div>
          ) : error ? (
            <div className="text-center py-12 text-red-400 text-[10px] font-bold uppercase tracking-widest">{error}</div>
          ) : comments.length === 0 ? (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center justify-center py-20 text-muted-custom">
              <MessageSquare size={40} strokeWidth={1} className="mb-4 opacity-10" />
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-center leading-relaxed">The silence is curious.<br/>Curate the first word.</p>
            </motion.div>
          ) : (
            <div className="flex flex-col">
              {comments.map((comment) => (
                <CommentItem 
                  key={comment.id} 
                  comment={comment} 
                  onReply={handleReply}
                  onDelete={deleteComment}
                  onHeart={toggleHeart}
                  onLoadReplies={loadReplies}
                />
              ))}

              {/* Load More Trigger */}
              {hasMore && (
                <button 
                  onClick={loadMore}
                  disabled={isLoadingMore}
                  className="mt-6 py-3 rounded-xl border border-custom hover:bg-white/[0.02] flex items-center justify-center gap-3 transition-all group active:scale-95"
                >
                  {isLoadingMore ? (
                    <Loader2 size={14} className="animate-spin text-primary-gold/50" />
                  ) : (
                    <>
                      <div className="h-[1px] w-8 bg-white/10 group-hover:bg-primary-gold/30 transition-all" />
                      <span className="text-[9px] font-bold uppercase tracking-[0.3em] text-muted-custom group-hover:text-primary-gold transition-colors">Load More</span>
                      <div className="h-[1px] w-8 bg-white/10 group-hover:bg-primary-gold/30 transition-all" />
                    </>
                  )}
                </button>
              )}
            </div>
          )}
        </AnimatePresence>
      </div>

      {/* Input Area */}
      <div className="p-6 bg-black/10 border-t border-custom space-y-4">
        <AnimatePresence>
          {replyTo && (
            <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="flex items-center justify-between px-4 py-2 bg-primary-gold/5 rounded-xl border border-primary-gold/10"
            >
              <div className="flex items-center gap-2">
                <Reply size={12} className="text-primary-gold" />
                <span className="text-[10px] font-bold text-primary-gold uppercase tracking-wider">Replying to <span className="text-main">@{replyTo.username}</span></span>
              </div>
              <button onClick={() => setReplyTo(null)} className="p-1 hover:bg-white/10 rounded-full transition-colors">
                <X size={12} className="text-muted-custom" />
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        <form onSubmit={handleSubmit} className="relative group/form">
          <textarea
            id="comment-input"
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Curate a response..."
            className="w-full bg-white/5 border border-custom rounded-[20px] p-4 pr-14 text-sm text-main placeholder:text-muted-custom focus:outline-none focus:border-primary-gold/30 focus:bg-white/[0.04] transition-all resize-none min-h-[100px] shadow-inner"
          />
          
          <div className="absolute bottom-4 left-4 flex items-center gap-2">
             <button type="button" className="p-2 text-muted-custom hover:text-primary-gold transition-colors rounded-lg hover:bg-white/5">
                <LucideImage size={18} strokeWidth={1.5} />
             </button>
          </div>

          <button
            type="submit"
            disabled={!newComment.trim() || isSubmitting}
            className={`absolute bottom-4 right-4 p-2.5 rounded-xl transition-all duration-300 ${
              newComment.trim() && !isSubmitting 
                ? "bg-primary-gold text-black shadow-[0_0_15px_rgba(197, 160, 89, 0.3)] scale-100 hover:scale-105 active:scale-95" 
                : "bg-white/5 text-muted-custom scale-90 opacity-50"
            }`}
          >
            {isSubmitting ? <Loader2 size={18} className="animate-spin" /> : <Send size={18} strokeWidth={2.5} />}
          </button>
        </form>
      </div>
    </div>
  );
}
