"use client";

import { useState } from "react";
import EligibilityGate from "./EligibilityGate";
import CreatorDashboard from "./CreatorDashboard";
import { growthData } from "@/data/growthData";

export default function CreatorHub() {
  const [isEligible, setIsEligible] = useState(growthData.eligibility.isEligible);

  return (
    <div className="w-full">
      {/* Dev toggle to preview the gate vs dashboard easily */}
      <div className="px-4 mb-4 flex justify-end">
         <button 
           onClick={() => setIsEligible(!isEligible)}
           className="text-[9px] font-bold uppercase tracking-widest text-primary-gold/50 hover:text-primary-gold"
         >
           Dev: Toggle Eligibility
         </button>
      </div>

      {!isEligible ? (
        <EligibilityGate data={growthData.eligibility} />
      ) : (
        <CreatorDashboard 
          analytics={growthData.creatorAnalytics} 
          activeTasks={growthData.activeTasks} 
          recentEarnings={growthData.recentEarnings} 
        />
      )}
    </div>
  );
}
