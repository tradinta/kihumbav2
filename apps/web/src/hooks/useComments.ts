import { useState, useCallback, useEffect } from 'react';
import { api } from '@/lib/api';

export type CommentTargetType = 'POST' | 'MARKET_LISTING' | 'KAO_LISTING';
export type SortingType = 'RECENT' | 'LOVED' | 'RANDOM';

export interface CommentAuthor {
  id: string;
  username: string;
  fullName?: string;
  avatar?: string;
  isVerified: boolean;
}

export interface CommentData {
  id: string;
  content: string;
  media?: any[] | null;
  createdAt: string;
  author: CommentAuthor;
  _count?: {
    replies: number;
    interactions: number;
  };
  userInteraction?: {
    hasHearted: boolean;
  };
  replies?: CommentData[];
  parentId?: string | null;
}

export function useComments(targetType: CommentTargetType, targetId: string) {
  const [comments, setComments] = useState<CommentData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [cursor, setCursor] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(false);
  const [sortBy, setSortBy] = useState<SortingType>('RANDOM');

  const fetchComments = useCallback(async (isInitial = true, currentSort = sortBy) => {
    if (isInitial) setIsLoading(true);
    else setIsLoadingMore(true);

    try {
      const currentCursor = isInitial ? '' : cursor;
      const queryParams = new URLSearchParams({
        targetType,
        targetId,
        sortBy: currentSort,
        ...(currentCursor && { cursor: currentCursor }),
      });

      const { comments: newComments, nextCursor, hasMore: more } = await api.get(`/comments?${queryParams.toString()}`);
      
      setComments((prev) => isInitial ? newComments : [...prev, ...newComments]);
      setCursor(nextCursor);
      setHasMore(more);
      setError(null);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch comments');
    } finally {
      setIsLoading(false);
      setIsLoadingMore(false);
    }
  }, [targetType, targetId, cursor, sortBy]);

  useEffect(() => {
    fetchComments(true, sortBy);
  }, [targetType, targetId, sortBy]);

  const loadMore = () => {
    if (hasMore && !isLoadingMore) {
      fetchComments(false);
    }
  };

  const addComment = async (content: string, media?: any[], parentId?: string) => {
    try {
      const newComment = await api.post('/comments', {
        content,
        media,
        targetType,
        targetId,
        parentId,
      });

      if (parentId) {
        setComments((prev) =>
          prev.map((c) => {
            if (c.id === parentId) {
              return {
                ...c,
                replies: [...(c.replies || []), newComment],
                _count: { 
                    ...c._count!, 
                    replies: (c._count?.replies || 0) + 1,
                    interactions: c._count?.interactions || 0
                },
              };
            }
            return c;
          })
        );
      } else {
        setComments((prev) => [newComment, ...prev]);
      }
      return newComment;
    } catch (err: any) {
      throw new Error(err.message || 'Failed to post comment');
    }
  };

  const toggleHeart = async (commentId: string) => {
    // Optimistic Update
    setComments((prev) => {
      const updateList = (list: CommentData[]): CommentData[] => {
        return list.map((c) => {
          if (c.id === commentId) {
            const isHearted = c.userInteraction?.hasHearted;
            return {
              ...c,
              userInteraction: { hasHearted: !isHearted },
              _count: {
                ...c._count!,
                replies: c._count?.replies || 0,
                interactions: (c._count?.interactions || 0) + (isHearted ? -1 : 1),
              },
            };
          }
          if (c.replies) return { ...c, replies: updateList(c.replies) };
          return c;
        });
      };
      return updateList(prev);
    });

    try {
      await api.post(`/comments/${commentId}/heart`, {});
    } catch (err) {
      // Rollback on error if needed, but for agora/kihumba we trust the user
      console.error("Heart sync failed", err);
    }
  };

  const loadReplies = async (parentId: string) => {
    try {
      const replies = await api.get(`/comments/${parentId}/replies`);
      setComments((prev) =>
        prev.map((c) => {
          if (c.id === parentId) {
            return { ...c, replies };
          }
          return c;
        })
      );
    } catch (err) {
      console.error("Failed to load replies", err);
    }
  };

  const deleteComment = async (commentId: string) => {
    try {
      await api.delete(`/comments/${commentId}`);
      setComments((prev) => {
        const isTopLevel = prev.some(c => c.id === commentId);
        if (isTopLevel) return prev.filter(c => c.id !== commentId);
        return prev.map(c => ({
          ...c,
          replies: c.replies?.filter(r => r.id !== commentId),
          _count: {
              ...c._count!,
              replies: (c.replies?.some(r => r.id === commentId)) ? (c._count?.replies || 1) - 1 : (c._count?.replies || 0),
              interactions: c._count?.interactions || 0
          }
        }));
      });
    } catch (err: any) {
      throw new Error(err.message || 'Failed to delete comment');
    }
  };

  return {
    comments,
    isLoading,
    isLoadingMore,
    hasMore,
    error,
    sortBy,
    setSortBy,
    loadMore,
    loadReplies,
    addComment,
    toggleHeart,
    deleteComment,
    refresh: () => fetchComments(true),
  };
}
