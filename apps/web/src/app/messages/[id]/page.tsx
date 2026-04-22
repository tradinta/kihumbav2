'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Loader2, X } from 'lucide-react';
import { ChatAreaSkeleton } from '@/components/messages/skeletons/MessageSkeletons';
import ChatArea from '@/components/messages/ChatArea';
import { useAuth } from '@/context/AuthContext';
import { useAbly } from '@/context/AblyContext';
import { api } from '@/lib/api';

export default function ChatRoomPage() {
  const { id } = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const ablyContext = useAbly();
  const { subscribeToRoom, publishToRoom, subscribeToPresence, setActiveRoomId } = ablyContext;

  useEffect(() => {
    if (id) {
      setActiveRoomId(id.toString());
      return () => setActiveRoomId(null);
    }
  }, [id, setActiveRoomId]);

  const [activeChat, setActiveChat] = useState<any>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [msgInput, setMsgInput] = useState('');
  const [replyingTo, setReplyingTo] = useState<any | null>(null);
  const [msgMenuOpen, setMsgMenuOpen] = useState<string | null>(null);
  const [isTyping, setIsTyping] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 1. Fetch Room Details & Messages
  useEffect(() => {
    if (!id || !user) return;

    async function initRoom() {
      try {
        setLoading(true);
        setError(null);
        // Fetch specific room metadata
        const room = await api.get(`/chat/rooms/${id}`);
        const isDm = room.type === 'DM';
        const otherParticipant = isDm ? room.participants.find((p: any) => p.userId !== user?.id) : null;
        
        setActiveChat({
          id: room.id,
          type: room.type.toLowerCase(),
          name: isDm ? (otherParticipant?.user?.fullName || 'User') : room.name,
          avatar: isDm ? otherParticipant?.user?.avatar : room.avatar,
          isPremium: isDm ? !!otherParticipant?.user?.isVerified : false,
          isOnline: isDm ? !!otherParticipant?.user?.isOnline : false,
          isAnon: room.type === 'ANON',
          members: room.participants.length,
          groupMembers: room.participants.map((p: any) => ({
            id: p.userId,
            name: p.user?.fullName || 'User',
            avatar: p.user?.avatar || '',
            isVerified: !!p.user?.isVerified,
            role: p.role
          })),
          metadata: room.metadata
        });

        // Fetch Messages
        const msgs = await api.get(`/chat/rooms/${id}/messages`);
        setMessages(msgs);
      } catch (err: any) {
        console.error('Failed to load room', err);
        setError(err.message || 'Identity link could not be established.');
      } finally {
        setLoading(false);
      }
    }

    initRoom();
  }, [id, user]);

  // 2. Realtime Subscriptions
  useEffect(() => {
    if (!id || !ablyContext.ably) return;

    const unsubscribe = subscribeToRoom(id.toString(), (data) => {
      if (data.event === 'message.deleted') {
        if (data.soft) {
          setMessages(prev => prev.map(m => m.id === data.messageId ? { ...m, content: 'Message deleted', isDeleted: true, metadata: null } : m));
        } else {
          setMessages(prev => prev.filter(m => m.id !== data.messageId));
        }
        return;
      }

      setMessages(prev => {
        if (prev.find(m => m.id === data.id)) return prev;
        return [...prev, data];
      });
    });

    const unsubPresence = subscribeToPresence(id.toString(), (members) => {
      setActiveChat((prev: any) => {
        if (!prev) return prev;
        return { ...prev, isOnline: members.length > 1 };
      });
    });

    const channel = ablyContext.ably.channels.get(`room:${id}`);
    channel.subscribe('typing', (msg: any) => {
      const { userId, isTyping: typing } = msg.data;
      if (userId !== user?.id) setIsTyping(typing);
    });

    return () => {
      unsubscribe();
      unsubPresence();
      channel.unsubscribe('typing');
    };
  }, [id, ablyContext, subscribeToRoom, subscribeToPresence, user]);

  const handleSendMessage = useCallback(async (type = 'TEXT', content = msgInput, extra: Record<string, any> = {}) => {
    if (type === 'TEXT' && !content.trim()) return;
    if (!id) return;

    const optimisticId = `temp-${Date.now()}`;
    const optimisticMsg = {
      id: optimisticId,
      content,
      type,
      senderId: user?.id,
      createdAt: new Date().toISOString(),
      metadata: extra,
      replyTo: replyingTo,
      isOptimistic: true
    };

    setMessages(prev => [...prev, optimisticMsg]);
    setMsgInput('');
    setReplyingTo(null);

    try {
      const res = await api.post(`/chat/rooms/${id}/messages`, {
        content,
        type,
        metadata: extra,
        replyToId: replyingTo?.id
      });

      setMessages(prev => {
        const alreadyExists = prev.some(m => m.id === res.id);
        if (alreadyExists) return prev.filter(m => m.id !== optimisticId);
        return prev.map(m => m.id === optimisticId ? { ...res, replyTo: res.replyTo || optimisticMsg.replyTo } : m);
      });
    } catch (err) {
      console.error('Failed to send message', err);
      setMessages(prev => prev.filter(m => m.id !== optimisticId));
    }
  }, [id, msgInput, replyingTo, user]);

  const handleTyping = useCallback(async (typing: boolean) => {
    if (!id || !user) return;
    await publishToRoom(id.toString(), 'typing', { userId: user.id, isTyping: typing });
  }, [id, user, publishToRoom]);

  if (loading) {
    return <ChatAreaSkeleton />;
  }

  if (error || !activeChat) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center bg-black p-6 text-center">
        <div className="size-16 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center mb-6">
          <X className="text-red-500" size={32} />
        </div>
        <h3 className="text-sm font-black uppercase tracking-[0.3em] text-white mb-2">
          Secure Link Failed
        </h3>
        <p className="text-[10px] text-muted-custom font-bold uppercase tracking-widest max-w-[240px] leading-relaxed mb-8">
          The requested identity vault is inaccessible or does not exist.
        </p>
        <button 
          onClick={() => router.push('/messages')}
          className="px-8 py-4 bg-white/5 border border-white/10 rounded-xl text-[9px] font-black uppercase tracking-[0.2em] text-primary-gold hover:bg-white/10 transition-all"
        >
          Return to Vault
        </button>
      </div>
    );
  }

  return (
    <ChatArea
      currentUser={user}
      activeChat={activeChat}
      messages={messages}
      msgInput={msgInput}
      setMsgInput={setMsgInput}
      handleSendMessage={handleSendMessage}
      sendMockAttachment={() => {}}
      attachmentMenuOpen={false}
      setAttachmentMenuOpen={() => {}}
      replyingTo={replyingTo}
      setReplyingTo={setReplyingTo}
      msgMenuOpen={msgMenuOpen}
      setMsgMenuOpen={setMsgMenuOpen}
      deleteMessage={() => {}} // This will be handled internally by ChatArea now
      setMessages={setMessages}
      onBack={() => router.push('/messages')}
      handleTyping={handleTyping}
      isTyping={isTyping}
    />
  );
}
