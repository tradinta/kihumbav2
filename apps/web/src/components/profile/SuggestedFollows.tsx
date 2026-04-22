'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { UserPlus, Check, History, Loader2, Sparkles } from 'lucide-react';
import { api } from '@/lib/api';
import UserIdentity from '@/components/shared/UserIdentity';

export default function SuggestedFollows() {
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [followingMap, setFollowingMap] = useState<Record<string, string | null>>({});
  const [loadingMap, setLoadingMap] = useState<Record<string, boolean>>({});

  useEffect(() => {
    fetchSuggestions();
  }, []);

  const fetchSuggestions = async () => {
    try {
      const data = await api.get('/users/suggested');
      setSuggestions(data);
    } catch (error) {
      console.error('Failed to fetch suggestions', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFollow = async (userId: string) => {
    setLoadingMap(prev => ({ ...prev, [userId]: true }));
    try {
      const res = await api.post(`/users/${userId}/follow`);
      setFollowingMap(prev => ({ ...prev, [userId]: res.status }));
    } catch (error) {
      console.error('Follow failed', error);
    } finally {
      setLoadingMap(prev => ({ ...prev, [userId]: false }));
    }
  };

  if (loading) return null;
  if (suggestions.length === 0) return null;

  return (
    <div className="card-surface rounded-2xl border border-white/10 overflow-hidden shadow-2xl">
      <div className="p-4 border-b border-white/5 flex items-center justify-between bg-white/[0.02]">
        <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-primary-gold flex items-center gap-2">
          <Sparkles size={12} /> Suggested Follows
        </h3>
      </div>
      
      <div className="divide-y divide-white/5">
        {suggestions.map((user, i) => (
          <motion.div 
            key={user.id}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.1 }}
            className="p-4 flex items-center justify-between group hover:bg-white/[0.02] transition-colors"
          >
            <div className="flex flex-col gap-1">
              <UserIdentity user={user} />
              <span className="text-[8px] font-bold text-muted-custom uppercase tracking-wider ml-11">
                {user.suggestionReason}
              </span>
            </div>

            <button
              onClick={() => handleFollow(user.id)}
              disabled={loadingMap[user.id] || followingMap[user.id] !== undefined}
              className={`h-7 px-4 rounded-md text-[9px] font-bold uppercase tracking-widest transition-all flex items-center gap-1.5 ${
                followingMap[user.id] 
                  ? 'bg-white/5 text-muted-custom' 
                  : 'bg-primary-gold text-black hover:brightness-110 active:scale-95'
              }`}
            >
              {loadingMap[user.id] ? (
                <Loader2 size={10} className="animate-spin" />
              ) : followingMap[user.id] === 'PENDING' ? (
                <><History size={10} /> Requested</>
              ) : followingMap[user.id] === 'ACCEPTED' ? (
                <><Check size={10} /> Following</>
              ) : (
                <><UserPlus size={10} /> Follow</>
              )}
            </button>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
