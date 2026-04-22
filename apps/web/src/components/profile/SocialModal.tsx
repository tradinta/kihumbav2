import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Users, UserCheck, Inbox, Check, Trash2 } from 'lucide-react';
import UserIdentity from '@/components/shared/UserIdentity';
import { api } from '@/lib/api';
import { useAuth } from '@/context/AuthContext';

interface SocialModalProps {
  isOpen: boolean;
  onClose: () => void;
  userId: string;
  initialTab?: 'followers' | 'following' | 'requests';
}

export default function SocialModal({ isOpen, onClose, userId, initialTab = 'followers' }: SocialModalProps) {
  const { user: currentUser } = useAuth();
  const [activeTab, setActiveTab] = useState<'followers' | 'following' | 'requests'>(initialTab);
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [nextCursor, setNextCursor] = useState<string | null>(null);

  const isSelf = currentUser?.id === userId;
  const showRequestsTab = isSelf && currentUser?.privateAccount;

  useEffect(() => {
    setActiveTab(initialTab);
  }, [initialTab]);

  useEffect(() => {
    if (isOpen) {
      setUsers([]);
      setNextCursor(null);
      setHasMore(true);
      fetchData(true);
    }
  }, [isOpen, activeTab, userId]);

  const fetchData = async (isReset = false) => {
    if (loading || (!hasMore && !isReset && activeTab !== 'requests')) return;
    
    setLoading(true);
    try {
      const endpoint = activeTab === 'requests' ? '/users/requests' : `/users/${userId}/${activeTab}`;
      const cursorParam = !isReset && nextCursor ? `?cursor=${nextCursor}&limit=12` : '?limit=12';
      const res = await api.get(`${endpoint}${cursorParam}`);
      
      const data = Array.isArray(res) ? res : res.data;
      const cursor = res.nextCursor || null;
      const more = res.hasMore || false;

      setUsers(prev => isReset ? data : [...prev, ...data]);
      setNextCursor(cursor);
      setHasMore(more);
    } catch (error) {
      console.error('Failed to fetch social list', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRequest = async (followerId: string, accept: boolean) => {
    try {
      await api.post(`/users/requests/${followerId}/handle`, { accept });
      setUsers(prev => prev.filter(u => (u.id || u.follower?.id) !== followerId));
    } catch (error) {
      console.error('Failed to handle follow request', error);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-md card-surface rounded-2xl overflow-hidden border border-white/10 shadow-2xl shadow-primary-gold/5 max-h-[80vh] flex flex-col"
            >
              {/* Header */}
              <div className="p-4 border-b border-white/5 flex items-center justify-between bg-white/[0.02]">
                <div className="flex gap-4">
                  <button 
                    onClick={() => setActiveTab('followers')}
                    className={`flex items-center gap-2 pb-2 text-[10px] font-bold uppercase tracking-widest border-b-2 transition-colors ${
                      activeTab === 'followers' ? 'border-primary-gold text-primary-gold' : 'border-transparent text-muted-custom hover:text-white'
                    }`}
                  >
                    <Users size={12} /> Followers
                  </button>
                  <button 
                    onClick={() => setActiveTab('following')}
                    className={`flex items-center gap-2 pb-2 text-[10px] font-bold uppercase tracking-widest border-b-2 transition-colors ${
                      activeTab === 'following' ? 'border-primary-gold text-primary-gold' : 'border-transparent text-muted-custom hover:text-white'
                    }`}
                  >
                    <UserCheck size={12} /> Following
                  </button>
                  {showRequestsTab && (
                    <button 
                      onClick={() => setActiveTab('requests')}
                      className={`flex items-center gap-2 pb-2 text-[10px] font-bold uppercase tracking-widest border-b-2 transition-colors ${
                        activeTab === 'requests' ? 'border-primary-gold text-primary-gold' : 'border-transparent text-muted-custom hover:text-white'
                      }`}
                    >
                      <Inbox size={12} /> Requests
                    </button>
                  )}
                </div>
                <button 
                  onClick={onClose}
                  className="size-8 rounded-full bg-white/5 flex items-center justify-center text-white/50 hover:bg-white/10 hover:text-white transition-all self-start -mt-2"
                >
                  <X size={14} />
                </button>
              </div>

              {/* List */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4 no-scrollbar">
                {users.map((item, i) => {
                  const u = activeTab === 'requests' ? item.follower : item;
                  return (
                    <div key={i} className="flex items-center justify-between group">
                      <UserIdentity user={u} />
                      
                      {activeTab === 'requests' ? (
                        <div className="flex gap-2">
                          <button 
                            onClick={() => handleRequest(u.id, true)}
                            className="size-8 rounded-md bg-primary-gold text-black flex items-center justify-center hover:scale-110 transition-all"
                          >
                            <Check size={14} />
                          </button>
                          <button 
                            onClick={() => handleRequest(u.id, false)}
                            className="size-8 rounded-md bg-red-500/10 text-red-500 flex items-center justify-center hover:bg-red-500/20 transition-all"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      ) : (
                        <button className="h-7 px-3 rounded-md bg-white/5 text-[9px] font-bold uppercase tracking-widest hover:bg-white/10 transition-colors">
                          Profile
                        </button>
                      )}
                    </div>
                  );
                })}

                {loading && (
                  <div className="py-4 text-center text-primary-gold/50 text-[10px] font-bold uppercase tracking-widest animate-pulse">
                    Loading...
                  </div>
                )}

                {!loading && users.length === 0 && (
                  <div className="py-10 text-center text-muted-custom text-[10px] font-bold uppercase tracking-widest">
                    No {activeTab} found
                  </div>
                )}

                {hasMore && !loading && activeTab !== 'requests' && (
                  <button 
                    onClick={() => fetchData()}
                    className="w-full py-3 rounded-lg border border-primary-gold/20 text-primary-gold text-[9px] font-bold uppercase tracking-widest hover:bg-primary-gold/10 transition-all"
                  >
                    Load More
                  </button>
                )}
                
                {!hasMore && users.length > 0 && activeTab !== 'requests' && (
                  <div className="py-4 text-center text-white/20 text-[8px] font-bold uppercase tracking-[0.2em]">
                    End of list
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
