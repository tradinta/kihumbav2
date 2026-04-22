"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Megaphone,
  Calendar,
  ShoppingBag,
  Sparkles,
  Wallet,
  ArrowRight,
  TrendingUp,
  Globe,
  Lock,
  Activity,
  Users,
  ShieldCheck,
  Edit3,
  PlusCircle,
  Image as ImageIcon,
  Heart,
  CreditCard,
  Settings,
  UserPlus,
  BarChart3,
  ChevronRight,
  MapPin,
  ExternalLink,
  MessageSquare,
  Eye,
  MessageCircle,
  ThumbsUp,
  Share2,
} from "lucide-react";

export default function BusinessHub() {
  const router = useRouter();
  const [showComposer, setShowComposer] = useState(false);

  return (
    <div className="min-h-screen bg-main font-inter selection:bg-primary-gold/30">
      {/* ═══════════════════════════════════════════════════════════ */}
      {/* SECTION 1: MY STUFF — Who I am, how I'm doing             */}
      {/* ═══════════════════════════════════════════════════════════ */}

      {/* Profile Banner */}
      <section className="border-b border-custom">
        <div className="max-w-5xl mx-auto px-6 py-10">
          {/* Business Identity Row */}
          <div className="flex flex-col sm:flex-row gap-6 items-start">
            {/* Avatar */}
            <div className="size-24 rounded-lg bg-[var(--card-bg)] border border-custom flex items-center justify-center shrink-0 relative group overflow-hidden">
              <span className="text-4xl font-black text-muted-custom group-hover:text-primary-gold transition-colors">
                SF
              </span>
              <div className="absolute inset-0 bg-primary-gold/10 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <Edit3 size={18} className="text-primary-gold" />
              </div>
            </div>

            {/* Identity */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-3 mb-1">
                <h1 className="text-2xl font-black text-main tracking-tight">
                  Safaricom PLC
                </h1>
                <ShieldCheck size={20} className="text-blue-500 shrink-0" />
              </div>
              <p className="text-sm font-medium text-muted-custom mb-3 max-w-lg">
                Connecting Kenya, one community at a time. Telecommunications, 
                M-Pesa, and digital services across East Africa.
              </p>
              <div className="flex flex-wrap items-center gap-4 text-[11px] font-bold text-muted-custom">
                <span className="flex items-center gap-1.5">
                  <Globe size={13} /> safaricom.co.ke
                </span>
                <span className="flex items-center gap-1.5">
                  <MapPin size={13} /> Nairobi, Kenya
                </span>
                <button 
                  onClick={() => router.push("/verification")}
                  className="flex items-center gap-1.5 text-emerald-500 hover:brightness-110 transition-all px-2 py-0.5 rounded-md hover:bg-emerald-500/10 border border-transparent hover:border-emerald-500/20"
                >
                  <ShieldCheck size={13} /> Verified Business
                </button>
              </div>
            </div>

            {/* Wallet Badge */}
            <div className="sm:text-right shrink-0">
              <p className="text-[10px] font-black text-muted-custom uppercase tracking-widest mb-1">
                Console Balance
              </p>
              <p className="text-2xl font-black text-primary-gold tracking-tight">
                KES 145,000
              </p>
            </div>
          </div>

          {/* Stats Row */}
          <div className="mt-8 grid grid-cols-2 sm:grid-cols-4 gap-px bg-custom rounded-lg overflow-hidden border border-custom">
            <StatCell label="Revenue (30d)" value="KES 4.2M" trend="+18%" />
            <StatCell label="Audience Reached" value="1.8M" trend="+5.2%" />
            <StatCell label="Active Campaigns" value="3" trend="Running" />
            <StatCell label="Avg. Engagement" value="4.2%" trend="+0.8%" />
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════ */}
      {/* SECTION 2: STUFF I CAN DO — Quick Actions                  */}
      {/* ═══════════════════════════════════════════════════════════ */}

      <section className="border-b border-custom">
        <div className="max-w-5xl mx-auto px-6 py-8">
          <h2 className="text-[11px] font-black text-muted-custom uppercase tracking-[0.2em] mb-5">
            Quick Actions
          </h2>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            <ActionCard
              icon={<PlusCircle size={20} />}
              label="Create Post"
              onClick={() => setShowComposer(true)}
              primary
            />
            <ActionCard
              icon={<MessageSquare size={20} />}
              label="Messaging"
              badge="12"
            />
            <ActionCard
              icon={<Edit3 size={20} />}
              label="Edit Profile"
            />
            <ActionCard
              icon={<Wallet size={20} />}
              label="Top-up Budget"
            />
            <ActionCard
              icon={<ShieldCheck size={20} />}
              label="Verification"
              badge="85%"
            />
            <ActionCard
              icon={<Settings size={20} />}
              label="Console Set"
            />
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════ */}
      {/* SECTION 2.5: PLATFORM PULSE — Engagement & Stats           */}
      {/* ═══════════════════════════════════════════════════════════ */}

      <section className="border-b border-custom bg-black/20">
        <div className="max-w-5xl mx-auto px-6 py-10">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
            {/* Left: Global Stats */}
            <div className="lg:col-span-1 space-y-6">
              <h3 className="text-[10px] font-black text-muted-custom uppercase tracking-widest flex items-center gap-2">
                <BarChart3 size={14} className="text-primary-gold" /> Global Platform Pulse
              </h3>
              <div className="space-y-4">
                <div className="p-5 rounded-xl border border-custom bg-[var(--card-bg)]">
                  <div className="flex items-center justify-between text-muted-custom mb-3">
                    <span className="text-[9px] font-black uppercase tracking-widest">Total Post Views</span>
                    <Eye size={16} />
                  </div>
                  <p className="text-2xl font-black text-main">1.2M</p>
                  <p className="text-[10px] font-bold text-emerald-500 uppercase mt-1 tracking-widest">+14.2% Growth</p>
                </div>
                <div className="p-5 rounded-xl border border-custom bg-[var(--card-bg)]">
                  <div className="flex items-center justify-between text-muted-custom mb-3">
                    <span className="text-[9px] font-black uppercase tracking-widest">Total Impressions</span>
                    <Activity size={16} />
                  </div>
                  <p className="text-2xl font-black text-main">4.8M</p>
                  <p className="text-[10px] font-bold text-muted-custom uppercase mt-1 tracking-widest">Last 30 Days</p>
                </div>
              </div>
            </div>

            {/* Right: Recent Comments Feed */}
            <div className="lg:col-span-2 space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-[10px] font-black text-muted-custom uppercase tracking-widest flex items-center gap-2">
                  <MessageCircle size={14} className="text-blue-500" /> Recent Interaction (Last Post)
                </h3>
                <span className="text-[10px] font-black text-primary-gold uppercase tracking-widest">56 New Comments</span>
              </div>
              
              <div className="border border-custom rounded-xl bg-[var(--card-bg)] overflow-hidden">
                <div className="p-4 border-b border-custom bg-white/[0.02] flex items-center justify-between">
                   <div className="flex items-center gap-3">
                      <div className="size-8 rounded bg-primary-gold/10 border border-primary-gold/20 flex items-center justify-center text-primary-gold font-black text-xs">SF</div>
                      <div>
                         <p className="text-[10px] font-black text-main uppercase">Our 5G Rollout Strategy</p>
                         <p className="text-[9px] font-bold text-muted-custom uppercase tracking-tighter mt-0.5">Posted 4 hours ago</p>
                      </div>
                   </div>
                   <div className="flex items-center gap-4 text-[10px] font-black text-muted-custom">
                      <span className="flex items-center gap-1"><Heart size={12} fill="currentColor" className="text-red-500" /> 2.4k</span>
                      <span className="flex items-center gap-1"><Share2 size={12} /> 142</span>
                   </div>
                </div>

                <div className="divide-y divide-custom max-h-[180px] overflow-y-auto custom-scrollbar">
                   {[
                     { user: "Kuria K.", comment: "This 5G speed in Nakuru is insane! 🚀", time: "12m" },
                     { user: "Amara O.", comment: "When is this reaching the coast region?", time: "24m" },
                     { user: "John D.", comment: "Excellent customer service at the Westlands hub today.", time: "45m" },
                   ].map((c, i) => (
                     <div key={i} className="p-4 flex items-start gap-3 hover:bg-white/[0.01] transition-colors">
                        <div className="size-6 rounded bg-white/5 border border-custom flex items-center justify-center text-[8px] font-black">{c.user[0]}</div>
                        <div className="flex-1 min-w-0">
                           <div className="flex items-center justify-between gap-2">
                              <p className="text-[9px] font-black text-main uppercase">{c.user}</p>
                              <span className="text-[8px] font-bold text-muted-custom uppercase">{c.time} ago</span>
                           </div>
                           <p className="text-[10px] font-medium text-muted-custom mt-0.5 line-clamp-1">{c.comment}</p>
                        </div>
                     </div>
                   ))}
                </div>
                
                <button className="w-full py-3 text-[9px] font-black uppercase tracking-widest text-primary-gold border-t border-custom hover:bg-primary-gold/5 transition-all">
                  View All 56 Comments
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════ */}
      {/* SECTION 3: LAUNCH A SERVICE — The 5 Dashboards             */}
      {/* ═══════════════════════════════════════════════════════════ */}

      <section>
        <div className="max-w-5xl mx-auto px-6 py-8 pb-20">
          <h2 className="text-[11px] font-black text-muted-custom uppercase tracking-[0.2em] mb-5">
            Service Dashboards
          </h2>

          <div className="space-y-3">
            <ServiceCard
              title="Ad Centre"
              desc="Launch campaigns, simulate placements, track ROAS"
              icon={<Megaphone size={22} />}
              color="bg-primary-gold/10 text-primary-gold border-primary-gold/20"
              stats={[
                { label: "Active", value: "3" },
                { label: "Spend/day", value: "KES 14k" },
                { label: "ROAS", value: "4.2x" },
              ]}
              active
              onClick={() => router.push("/ads")}
            />
            <ServiceCard
              title="Events Console"
              desc="Manage ticketing, gate scanning, attendee tracking"
              icon={<Calendar size={22} />}
              color="bg-blue-500/10 text-blue-500 border-blue-500/20"
              stats={[
                { label: "Upcoming", value: "2" },
                { label: "Sold", value: "2,090" },
                { label: "Volume", value: "KES 6.4M" },
              ]}
              active
              onClick={() => router.push("/events")}
            />
            <ServiceCard
              title="Marketplace Ops"
              desc="Inventory, orders, escrow, logistics coordination"
              icon={<ShoppingBag size={22} />}
              color="bg-emerald-500/10 text-emerald-500 border-emerald-500/20"
              stats={[
                { label: "Listings", value: "148" },
                { label: "Orders", value: "12" },
                { label: "Alerts", value: "4" },
              ]}
              active
              onClick={() => router.push("/marketplace")}
            />
            <ServiceCard
              title="Influencer Hub"
              desc="Creator briefs, contract matching, deliverable tracking"
              icon={<Sparkles size={22} />}
              color="bg-purple-500/10 text-purple-500 border-purple-500/20"
              stats={[
                { label: "Briefs", value: "1" },
                { label: "Creators", value: "4" },
                { label: "Pending", value: "2" },
              ]}
              active
              onClick={() => router.push("/influencers")}
            />
            <ServiceCard
              title="Messaging Hub"
              desc="Corporate DMs, customer inquiries, automated responses"
              icon={<MessageSquare size={22} />}
              color="bg-red-500/10 text-red-500 border-red-500/20"
              stats={[
                { label: "Unread", value: "12" },
                { label: "Avg. Response", value: "4m" },
                { label: "Support", value: "98%" },
              ]}
              active
              onClick={() => router.push("/messages")}
            />
            <ServiceCard
              title="Analytics & Reports"
              desc="Cross-platform insights, audience breakdown, exports"
              icon={<BarChart3 size={22} />}
              color="bg-amber-500/10 text-amber-500 border-amber-500/20"
              stats={[
                { label: "Visits", value: "128k" },
                { label: "Growth", value: "+5.4%" },
                { label: "Reports", value: "3" },
              ]}
              active
              onClick={() => router.push("/analytics")}
            />
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════ */}
      {/* POST COMPOSER OVERLAY                                      */}
      {/* ═══════════════════════════════════════════════════════════ */}

      <AnimatePresence>
        {showComposer && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/80 backdrop-blur-sm"
            onClick={() => setShowComposer(false)}
          >
            <motion.div
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-lg bg-[var(--card-bg)] border border-custom rounded-lg overflow-hidden shadow-2xl"
            >
              <div className="p-5 border-b border-custom flex items-center justify-between">
                <h3 className="text-xs font-black uppercase tracking-widest text-main">
                  New Business Post
                </h3>
                <button
                  onClick={() => setShowComposer(false)}
                  className="text-muted-custom hover:text-main text-xl leading-none"
                >
                  ×
                </button>
              </div>
              <div className="p-5">
                <div className="flex gap-3 mb-4">
                  <div className="size-10 rounded-lg bg-primary-gold/10 border border-primary-gold/20 flex items-center justify-center text-primary-gold text-[11px] font-black shrink-0">
                    SF
                  </div>
                  <div>
                    <p className="text-xs font-black text-main">Safaricom PLC</p>
                    <p className="text-[9px] font-bold text-muted-custom">
                      Posting as verified business
                    </p>
                  </div>
                </div>
                <textarea
                  placeholder="Share a business update, announcement, or promotion..."
                  className="w-full h-28 bg-transparent text-sm font-medium text-main placeholder:text-muted-custom focus:outline-none resize-none leading-relaxed"
                  autoFocus
                />
                <div className="mt-4 flex items-center justify-between border-t border-custom pt-4">
                  <div className="flex items-center gap-3 text-muted-custom">
                    <button className="p-2 rounded-lg hover:bg-white/5 hover:text-primary-gold transition-all">
                      <ImageIcon size={18} />
                    </button>
                  </div>
                  <button className="px-5 py-2 rounded-lg bg-primary-gold text-black text-[11px] font-black uppercase tracking-widest hover:brightness-110 transition-all">
                    Post
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── COMPONENTS ─────────────────────────────────────────────────

function StatCell({
  label,
  value,
  trend,
}: {
  label: string;
  value: string;
  trend: string;
}) {
  return (
    <div className="bg-[var(--card-bg)] px-5 py-4">
      <p className="text-[9px] font-black text-muted-custom uppercase tracking-widest mb-1">
        {label}
      </p>
      <div className="flex items-baseline gap-2">
        <span className="text-lg font-black text-main tracking-tight">
          {value}
        </span>
        <span className="text-[9px] font-black text-emerald-500 uppercase">
          {trend}
        </span>
      </div>
    </div>
  );
}

function ActionCard({
  icon,
  label,
  onClick,
  primary = false,
  badge,
}: {
  icon: React.ReactNode;
  label: string;
  onClick?: () => void;
  primary?: boolean;
  badge?: string;
}) {
  return (
    <button
      onClick={onClick}
      className={`relative p-4 rounded-lg border transition-all flex flex-col items-center justify-center gap-2.5 group ${
        primary
          ? "bg-primary-gold text-black border-primary-gold hover:brightness-110"
          : "bg-[var(--card-bg)] border-custom text-muted-custom hover:text-main hover:border-primary-gold/30"
      }`}
    >
      <span className={`${primary ? "" : "group-hover:text-primary-gold"} transition-colors`}>
        {icon}
      </span>
      <span className="text-[10px] font-black uppercase tracking-widest">
        {label}
      </span>
      {badge && (
        <span className="absolute top-2 right-2 text-[8px] font-black bg-amber-500/10 text-amber-500 border border-amber-500/20 px-1.5 py-0.5 rounded">
          {badge}
        </span>
      )}
    </button>
  );
}

function ServiceCard({
  title,
  desc,
  icon,
  color,
  stats,
  active = false,
  onClick,
}: {
  title: string;
  desc: string;
  icon: React.ReactNode;
  color: string;
  stats: { label: string; value: string }[];
  active?: boolean;
  onClick?: () => void;
}) {
  return (
    <div
      onClick={active ? onClick : undefined}
      className={`bg-[var(--card-bg)] border border-custom rounded-lg p-5 transition-all ${
        active
          ? "cursor-pointer hover:border-primary-gold/30 group"
          : "opacity-50 cursor-not-allowed"
      }`}
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        {/* Left: Icon + Info */}
        <div className="flex items-center gap-4 sm:w-2/5">
          <div
            className={`size-12 rounded-lg border flex items-center justify-center shrink-0 ${color}`}
          >
            {icon}
          </div>
          <div className="min-w-0">
            <h3 className="text-sm font-black text-main tracking-tight group-hover:text-primary-gold transition-colors">
              {title}
            </h3>
            <p className="text-[10px] font-medium text-muted-custom mt-0.5 truncate">
              {desc}
            </p>
          </div>
        </div>

        {/* Middle: Stats */}
        <div className="flex gap-6 sm:gap-8">
          {stats.map((s, i) => (
            <div key={i} className="text-center sm:text-left">
              <p className="text-[8px] font-black text-muted-custom uppercase tracking-widest">
                {s.label}
              </p>
              <p className="text-xs font-black text-main">{s.value}</p>
            </div>
          ))}
        </div>

        {/* Right: Action */}
        <div className="shrink-0 flex justify-end">
          {active ? (
            <div className="flex items-center gap-2 text-[10px] font-black text-primary-gold uppercase tracking-widest opacity-60 group-hover:opacity-100 transition-all">
              Launch <ArrowRight size={14} />
            </div>
          ) : (
            <div className="flex items-center gap-2 text-[10px] font-black text-muted-custom uppercase tracking-widest">
              <Lock size={12} /> Soon
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
