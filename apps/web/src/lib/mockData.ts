import { PostData } from '@/components/feed/PostCard';

export const MOCK_POSTS: PostData[] = [
  {
    id: "post-1",
    content: "Just landed in Nairobi and the energy is unmatched! Can't wait to see what the tech scene is cooking up this week. 🇰🇪💻",
    media: [
      {
        type: "image",
        src: "https://lh3.googleusercontent.com/aida-public/AB6AXuBLECic1h3_RmmBCR3a-RtvTQ0Mlp9vAvJdiOjQvjqWKEzZblonEM8BOlxN13e_KExcwxhboQoK4L6bmcYazrMAITFLlPRgMV_JRO7SUV2UhKBHZvU0Y0OdFhKY3fJmiU8wC-ozYJU2sYSW9DBy6gSMbYAQuUPJfJJSYI_OvytTuNy6uNoNyRV0Y2IxU-RJQk1TzpAOmRb-PnpfVeRzFApseq087IfteMejjp6WlIPxjmDZa9y0HyIL4yUPKPwejRZbRB1D0cRwD0vR",
        alt: "Nairobi Skyline"
      }
    ],
    contentType: "PHOTO",
    isPinned: false,
    viewCount: 1250,
    createdAt: new Date().toISOString(),
    likesCount: 856,
    repliesCount: 42,
    repostsCount: 12,
    impressions: 1250,
    author: {
      id: "safaricom",
      username: "safaricom",
      fullName: "Safaricom PLC",
      avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuBLECic1h3_RmmBCR3a-RtvTQ0Mlp9vAvJdiOjQvjqWKEzZblonEM8BOlxN13e_KExcwxhboQoK4L6bmcYazrMAITFLlPRgMV_JRO7SUV2UhKBHZvU0Y0OdFhKY3fJmiU8wC-ozYJU2sYSW9DBy6gSMbYAQuUPJfJJSYI_OvytTuNy6uNoNyRV0Y2IxU-RJQk1TzpAOmRb-PnpfVeRzFApseq087IfteMejjp6WlIPxjmDZa9y0HyIL4yUPKPwejRZbRB1D0cRwD0vR",
      isVerified: true,
      isFollowing: false,
      isMuted: false,
      isBlocked: false
    },
    _count: {
      comments: 42,
      interactions: 856,
      reshares: 12
    },
    userInteraction: {
      hasUpvoted: false,
      hasDownvoted: false,
      hasBookmarked: false,
      hasReshared: false
    }
  },
  {
    id: "post-2",
    content: "The new Kihumba Business Dashboard is looking sleek! The modular influencer campaign creation wizard is a game changer for local brands. Big things coming soon. 🚀",
    media: [],
    contentType: "TEXT",
    isPinned: true,
    viewCount: 5400,
    createdAt: new Date(Date.now() - 3600000).toISOString(),
    likesCount: 234,
    repliesCount: 12,
    repostsCount: 5,
    impressions: 5400,
    author: {
      id: "kamau",
      username: "kamau_tech",
      fullName: "Kamau Njoroge",
      avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuCVRxiwOg-pMg1RugKgqUEK8Ym7F6zhwqmTW66fxjBmMCCDC-2m1Jmm4MaL-XvUyvHv5p5qK7hq-QVQQ8NXeIyzm29lnlSCKpOs8VOBvpm-1ApnUCnlOdhM4128QEdeafu1zIzBNwSKarDDznz83zTgi3ZFsuh9xnXeKPttafgG2GbSRguQXTv6cDGo9GuMj4M74ZM6mdCmofTk9j5WRQ84pKaQq-WKTOMkJcgMg6R0E3VrTond77ECUz1sHBIQ66zg6-0megI4KHX3",
      isVerified: false,
      isFollowing: true,
      isMuted: false,
      isBlocked: false
    },
    _count: {
      comments: 12,
      interactions: 234,
      reshares: 5
    },
    userInteraction: {
      hasUpvoted: true,
      hasDownvoted: false,
      hasBookmarked: true,
      hasReshared: false
    }
  },
  {
    id: "post-3",
    content: "Finding a roommate in Juja just got easier. Check out this bedsitter listing on Kao! High-speed WiFi included and very secure. DM for details. 🏠✨",
    media: [
      {
        type: "image",
        src: "https://lh3.googleusercontent.com/aida-public/AB6AXuD47UmisG4EnyDtk6w8-frNvTjUOox1Nq9KP7pRcQcahj5Aq9xVgrZUt3PlAWweTfP9MyAxiEbUGohEz-sGWw478vPjZLrYABOi_YR_jUl_EFYNw1nyvFHf7pP-r3S-7qrSPhPZvM13zNBo7TTkoMEBZ5d_iQi1gP_EJqgncFgYpyuVMd60hgv7dHspw3IhcIwNGLkTm0aq1JTzN5ZQPWx0-6ixWSKZG11wOgaCUsblrT6YvZe6FAlpvOO625x-Ex8oINlT1f6a2Q_K",
        alt: "Modern Bedsitter"
      }
    ],
    contentType: "PHOTO",
    isPinned: false,
    viewCount: 890,
    createdAt: new Date(Date.now() - 7200000).toISOString(),
    likesCount: 88,
    repliesCount: 5,
    repostsCount: 2,
    impressions: 890,
    author: {
      id: "wanjiku",
      username: "wanjiku_realty",
      fullName: "Wanjiku M.",
      avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuD47UmisG4EnyDtk6w8-frNvTjUOox1Nq9KP7pRcQcahj5Aq9xVgrZUt3PlAWweTfP9MyAxiEbUGohEz-sGWw478vPjZLrYABOi_YR_jUl_EFYNw1nyvFHf7pP-r3S-7qrSPhPZvM13zNBo7TTkoMEBZ5d_iQi1gP_EJqgncFgYpyuVMd60hgv7dHspw3IhcIwNGLkTm0aq1JTzN5ZQPWx0-6ixWSKZG11wOgaCUsblrT6YvZe6FAlpvOO625x-Ex8oINlT1f6a2Q_K",
      isVerified: true,
      isFollowing: false,
      isMuted: false,
      isBlocked: false
    },
    _count: {
      comments: 5,
      interactions: 88,
      reshares: 2
    },
    userInteraction: {
      hasUpvoted: false,
      hasDownvoted: false,
      hasBookmarked: false,
      hasReshared: false
    }
  },
  {
    id: "post-4",
    content: "Who's ready for the Kihumba Music Festival? The lineup is absolutely mental! 🎸🔥 #KihumbaFest",
    media: [],
    contentType: "TEXT",
    isPinned: false,
    viewCount: 15600,
    createdAt: new Date(Date.now() - 14400000).toISOString(),
    likesCount: 2450,
    repliesCount: 156,
    repostsCount: 45,
    impressions: 15600,
    author: {
      id: "otieno",
      username: "otieno_vibes",
      fullName: "Otieno O.",
      avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuBtybnJkTWyDCI2riQjGAzSdkmoZlzfkuZE29TFvMwQiFsqXC2oOWNZPMwfOo5n_fpDccgNPiyAxqdPOHH1rzViklqvdAs03Rfd4Ng9YbstNwBw0DBxgFEzHjDeACAMz4ga0nXckhZCayFTNCzQePdENatj_aZfNOIqacLS0sQS-uNxqliYE3NET2ay18WkjX2luD2trZVZYAhmaA7-tFXCgD_tytEbhmkm1DpFE5n4EMatPi8bK-DeQIiUVYZjcRd8U95CGi8Q_XPw",
      isVerified: false,
      isFollowing: false,
      isMuted: false,
      isBlocked: false
    },
    _count: {
      comments: 156,
      interactions: 2450,
      reshares: 45
    },
    userInteraction: {
      hasUpvoted: false,
      hasDownvoted: false,
      hasBookmarked: false,
      hasReshared: false
    }
  }
];
