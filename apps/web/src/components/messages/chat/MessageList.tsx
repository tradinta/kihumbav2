'use client';

import React, { useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Lock } from 'lucide-react';
import MessageItem from './MessageItem';

interface MessageListProps {
  messages: any[];
  currentUser: any;
  activeChat: any;
  msgMenuOpen: string | null;
  setMsgMenuOpen: (id: string | null) => void;
  setReplyingTo: (msg: any) => void;
  deleteMessage: (id: string, mode: 'ME' | 'EVERYONE') => void;
  editMessage: (id: string, newContent: string) => void;
  onViewMedia: (url: string, fileName?: string, messageId?: string, isMe?: boolean) => void;
  deletingIds: string[];
}

export default function MessageList({
  messages, currentUser, activeChat,
  msgMenuOpen, setMsgMenuOpen,
  setReplyingTo, deleteMessage, editMessage,
  onViewMedia, deletingIds
}: MessageListProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <div 
      ref={scrollRef}
      className="flex-1 overflow-y-auto scrollbar-hide p-4 md:p-6 flex flex-col gap-6"
    >
      {/* Encryption Notice */}
      <div className="flex justify-center py-2">
        <span className="card-surface rounded px-3 py-1 text-[8px] font-bold uppercase tracking-widest text-muted-custom flex items-center gap-1.5">
          <Lock size={8} className="text-primary-gold/50" /> End-to-end encrypted
        </span>
      </div>

      {messages.map((msg, idx) => (
        <MessageItem
          key={msg.id || idx}
          msg={msg}
          isMe={msg.senderId === currentUser?.id}
          currentUser={currentUser}
          activeChat={activeChat}
          msgMenuOpen={msgMenuOpen === msg.id}
          setMsgMenuOpen={setMsgMenuOpen}
          setReplyingTo={setReplyingTo}
          deleteMessage={deleteMessage}
          editMessage={editMessage}
          onViewMedia={onViewMedia}
          isDeleting={deletingIds.includes(msg.id)}
        />
      ))}
    </div>
  );
}
