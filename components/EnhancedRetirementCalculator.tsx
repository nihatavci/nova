'use client';

import React from 'react';
import { 
  PiggyBank, 
  TrendingUp, 
  Landmark, 
  Home as HomeIcon, 
  ChevronLeft, 
  ChevronRight,
  Check,
  Shield,
  Briefcase,
  Users,
  GraduationCap,
  Building,
  Euro,
  MessageCircle,
  CreditCard,
  ArrowLeftRight,
  BarChart3,
  Lock,
  Download,
  Gift,
  Lightbulb,
  ArrowRight,
  ArrowLeft,
  X,
  Printer,
  RefreshCw,
  AlertCircle,
  Calendar
} from 'lucide-react';
import { saveRetirementData, getRetirementData, clearRetirementData } from '@/lib/session-recovery';
import { calculateRetirementScore, formatCurrency, formatPercentage, handleApiError } from '@/lib/api-helpers';
import MultiStepForm from './RetirementCalculator/MultiStepForm';

// Step interface for multi-step form
interface Step {
  id: string;
  title: string;
  question: string;
}

// Option interface for selectable items
interface Option {
  id: string;
  label: string;
  icon: React.ReactNode;
  description?: string;
}

// Form data interface
interface FormData {
  gender: string;
  age: string;
  retirementAge: string;
  grossMonthlyIncome: string;
  annualSalary: number;
  residenceStatus: string;
  taxClass: string;
  maritalStatus: string;
  children: string;
  investmentExperience: string;
  riskTolerance: string;
  retirementGoal: string;
  currentSavings: number;
  monthlyContribution: number;
  isExpat: string;
  hasInvestmentProperty: string;
  hasForeignIncome: string;
}

// Add these interfaces for API responses
interface RetirementScoreResponse {
  success: boolean;
  data: {
    rrsScore: number;
    potentialSavings: number;
    investmentAllocation: {
      stocks: number;
      bonds: number;
      cash: number;
      alternatives: number;
    };
    projectedSavings: number;
    netMonthlyIncome: number;
    estimatedMonthlyRetirementIncome: number;
    incomeReplacementRate: number;
    report: string;
  };
}

// Financial tips to show during loading
const financialTips = [
  "Diversify your investments to reduce risk and maximize returns.",
  "Consider tax-advantaged retirement accounts to optimize your savings.",
  "Review your investment portfolio regularly to ensure it aligns with your goals.",
  "Emergency funds should cover 3-6 months of expenses.",
  "Pay off high-interest debt before focusing on investments.",
  "Automate your savings to ensure consistent contributions.",
  "Consider the impact of inflation on your long-term financial plans.",
  "Review your insurance coverage to protect your assets.",
  "Estate planning is essential for protecting your family's future.",
  "Regularly monitor your credit score and report."
];

export default function EnhancedRetirementCalculator() {
  return (
    <div className="w-full max-w-6xl mx-auto px-4 py-8 animate-fadeIn">
      <MultiStepForm />
    </div>
  );
} 