// ─── Chat Mock Data ──────────────────────────────────────────────────────────

export interface ChatUser {
  id: number;
  name: string;
  avatar?: string;
}

export interface GroupMember {
  id: number;
  name: string;
  avatar: string;
  isVerified: boolean;
  role?: 'admin' | 'member';
}

export interface Story {
  id: number;
  type: 'add' | 'story';
  name?: string;
  avatar?: string;
  viewed?: boolean;
  isPremium?: boolean;
}

export interface Chat {
  id: number;
  type: 'dm' | 'group' | 'anon';
  name: string;
  avatar: string | null;
  lastMsg: string;
  time: string;
  unread: number;
  isPremium: boolean;
  isAnon: boolean;
  members?: number;
  groupMembers?: GroupMember[];
}

export interface EmbeddedPost {
  type: 'kihumba_post';
  author: string;
  authorAvatar: string;
  content: string;
  image?: string;
  likes: number;
  comments: number;
}

export interface EmbeddedMarketListing {
  type: 'market_listing';
  id: string;
  title: string;
  price: number;
  image: string;
  seller: string;
  isVerified: boolean;
  condition: string;
}

export interface EmbeddedKaoListing {
  type: 'kao_listing';
  id: string;
  title: string;
  price: number;
  image: string;
  area: string;
  county: string;
  bedrooms: string;
}

export interface PollData {
  question: string;
  options: { label: string; votes: number }[];
  totalVotes: number;
}

export interface Message {
  id: number;
  senderId: number;
  senderName?: string;
  senderAvatar?: string;
  senderVerified?: boolean;
  text: string;
  type: string;
  time: string;
  replyTo?: Message | null;
  mediaUrl?: string;
  options?: string[];
  contactName?: string;
  postTitle?: string;
  embeddedPost?: EmbeddedPost;
  embeddedMarket?: EmbeddedMarketListing;
  embeddedKao?: EmbeddedKaoListing;
  pollData?: PollData;
}

export const currentUser: ChatUser = {
  id: 0,
  name: "You",
};

