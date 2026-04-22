import { useState, useCallback, useEffect } from "react";
import { ThumbsDown, MessageCircle, Repeat2, Bookmark, Share2, Heart, Check, Send, X } from "lucide-react";
import { api } from "@/lib/api";
import { usePostContext } from "@/context/PostContext";
import { motion, AnimatePresence } from "framer-motion";

interface InteractionBarProps {
  postId: string;
  likes: number;
  comments?: number;
  reshares?: number;
  initialLiked?: boolean;
  initialDownvoted?: boolean;
  initialReshared?: boolean;
  initialBookmarked?: boolean;
}

export default function InteractionBar({
  postId,
  likes: initialLikes,
  comments: initialComments = 0,
  reshares: initialReshares = 0,
  initialLiked = false,
  initialDownvoted = false,
  initialReshared = false,
  initialBookmarked = false,
}: InteractionBarProps) {
  const [liked, setLiked] = useState(initialLiked);
  const [downvoted, setDownvoted] = useState(initialDownvoted);
  const [likesCount, setLikesCount] = useState(initialLikes);
  
  const [commentsCount, setCommentsCount] = useState(initialComments);
  const [isCommenting, setIsCommenting] = useState(false);
  const [commentBody, setCommentBody] = useState("");
  const [isPostingComment, setIsPostingComment] = useState(false);

  const [bookmarked, setBookmarked] = useState(initialBookmarked);
  const [reshared, setReshared] = useState(initialReshared);
  const [resharesCount, setResharesCount] = useState(initialReshares);
  
  const [animatingHeart, setAnimatingHeart] = useState(false);
  const [justShared, setJustShared] = useState(false);
  const [isReshareMenuOpen, setIsReshareMenuOpen] = useState(false);

  // Sync state with props (crucial for SSR -> Client hydration sync)
  useEffect(() => {
    setLiked(initialLiked);
    setDownvoted(initialDownvoted);
    setLikesCount(initialLikes);
    setBookmarked(initialBookmarked);
    setReshared(initialReshared);
    setResharesCount(initialReshares);
    setCommentsCount(initialComments);
  }, [initialLiked, initialDownvoted, initialLikes, initialBookmarked, initialReshared, initialReshares, initialComments]);

  const { setCreatePostOpen, setQuoteTarget, posts } = usePostContext();

  const handleUpvote = useCallback(async () => {
    const newLiked = !liked;
    setLiked(newLiked);
    setLikesCount(prev => newLiked ? prev + 1 : prev - 1);
    
    if (newLiked) {
      if (downvoted) setDownvoted(false);
      setAnimatingHeart(true);
      setTimeout(() => setAnimatingHeart(false), 400);
    }

    try {
      await api.post(`/posts/${postId}/upvote`);
    } catch {
      setLiked(liked);
      setLikesCount(initialLikes);
    }
  }, [liked, downvoted, postId, initialLikes]);

  const handleDownvote = useCallback(async () => {
    const newDownvoted = !downvoted;
    setDownvoted(newDownvoted);
    
    if (newDownvoted && liked) {
      setLiked(false);
      setLikesCount(prev => prev - 1);
    }

    try {
      await api.post(`/posts/${postId}/downvote`);
    } catch {
      setDownvoted(downvoted);
      setLiked(liked);
      setLikesCount(initialLikes);
    }
  }, [downvoted, liked, postId, initialLikes]);

  const handleCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentBody.trim() || isPostingComment) return;

    setIsPostingComment(true);
    // Optimistic CC count increase
    setCommentsCount(prev => prev + 1);
    const bodySnapshot = commentBody;
    setCommentBody("");
    setIsCommenting(false);

    try {
      await api.post("/comments", {
        content: bodySnapshot,
        targetId: postId,
        targetType: "POST"
      });
    } catch {
      setCommentsCount(prev => prev - 1);
      setCommentBody(bodySnapshot);
      setIsCommenting(true);
      alert("Failed to post comment. Please try again.");
    } finally {
      setIsPostingComment(false);
    }
  };

  const handleBookmark = useCallback(async () => {
    const newBookmarked = !bookmarked;
    setBookmarked(newBookmarked);
    try {
      await api.post(`/posts/${postId}/bookmark`);
    } catch {
      setBookmarked(bookmarked);
    }
  }, [bookmarked, postId]);

  const handleReshareToggle = useCallback(async () => {
    const newReshared = !reshared;
    setReshared(newReshared);
    setResharesCount(prev => newReshared ? prev + 1 : prev - 1);
    try {
      await api.post(`/posts/${postId}/reshare`);
    } catch {
      setReshared(reshared);
      setResharesCount(initialReshares);
    }
  }, [reshared, postId, initialReshares]);

  const handleQuotePost = useCallback(() => {
    const postToQuote = posts.find(p => p.id === postId);
    if (postToQuote) {
      setQuoteTarget(postToQuote);
      setCreatePostOpen(true);
    }
  }, [postId, posts, setCreatePostOpen, setQuoteTarget]);

  return (
    <div className="flex flex-col w-full">
      <div className="p-3 flex items-center justify-between">
        <div className="flex items-center gap-1">
          <div className="flex items-center pill-surface rounded border border-custom p-0.5">
            <button
              onClick={handleUpvote}
              className={`flex items-center gap-1.5 px-3 py-1.5 transition-all duration-200 active:scale-90 ${
                liked ? "text-primary-gold" : "text-main hover:text-primary-gold/70"
              }`}
            >
              <Heart
                size={16}
                strokeWidth={1.5}
                fill={liked ? "currentColor" : "none"}
                className={animatingHeart ? "animate-heart-pop" : ""}
              />
              <span className="text-[10px] font-bold">{likesCount}</span>
            </button>
            
            <div className="w-px h-3 bg-[var(--border-color)]" />
            
            <button
              onClick={handleDownvote}
              className={`flex items-center px-3 py-1.5 transition-colors duration-200 active:scale-90 ${
                downvoted ? "text-red-500" : "text-muted-custom hover:text-red-400/70"
              }`}
            >
              <ThumbsDown size={16} strokeWidth={1.5} fill={downvoted ? "currentColor" : "none"} />
            </button>
          </div>

          <button
            onClick={() => setIsCommenting(!isCommenting)}
            className={`flex items-center gap-1 px-4 py-2 transition-colors duration-200 active:scale-90 ${
              isCommenting ? "text-primary-gold" : "text-muted-custom hover:text-primary-gold"
            }`}
          >
            <MessageCircle size={18} strokeWidth={1.5} fill={isCommenting ? "currentColor" : "none"} />
            <span className="text-[10px] font-bold">{commentsCount}</span>
          </button>

          <div className="relative">
            <button
              onClick={() => setIsReshareMenuOpen(!isReshareMenuOpen)}
              className={`flex items-center gap-1 px-4 py-2 transition-colors duration-200 active:scale-90 ${
                reshared ? "text-green-500" : "text-muted-custom hover:text-green-400"
              }`}
            >
              <Repeat2 size={18} strokeWidth={1.5} />
              <span className="text-[10px] font-bold">{resharesCount}</span>
            </button>

            <AnimatePresence>
              {isReshareMenuOpen && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setIsReshareMenuOpen(false)} />
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9, y: 10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9, y: 10 }}
                    className="absolute bottom-full left-0 mb-2 w-40 card-surface border border-white/10 rounded-xl shadow-2xl z-50 overflow-hidden"
                  >
                    <div className="p-1">
                      <button
                        onClick={() => { handleReshareToggle(); setIsReshareMenuOpen(false); }}
                        className="w-full flex items-center gap-3 px-3 py-2 text-[10px] font-bold uppercase tracking-widest text-muted-custom hover:bg-green-500/10 hover:text-green-500 transition-all rounded"
                      >
                        <Repeat2 size={14} />
                        {reshared ? 'Undo Reshare' : 'Reshare'}
                      </button>
                      <button
                        onClick={() => { handleQuotePost(); setIsReshareMenuOpen(false); }}
                        className="w-full flex items-center gap-3 px-3 py-2 text-[10px] font-bold uppercase tracking-widest text-muted-custom hover:bg-primary-gold/10 hover:text-primary-gold transition-all rounded"
                      >
                        <Heart size={14} className="rotate-45" /> {/* Using something different for quote */}
                        Quote Post
                      </button>
                    </div>
                  </motion.div>
                </>
              )}
            </AnimatePresence>
          </div>
        </div>

        <div className="flex items-center gap-1">
          <button onClick={handleBookmark} className={`p-2 transition-all duration-200 active:scale-90 ${bookmarked ? "text-primary-gold" : "text-muted-custom hover:text-primary-gold"}`}>
            <Bookmark size={18} strokeWidth={1.5} fill={bookmarked ? "currentColor" : "none"} />
          </button>
          <button 
            onClick={() => {
              navigator.clipboard.writeText(`${window.location.origin}/post/${postId}`);
              setJustShared(true);
              setTimeout(() => setJustShared(false), 2000);
            }} 
            className="p-2 text-muted-custom hover:text-primary-gold"
          >
            {justShared ? <Check size={18} className="text-green-500" /> : <Share2 size={18} strokeWidth={1.5} />}
          </button>
        </div>
      </div>

      {/* --- QUICK COMMENT INPUT --- */}
      <AnimatePresence>
        {isCommenting && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden px-4 pb-4"
          >
            <form onSubmit={handleCommentSubmit} className="relative group">
              <input
                autoFocus
                placeholder="Write a reply..."
                value={commentBody}
                onChange={(e) => setCommentBody(e.target.value)}
                className="w-full bg-black/10 border border-custom rounded-xl py-3 pl-4 pr-12 text-sm text-main placeholder:text-muted-custom focus:outline-none focus:border-primary-gold/50 transition-all"
              />
              <div className="absolute inset-y-0 right-0 flex items-center pr-2">
                <button
                  type="submit"
                  disabled={!commentBody.trim() || isPostingComment}
                  className="size-8 rounded-lg bg-primary-gold text-black flex items-center justify-center hover:scale-105 active:scale-95 transition-all disabled:opacity-50 disabled:grayscale disabled:scale-100"
                >
                  <Send size={14} fill="currentColor" />
                </button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
