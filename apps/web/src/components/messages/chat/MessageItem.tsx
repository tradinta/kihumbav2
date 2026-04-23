'use client';

import React, { useState, useMemo } from 'react';
import { 
  MoreVertical, Reply, Trash2, Edit2, 
  Check, Heart, MessageCircle, Download,
  Eye, User, Flame, Ghost, ShieldCheck, 
  File, FileText, FileArchive, FileCode, Music, FileVideo, FileImage, ImagePlay,
  SmilePlus, Loader2, ShoppingCart, Home, ArrowRight, ExternalLink, Users, BarChart2
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import UserIdentity from '@/components/shared/UserIdentity';
import type { Message } from '@/data/chatData';

interface MessageItemProps {
  msg: any;
  isMe: boolean;
  currentUser: any;
  activeChat: any;
  msgMenuOpen: boolean;
  setMsgMenuOpen: (id: string | null) => void;
  setReplyingTo: (msg: any) => void;
  deleteMessage: (id: string, mode: 'ME' | 'EVERYONE') => void;
  editMessage: (id: string, newContent: string) => void;
  onViewMedia: (url: string, fileName?: string, messageId?: string, isMe?: boolean) => void;
  isDeleting?: boolean;
}

const VerifiedBadge = ({ size = 10 }: { size?: number }) => (
  <span className="inline-flex items-center justify-center size-3.5 bg-primary-gold rounded-full shrink-0">
    <ShieldCheck size={size} className="text-black" />
  </span>
);

export default function MessageItem({
  msg, isMe, currentUser, activeChat,
  msgMenuOpen, setMsgMenuOpen,
  setReplyingTo, deleteMessage, editMessage,
  onViewMedia, isDeleting = false
}: MessageItemProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(msg.content);
  const [showReactions, setShowReactions] = useState(false);
  const [avatarMenuOpen, setAvatarMenuOpen] = useState(false);

  const msgTime = new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  
  // Time logic
  const canEdit = useMemo(() => {
    if (!isMe) return false;
    const diff = (Date.now() - new Date(msg.createdAt).getTime()) / 1000 / 60;
    return diff < 5;
  }, [msg.createdAt, isMe]);

  const canDeleteForEveryone = useMemo(() => {
    if (!isMe) return false;
    const diff = (Date.now() - new Date(msg.createdAt).getTime()) / 1000 / 60;
    return diff < 30;
  }, [msg.createdAt, isMe]);

  const handleEdit = () => {
    if (!editValue.trim()) return;
    editMessage(msg.id, editValue);
    setIsEditing(false);
    setMsgMenuOpen(null);
  };

  const reactions = ['🔥', '❤️', '😂', '💯', '🙌', '💀'];

  const renderContent = () => {
    const meta = msg.metadata as any;
    if (isEditing) {
      return (
        <div className="flex flex-col gap-2 min-w-[200px]">
          <textarea 
            className="w-full bg-black/20 border border-black/10 rounded p-2 text-[10px] font-bold outline-none text-black placeholder:text-black/30"
            value={editValue}
            onChange={(e) => setEditValue(e.target.value)}
            autoFocus
          />
          <div className="flex justify-end gap-2">
            <button onClick={() => setIsEditing(false)} className="text-[8px] font-bold uppercase tracking-widest text-black/40">Cancel</button>
            <button onClick={handleEdit} className="text-[8px] font-bold uppercase tracking-widest text-black flex items-center gap-1"><Check size={10} /> Save</button>
          </div>
        </div>
      );
    }

    switch (msg.type) {
      case 'IMAGE':
      case 'FILE': {
        const ext = meta?.extension || '';
        const isImage = msg.type === 'IMAGE' || meta?.mimeType?.startsWith('image/') || ['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(ext);
        const isVideo = meta?.mimeType?.startsWith('video/') || ['mp4', 'mov', 'avi', 'mkv'].includes(ext);
        const previewUrl = meta?.mediaUrl || meta?.previewUrl;

        let FileIcon = File;
        if (['pdf', 'doc', 'docx', 'txt'].includes(ext)) FileIcon = FileText;
        if (['zip', 'rar', '7z', 'tar'].includes(ext)) FileIcon = FileArchive;
        if (['js', 'ts', 'py', 'html', 'css', 'json'].includes(ext)) FileIcon = FileCode;
        if (['mp3', 'wav', 'ogg', 'm4a'].includes(ext)) FileIcon = Music;
        if (isVideo) FileIcon = FileVideo;
        if (isImage) FileIcon = FileImage;

        return (
          <div className="flex flex-col">
            {(isImage || isVideo) && previewUrl && (
              <div 
                onClick={() => onViewMedia(previewUrl, meta?.fileName, msg.id, isMe)} 
                className="relative rounded-lg overflow-hidden border border-custom bg-black/5 cursor-pointer group/preview max-w-[340px] max-h-[420px] flex items-center justify-center -mx-4 -my-3 mb-[-12px] mt-[-12px]"
              >
                {isImage ? (
                   <img src={previewUrl} className="w-full h-full object-cover" alt={meta?.fileName || 'image'} title={meta?.fileName} />
                ) : (
                   <div className="relative w-full aspect-video flex items-center justify-center">
                     <video src={previewUrl} className="w-full h-full object-cover" />
                     <div className="absolute inset-0 bg-black/40 flex items-center justify-center"><ImagePlay className="size-10 text-white/50" /></div>
                   </div>
                )}
                <div className="absolute inset-0 bg-black/20 opacity-0 group-hover/preview:opacity-100 transition-opacity flex items-center justify-center text-white backdrop-blur-[2px]"><Eye size={18} /></div>
              </div>
            )}
            
            {/* Show file details card ONLY for non-images */}
            {!isImage && (
              <div className="flex items-center gap-3 pt-2">
                <div className="size-10 rounded-lg bg-primary-gold/10 flex items-center justify-center shrink-0"><FileIcon size={20} className="text-primary-gold" /></div>
                <div className="flex-1 min-w-0">
                  <p className={`text-[10px] font-black truncate leading-tight ${isMe ? 'text-black' : ''}`}>{meta?.fileName || msg.content}</p>
                  <p className={`text-[8px] font-bold mt-0.5 ${isMe ? 'text-black/50' : 'text-muted-custom/70'}`}>
                    {meta?.fileSize ? (meta.fileSize / 1024 / 1024).toFixed(1) + ' MB' : ext.toUpperCase()}
                  </p>
                </div>
              </div>
            )}
          </div>
        );
      }
      case 'GALLERY': {
        const files = meta?.files || [];
        return (
          <div className="flex flex-col max-w-[360px] -mx-4 -my-3 mb-[-12px] mt-[-12px]">
            <div className={`grid gap-0.5 ${files.length >= 3 ? 'grid-cols-2' : 'grid-cols-1'}`}>
              {files.map((file: any, i: number) => (
                <div key={i} onClick={() => onViewMedia(file.mediaUrl, file.fileName, msg.id, isMe)} className="relative overflow-hidden bg-black/5 cursor-pointer group/preview aspect-square">
                  {file.isImage ? (
                    <img src={file.mediaUrl} className="w-full h-full object-cover" alt={file.fileName || 'gallery image'} />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center bg-primary-gold/5 p-2 text-center">
                      <File size={16} className="text-primary-gold mb-1" />
                      <span className="text-[7px] font-black truncate w-full">{file.fileName}</span>
                    </div>
                  )}
                  <div className="absolute inset-0 bg-black/20 opacity-0 group-hover/preview:opacity-100 transition-opacity flex items-center justify-center text-white backdrop-blur-[1px]"><Eye size={14} /></div>
                </div>
              ))}
            </div>
            {msg.content && <p className="text-[10px] font-bold mt-2 px-4 pb-2 opacity-80 leading-relaxed">{msg.content}</p>}
          </div>
        );
      }
      case 'POLL': {
        const options = meta?.options || [];
        const isQuiz = meta?.isQuiz;
        const totalVotes = options.reduce((acc: number, o: any) => acc + (o.votes || 0), 0);
        
        return (
          <div className="flex flex-col gap-3 min-w-[240px] py-1">
            <div className="flex items-center gap-2 mb-1">
              <div className="size-8 rounded-lg bg-primary-gold/10 flex items-center justify-center border border-primary-gold/20">
                <BarChart2 size={16} className="text-primary-gold" />
              </div>
              <div className="flex flex-col">
                <span className="text-[8px] font-black uppercase tracking-[0.2em] text-primary-gold">
                  {isQuiz ? 'Quiz' : 'Poll'}
                </span>
                <span className="text-[11px] font-black text-white/90 leading-tight">{msg.content}</span>
              </div>
            </div>

            <div className="space-y-2">
              {options.map((opt: any, i: number) => {
                const percentage = totalVotes > 0 ? Math.round((opt.votes / totalVotes) * 100) : 0;
                return (
                  <button key={i} className="w-full relative group/opt overflow-hidden rounded-xl border border-white/5 bg-white/5 hover:bg-white/10 transition-all p-3 text-left">
                    <div className="relative z-10 flex items-center justify-between gap-4">
                      <span className="text-[10px] font-bold text-white/80">{opt.text}</span>
                      <div className="flex items-center gap-2">
                         <span className="text-[8px] font-black text-primary-gold opacity-0 group-hover/opt:opacity-100 transition-opacity">{opt.votes || 0} V</span>
                         <span className="text-[9px] font-black text-white/40">{percentage}%</span>
                      </div>
                    </div>
                    {/* Progress Bar */}
                    <motion.div 
                      initial={{ width: 0 }} animate={{ width: `${percentage}%` }}
                      className="absolute inset-y-0 left-0 bg-primary-gold/10 border-r border-primary-gold/30" 
                    />
                  </button>
                );
              })}
            </div>

            <div className="flex items-center justify-between mt-1 px-1">
               <span className="text-[7px] font-black uppercase tracking-widest text-muted-custom/50">
                 {totalVotes} Total Votes
               </span>
               {meta?.expiresAt && (
                 <span className="text-[7px] font-black uppercase tracking-widest text-primary-gold/50">
                   Active • Ends {new Date(meta.expiresAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                 </span>
               )}
            </div>
          </div>
        );
      }
      default:
        if (msg.isDeleted) {
          return (
            <div className="flex items-center gap-2 py-0.5 opacity-40 italic">
              <Trash2 size={10} />
              <span className="text-[10px] font-bold">Message deleted</span>
            </div>
          );
        }
        return <SmartLinkRenderer content={msg.content} />;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className={`flex max-w-[85%] ${isMe ? 'self-end flex-row-reverse' : 'self-start'} gap-2 group relative ${msg.isOptimistic ? 'opacity-60 grayscale-[0.2]' : ''} mb-4`}
    >
      {!isMe && (
        <div className="relative shrink-0 self-end mb-4">
          <button onClick={() => setAvatarMenuOpen(!avatarMenuOpen)} className="active:scale-90 transition-transform relative">
            {activeChat.isAnon ? (
              <div className="size-8 rounded-full bg-[var(--pill-bg)] border border-custom flex items-center justify-center text-primary-gold"><Ghost size={14} /></div>
            ) : (
              <UserIdentity 
                user={{
                  id: msg.senderId,
                  username: msg.sender?.username || 'user',
                  fullName: msg.sender?.fullName,
                  avatar: msg.sender?.avatar,
                  subscriptionTier: msg.sender?.subscriptionTier || 'FREE',
                  accountType: msg.sender?.accountType || 'NORMAL',
                  isVerified: msg.sender?.isVerified
                } as any}
                size="sm"
                hideName
                isLink={false}
              />
            )}
          </button>
          
          <AnimatePresence>
            {avatarMenuOpen && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setAvatarMenuOpen(false)} />
                <motion.div 
                   initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }}
                   className="absolute bottom-10 left-0 w-40 card-surface border border-custom rounded-xl p-1 z-50 shadow-2xl overflow-hidden"
                >
                  <button className="w-full flex items-center gap-2.5 p-2 hover:bg-primary-gold/10 rounded-lg text-[9px] font-bold text-left transition-colors">
                    <User size={12} className="text-primary-gold" /> Profile
                  </button>
                  <button className="w-full flex items-center gap-2.5 p-2 hover:bg-primary-gold/10 rounded-lg text-[9px] font-bold text-left transition-colors">
                    <Eye size={12} className="text-primary-gold" /> Identity Image
                  </button>
                  <button className="w-full flex items-center gap-2.5 p-2 hover:bg-primary-gold/10 rounded-lg text-[9px] font-bold text-left transition-colors">
                    <Flame size={12} className="text-primary-gold" /> View Fire
                  </button>
                </motion.div>
              </>
            )}
          </AnimatePresence>
        </div>
      )}

      <div className={`flex flex-col gap-0 ${isMe ? 'items-end' : 'items-start'}`}>
        {/* Name for Premium Users or Group Members */}
        {(msg.sender?.subscriptionTier === 'PRO' || msg.sender?.subscriptionTier === 'PLUS' || activeChat.type === 'group' || (isMe && currentUser?.subscriptionTier !== 'FREE')) && (
           <UserIdentity 
             user={{
               id: isMe ? currentUser?.id : msg.senderId,
               username: isMe ? 'You' : (msg.sender?.username || 'user'),
               fullName: isMe ? 'You' : msg.sender?.fullName,
               subscriptionTier: msg.sender?.subscriptionTier || currentUser?.subscriptionTier || 'FREE',
               accountType: msg.sender?.accountType || currentUser?.accountType || 'NORMAL',
               isVerified: isMe ? currentUser?.isVerified : msg.sender?.isVerified
             } as any}
             size="xs"
             hideAvatar
             hideHandle
             isLink={false}
             className={isMe ? 'mr-1' : 'ml-1 mb-1'}
           />
        )}

        {/* Reply context - MORE PROMINENT FIX */}
        {msg.replyTo && (
          <div className={`rounded-xl px-4 py-2.5 text-[9px] mb-[-12px] pb-[16px] max-w-[280px] border-l-2 relative z-0 ${
            isMe 
              ? 'bg-page/40 border-l-black/20 mr-2 rounded-br-none shadow-sm' 
              : 'bg-primary-gold/10 border-l-primary-gold/40 ml-2 rounded-bl-none shadow-sm'
          }`}>
            <div className="flex items-center justify-between mb-1">
              <span className={`font-black uppercase tracking-[0.2em] text-[7px] flex items-center gap-1.5 ${isMe ? 'text-black/60' : 'text-primary-gold'}`}>
                <Reply size={8} />
                Replying to {msg.replyTo.sender?.fullName || msg.replyTo.senderName || 'Message'}
              </span>
            </div>
            <span className={`line-clamp-1 block font-bold text-[10px] italic opacity-60 text-main`}>
              "{msg.replyTo.content}"
            </span>
          </div>
        )}

        {/* Bubble */}
        <div className={`px-4 py-3 rounded-2xl flex flex-col relative z-10 shadow-xl transition-all ${
          isMe
            ? 'bg-primary-gold text-black rounded-br-sm'
            : 'card-surface rounded-bl-sm border border-custom backdrop-blur-xl'
        }`}>
          <AnimatePresence mode="wait">
            {isDeleting ? (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="flex items-center gap-2 py-1"
              >
                <Loader2 size={12} className="animate-spin text-current opacity-60" />
                <span className="text-[9px] font-black uppercase tracking-widest opacity-60">Removing...</span>
              </motion.div>
            ) : (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} key="content">
                {renderContent()}
              </motion.div>
            )}
          </AnimatePresence>
          
          {msg.reactions && msg.reactions.length > 0 && (
            <div className={`absolute -bottom-2 ${isMe ? 'right-0' : 'left-0'} flex items-center gap-0.5`}>
              {msg.reactions.map((r: any, i: number) => (
                <span key={i} className="text-[10px] bg-white dark:bg-[#111] rounded-full size-4 flex items-center justify-center shadow-sm border border-white/10">{r.emoji}</span>
              ))}
            </div>
          )}
        </div>

        <div className="flex items-center gap-1.5 px-2 mt-1">
            <span className={`text-[7px] font-bold ${isMe ? 'text-black/40' : 'text-muted-custom/40'}`}>{msgTime}</span>
            {msg.isOptimistic && <span className="text-[6px] font-black uppercase tracking-widest text-primary-gold animate-pulse italic">Sending...</span>}
            {msg.isEdited && <span className={`text-[6px] font-bold uppercase ${isMe ? 'text-black/40' : 'text-muted-custom/40'}`}>Modified</span>}
        </div>
      </div>

      <div className="relative opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1 self-center">
        <button onClick={() => setShowReactions(!showReactions)} className="p-1.5 text-muted-custom hover:text-primary-gold rounded-full hover:bg-primary-gold/10 transition-colors">
          <SmilePlus size={14} />
        </button>
        <button onClick={() => setMsgMenuOpen(msgMenuOpen ? null : msg.id)} className="p-1.5 text-muted-custom hover:text-primary-gold rounded-full hover:bg-primary-gold/10 transition-colors">
          <MoreVertical size={14} />
        </button>

        <AnimatePresence>
          {showReactions && (
            <>
              <div className="fixed inset-0 z-40" onClick={() => setShowReactions(false)} />
              <motion.div 
                initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.8 }}
                className="absolute bottom-10 right-0 flex items-center gap-1 bg-white dark:bg-[#1a1a1a] p-1 rounded-full shadow-2xl border border-white/10 z-50"
              >
                {reactions.map(emoji => (
                  <button key={emoji} className="size-7 flex items-center justify-center hover:bg-white/10 rounded-full transition-colors text-base active:scale-125">{emoji}</button>
                ))}
              </motion.div>
            </>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {msgMenuOpen && (
            <>
              <div className="fixed inset-0 z-40" onClick={() => setMsgMenuOpen(null)} />
              <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
                className={`absolute top-10 ${isMe ? 'right-0' : 'left-0'} w-36 card-surface border border-custom rounded-xl p-1 z-50 shadow-2xl`}
              >
                <button onClick={() => { setReplyingTo(msg); setMsgMenuOpen(null); }}
                  className="w-full flex items-center gap-2 p-2 hover:bg-primary-gold/10 rounded-lg text-[9px] font-bold text-left transition-colors">
                  <Reply size={12} /> Reply
                </button>
                
                {canEdit && (
                  <button onClick={() => setIsEditing(true)}
                    className="w-full flex items-center gap-2 p-2 hover:bg-primary-gold/10 rounded-lg text-[9px] font-bold text-left transition-colors">
                    <Edit2 size={12} /> Edit
                  </button>
                )}

                <button onClick={() => deleteMessage(msg.id, 'ME')}
                  className="w-full flex items-center gap-2 p-2 hover:bg-red-500/10 text-red-400 rounded-lg text-[9px] font-bold text-left transition-colors">
                  <Trash2 size={12} /> Delete for me
                </button>

                {canDeleteForEveryone && (
                  <button onClick={() => deleteMessage(msg.id, 'EVERYONE')}
                    className="w-full flex items-center gap-2 p-2 hover:bg-red-500/10 text-red-400 rounded-lg text-[9px] font-bold text-left transition-colors">
                    <Trash2 size={12} /> Delete for everyone
                  </button>
                )}

                {currentUser?.subscriptionTier !== 'FREE' && (
                  <div className="mt-1 px-2 py-1 border-t border-white/5">
                    <p className="text-[7px] font-bold text-primary-gold/40 uppercase tracking-widest">Premium: Silent Deletion Coming Soon</p>
                  </div>
                )}
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}

/**
 * SmartLinkRenderer - Detects internal and external links and renders high-fidelity cards.
 */
function SmartLinkRenderer({ content }: { content: string }) {
  const urlRegex = /(https?:\/\/[^\s]+)/g;
  const urls = content.match(urlRegex) || [];
  const textWithoutUrls = content.replace(urlRegex, '').trim();

  // Mock settings for privacy
  const disableLinkPreviews = false; 

  const renderLinkCard = (url: string) => {
    try {
      const parsedUrl = new URL(url);
      const isInternal = parsedUrl.hostname === window.location.hostname || parsedUrl.hostname === 'localhost';
      const path = parsedUrl.pathname;
      if (isInternal) {
        // Internal Link Dispatcher - Support both short and long paths
        const isPost = path.startsWith('/p/') || path.startsWith('/post/');
        const isProfile = path.startsWith('/u/') || path.startsWith('/profile/');

        const isMarket = path.startsWith('/m/') || path.startsWith('/market/');
        const isKao = path.startsWith('/k/') || path.startsWith('/kao/');
        const isRoommate = path.startsWith('/r/') || path.startsWith('/roommate/');

        if (isProfile) return <InternalCard icon={<User size={12} />} title="Profile" subtitle={path.split('/').pop() || 'User'} />;
        if (isPost) return <InternalCard icon={<FileText size={12} />} title="Shared Post" subtitle="View details" />;

        if (isMarket) return <InternalCard icon={<ShoppingCart size={12} />} title="Marketplace" subtitle="Trade listing" />;
        if (isKao) return <InternalCard icon={<Home size={12} />} title="Kao Listing" subtitle="Accommodation" />;
        if (isRoommate) return <InternalCard icon={<Users size={12} />} title="Roommate Req" subtitle="Co-living" />;
      }

      if (disableLinkPreviews) return null;

      // External Preview - Also make this prettier
      return (
        <a href={url} target="_blank" rel="noopener noreferrer" className="block mt-3 rounded-lg overflow-hidden border border-white/5 bg-black/40 backdrop-blur-md hover:border-primary-gold/30 hover:bg-black/60 transition-all group/link">
          <div className="flex items-center gap-3 p-2.5">
            <div className="size-10 rounded bg-white/5 flex items-center justify-center shrink-0 group-hover/link:bg-primary-gold/10 transition-colors border border-white/5">
              <ExternalLink size={16} className="text-muted-custom group-hover/link:text-primary-gold" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[9px] font-black text-white/90 uppercase tracking-widest truncate">{parsedUrl.hostname}</p>
              <p className="text-[8px] font-bold text-muted-custom/40 truncate mt-0.5">External link</p>
            </div>
          </div>
        </a>
      );
    } catch (e) {
      return null;
    }
  };

  return (
    <div className="flex flex-col">
      {textWithoutUrls && <span className="text-[11px] font-bold leading-relaxed">{textWithoutUrls}</span>}
      {urls.map((url, idx) => (
        <React.Fragment key={idx}>
          {idx === 0 && textWithoutUrls && <div className="h-2" />}
          {renderLinkCard(url)}
        </React.Fragment>
      ))}
    </div>
  );
}

function InternalCard({ icon, title, subtitle, author }: { icon: React.ReactNode, title: string, subtitle: string, author?: any }) {
  return (
    <div className="mt-2 rounded-lg border border-white/10 bg-black/20 p-3 flex items-center gap-3 hover:border-primary-gold/30 hover:bg-black/40 transition-all cursor-pointer group/internal relative overflow-hidden">
      <div className="size-9 rounded-md bg-white/5 flex items-center justify-center shrink-0 border border-white/5 group-hover/internal:bg-primary-gold/10 transition-all">
        <div className="text-primary-gold/70 group-hover/internal:text-primary-gold transition-colors">{icon}</div>
      </div>
      
      <div className="flex-1 min-w-0 relative z-10 flex flex-col justify-center">
        {author ? (
          <UserIdentity user={author} size="xs" hideAvatar className="mb-0.5" />
        ) : (
          <p className="text-[9px] font-black text-primary-gold/60 uppercase tracking-widest">{title}</p>
        )}
        <p className="text-[10px] font-bold text-white/90 truncate">{subtitle}</p>
      </div>
      
      <div className="size-6 rounded flex items-center justify-center bg-white/5 group-hover/internal:bg-primary-gold group-hover/internal:text-black transition-all">
        <ArrowRight size={12} />
      </div>
    </div>
  );
}
