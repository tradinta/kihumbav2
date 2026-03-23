"use client";

import { motion } from "framer-motion";
import { 
  MonitorPlay, 
  Layers, 
  LayoutTemplate, 
  MessageSquareQuote, 
  Home, 
  ShoppingBag 
} from "lucide-react";

export const adFormats = [
  {
    id: "post",
    title: "Post Ads",
    description: "Sponsored posts injected naturally into user feeds.",
    icon: MonitorPlay,
    features: ["Video or Image", "Call to Action Button", "Targeted reach"]
  },
  {
    id: "stories",
    title: "Stories Ads",
    description: "Full-screen vertical ads inserted between user stories.",
    icon: Layers,
    features: ["High engagement", "Swipe up links", "15s video max"]
  },
  {
    id: "sidebar",
    title: "Sidebar Ads",
    description: "Sticky banners on the right rail for desktop and tablet users.",
    icon: LayoutTemplate,
    features: ["Always visible", "High CTR", "Brand awareness"]
  },
  {
    id: "comment",
    title: "Comment Ads",
    description: "Pinned sponsored comments under high-traffic posts.",
    icon: MessageSquareQuote,
    features: ["Contextual", "Native feel", "Low cost per click"]
  },
  {
    id: "kao",
    title: "Kao Featured",
    description: "Boost your real estate listings to the top of Kao searches.",
    icon: Home,
    features: ["Targeted to renters", "Urgency badges", "Premium placement"]
  },
  {
    id: "marketplace",
    title: "Marketplace Boost",
    description: "Push your items to the top of the barter/sell feed.",
    icon: ShoppingBag,
    features: ["Verified trust badge", "Category specific", "Increase sales 3x"]
  }
];

export default function AdFormatSelector({ onSelect }: { onSelect: (id: string) => void }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {adFormats.map((format, i) => (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.05 }}
          key={format.id}
          onClick={() => onSelect(format.id)}
          className="card-surface p-4 rounded-xl cursor-pointer group hover:border-primary-gold/40 transition-all relative overflow-hidden"
        >
          {/* Subtle shimmer hover effect */}
          <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-primary-gold/5 object-cover to-transparent group-hover:animate-[shimmer_1.5s_infinite]" />
          
          <div className="flex items-start gap-4">
            <div className="size-12 rounded-lg bg-primary-gold/10 flex items-center justify-center shrink-0 border border-primary-gold/20 group-hover:scale-105 transition-transform">
              <format.icon size={20} className="text-primary-gold" />
            </div>
            <div>
              <h3 className="text-[12px] font-bold text-primary-gold tracking-wide uppercase mb-1">{format.title}</h3>
              <p className="text-[11px] font-bold text-muted-custom leading-snug mb-3">
                {format.description}
              </p>
              <ul className="space-y-1">
                {format.features.map((feature, idx) => (
                  <li key={idx} className="text-[9px] font-bold text-muted-custom uppercase tracking-widest flex items-center gap-1.5">
                    <span className="size-1 bg-primary-gold rounded-full" /> {feature}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
