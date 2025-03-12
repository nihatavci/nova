'use client';

import { useState, useEffect, ChangeEvent, useMemo } from 'react';
import { 
  FaBriefcase, 
  FaUserTie, 
  FaLaptopCode, 
  FaBuilding, 
  FaGraduationCap, 
  FaQuestion,
  FaShieldAlt,
  FaLock,
  FaCheck,
  FaLightbulb,
  FaSpinner,
  FaAward,
  FaMoneyBillWave,
  FaPiggyBank,
  FaChartLine,
  FaCalendarAlt,
  FaArrowRight,
  FaArrowLeft,
  FaRegFilePdf
} from 'react-icons/fa';
import { 
  calculateRetirementReadiness, 
  RetirementInputs, 
  RetirementResults 
} from '@/utils/retirementCalculator';
import ResultsPage from './ResultsPage';

// Define the steps for the form
interface Step {
  id: string;
  title: string;
  question: string;
  shortDesc: string;
  defaultValues: Partial<FormData>;
}

const steps: Step[] = [
  {
    id: 'age',
    title: 'Age',
    question: 'What is your current age?',
    shortDesc: 'Your age helps us calculate your retirement timeline',
    defaultValues: { age: null }
  },
  {
    id: 'currentSalary',
    title: 'Salary',
    question: 'What is your current annual salary?',
    shortDesc: 'Your salary is the foundation of your retirement planning',
    defaultValues: { currentSalary: 60000 }
  },
  {
    id: 'currentSavings',
    title: 'Savings',
    question: 'How much have you already saved for retirement?',
    shortDesc: 'Your existing savings give you a head start',
    defaultValues: { currentSavings: 20000 }
  },
  {
    id: 'monthlySavings',
    title: 'Monthly Savings',
    question: 'How much can you save monthly for retirement?',
    shortDesc: 'Regular contributions are key to building your nest egg',
    defaultValues: { monthlySavings: 500 }
  },
  {
    id: 'retirementAge',
    title: 'Retirement Age',
    question: 'At what age do you plan to retire?',
    shortDesc: 'This determines how long you have to save',
    defaultValues: { retirementAge: 67 }
  },
  {
    id: 'riskTolerance',
    title: 'Risk Tolerance',
    question: 'What is your investment risk tolerance?',
    shortDesc: 'Your comfort with market fluctuations shapes your strategy',
    defaultValues: { riskTolerance: null }
  },
  {
    id: 'employmentType',
    title: 'Employment',
    question: 'What is your employment type?',
    shortDesc: 'Different employment types have unique retirement advantages',
    defaultValues: { employmentType: null }
  },
  {
    id: 'yearsInGermany',
    title: 'Years in Germany',
    question: 'How many years have you lived in Germany?',
    shortDesc: 'This affects your eligibility for local benefits',
    defaultValues: { yearsInGermany: 5 }
  },
  {
    id: 'germanCitizenship',
    title: 'Citizenship',
    question: 'Do you have German citizenship?',
    shortDesc: 'Citizenship status impacts available retirement options',
    defaultValues: { germanCitizenship: null }
  },
  {
    id: 'hasAdditionalIncome',
    title: 'Additional Income',
    question: 'Do you have additional sources of income?',
    shortDesc: 'Multiple income streams can enhance your retirement security',
    defaultValues: { hasAdditionalIncome: null }
  },
  {
    id: 'hasPropertyInvestments',
    title: 'Property',
    question: 'Do you have property investments?',
    shortDesc: 'Real estate can be a valuable part of your retirement portfolio',
    defaultValues: { hasPropertyInvestments: null }
  }
];

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
  "Estate planning is essential for protecting your family&apos;s future.",
  "Regularly monitor your credit score and report."
];

// Define form data interface
interface FormData {
  age: number | null;
  currentSalary: number;
  currentSavings: number;
  monthlySavings: number;
  retirementAge: number;
  riskTolerance: 'low' | 'medium' | 'high' | null;
  desiredRetirementIncome: number;
  hasAdditionalIncome: boolean | null;
  additionalIncomeAmount: number;
  hasPropertyInvestments: boolean | null;
  propertyValue: number;
  hasPrivatePension: boolean | null;
  privatePensionValue: number;
  employmentType: 'employed' | 'self-employed' | 'civil-servant' | 'freelancer' | null;
  yearsInGermany: number;
  germanCitizenship: boolean | null;
}