export const stories: Story[] = [
  { id: 1, type: 'add' },
  { id: 2, type: 'story', name: 'Elena', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=200', viewed: false, isPremium: true },
  { id: 3, type: 'story', name: 'Marcus', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200', viewed: false, isPremium: false },
  { id: 4, type: 'story', name: 'Studio', avatar: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=200', viewed: true, isPremium: true },
  { id: 5, type: 'story', name: 'Sarah', avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=200', viewed: true, isPremium: false },
];

// ─── Group members for Design Sync group ─────────────────────────────────────
const designSyncMembers: GroupMember[] = [
  { id: 0, name: 'You', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200', isVerified: false, role: 'admin' },
  { id: 10, name: 'Elena Voss', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=200', isVerified: true, role: 'admin' },
  { id: 11, name: 'Marcus Webb', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200', isVerified: false, role: 'member' },
  { id: 12, name: 'Sarah Kimani', avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=200', isVerified: true, role: 'member' },
  { id: 13, name: 'James Odhiambo', avatar: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?q=80&w=200', isVerified: true, role: 'member' },
];

export const initialChats: Chat[] = [
  { id: 1, type: 'dm', name: 'Elena Voss', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=200', lastMsg: 'Check out this listing I found! 🏠', time: '2m', unread: 2, isPremium: true, isAnon: false },
  { id: 2, type: 'group', name: 'Design Sync', avatar: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=200', lastMsg: 'Sarah: Vote on the poll! 📊', time: '1h', unread: 3, isPremium: false, isAnon: false, members: 5, groupMembers: designSyncMembers },
  { id: 3, type: 'anon', name: 'Neon Fox', avatar: null, lastMsg: 'Are we still on for the confidential launch?', time: '3h', unread: 1, isPremium: false, isAnon: true },
  { id: 4, type: 'dm', name: 'Marcus Webb', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200', lastMsg: "Let's catch up tomorrow morning.", time: '1d', unread: 0, isPremium: false, isAnon: false },
  { id: 5, type: 'group', name: 'Engineering', avatar: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=200', lastMsg: 'Deployment successful. No downtime.', time: '2d', unread: 0, isPremium: false, isAnon: false, members: 12 },
  { id: 6, type: 'dm', name: 'Sarah Kimani', avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=200', lastMsg: 'Thanks for the update!', time: '3d', unread: 0, isPremium: true, isAnon: false },
];

// ─── DM Messages (Elena — includes embedded content) ─────────────────────────
export const dmMessages: Message[] = [
  {
    id: 1, senderId: 1, text: "Hey! Have you seen the latest Kihumba post?", time: "10:23 AM", type: 'text',
  },
  {
    id: 2, senderId: 1, text: "", time: "10:24 AM", type: 'embedded_post',
    embeddedPost: {
      type: 'kihumba_post',
      author: 'Kihumba Official',
      authorAvatar: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?q=80&w=100',
      content: 'Marketplace is now LIVE! 🚀 Buy, sell, and barter with your community. Verified sellers get the gold checkmark.',
      image: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?q=80&w=600',
      likes: 342,
      comments: 87,
    },
  },
  {
    id: 3, senderId: 0, text: "That's amazing! I actually just listed something on the marketplace.", time: "10:25 AM", type: 'text',
  },
  {
    id: 4, senderId: 0, text: "", time: "10:25 AM", type: 'embedded_market',
    embeddedMarket: {
      type: 'market_listing',
      id: 'm1',
      title: 'iPhone 14 Pro Max 256GB',
      price: 95000,
      image: 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?auto=format&fit=crop&q=80&w=600',
      seller: 'TechHub KE',
      isVerified: true,
      condition: 'Like New',
    },
  },
  {
    id: 5, senderId: 1, text: "Nice! Also, check out this listing I found on Kao 🏠", time: "10:26 AM", type: 'text',
  },
  {
    id: 6, senderId: 1, text: "", time: "10:26 AM", type: 'embedded_kao',
    embeddedKao: {
      type: 'kao_listing',
      id: '1',
      title: 'Modern 1BR in Kilimani',
      price: 35000,
      image: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&q=80&w=600',
      area: 'Kilimani',
      county: 'Nairobi',
      bedrooms: '1 Bedroom',
    },
  },
  {
    id: 7, senderId: 0, text: "That rent is actually reasonable for Kilimani!", time: "10:27 AM", type: 'text',
    replyTo: { id: 6, senderId: 1, text: "", time: "10:26 AM", type: 'embedded_kao', senderName: 'Elena Voss' } as Message,
  },
  {
    id: 8, senderId: 1, text: "Right?! I might schedule a viewing through Kao. The Sacco delivery for marketplace items is genius too.", time: "10:28 AM", type: 'text',
    replyTo: { id: 7, senderId: 0, text: "That rent is actually reasonable for Kilimani!", time: "10:27 AM", type: 'text' } as Message,
  },
];

// ─── Group Messages (Design Sync — with sender attribution + poll) ───────────
export const groupMessages: Message[] = [
  {
    id: 101, senderId: 10, senderName: 'Elena Voss', senderAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=200', senderVerified: true,
    text: "Morning everyone! 👋 Let's sync on the new design system.", time: "9:00 AM", type: 'text',
  },
  {
    id: 102, senderId: 11, senderName: 'Marcus Webb', senderAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200', senderVerified: false,
    text: "Dropped the Figma link in the drive. The new gold accent system looks 🔥", time: "9:05 AM", type: 'text',
  },
  {
    id: 103, senderId: 13, senderName: 'James Odhiambo', senderAvatar: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?q=80&w=200', senderVerified: true,
    text: "Love it. Here's the post I made about the marketplace launch:", time: "9:10 AM", type: 'text',
  },
  {
    id: 104, senderId: 13, senderName: 'James Odhiambo', senderAvatar: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?q=80&w=200', senderVerified: true,
    text: "", time: "9:11 AM", type: 'embedded_post',
    embeddedPost: {
      type: 'kihumba_post',
      author: 'James Odhiambo',
      authorAvatar: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?q=80&w=100',
      content: 'Just tried the new Kihumba Marketplace — the barter system is a game changer! Traded my old PS4 for a standing desk 🎮➡️🪑',
      likes: 56,
      comments: 12,
    },
  },
  {
    id: 105, senderId: 12, senderName: 'Sarah Kimani', senderAvatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=200', senderVerified: true,
    text: "Okay team, quick poll — which color scheme should we go with?", time: "9:15 AM", type: 'text',
  },
  {
    id: 106, senderId: 12, senderName: 'Sarah Kimani', senderAvatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=200', senderVerified: true,
    text: "", time: "9:16 AM", type: 'poll',
    pollData: {
      question: 'Which accent color for the new design system?',
      options: [
        { label: '🟡 Classic Gold (#c5a059)', votes: 14 },
        { label: '🟢 Emerald + Gold', votes: 8 },
        { label: '⚫ Matte Black + Gold', votes: 11 },
        { label: '🔵 Ocean Blue + Gold', votes: 3 },
      ],
      totalVotes: 36,
    },
  },
  {
    id: 107, senderId: 0, text: "Classic Gold all the way! It's our identity 🏆", time: "9:20 AM", type: 'text',
    replyTo: { id: 106, senderId: 12, text: "", time: "9:16 AM", type: 'poll', senderName: 'Sarah Kimani' } as Message,
  },
  {
    id: 108, senderId: 10, senderName: 'Elena Voss', senderAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=200', senderVerified: true,
    text: "Agreed. Also found us a team apartment for the retreat:", time: "9:25 AM", type: 'text',
  },
  {
    id: 109, senderId: 10, senderName: 'Elena Voss', senderAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=200', senderVerified: true,
    text: "", time: "9:25 AM", type: 'embedded_kao',
    embeddedKao: {
      type: 'kao_listing',
      id: '2',
      title: 'Spacious 3BR in Karen with Garden',
      price: 75000,
      image: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&q=80&w=600',
      area: 'Karen',
      county: 'Nairobi',
      bedrooms: '3 Bedrooms',
    },
  },
];

// Default messages for initial load (DM with Elena)
export const initialMessages = dmMessages;
