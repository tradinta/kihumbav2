// Shared TypeScript types used by both the web and API packages.

// ─── User ────────────────────────────────────────────────────────────────────

export type Tier = 'PLEBIAN' | 'CITIZEN' | 'PATRICIAN' | 'TYCOON';
export type Gender = 'MALE' | 'FEMALE' | 'OTHER' | 'PREFER_NOT_TO_SAY';

export interface UserProfile {
  id: string;
  username: string;
  fullName: string | null;
  email: string | null;
  avatar: string | null;
  bio: string | null;
  tier: Tier;
  county: string | null;
  gender: Gender | null;
  profileComplete: boolean;
  isVerified: boolean;
  isBanned: boolean;
  createdAt: string;
  _count?: {
    followers: number;
    following: number;
    posts: number;
  };
  isFollowing?: boolean;
  isBlocked?: boolean;
}

// ─── Post ─────────────────────────────────────────────────────────────────────

export type ContentType = 'TEXT' | 'PHOTO' | 'POLL';

export interface Post {
  id: string;
  content: string;
  imageUrl: string | null;
  contentType: ContentType;
  isPinned: boolean;
  isDeleted: boolean;
  createdAt: string;
  author: Pick<UserProfile, 'id' | 'username' | 'fullName' | 'avatar' | 'tier' | 'isVerified'>;
  _count: {
    comments: number;
    upvotes: number;
    downvotes: number;
    reshares: number;
    bookmarks: number;
    views: number;
  };
  userInteraction?: {
    hasUpvoted: boolean;
    hasDownvoted: boolean;
    hasBookmarked: boolean;
  };
}

// ─── Comment ──────────────────────────────────────────────────────────────────

export interface Comment {
  id: string;
  content: string;
  createdAt: string;
  author: Pick<UserProfile, 'id' | 'username' | 'fullName' | 'avatar' | 'isVerified'>;
  parentId: string | null;
  replies?: Comment[];
  _count: {
    upvotes: number;
    replies: number;
  };
  userInteraction?: {
    hasUpvoted: boolean;
  };
}

// ─── API Helpers ─────────────────────────────────────────────────────────────

export interface PaginatedResponse<T> {
  data: T[];
  nextCursor: string | null;
  hasMore: boolean;
  total?: number;
}

export interface ApiResponse<T = unknown> {
  data?: T;
  message?: string;
  error?: string;
}

// ─── Auth ─────────────────────────────────────────────────────────────────────

export interface AuthTokenPayload {
  sub: string;       // User ID (Postgres)
  username: string;
  email: string | null;
  tier: Tier;
  iat: number;
  exp: number;
}

export interface LoginResponse {
  access_token: string;
  user: UserProfile;
}

export interface SignupDto {
  email: string;
  password: string;
  phoneNumber?: string;
}

export interface OnboardingDto {
  username: string;
  fullName?: string;
  dateOfBirth: string;
  gender: Gender;
  county: string;
}
