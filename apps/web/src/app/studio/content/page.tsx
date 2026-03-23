"use client";

import { motion } from "framer-motion";
import { 
  Search, 
  Filter, 
  Eye, 
  MessageCircle, 
  ThumbsUp,
  CircleDollarSign,
  Globe2,
  Lock,
  EyeOff
} from "lucide-react";
import { studioData } from "@/data/studioData";

export default function ContentManager() {
  const { content } = studioData;

  const VisibilityIcon = ({ type }: { type: string }) => {
    switch (type) {
      case 'public': return <Globe2 size={12} className="text-emerald-400" />;
      case 'private': return <Lock size={12} className="text-red-400" />;
      case 'unlisted': return <EyeOff size={12} className="text-amber-400" />;
      default: return null;
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black tracking-tight text-main">Channel Content</h1>
          <p className="text-[11px] font-bold text-muted-custom uppercase tracking-widest mt-1">
            Manage your videos and Sparks
          </p>
        </div>
        
        <div className="flex gap-2">
          <div className="relative">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-custom" />
            <input 
              type="text" 
              placeholder="Search across your videos..."
              className="pl-9 pr-4 py-2 bg-[var(--pill-bg)] border border-custom rounded-lg text-[11px] font-bold focus:outline-none focus:border-primary-gold transition-colors w-64"
            />
          </div>
          <button className="px-3 bg-[var(--pill-bg)] border border-custom rounded-lg hover:border-primary-gold transition-colors">
            <Filter size={16} className="text-muted-custom" />
          </button>
        </div>
      </div>

      <div className="card-surface rounded-xl border border-custom overflow-hidden">
        <div className="w-full overflow-x-auto no-scrollbar">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-custom bg-[var(--pill-bg)]">
                <th className="p-4 text-[10px] font-bold uppercase tracking-widest text-muted-custom">Video</th>
                <th className="p-4 text-[10px] font-bold uppercase tracking-widest text-muted-custom">Visibility</th>
                <th className="p-4 text-[10px] font-bold uppercase tracking-widest text-muted-custom">Monetization</th>
                <th className="p-4 text-[10px] font-bold uppercase tracking-widest text-muted-custom text-right">Views</th>
                <th className="p-4 text-[10px] font-bold uppercase tracking-widest text-muted-custom text-right">Comments</th>
                <th className="p-4 text-[10px] font-bold uppercase tracking-widest text-muted-custom text-right">Likes</th>
              </tr>
            </thead>
            <tbody>
              {content.map((video, i) => (
                <motion.tr 
                  key={video.id}
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="border-b border-custom/50 hover:bg-white/5 transition-colors group cursor-pointer"
                >
                  <td className="p-4">
                    <div className="flex gap-4 items-center">
                      <div className="relative w-28 aspect-video rounded-md overflow-hidden shrink-0 border border-custom">
                        <img src={video.thumbnail} alt={video.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                        <div className="absolute bottom-1 right-1 bg-black/80 px-1 py-0.5 rounded text-[8px] font-bold text-white uppercase select-none">
                          {video.type}
                        </div>
                      </div>
                      <div className="flex flex-col justify-center max-w-[200px] lg:max-w-md">
                        <span className="text-[12px] font-bold text-main mb-1 line-clamp-2">{video.title}</span>
                        <span className="text-[10px] font-bold text-muted-custom">{video.date}</span>
                      </div>
                    </div>
                  </td>
                  
                  <td className="p-4">
                    <div className="flex items-center gap-1.5 min-w-[100px]">
                      <VisibilityIcon type={video.visibility} />
                      <span className="text-[11px] font-bold capitalize">{video.visibility}</span>
                    </div>
                  </td>

                  <td className="p-4">
                    <div className="flex items-center gap-1.5 min-w-[100px]">
                      <CircleDollarSign size={14} className={video.monetized ? "text-emerald-400" : "text-muted-custom"} />
                      <span className={`text-[11px] font-bold ${video.monetized ? "text-emerald-400" : "text-muted-custom"}`}>
                        {video.monetized ? "On" : "Off"}
                      </span>
                    </div>
                  </td>

                  <td className="p-4 text-right">
                    <span className="text-[11px] font-bold">{video.views.toLocaleString()}</span>
                  </td>
                  
                  <td className="p-4 text-right">
                    <span className="text-[11px] font-bold">{video.comments.toLocaleString()}</span>
                  </td>
                  
                  <td className="p-4 text-right">
                    <span className="text-[11px] font-bold">{video.likes.toLocaleString()}</span>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
