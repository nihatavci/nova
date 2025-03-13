"use client";

import { useState, useEffect } from "react";
import { RetirementOnboarding } from "./RetirementOnboarding";
import MainPage from "../RetirementCalculator/MainPage";

export default function OnboardingContainer() {
  // Start with null to prevent hydration mismatch
  const [showOnboarding, setShowOnboarding] = useState<boolean | null>(null);
  
  // Check if user has completed onboarding before - only run on client side
  useEffect(() => {
    // Get from localStorage
    const hasCompletedOnboarding = localStorage.getItem("hasCompletedOnboarding");
    
    // Only show onboarding if user hasn't completed it before
    setShowOnboarding(hasCompletedOnboarding !== "true");
    
    // Log for debugging
    console.log("Onboarding state initialized:", { hasCompletedOnboarding, showOnboarding: hasCompletedOnboarding !== "true" });
  }, []);

  const handleOnboardingComplete = () => {
    // Save that user has completed onboarding
    localStorage.setItem("hasCompletedOnboarding", "true");
    setShowOnboarding(false);
    console.log("Onboarding completed");
  };

  const handleSkipOnboarding = () => {
    localStorage.setItem("hasCompletedOnboarding", "true");
    setShowOnboarding(false);
    console.log("Onboarding skipped");
  };

  const handleResetOnboarding = () => {
    localStorage.removeItem("hasCompletedOnboarding");
    setShowOnboarding(true);
    console.log("Onboarding reset");
  };

  // Don't render anything until we've checked localStorage (prevents flash)
  if (showOnboarding === null) {
    return null;
  }

  return (
    <>
      {/* Main content always visible */}
      <div className={`transition-all duration-500 ${showOnboarding ? "filter blur-sm brightness-75" : ""}`}>
        <MainPage />
      </div>
      
      {/* Onboarding popup overlay */}
      {showOnboarding && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/30 backdrop-blur-sm animate-fadeIn">
          <div className="relative max-w-4xl w-full">
            <button 
              onClick={handleSkipOnboarding}
              className="absolute top-4 right-4 z-10 text-sm text-white bg-[#0A1E3C]/50 px-3 py-1 rounded-full hover:bg-[#0A1E3C]/70 transition-colors"
            >
              Skip onboarding
            </button>
            <RetirementOnboarding onComplete={handleOnboardingComplete} />
          </div>
        </div>
      )}
      
      {/* Hidden reset button for testing - only visible in development */}
      {process.env.NODE_ENV !== 'production' && (
        <button
          onClick={handleResetOnboarding}
          className="fixed bottom-4 right-4 bg-gray-200 text-gray-700 text-xs px-2 py-1 rounded-md opacity-50 hover:opacity-100 z-50"
        >
          Reset Onboarding
        </button>
      )}
    </>
  );
} 