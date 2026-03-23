"use client";

import { useState, useCallback } from "react";
import { ThumbsUp, ThumbsDown, MessageCircle, Repeat2, Bookmark, Share2, Heart } from "lucide-react";

interface InteractionBarProps {
  likes: string;
  comments?: string;
  reshares?: string;
  likeIcon?: "thumb_up" | "favorite";
  liked?: boolean;
}

export default function InteractionBar({
  likes,
  comments,
  reshares,
  likeIcon = "thumb_up",
  liked: initialLiked = false,
}: InteractionBarProps) {
  const [liked, setLiked] = useState(initialLiked);
  const [bookmarked, setBookmarked] = useState(false);
  const [animating, setAnimating] = useState(false);

  const handleLike = useCallback(() => {
    setLiked(!liked);
    setAnimating(true);
    setTimeout(() => setAnimating(false), 400);
  }, [liked]);

  const LikeIcon = likeIcon === "favorite" ? Heart : ThumbsUp;

  return (
    <div className="p-3 flex items-center justify-between">
      <div className="flex items-center gap-1">
        <div className="flex items-center pill-surface rounded border border-custom p-0.5">
          <button
            onClick={handleLike}
            aria-label={liked ? "Unlike" : "Like"}
            className={`flex items-center gap-1.5 px-3 py-1.5 transition-all duration-200 active:scale-90 ${
              liked ? "text-primary-gold" : "text-main hover:text-primary-gold/70"
            }`}
          >
            <LikeIcon
              size={16}
              strokeWidth={1.5}
              fill={liked ? "currentColor" : "none"}
              className={animating ? "animate-heart-pop" : ""}
            />
            <span className="text-[10px] font-bold">{likes}</span>
          </button>
          <div className="w-px h-3 bg-[var(--border-color)]" />
          <button
            aria-label="Dislike"
            className="flex items-center px-3 py-1.5 text-muted-custom hover:text-red-400/70 transition-colors duration-200 active:scale-90"
          >
            <ThumbsDown size={16} strokeWidth={1.5} />
          </button>
        </div>

        {comments !== undefined && (
          <button
            aria-label="Comments"
            className="flex items-center gap-1 px-4 py-2 text-muted-custom hover:text-primary-gold transition-colors duration-200 active:scale-90"
          >
            <MessageCircle size={18} strokeWidth={1.5} />
            <span className="text-[10px] font-bold">{comments}</span>
          </button>
        )}

        {reshares !== undefined && (
          <button
            aria-label="Reshare"
            className="flex items-center gap-1 px-4 py-2 text-muted-custom hover:text-primary-gold transition-colors duration-200 active:scale-90"
          >
            <Repeat2 size={18} strokeWidth={1.5} />
            <span className="text-[10px] font-bold">{reshares}</span>
          </button>
        )}
      </div>

      <div className="flex items-center gap-1">
        <button
          onClick={() => setBookmarked(!bookmarked)}
          aria-label={bookmarked ? "Remove bookmark" : "Bookmark"}
          className={`p-2 transition-all duration-200 active:scale-90 ${
            bookmarked ? "text-primary-gold" : "text-muted-custom hover:text-primary-gold"
          }`}
        >
          <Bookmark size={18} strokeWidth={1.5} fill={bookmarked ? "currentColor" : "none"} />
        </button>
        <button
          aria-label="Share"
          className="p-2 text-muted-custom hover:text-primary-gold transition-colors duration-200 active:scale-90"
        >
          <Share2 size={18} strokeWidth={1.5} />
        </button>
      </div>
    </div>
  );
}
