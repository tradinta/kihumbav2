"use client";

import { useState } from "react";
import { ImageIcon, Film, Layout, Monitor, Type, LayoutGrid, Users, Search, UserCircle, ChevronDown, Check } from "lucide-react";

export const FORMAT_DATA: Record<string, { name: string; desc: string; icon: any; specs: string; pricing?: string }> = {
  "image": { name: "Static Image", desc: "Standard 1:1 or 4:5 visual.", icon: ImageIcon, specs: "Max 5MB • JPG/PNG • 1080x1080px recommended" },
  "carousel": { name: "Carousel", desc: "Multiple sliding cards (up to 5).", icon: Layout, pricing: "CPM", specs: "Max 3MB per card • 1:1 Aspect Ratio" },
  "video": { name: "Video (Horizontal)", desc: "Standard 16:9 cinematic video.", icon: Film, specs: "Max 50MB • MP4/MOV • 15s Max" },
  "vertical-video": { name: "Vertical Video", desc: "Full-screen 9:16 Sparks video.", icon: Film, specs: "Max 100MB • 9:16 Ratio • 5-60s" },
  "banner": { name: "Lower-third Banner", desc: "Compact overlay graphic.", icon: Monitor, specs: "728x90px or 320x50px • GIF/PNG" },
  "text-thumbnail": { name: "Text + Thumbnail", desc: "Compact social format.", icon: Type, specs: "60 chars max headline • 1:1 thumbnail" },
  "native-card": { name: "Native Card", desc: "Platform-integrated card.", icon: Layout, specs: "Responsive layout • Auto-scaled" },
  "sticky-card": { name: "Sticky Card", desc: "Permanent sidebar fixture.", icon: LayoutGrid, specs: "300x250px or 300x600px" },
  "tribe-card": { name: "Native Tribe Card", desc: "Tribe discovery format.", icon: Users, specs: "Tribe ID required • Verified Tribes only" },
  "result-card": { name: "Native Result Card", desc: "Search-integrated result.", icon: Search, specs: "Dynamic content based on search query" },
  "profile-card": { name: "Profile Card", desc: "Follow-optimized card.", icon: UserCircle, specs: "Bio preview included • Profile link mandatory" },
};

const CTA_OPTIONS = ["Shop Now", "Learn More", "Join Tribe", "Watch Video", "Send Message", "Follow", "Apply Now", "Get Quote"];

export default function MaterialStage({ 
  allowedFormats, 
  selected, 
  onSelect 
}: { 
  allowedFormats: string[], 
  selected: string | null, 
  onSelect: (id: string) => void 
}) {
  const [headline, setHeadline] = useState("");
  const [caption, setCaption] = useState("");
  const [cta, setCta] = useState(CTA_OPTIONS[0]);

  return (
    <div className="space-y-12">
      {/* Format Selection Grid */}
      <div className="space-y-4">
        <label className="text-[9px] font-black uppercase tracking-widest text-muted-custom">Select Ad Format</label>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {allowedFormats.map((fId) => {
            const f = FORMAT_DATA[fId];
            return (
              <button 
                key={fId}
                onClick={() => onSelect(fId)}
                className={`flex flex-col gap-4 p-5 rounded-xl border transition-all text-left group ${
                  selected === fId 
                   ? "border-primary-gold bg-primary-gold/5" 
                   : "border-custom hover:border-white/20 bg-white/[0.02]"
                }`}
              >
                <div className={`size-12 rounded-lg border flex items-center justify-center transition-all ${
                  selected === fId 
                    ? "border-primary-gold/40 text-primary-gold" 
                    : "border-white/10 text-muted-custom group-hover:text-main"
                }`}>
                  <f.icon size={24} />
                </div>
                <div>
                  <p className="text-xs font-black uppercase tracking-widest">{f.name}</p>
                  <p className="text-[10px] font-medium text-muted-custom mt-1 leading-relaxed">{f.desc}</p>
                  <p className="text-[8px] font-black text-primary-gold/60 uppercase mt-3">{f.specs}</p>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Creative Details (Conditional on Format Selection) */}
      {selected && (
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 pt-8 border-t border-custom">
          <div className="md:col-span-7 space-y-8">
             <div>
                <div className="flex justify-between items-center mb-3">
                   <label className="text-[9px] font-black uppercase tracking-widest text-muted-custom">Headline</label>
                   <span className="text-[9px] font-black text-muted-custom">{headline.length}/60</span>
                </div>
                <input 
                  type="text" 
                  maxLength={60}
                  value={headline}
                  onChange={(e) => setHeadline(e.target.value)}
                  placeholder="The hook that catches the user's eye..." 
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-sm font-bold text-main focus:outline-none focus:border-primary-gold/50 transition-all"
                />
             </div>

             <div>
                <div className="flex justify-between items-center mb-3">
                   <label className="text-[9px] font-black uppercase tracking-widest text-muted-custom">Main Caption</label>
                   <span className="text-[9px] font-black text-muted-custom">{caption.length}/280</span>
                </div>
                <textarea 
                  maxLength={280}
                  value={caption}
                  onChange={(e) => setCaption(e.target.value)}
                  placeholder="Tell your story or describe your offer..." 
                  className="w-full h-32 bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-sm font-medium text-main focus:outline-none focus:border-primary-gold/50 transition-all resize-none leading-relaxed"
                />
             </div>
          </div>

          <div className="md:col-span-5 space-y-8">
             <div>
                <label className="block text-[9px] font-black uppercase tracking-widest text-muted-custom mb-3">Call to Action (CTA)</label>
                <div className="grid grid-cols-2 gap-2">
                   {CTA_OPTIONS.map((option) => (
                      <button 
                        key={option}
                        onClick={() => setCta(option)}
                        className={`px-3 py-2.5 rounded-lg border text-[9px] font-black uppercase tracking-widest transition-all ${
                           cta === option 
                             ? "bg-primary-gold text-black border-primary-gold" 
                             : "bg-white/5 border-white/10 text-muted-custom hover:border-white/20"
                        }`}
                      >
                         {option}
                      </button>
                   ))}
                </div>
             </div>

             <div className="p-5 rounded-xl border border-dashed border-white/10 bg-white/[0.02] flex flex-col items-center justify-center gap-4 group cursor-pointer hover:bg-white/5 hover:border-primary-gold/30 transition-all">
                <div className="p-4 rounded-full bg-white/5 text-muted-custom group-hover:text-primary-gold transition-colors">
                   {FORMAT_DATA[selected].icon === Film ? <Film size={32} /> : <ImageIcon size={32} />}
                </div>
                <div className="text-center">
                   <p className="text-[10px] font-black uppercase tracking-widest text-main">Upload {FORMAT_DATA[selected].name} Material</p>
                   <p className="text-[8px] font-bold text-muted-custom mt-1 italic">Click to browse or drag and drop</p>
                </div>
             </div>
          </div>
        </div>
      )}
    </div>
  );
}
