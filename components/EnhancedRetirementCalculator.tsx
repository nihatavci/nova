'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
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
  Lightbulb
} from 'lucide-react';

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
  const router = useRouter();
  
  // Form state
  const [currentStep, setCurrentStep] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [currentTip, setCurrentTip] = useState(0);
  
  // Form data
  const [formData, setFormData] = useState({
    gender: '',
    age: '',
    monthlyInvestment: '',
    annualSalary: 80000,
    residenceStatus: '',
    taxClass: '',
    maritalStatus: '',
    children: '',
    investmentExperience: '',
    riskTolerance: '',
    retirementGoal: ''
  });
  
  // Steps for the multi-step form
  const steps: Step[] = [
    { id: 'gender', title: 'Gender', question: 'What is your gender?' },
    { id: 'age', title: 'Age', question: 'What is your age?' },
    { id: 'residenceStatus', title: 'Residence', question: 'What is your residence status?' },
    { id: 'annualSalary', title: 'Salary', question: 'What is your annual salary?' },
    { id: 'monthlyInvestment', title: 'Investment', question: 'How much can you invest monthly?' },
    { id: 'taxClass', title: 'Tax Class', question: 'What is your tax class?' },
    { id: 'maritalStatus', title: 'Marital Status', question: 'What is your marital status?' },
    { id: 'children', title: 'Children', question: 'Do you have children?' },
    { id: 'investmentExperience', title: 'Experience', question: 'What is your investment experience?' },
    { id: 'riskTolerance', title: 'Risk', question: 'What is your risk tolerance?' },
    { id: 'retirementGoal', title: 'Goal', question: 'What is your retirement goal?' }
  ];
  
  // Rotate financial tips during loading
  useEffect(() => {
    if (isLoading) {
      const interval = setInterval(() => {
        setCurrentTip(prev => (prev + 1) % financialTips.length);
      }, 3000);
      
      return () => clearInterval(interval);
    }
  }, [isLoading]);
  
  // Handle form submission
  const handleSubmit = () => {
    setIsLoading(true);
    
    // Simulate API call and processing
    setTimeout(() => {
      setIsLoading(false);
      setShowResults(true);
    }, 5000); // Reduced to 5 seconds for better UX
  };
  
  // Handle option selection
  const handleSelect = (stepId: string, optionId: string) => {
    setFormData({
      ...formData,
      [stepId]: optionId
    });
  };
  
  // Handle slider change for salary
  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>, field: string = 'annualSalary') => {
    setFormData({
      ...formData,
      [field]: parseInt(e.target.value)
    });
  };
  
  // Navigate to next step
  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(prev => prev + 1);
    } else {
      handleSubmit();
    }
  };
  
  // Navigate to previous step
  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };
  
  // Get current value for the current step
  const getCurrentValue = () => {
    const stepId = steps[currentStep].id;
    return formData[stepId as keyof typeof formData];
  };
  
  // Render options for the current step
  const renderOptions = () => {
    const step = steps[currentStep];
    let options: Option[] = [];
    
    switch (step.id) {
      case 'gender':
        options = [
          { id: 'male', label: 'Male', icon: <Users className="w-6 h-6" /> },
          { id: 'female', label: 'Female', icon: <Users className="w-6 h-6" /> },
          { id: 'diverse', label: 'Diverse', icon: <Users className="w-6 h-6" /> }
        ];
        break;
      case 'age':
        options = [
          { id: '18-30', label: '18-30', icon: <Users className="w-6 h-6" /> },
          { id: '31-45', label: '31-45', icon: <Users className="w-6 h-6" /> },
          { id: '46-60', label: '46-60', icon: <Users className="w-6 h-6" /> },
          { id: '60+', label: '60+', icon: <Users className="w-6 h-6" /> }
        ];
        break;
      case 'monthlyInvestment':
        options = [
          { id: 'option1', label: '€100 - €300', icon: <Euro className="w-6 h-6" />, description: 'Basic investment' },
          { id: 'option2', label: '€300 - €500', icon: <Euro className="w-6 h-6" />, description: 'Moderate investment' },
          { id: 'option3', label: '€500 - €1000', icon: <Euro className="w-6 h-6" />, description: 'Advanced investment' },
          { id: 'option4', label: '€1000+', icon: <Euro className="w-6 h-6" />, description: 'Premium investment' }
        ];
        break;
      case 'residenceStatus':
        options = [
          { id: 'permanent', label: 'Permanent Resident', icon: <HomeIcon className="w-6 h-6" />, description: 'Living in Germany permanently' },
          { id: 'temporary', label: 'Temporary Resident', icon: <HomeIcon className="w-6 h-6" />, description: 'Limited stay permit' },
          { id: 'eu-citizen', label: 'EU Citizen', icon: <Landmark className="w-6 h-6" />, description: 'Citizen of an EU country' },
          { id: 'non-eu', label: 'Non-EU Citizen', icon: <Landmark className="w-6 h-6" />, description: 'Citizen of a non-EU country' }
        ];
        break;
      case 'taxClass':
        options = [
          { id: 'class1', label: 'Tax Class 1', icon: <CreditCard className="w-6 h-6" />, description: 'Single, divorced, or widowed' },
          { id: 'class2', label: 'Tax Class 2', icon: <CreditCard className="w-6 h-6" />, description: 'Single parent with children' },
          { id: 'class3', label: 'Tax Class 3', icon: <CreditCard className="w-6 h-6" />, description: 'Married, higher earner' },
          { id: 'class4', label: 'Tax Class 4', icon: <CreditCard className="w-6 h-6" />, description: 'Married, equal earners' },
          { id: 'class5', label: 'Tax Class 5', icon: <CreditCard className="w-6 h-6" />, description: 'Married, lower earner' }
        ];
        break;
      case 'maritalStatus':
        options = [
          { id: 'single', label: 'Single', icon: <Users className="w-6 h-6" />, description: 'Never married' },
          { id: 'married', label: 'Married', icon: <Users className="w-6 h-6" />, description: 'Currently married' },
          { id: 'divorced', label: 'Divorced', icon: <Users className="w-6 h-6" />, description: 'Previously married' },
          { id: 'widowed', label: 'Widowed', icon: <Users className="w-6 h-6" />, description: 'Lost spouse' }
        ];
        break;
      case 'children':
        options = [
          { id: 'none', label: 'No Children', icon: <Users className="w-6 h-6" />, description: 'No dependent children' },
          { id: '1-2', label: '1-2 Children', icon: <Users className="w-6 h-6" />, description: 'One or two children' },
          { id: '3+', label: '3+ Children', icon: <Users className="w-6 h-6" />, description: 'Three or more children' }
        ];
        break;
      case 'investmentExperience':
        options = [
          { id: 'beginner', label: 'Beginner', icon: <TrendingUp className="w-6 h-6" />, description: 'New to investing' },
          { id: 'intermediate', label: 'Intermediate', icon: <TrendingUp className="w-6 h-6" />, description: 'Some experience' },
          { id: 'advanced', label: 'Advanced', icon: <TrendingUp className="w-6 h-6" />, description: 'Experienced investor' },
          { id: 'expert', label: 'Expert', icon: <TrendingUp className="w-6 h-6" />, description: 'Professional knowledge' }
        ];
        break;
      case 'riskTolerance':
        options = [
          { id: 'low', label: 'Low Risk', icon: <Shield className="w-6 h-6" />, description: 'Conservative approach' },
          { id: 'medium', label: 'Medium Risk', icon: <BarChart3 className="w-6 h-6" />, description: 'Balanced approach' },
          { id: 'high', label: 'High Risk', icon: <TrendingUp className="w-6 h-6" />, description: 'Aggressive approach' }
        ];
        break;
      case 'retirementGoal':
        options = [
          { id: 'early', label: 'Early Retirement', icon: <PiggyBank className="w-6 h-6" />, description: 'Before age 60' },
          { id: 'standard', label: 'Standard Retirement', icon: <PiggyBank className="w-6 h-6" />, description: 'Age 60-67' },
          { id: 'late', label: 'Late Retirement', icon: <PiggyBank className="w-6 h-6" />, description: 'After age 67' },
          { id: 'passive', label: 'Passive Income', icon: <Euro className="w-6 h-6" />, description: 'Generate ongoing income' }
        ];
        break;
      // Add more cases for other steps
      default:
        options = [
          { id: 'option1', label: 'Option 1', icon: <Check className="w-6 h-6" /> },
          { id: 'option2', label: 'Option 2', icon: <Check className="w-6 h-6" /> }
        ];
    }
    
    return (
      <div className={`grid ${step.id === 'taxClass' ? 'grid-cols-3' : 'grid-cols-2'} gap-3 mt-4 pb-4`}>
        {options.map((option) => (
          <button
            key={option.id}
            onClick={() => handleSelect(step.id, option.id)}
            className={`
              flex flex-col items-center justify-center p-3 rounded-xl transition-all
              ${formData[step.id as keyof typeof formData] === option.id
                ? 'bg-gradient-to-r from-gray-600 to-gray-800 text-white shadow-md'
                : 'bg-white border border-gray-200 text-gray-800 hover:shadow-md'
              }
            `}
          >
            <div className={`
              w-10 h-10 rounded-full flex items-center justify-center mb-2
              ${formData[step.id as keyof typeof formData] === option.id
                ? 'bg-gray-500'
                : 'bg-gray-100'
              }
            `}>
              {option.icon}
            </div>
            <span className="font-medium text-sm">{option.label}</span>
            {option.description && (
              <span className="text-xs mt-1 opacity-80 text-center">{option.description}</span>
            )}
          </button>
        ))}
      </div>
    );
  };
  
  // Render loading screen
  const renderLoadingScreen = () => (
    <div className="flex flex-col items-center justify-center h-full">
      <div className="w-16 h-16 border-4 border-gray-200 border-t-gray-800 rounded-full animate-spin mb-6"></div>
      <h3 className="text-xl font-semibold text-gray-900 mb-2">Analyzing Your Data</h3>
      <p className="text-gray-600 text-center mb-6">
        Our AI is processing your information to find the best retirement options for you.
      </p>
      <div className="bg-gray-100 p-4 rounded-lg max-w-md">
        <h4 className="font-medium text-gray-900 mb-2 flex items-center">
          <Lightbulb className="w-5 h-5 mr-2 text-yellow-500" />
          Financial Tip
        </h4>
        <p className="text-gray-700 text-sm">{financialTips[currentTip]}</p>
      </div>
    </div>
  );
  
  // Render progress bar
  const renderProgressBar = () => (
    <div className="mt-auto pt-4">
      <div className="flex justify-between text-xs text-gray-500 mb-2">
        <span>Progress</span>
        <span>{Math.round(((currentStep + 1) / steps.length) * 100)}%</span>
      </div>
      <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
        <div 
          className="h-full bg-gradient-to-r from-gray-500 to-gray-700"
          style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
        ></div>
      </div>
    </div>
  );
  
  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-200 h-auto min-h-[650px]">
      <div className="bg-gradient-to-b from-gray-700 to-gray-900 text-white p-4 sm:p-6">
        <h2 className="text-xl sm:text-2xl font-bold">Best Retirement Provision in 2025*</h2>
        <p className="text-sm sm:text-base opacity-90">Improve your pension with our premium advisory</p>
      </div>

      <div className="p-4 sm:p-6 flex flex-col" style={{ minHeight: "calc(100% - 88px)" }}>
        {/* Progress indicator */}
        <div className="flex justify-between items-center mb-4">
          <div className="text-sm text-gray-600">Step {currentStep + 1} of {steps.length}</div>
          <div className="flex items-center">
            <div className="w-4 h-4 rounded-full bg-yellow-400 mr-2"></div>
            <span className="text-sm font-medium">Premium Analysis</span>
          </div>
        </div>

        {/* Progress bar */}
        <div className="w-full bg-gray-200 rounded-full h-1.5 mb-6">
          <div 
            className="bg-gradient-to-r from-yellow-400 to-yellow-500 h-1.5 rounded-full" 
            style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
          ></div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-visible">
          {isLoading ? (
            renderLoadingScreen()
          ) : showResults ? (
            <div className="flex flex-col items-center">
              <div className="bg-gradient-to-r from-gray-100 to-gray-200 p-6 rounded-xl w-full max-w-md mb-6">
                <h3 className="text-xl font-bold text-gray-900 mb-4">Potential Annual Savings</h3>
                <p className="text-5xl font-bold text-center mb-4 bg-gradient-to-r from-gray-700 to-gray-900 bg-clip-text text-transparent">€10,450</p>
                <p className="text-gray-700 mb-6">Through optimized tax strategies and investment planning</p>
                
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-700">Tax Optimization</span>
                    <span className="font-semibold">€4,200/year</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-700">Investment Returns</span>
                    <span className="font-semibold">€3,750/year</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-700">Expense Reduction</span>
                    <span className="font-semibold">€2,500/year</span>
                  </div>
                </div>
              </div>

              <button 
                onClick={() => router.push('/dashboard')}
                className="px-8 py-3 bg-gradient-to-r from-gray-600 to-gray-800 text-white rounded-lg shadow-md hover:from-gray-700 hover:to-gray-900 transition-all"
              >
                View Your Dashboard
              </button>
            </div>
          ) : steps[currentStep].id === 'annualSalary' ? (
            <div className="flex flex-col justify-center h-full">
              <div className="text-center mb-6">
                <span className="text-6xl font-bold text-gray-900">€{formData.annualSalary.toLocaleString()}</span>
              </div>
              
              <input
                type="range"
                min="20000"
                max="500000"
                step="5000"
                value={formData.annualSalary}
                onChange={(e) => handleSliderChange(e, 'annualSalary')}
                className="w-full h-6 bg-gradient-to-r from-gray-300 to-gray-500 rounded-lg appearance-none cursor-pointer"
                style={{
                  '--thumb-color': 'silver',
                  '--track-height': '10px'
                } as React.CSSProperties}
              />
              
              <div className="mt-4 text-base font-medium text-gray-700 flex justify-between">
                <span>€20,000</span>
                <span>€500,000</span>
              </div>
              
              <style jsx>{`
                input[type=range] {
                  -webkit-appearance: none;
                  height: 10px;
                  border-radius: 8px;
                }
                
                input[type=range]::-webkit-slider-thumb {
                  -webkit-appearance: none;
                  height: 24px;
                  width: 24px;
                  border-radius: 50%;
                  background: silver;
                  cursor: pointer;
                  box-shadow: 0 2px 4px rgba(0,0,0,0.2);
                }
                
                input[type=range]::-moz-range-thumb {
                  height: 24px;
                  width: 24px;
                  border-radius: 50%;
                  background: silver;
                  cursor: pointer;
                  box-shadow: 0 2px 4px rgba(0,0,0,0.2);
                  border: none;
                }
                
                input[type=range]::-ms-thumb {
                  height: 24px;
                  width: 24px;
                  border-radius: 50%;
                  background: silver;
                  cursor: pointer;
                  box-shadow: 0 2px 4px rgba(0,0,0,0.2);
                }
              `}</style>
              
              <div className="mt-8 text-center">
                <button
                  onClick={handleNext}
                  className="px-10 py-4 bg-gradient-to-r from-gray-600 to-gray-800 text-lg text-white rounded-lg shadow-md hover:from-gray-700 hover:to-gray-900 transition-all"
                >
                  Continue
                </button>
              </div>
            </div>
          ) : steps[currentStep].id === 'monthlyInvestment' ? (
            <div className="flex flex-col justify-center h-full">
              <div className="text-center mb-6">
                <span className="text-6xl font-bold text-gray-900">
                  €{formData.monthlyInvestment ? formData.monthlyInvestment : '0'}
                </span>
              </div>
              
              <input
                type="range"
                min="0"
                max="2000"
                step="50"
                value={formData.monthlyInvestment || 0}
                onChange={(e) => handleSliderChange(e, 'monthlyInvestment')}
                className="w-full h-6 bg-gradient-to-r from-gray-300 to-gray-500 rounded-lg appearance-none cursor-pointer"
              />
              
              <div className="mt-4 text-base font-medium text-gray-700 flex justify-between">
                <span>€0</span>
                <span>€2,000</span>
              </div>
              
              <div className="mt-8 text-center">
                <button
                  onClick={handleNext}
                  className="px-10 py-4 bg-gradient-to-r from-gray-600 to-gray-800 text-lg text-white rounded-lg shadow-md hover:from-gray-700 hover:to-gray-900 transition-all"
                >
                  Continue
                </button>
              </div>
            </div>
          ) : (
            <div className="h-full flex flex-col">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">{steps[currentStep].question}</h3>
              {renderOptions()}
              
              <div className="flex justify-between mt-4 pt-2 pb-2">
                <button
                  onClick={handleBack}
                  className="flex items-center px-4 py-2 rounded-md text-gray-600 hover:bg-gray-100"
                >
                  <ChevronLeft className="w-5 h-5 mr-1" />
                  Back
                </button>
                
                <button
                  onClick={handleNext}
                  className="flex items-center px-4 py-2 rounded-md bg-gray-800 text-white"
                >
                  Skip
                  <ChevronRight className="w-5 h-5 ml-1" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
      
      {/* Footer with trust indicators */}
      <div className="bg-gray-50 p-3 border-t border-gray-200 flex justify-center mt-auto">
        <div className="flex items-center text-xs text-gray-500">
          <div className="w-4 h-4 rounded-full bg-yellow-400 mr-1"></div>
          Used by 3,432 satisfied customers
          <div className="mx-2">•</div>
          <Shield className="w-3 h-3 mr-1" />
          GDPR Compliant
        </div>
      </div>
    </div>
  );
} 