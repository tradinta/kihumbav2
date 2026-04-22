"use client";

import { useState } from "react";
import { Phone, Mail, Loader2, CheckCircle2 } from "lucide-react";

export default function ContactStage({ data, updateData }: any) {
  const [isVerifying, setIsVerifying] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);

  const simulateOtp = () => {
    setIsVerifying(true);
    setTimeout(() => {
      setOtpSent(true);
      setIsVerifying(false);
    }, 1500);
  };

  const verifyOtp = () => {
    setIsVerifying(true);
    setTimeout(() => {
      setOtpVerified(true);
      setIsVerifying(false);
    }, 1200);
  };

  return (
    <div className="space-y-12">
      <div>
        <h2 className="text-4xl font-black tracking-tighter leading-none mb-4">Secure your communication channel.</h2>
        <p className="text-sm font-medium text-muted-custom">Verify your identity via mobile OTP and business email.</p>
      </div>

      <div className="space-y-8">
        <div className="space-y-4">
          <label className="text-[10px] font-black uppercase tracking-widest text-muted-custom">Phone Number (Safaricom/Airtel)</label>
          <div className="flex gap-3">
            <div className="flex-1 relative">
              <Phone size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-custom" />
              <input 
                type="tel" 
                placeholder="+254 7XX XXX XXX" 
                className="w-full bg-white/5 border border-white/10 rounded-xl pl-12 pr-4 py-4 text-sm font-black text-main focus:outline-none focus:border-primary-gold/50 transition-all"
                value={data.phone}
                onChange={(e) => updateData({ phone: e.target.value })}
                disabled={otpVerified}
              />
            </div>
            
            {!otpSent && !otpVerified && (
              <button 
                onClick={simulateOtp}
                disabled={isVerifying || !data.phone}
                className="px-6 py-4 rounded-xl bg-white/5 border border-white/10 text-[10px] font-black uppercase tracking-widest hover:bg-white/10 transition-all disabled:opacity-50"
              >
                {isVerifying ? <Loader2 className="animate-spin" size={16} /> : "Send OTP"}
              </button>
            )}

            {otpSent && !otpVerified && (
              <div className="flex gap-2">
                <input 
                  type="text" 
                  maxLength={4} 
                  placeholder="CODE" 
                  className="w-24 bg-primary-gold/10 border border-primary-gold/30 rounded-xl px-4 py-4 text-center text-sm font-black text-primary-gold tracking-[0.5em] focus:outline-none"
                />
                <button 
                  onClick={verifyOtp}
                  className="px-6 py-4 rounded-xl bg-primary-gold text-black text-[10px] font-black uppercase tracking-widest"
                >
                  {isVerifying ? <Loader2 className="animate-spin" size={16} /> : "Verify"}
                </button>
              </div>
            )}

            {otpVerified && (
              <div className="px-6 py-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 flex items-center gap-2 text-[10px] font-black uppercase tracking-widest">
                <CheckCircle2 size={16} /> Verified
              </div>
            )}
          </div>
        </div>

        <div className="space-y-4">
          <label className="text-[10px] font-black uppercase tracking-widest text-muted-custom">Business Email Address</label>
          <div className="relative">
            <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-custom" />
            <input 
              type="email" 
              placeholder="legal@yourbusiness.com" 
              className="w-full bg-white/5 border border-white/10 rounded-xl pl-12 pr-4 py-4 text-sm font-black text-main focus:outline-none focus:border-primary-gold/50 transition-all"
              value={data.email}
              onChange={(e) => updateData({ email: e.target.value })}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
