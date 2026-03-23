"use client";

import { motion } from "framer-motion";
import { ShieldAlert, BarChart3, Crown, ShieldCheck, CheckCircle2, Lock } from "lucide-react";

interface EligibilityProps {
  data: {
    impressions: { current: number; required: number; passed: boolean };
    premium: { active: boolean; passed: boolean };
    kihumbaScore: { current: number; required: number; passed: boolean };
  };
}

export default function EligibilityGate({ data }: EligibilityProps) {
  const steps = [
    {
      id: "impressions",
      title: "500k+ Impressions",
      description: "Generate 500,000+ total impressions across all posts in the last 30 days.",
      icon: BarChart3,
      current: data.impressions.current,
      required: data.impressions.required,
      passed: data.impressions.passed,
      format: (n: number) => (n >= 1000 ? `${(n/1000).toFixed(1)}k` : n)
    },
    {
      id: "premium",
      title: "Kihumba Premium",
      description: "Maintain an active Kihumba Premium subscription.",
      icon: Crown,
      current: data.premium.active ? 1 : 0,
      required: 1,
      passed: data.premium.passed,
      format: (n: number) => (n ? "Active" : "Inactive")
    },
    {
      id: "score",
      title: "Kihumba Score 85+",
      description: "Maintain a Kihumba Trust Score of 85 or higher to ensure brand safety.",
      icon: ShieldCheck,
      current: data.kihumbaScore.current,
      required: data.kihumbaScore.required,
      passed: data.kihumbaScore.passed,
      format: (n: number) => n.toString()
    }
  ];

  return (
    <div className="max-w-md mx-auto mt-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="text-center mb-8">
        <div className="size-16 mx-auto rounded-full bg-primary-gold/10 border border-primary-gold/30 flex items-center justify-center mb-4">
          <Lock size={24} className="text-primary-gold" />
        </div>
        <h2 className="text-xl font-black tracking-tight mb-2">Creator Hub Locked</h2>
        <p className="text-[11px] font-bold text-muted-custom leading-relaxed px-4">
          The internal influencer program allows you to monetize your audience by completing tasks for brands. 
          You must meet our strict eligibility requirements to apply.
        </p>
      </div>

      <div className="space-y-4">
        {steps.map((step, i) => (
          <motion.div 
            key={step.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className={`card-surface p-4 rounded-xl border relative overflow-hidden transition-colors ${
              step.passed ? 'border-emerald-500/20 bg-emerald-500/5' : 'border-custom'
            }`}
          >
            <div className="flex items-start gap-4 relatie z-10">
              <div className={`size-10 rounded-lg flex items-center justify-center shrink-0 ${
                step.passed ? 'bg-emerald-500/20 text-emerald-400' : 'bg-[var(--pill-bg)] text-muted-custom'
              }`}>
                {step.passed ? <CheckCircle2 size={20} /> : <step.icon size={20} />}
              </div>
              
              <div className="flex-1">
                <div className="flex items-center justify-between mb-1">
                  <h3 className={`text-[12px] font-bold tracking-wide uppercase ${
                    step.passed ? 'text-emerald-400' : 'text-main'
                  }`}>
                    {step.title}
                  </h3>
                  <span className={`text-[10px] font-bold tracking-widest ${
                    step.passed ? 'text-emerald-400' : 'text-muted-custom'
                  }`}>
                    {step.passed ? 'Passed' : `${step.format(step.current)} / ${step.format(step.required)}`}
                  </span>
                </div>
                
                <p className="text-[10px] font-bold text-muted-custom leading-snug mb-3">
                  {step.description}
                </p>

                {/* Progress bar */}
                {!step.passed && typeof step.current === 'number' && (
                  <div className="h-1.5 w-full bg-[var(--pill-bg)] rounded-full overflow-hidden">
                    <motion.div 
                      className="h-full bg-primary-gold rounded-full"
                      initial={{ width: 0 }}
                      animate={{ width: `${Math.min(100, (step.current / step.required) * 100)}%` }}
                      transition={{ duration: 1, ease: "easeOut" }}
                    />
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="mt-8 text-center">
        <button 
          disabled
          className="w-full max-w-xs mx-auto py-3 rounded-lg bg-[var(--pill-bg)] text-muted-custom text-[11px] font-bold uppercase tracking-widest border border-custom cursor-not-allowed"
        >
          Apply Now (Locked)
        </button>
      </div>
    </div>
  );
}
