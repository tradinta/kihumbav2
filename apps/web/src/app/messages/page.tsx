'use client';

import React, { useState, useCallback, useMemo } from 'react';
import { MessageCircle } from 'lucide-react';
import LeftSidebar from '@/components/LeftSidebar';
import TopBar from '@/components/TopBar';
import BottomNav from '@/components/BottomNav';
import ChatSidebar from '@/components/messages/ChatSidebar';
import ChatArea from '@/components/messages/ChatArea';
import {
  currentUser, stories, initialChats, dmMessages, groupMessages,
  type Message,
} from '@/data/chatData';

export default function MessagesPage() {
  const [activeFilter, setActiveFilter] = useState('all');
  const [chats] = useState(initialChats);
  const [activeChatId, setActiveChatId] = useState<number | null>(null);
  const [msgInput, setMsgInput] = useState('');
  const [attachmentMenuOpen, setAttachmentMenuOpen] = useState(false);
  const [replyingTo, setReplyingTo] = useState<Message | null>(null);
  const [msgMenuOpen, setMsgMenuOpen] = useState<number | null>(null);

  // Store messages per chat so switching preserves content
  const [messagesMap, setMessagesMap] = useState<Record<number, Message[]>>({
    1: dmMessages,       // Elena DM — embedded post, marketplace, kao, replies
    2: groupMessages,    // Design Sync group — sender names, verified badges, poll, embedded content
  });

  const activeChat = chats.find(c => c.id === activeChatId) ?? null;
  const messages = activeChatId ? (messagesMap[activeChatId] ?? []) : [];

  const handleSendMessage = useCallback((type = 'text', content = msgInput, extra: Record<string, any> = {}) => {
    if (type === 'text' && !content.trim()) return;
    if (!activeChatId) return;
    const newMsg: Message = {
      id: Date.now(),
      senderId: currentUser.id,
      senderName: currentUser.name,
      text: content,
      type,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      replyTo: replyingTo ? { ...replyingTo } : null,
      ...extra,
    };
    setMessagesMap(prev => ({
      ...prev,
      [activeChatId]: [...(prev[activeChatId] ?? []), newMsg],
    }));
    setMsgInput('');
    setReplyingTo(null);
    setAttachmentMenuOpen(false);
  }, [msgInput, replyingTo, activeChatId]);

  const sendMockAttachment = useCallback((type: string) => {
    if (type === 'image') handleSendMessage('image', 'Sent an image', { mediaUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=400' });
    if (type === 'video') handleSendMessage('video', 'Sent a video', { mediaUrl: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=400' });
    if (type === 'audio') handleSendMessage('audio', 'Audio message');
    if (type === 'poll') handleSendMessage('poll', '', {
      pollData: { question: 'Quick poll — what do you think?', options: [{ label: '👍 Yes', votes: 0 }, { label: '👎 No', votes: 0 }], totalVotes: 0 }
    });
    if (type === 'contact') handleSendMessage('contact', 'Shared a contact', { contactName: 'Alex Rivera' });
    if (type === 'post') handleSendMessage('post', 'Shared a post', { postTitle: 'Kihumba just launched marketplace!' });
  }, [handleSendMessage]);

  const deleteMessage = useCallback((id: number) => {
    if (!activeChatId) return;
    setMessagesMap(prev => ({
      ...prev,
      [activeChatId]: (prev[activeChatId] ?? []).filter(m => m.id !== id),
    }));
    setMsgMenuOpen(null);
  }, [activeChatId]);

  const chatIsOpen = activeChatId !== null && activeChat !== null;

  return (
    <div className="max-w-[1600px] mx-auto flex flex-col lg:flex-row min-h-screen lg:px-6 gap-0">
      {/* Left sidebar — collapses to icon-only when a chat is open */}
      <div className={`transition-all duration-300 ${chatIsOpen ? 'lg:w-16 xl:w-16' : ''}`}>
        <LeftSidebar collapsed={chatIsOpen} />
      </div>

      <main className="flex-1 w-full mx-auto lg:mx-0 pt-0 lg:pt-4 pb-32 lg:pb-4 flex flex-col">
        <TopBar />

        {/* Messages layout — chat list + chat area */}
        <div className="flex gap-3 px-3 pt-3 flex-1 h-[calc(100vh-100px)] min-h-0">
          <ChatSidebar
            stories={stories}
            chats={chats}
            activeFilter={activeFilter}
            setActiveFilter={setActiveFilter}
            activeChatId={activeChatId}
            setActiveChatId={setActiveChatId}
          />

          {/* Chat area or empty state */}
          {chatIsOpen ? (
            <ChatArea
              currentUser={currentUser}
              activeChat={activeChat}
              messages={messages}
              msgInput={msgInput}
              setMsgInput={setMsgInput}
              handleSendMessage={handleSendMessage}
              sendMockAttachment={sendMockAttachment}
              attachmentMenuOpen={attachmentMenuOpen}
              setAttachmentMenuOpen={setAttachmentMenuOpen}
              replyingTo={replyingTo}
              setReplyingTo={setReplyingTo}
              msgMenuOpen={msgMenuOpen}
              setMsgMenuOpen={setMsgMenuOpen}
              deleteMessage={deleteMessage}
            />
          ) : (
            <div className="hidden md:flex flex-1 card-surface rounded-lg flex-col items-center justify-center">
              <div className="size-16 rounded-full bg-primary-gold/5 border border-primary-gold/15 flex items-center justify-center mb-4">
                <MessageCircle size={28} className="text-primary-gold/30" />
              </div>
              <h2 className="text-xs font-bold uppercase tracking-widest text-muted-custom mb-1">Your Messages</h2>
              <p className="text-[9px] text-muted-custom/60 font-bold">Select a chat to start messaging</p>
            </div>
          )}
        </div>
      </main>

      <BottomNav />
    </div>
  );
}
