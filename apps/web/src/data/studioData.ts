export interface StudioVideo {
  id: string;
  title: string;
  type: "video" | "spark";
  date: string;
  views: number;
  likes: number;
  comments: number;
  monetized: boolean;
  revenue: number;
  visibility: "public" | "private" | "unlisted";
  thumbnail: string;
  impressions: number;
  ctr: number;
  avgViewDuration: string;
  retention: number[];
}

export interface StudioCampaign {
  id: string;
  brand: string;
  task: string;
  status: "Drafting" | "Submitted" | "Changes Requested" | "Approved";
  dueDate: string;
  platform: string;
  payout: number;
  brandAvatar: string;
}

export const studioData = {
  // Master Analytics Pulse (Empty Fallback)
  analytics: {
    totalViews: 0,
    viewsTrend: 0,
    impressions: 0,
    ctr: 0,
    watchTimeHours: 0,
    watchTimeTrend: 0,
    newSubscribers: 0,
    subsTrend: 0,
    estimatedEarnings: 0,
    earningsTrend: 0,
  },

  // Legacy Analytic Overview (Empty Fallback)
  analyticsOverview: {
    views28Days: 0,
    viewsTrend: 0,
    watchTimeHours: 0,
    watchTimeTrend: 0,
    followersGained: 0,
    followersTrend: 0,
    adRevenueKES: 0,
    adRevenueTrend: 0,
    campaignRevenueKES: 0,
    campaignRevenueTrend: 0,
  },

  // Eligibility Data
  eligibility: {
    impressions: { current: 0, required: 500000, passed: false },
    premium: { active: false, passed: false },
    kihumbaScore: { current: 50, required: 85, passed: false },
    isEligible: false,
  },

  // Audience activity pulse
  audienceHeatmap: Array(24).fill(0),

  // Empty Content Catalogs
  content: [] as StudioVideo[],
  campaigns: [] as StudioCampaign[],
  payouts: [],
  recentPayouts: []
};
