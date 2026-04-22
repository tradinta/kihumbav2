'use client';

import React, { useState, useEffect } from 'react';
import ChatSidebar from '@/components/messages/ChatSidebar';
import LeftSidebar from '@/components/LeftSidebar';
import TopBar from '@/components/TopBar';
import BottomNav from '@/components/BottomNav';
import { useAuth } from '@/context/AuthContext';
import { api } from '@/lib/api';
import { stories as mockStories } from '@/data/chatData';
import { useParams, useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';
import { SidebarSkeleton, InboxSkeleton } from '@/components/messages/skeletons/MessageSkeletons';

export default function MessagesLayout({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const router = useRouter();
  const params = useParams();
  const activeChatId = params?.id as string;

  const [chats, setChats] = useState<any[]>([]);
  const [activeFilter, setActiveFilter] = useState('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    async function fetchRooms() {
      try {
        setLoading(true);
        const rooms = await api.get('/chat/rooms');
        const mappedChats = (rooms || []).map((room: any) => {
          const isDm = room.type === 'DM';
          const otherParticipant = isDm ? room.participants.find((p: any) => p.userId !== user?.id) : null;
          
          return {
            id: room.id,
            type: room.type.toLowerCase(),
            name: isDm ? (otherParticipant?.user?.fullName || 'User') : room.name,
            avatar: isDm ? otherParticipant?.user?.avatar : room.avatar,
            description: room.description,
            slug: room.slug,
            lastMsg: (room.lastMessage?.content) || 'Start a conversation',
            time: room.lastMessage ? new Date(room.lastMessage.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '',
            unread: 0,
            isPremium: isDm ? !!otherParticipant?.user?.isVerified : false,
            isOnline: isDm ? !!otherParticipant?.user?.isOnline : false,
            isAnon: room.type === 'ANON',
            members: room.participants.length,
            groupMembers: room.participants.map((p: any) => ({
              id: p.userId,
              name: p.user?.fullName || 'User',
              avatar: p.user?.avatar || '',
              isVerified: !!p.user?.isVerified,
              subscriptionTier: p.user?.subscriptionTier || 'FREE',
              accountType: p.user?.accountType || 'NORMAL',
              role: p.role
            })),
            metadata: room.metadata
          };
        });
        setChats(mappedChats);
      } catch (err) {
        console.error('Failed to fetch rooms', err);
      } finally {
        setLoading(false);
      }
    }
    fetchRooms();
  }, [user]);

  const handleSelectChat = (id: string | number) => {
    router.push(`/messages/${id}`);
  };

  const isChatOpen = !!activeChatId;

  if (loading) {
    return (
      <div className="flex h-screen bg-black overflow-hidden">
        <LeftSidebar collapsed={true} />
        <div className="flex-1 flex flex-col h-full bg-black">
          <div className="shrink-0 pt-2">
            <TopBar />
          </div>
          <div className="flex-1 flex overflow-hidden">
            <div className="w-80 shrink-0 border-r border-custom p-3 bg-black">
              <SidebarSkeleton />
            </div>
            <div className="flex-1 bg-black">
              <InboxSkeleton />
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-page overflow-hidden">
      {/* Global Sidebar - Collapsed icons for messaging context */}
      <LeftSidebar collapsed={true} />

      <div className="flex-1 flex flex-col min-w-0 h-full relative bg-page transition-colors duration-500 p-2 md:p-3">
        {/* Global TopBar - Integrated into the messages flow */}
        <div className="shrink-0">
          <TopBar />
        </div>

        <div className="flex-1 flex overflow-hidden mt-3 gap-3">
          {/* Chat Sidebar - Local navigation within messages */}
          <div className={`${isChatOpen ? 'hidden md:flex' : 'flex w-full'} md:w-80 md:min-w-80 shrink-0 card-surface border border-custom overflow-hidden`}>
            <ChatSidebar
              stories={mockStories}
              chats={chats}
              activeFilter={activeFilter}
              setActiveFilter={setActiveFilter}
              activeChatId={activeChatId}
              setActiveChatId={handleSelectChat}
              onRefresh={() => {}}
            />
          </div>

          {/* Content Area - Contained and closed */}
          <div className={`flex-1 min-w-0 card-surface border border-custom overflow-hidden transition-all duration-500 shadow-sm ${isChatOpen ? 'flex' : 'hidden md:flex'}`}>
            {children}
          </div>
        </div>

        {/* Global Mobile Nav */}
        <div className="md:hidden pt-3">
           <BottomNav />
        </div>
      </div>
    </div>
  );
}
