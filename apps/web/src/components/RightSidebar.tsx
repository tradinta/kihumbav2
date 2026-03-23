"use client";

import { Search, TrendingUp } from "lucide-react";

const trendingTopics = [
  { tag: "#NairobiTech", curations: "12.4k" },
  { tag: "#MaasaiMara", curations: "8.9k" },
  { tag: "#KenyanStartups", curations: "6.2k" },
];

const recommendedTribes = [
  {
    name: "Coffee Enthusiasts",
    members: "12.5k",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuAzBjYM5pyHoUfz48kytO0uHjCPJ0bnGXIVIQA7KEzESmO5JjlPvN8N5FYQIx0Sg7t_MslSjfCVdU-AN3iaL-64BMPPi6pxPF3yzwnnCHod3az2-W-aS1IPHL0N9hJJjnb05BFg8wVUpvxI-b3EzDAYgUPde-3ONgVyCgSdQP7bioiRO-IcbU5A7T10BTOR4yg9aBcGULjJGLTYIH0vPoqssMXBvh24rByN8ak9-LlaL-Wr2cQShsAptowTEBEPYHVkFz-pp0IEpMDo",
  },
  {
    name: "Nairobi Foodies",
    members: "9.1k",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuD47UmisG4EnyDtk6w8-frNvTjUOox1Nq9KP7pRcQcahj5Aq9xVgrZUt3PlAWweTfP9MyAxiEbUGohEz-sGWw478vPjZLrYABOi_YR_jUl_EFYNw1nyvFHf7pP-r3S-7qrSPhPZvM13zNBo7TTkoMEBZ5d_iQi1gP_EJqgncFgYpyuVMd60hgv7dHspw3IhcIwNGLkTm0aq1JTzN5ZQPWx0-6ixWSKZG11wOgaCUsblrT6YvZe6FAlpvOO625x-Ex8oINlT1f6a2Q_K",
  },
];

export default function RightSidebar() {
  return (
    <aside className="hidden xl:flex flex-col w-72 pt-8 pb-12 sticky-sidebar shrink-0">
      <div className="relative mb-6">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-custom" />
        <input
          type="text"
          placeholder="Search Kihumba..."
          aria-label="Search Kihumba"
          className="w-full pill-surface border border-custom rounded py-2.5 pl-10 pr-4 text-xs font-bold uppercase tracking-widest text-[var(--text-main)] placeholder:text-muted-custom focus:outline-none focus:border-primary-gold bg-transparent"
        />
      </div>

      <div className="card-surface rounded-xl p-5 mb-6">
        <h4 className="text-[10px] font-bold uppercase tracking-[0.3em] text-primary-gold mb-4 flex items-center gap-2">
          <TrendingUp size={14} />
          Trending Pulse
        </h4>
        <div className="space-y-4">
          {trendingTopics.map((topic) => (
            <a key={topic.tag} href="#" className="block group">
              <p className="text-[11px] font-bold uppercase tracking-wider text-muted-custom group-hover:text-primary-gold transition-colors">
                {topic.tag}
              </p>
              <p className="text-[9px] text-muted-custom mt-0.5">
                {topic.curations} Curations
              </p>
            </a>
          ))}
        </div>
      </div>

      <div className="card-surface rounded-xl p-5">
        <h4 className="text-[10px] font-bold uppercase tracking-[0.3em] text-primary-gold mb-4">
          Recommended Tribes
        </h4>
        <div className="space-y-4">
          {recommendedTribes.map((tribe) => (
            <div key={tribe.name} className="flex items-center gap-3">
              <div className="size-8 rounded bg-black/20 border border-primary-gold/10 overflow-hidden shrink-0">
                <img className="w-full h-full object-cover" src={tribe.image} alt={tribe.name} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[11px] font-bold truncate">{tribe.name}</p>
                <p className="text-[9px] text-muted-custom">{tribe.members} Members</p>
              </div>
              <button className="text-[9px] font-bold uppercase text-primary-gold border border-primary-gold/30 px-2 py-1 rounded hover:bg-primary-gold/10 transition-all shrink-0">
                Join
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-auto pt-8 border-t border-custom">
        <p className="text-[9px] text-muted-custom uppercase font-bold tracking-widest text-center">
          Kihumba © 2026
        </p>
      </div>
    </aside>
  );
}
