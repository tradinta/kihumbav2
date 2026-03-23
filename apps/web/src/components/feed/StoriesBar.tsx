"use client";

import { Plus } from "lucide-react";

const stories = [
  {
    id: "your-story",
    name: "Your Story",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuACS7Pn4iKQ0KOlR1S8CYAz3G5AtrQFQeldiq_FxCwzPzifr7lC8VcP4cx8NWgPauWr29v2JABOuDh7MJlYoUD2AZQcDv6qPQies6wlw-eXdANjE7VOyl_K0XrTv2_pHw0xpX3l2kcWrRN086OiuK0Yzq4Fo6Cw50gr9mRwan6v31DlkYgfmZnEH1JSlrlaUpnMIf11dWIQP2TWsojfqfw7Kno44pj3Zro6Cj2cLVMVMTRRuBR0Kbh2GUluE6tj1euLnWcQOI3GDFFD",
    isOwn: true,
    seen: false,
  },
  {
    id: "safaricom",
    name: "Safaricom",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuBLECic1h3_RmmBCR3a-RtvTQ0Mlp9vAvJdiOjQvjqWKEzZblonEM8BOlxN13e_KExcwxhboQoK4L6bmcYazrMAITFLlPRgMV_JRO7SUV2UhKBHZvU0Y0OdFhKY3fJmiU8wC-ozYJU2sYSW9DBy6gSMbYAQuUPJfJJSYI_OvytTuNy6uNoNyRV0Y2IxU-RJQk1TzpAOmRb-PnpfVeRzFApseq087IfteMejjp6WlIPxjmDZa9y0HyIL4yUPKPwejRZbRB1D0cRwD0vR",
    isOwn: false,
    seen: false,
  },
  {
    id: "kamau",
    name: "Kamau",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuCVRxiwOg-pMg1RugKgqUEK8Ym7F6zhwqmTW66fxjBmMCCDC-2m1Jmm4MaL-XvUyvHv5p5qK7hq-QVQQ8NXeIyzm29lnlSCKpOs8VOBvpm-1ApnUCnlOdhM4128QEdeafu1zIzBNwSKarDDznz83zTgi3ZFsuh9xnXeKPttafgG2GbSRguQXTv6cDGo9GuMj4M74ZM6mdCmofTk9j5WRQ84pKaQq-WKTOMkJcgMg6R0E3VrTond77ECUz1sHBIQ66zg6-0megI4KHX3",
    isOwn: false,
    seen: false,
  },
  {
    id: "wanjiku",
    name: "Wanjiku",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuD47UmisG4EnyDtk6w8-frNvTjUOox1Nq9KP7pRcQcahj5Aq9xVgrZUt3PlAWweTfP9MyAxiEbUGohEz-sGWw478vPjZLrYABOi_YR_jUl_EFYNw1nyvFHf7pP-r3S-7qrSPhPZvM13zNBo7TTkoMEBZ5d_iQi1gP_EJqgncFgYpyuVMd60hgv7dHspw3IhcIwNGLkTm0aq1JTzN5ZQPWx0-6ixWSKZG11wOgaCUsblrT6YvZe6FAlpvOO625x-Ex8oINlT1f6a2Q_K",
    isOwn: false,
    seen: true,
  },
  {
    id: "otieno",
    name: "Otieno",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuBtybnJkTWyDCI2riQjGAzSdkmoZlzfkuZE29TFvMwQiFsqXC2oOWNZPMwfOo5n_fpDccgNPiyAxqdPOHH1rzViklqvdAs03Rfd4Ng9YbstNwBw0DBxgFEzHjDeACAMz4ga0nXckhZCayFTNCzQePdENatj_aZfNOIqacLS0sQS-uNxqliYE3NET2ay18WkjX2luD2trZVZYAhmaA7-tFXCgD_tytEbhmkm1DpFE5n4EMatPi8bK-DeQIiUVYZjcRd8U95CGi8Q_XPw",
    isOwn: false,
    seen: true,
  },
];

export default function StoriesBar() {
  return (
    <div className="px-4 py-3">
      <div className="flex gap-4 overflow-x-auto no-scrollbar pb-1">
        {stories.map((story) => (
          <button
            key={story.id}
            aria-label={`View ${story.name}'s story`}
            className="flex flex-col items-center gap-1.5 shrink-0 group"
          >
            <div className="relative">
              <div className={`rounded-full ${story.seen ? "story-ring-seen" : "story-ring"}`}>
                <div className="size-14 rounded-full overflow-hidden bg-[var(--card-bg)] p-[2px]">
                  <img
                    src={story.image}
                    alt={story.name}
                    className="w-full h-full object-cover rounded-full group-hover:scale-105 transition-transform duration-200"
                  />
                </div>
              </div>
              {story.isOwn && (
                <div className="absolute -bottom-0.5 -right-0.5 size-5 rounded-full bg-primary-gold flex items-center justify-center ring-2 ring-[var(--bg-color)]">
                  <Plus size={12} strokeWidth={3} className="text-black" />
                </div>
              )}
            </div>
            <span className={`text-[10px] font-medium truncate max-w-[60px] ${
              story.seen ? "text-muted-custom" : "text-main"
            }`}>
              {story.name}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
