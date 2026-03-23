// ─── Profile Mock Data & Types ───────────────────────────────────────────────

export type Tier = 'PLEBIAN' | 'CITIZEN' | 'PATRICIAN' | 'TYCOON';

export interface ProfileUser {
  id: string;
  username: string;
  fullName: string;
  avatar: string;
  coverPhoto: string;
  bio: string;
  county: string;
  country: string;
  tier: Tier;
  isVerified: boolean;
  isVerifiedSeller: boolean;
  joinedDate: string;
  website?: string;
  kihumbaScore: number;
  stats: {
    posts: number;
    followers: number;
    following: number;
    deals: number;
  };
  scoreBreakdown: {
    trust: number;
    activity: number;
    community: number;
    marketplace: number;
  };
}

export interface Achievement {
  id: string;
  label: string;
  icon: string; // emoji
  earned: boolean;
}

export interface ProfilePost {
  id: string;
  type: 'user';
  isPinned?: boolean;
  author: {
    name: string;
    handle: string;
    avatar: string;
    verified: boolean;
  };
  content: string;
  media?: {
    src: string;
    alt: string;
    aspect?: 'video' | 'square';
  };
  impressions: { count: string; icon?: 'chart' | 'eye' };
  interactions: { likes: string; comments?: string; reshares?: string; likeIcon?: 'thumb_up' | 'favorite'; liked?: boolean };
  timestamp: string;
}

export interface ProfileListing {
  id: string;
  title: string;
  price: number;
  image: string;
  condition: string;
  tradeType: 'SELL' | 'BOTH';
}

export interface ProfileReview {
  author: string;
  avatar: string;
  rating: number;
  comment: string;
  time: string;
}

export interface ProfileProperty {
  id: string;
  title: string;
  price: number;
  image: string;
  area: string;
  county: string;
  bedrooms: string;
}

export interface SimilarProfile {
  id: string;
  username: string;
  fullName: string;
  avatar: string;
  isVerified: boolean;
  mutualFollowers: number;
}

// ─── Mock User ───────────────────────────────────────────────────────────────

export const TIER_COLORS: Record<Tier, string> = {
  PLEBIAN: '#888888',
  CITIZEN: '#c5a059',
  PATRICIAN: '#e2c27d',
  TYCOON: '#ffd700',
};

export const mockUser: ProfileUser = {
  id: 'u1',
  username: 'kamau_n',
  fullName: 'Kamau Njoroge',
  avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=400',
  coverPhoto: 'https://images.unsplash.com/photo-1611348586804-61bf6c080437?auto=format&fit=crop&q=80&w=1200',
  bio: 'Building the future of Kenyan social commerce. Nairobi tech scene 🇰🇪 | Marketplace power seller | Open to barter trades.',
  county: 'Nairobi',
  country: 'Kenya',
  tier: 'PATRICIAN',
  isVerified: true,
  isVerifiedSeller: true,
  joinedDate: 'January 2025',
  website: 'kamau.dev',
  kihumbaScore: 92,
  stats: {
    posts: 142,
    followers: 2438,
    following: 384,
    deals: 67,
  },
  scoreBreakdown: {
    trust: 95,
    activity: 88,
    community: 91,
    marketplace: 94,
  },
};

