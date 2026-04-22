"use client";

import Link from "next/link";
import { BadgeCheck } from "lucide-react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface UserIdentityProps {
  user: {
    id?: string;
    username: string;
    fullName?: string;
    avatar?: string;
    isVerified?: boolean;
    accountType?: "NORMAL" | "BUSINESS" | "GOVERNMENT" | string;
    subscriptionTier?: "FREE" | "PRO" | "PLUS" | string;
    hasStatus?: boolean;
    countyId?: string;
    institution?: string;
    businessColor?: string;
    businessWeight?: string;
  };
  size?: "xs" | "sm" | "md" | "lg" | "xl";
  showSocial?: boolean;
  hideHandle?: boolean;
  hideName?: boolean;
  hideAvatar?: boolean;
  hideCheckmark?: boolean;
  className?: string;
  isLink?: boolean;
}

const sizeMap = {
  xs: { avatar: "size-6", name: "text-[9px]", handle: "text-[8px]", badge: 12, locality: "text-[7px]", border: "border-[1px]" },
  sm: { avatar: "size-8", name: "text-[11px]", handle: "text-[9px]", badge: 14, locality: "text-[8px]", border: "border-[1.5px]" },
  md: { avatar: "size-10", name: "text-xs", handle: "text-[10px]", badge: 16, locality: "text-[9px]", border: "border-2" },
  lg: { avatar: "size-16", name: "text-base", handle: "text-xs", badge: 20, locality: "text-[10px]", border: "border-2" },
  xl: { avatar: "size-24", name: "text-2xl", handle: "text-sm", badge: 24, locality: "text-[11px]", border: "border-[3px]" },
};

export default function UserIdentity({
  user,
  size = "md",
  showSocial = true,
  hideHandle = false,
  hideName = false,
  hideAvatar = false,
  hideCheckmark = false,
  className,
  isLink = true,
}: UserIdentityProps) {
  const s = sizeMap[size];
  const profileHref = `/profile/${user.username}`;
  
  const accountType = user.accountType || "NORMAL";
  
  // Robust Tier Detection
  const tier = (user.subscriptionTier || (user as any).tier || "")?.toString().toUpperCase() || "FREE";
  const isPremiumLegacy = (user as any).isPremium === true;
  const isPlus = accountType === 'NORMAL' && (tier === 'PLUS' || tier === 'ELITE' || isPremiumLegacy);
  const isPro = accountType === 'NORMAL' && tier === 'PRO';
  
  const hasStatus = user.hasStatus || false;

  const getAvatarShape = () => {
    if (accountType === 'NORMAL') return 'rounded-full';
    return 'rounded-[25%]'; // Squircle geometry
  };

  const getFrameStyles = () => {
    let classes = [];
    
    // 1. Identity Base Frame
    if (accountType === 'NORMAL') {
      if (isPlus) classes.push('border-transparent animate-torch-bg shadow-[0_0_25px_rgba(255,215,0,0.4)]');
      else if (isPro) classes.push('border-primary-gold shadow-[0_0_12px_rgba(212,175,55,0.2)]');
      else classes.push('border-white/10');
    } else if (accountType === 'GOVERNMENT') {
      classes.push('border-slate-300 shadow-[0_0_15px_rgba(148,163,184,0.2)]');
    } else if (accountType === 'BUSINESS') {
      classes.push('border-solid');
    }

    // 2. Status Ring Override (Outer Halo)
    if (hasStatus) {
      classes.push('ring-[2.5px] ring-offset-[2.5px] ring-offset-black ring-orange-600');
    }

    return cn(s.border, ...classes);
  };

  const getInlineStyles = () => {
    if (accountType === 'BUSINESS') {
      return { 
        borderColor: user.businessColor || '#1d9bf0', 
        borderWidth: user.businessWeight || (size === 'xs' ? '1.5px' : '3px') 
      };
    }
    return {};
  };

  const renderCheckmark = () => {
    if (accountType === 'GOVERNMENT') return <BadgeCheck size={s.badge} className="badge-solid text-white fill-slate-400 shrink-0" />;
    if (accountType === 'BUSINESS') return <BadgeCheck size={s.badge} className="badge-solid text-white shrink-0" style={{ fill: user.businessColor || '#1d9bf0' }} />;
    
    if (accountType === 'NORMAL') {
      if (isPlus) return (
        <div className="relative inline-flex shrink-0 drop-shadow-[0_0_15px_rgba(255,215,0,0.6)]">
          <BadgeCheck size={s.badge} className="badge-solid text-white fill-[#D4AF37]" />
          <div className="absolute inset-0 animate-torch-mask">
            <BadgeCheck size={s.badge} className="badge-solid text-white fill-white" />
          </div>
        </div>
      );
      if (isPro || user.isVerified) return <BadgeCheck size={s.badge} className="badge-solid text-white fill-primary-gold shrink-0" />;
    }
    return null;
  };

  const AvatarComponent = (
    <div 
      className={cn(
        "relative flex items-center justify-center transition-all duration-500",
        getAvatarShape(),
        getFrameStyles(),
        s.avatar
      )}
      style={getInlineStyles()}
    >
      <div className={cn("size-full bg-black overflow-hidden", getAvatarShape())}>
        <img
          src={user.avatar || "/branding/avatar-fallback.png"}
          alt={user.username}
          className="w-full h-full object-cover"
        />
      </div>
    </div>
  );

  const countyName = typeof user.countyId === 'string' ? user.countyId.charAt(0).toUpperCase() + user.countyId.slice(1) : null;

  return (
    <div className={cn("flex items-center gap-3 min-w-0", className)}>
      {!hideAvatar && (
        isLink ? (
          <Link href={profileHref} className="shrink-0 hover:scale-105 transition-transform">
            {AvatarComponent}
          </Link>
        ) : (
          <div className="shrink-0">{AvatarComponent}</div>
        )
      )}

      {!hideName && (
        <div className="flex-1 min-w-0">
          <div className="flex flex-col">
            <div className="flex items-center gap-1.5 min-w-0">
              {isLink ? (
                <Link href={profileHref} className={cn(
                  "font-inter font-bold truncate tracking-tight transition-colors",
                  s.name,
                  isPlus ? "animate-torch-text drop-shadow-[0_0_12px_rgba(212,175,55,0.4)]" : "text-main hover:text-primary-gold"
                )}>
                  {user.fullName || user.username}
                </Link>
              ) : (
                <span className={cn(
                  "font-inter font-bold truncate tracking-tight",
                  s.name,
                  isPlus ? "animate-torch-text drop-shadow-[0_0_12px_rgba(212,175,55,0.4)]" : "text-main"
                )}>
                  {user.fullName || user.username}
                </span>
              )}
              {!hideCheckmark && renderCheckmark()}
            </div>
            
            <div className="flex items-center gap-1.5 min-w-0">
              {showSocial && !hideHandle && (
                <span className={cn("text-muted-custom truncate font-bold leading-none opacity-70", s.handle)}>
                  @{user.username}
                </span>
              )}
              {countyName && (
                 <>
                   <span className="size-[2px] rounded-full bg-main/20 shrink-0" />
                   <span className={cn("text-indigo-400 font-black uppercase tracking-widest leading-none", s.locality)}>
                     {countyName}
                   </span>
                 </>
              )}
              {user.institution && size !== 'xs' && (
                 <>
                   <span className="size-[2px] rounded-full bg-white/20 shrink-0" />
                   <span className={cn("text-blue-400 font-black uppercase tracking-widest leading-none truncate", s.locality)}>
                     {user.institution.split(' ').map(w => w[0]).join('').slice(0, 4)}
                   </span>
                 </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
