"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { usePathname, useRouter } from "next/navigation";

export default function OnboardingCheck() {
  const { user, isAuthenticated, isLoading } = useAuth();
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    if (isAuthenticated && !isLoading) {
      // Check the real status from the database
      fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/api/account/status`, {
        credentials: 'include'
      })
      .then(res => res.json())
      .then(data => {
        if (data.profileComplete === false) {
          // Redirect to the new full-page wizard if not already there
          if (pathname !== "/welcome" && pathname !== "/signup") {
            router.push("/welcome");
          }
        }
      })
      .catch(() => {
        // Fallback: If we can't fetch, don't interrupt heavily, but log it
        console.warn("Could not verify profile completion status.");
      });
    }
  }, [isAuthenticated, isLoading, pathname, router]);
  
  return null;
}
