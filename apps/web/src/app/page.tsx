"use client";

import { useState, useEffect } from "react";
import LeftSidebar from "@/components/LeftSidebar";
import RightSidebar from "@/components/RightSidebar";
import BottomNav from "@/components/BottomNav";
import TopBar from "@/components/TopBar";
import ModeSelector, { type Mode } from "@/components/ModeSelector";
import StoriesBar from "@/components/feed/StoriesBar";
import PostCard, { type PostData } from "@/components/feed/PostCard";
import SkeletonCard from "@/components/feed/SkeletonCard";
import SparksGrid from "@/components/feed/SparksGrid";
import VideosGrid from "@/components/feed/VideosGrid";

const SAMPLE_POSTS: PostData[] = [
  {
    id: "1",
    type: "sponsored",
    author: {
      name: "Safaricom PLC",
      handle: "@Safaricom",
      avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuBLECic1h3_RmmBCR3a-RtvTQ0Mlp9vAvJdiOjQvjqWKEzZblonEM8BOlxN13e_KExcwxhboQoK4L6bmcYazrMAITFLlPRgMV_JRO7SUV2UhKBHZvU0Y0OdFhKY3fJmiU8wC-ozYJU2sYSW9DBy6gSMbYAQuUPJfJJSYI_OvytTuNy6uNoNyRV0Y2IxU-RJQk1TzpAOmRb-PnpfVeRzFApseq087IfteMejjp6WlIPxjmDZa9y0HyIL4yUPKPwejRZbRB1D0cRwD0vR",
      verified: true,
    },
    content: "Experience the magic of the wild from the comfort of your phone. Join us for the live stream of the Great Migration this weekend.",
    media: {
      src: "https://lh3.googleusercontent.com/aida-public/AB6AXuBtybnJkTWyDCI2riQjGAzSdkmoZlzfkuZE29TFvMwQiFsqXC2oOWNZPMwfOo5n_fpDccgNPiyAxqdPOHH1rzViklqvdAs03Rfd4Ng9YbstNwBw0DBxgFEzHjDeACAMz4ga0nXckhZCayFTNCzQePdENatj_aZfNOIqacLS0sQS-uNxqliYE3NET2ay18WkjX2luD2trZVZYAhmaA7-tFXCgD_tytEbhmkm1DpFE5n4EMatPi8bK-DeQIiUVYZjcRd8U95CGi8Q_XPw",
      alt: "Great Migration aerial view over the Maasai Mara",
      aspect: "video",
    },
    impressions: { count: "124k", icon: "chart" },
    interactions: { likes: "364.2k", comments: "128", reshares: "45", likeIcon: "thumb_up" },
  },
  {
    id: "2",
    type: "user",
    author: {
      name: "Kamau Njoroge",
      handle: "@kamau_n",
      avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuCVRxiwOg-pMg1RugKgqUEK8Ym7F6zhwqmTW66fxjBmMCCDC-2m1Jmm4MaL-XvUyvHv5p5qK7hq-QVQQ8NXeIyzm29lnlSCKpOs8VOBvpm-1ApnUCnlOdhM4128QEdeafu1zIzBNwSKarDDznz83zTgi3ZFsuh9xnXeKPttafgG2GbSRguQXTv6cDGo9GuMj4M74ZM6mdCmofTk9j5WRQ84pKaQq-WKTOMkJcgMg6R0E3VrTond77ECUz1sHBIQ66zg6-0megI4KHX3",
      verified: false,
    },
    content: "Nairobi skyline hitting different tonight. Westlands energy is unmatched! 🏙️✨",
    media: {
      src: "https://lh3.googleusercontent.com/aida-public/AB6AXuD47UmisG4EnyDtk6w8-frNvTjUOox1Nq9KP7pRcQcahj5Aq9xVgrZUt3PlAWweTfP9MyAxiEbUGohEz-sGWw478vPjZLrYABOi_YR_jUl_EFYNw1nyvFHf7pP-r3S-7qrSPhPZvM13zNBo7TTkoMEBZ5d_iQi1gP_EJqgncFgYpyuVMd60hgv7dHspw3IhcIwNGLkTm0aq1JTzN5ZQPWx0-6ixWSKZG11wOgaCUsblrT6YvZe6FAlpvOO625x-Ex8oINlT1f6a2Q_K",
      alt: "Nairobi skyline at night from Westlands",
      aspect: "square",
    },
    impressions: { count: "8,924", icon: "eye" },
    interactions: { likes: "892", likeIcon: "favorite", liked: true },
    timestamp: "2h ago",
  },
];

export default function Home() {
  const [activeMode, setActiveMode] = useState<Mode>("feed");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="max-w-[1400px] mx-auto flex flex-col lg:flex-row min-h-screen lg:px-6 gap-6">
      <LeftSidebar />

      <main className="flex-1 w-full max-w-2xl mx-auto lg:mx-0 pt-0 lg:pt-4 pb-32 lg:pb-12">
        {/* Top Bar — notifications, messages, profile */}
        <TopBar />

        {/* Mode Tabs */}
        <div className="pt-4">
          <ModeSelector activeMode={activeMode} onModeChange={setActiveMode} />
        </div>

        {/* Feed */}
        {activeMode === "feed" && (
          <>
            <StoriesBar />
            <div className="space-y-6 px-4 stagger-children">
              {loading ? (
                <>
                  <SkeletonCard />
                  <SkeletonCard />
                </>
              ) : (
                SAMPLE_POSTS.map((post, index) => (
                  <PostCard key={post.id} post={post} index={index} />
                ))
              )}
            </div>
          </>
        )}

        {/* Sparks */}
        {activeMode === "sparks" && <SparksGrid />}

        {/* Videos */}
        {activeMode === "videos" && <VideosGrid />}
      </main>

      <RightSidebar />
      <BottomNav />
    </div>
  );
}
