"use client";

import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { PostData } from '@/components/feed/PostCard';
import { api } from '@/lib/api';
import { MOCK_POSTS } from '@/lib/mockData';

interface PostContextType {
    // Modal State
    isCreatePostOpen: boolean;
    setCreatePostOpen: (isOpen: boolean) => void;
    
    // Quote / Reshare target
    quoteTarget: PostData | null;
    setQuoteTarget: (post: PostData | null) => void;
    
    marketQuoteTarget: any | null; // Listing data
    setMarketQuoteTarget: (listing: any | null) => void;

    kaoQuoteTarget: any | null; // Kao unit data
    setKaoQuoteTarget: (unit: any | null) => void;

    tribeTarget: { id: string, name: string } | null;
    setTribeTarget: (tribe: { id: string, name: string } | null) => void;

    onPostCreated: ((post: PostData) => void) | null;
    registerPostCallback: (cb: ((post: PostData) => void) | null) => void;

    // Feed State
    posts: PostData[];
    setPosts: React.Dispatch<React.SetStateAction<PostData[]>>;
    addPost: (post: PostData) => void;
    updatePost: (id: string, updates: Partial<PostData>) => void;
    
    // Pagination
    cursor: string | null;
    hasMore: boolean;
    loadFeed: (isInitial?: boolean) => Promise<void>;
    isLoading: boolean;

    // Tab Siloing
    activeTab: 'HOME' | 'SPARK' | 'VIDEO';
    setActiveTab: (tab: 'HOME' | 'SPARK' | 'VIDEO') => void;
}

const PostContext = createContext<PostContextType | undefined>(undefined);

export function PostProvider({ children }: { children: ReactNode }) {
    const [isCreatePostOpen, setCreatePostOpen] = useState(false);
    const [quoteTarget, setQuoteTarget] = useState<PostData | null>(null);
    const [marketQuoteTarget, setMarketQuoteTarget] = useState<any | null>(null);
    const [kaoQuoteTarget, setKaoQuoteTarget] = useState<any | null>(null);
    const [tribeTarget, setTribeTargetState] = useState<{ id: string, name: string } | null>(null);
    
    const [posts, setPosts] = useState<PostData[]>([]);
    const [cursor, setCursor] = useState<string | null>(null);
    const [hasMore, setHasMore] = useState(true);
    const [isLoading, setIsLoading] = useState(false);
    const [activeTab, setActiveTabState] = useState<'HOME' | 'SPARK' | 'VIDEO'>('HOME');
    const [onPostCreated, setOnPostCreated] = useState<((post: PostData) => void) | null>(null);
    const isFetchingRef = React.useRef(false);

    const setActiveTab = (tab: 'HOME' | 'SPARK' | 'VIDEO') => {
        setActiveTabState(tab);
        setPosts([]);
        setCursor(null);
        setHasMore(true);
    };

    const addPost = useCallback((post: PostData) => {
        setPosts((prev) => [post, ...prev]);
        if (onPostCreated) onPostCreated(post);
    }, [onPostCreated]);

    const updatePost = useCallback((id: string, updates: Partial<PostData>) => {
        setPosts((prev) => prev.map((p) => (p.id === id ? { ...p, ...updates } : p)));
    }, []);

    const loadFeed = useCallback(async (isInitial = false) => {
        if (isFetchingRef.current || (!isInitial && !hasMore)) return;
        
        isFetchingRef.current = true;
        setIsLoading(true);
        try {
            const currentCursor = isInitial ? null : cursor;
            let query = `?limit=20&tab=${activeTab}`;
            if (currentCursor) query += `&cursor=${currentCursor}`;
            
            const data = await api.get(`/posts${query}`);
            
            const fetchedPosts = data.posts && data.posts.length > 0 ? data.posts : MOCK_POSTS;

            if (isInitial) {
                setPosts(fetchedPosts);
            } else {
                setPosts((prev) => [...prev, ...data.posts]);
            }
            
            setCursor(data.nextCursor);
            setHasMore(data.hasMore);
        } catch (error) {
            console.error('Failed to load feed:', error);
        } finally {
            setIsLoading(false);
            isFetchingRef.current = false;
        }
    }, [cursor, hasMore, activeTab]);

    const setTribeTarget = useCallback((target: { id: string, name: string } | null) => {
        setTribeTargetState(target);
    }, []);

    const registerPostCallback = useCallback((cb: ((post: PostData) => void) | null) => {
        setOnPostCreated(() => cb);
    }, []);

    return (
        <PostContext.Provider
            value={{
                isCreatePostOpen,
                setCreatePostOpen,
                quoteTarget,
                setQuoteTarget,
                marketQuoteTarget,
                setMarketQuoteTarget,
                kaoQuoteTarget,
                setKaoQuoteTarget,
                posts,
                setPosts,
                addPost,
                updatePost,
                cursor,
                hasMore,
                loadFeed,
                isLoading,
                activeTab,
                setActiveTab,
                tribeTarget,
                setTribeTarget,
                onPostCreated,
                registerPostCallback,
            }}
        >
            {children}
        </PostContext.Provider>
    );
}

export function usePostContext() {
    const context = useContext(PostContext);
    if (!context) {
        throw new Error('usePostContext must be used within a PostProvider');
    }
    return context;
}
