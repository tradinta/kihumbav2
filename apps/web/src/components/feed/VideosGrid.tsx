"use client";

import { Play, Eye, Clock, BadgeCheck } from "lucide-react";

interface VideoData {
  id: string;
  thumbnail: string;
  title: string;
  author: { name: string; avatar: string; verified: boolean };
  views: string;
  duration: string;
  posted: string;
}

const SAMPLE_VIDEOS: VideoData[] = [
  {
    id: "v1",
    thumbnail: "https://lh3.googleusercontent.com/aida-public/AB6AXuBtybnJkTWyDCI2riQjGAzSdkmoZlzfkuZE29TFvMwQiFsqXC2oOWNZPMwfOo5n_fpDccgNPiyAxqdPOHH1rzViklqvdAs03Rfd4Ng9YbstNwBw0DBxgFEzHjDeACAMz4ga0nXckhZCayFTNCzQePdENatj_aZfNOIqacLS0sQS-uNxqliYE3NET2ay18WkjX2luD2trZVZYAhmaA7-tFXCgD_tytEbhmkm1DpFE5n4EMatPi8bK-DeQIiUVYZjcRd8U95CGi8Q_XPw",
    title: "The Great Migration — Behind the Lens Documentary",
    author: {
      name: "Safaricom PLC",
      avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuBLECic1h3_RmmBCR3a-RtvTQ0Mlp9vAvJdiOjQvjqWKEzZblonEM8BOlxN13e_KExcwxhboQoK4L6bmcYazrMAITFLlPRgMV_JRO7SUV2UhKBHZvU0Y0OdFhKY3fJmiU8wC-ozYJU2sYSW9DBy6gSMbYAQuUPJfJJSYI_OvytTuNy6uNoNyRV0Y2IxU-RJQk1TzpAOmRb-PnpfVeRzFApseq087IfteMejjp6WlIPxjmDZa9y0HyIL4yUPKPwejRZbRB1D0cRwD0vR",
      verified: true,
    },
    views: "234k",
    duration: "12:35",
    posted: "3 days ago",
  },
  {
    id: "v2",
    thumbnail: "https://lh3.googleusercontent.com/aida-public/AB6AXuD47UmisG4EnyDtk6w8-frNvTjUOox1Nq9KP7pRcQcahj5Aq9xVgrZUt3PlAWweTfP9MyAxiEbUGohEz-sGWw478vPjZLrYABOi_YR_jUl_EFYNw1nyvFHf7pP-r3S-7qrSPhPZvM13zNBo7TTkoMEBZ5d_iQi1gP_EJqgncFgYpyuVMd60hgv7dHspw3IhcIwNGLkTm0aq1JTzN5ZQPWx0-6ixWSKZG11wOgaCUsblrT6YvZe6FAlpvOO625x-Ex8oINlT1f6a2Q_K",
    title: "Nairobi After Dark — A Timelapse Journey Through the City",
    author: {
      name: "Kamau Njoroge",
      avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuCVRxiwOg-pMg1RugKgqUEK8Ym7F6zhwqmTW66fxjBmMCCDC-2m1Jmm4MaL-XvUyvHv5p5qK7hq-QVQQ8NXeIyzm29lnlSCKpOs8VOBvpm-1ApnUCnlOdhM4128QEdeafu1zIzBNwSKarDDznz83zTgi3ZFsuh9xnXeKPttafgG2GbSRguQXTv6cDGo9GuMj4M74ZM6mdCmofTk9j5WRQ84pKaQq-WKTOMkJcgMg6R0E3VrTond77ECUz1sHBIQ66zg6-0megI4KHX3",
      verified: false,
    },
    views: "89.4k",
    duration: "8:22",
    posted: "1 week ago",
  },
  {
    id: "v3",
    thumbnail: "https://lh3.googleusercontent.com/aida-public/AB6AXuAzBjYM5pyHoUfz48kytO0uHjCPJ0bnGXIVIQA7KEzESmO5JjlPvN8N5FYQIx0Sg7t_MslSjfCVdU-AN3iaL-64BMPPi6pxPF3yzwnnCHod3az2-W-aS1IPHL0N9hJJjnb05BFg8wVUpvxI-b3EzDAYgUPde-3ONgVyCgSdQP7bioiRO-IcbU5A7T10BTOR4yg9aBcGULjJGLTYIH0vPoqssMXBvh24rByN8ak9-LlaL-Wr2cQShsAptowTEBEPYHVkFz-pp0IEpMDo",
    title: "How Kenyan Coffee Goes from Farm to Cup",
    author: {
      name: "Coffee Culture KE",
      avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuAzBjYM5pyHoUfz48kytO0uHjCPJ0bnGXIVIQA7KEzESmO5JjlPvN8N5FYQIx0Sg7t_MslSjfCVdU-AN3iaL-64BMPPi6pxPF3yzwnnCHod3az2-W-aS1IPHL0N9hJJjnb05BFg8wVUpvxI-b3EzDAYgUPde-3ONgVyCgSdQP7bioiRO-IcbU5A7T10BTOR4yg9aBcGULjJGLTYIH0vPoqssMXBvh24rByN8ak9-LlaL-Wr2cQShsAptowTEBEPYHVkFz-pp0IEpMDo",
      verified: true,
    },
    views: "156k",
    duration: "15:48",
    posted: "2 weeks ago",
  },
];

export default function VideosGrid() {
  return (
    <div className="px-4 space-y-5 animate-fade-in-up">
      {SAMPLE_VIDEOS.map((video, index) => (
        <div
          key={video.id}
          className="card-surface rounded-xl overflow-hidden group cursor-pointer animate-fade-in-up"
          style={{ animationDelay: `${index * 100}ms` }}
        >
          {/* Thumbnail */}
          <div className="aspect-video relative overflow-hidden bg-black">
            <img
              src={video.thumbnail}
              alt={video.title}
              className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-500"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-black/10 group-hover:bg-black/20 transition-colors" />

            {/* Play button */}
            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
              <div className="size-14 rounded-full bg-primary-gold/90 flex items-center justify-center shadow-lg">
                <Play size={24} fill="black" className="text-black ml-1" />
              </div>
            </div>

            {/* Duration badge */}
            <div className="absolute bottom-2 right-2 bg-black/75 backdrop-blur-sm rounded px-2 py-0.5">
              <span className="text-[10px] font-bold text-white">{video.duration}</span>
            </div>
          </div>

          {/* Info */}
          <div className="p-4 flex gap-3">
            <div className="size-9 rounded-full border border-primary-gold/30 p-0.5 shrink-0">
              <img
                src={video.author.avatar}
                alt={video.author.name}
                className="w-full h-full object-cover rounded-full"
              />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-[13px] font-bold leading-tight line-clamp-2 mb-1">
                {video.title}
              </h3>
              <div className="flex items-center gap-1.5 mb-0.5">
                <span className="text-[10px] text-muted-custom font-bold">{video.author.name}</span>
                {video.author.verified && (
                  <BadgeCheck size={12} className="text-primary-gold fill-primary-gold stroke-[var(--card-bg)]" />
                )}
              </div>
              <div className="flex items-center gap-3 text-muted-custom">
                <div className="flex items-center gap-1">
                  <Eye size={11} />
                  <span className="text-[9px] font-bold">{video.views} views</span>
                </div>
                <div className="flex items-center gap-1">
                  <Clock size={11} />
                  <span className="text-[9px] font-bold">{video.posted}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
