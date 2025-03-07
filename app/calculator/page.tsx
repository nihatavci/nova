'use client';

import { useState, useEffect, Suspense, useRef } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { useSearchParams } from 'next/navigation';

type CalculatorType = 'tax' | 'investment' | 'pension' | 'mortgage' | null;

interface Question {
  id: string;
  text: string;
  type: 'number' | 'select' | 'text';
  options?: { value: string; label: string; }[];
}

interface CalculatorFlow {
  questions: Question[];
  title: string;
  icon: string;
  description: string;
  color: string;
}

const calculatorFlows: Record<string, CalculatorFlow> = {
  tax: {
    title: 'Tax Assessment',
    description: 'Optimize your tax situation and discover potential savings',
    icon: '💰',
    color: 'from-blue-500 to-indigo-600',
    questions: [
      { id: 'income', text: 'What is your annual income?', type: 'number' },
      { id: 'taxClass', text: 'What is your tax class?', type: 'select', 
        options: [
          { value: '1', label: 'Class 1 (Single)' },
          { value: '3', label: 'Class 3 (Married, primary earner)' },
          { value: '4', label: 'Class 4 (Married, equal income)' },
          { value: '5', label: 'Class 5 (Married, secondary earner)' }
        ]
      },
      { id: 'children', text: 'How many dependent children do you have?', type: 'number' },
      { id: 'insurance', text: 'Monthly health insurance contribution (€)', type: 'number' },
      { id: 'deductions', text: 'Other annual tax deductions (€)', type: 'number' },
    ]
  },
  investment: {
    title: 'Investment Planning',
    description: 'Plan your investments and project future returns',
    icon: '📈',
    color: 'from-emerald-500 to-teal-600',
    questions: [
      { id: 'initial', text: 'Initial investment amount (€)', type: 'number' },
      { id: 'monthly', text: 'Monthly contribution (€)', type: 'number' },
      { id: 'duration', text: 'Investment duration (years)', type: 'number' },
      { id: 'risk', text: 'What is your risk tolerance?', type: 'select',
        options: [
          { value: 'conservative', label: 'Conservative (4-6% return)' },
          { value: 'moderate', label: 'Moderate (6-8% return)' },
          { value: 'aggressive', label: 'Aggressive (8-10% return)' }
        ]
      },
      { id: 'goal', text: 'Investment goal', type: 'select',
        options: [
          { value: 'retirement', label: 'Retirement' },
          { value: 'property', label: 'Property Purchase' },
          { value: 'education', label: 'Education' },
          { value: 'wealth', label: 'Wealth Building' }
        ]
      }
    ]
  },
  pension: {
    title: 'Pension Planning',
    description: 'Secure your future with optimal pension planning',
    icon: '🏦',
    color: 'from-purple-500 to-violet-600',
    questions: [
      { id: 'age', text: 'Current age', type: 'number' },
      { id: 'retirement', text: 'Planned retirement age', type: 'number' },
      { id: 'currentSalary', text: 'Current annual salary (€)', type: 'number' },
      { id: 'contribution', text: 'Monthly pension contribution (€)', type: 'number' },
      { id: 'employerMatch', text: 'Employer contribution (%)', type: 'number' },
      { id: 'existingPension', text: 'Existing pension savings (€)', type: 'number' }
    ]
  },
  mortgage: {
    title: 'Mortgage Planning',
    description: 'Find the optimal mortgage solution for your needs',
    icon: '🏠',
    color: 'from-rose-500 to-pink-600',
    questions: [
      { id: 'propertyValue', text: 'Property value (€)', type: 'number' },
      { id: 'downPayment', text: 'Down payment (€)', type: 'number' },
      { id: 'duration', text: 'Loan duration (years)', type: 'number' },
      { id: 'income', text: 'Annual household income (€)', type: 'number' },
      { id: 'otherLoans', text: 'Other monthly loan payments (€)', type: 'number' },
      { id: 'location', text: 'Property location type', type: 'select',
        options: [
          { value: 'urban', label: 'Urban Center' },
          { value: 'suburban', label: 'Suburban Area' },
          { value: 'rural', label: 'Rural Area' }
        ]
      }
    ]
  }
};

