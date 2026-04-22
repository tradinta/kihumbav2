import React from 'react';
import { motion } from 'framer-motion';
import { 
  Users, Eye, Clock, BarChart2, ArrowUpRight, 
  CheckCircle2, AlertCircle, Share2, Repeat2, Heart
} from 'lucide-react';

interface AnalyticsProps {
  video: any;
  onClose: () => void;
}

export default function VideoAnalyticsView({ video, onClose }: AnalyticsProps) {
  const retention = video.retention || { watched3Min: 0, watched50Pct: 0, watched100Pct: 0 };
  const viewCount = video.viewCount || 1; // Avoid div by zero

  // Calculate percentages based on views
  const pct3Min = Math.round((retention.watched3Min / viewCount) * 100);
  const pct50 = Math.round((retention.watched50Pct / viewCount) * 100);
  const pct100 = Math.round((retention.watched100Pct / viewCount) * 100);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-black text-white uppercase tracking-tighter">Video Performance</h2>
          <p className="text-[10px] font-bold text-muted-custom uppercase tracking-[0.2em]">{video.title}</p>
        </div>
      </div>

      {/* ─── Metric Grid ─── */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <MetricCard label="Impressions" value={viewCount * 12} icon={Eye} gold />
        <MetricCard label="Views" value={viewCount} icon={BarChart2} />
        <MetricCard label="Upvotes" value={video._count?.interactions || 0} icon={Heart} />
        <MetricCard label="Completion Rate" value={`${pct100}%`} icon={CheckCircle2} />
      </div>

      {/* ─── Retention Heatmap ─── */}
      <div className="card-surface p-6 rounded-[2rem] border border-white/5 bg-gradient-to-br from-white/[0.02] to-transparent">
        <div className="flex items-center justify-between mb-8">
            <h3 className="text-xs font-black uppercase tracking-widest text-muted-custom">Audience Retention Milestones</h3>
            <span className="text-[10px] font-black text-primary-gold bg-primary-gold/10 px-2 py-0.5 rounded">Real-time Heartbeat</span>
        </div>

        <div className="space-y-8">
            <RetentionBar label="Watched > 3 Minutes" count={retention.watched3Min} percentage={pct3Min} color="bg-primary-gold" />
            <RetentionBar label="Watched > 50% Bench" count={retention.watched50Pct} percentage={pct50} color="bg-emerald-400" />
            <RetentionBar label="Full Watch Completion" count={retention.watched100Pct} percentage={pct100} color="bg-blue-400" />
        </div>

        <div className="mt-8 pt-8 border-t border-white/5">
            <div className="flex items-start gap-3">
                <AlertCircle size={16} className="text-primary-gold shrink-0 mt-0.5" />
                <p className="text-[11px] font-medium text-white/40 leading-relaxed">
                   Creators with a **3-Minute Retention** over 60% are eligible for the **ELITE Payout Multiplier**. Keep your intros tight to increase your KTS.
                </p>
            </div>
        </div>
      </div>
    </div>
  );
}

const MetricCard = ({ label, value, icon: Icon, gold }: any) => (
  <div className="card-surface p-4 rounded-2xl border border-white/5 space-y-2">
    <div className={`size-8 rounded-lg flex items-center justify-center ${gold ? 'bg-primary-gold/10 text-primary-gold' : 'bg-white/5 text-muted-custom'}`}>
      <Icon size={16} />
    </div>
    <div>
      <p className="text-[18px] font-black text-white tabular-nums">{value.toLocaleString()}</p>
      <p className="text-[9px] font-black uppercase tracking-widest text-muted-custom">{label}</p>
    </div>
  </div>
);

const RetentionBar = ({ label, count, percentage, color }: any) => (
  <div className="space-y-2">
    <div className="flex justify-between text-[10px] font-black uppercase tracking-widest">
        <span className="text-white/80">{label}</span>
        <span className="text-muted-custom">{count.toLocaleString()} Viewers ({percentage}%)</span>
    </div>
    <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
        <motion.div 
            initial={{ width: 0 }}
            animate={{ width: `${percentage}%` }}
            className={`h-full ${color} shadow-lg shadow-${color.split('-')[1]}/20`}
        />
    </div>
  </div>
);
