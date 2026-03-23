"use client";

import { Heart, MessageCircle, Eye, Play } from "lucide-react";

interface SparkData {
  id: string;
  thumbnail: string;
  title: string;
  author: string;
  views: string;
  likes: string;
}

const SAMPLE_SPARKS: SparkData[] = [
  {
    id: "s1",
    thumbnail: "https://lh3.googleusercontent.com/aida-public/AB6AXuBtybnJkTWyDCI2riQjGAzSdkmoZlzfkuZE29TFvMwQiFsqXC2oOWNZPMwfOo5n_fpDccgNPiyAxqdPOHH1rzViklqvdAs03Rfd4Ng9YbstNwBw0DBxgFEzHjDeACAMz4ga0nXckhZCayFTNCzQePdENatj_aZfNOIqacLS0sQS-uNxqliYE3NET2ay18WkjX2luD2trZVZYAhmaA7-tFXCgD_tytEbhmkm1DpFE5n4EMatPi8bK-DeQIiUVYZjcRd8U95CGi8Q_XPw",
    title: "Safari sunset magic 🌅",
    author: "WildlifeKenya",
    views: "45.2k",
    likes: "3.1k",
  },
  {
    id: "s2",
    thumbnail: "https://lh3.googleusercontent.com/aida-public/AB6AXuD47UmisG4EnyDtk6w8-frNvTjUOox1Nq9KP7pRcQcahj5Aq9xVgrZUt3PlAWweTfP9MyAxiEbUGohEz-sGWw478vPjZLrYABOi_YR_jUl_EFYNw1nyvFHf7pP-r3S-7qrSPhPZvM13zNBo7TTkoMEBZ5d_iQi1gP_EJqgncFgYpyuVMd60hgv7dHspw3IhcIwNGLkTm0aq1JTzN5ZQPWx0-6ixWSKZG11wOgaCUsblrT6YvZe6FAlpvOO625x-Ex8oINlT1f6a2Q_K",
    title: "Nairobi night drive 🏙️",
    author: "KamauN",
    views: "28.7k",
    likes: "1.9k",
  },
  {
    id: "s3",
    thumbnail: "https://lh3.googleusercontent.com/aida-public/AB6AXuAzBjYM5pyHoUfz48kytO0uHjCPJ0bnGXIVIQA7KEzESmO5JjlPvN8N5FYQIx0Sg7t_MslSjfCVdU-AN3iaL-64BMPPi6pxPF3yzwnnCHod3az2-W-aS1IPHL0N9hJJjnb05BFg8wVUpvxI-b3EzDAYgUPde-3ONgVyCgSdQP7bioiRO-IcbU5A7T10BTOR4yg9aBcGULjJGLTYIH0vPoqssMXBvh24rByN8ak9-LlaL-Wr2cQShsAptowTEBEPYHVkFz-pp0IEpMDo",
    title: "Kenyan coffee ritual ☕",
    author: "CoffeeCulture",
    views: "12.5k",
    likes: "890",
  },
  {
    id: "s4",
    thumbnail: "https://lh3.googleusercontent.com/aida-public/AB6AXuCVRxiwOg-pMg1RugKgqUEK8Ym7F6zhwqmTW66fxjBmMCCDC-2m1Jmm4MaL-XvUyvHv5p5qK7hq-QVQQ8NXeIyzm29lnlSCKpOs8VOBvpm-1ApnUCnlOdhM4128QEdeafu1zIzBNwSKarDDznz83zTgi3ZFsuh9xnXeKPttafgG2GbSRguQXTv6cDGo9GuMj4M74ZM6mdCmofTk9j5WRQ84pKaQq-WKTOMkJcgMg6R0E3VrTond77ECUz1sHBIQ66zg6-0megI4KHX3",
    title: "Street food tour 🍜",
    author: "FoodieNairobi",
    views: "67.3k",
    likes: "5.4k",
  },
];

export default function SparksGrid() {
  return (
    <div className="px-4 animate-fade-in-up">
      <div className="grid grid-cols-2 gap-3">
        {SAMPLE_SPARKS.map((spark, index) => (
          <div
            key={spark.id}
            className="card-surface rounded-xl overflow-hidden group cursor-pointer animate-fade-in-up"
            style={{ animationDelay: `${index * 80}ms` }}
          >
            {/* Thumbnail */}
            <div className="aspect-[9/14] relative overflow-hidden bg-black">
              <img
                src={spark.thumbnail}
                alt={spark.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                loading="lazy"
              />
              {/* Play overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
              <div className="absolute top-2 right-2 bg-black/50 backdrop-blur-sm rounded px-1.5 py-0.5 flex items-center gap-1">
                <Play size={9} fill="white" className="text-white" />
                <span className="text-[8px] font-bold text-white">0:15</span>
              </div>

              {/* Bottom info overlay */}
              <div className="absolute bottom-0 left-0 right-0 p-2.5">
                <p className="text-[11px] font-bold text-white leading-tight line-clamp-2 mb-1">
                  {spark.title}
                </p>
                <p className="text-[9px] text-white/70 font-bold">@{spark.author}</p>
                <div className="flex items-center gap-3 mt-1.5">
                  <div className="flex items-center gap-1">
                    <Eye size={10} className="text-white/60" />
                    <span className="text-[8px] font-bold text-white/60">{spark.views}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Heart size={10} className="text-white/60" />
                    <span className="text-[8px] font-bold text-white/60">{spark.likes}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
