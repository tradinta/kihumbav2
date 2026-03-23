'use client';

import React, { useRef, useEffect, useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Phone, Video, Info, Ghost, Fingerprint, Lock, Eye, Save,
  Paperclip, Mic, Send, MoreVertical, Reply, Trash2,
  ImagePlay, BarChart2, Headphones, User as UserIcon,
  FileText, Image as ImageIcon, X, ShieldCheck,
  Heart, MessageCircle, ArrowUpRight, MapPin, Store, ShoppingBag
} from 'lucide-react';
import type { Chat, Message, ChatUser } from '@/data/chatData';

interface ChatAreaProps {
  currentUser: ChatUser;
  activeChat: Chat;
  messages: Message[];
  msgInput: string;
  setMsgInput: (val: string) => void;
  handleSendMessage: (type?: string, content?: string, extra?: Record<string, any>) => void;
  sendMockAttachment: (type: string) => void;
  attachmentMenuOpen: boolean;
  setAttachmentMenuOpen: (open: boolean) => void;
  replyingTo: Message | null;
  setReplyingTo: (msg: Message | null) => void;
  msgMenuOpen: number | null;
  setMsgMenuOpen: (id: number | null) => void;
  deleteMessage: (id: number) => void;
}

// ─── Verified badge helper ───────────────────────────────────────────────────
const VerifiedBadge = ({ size = 10 }: { size?: number }) => (
  <span className="inline-flex items-center justify-center size-3.5 bg-primary-gold rounded-full shrink-0">
    <ShieldCheck size={size} className="text-black" />
  </span>
);

