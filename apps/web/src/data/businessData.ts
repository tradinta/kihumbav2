export interface BasicAdCampaign {
  id: string;
  name: string;
  type: string;
  spend: number;
  reach: number;
  clicks: number;
  cpc: number;
  status: "Active" | "Paused" | "Completed";
}

export interface InfluencerCampaign {
  id: string;
  creator: {
    name: string;
    handle: string;
    avatar: string;
  };
  task: string;
  platform: string;
  budget: number;
  status: "Awaiting Acceptance" | "Drafting" | "Review Required" | "Published";
  dueDate: string;
}

export const businessData = {
  wallet: {
    availableBalanceKES: 450000,
    totalSpentYTD: 1250000,
    lastDepositAmount: 50000,
    lastDepositDate: "Nov 02, 2024",
  },
  
  overview: {
    totalActiveAds: 4,
    totalActiveInfluencers: 2,
    totalReach30d: 3200000,
    reachTrend: 15.4,
    totalConversions30d: 12500,
    conversionTrend: 8.2,
    avgCPC: 4.5, // KES
    cpcTrend: -2.1,
  },

  activeAds: [
    {
      id: "ad1",
      name: "November Flash Sale (Feed)",
      type: "Post Ads",
      spend: 12500,
      reach: 45000,
      clicks: 3200,
      cpc: 3.9,
      status: "Active",
    },
    {
      id: "ad2",
      name: "Luxury Estate Boost",
      type: "Kao Featured",
      spend: 45000,
      reach: 125000,
      clicks: 8500,
      cpc: 5.2,
      status: "Active",
    },
    {
      id: "ad3",
      name: "Weekend Deals Story",
      type: "Stories Ads",
      spend: 8000,
      reach: 22000,
      clicks: 1100,
      cpc: 7.2,
      status: "Paused",
    },
  ] as BasicAdCampaign[],

  influencerCampaigns: [
    {
      id: "inf1",
      creator: {
        name: "Kamau Njoroge",
        handle: "kamau_n",
        avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=100",
      },
      task: "Submit 1x TikTok Draft for 5G Launch",
      platform: "TikTok",
      budget: 45000,
      status: "Drafting",
      dueDate: "2024-11-25",
    },
    {
      id: "inf2",
      creator: {
        name: "Amina Hassan",
        handle: "amina_h",
        avatar: "https://images.unsplash.com/photo-1531123897727-8f129e1b4dce?q=80&w=100",
      },
      task: "Post Approved Instagram Reel",
      platform: "Instagram",
      budget: 25000,
      status: "Review Required",
      dueDate: "2024-11-22",
    },
  ] as InfluencerCampaign[],

  directory: [
    {
      id: "cr1",
      name: "Kamau Njoroge",
      handle: "kamau_n",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=100",
      niche: "Tech & Lifestyle",
      followers: 125000,
      trustScore: 94,
      minimumRate: 25000,
    },
    {
      id: "cr2",
      name: "Amina Hassan",
      handle: "amina_h",
      avatar: "https://images.unsplash.com/photo-1531123897727-8f129e1b4dce?q=80&w=100",
      niche: "Fashion & Beauty",
      followers: 450000,
      trustScore: 98,
      minimumRate: 50000,
    },
    {
      id: "cr3",
      name: "Brian Omondi",
      handle: "brian_o",
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=100",
      niche: "Real Estate",
      followers: 25000,
      trustScore: 88,
      minimumRate: 15000,
    },
  ]
};
