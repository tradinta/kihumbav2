'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Download, Trash2, MessageCircle, Loader2, Image as ImageIcon } from 'lucide-react';
import { api } from '@/lib/api';
import { useUploads } from '@/context/UploadContext';

import ChatHeader from './chat/ChatHeader';
import MessageList from './chat/MessageList';
import ChatInput from './chat/ChatInput';
import GroupInfoModal from './GroupInfoModal';
import UserInfoModal from './UserInfoModal';

import type { Chat, Message, ChatUser } from '@/data/chatData';

interface ChatAreaProps {
  currentUser: ChatUser | null;
  activeChat: Chat;
  messages: Message[];
  msgInput: string;
  setMsgInput: (val: string) => void;
  handleSendMessage: (type?: string, content?: string, extra?: Record<string, any>) => void;
  sendMockAttachment: (type: string) => void;
  attachmentMenuOpen: boolean;
  setAttachmentMenuOpen: (val: boolean) => void;
  replyingTo: any | null;
  setReplyingTo: (msg: any | null) => void;
  msgMenuOpen: string | null;
  setMsgMenuOpen: (id: string | null) => void;
  deleteMessage: (id: string) => void;
  setMessages: React.Dispatch<React.SetStateAction<Message[]>>;
  onBack?: () => void;
  handleTyping: (isTyping: boolean) => void;
  isTyping: boolean;
}

