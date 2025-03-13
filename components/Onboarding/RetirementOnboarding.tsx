"use client";

import { useState, useEffect } from "react";
import { ArrowRight, ArrowLeft, Coins, Calculator, BarChart } from "lucide-react";

interface OnboardingStepProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  isActive: boolean;
}

const OnboardingStep = ({ title, description, icon, isActive }: OnboardingStepProps) => (
  <div
    className={`absolute inset-0 flex flex-col items-center justify-center space-y-6 px-6 text-center transition-opacity duration-500 ${
      isActive ? "opacity-100 z-10" : "opacity-0 pointer-events-none z-0"
    }`}
  >
    <div className="flex h-20 w-20 items-center justify-center rounded-full bg-[#FBD96D] text-[#0A1E3C]">
      {icon}
    </div>
    <h2 className="text-2xl font-bold text-[#0A1E3C]">{title}</h2>
    <p className="max-w-md text-gray-600">{description}</p>
  </div>
);

export function RetirementOnboarding({ onComplete }: { onComplete: () => void }) {
  const [step, setStep] = useState(1);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const steps = [
    {
      title: "Plan Your Retirement with Confidence",
      description:
        "Our retirement calculator helps you visualize your financial future and make informed decisions. Set goals, track progress, and achieve the retirement you deserve.",
      icon: <Coins size={32} />,
    },
    {
      title: "How Our Calculator Works",
      description:
        "Simply input your current savings, monthly contributions, and retirement goals. Our advanced algorithm will calculate your projected retirement income and suggest optimizations.",
      icon: <Calculator size={32} />,
    },
    {
      title: "Ready to Secure Your Future?",
      description:
        "Take the first step toward a worry-free retirement. Our personalized recommendations will help you maximize your savings and reach your financial goals.",
      icon: <BarChart size={32} />,
    },
  ];

  const totalSteps = steps.length;

  const handleNext = () => {
    if (step < totalSteps && !isTransitioning) {
      setIsTransitioning(true);
      setTimeout(() => {
        setStep(step + 1);
        setIsTransitioning(false);
      }, 300);
    }
  };

  const handlePrevious = () => {
    if (step > 1 && !isTransitioning) {
      setIsTransitioning(true);
      setTimeout(() => {
        setStep(step - 1);
        setIsTransitioning(false);
      }, 300);
    }
  };

  const handleGetStarted = () => {
    // Add a slight delay before completing to ensure smooth transition
    setIsTransitioning(true);
    setTimeout(() => {
      onComplete();
    }, 300);
  };

  // Log when component mounts and unmounts for debugging
  useEffect(() => {
    console.log("Onboarding component mounted");
    return () => {
      console.log("Onboarding component unmounted");
    };
  }, []);

  // Log step changes
  useEffect(() => {
    console.log("Onboarding step changed to:", step);
  }, [step]);

  return (
    <div className="flex flex-col rounded-xl border bg-white shadow-xl overflow-hidden animate-fadeIn">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#0A1E3C] to-[#15294D] text-white p-6">
        <h1 className="text-2xl font-bold flex items-center">
          <span className="bg-[#FBD96D] text-[#0A1E3C] w-8 h-8 rounded-full flex items-center justify-center mr-3">
            {step}
          </span>
          Nova Retirement Calculator
        </h1>
        <p className="text-white/80 mt-2">Your path to financial security in Germany</p>
      </div>
      
      {/* Content */}
      <div className="relative flex-1 overflow-hidden p-8 min-h-[400px]">
        {steps.map((stepContent, index) => (
          <OnboardingStep
            key={index}
            title={stepContent.title}
            description={stepContent.description}
            icon={stepContent.icon}
            isActive={index + 1 === step}
          />
        ))}
      </div>

      {/* Footer */}
      <div className="border-t bg-gray-50 p-6">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div className="flex justify-center space-x-2">
            {[...Array(totalSteps)].map((_, index) => (
              <div
                key={index}
                className={`h-2 rounded-full transition-all duration-300 ${
                  index + 1 === step
                    ? "bg-[#FBD96D] w-8"
                    : index + 1 < step
                    ? "bg-[#FBD96D]"
                    : "bg-[#0A1E3C] opacity-20 w-2"
                }`}
              />
            ))}
          </div>
          
          <div className="flex justify-end gap-3">
            {step > 1 && (
              <button
                onClick={handlePrevious}
                disabled={isTransitioning}
                className={`group flex items-center border border-[#0A1E3C] text-[#0A1E3C] px-4 py-2 rounded-md hover:bg-gray-50 transition-opacity ${
                  isTransitioning ? "opacity-50 cursor-not-allowed" : ""
                }`}
              >
                <ArrowLeft
                  className="mr-2 opacity-60 transition-transform group-hover:-translate-x-0.5"
                  size={16}
                  strokeWidth={2}
                />
                Back
              </button>
            )}
            
            {step < totalSteps ? (
              <button
                onClick={handleNext}
                disabled={isTransitioning}
                className={`group flex items-center bg-[#0A1E3C] text-white px-4 py-2 rounded-md hover:bg-[#0A1E3C]/90 transition-opacity ${
                  isTransitioning ? "opacity-50 cursor-not-allowed" : ""
                }`}
              >
                Next
                <ArrowRight
                  className="ml-2 opacity-60 transition-transform group-hover:translate-x-0.5"
                  size={16}
                  strokeWidth={2}
                />
              </button>
            ) : (
              <button
                onClick={handleGetStarted}
                disabled={isTransitioning}
                className={`group flex items-center bg-[#FBD96D] text-[#0A1E3C] px-4 py-2 rounded-md hover:bg-[#FBD96D]/90 transition-opacity ${
                  isTransitioning ? "opacity-50 cursor-not-allowed" : ""
                }`}
              >
                Get Started
                <ArrowRight
                  className="ml-2 opacity-60 transition-transform group-hover:translate-x-0.5"
                  size={16}
                  strokeWidth={2}
                />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 