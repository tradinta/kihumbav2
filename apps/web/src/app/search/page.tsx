'use client';

import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { algoliasearch } from 'algoliasearch';
import PostCard from '@/components/feed/PostCard';
import TopBar from '@/components/TopBar';
import LeftSidebar from '@/components/LeftSidebar';
import { Search, Loader2, Hash, User, LayoutGrid, Video, Clock, TrendingUp, Users } from 'lucide-react';

const client = algoliasearch(
  process.env.NEXT_PUBLIC_ALGOLIA_APP_ID || '',
  process.env.NEXT_PUBLIC_ALGOLIA_SEARCH_KEY || ''
);

if (!process.env.NEXT_PUBLIC_ALGOLIA_APP_ID) {
    console.warn("⚠️ Algolia APP ID is missing. Search functionality will be disabled.");
}

type SearchTab = 'ALL' | 'POSTS' | 'PEOPLE' | 'VIDEOS';

export default function SearchPage() {
  const searchParams = useSearchParams();
  const query = searchParams.get('q') || '';
  const [activeTab, setActiveTab] = useState<SearchTab>('ALL');
  const [results, setResults] = useState<{
    posts: any[];
    users: any[];
    videos: any[];
  }>({ posts: [], users: [], videos: [] });
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState<'RECENT' | 'POPULAR'>('POPULAR');

  useEffect(() => {
    async function performSearch() {
      if (!query) {
        setLoading(false);
        return;
      }
      setLoading(true);
      try {
        // Build filters
        const isHashtag = query.startsWith('#');
        const postFilters = isHashtag ? `tags:${query}` : '';
        const postIndex = sortBy === 'RECENT' ? 'kihumba_posts_recent' : 'kihumba_posts';
        
        // Multi-query for better intelligence
        const { results: searchResults } = await client.search({
          requests: [
            {
              indexName: postIndex,
              query: isHashtag ? '' : query,
              filters: postFilters,
              hitsPerPage: 20,
            },
            {
              indexName: 'kihumba_users',
              query: query,
              hitsPerPage: 10,
            }
          ]
        });

        const rawPosts = (searchResults[0] as any).hits || [];
        const rawUsers = (searchResults[1] as any).hits || [];

        // Post-processing for Videos tab
        const videos = rawPosts.filter((p: any) => p.contentType === 'VIDEO' || p.isSpark);

        setResults({
          posts: rawPosts,
          users: rawUsers,
          videos: videos
        });
      } catch (err) {
        console.error("Search failed", err);
      } finally {
        setLoading(false);
      }
    }
    performSearch();
  }, [query, sortBy]);

  const tabs: { id: SearchTab; label: string; icon: any }[] = [
    { id: 'ALL', label: 'All', icon: LayoutGrid },
    { id: 'POSTS', label: 'Posts', icon: Hash },
    { id: 'PEOPLE', label: 'People', icon: Users },
    { id: 'VIDEOS', label: 'Videos', icon: Video },
  ];

  return (
    <div className="max-w-[1400px] mx-auto flex flex-col lg:flex-row min-h-screen lg:px-6 gap-6">
      <LeftSidebar />

      <main className="flex-1 w-full max-w-2xl mx-auto lg:mx-0 pt-0 lg:pt-4 pb-32 lg:pb-12">
        <TopBar />

        <div className="px-4 space-y-6">
          {/* Header Card */}
          <div className="card-surface p-6 rounded-2xl border border-primary-gold/10 bg-gradient-to-br from-primary-gold/[0.03] to-transparent relative overflow-hidden group">
             <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
                <Search size={120} strokeWidth={1} />
             </div>
             <div className="flex items-center gap-4 mb-2 relative z-10">
                <div className="size-12 rounded-2xl bg-primary-gold/10 flex items-center justify-center text-primary-gold border border-primary-gold/20 shadow-lg shadow-primary-gold/5">
                   {query.startsWith('#') ? <Hash size={24} /> : <Search size={24} />}
                </div>
                <div>
                   <h1 className="text-xl font-black text-main uppercase tracking-tight">Curation Hub</h1>
                   <p className="text-[11px] font-bold text-muted-custom uppercase tracking-[0.2em]">Intellect: <span className="text-primary-gold">Algolia AI</span> • Query: <span className="text-primary-gold">"{query}"</span></p>
                </div>
             </div>
          </div>

          {/* Tabs & Filters */}
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 p-1 bg-black/20 rounded-2xl border border-white/5">
             <div className="flex items-center gap-1 w-full md:w-auto">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                      activeTab === tab.id 
                        ? 'bg-primary-gold text-black shadow-lg shadow-primary-gold/10' 
                        : 'text-muted-custom hover:text-white hover:bg-white/5'
                    }`}
                  >
                    <tab.icon size={12} />
                    {tab.label}
                  </button>
                ))}
             </div>

             <div className="flex items-center gap-2 pr-2">
                <button 
                  onClick={() => setSortBy('POPULAR')}
                  className={`p-2 rounded-lg transition-all ${sortBy === 'POPULAR' ? 'text-primary-gold bg-primary-gold/10' : 'text-muted-custom hover:text-white'}`}
                >
                  <TrendingUp size={16} />
                </button>
                <button 
                  onClick={() => setSortBy('RECENT')}
                  className={`p-2 rounded-lg transition-all ${sortBy === 'RECENT' ? 'text-primary-gold bg-primary-gold/10' : 'text-muted-custom hover:text-white'}`}
                >
                  <Clock size={16} />
                </button>
             </div>
          </div>

          {loading ? (
            <div className="flex flex-col items-center justify-center py-24">
              <div className="relative">
                <Loader2 size={40} className="text-primary-gold animate-spin" />
                <div className="absolute inset-0 blur-xl bg-primary-gold/20 animate-pulse" />
              </div>
              <p className="mt-6 text-[10px] font-black uppercase tracking-[0.3em] text-muted-custom animate-pulse">Syncing with neural lattice...</p>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Users Row in ALL tab */}
              {activeTab === 'ALL' && results.users.length > 0 && (
                <div className="space-y-3">
                  <h3 className="text-[10px] font-black text-primary-gold uppercase tracking-[0.2em] ml-1">Featured Profiles</h3>
                  <div className="flex gap-4 overflow-x-auto pb-2 custom-scrollbar no-scrollbar">
                    {results.users.map((user: any) => (
                      <div key={user.objectID} className="flex-none w-48 card-surface p-4 rounded-2xl border border-white/5 hover:border-primary-gold/30 transition-all group">
                         <div className="flex flex-col items-center text-center">
                            <div className="size-16 rounded-full border-2 border-primary-gold/20 p-1 mb-3 group-hover:border-primary-gold/50 transition-all">
                               <img src={user.avatar || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=100"} className="size-full rounded-full object-cover grayscale group-hover:grayscale-0 transition-all" alt="" />
                            </div>
                            <h4 className="text-xs font-bold text-main truncate w-full">{user.fullName || user.username}</h4>
                            <p className="text-[9px] font-bold text-primary-gold/60 uppercase tracking-widest">@{user.username}</p>
                            <button className="mt-4 w-full py-1.5 rounded-lg bg-white/5 border border-white/10 text-[9px] font-black uppercase tracking-widest hover:bg-primary-gold hover:text-black hover:border-primary-gold transition-all">
                               View Profile
                            </button>
                         </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* People Tab */}
              {activeTab === 'PEOPLE' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {results.users.map((user: any) => (
                    <div key={user.objectID} className="card-surface p-4 rounded-2xl border border-white/5 flex items-center gap-4 hover:border-primary-gold/30 transition-all group">
                       <img src={user.avatar || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=100"} className="size-14 rounded-full object-cover border-2 border-white/5 grayscale group-hover:grayscale-0 transition-all" alt="" />
                       <div className="flex-1 min-w-0">
                          <h4 className="text-sm font-bold text-main truncate">{user.fullName || user.username}</h4>
                          <p className="text-[10px] font-bold text-primary-gold/60 uppercase tracking-widest">@{user.username}</p>
                       </div>
                       <button className="px-4 py-2 rounded-xl bg-primary-gold text-black text-[9px] font-black uppercase tracking-widest shadow-lg shadow-primary-gold/10">Follow</button>
                    </div>
                  ))}
                  {results.users.length === 0 && <NoResults term="profiles" />}
                </div>
              )}

              {/* Posts Tab */}
              {(activeTab === 'ALL' || activeTab === 'POSTS') && (
                <div className="space-y-4">
                  {(activeTab === 'ALL' ? results.posts : results.posts).map((post: any, index: number) => (
                    <PostCard key={post.objectID} post={{ ...post, id: post.objectID }} index={index} />
                  ))}
                  {results.posts.length === 0 && <NoResults term="posts" />}
                </div>
              )}

              {/* Videos Tab */}
              {activeTab === 'VIDEOS' && (
                <div className="space-y-4">
                  {results.videos.map((post: any, index: number) => (
                    <PostCard key={post.objectID} post={{ ...post, id: post.objectID }} index={index} />
                  ))}
                  {results.videos.length === 0 && <NoResults term="videos" />}
                </div>
              )}
            </div>
          )}
        </div>
      </main>

      {/* Right Sidebar Placeholder */}
      <div className="hidden xl:block w-80 shrink-0 pt-4" />
    </div>
  );
}

function NoResults({ term }: { term: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
       <div className="size-20 rounded-full bg-white/[0.03] flex items-center justify-center text-muted-custom mb-6 border border-white/5">
          <LayoutGrid size={40} strokeWidth={1} />
       </div>
       <h3 className="text-lg font-bold text-main uppercase tracking-widest mb-2">No {term} discovered</h3>
       <p className="text-[11px] text-muted-custom font-bold uppercase tracking-widest max-w-xs mx-auto">
         Our algorithms couldn't find any {term} matching your current criteria.
       </p>
    </div>
  );
}