export default function ChatArea({
  currentUser, activeChat, messages, msgInput, setMsgInput,
  handleSendMessage, sendMockAttachment,
  attachmentMenuOpen, setAttachmentMenuOpen,
  replyingTo, setReplyingTo, msgMenuOpen, setMsgMenuOpen,
  setMessages, onBack, handleTyping, isTyping
}: ChatAreaProps) {
  const [selectedMedia, setSelectedMedia] = useState<{ url: string, fileName?: string, messageId?: string, isMe?: boolean } | null>(null);
  const [isInfoModalOpen, setIsInfoModalOpen] = useState(false);
  const [isDownloadingBatch, setIsDownloadingBatch] = useState(false);
  const [isAccepting, setIsAccepting] = useState(false);
  const [deletingIds, setDeletingIds] = useState<string[]>([]);
  const { enlistImage, enlistDocument } = useUploads();

  // ─── Internal Actions ───────────────────────────────────────────────────────
  const internalDeleteMessage = async (id: string, mode: 'ME' | 'EVERYONE') => {
    try {
      setDeletingIds(prev => [...prev, id]);
      
      // Optimistic update for "Delete for Me"
      if (mode === 'ME') {
        setMessages(prev => prev.filter(m => m.id !== id));
      }

      if (mode === 'EVERYONE') {
        await api.delete(`/chat/rooms/${activeChat.id}/messages/${id}?mode=EVERYONE`);
        // For EVERYONE, the Ably subscription in the parent will handle the update
      } else {
        await api.delete(`/chat/rooms/${activeChat.id}/messages/${id}?mode=ME`);
      }
      setMsgMenuOpen(null);
    } catch (err) {
      console.error('Failed to delete message', err);
      // Rollback if needed for ME mode
      if (mode === 'ME') {
        // Since we don't have the original message here easily, 
        // we might just let it stay deleted or fetch again.
      }
    } finally {
      setDeletingIds(prev => prev.filter(mid => mid !== id));
    }
  };

  const internalEditMessage = async (id: string, content: string) => {
    try {
      await api.patch(`/chat/rooms/${activeChat.id}/messages/${id}`, { content });
      setMsgMenuOpen(null);
    } catch (err) {
      console.error('Failed to edit message', err);
    }
  };

  const downloadAllFiles = async () => {
    const fileMessages = messages.filter(m => m.type === 'FILE');
    if (fileMessages.length === 0) return;
    
    setIsDownloadingBatch(true);
    for (const msg of fileMessages) {
      const link = document.createElement('a');
      link.href = (msg.metadata as any)?.mediaUrl || msg.content;
      link.download = (msg.metadata as any)?.fileName || 'download';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      await new Promise(r => setTimeout(r, 300));
    }
    setIsDownloadingBatch(false);
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    try {
      const uploadResults = await Promise.all(files.map(async (file) => {
        const isImage = file.type.startsWith('image/');
        const result = isImage ? await enlistImage(file, 'fires') : await enlistDocument(file);
        
        return {
          fileName: file.name,
          fileSize: file.size,
          mimeType: file.type,
          extension: file.name.split('.').pop()?.toLowerCase() || '',
          mediaUrl: result.publicUrl,
          isImage
        };
      }));

      if (uploadResults.length === 1) {
        const res = uploadResults[0];
        handleSendMessage(res.isImage ? 'IMAGE' : 'FILE', res.fileName, res);
      } else {
        // Grouped Gallery/Batch send
        handleSendMessage('GALLERY', `${uploadResults.length} attachments`, {
          files: uploadResults
        });
      }
    } catch (err) {
      console.error('Failed to upload files', err);
    }
  };

  const isRequest = activeChat.metadata?.isRequest;
  const isPending = activeChat.metadata?.requestStatus === 'PENDING';
  const isInitiator = activeChat.metadata?.initiatorId === currentUser?.id;

  return (
    <div className="flex-1 flex flex-col h-full bg-[var(--bg-color)] relative overflow-hidden">
      <ChatHeader 
        activeChat={activeChat}
        isTyping={isTyping}
        onBack={onBack}
        downloadAllFiles={downloadAllFiles}
        isDownloadingBatch={isDownloadingBatch}
        onShowInfo={() => setIsInfoModalOpen(true)}
      />

      {activeChat.type === 'group' ? (
        <GroupInfoModal 
          isOpen={isInfoModalOpen}
          onClose={() => setIsInfoModalOpen(false)}
          chat={activeChat}
          messages={messages}
        />
      ) : (
        <UserInfoModal 
          isOpen={isInfoModalOpen}
          onClose={() => setIsInfoModalOpen(false)}
          chat={activeChat}
          messages={messages}
        />
      )}

      <MessageList 
        messages={messages}
        currentUser={currentUser}
        activeChat={activeChat}
        msgMenuOpen={msgMenuOpen}
        setMsgMenuOpen={setMsgMenuOpen}
        setReplyingTo={setReplyingTo}
        deleteMessage={internalDeleteMessage}
        editMessage={internalEditMessage}
        onViewMedia={(url, fileName, messageId, isMe) => setSelectedMedia({ url, fileName, messageId, isMe })}
        deletingIds={deletingIds}
      />

      {/* Message Request Banner */}
      {isRequest && isPending && !isInitiator && (
        <div className="px-5 pb-4">
          <div className="card-surface rounded-xl p-4 border border-primary-gold/20 flex flex-col items-center text-center gap-3">
             <div className="size-10 rounded-full bg-primary-gold/10 flex items-center justify-center">
                <MessageCircle size={18} className="text-primary-gold" />
             </div>
             <div>
                <h4 className="text-[10px] font-bold uppercase tracking-widest text-primary-gold mb-1">Message Request</h4>
                <p className="text-[9px] text-muted-custom font-bold max-w-[200px]">
                  {activeChat.name} wants to chat with you.
                </p>
             </div>
             <div className="flex items-center gap-2 w-full max-w-[240px]">
                <button className="flex-1 h-8 rounded-lg border border-custom text-[9px] font-bold uppercase tracking-widest text-muted-custom hover:text-primary-gold transition-all">Ignore</button>
                <button className="flex-1 h-8 rounded-lg bg-primary-gold text-black text-[9px] font-bold uppercase tracking-widest hover:brightness-110 transition-all">Accept</button>
             </div>
          </div>
        </div>
      )}

      <ChatInput 
        msgInput={msgInput}
        setMsgInput={setMsgInput}
        handleSendMessage={handleSendMessage}
        handleFileSelect={handleFileSelect}
        handleTyping={handleTyping}
        replyingTo={replyingTo}
        setReplyingTo={setReplyingTo}
        isAnon={activeChat.isAnon}
      />

      {/* Media Viewer Overlay */}
      <AnimatePresence>
        {selectedMedia && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/95 flex flex-col items-center justify-center p-4 md:p-10"
            onClick={() => setSelectedMedia(null)}
          >
            <button className="absolute top-6 right-6 size-12 rounded-full bg-white/5 flex items-center justify-center text-white hover:bg-white/10 transition-all"><X size={24} /></button>
            <div className="relative w-full max-w-5xl h-full flex flex-col items-center justify-center gap-6" onClick={e => e.stopPropagation()}>
               <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="w-full flex-1 flex items-center justify-center min-h-0">
                 {selectedMedia.url && (selectedMedia.url.includes('video') || selectedMedia.url.toLowerCase().endsWith('.mp4')) ? (
                   <video src={selectedMedia.url} controls autoPlay className="max-w-full max-h-full rounded-lg shadow-2xl" />
                 ) : (
                   <img src={selectedMedia.url} className="max-w-full max-h-full object-contain rounded-lg shadow-2xl" alt="" />
                 )}
               </motion.div>
            </div>
            <div className="absolute bottom-10 flex items-center gap-3">
              <button 
                onClick={() => {
                  const link = document.createElement('a');
                  link.href = selectedMedia.url;
                  link.download = selectedMedia.fileName || 'download';
                  document.body.appendChild(link);
                  link.click();
                  document.body.removeChild(link);
                }}
                className="h-10 px-6 rounded-full bg-white/10 text-white text-[10px] font-black uppercase tracking-[0.2em] hover:bg-white/20 transition-all flex items-center gap-2 border border-white/10"
              >
                <Download size={14} /> Download Original
              </button>

              {selectedMedia.messageId && (
                <>
                  <button 
                    onClick={() => {
                      internalDeleteMessage(selectedMedia.messageId!, 'ME');
                      setSelectedMedia(null);
                    }}
                    className="h-10 px-6 rounded-full bg-red-500/10 text-red-400 text-[10px] font-black uppercase tracking-[0.2em] hover:bg-red-500/20 transition-all border border-red-500/20 flex items-center gap-2"
                  >
                    <Trash2 size={14} /> Delete for me
                  </button>

                  {selectedMedia.isMe && (
                    <button 
                      onClick={() => {
                        internalDeleteMessage(selectedMedia.messageId!, 'EVERYONE');
                        setSelectedMedia(null);
                      }}
                      className="h-10 px-6 rounded-full bg-red-500 text-white text-[10px] font-black uppercase tracking-[0.2em] hover:brightness-110 transition-all flex items-center gap-2"
                    >
                      <Trash2 size={14} /> Delete for everyone
                    </button>
                  )}
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