export default function ChatArea({
  currentUser, activeChat, messages, msgInput, setMsgInput,
  handleSendMessage, sendMockAttachment,
  attachmentMenuOpen, setAttachmentMenuOpen,
  replyingTo, setReplyingTo, msgMenuOpen, setMsgMenuOpen,
  deleteMessage,
}: ChatAreaProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [votedPoll, setVotedPoll] = useState<number | null>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const isGroup = activeChat.type === 'group';

  // ─── Render message content by type ────────────────────────────────────────
  const renderMessageContent = (msg: Message, isMe: boolean) => {
    switch (msg.type) {

      // ── Embedded Kihumba Post ──
      case 'embedded_post': {
        const post = msg.embeddedPost!;
        return (
          <div className={`rounded-lg overflow-hidden border border-custom min-w-[220px] max-w-[280px] my-1 ${isMe ? 'bg-black/10' : 'bg-[var(--pill-bg)]'}`}>
            <div className="px-3 py-2 flex items-center gap-2 border-b border-custom">
              <div className="size-2 rounded-full bg-primary-gold" />
              <span className="text-[8px] font-bold uppercase tracking-widest text-primary-gold">Kihumba Post</span>
            </div>
            <div className="p-2.5">
              <div className="flex items-center gap-2 mb-2">
                <img src={post.authorAvatar} className="size-6 rounded-full object-cover" alt="" />
                <span className={`text-[9px] font-bold ${isMe ? 'text-black' : ''}`}>{post.author}</span>
              </div>
              <p className={`text-[10px] font-bold leading-relaxed mb-2 ${isMe ? 'text-black/80' : 'text-muted-custom'}`}>{post.content}</p>
              {post.image && <img src={post.image} className="w-full h-28 object-cover rounded mb-2" alt="" />}
              <div className="flex items-center gap-3 text-[8px] font-bold">
                <span className={`flex items-center gap-1 ${isMe ? 'text-black/60' : 'text-muted-custom'}`}><Heart size={9} /> {post.likes}</span>
                <span className={`flex items-center gap-1 ${isMe ? 'text-black/60' : 'text-muted-custom'}`}><MessageCircle size={9} /> {post.comments}</span>
              </div>
            </div>
          </div>
        );
      }

      // ── Embedded Marketplace Listing ──
      case 'embedded_market': {
        const listing = msg.embeddedMarket!;
        return (
          <Link href={`/marketplace/${listing.id}`}>
            <div className={`rounded-lg overflow-hidden border border-custom min-w-[220px] max-w-[280px] my-1 cursor-pointer hover:border-primary-gold/30 transition-all ${isMe ? 'bg-black/10' : 'bg-[var(--pill-bg)]'}`}>
              <div className="px-3 py-2 flex items-center gap-2 border-b border-custom">
                <ShoppingBag size={10} className="text-primary-gold" />
                <span className="text-[8px] font-bold uppercase tracking-widest text-primary-gold">Marketplace</span>
                <ArrowUpRight size={8} className="text-primary-gold ml-auto" />
              </div>
              <div className="flex gap-2 p-2.5">
                <img src={listing.image} className="size-16 rounded object-cover shrink-0" alt="" />
                <div className="flex-1 min-w-0">
                  <h4 className={`text-[10px] font-bold truncate mb-0.5 ${isMe ? 'text-black' : ''}`}>{listing.title}</h4>
                  <span className={`text-[9px] font-bold ${isMe ? 'text-black' : 'text-primary-gold'}`}>KES {listing.price.toLocaleString()}</span>
                  <div className="flex items-center gap-1 mt-1">
                    <span className={`text-[8px] ${isMe ? 'text-black/60' : 'text-muted-custom'}`}>{listing.seller}</span>
                    {listing.isVerified && <VerifiedBadge size={7} />}
                  </div>
                  <span className={`text-[7px] ${isMe ? 'text-black/50' : 'text-muted-custom/60'}`}>{listing.condition}</span>
                </div>
              </div>
            </div>
          </Link>
        );
      }

      // ── Embedded Kao Listing ──
      case 'embedded_kao': {
        const kao = msg.embeddedKao!;
        return (
          <Link href={`/kao/${kao.id}`}>
            <div className={`rounded-lg overflow-hidden border border-custom min-w-[220px] max-w-[280px] my-1 cursor-pointer hover:border-primary-gold/30 transition-all ${isMe ? 'bg-black/10' : 'bg-[var(--pill-bg)]'}`}>
              <div className="px-3 py-2 flex items-center gap-2 border-b border-custom">
                <Store size={10} className="text-primary-gold" />
                <span className="text-[8px] font-bold uppercase tracking-widest text-primary-gold">Kao Listing</span>
                <ArrowUpRight size={8} className="text-primary-gold ml-auto" />
              </div>
              <img src={kao.image} className="w-full h-28 object-cover" alt="" />
              <div className="p-2.5">
                <h4 className={`text-[10px] font-bold mb-0.5 ${isMe ? 'text-black' : ''}`}>{kao.title}</h4>
                <span className={`text-[9px] font-bold ${isMe ? 'text-black' : 'text-primary-gold'}`}>KES {kao.price.toLocaleString()}/mo</span>
                <div className="flex items-center gap-1 mt-1">
                  <MapPin size={8} className={isMe ? 'text-black/50' : 'text-primary-gold/50'} />
                  <span className={`text-[8px] ${isMe ? 'text-black/60' : 'text-muted-custom'}`}>{kao.area}, {kao.county}</span>
                  <span className={`text-[7px] ml-auto ${isMe ? 'text-black/50' : 'text-muted-custom/60'}`}>{kao.bedrooms}</span>
                </div>
              </div>
            </div>
          </Link>
        );
      }

      // ── Poll ──
      case 'poll': {
        const poll = msg.pollData!;
        return (
          <div className={`min-w-[240px] max-w-[300px] my-1 ${isMe ? '' : ''}`}>
            <div className="flex items-center gap-1.5 mb-2">
              <BarChart2 size={10} className={isMe ? 'text-black/60' : 'text-primary-gold'} />
              <span className={`text-[8px] font-bold uppercase tracking-widest ${isMe ? 'text-black/60' : 'text-primary-gold'}`}>Poll</span>
            </div>
            <p className={`text-[11px] font-bold mb-2 ${isMe ? 'text-black' : ''}`}>{poll.question}</p>
            <div className="space-y-1.5">
              {poll.options.map((opt, i) => {
                const pct = Math.round((opt.votes / poll.totalVotes) * 100);
                const isVoted = votedPoll === i;
                return (
                  <button key={i} onClick={(e) => { e.stopPropagation(); setVotedPoll(i); }}
                    className={`w-full rounded overflow-hidden relative transition-all text-left ${
                      isMe
                        ? 'bg-black/10 hover:bg-black/20'
                        : 'bg-[var(--pill-bg)] hover:bg-primary-gold/5 border border-custom'
                    } ${isVoted ? (isMe ? 'ring-1 ring-black/30' : 'ring-1 ring-primary-gold/30') : ''}`}
                  >
                    {/* Vote bar */}
                    <div
                      className={`absolute inset-y-0 left-0 transition-all duration-500 ${isMe ? 'bg-black/10' : 'bg-primary-gold/10'}`}
                      style={{ width: `${pct}%` }}
                    />
                    <div className="relative flex items-center justify-between px-2.5 py-2">
                      <span className={`text-[10px] font-bold ${isMe ? 'text-black' : ''}`}>{opt.label}</span>
                      <span className={`text-[9px] font-bold ${isMe ? 'text-black/60' : 'text-primary-gold'}`}>{pct}%</span>
                    </div>
                  </button>
                );
              })}
            </div>
            <span className={`text-[8px] font-bold mt-1.5 block ${isMe ? 'text-black/50' : 'text-muted-custom'}`}>{poll.totalVotes} votes</span>
          </div>
        );
      }

      // ── Image ──
      case 'image':
        return <img src={msg.mediaUrl} className="rounded-lg w-52 max-w-full my-1 object-cover border border-custom" alt="" />;

      // ── Video ──
      case 'video':
        return <div className="relative w-52 h-32 rounded-lg my-1 flex items-center justify-center card-surface border border-custom"><ImagePlay className="w-8 h-8 text-primary-gold/50" /></div>;

      // ── Audio ──
      case 'audio':
        return (
          <div className={`flex items-center gap-2 p-2 rounded-lg min-w-[140px] my-1 ${isMe ? 'bg-black/10' : 'bg-[var(--pill-bg)]'}`}>
            <div className="size-7 rounded-full bg-primary-gold/10 flex items-center justify-center"><Headphones size={14} className="text-primary-gold" /></div>
            <span className={`text-[10px] font-bold ${isMe ? 'text-black' : ''}`}>Audio (0:12)</span>
          </div>
        );

      // ── Contact ──
      case 'contact':
        return (
          <div className={`flex items-center gap-2 p-2.5 rounded-lg my-1 ${isMe ? 'bg-black/10' : 'bg-[var(--pill-bg)]'}`}>
            <div className="size-8 rounded-full bg-primary-gold/10 flex items-center justify-center"><UserIcon size={14} className="text-primary-gold" /></div>
            <div>
              <p className={`text-[10px] font-bold ${isMe ? 'text-black' : ''}`}>{msg.contactName}</p>
              <p className={`text-[8px] ${isMe ? 'text-black/50' : 'text-muted-custom'}`}>View Contact</p>
            </div>
          </div>
        );

      // ── Shared Post ──
      case 'post':
        return (
          <div className={`flex flex-col gap-1.5 p-2.5 rounded-lg min-w-[180px] border border-custom my-1 ${isMe ? 'bg-black/10' : 'bg-[var(--pill-bg)]'}`}>
            <div className="w-full h-20 bg-gradient-to-tr from-primary-gold/10 to-accent-gold/5 rounded" />
            <span className={`text-[10px] font-bold ${isMe ? 'text-black' : ''}`}>{msg.postTitle}</span>
            <span className={`text-[8px] ${isMe ? 'text-black/50' : 'text-muted-custom'}`}>Post from Kihumba</span>
          </div>
        );

      // ── Default text ──
      default:
        return <span className="text-[11px] font-bold leading-relaxed">{msg.text}</span>;
    }
  };

  // ─── Reply preview text ────────────────────────────────────────────────────
  const getReplyPreview = (replyMsg: Message) => {
    if (replyMsg.type === 'embedded_post') return '📄 Kihumba Post';
    if (replyMsg.type === 'embedded_market') return '🛒 Marketplace Listing';
    if (replyMsg.type === 'embedded_kao') return '🏠 Kao Listing';
    if (replyMsg.type === 'poll') return '📊 Poll';
    if (replyMsg.type === 'image') return '📸 Image';
    if (replyMsg.type === 'video') return '🎬 Video';
    return replyMsg.text;
  };

  return (
    <div className="flex-1 card-surface rounded-lg flex flex-col overflow-hidden relative select-none">
      {/* ─── Header ─── */}
      <div className="h-14 border-b border-custom px-5 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3">
          <div className="relative">
            {activeChat.isAnon ? (
              <div className="size-8 rounded-full bg-[var(--pill-bg)] border border-custom flex items-center justify-center text-primary-gold"><Ghost size={14} /></div>
            ) : (
              <img src={activeChat.avatar || ''} className="size-8 rounded-full object-cover border border-custom" alt="" />
            )}
            {activeChat.isPremium && !activeChat.isAnon && activeChat.type !== 'group' && (
              <div className="absolute -bottom-0.5 -right-0.5"><VerifiedBadge /></div>
            )}
          </div>
          <div>
            <h3 className={`text-[11px] font-bold uppercase tracking-widest ${activeChat.isAnon ? 'italic text-primary-gold' : ''}`}>
              {activeChat.name}
            </h3>
            <p className="text-[8px] font-bold text-muted-custom flex items-center gap-1">
              {activeChat.isAnon ? (
                <><Fingerprint size={8} /> Identity hidden</>
              ) : activeChat.type === 'group' ? (
                <>{activeChat.members} members</>
              ) : (
                <><span className="size-1.5 bg-primary-gold rounded-full" /> Active now</>
              )}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1">
          {activeChat.isAnon ? (
            <div className="flex items-center gap-1.5">
              <button className="h-6 px-2.5 card-surface rounded text-[8px] font-bold uppercase tracking-widest text-primary-gold hover:bg-primary-gold/10 transition-all flex items-center gap-1">
                <Eye size={10} /> Reveal
              </button>
              <button className="h-6 px-2.5 card-surface rounded text-[8px] font-bold uppercase tracking-widest text-primary-gold hover:bg-primary-gold/10 transition-all flex items-center gap-1">
                <Save size={10} /> Save
              </button>
            </div>
          ) : (
            <>
              <button className="size-7 card-surface rounded flex items-center justify-center text-muted-custom hover:text-primary-gold transition-colors"><Phone size={12} /></button>
              <button className="size-7 card-surface rounded flex items-center justify-center text-muted-custom hover:text-primary-gold transition-colors"><Video size={12} /></button>
              <button className="size-7 card-surface rounded flex items-center justify-center text-muted-custom hover:text-primary-gold transition-colors"><Info size={12} /></button>
            </>
          )}
        </div>
      </div>

      {/* ─── Encryption Notice ─── */}
      <div className="flex justify-center py-3">
        <span className="card-surface rounded px-3 py-1 text-[8px] font-bold uppercase tracking-widest text-muted-custom flex items-center gap-1.5">
          <Lock size={8} className="text-primary-gold/50" /> End-to-end encrypted
        </span>
      </div>

      {/* ─── Messages ─── */}
      <div className="flex-1 overflow-y-auto px-5 pb-4 flex flex-col gap-3 no-scrollbar">
        {messages.map((msg, idx) => {
          const isMe = msg.senderId === currentUser.id;

          // Group: show sender info
          const showSenderName = isGroup && !isMe && (
            idx === 0 || messages[idx - 1].senderId !== msg.senderId
          );

          return (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.03 }}
              className={`flex max-w-[80%] ${isMe ? 'self-end flex-row-reverse' : 'self-start'} gap-2 group relative`}
            >
              {/* Avatar for group messages */}
              {isGroup && !isMe && (
                <div className="shrink-0 self-end">
                  {showSenderName ? (
                    <img src={msg.senderAvatar || ''} className="size-6 rounded-full object-cover" alt="" />
                  ) : (
                    <div className="size-6" /> // spacer for alignment
                  )}
                </div>
              )}

              <div className={`flex flex-col gap-0.5 ${isMe ? 'items-end' : 'items-start'}`}>
                {/* Sender name + verified badge (groups only) */}
                {showSenderName && (
                  <div className="flex items-center gap-1 px-1 mb-0.5">
                    <span className="text-[8px] font-bold uppercase tracking-widest text-primary-gold">{msg.senderName}</span>
                    {msg.senderVerified && <VerifiedBadge size={7} />}
                  </div>
                )}

                {/* Reply context */}
                {msg.replyTo && (
                  <div className={`rounded px-2.5 py-1.5 text-[9px] mb-1 max-w-[240px] border-l-2 ${
                    isMe ? 'bg-black/10 border-l-black/30' : 'bg-primary-gold/5 border-l-primary-gold/30'
                  }`}>
                    <span className={`font-bold block text-[8px] mb-0.5 ${isMe ? 'text-black/60' : 'text-primary-gold'}`}>
                      <Reply size={8} className="inline mr-0.5" />
                      {msg.replyTo.senderId === currentUser.id ? 'You' : (msg.replyTo.senderName || activeChat.name)}
                    </span>
                    <span className={`truncate block ${isMe ? 'text-black/50' : 'text-muted-custom'}`}>
                      {getReplyPreview(msg.replyTo)}
                    </span>
                  </div>
                )}

                {/* Bubble */}
                <div className={`px-3.5 py-2.5 rounded-xl flex flex-col ${
                  isMe
                    ? 'bg-primary-gold text-black rounded-br-sm'
                    : 'card-surface rounded-bl-sm border border-custom'
                }`}>
                  {renderMessageContent(msg, isMe)}
                </div>
                <span className={`text-[7px] font-bold px-1 ${isMe ? 'text-primary-gold/50' : 'text-muted-custom/50'}`}>{msg.time}</span>
              </div>

              {/* Message actions (hover) */}
              <div className="relative opacity-0 group-hover:opacity-100 transition-opacity flex items-center">
                <button onClick={() => setMsgMenuOpen(msgMenuOpen === msg.id ? null : msg.id)} className="p-1 text-muted-custom hover:text-primary-gold rounded hover:bg-primary-gold/10 transition-colors">
                  <MoreVertical size={12} />
                </button>
                <AnimatePresence>
                  {msgMenuOpen === msg.id && (
                    <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
                      className={`absolute top-7 ${isMe ? 'right-0' : 'left-0'} w-28 card-surface border border-custom rounded-lg p-1 z-20 shadow-lg`}
                    >
                      <button onClick={() => { setReplyingTo(msg); setMsgMenuOpen(null); }}
                        className="w-full flex items-center gap-2 p-1.5 hover:bg-primary-gold/10 rounded text-[9px] font-bold text-left transition-colors">
                        <Reply size={10} /> Reply
                      </button>
                      {(isMe || activeChat.type === 'group') && (
                        <button onClick={() => deleteMessage(msg.id)}
                          className="w-full flex items-center gap-2 p-1.5 hover:bg-red-500/10 text-red-400 rounded text-[9px] font-bold text-left transition-colors">
                          <Trash2 size={10} /> Delete
                        </button>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      {/* ─── Input Bar ─── */}
      <div className="p-3 border-t border-custom flex flex-col gap-2 relative">
        {/* Reply bar */}
        <AnimatePresence>
          {replyingTo && (
            <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 8 }}
              className="card-surface rounded-lg p-2.5 flex items-center justify-between mx-1"
            >
              <div className="flex flex-col">
                <span className="text-[8px] font-bold uppercase tracking-widest text-primary-gold flex items-center gap-1"><Reply size={8} /> Replying</span>
                <span className="text-[9px] text-muted-custom truncate max-w-[200px]">{getReplyPreview(replyingTo)}</span>
              </div>
              <button onClick={() => setReplyingTo(null)} className="size-5 rounded flex items-center justify-center hover:bg-primary-gold/10 text-muted-custom hover:text-primary-gold transition-colors">
                <X size={12} />
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Attachment menu */}
        <AnimatePresence>
          {attachmentMenuOpen && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }}
              className="absolute bottom-16 left-3 card-surface rounded-lg p-1.5 flex flex-col gap-0.5 shadow-lg z-20 w-36"
            >
              {[
                { type: 'image', icon: ImageIcon, label: 'Image', color: 'text-blue-400' },
                { type: 'video', icon: ImagePlay, label: 'Video', color: 'text-purple-400' },
                { type: 'audio', icon: Headphones, label: 'Audio', color: 'text-pink-400' },
                { type: 'poll', icon: BarChart2, label: 'Poll', color: 'text-green-400' },
                { type: 'contact', icon: UserIcon, label: 'Contact', color: 'text-orange-400' },
                { type: 'post', icon: FileText, label: 'Kihumba Post', color: 'text-primary-gold' },
              ].map(item => (
                <button key={item.type} onClick={() => sendMockAttachment(item.type)}
                  className="w-full flex items-center gap-2.5 p-2 hover:bg-primary-gold/10 rounded text-[9px] font-bold text-left transition-colors"
                >
                  <item.icon size={12} className={item.color} /> {item.label}
                </button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Input row */}
        <div className="flex items-center gap-2 card-surface rounded-lg px-2 py-1.5">
          <button onClick={() => setAttachmentMenuOpen(!attachmentMenuOpen)}
            className={`p-1.5 rounded hover:bg-primary-gold/10 transition-colors ${attachmentMenuOpen ? 'text-primary-gold' : 'text-muted-custom hover:text-primary-gold'}`}
          >
            <Paperclip size={14} />
          </button>
          <input
            type="text"
            placeholder={activeChat.isAnon ? "Send an anonymous message…" : "Type a message…"}
            className="flex-1 bg-transparent outline-none text-[10px] font-bold placeholder:text-muted-custom/50"
            value={msgInput}
            onChange={(e) => setMsgInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
          />
          <button className="p-1.5 rounded hover:bg-primary-gold/10 text-muted-custom hover:text-primary-gold transition-colors">
            <Mic size={14} />
          </button>
          <button onClick={() => handleSendMessage()}
            className="p-1.5 bg-primary-gold text-black rounded hover:brightness-110 transition-all active:scale-90"
          >
            <Send size={12} />
          </button>
        </div>
      </div>
    </div>
  );
}