// Loading fallback component
const LoadingFallback = () => (
  <div className="flex justify-center items-center h-64">
    <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500"></div>
  </div>
);

export default function CalculatorPage() {
  const searchParams = useSearchParams();
  const typeParam = searchParams.get('type') as CalculatorType | null;
  
  const [activeCalculator, setActiveCalculator] = useState<CalculatorType>(typeParam || null);
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [showReport, setShowReport] = useState(false);
  const [report, setReport] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [buttonDebug, setButtonDebug] = useState<string>('');

  const logButtonEvent = (event: string, buttonName: string) => {
    console.log(`Button Event: ${event} - ${buttonName}`);
    setButtonDebug(`Last event: ${event} - ${buttonName} at ${new Date().toISOString()}`);
  };

  useEffect(() => {
    if (activeCalculator && calculatorFlows[activeCalculator]) {
      const totalSteps = calculatorFlows[activeCalculator].questions.length;
      setProgress(((currentStep + 1) / totalSteps) * 100);
    }
  }, [activeCalculator, currentStep]);

  useEffect(() => {
    const buttons = document.querySelectorAll('button');
    console.log(`Found ${buttons.length} button elements on the page`);
    
    const style = window.getComputedStyle(document.body);
    const pointerEvents = style.getPropertyValue('pointer-events');
    console.log(`Body pointer-events: ${pointerEvents}`);
    
    const checkOverlappingElements = () => {
      buttons.forEach(button => {
        const rect = button.getBoundingClientRect();
        const elementsAtPoint = document.elementsFromPoint(
          rect.left + rect.width / 2,
          rect.top + rect.height / 2
        );
        
        if (elementsAtPoint[0] !== button) {
          console.log('Button might be covered by:', elementsAtPoint[0]);
        }
      });
    };
    
    setTimeout(checkOverlappingElements, 1000);
  }, [activeCalculator, currentStep, showReport]);

  const handleAnswer = (questionId: string, value: string) => {
    setAnswers(prev => ({ ...prev, [questionId]: value }));
  };

  const handleCalculatorSelect = (type: CalculatorType) => {
    logButtonEvent('select', `calculator-${type}`);
    setActiveCalculator(type);
    setCurrentStep(0);
    setAnswers({});
    setShowReport(false);
    setReport(null);
  };

  const generateReport = async () => {
    setIsLoading(true);
    
    try {
      // Simulate API call for demo purposes
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Mock response data
      const mockAnalysis = {
        summary: "Based on your inputs, we've identified several optimization opportunities that could save you approximately €8,500 annually.",
        recommendations: [
          "Consider restructuring your tax class to optimize household income",
          "Increase your monthly investment contributions by 15% to meet long-term goals",
          "Explore tax-advantaged investment vehicles available to expats in Germany"
        ],
        nextSteps: [
          "Schedule a consultation with our tax advisor for personalized guidance",
          "Review our detailed investment strategy recommendations in the full report",
          "Set up automatic monthly contributions to your investment accounts"
        ]
      };
      
      // Update the report state with mock analysis
      setReport({
        ...mockAnalysis,
        userInputs: answers
      });

      setShowReport(true);
    } catch (error) {
      console.error('Error:', error);
      // Handle error state
    } finally {
      setIsLoading(false);
    }
  };

  const renderQuestion = (question: Question) => {
    return (
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.5 }}
        className="space-y-8" 
        key={question.id}
      >
        <div className="mb-10">
          <h3 className="text-3xl font-bold mb-4">{question.text}</h3>
          {question.type === 'select' ? (
            <Select onValueChange={(value) => handleAnswer(question.id, value)}>
              <SelectTrigger className="w-full border-2 border-gray-200 rounded-xl h-16 text-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all">
                <SelectValue placeholder="Select an option" />
              </SelectTrigger>
              <SelectContent className="border-2 border-gray-200 rounded-xl">
                {question.options?.map(option => (
                  <SelectItem key={option.value} value={option.value} className="py-4 text-lg">
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          ) : (
            <Input
              type={question.type}
              value={answers[question.id] || ''}
              onChange={(e) => handleAnswer(question.id, e.target.value)}
              className="border-2 border-gray-200 rounded-xl h-16 text-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
              placeholder="Type your answer here"
            />
          )}
        </div>
      </motion.div>
    );
  };

  const renderQuestions = () => {
    if (!activeCalculator || !calculatorFlows[activeCalculator]) return null;

    const flow = calculatorFlows[activeCalculator];
    const currentQuestion = flow.questions[currentStep];
    const totalSteps = flow.questions.length;

    return (
      <div className="mt-8 space-y-8">
        {buttonDebug && (
          <div className="p-2 bg-yellow-100 text-xs">
            Debug: {buttonDebug}
          </div>
        )}
        
        <div className="mb-10">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-4xl font-bold">{flow.title}</h2>
            <div className="text-xl font-medium">
              <span className="text-blue-600">{currentStep + 1}</span> of <span>{totalSteps}</span> answered
            </div>
          </div>
          
          <div className="w-full bg-gray-200 rounded-full h-3.5">
            <div 
              className={`h-3.5 rounded-full bg-gradient-to-r ${flow.color}`} 
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>
        
        <AnimatePresence mode="wait">
          {renderQuestion(currentQuestion)}
        </AnimatePresence>

        <div className="flex justify-between space-x-6 mt-16">
          <button
            onClick={() => {
              logButtonEvent('click', 'back-button');
              setCurrentStep(prev => prev - 1);
            }}
            onMouseOver={() => logButtonEvent('mouseover', 'back-button')}
            disabled={currentStep === 0}
            className={`px-10 py-6 rounded-xl bg-white border-2 border-gray-200 text-gray-700 hover:bg-gray-50 transition-all text-lg font-medium relative z-30 ${currentStep === 0 ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
          >
            Back
          </button>
          <button
            onClick={() => {
              logButtonEvent('click', currentStep === flow.questions.length - 1 ? 'generate-report-button' : 'next-button');
              if (currentStep === flow.questions.length - 1) {
                generateReport();
              } else {
                setCurrentStep(prev => prev + 1);
              }
            }}
            onMouseOver={() => logButtonEvent('mouseover', currentStep === flow.questions.length - 1 ? 'generate-report-button' : 'next-button')}
            className={`px-10 py-6 rounded-xl text-white transition-all bg-gradient-to-r ${flow.color} hover:opacity-90 text-lg font-medium cursor-pointer relative z-30`}
          >
            {isLoading ? 
              <div className="flex items-center">
                <div className="animate-spin mr-2 h-5 w-5 border-t-2 border-b-2 border-white rounded-full"></div>
                Processing...
              </div> 
              : 
              currentStep === flow.questions.length - 1 ? 'Generate Report' : 'Next'
            }
          </button>
        </div>
      </div>
    );
  };

  const renderReport = () => {
    if (!report || !activeCalculator) return null;
    
    const flow = calculatorFlows[activeCalculator];

    return (
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="space-y-10"
      >
        <div className={`p-10 rounded-3xl bg-gradient-to-br ${flow.color} text-white shadow-lg`}>
          <div className="flex items-center mb-6">
            <div className="text-4xl mr-4">{flow.icon}</div>
            <h2 className="text-4xl font-bold">Financial Analysis</h2>
          </div>
          
          <div className="prose prose-invert max-w-none prose-lg">
            <h3 className="text-2xl font-semibold mb-4">Summary</h3>
            <p className="text-white/90 text-xl">{report.summary}</p>

            <h3 className="text-2xl font-semibold mt-10 mb-4">Key Recommendations</h3>
            <ul className="space-y-4">
              {report.recommendations.map((rec: string, index: number) => (
                <li key={index} className="text-white/90 flex items-start text-xl">
                  <span className="inline-block mr-3 text-2xl">•</span>
                  <span>{rec}</span>
                </li>
              ))}
            </ul>

            <h3 className="text-2xl font-semibold mt-10 mb-4">Next Steps</h3>
            <ul className="space-y-4">
              {report.nextSteps.map((step: string, index: number) => (
                <li key={index} className="text-white/90 flex items-start text-xl">
                  <span className="inline-block mr-3 text-2xl">•</span>
                  <span>{step}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="mt-12">
            <button 
              onClick={() => {
                // Implement PDF generation here
                console.log('Generating PDF...');
              }}
              className="w-full px-10 py-6 rounded-xl bg-white text-blue-600 hover:bg-white/90 transition-all font-medium text-xl shadow-md cursor-pointer"
            >
              Download Full Report (PDF)
            </button>
          </div>
        </div>
        
        <div className="text-center">
          <button
            onClick={() => {
              setActiveCalculator(null);
              setCurrentStep(0);
              setAnswers({});
              setShowReport(false);
              setReport(null);
            }}
            className="px-10 py-6 rounded-xl bg-white border-2 border-gray-200 text-gray-700 hover:bg-gray-50 transition-all text-lg font-medium cursor-pointer"
          >
            Start Another Calculator
          </button>
        </div>
      </motion.div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50 py-16">
      <div className="container mx-auto px-6 max-w-6xl">
        <h1 className="text-5xl md:text-6xl font-bold text-center mb-6 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Financial Calculator</h1>
        <p className="text-center text-gray-600 mb-16 max-w-3xl mx-auto text-xl">Discover your financial potential with our intelligent calculators designed to optimize your financial decisions.</p>
        
        <div className="max-w-4xl mx-auto">
          <Suspense fallback={<LoadingFallback />}>
            {!activeCalculator ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
                {Object.entries(calculatorFlows).map(([type, flow]) => (
                  <Card 
                    key={type} 
                    className="overflow-hidden cursor-pointer hover:shadow-lg transition-all relative z-30"
                    onClick={() => handleCalculatorSelect(type as CalculatorType)}
                  >
                    <div className={`h-3 bg-gradient-to-r ${flow.color}`}></div>
                    <div className="p-8">
                      <div className="flex flex-col">
                        <div className="flex items-start space-x-5 mb-6">
                          <div className={`w-16 h-16 rounded-full flex items-center justify-center text-3xl bg-gradient-to-br ${flow.color} text-white`}>
                            {flow.icon}
                          </div>
                          <div className="flex-1">
                            <h3 className="text-2xl font-bold mb-2">{flow.title}</h3>
                            <p className="text-gray-600 text-lg">{flow.description}</p>
                          </div>
                        </div>
                        <div 
                          className={`w-full rounded-xl py-4 text-white bg-gradient-to-r ${flow.color} hover:opacity-90 transition-all text-lg font-medium text-center relative z-30`}
                        >
                          Start Calculator
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="border-0 shadow-xl rounded-3xl overflow-hidden">
                <div className="p-10">
                  {isLoading && !showReport ? (
                    <div className="flex justify-center items-center h-64">
                      <div className="text-center">
                        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500 mx-auto mb-4"></div>
                        <p className="text-xl text-gray-600">Generating your personalized report...</p>
                      </div>
                    </div>
                  ) : (
                    showReport ? renderReport() : renderQuestions()
                  )}
                </div>
              </div>
            )}
          </Suspense>
        </div>
      </div>
    </div>
  );
} 