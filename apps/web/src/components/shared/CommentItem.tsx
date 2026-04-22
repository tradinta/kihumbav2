'use client';

import React, { useState } from 'react';
import { Heart, Reply, Trash2, ChevronDown, ChevronUp, Image as LucideImage } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { CommentData } from '@/hooks/useComments';
import UserIdentity from './UserIdentity';

function formatDistanceToNow(date: Date) {
  const diff = Math.floor((new Date().getTime() - date.getTime()) / 1000);
  if (diff < 60) return 'just now';
  if (diff < 3600) return `${Math.floor(diff / 60)}m`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h`;
  return `${Math.floor(diff / 86400)}d`;
}

interface CommentItemProps {
  comment: CommentData;
  onReply?: (parentId: string, username: string) => void;
  onDelete?: (id: string) => void;
  onHeart?: (id: string) => void;
  onLoadReplies?: (id: string) => void;
  depth?: number;
}

export default function CommentItem({ 
  comment, 
  onReply, 
  onDelete, 
  onHeart, 
  onLoadReplies,
  depth = 0 
}: CommentItemProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const hasReplies = (comment._count?.replies || 0) > 0;
  const isLoaded = (comment.replies?.length || 0) > 0;

  const handleToggleReplies = () => {
    if (!isLoaded && hasReplies) {
      onLoadReplies?.(comment.id);
    }
    setIsExpanded(!isExpanded);
  };

  const heartColor = comment.userInteraction?.hasHearted ? 'text-red-500 fill-red-500' : 'text-muted-custom hover:text-red-400';

  return (
    <div className={`relative flex flex-col ${depth > 0 ? 'mt-3' : 'py-6 border-b border-custom last:border-0'}`}>
      
      {/* ─── PREMIUM THREAD CONNECTORS ─── */}
      {depth > 0 && (
        <>
          {/* Vertical Path */}
          <div 
            className="absolute -left-5 top-0 w-[2px] opacity-60"
            style={{ 
              height: 'calc(100% + 12px)',
              background: 'linear-gradient(to bottom, var(--primary-gold) 0%, transparent 100%)',
              boxShadow: '0 0 10px var(--primary-gold)' 
            }}
          />
          {/* Horizontal L-Branch */}
          <div 
            className="absolute -left-5 top-4 w-4 h-[2px] opacity-60"
            style={{ 
              background: 'var(--primary-gold)',
              boxShadow: '0 0 10px var(--primary-gold)' 
            }}
          />
        </>
      )}

      <div className={`flex gap-3 px-2 ${depth > 0 ? 'ml-4' : ''}`}>
        <UserIdentity 
          user={{
            ...comment.author,
            subscriptionTier: (comment.author as any).subscriptionTier,
            accountType: (comment.author as any).accountType,
            hasStatus: false // Comments don't typically show status rings
          } as any}
          size={depth > 0 ? "sm" : "md"}
          hideHandle
          className="flex-1"
        />

        {/* Content Area */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[9px] font-bold text-muted-custom uppercase tabular-nums">
              {formatDistanceToNow(new Date(comment.createdAt))}
            </span>
          </div>

          <p className="text-[13px] text-main/90 leading-relaxed break-words font-medium">
            {comment.content}
          </p>

          {/* Media Rendering */}
          {comment.media && comment.media.length > 0 && (
            <div className={`mt-3 grid gap-2 ${comment.media.length === 1 ? 'grid-cols-1' : 'grid-cols-2'} max-w-[320px]`}>
              {comment.media.map((item: any, idx: number) => (
                <div key={idx} className="relative aspect-square rounded-xl overflow-hidden border border-custom shadow-xl group/media">
                   <img src={item.url} alt="attachment" className="w-full h-full object-cover transition-transform duration-500 group-hover/media:scale-110" />
                   <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover/media:opacity-100 transition-opacity" />
                </div>
              ))}
            </div>
          )}

          {/* Action Bar */}
          <div className="flex items-center gap-5 mt-3">
            <button 
                onClick={() => onHeart?.(comment.id)}
                className={`flex items-center gap-1.5 transition-all active:scale-125 ${heartColor}`}
            >
              <Heart size={13} strokeWidth={comment.userInteraction?.hasHearted ? 0 : 2} />
              <span className="text-[10px] font-bold tabular-nums">
                {comment._count?.interactions || 0}
              </span>
            </button>

            <button 
              onClick={() => onReply?.(comment.parentId || comment.id, comment.author.username)}
              className="flex items-center gap-1.5 text-muted-custom hover:text-main transition-colors group/reply"
            >
              <Reply size={13} className="group-hover/reply:-translate-x-0.5 transition-transform" />
              <span className="text-[9px] font-bold uppercase tracking-wider">Reply</span>
            </button>

            <button 
               onClick={() => onDelete?.(comment.id)}
               className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity text-muted-custom hover:text-red-500"
            >
              <Trash2 size={13} />
            </button>
          </div>

          {/* Reply View Control */}
          {hasReplies && depth === 0 && (
            <button 
              onClick={handleToggleReplies}
              className="mt-3 flex items-center gap-2 text-[9px] font-bold uppercase tracking-[0.1em] text-primary-gold hover:brightness-125 transition-all group/toggle"
            >
              <div className="h-[1px] w-4 bg-primary-gold/30 group-hover:w-6 transition-all" />
              {isExpanded ? (
                <>Hide Replies <ChevronUp size={10} /></>
              ) : (
                <>View {comment._count?.replies} Replies <ChevronDown size={10} /></>
              )}
            </button>
          )}

          {/* Sub-Replies Nesting */}
          <AnimatePresence>
            {(isExpanded || (depth > 0 && isLoaded)) && comment.replies && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="overflow-hidden"
              >
                <div className="space-y-2">
                  {comment.replies.map((reply) => (
                    <CommentItem 
                      key={reply.id} 
                      comment={reply} 
                      depth={depth + 1}
                      onReply={onReply}
                      onDelete={onDelete}
                      onHeart={onHeart}
                      onLoadReplies={onLoadReplies}
                    />
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
