export const growthData = {
  eligibility: {
    impressions: { current: 520400, required: 500000, passed: true },
    premium: { active: true, passed: true },
    kihumbaScore: { current: 92, required: 85, passed: true },
    isEligible: true,
  },

  creatorAnalytics: {
    totalEarnings: 82500,
    avgEngagement: 9.8,
    engagementTrend: 0.5,
    campaignsWon: 4,
    successScore: 98,
  },

  activeTasks: [
    {
      id: "t1",
      campaign: "Safaricom 5G Launch",
      task: "Submit 1x TikTok Draft",
      status: "Pending",
      dueDate: "2024-11-25",
      platform: "TikTok",
      reward: 15000,
    },
    {
      id: "t2",
      campaign: "Java House Coffee",
      task: "Post Approved Instagram Reel",
      status: "Approved",
      dueDate: "2024-11-22",
      platform: "Instagram",
      reward: 8500,
    },
    {
      id: "t3",
      campaign: "Java House Coffee",
      task: "Submit 2x Story Drafts",
      status: "Submitted",
      dueDate: "2024-11-21",
      platform: "Instagram",
      reward: 12000,
    },
  ],

  recentEarnings: [
    { id: "e1", campaign: "KCB Bank Campaign", amount: 15000, date: "2024-11-18" },
    { id: "e2", campaign: "Odibets Partnership", amount: 25000, date: "2024-11-12" },
    { id: "e3", campaign: "East Africa Breweries", amount: 40000, date: "2024-11-05" },
  ],

  activeAds: [
    { id: "a1", name: "iPhone 14 Pro Sell", type: "Marketplace Boost", spend: 1200, impressions: "14.2k", clicks: 342, status: "Active" },
    { id: "a2", name: "Kilimani 2BR Rental", type: "Kao Featured", spend: 3500, impressions: "8.9k", clicks: 124, status: "Active" },
    { id: "a3", name: "New Delivery Service", type: "Feed Post", spend: 8900, impressions: "45.1k", clicks: 892, status: "Completed" },
  ]
};