const MultiStepForm = () => {
  // State for form data
  const [formData, setFormData] = useState<FormData>({
    age: null,
    currentSalary: 60000,
    currentSavings: 20000,
    monthlySavings: 500,
    retirementAge: 67,
    riskTolerance: null,
    desiredRetirementIncome: 0,
    hasAdditionalIncome: null,
    additionalIncomeAmount: 0,
    hasPropertyInvestments: null,
    propertyValue: 0,
    hasPrivatePension: null,
    privatePensionValue: 0,
    employmentType: null,
    yearsInGermany: 5,
    germanCitizenship: null
  });

  // State for current step
  const [step, setStep] = useState(0);
  
  // State for calculation results
  const [results, setResults] = useState<RetirementResults | null>(null);
  
  // State for loading
  const [isCalculating, setIsCalculating] = useState(false);
  const [currentTip, setCurrentTip] = useState(0);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [calculationComplete, setCalculationComplete] = useState(false);

  // Calculate desired retirement income based on current salary (70% replacement)
  useEffect(() => {
    if (formData.currentSalary) {
      setFormData(prev => ({
        ...prev,
        desiredRetirementIncome: Math.round(prev.currentSalary * 0.7 / 12)
      }));
    }
  }, [formData.currentSalary]);

  // Handle loading animation but don't perform calculation
  useEffect(() => {
    if (isCalculating) {
      // Rotating tips effect
      const tipInterval = setInterval(() => {
        setCurrentTip(prev => (prev + 1) % financialTips.length);
      }, 4000);
      
      // Non-linear progress animation
      const progressInterval = setInterval(() => {
        setLoadingProgress(prev => {
          // Fast initial progress (0-30%)
          if (prev < 30) {
            return Math.min(prev + 4, 30);
          }
          // Slower middle progress (30-60%)
          else if (prev < 60) {
            return Math.min(prev + 2, 60);
          }
          // Very slow final progress (60-90%)
          else if (prev < 90) {
            return Math.min(prev + 0.5, 90);
          }
          // Final burst to 100% when calculation is complete
          else if (calculationComplete) {
            return 100;
          }
          return prev;
        });
      }, 100);
      
      // Simulate calculation completion after a reasonable time
      // This ensures we don't get stuck at 90% if there's an issue with the calculation
      const calculationTimeout = setTimeout(() => {
        if (!calculationComplete) {
          console.log('Forcing calculation completion after timeout');
          setCalculationComplete(true);
        }
      }, 5000); // 5 seconds timeout
      
      return () => {
        clearInterval(tipInterval);
        clearInterval(progressInterval);
        clearTimeout(calculationTimeout);
      };
    }
  }, [isCalculating, calculationComplete, financialTips.length]);

  // Handle form submission
  const handleSubmit = async () => {
    // Don't reset any states here to avoid flickering
    // setIsCalculating(true); - removed to prevent state reset
    // setLoadingProgress(0); - removed to prevent state reset
    // setCalculationComplete(false); - removed to prevent state reset

    try {
      // Convert form data to RetirementInputs
      const inputData = {
        age: formData.age || 30, // Provide defaults for null values
        currentSalary: formData.currentSalary,
        currentSavings: formData.currentSavings,
        monthlySavings: formData.monthlySavings,
        riskTolerance: formData.riskTolerance || 'medium',
        retirementAge: formData.retirementAge,
        desiredRetirementIncome: formData.desiredRetirementIncome,
        hasAdditionalIncome: formData.hasAdditionalIncome || false,
        additionalIncomeAmount: formData.additionalIncomeAmount,
        hasPropertyInvestments: formData.hasPropertyInvestments || false,
        propertyValue: formData.propertyValue,
        hasPrivatePension: formData.hasPrivatePension || false,
        privatePensionValue: formData.privatePensionValue,
        employmentType: formData.employmentType || 'employed',
        yearsInGermany: formData.yearsInGermany,
        germanCitizenship: formData.germanCitizenship || false
      };

      // Call the API
      const response = await fetch('/api/retirement-calculator', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(inputData),
      });

      if (!response.ok) {
        throw new Error('API request failed');
      }

      const data = await response.json();
      
      // Use the results from the API
      if (data.success) {
        // Store the calculation results in local storage for dashboard use
        if (typeof window !== 'undefined') {
          localStorage.setItem('retirementCalculatorResults', JSON.stringify(data.data));
        }
        
        // Set the results in the component state
        setResults(data.data.results);
      } else {
        console.error('API returned an error:', data.error);
        // Use fallback calculation method
        const calculatedResults = calculateRetirementReadiness(inputData);
        setResults(calculatedResults);
      }
    } catch (error) {
      console.error('Error during calculation:', error);
      // Use fallback calculation method
      const inputData = {
        age: formData.age || 30,
        currentSalary: formData.currentSalary,
        currentSavings: formData.currentSavings,
        monthlySavings: formData.monthlySavings,
        riskTolerance: formData.riskTolerance || 'medium',
        retirementAge: formData.retirementAge,
        desiredRetirementIncome: formData.desiredRetirementIncome,
        hasAdditionalIncome: formData.hasAdditionalIncome || false,
        additionalIncomeAmount: formData.additionalIncomeAmount,
        hasPropertyInvestments: formData.hasPropertyInvestments || false,
        propertyValue: formData.propertyValue,
        hasPrivatePension: formData.hasPrivatePension || false,
        privatePensionValue: formData.privatePensionValue,
        employmentType: formData.employmentType || 'employed',
        yearsInGermany: formData.yearsInGermany,
        germanCitizenship: formData.germanCitizenship || false
      };
      const calculatedResults = calculateRetirementReadiness(inputData);
      setResults(calculatedResults);
    } finally {
      // Keep isCalculating true until results are ready to avoid flickering
      // setIsCalculating(false); - removed to prevent flickering
      setCalculationComplete(true);
    }
  };

  // Next step handler
  const handleNext = () => {
    console.log('handleNext called:', { 
      currentStep: step, 
      totalSteps: steps.length,
      isCalculating,
      calculationComplete 
    });

    // For the last step, don't automatically start calculation
    if (step >= steps.length - 1) {
      return; // Just return without starting calculation
    }

    // For other steps, proceed as normal
    if (step >= 0 && step < steps.length - 1) {
      setStep(step + 1);
    } else {
      console.warn(`Invalid step value: ${step}. Resetting to step 0.`);
      setStep(0);
    }
  };

  // Back step handler
  const handleBack = () => {
    if (step > 0) {
      setStep(prev => prev - 1);
    }
  };

  // Handle input change
  const handleInputChange = (e: { target: { name: string; value: string | number | boolean; type: string; checked?: boolean } }) => {
    const { name, value, type } = e.target;
    const val = type === 'checkbox' ? e.target.checked : (type === 'number' ? Number(value) : value);
    setFormData(prev => ({ ...prev, [name]: val }));
    
    // Add debounced auto-advance for numeric inputs
    // This will advance to the next step after the user stops sliding for 1.5 seconds
    if (type === 'number') {
      clearTimeout((window as any).inputTimeout);
      (window as any).inputTimeout = setTimeout(() => {
        handleNext();
      }, 1500);
    }
  };

  // Handle option selection and auto-advance to next step
  const handleOptionSelect = (field: keyof FormData, value: any) => {
    console.log('handleOptionSelect called:', { field, value, currentStep: step });
    const updatedFormData = { ...formData, [field]: value };
    setFormData(updatedFormData);
    
    // Log state before last step transition
    if (step === steps.length - 1) {
      console.log('Last step detected, current states:', {
        step,
        isCalculating,
        formData: updatedFormData,
        calculationComplete
      });
    }
    
    // Auto advance to next step after selection for all option fields
    setTimeout(() => {
      console.log('Auto-advance timeout executing, current step:', step);
      handleNext();
    }, 300);
  };

  // Reset form handler
  const handleReset = () => {
    setResults(null);
    setStep(0);
  };

  // Render loading screen
  const renderLoadingScreen = () => (
    <div className="flex flex-col items-center justify-center h-full px-4 py-12 text-center">
      <div className="mb-6">
        <div className="relative w-24 h-24">
          <div className="w-full h-full rounded-full border-4 border-gray-200"></div>
          <div 
            className="absolute top-0 left-0 w-full h-full rounded-full border-4 border-t-[#E5B94B] animate-spin"
            style={{ borderTopWidth: '4px', animationDuration: '1.5s' }}
          ></div>
          <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center">
            {loadingProgress < 100 && (
              <span className="text-xl font-bold text-[#0A1E3C]">{Math.floor(loadingProgress)}%</span>
            )}
            {loadingProgress >= 100 && (
              <span className="text-xl font-bold text-[#0A1E3C]">✓</span>
            )}
          </div>
        </div>
      </div>

      <h2 className="text-2xl font-bold text-[#0A1E3C] mb-2">Analyzing Your Financial Future</h2>
      <p className="text-gray-600 max-w-md mb-8 text-lg">
        Our premium algorithm is building your personalized retirement roadmap.
      </p>

      <div className="bg-[#F9F9FA] p-4 rounded-lg max-w-md mb-6">
        <div className="flex items-start">
          <span className="bg-[#E5B94B] p-2 rounded-full text-white mr-3 flex-shrink-0">
            <FaLightbulb className="h-5 w-5" />
          </span>
          <p className="text-gray-700 text-left">
            <span className="font-semibold block mb-1">Financial Tip:</span>
            {financialTips[currentTip]}
          </p>
        </div>
      </div>
    </div>
  );

  // Render age options
  const renderAgeOptions = () => {
    const ageRanges = [
      { value: 25, label: 'Under 30', icon: <FaUserTie className="w-6 h-6" />, description: "Early career and starting retirement planning" },
      { value: 35, label: '30-40', icon: <FaUserTie className="w-6 h-6" />, description: "Mid-career with growing savings potential" },
      { value: 45, label: '40-50', icon: <FaUserTie className="w-6 h-6" />, description: "Peak earning years for retirement savings" },
      { value: 55, label: '50-60', icon: <FaUserTie className="w-6 h-6" />, description: "Approaching retirement with focused planning" },
      { value: 65, label: 'Over 60', icon: <FaUserTie className="w-6 h-6" />, description: "Near retirement age with optimization needs" }
    ];

    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
        {ageRanges.map((range) => (
          <button
            key={range.label}
            onClick={() => handleOptionSelect('age', range.value)}
            className={`
              flex flex-col items-center justify-center p-6 rounded-xl transition-all
              ${formData.age === range.value
                ? 'bg-gradient-to-r from-[#E5B94B] to-[#D4AF37] text-[#0A1E3C] shadow-md'
                : 'bg-white border border-gray-200 text-gray-800 hover:bg-gray-50 hover:shadow-md'
              }
            `}
          >
            <div className={`
              w-14 h-14 rounded-full flex items-center justify-center mb-3
              ${formData.age === range.value
                ? 'bg-[#0A1E3C]/20'
                : 'bg-gray-100'
              }
            `}>
              {range.icon}
            </div>
            <span className="font-medium text-lg">{range.label}</span>
            <p className="text-xs mt-2 max-w-[180px] text-center">{range.description}</p>
          </button>
        ))}
      </div>
    );
  };

  // Render risk tolerance options
  const renderRiskToleranceOptions = () => {
    const riskOptions = [
      { 
        value: 'low' as const, 
        label: 'Low Risk', 
        description: 'Safety first. Conservative investments with stable returns.', 
        icon: <FaShieldAlt className="w-6 h-6" />
      },
      { 
        value: 'medium' as const, 
        label: 'Medium Risk', 
        description: 'Balanced approach with moderate growth potential.', 
        icon: <FaLock className="w-6 h-6" />
      },
      { 
        value: 'high' as const, 
        label: 'High Risk', 
        description: 'Growth-focused strategy that accepts higher volatility.', 
        icon: <FaChartLine className="w-6 h-6" />
      }
    ];

    return (
      <div className="grid grid-cols-1 gap-4 mt-6">
        {riskOptions.map((option) => (
          <button
            key={option.value}
            onClick={() => handleOptionSelect('riskTolerance', option.value)}
            className={`
              flex flex-col items-center justify-center p-6 rounded-xl transition-all
              ${formData.riskTolerance === option.value
                ? 'bg-gradient-to-r from-[#E5B94B] to-[#D4AF37] text-[#0A1E3C] shadow-md'
                : 'bg-white border border-gray-200 text-gray-800 hover:bg-gray-50 hover:shadow-md'
              }
            `}
          >
            <div className={`
              w-14 h-14 rounded-full flex items-center justify-center mb-3
              ${formData.riskTolerance === option.value
                ? 'bg-[#0A1E3C]/20'
                : 'bg-gray-100'
              }
            `}>
              {option.icon}
            </div>
            <span className="font-medium text-lg">{option.label}</span>
            <span className="text-sm mt-2 opacity-80 text-center">{option.description}</span>
          </button>
        ))}
      </div>
    );
  };

  // Render employment type options
  const renderEmploymentOptions = () => {
    const employmentOptions = [
      { 
        value: 'employed' as const, 
        label: 'Employed', 
        description: 'Working for a company with standard benefits',
        icon: <FaBriefcase className="w-6 h-6" /> 
      },
      { 
        value: 'self-employed' as const, 
        label: 'Self-Employed', 
        description: 'Running your own business or practice',
        icon: <FaLaptopCode className="w-6 h-6" /> 
      },
      { 
        value: 'civil-servant' as const, 
        label: 'Civil Servant', 
        description: 'Government employee with pension benefits',
        icon: <FaBuilding className="w-6 h-6" /> 
      },
      { 
        value: 'freelancer' as const, 
        label: 'Freelancer', 
        description: 'Independent contractor with flexible work',
        icon: <FaGraduationCap className="w-6 h-6" /> 
      }
    ];

    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
        {employmentOptions.map((option) => (
          <button
            key={option.value}
            onClick={() => handleOptionSelect('employmentType', option.value)}
            className={`
              flex flex-col items-center justify-center p-5 rounded-xl transition-all
              ${formData.employmentType === option.value
                ? 'bg-gradient-to-r from-[#E5B94B] to-[#D4AF37] text-[#0A1E3C] shadow-md'
                : 'bg-white border border-gray-200 text-gray-800 hover:bg-gray-50 hover:shadow-md'
              }
            `}
          >
            <div className={`
              w-14 h-14 rounded-full flex items-center justify-center mb-3
              ${formData.employmentType === option.value
                ? 'bg-[#0A1E3C]/20'
                : 'bg-gray-100'
              }
            `}>
              {option.icon}
            </div>
            <span className="font-medium text-lg">{option.label}</span>
            <p className="text-xs mt-2 text-center">{option.description}</p>
          </button>
        ))}
      </div>
    );
  };

  // Render boolean options
  const renderBooleanOptions = (field: keyof FormData) => {
    const getBooleanDescription = (field: string, value: boolean): string => {
      const descriptions: Record<string, Record<string, string>> = {
        germanCitizenship: {
          'true': "You have German citizenship",
          'false': "You're a non-German citizen"
        },
        hasAdditionalIncome: {
          'true': "Income beyond your primary salary",
          'false': "Your salary is your only income"
        },
        hasPropertyInvestments: {
          'true': "You own property investments",
          'false': "You don't have property investments"
        },
        hasPrivatePension: {
          'true': "You have private pension plans",
          'false': "You rely on statutory pension only"
        }
      };
      
      return descriptions[field]?.[String(value)] || "";
    };

    const getIconForBooleanField = (field: string): JSX.Element => {
      const icons: Record<string, JSX.Element> = {
        germanCitizenship: <FaBuilding className="w-6 h-6" />,
        hasAdditionalIncome: <FaMoneyBillWave className="w-6 h-6" />,
        hasPropertyInvestments: <FaBuilding className="w-6 h-6" />,
        hasPrivatePension: <FaPiggyBank className="w-6 h-6" />
      };
      
      return icons[field] || <FaQuestion className="w-6 h-6" />;
    };

    const options = [
      { value: true, label: 'Yes', icon: <FaCheck className="w-6 h-6" /> },
      { value: false, label: 'No', icon: <FaQuestion className="w-6 h-6" /> }
    ];

  return (
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-6">
        {options.map((option) => (
          <button
            key={String(option.value)}
            onClick={() => handleOptionSelect(field, option.value)}
            className={`
              flex flex-col items-center justify-center p-6 rounded-xl transition-all
              ${formData[field] === option.value
                ? 'bg-gradient-to-r from-[#E5B94B] to-[#D4AF37] text-[#0A1E3C] shadow-md'
                : 'bg-white border border-gray-200 text-gray-800 hover:bg-gray-50 hover:shadow-md'
              }
            `}
          >
            <div className={`
              w-14 h-14 rounded-full flex items-center justify-center mb-3
              ${formData[field] === option.value
                ? 'bg-[#0A1E3C]/20'
                : 'bg-gray-100'
              }
            `}>
              {option.icon}
            </div>
            <span className="font-medium text-lg">{option.label}</span>
            <p className="text-xs mt-2 text-center">{getBooleanDescription(field as string, option.value)}</p>
          </button>
        ))}
      </div>
    );
  };

  // Render numeric input with slider
  const renderNumericInput = (field: keyof FormData, min: number, max: number, step: number, prefix = '€', suffix = '') => {
    const getIconForField = (field: string): JSX.Element => {
      const icons: Record<string, JSX.Element> = {
        currentSalary: <FaMoneyBillWave className="text-[#E5B94B] w-8 h-8" />,
        currentSavings: <FaPiggyBank className="text-[#E5B94B] w-8 h-8" />,
        monthlySavings: <FaMoneyBillWave className="text-[#E5B94B] w-8 h-8" />,
        retirementAge: <FaCalendarAlt className="text-[#E5B94B] w-8 h-8" />,
        yearsInGermany: <FaCalendarAlt className="text-[#E5B94B] w-8 h-8" />
      };
      
      return icons[field] || <FaQuestion className="text-[#E5B94B] w-8 h-8" />;
    };

    const getDescriptionForField = (field: string): string => {
      const descriptions: Record<string, string> = {
        currentSalary: "Your annual gross salary",
        currentSavings: "Total retirement savings so far",
        monthlySavings: "Monthly retirement contributions",
        retirementAge: "When you plan to stop working",
        yearsInGermany: "Time living in Germany"
      };
      
      return descriptions[field] || "";
    };

    return (
      <div className="mt-6">
        <div className="flex items-center justify-center mb-4">
          {getIconForField(field as string)}
        </div>
        <div className="text-center mb-6">
          <span className="text-4xl font-bold text-[#0A1E3C]">
            {prefix}{formData[field]?.toLocaleString()}{suffix}
          </span>
          <p className="text-sm text-gray-500 mt-2">{getDescriptionForField(field as string)}</p>
      </div>

        <div className="relative">
          <input
            type="range"
            min={min}
            max={max}
            step={step}
            value={formData[field] as number}
            onChange={(e) => handleInputChange({
              target: {
                name: field,
                value: e.target.value,
                type: 'number'
              }
            })}
            className="w-full h-3 bg-gray-200 rounded-lg appearance-none cursor-pointer custom-slider"
          />
          <style jsx>{`
            .custom-slider::-webkit-slider-thumb {
              appearance: none;
              width: 24px;
              height: 24px;
              border-radius: 50%;
              background: linear-gradient(to right, #E5B94B, #D4AF37);
              cursor: pointer;
              border: 2px solid white;
              box-shadow: 0 0 5px rgba(0,0,0,0.2);
            }
            .custom-slider::-moz-range-thumb {
              width: 24px;
              height: 24px;
              border-radius: 50%;
              background: linear-gradient(to right, #E5B94B, #D4AF37);
              cursor: pointer;
              border: 2px solid white;
              box-shadow: 0 0 5px rgba(0,0,0,0.2);
            }
          `}</style>
        </div>
        
        <div className="mt-4 text-sm font-medium text-gray-700 flex justify-between">
          <span>{prefix}{min.toLocaleString()}{suffix}</span>
          <span>{prefix}{max.toLocaleString()}{suffix}</span>
        </div>
      </div>
    );
  };

  // Render the current step
  const renderStep = () => {
    const currentStepData = steps[step];
    
    // Instead of early return, use conditional rendering
    return (
      <div>
        {!currentStepData ? (
          // Handle the case when currentStepData is undefined
          <div>Loading...</div>
        ) : (
          <>
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-[#0A1E3C] mb-2">{currentStepData.question}</h2>
              <p className="text-gray-600">{currentStepData.shortDesc}</p>
            </div>

            {currentStepData.id === 'age' && renderAgeOptions()}
            {currentStepData.id === 'currentSalary' && renderNumericInput('currentSalary', 20000, 200000, 5000)}
            {currentStepData.id === 'currentSavings' && renderNumericInput('currentSavings', 0, 500000, 5000)}
            {currentStepData.id === 'monthlySavings' && renderNumericInput('monthlySavings', 0, 5000, 100)}
            {currentStepData.id === 'retirementAge' && renderNumericInput('retirementAge', 55, 75, 1, '', ' years')}
            {currentStepData.id === 'riskTolerance' && renderRiskToleranceOptions()}
            {currentStepData.id === 'employmentType' && renderEmploymentOptions()}
            {currentStepData.id === 'yearsInGermany' && renderNumericInput('yearsInGermany', 0, 50, 1, '', ' years')}
            {currentStepData.id === 'germanCitizenship' && renderBooleanOptions('germanCitizenship')}
            {currentStepData.id === 'hasAdditionalIncome' && renderBooleanOptions('hasAdditionalIncome')}
            {currentStepData.id === 'hasPropertyInvestments' && renderPropertyInvestments()}
          </>
        )}
      </div>
    );
  };

  // Render property investments options
  const renderPropertyInvestments = () => {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <button
            onClick={() => handleOptionSelect('hasPropertyInvestments', true)}
            className={`
              flex flex-col items-center justify-center p-6 rounded-xl transition-all duration-200
              ${formData.hasPropertyInvestments === true
                ? 'bg-gradient-to-r from-[#E5B94B] to-[#D4AF37] text-[#0A1E3C] shadow-md'
                : 'bg-white border border-gray-200 text-gray-800 hover:bg-gray-50'
              }
            `}
          >
            <span className="font-medium text-lg">Yes</span>
          </button>
          <button
            onClick={() => handleOptionSelect('hasPropertyInvestments', false)}
            className={`
              flex flex-col items-center justify-center p-6 rounded-xl transition-all duration-200
              ${formData.hasPropertyInvestments === false
                ? 'bg-gradient-to-r from-[#E5B94B] to-[#D4AF37] text-[#0A1E3C] shadow-md'
                : 'bg-white border border-gray-200 text-gray-800 hover:bg-gray-50'
              }
            `}
          >
            <span className="font-medium text-lg">No</span>
          </button>
        </div>
      </div>
    );
  };

  // Progress bar - preserve progress across the session
  const totalSteps = useMemo(() => steps.length - 1, []); // Memoize steps.length

  useEffect(() => {
    // Save current progress to localStorage
    if (typeof window !== 'undefined') {
      localStorage.setItem('formProgress', JSON.stringify(step / totalSteps));
    }
  }, [step, totalSteps]);

  // Restore progress when component mounts
  useEffect(() => {
    // Try to restore progress from localStorage
    if (typeof window !== 'undefined') {
      const savedProgress = localStorage.getItem('formProgress');
      if (savedProgress) {
        const progressValue = JSON.parse(savedProgress);
        // Only update if we're at step 0 (first load)
        if (step === 0 && progressValue > 0) {
          // Optional: could uncomment this to auto-restore progress
          // setStep(Math.round(progressValue * totalSteps));
        }
      }
    }
  }, []); // Empty dependency array since this should only run once

  // Get current step data
  const currentStepData = steps[step];

  // Ensure step is within valid bounds
  useEffect(() => {
    if (step < 0 || step >= steps.length) {
      console.warn(`Step ${step} is out of bounds. Resetting to step 0.`);
      setStep(0);
    }
  }, [step, steps.length]);

  // Set form data when step changes
  useEffect(() => {
    if (currentStepData?.defaultValues) {
      setFormData(prev => ({
        ...prev,
        ...currentStepData.defaultValues
      }));
    }
  }, [currentStepData]);

  // Trigger handleSubmit when loading progress reaches 100%
  useEffect(() => {
    if (loadingProgress === 100 && isCalculating) {
      // Add a small delay to ensure the UI shows 100% before proceeding
      const submitTimeout = setTimeout(() => {
        handleSubmit();
      }, 500);
      
      return () => clearTimeout(submitTimeout);
    }
  }, [loadingProgress, isCalculating]);

  // Ensure we show results when they're available
  useEffect(() => {
    if (results) {
      // Only set isCalculating to false after results are available
      setIsCalculating(false);
    }
  }, [results]);

  // Add render logging
  console.log('Render state:', { 
    step, 
    isCalculating, 
    hasResults: !!results,
    calculationComplete,
    loadingProgress 
  });

  // If we have results, show the results page
  if (results) {
    console.log('Rendering results page');
    return <ResultsPage results={results} onReset={handleReset} />;
  }

  // If calculating, show loading screen
  if (isCalculating) {
    console.log('Rendering loading screen');
    return (
      <div className="bg-white rounded-lg shadow-lg overflow-visible">
        <div className="bg-gradient-to-r from-[#0A1E3C] to-[#15294D] text-white p-6">
          <h2 className="text-2xl font-bold mb-2 flex items-center">
            <FaAward className="text-[#E5B94B] mr-2" />
            Creating Your Financial Roadmap
          </h2>
          <p className="text-base opacity-90">Your personalized retirement analysis is almost ready...</p>
        </div>
        <div className="p-6">
          {renderLoadingScreen()}
        </div>
      </div>
    );
  }

  // Add a new handler for starting the calculation
  const handleStartCalculation = () => {
    console.log('Starting calculation...');
    setIsCalculating(true);
    setLoadingProgress(0);
    setCalculationComplete(false);
  };

  return (
    <div className="bg-white rounded-lg shadow-lg overflow-visible">
      <div className="p-6">
        {/* Main content */}
        <div className="max-w-3xl mx-auto relative z-10">
          {isCalculating ? (
            renderLoadingScreen()
          ) : (
            <div
              key={step}
              className="opacity-0 translate-y-4 animate-fadeIn"
            >
              {renderStep()}
              
              {/* Navigation and progress */}
              <div className="mt-8 pt-6 border-t">
                <div className="flex justify-between items-center">
                  <button
                    type="button"
                    onClick={handleBack}
                    className={`flex items-center px-4 py-2 border border-gray-300 rounded-md text-gray-700 transition-all duration-200 ${
                      step === 0 
                        ? 'opacity-50 cursor-not-allowed' 
                        : 'hover:bg-gray-50 hover:scale-102 active:scale-98'
                    }`}
                    disabled={step === 0}
                  >
                    <FaArrowLeft className="mr-2 h-4 w-4" />
                    <span className="text-base">Back</span>
                  </button>
                  
                  <div className="relative z-10">
                    {/* Show Get Results button on the last step if property investment is selected */}
                    {step === steps.length - 1 && formData.hasPropertyInvestments !== null ? (
                      <button
                        type="button"
                        onClick={handleStartCalculation}
                        className="flex items-center px-6 py-3 bg-[#0A1E3C] text-white rounded-md shadow-lg transition-all duration-300 
                          hover:bg-[#0A1E3C]/90 hover:scale-105 active:scale-98 text-lg font-semibold
                          animate-bounce"
                      >
                        Get Results
                        <FaRegFilePdf className="ml-2 h-5 w-5" />
                      </button>
                    ) : (
                      /* Show Continue button for other steps */
                      currentStepData && (
                        <button
                          type="button"
                          onClick={handleNext}
                          className="flex items-center px-5 py-2 bg-[#0A1E3C] text-white rounded-md shadow-sm transition-all duration-200 hover:bg-[#0A1E3C]/90 hover:scale-102 active:scale-98 text-base"
                        >
                          Continue
                          <FaArrowRight className="ml-2 h-4 w-4" />
                        </button>
                      )
                    )}
                  </div>
                </div>

                {/* Progress bar */}
                <div className="mt-6 relative z-10">
                  <div className="relative w-full h-3 bg-gray-200 rounded-full overflow-hidden">
                    <div 
                      className="bg-gradient-to-r from-[#E5B94B] to-[#D4AF37] h-3 rounded-full transition-all duration-500 ease-in-out"
                      style={{ width: `${((step + 1) / steps.length) * 100}%` }}
                    />
                  </div>
                  <div className="flex justify-between mt-2 text-sm text-gray-600">
                    <span>Start</span>
                    <span>{step + 1} of {steps.length}</span>
                    <span>Finish</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MultiStepForm; 