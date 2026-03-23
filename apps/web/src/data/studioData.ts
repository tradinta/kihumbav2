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
  eligibility: {
    impressions: { current: 850000, required: 500000, passed: true },
    premium: { active: true, passed: true },
    kihumbaScore: { current: 94, required: 85, passed: true },
    isEligible: true,
  },

  analyticsOverview: {
    views28Days: 1250000,
    viewsTrend: 15.2,
    watchTimeHours: 4200,
    watchTimeTrend: 8.4,
    followersGained: 3450,
    followersTrend: 22.1,
    adRevenueKES: 45200,
    adRevenueTrend: 12.5,
    campaignRevenueKES: 120000,
    campaignRevenueTrend: -5.2,
  },

  content: [
    {
      id: "v1",
      title: "Why I Moved to Kilimani: The Honest Truth",
      type: "video",
      date: "Oct 24, 2024",
      views: 145000,
      likes: 12400,
      comments: 890,
      monetized: true,
      revenue: 12500,
      visibility: "public",
      thumbnail: "https://images.unsplash.com/photo-1542361345-89e58247f2d5?q=80&w=400",
    },
    {
      id: "v2",
      title: "5 Best Restaurants in Westlands",
      type: "spark",
      date: "Oct 28, 2024",
      views: 850000,
      likes: 65000,
      comments: 1200,
      monetized: true,
      revenue: 8400, // Sparks pull from creator fund pool
      visibility: "public",
      thumbnail: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=400",
    },
    {
      id: "v3",
      title: "My Workspace Setup 2024",
      type: "video",
      date: "Nov 02, 2024",
      views: 45000,
      likes: 3200,
      comments: 150,
      monetized: false,
      revenue: 0,
      visibility: "private",
      thumbnail: "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?q=80&w=400",
    },
  ] as StudioVideo[],

  campaigns: [
    {
      id: "c1",
      brand: "Safaricom",
      task: "Submit 1x TikTok Draft for 5G Launch",
      status: "Drafting",
      dueDate: "2024-11-25",
      platform: "TikTok",
      payout: 45000,
      brandAvatar: "https://images.unsplash.com/photo-1611162617474-5b21e879e113?q=80&w=100",
    },
    {
      id: "c2",
      brand: "Java House",
      task: "Post Approved Instagram Reel",
      status: "Approved",
      dueDate: "2024-11-22",
      platform: "Instagram",
      payout: 25000,
      brandAvatar: "https://images.unsplash.com/photo-1599566150163-29194dcaad36?q=80&w=100", // placeholder
    },
    {
      id: "c3",
      brand: "Kihumba Premium",
      task: "Creator Spotlight Video",
      status: "Changes Requested",
      dueDate: "2024-11-21",
      platform: "Kihumba",
      payout: 50000,
      brandAvatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=100",
    },
  ] as StudioCampaign[],

  recentPayouts: [
    { id: "p1", source: "AdSense (Oct)", amount: 42000, date: "Nov 01, 2024", status: "Paid" },
    { id: "p2", source: "KCB Bank Campaign", amount: 60000, date: "Oct 28, 2024", status: "Paid" },
    { id: "p3", source: "AdSense (Sep)", amount: 38500, date: "Oct 01, 2024", status: "Paid" },
  ]
};
