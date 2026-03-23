"use client";

import Link from "next/link";
import { MoreHorizontal, BadgeCheck } from "lucide-react";
import ImpressionsBar from "./ImpressionsBar";
import InteractionBar from "./InteractionBar";

export interface PostData {
  id: string;
  type: "sponsored" | "user";
  author: {
    name: string;
    handle?: string;
    avatar: string;
    verified: boolean;
  };
  content: string;
  media?: {
    src: string;
    alt: string;
    aspect?: "video" | "square";
    badge?: string;
  };
  impressions: {
    count: string;
    icon?: "chart" | "eye";
    trending?: string;
  };
  interactions: {
    likes: string;
    comments?: string;
    reshares?: string;
    likeIcon?: "thumb_up" | "favorite";
    liked?: boolean;
  };
  timestamp?: string;
}

interface PostCardProps {
  post: PostData;
  index: number;
}

function profileHref(handle?: string) {
  if (!handle) return '#';
  return `/profile/${handle.replace('@', '')}`;
}

export default function PostCard({ post, index }: PostCardProps) {
  return (
    <article
      className="card-surface rounded-xl overflow-hidden shadow-sm animate-fade-in-up"
      style={{ animationDelay: `${index * 100}ms` }}
    >
      {post.type === "sponsored" ? (
        <div className="p-4 flex items-center justify-between">
          <div className="flex gap-3">
            <Link href={profileHref(post.author.handle)} className="shrink-0">
              <div className="size-10 rounded bg-black/40 flex items-center justify-center border border-primary-gold/20">
                <img alt={post.author.name} className="w-7 h-7 object-contain" src={post.author.avatar} />
              </div>
            </Link>
            <div>
              <div className="flex items-center gap-1.5">
                <Link href={profileHref(post.author.handle)} className="hover:text-primary-gold transition-colors">
                  <h3 className="font-bold text-sm tracking-tight">{post.author.name}</h3>
                </Link>
                {post.author.verified && <BadgeCheck size={14} className="text-primary-gold fill-primary-gold stroke-[var(--card-bg)]" />}
              </div>
              <p className="text-[9px] uppercase font-bold text-muted-custom tracking-widest">Sponsored</p>
            </div>
          </div>
          <button aria-label="More options" className="text-muted-custom">
            <MoreHorizontal size={20} strokeWidth={1.5} />
          </button>
        </div>
      ) : (
        <div className="p-4 flex items-center gap-3">
          <Link href={profileHref(post.author.handle)} className="shrink-0">
            <div className="size-10 rounded-full border border-primary-gold/40 p-0.5">
              <img alt={post.author.name} className="w-full h-full object-cover rounded-full" src={post.author.avatar} />
            </div>
          </Link>
          <div className="flex-1">
            <div className="flex items-center justify-between">
              <Link href={profileHref(post.author.handle)} className="hover:text-primary-gold transition-colors">
                <h3 className="font-bold text-sm tracking-tight">{post.author.name}</h3>
              </Link>
              {post.timestamp && <span className="text-[9px] uppercase font-bold text-muted-custom">{post.timestamp}</span>}
            </div>
            {post.author.handle && (
              <Link href={profileHref(post.author.handle)}>
                <p className="text-[10px] text-primary-gold font-bold hover:underline">{post.author.handle}</p>
              </Link>
            )}
          </div>
        </div>
      )}

      {/* Clickable content → post details */}
      <Link href={`/post/${post.id}`}>
        {post.type === "user" && (
          <div className="px-4 pb-4">
            <p className="text-sm font-light leading-relaxed">{post.content}</p>
          </div>
        )}

        {post.media && (
          <div className={`w-full bg-black/20 relative overflow-hidden ${
            post.media.aspect === "square" ? "aspect-square" : "aspect-video"
          }`}>
            <img
              alt={post.media.alt}
              className={`w-full h-full object-cover ${post.type === "user" ? "opacity-90" : ""}`}
              src={post.media.src}
              loading="lazy"
            />
            {post.media.badge && (
              <div className="absolute bottom-3 left-3 bg-black/60 backdrop-blur-md border border-primary-gold/20 px-3 py-1.5 rounded-lg">
                <span className="text-[9px] font-bold text-primary-gold uppercase tracking-[0.2em]">{post.media.badge}</span>
              </div>
            )}
          </div>
        )}
      </Link>

      <ImpressionsBar count={post.impressions.count} icon={post.impressions.icon} trending={post.impressions.trending} />
      <InteractionBar
        likes={post.interactions.likes}
        comments={post.interactions.comments}
        reshares={post.interactions.reshares}
        likeIcon={post.interactions.likeIcon}
        liked={post.interactions.liked}
      />
    </article>
  );
}
