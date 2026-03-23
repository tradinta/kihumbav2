"use client";

import React from "react";
import StudioSidebar from "@/components/studio/StudioSidebar";
import TopBar from "@/components/TopBar";

export default function StudioLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-[var(--bg-color)]">
      {/* Studio specific sidebar taking full height */}
      <StudioSidebar />
      
      <main className="flex-1 min-w-0 flex flex-col h-screen overflow-hidden">
        {/* We reuse the generic TopBar for consistency, but within the Studio shell */}
        <div className="border-b border-custom bg-[var(--nav-bg)] sticky top-0 z-40">
          <TopBar />
        </div>
        
        {/* The active studio view gets an internal scrollable area */}
        <div className="flex-1 overflow-y-auto no-scrollbar bg-[var(--bg-color)] p-6 lg:p-10">
          <div className="max-w-6xl mx-auto w-full animate-in fade-in slide-in-from-bottom-4 duration-500">
            {children}
          </div>
        </div>
      </main>
    </div>
  );
}
