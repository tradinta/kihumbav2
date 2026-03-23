// ─── Post & Comments Mock Data ───────────────────────────────────────────────

import { PostData } from "@/components/feed/PostCard";

export interface CommentData {
  id: string;
  author: {
    name: string;
    handle: string;
    avatar: string;
    verified: boolean;
  };
  content: string;
  timestamp: string;
  likes: string;
  replies?: number;
}

export const mockPost: PostData = {
  id: "1",
  type: "user",
  author: {
    name: "Kamau Njoroge",
    handle: "@kamau_n",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=400",
    verified: true,
  },
  content: "Nairobi skyline hitting different tonight. Westlands energy is unmatched! 🏙️✨",
  media: {
    src: "https://images.unsplash.com/photo-1611348586804-61bf6c080437?auto=format&fit=crop&q=80&w=800",
    alt: "Nairobi skyline at night from Westlands",
    aspect: "square",
  },
  impressions: { count: "8,924", icon: "eye" },
  interactions: { likes: "892", likeIcon: "favorite", liked: true, comments: "45", reshares: "12" },
  timestamp: "2h ago",
};

export const mockComments: CommentData[] = [
  {
    id: "c1",
    author: { name: "Elena Voss", handle: "@elena_voss", avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=100", verified: true },
    content: "Absolutely stunning! Makes me miss home even more. 😢",
    timestamp: "1h ago",
    likes: "24",
    replies: 2,
  },
  {
    id: "c2",
    author: { name: "James Odhiambo", handle: "@james_o", avatar: "https://images.unsplash.com/photo-1599566150163-29194dcaad36?q=80&w=100", verified: true },
    content: "Which building did you take this from? The angle is perfect.",
    timestamp: "45m ago",
    likes: "12",
  },
  {
    id: "c3",
    author: { name: "Sarah Kimani", handle: "@sarah_k", avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=100", verified: true },
    content: "Westlands never sleeps. What a vibe! 🔥",
    timestamp: "20m ago",
    likes: "8",
  },
];