export const mutualFollowers: { name: string; avatar: string }[] = [
  { name: 'Elena Voss', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=100' },
  { name: 'Sarah Kimani', avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=100' },
  { name: 'James O.', avatar: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?q=80&w=100' },
];

// ─── Posts ────────────────────────────────────────────────────────────────────

export const userPosts: ProfilePost[] = [
  {
    id: 'p0', type: 'user', isPinned: true,
    author: { name: 'Kamau Njoroge', handle: '@kamau_n', avatar: mockUser.avatar, verified: true },
    content: '🚀 Just launched my verified seller storefront on Kihumba Marketplace! Every item comes with receipt + warranty. Open to barter trades too.',
    media: { src: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?q=80&w=600', alt: 'Marketplace launch', aspect: 'video' },
    impressions: { count: '12.4k', icon: 'chart' },
    interactions: { likes: '1,247', comments: '89', reshares: '34', likeIcon: 'favorite', liked: false },
    timestamp: '3d ago',
  },
  {
    id: 'p1', type: 'user',
    author: { name: 'Kamau Njoroge', handle: '@kamau_n', avatar: mockUser.avatar, verified: true },
    content: 'Nairobi skyline hitting different tonight. Westlands energy is unmatched! 🏙️✨',
    media: { src: 'https://images.unsplash.com/photo-1611348586804-61bf6c080437?auto=format&fit=crop&q=80&w=800', alt: 'Nairobi skyline', aspect: 'video' },
    impressions: { count: '8,924', icon: 'eye' },
    interactions: { likes: '892', likeIcon: 'favorite', liked: true },
    timestamp: '2h ago',
  },
  {
    id: 'p2', type: 'user',
    author: { name: 'Kamau Njoroge', handle: '@kamau_n', avatar: mockUser.avatar, verified: true },
    content: 'The Sacco delivery integration on Kihumba is a game-changer. Had a package delivered from Mombasa in 2 days via a matatu Sacco. KES 200. 👏',
    impressions: { count: '5,612', icon: 'eye' },
    interactions: { likes: '456', comments: '23', likeIcon: 'thumb_up' },
    timestamp: '1d ago',
  },
  {
    id: 'p3', type: 'user',
    author: { name: 'Kamau Njoroge', handle: '@kamau_n', avatar: mockUser.avatar, verified: true },
    content: 'Found a 2BR in Kilimani for 35k through Kao. No deposit, 24/7 water. If you know, you know. 🏠💧',
    impressions: { count: '3,201', icon: 'eye' },
    interactions: { likes: '234', comments: '45', reshares: '12', likeIcon: 'favorite' },
    timestamp: '4d ago',
  },
];

// ─── Marketplace ─────────────────────────────────────────────────────────────

export const userListings: ProfileListing[] = [
  { id: 'm1', title: 'iPhone 14 Pro Max 256GB', price: 95000, image: 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?auto=format&fit=crop&q=80&w=400', condition: 'Like New', tradeType: 'SELL' },
  { id: 'm2', title: 'Samsung 55" Smart TV', price: 45000, image: 'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?auto=format&fit=crop&q=80&w=400', condition: 'New', tradeType: 'SELL' },
  { id: 'm3', title: 'PS5 + 3 Games Bundle', price: 68000, image: 'https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?auto=format&fit=crop&q=80&w=400', condition: 'Like New', tradeType: 'BOTH' },
  { id: 'm4', title: 'MacBook Air M2 256GB', price: 120000, image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&q=80&w=400', condition: 'Good', tradeType: 'BOTH' },
];

export const userReviews: ProfileReview[] = [
  { author: 'James M.', avatar: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?q=80&w=100', rating: 5, comment: 'Super legit. Got my iPhone sealed with warranty card.', time: '1 week ago' },
  { author: 'Grace W.', avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=100', rating: 5, comment: 'Fast responses, item exactly as described. Will buy again.', time: '2 weeks ago' },
  { author: 'Kevin O.', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=100', rating: 4, comment: 'Good seller. Delivery took a bit longer but item was perfect.', time: '1 month ago' },
];

// ─── Kao ─────────────────────────────────────────────────────────────────────

export const userProperties: ProfileProperty[] = [
  { id: 'k1', title: 'Modern 1BR in Kilimani', price: 35000, image: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&q=80&w=400', area: 'Kilimani', county: 'Nairobi', bedrooms: '1 Bedroom' },
  { id: 'k2', title: 'Cozy Studio in Westlands', price: 22000, image: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&q=80&w=400', area: 'Westlands', county: 'Nairobi', bedrooms: 'Studio' },
];

// ─── About ───────────────────────────────────────────────────────────────────

export const userInterests = ['Tech', 'Startups', 'Photography', 'Barter Trading', 'Nairobi Nightlife', 'Real Estate', 'Gaming'];

export const userGroups = [
  { name: 'Nairobi Tech Hub', members: 1240 },
  { name: 'Kihumba Sellers', members: 430 },
  { name: 'Kilimani Rentals', members: 890 },
];

// ─── Achievements ────────────────────────────────────────────────────────────

export const achievements: Achievement[] = [
  { id: 'a1', label: 'Early Adopter', icon: '🌱', earned: true },
  { id: 'a2', label: 'Verified Seller', icon: '✅', earned: true },
  { id: 'a3', label: '50+ Deals', icon: '🤝', earned: true },
  { id: 'a4', label: 'Top Trader', icon: '🔄', earned: true },
  { id: 'a5', label: 'Community Voice', icon: '📢', earned: true },
  { id: 'a6', label: '1K Followers', icon: '👥', earned: true },
  { id: 'a7', label: 'Kao Explorer', icon: '🏠', earned: false },
  { id: 'a8', label: 'Tycoon Tier', icon: '👑', earned: false },
];

// ─── Similar Profiles ────────────────────────────────────────────────────────

export const similarProfiles: SimilarProfile[] = [
  { id: 's1', username: 'elena_voss', fullName: 'Elena Voss', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=200', isVerified: true, mutualFollowers: 8 },
  { id: 's2', username: 'sarah_k', fullName: 'Sarah Kimani', avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=200', isVerified: true, mutualFollowers: 5 },
  { id: 's3', username: 'james_o', fullName: 'James Odhiambo', avatar: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?q=80&w=200', isVerified: true, mutualFollowers: 12 },
];
