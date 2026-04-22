import React, { useRef, useState } from 'react';
import { Paperclip, Mic, Send, X, Reply, Maximize2, Minimize2, Anchor, Layout, BarChart2, Image as ImageIcon, FileText, Plus } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { UI_LABELS } from '@/lib/constants';

interface ChatInputProps {
  msgInput: string;
  setMsgInput: (val: string) => void;
  handleSendMessage: (type?: string, content?: string, extra?: Record<string, any>) => void;
  handleFileSelect: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleTyping: (isTyping: boolean) => void;
  replyingTo: any | null;
  setReplyingTo: (msg: any | null) => void;
  isAnon?: boolean;
}

type InputState = 'NORMAL' | 'PILL' | 'DOCKED';

export default function ChatInput({
  msgInput, setMsgInput,
  handleSendMessage,
  handleFileSelect,
  handleTyping,
  replyingTo, setReplyingTo,
  isAnon
}: ChatInputProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const [inputState, setInputState] = useState<InputState>('NORMAL');
  const [showAttachMenu, setShowAttachMenu] = useState(false);
  const [showPollCreator, setShowPollCreator] = useState(false);
  const [pollData, setPollData] = useState({
    question: '',
    options: ['', ''],
    isQuiz: false,
    multipleVotes: false,
    expiresIn: '24h'
  });

  const onInputChange = (val: string) => {
    setMsgInput(val);
    handleTyping(true);
    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    typingTimeoutRef.current = setTimeout(() => {
      handleTyping(false);
    }, 3000);
  };

  const handleSendPoll = () => {
    if (!pollData.question.trim() || pollData.options.some(o => !o.trim())) return;
    handleSendMessage('POLL', pollData.question, {
      options: pollData.options.map(o => ({ text: o, votes: 0 })),
      isQuiz: pollData.isQuiz,
      multipleVotes: pollData.multipleVotes,
      expiresAt: new Date(Date.now() + (pollData.expiresIn === '24h' ? 86400000 : 3600000)).toISOString()
    });
    setShowPollCreator(false);
    setPollData({ question: '', options: ['', ''], isQuiz: false, multipleVotes: false, expiresIn: '24h' });
  };

  const getReplyPreview = (replyMsg: any) => {
    if (replyMsg.type === 'POST') return '📄 Kihumba Post';
    if (replyMsg.type === 'MARKET') return '🛒 Marketplace Listing';
    if (replyMsg.type === 'KAO') return '🏠 Kao Listing';
    if (replyMsg.type === 'POLL') return '📊 Poll';
    if (replyMsg.type === 'IMAGE') return '📸 Image';
    if (replyMsg.type === 'VIDEO') return '🎬 Video';
    if (replyMsg.type === 'FILE') return `📁 ${replyMsg.metadata?.fileName || 'File'}`;
    return replyMsg.content;
  };

  const containerVariants = {
    NORMAL: { width: '100%', height: 'auto', borderRadius: '16px', x: 0, bottom: '12px' },
    PILL: { width: '320px', height: '48px', borderRadius: '24px', x: 0, bottom: '20px' },
    DOCKED: { width: '48px', height: '48px', borderRadius: '12px', x: 20, bottom: '20px' },
  };

  return (
    <div className="relative w-full px-4 flex flex-col items-center">
      {/* Poll Creator Overlay */}
      <AnimatePresence>
        {showPollCreator && (
          <motion.div 
            initial={{ opacity: 0, y: 20, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="w-full max-w-lg mb-4 card-surface border border-primary-gold/30 rounded-2xl p-5 shadow-2xl backdrop-blur-2xl z-50"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-primary-gold">{UI_LABELS.POLL.CREATE}</h3>
              <button onClick={() => setShowPollCreator(false)} className="size-8 rounded-lg flex items-center justify-center hover:bg-white/5 transition-colors"><X size={16} /></button>
            </div>

            <div className="flex flex-col gap-4">
              <div className="space-y-1.5">
                <label className="text-[8px] font-black uppercase tracking-widest text-muted-custom ml-1">{UI_LABELS.POLL.QUESTION}</label>
                <input 
                  type="text" placeholder="What is your question?"
                  className="w-full bg-black/20 border border-white/5 rounded-xl px-4 py-3 text-[11px] font-bold outline-none focus:border-primary-gold/50 transition-colors"
                  value={pollData.question}
                  onChange={e => setPollData({ ...pollData, question: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <label className="text-[8px] font-black uppercase tracking-widest text-muted-custom ml-1">{UI_LABELS.POLL.OPTIONS}</label>
                {pollData.options.map((opt, i) => (
                  <div key={i} className="flex gap-2">
                    <input 
                      type="text" placeholder={`Option ${i + 1}`}
                      className="flex-1 bg-black/20 border border-white/5 rounded-xl px-4 py-2.5 text-[11px] font-bold outline-none focus:border-primary-gold/50 transition-colors"
                      value={opt}
                      onChange={e => {
                        const newOpts = [...pollData.options];
                        newOpts[i] = e.target.value;
                        setPollData({ ...pollData, options: newOpts });
                      }}
                    />
                    {pollData.options.length > 2 && (
                      <button onClick={() => setPollData({ ...pollData, options: pollData.options.filter((_, idx) => idx !== i) })}
                        className="p-2 text-red-400 hover:bg-red-400/10 rounded-lg transition-colors"><X size={14} /></button>
                    )}
                  </div>
                ))}
                {pollData.options.length < 5 && (
                  <button onClick={() => setPollData({ ...pollData, options: [...pollData.options, ''] })}
                    className="w-full py-2.5 border border-dashed border-white/10 rounded-xl text-[9px] font-black uppercase tracking-widest text-muted-custom hover:text-primary-gold hover:border-primary-gold/30 transition-all">
                    + Add Option
                  </button>
                )}
              </div>

              <div className="grid grid-cols-2 gap-3 pt-2">
                <button onClick={() => setPollData({ ...pollData, isQuiz: !pollData.isQuiz })}
                  className={`flex items-center justify-between p-3 rounded-xl border transition-all ${pollData.isQuiz ? 'bg-primary-gold/10 border-primary-gold text-primary-gold' : 'bg-black/20 border-white/5 text-muted-custom'}`}>
                  <span className="text-[9px] font-black uppercase tracking-widest">{UI_LABELS.POLL.QUIZ_MODE}</span>
                  <div className={`size-4 rounded-full border-2 flex items-center justify-center ${pollData.isQuiz ? 'border-primary-gold' : 'border-white/20'}`}>
                    {pollData.isQuiz && <div className="size-2 bg-primary-gold rounded-full" />}
                  </div>
                </button>
                <button onClick={() => setPollData({ ...pollData, multipleVotes: !pollData.multipleVotes })}
                  className={`flex items-center justify-between p-3 rounded-xl border transition-all ${pollData.multipleVotes ? 'bg-primary-gold/10 border-primary-gold text-primary-gold' : 'bg-black/20 border-white/5 text-muted-custom'}`}>
                  <span className="text-[9px] font-black uppercase tracking-widest">{UI_LABELS.POLL.MULTI_VOTE}</span>
                  <div className={`size-4 rounded-full border-2 flex items-center justify-center ${pollData.multipleVotes ? 'border-primary-gold' : 'border-white/20'}`}>
                    {pollData.multipleVotes && <div className="size-2 bg-primary-gold rounded-full" />}
                  </div>
                </button>
              </div>

              <button onClick={handleSendPoll}
                className="w-full py-4 bg-primary-gold text-black rounded-xl text-[10px] font-black uppercase tracking-[0.3em] hover:brightness-110 shadow-lg shadow-primary-gold/20 transition-all active:scale-95 mt-2">
                {UI_LABELS.POLL.LAUNCH}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Reply bar - Always above the input */}
      <AnimatePresence>
        {replyingTo && inputState !== 'DOCKED' && !showPollCreator && (
          <motion.div 
            initial={{ opacity: 0, y: 10, scale: 0.95 }} 
            animate={{ opacity: 1, y: 0, scale: 1 }} 
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            className="w-full max-w-2xl mb-2 card-surface rounded-xl p-3 flex items-center justify-between border border-primary-gold/20 shadow-2xl backdrop-blur-md"
          >
            <div className="flex flex-col">
              <span className="text-[8px] font-black uppercase tracking-[0.2em] text-primary-gold flex items-center gap-1.5">
                <Reply size={10} /> Replying to {replyingTo.senderName || 'Message'}
              </span>
              <span className="text-[10px] text-main font-bold truncate max-w-[240px] mt-0.5">{getReplyPreview(replyingTo)}</span>
            </div>
            <button onClick={() => setReplyingTo(null)} className="size-6 rounded-lg flex items-center justify-center hover:bg-primary-gold/10 text-muted-custom hover:text-primary-gold transition-all">
              <X size={14} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div
        variants={containerVariants}
        animate={inputState}
        transition={{ type: 'spring', damping: 20, stiffness: 150 }}
        className="relative max-w-3xl card-surface border border-white/5 bg-black/40 backdrop-blur-xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] flex items-center p-1.5"
      >
        <AnimatePresence mode="wait">
          {inputState === 'DOCKED' ? (
            <motion.button
              key="docked-btn"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setInputState('NORMAL')}
              className="size-full flex items-center justify-center text-primary-gold hover:bg-primary-gold/10 transition-colors"
            >
              <Layout size={20} />
            </motion.button>
          ) : (
            <motion.div 
              key="full-input"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="flex items-center gap-2 w-full"
            >
              <input type="file" ref={fileInputRef} onChange={handleFileSelect} className="hidden" multiple />
              
              <div className="relative">
                <button 
                  onClick={() => setShowAttachMenu(!showAttachMenu)}
                  className={`p-2.5 rounded-xl transition-all active:scale-95 ${showAttachMenu ? 'bg-primary-gold text-black' : 'text-muted-custom hover:text-primary-gold hover:bg-primary-gold/10'}`}
                >
                  <Plus size={20} className={showAttachMenu ? 'rotate-45 transition-transform' : 'transition-transform'} />
                </button>

                {/* Attachment Menu */}
                <AnimatePresence>
                  {showAttachMenu && (
                    <motion.div
                      initial={{ opacity: 0, y: -10, scale: 0.9 }}
                      animate={{ opacity: 1, y: -15, scale: 1 }}
                      exit={{ opacity: 0, y: -10, scale: 0.9 }}
                      className="absolute bottom-full left-0 mb-4 w-48 card-surface border border-custom rounded-2xl p-1.5 shadow-2xl z-50 overflow-hidden"
                    >
                      <button onClick={() => { fileInputRef.current?.click(); setShowAttachMenu(false); }}
                        className="w-full flex items-center gap-3 p-2.5 hover:bg-primary-gold/10 rounded-xl text-[10px] font-black uppercase tracking-widest text-left transition-colors text-muted-custom hover:text-primary-gold">
                        <ImageIcon size={16} /> Image / Gallery
                      </button>
                      <button onClick={() => { fileInputRef.current?.click(); setShowAttachMenu(false); }}
                        className="w-full flex items-center gap-3 p-2.5 hover:bg-primary-gold/10 rounded-xl text-[10px] font-black uppercase tracking-widest text-left transition-colors text-muted-custom hover:text-primary-gold">
                        <FileText size={16} /> Documents
                      </button>
                      <button onClick={() => { setShowPollCreator(true); setShowAttachMenu(false); }}
                        className="w-full flex items-center gap-3 p-2.5 hover:bg-primary-gold/10 rounded-xl text-[10px] font-black uppercase tracking-widest text-left transition-colors text-muted-custom hover:text-primary-gold">
                        <BarChart2 size={16} /> Create Poll
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <input
                type="text"
                placeholder={isAnon ? "Secret message..." : "Type a message..."}
                className="flex-1 bg-transparent outline-none text-[12px] font-bold placeholder:text-muted-custom/20 py-2 ml-1"
                value={msgInput}
                onChange={(e) => onInputChange(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
              />

              <div className="flex items-center gap-1 pr-1">
                <button className="p-2 text-muted-custom hover:text-primary-gold transition-colors">
                  <Mic size={18} />
                </button>

                <div className="h-6 w-[1px] bg-white/5 mx-1" />

                {inputState === 'NORMAL' ? (
                  <button onClick={() => setInputState('PILL')} className="p-2 text-muted-custom hover:text-white transition-colors">
                    <Minimize2 size={16} />
                  </button>
                ) : (
                  <button onClick={() => setInputState('NORMAL')} className="p-2 text-muted-custom hover:text-white transition-colors">
                    <Maximize2 size={16} />
                  </button>
                )}

                <button onClick={() => setInputState('DOCKED')} className="p-2 text-muted-custom hover:text-white transition-colors">
                  <Anchor size={16} />
                </button>

                <button onClick={() => handleSendMessage()}
                  disabled={!msgInput.trim()}
                  className="size-10 bg-primary-gold text-black rounded-xl flex items-center justify-center hover:brightness-110 shadow-lg shadow-primary-gold/20 transition-all active:scale-90 disabled:opacity-30 disabled:grayscale disabled:scale-100"
                >
                  <Send size={18} />
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Spacer to keep floating bar from overlapping last messages too much */}
      <div className="h-20 shrink-0" />
    </div>
  );
}
