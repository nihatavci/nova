import { useState } from 'react';

interface QuestionStep {
  id: number;
  title: string;
  explanation: string;
  fields: {
    id: string;
    label: string;
    type: 'text' | 'number' | 'select';
    options?: { value: string; label: string }[];
    placeholder?: string;
  }[];
}

const QUESTION_STEPS: QuestionStep[] = [
  {
    id: 1,
    title: "Basic Information",
    explanation: "We need your age and current income to establish a baseline for retirement planning. This helps us calculate how many years you have until retirement and determine appropriate savings targets.",
    fields: [
      {
        id: "age",
        label: "Your Age",
        type: "number",
        placeholder: "Enter your age"
      },
      {
        id: "income",
        label: "Annual Income (€)",
        type: "number",
        placeholder: "Enter your annual income"
      }
    ]
  },
  {
    id: 2,
    title: "Retirement Goals",
    explanation: "Understanding your desired retirement age and lifestyle helps us calculate the total savings needed. Different retirement lifestyles require different levels of financial preparation.",
    fields: [
      {
        id: "retirementAge",
        label: "Desired Retirement Age",
        type: "number",
        placeholder: "Enter desired retirement age"
      },
      {
        id: "lifestyle",
        label: "Desired Retirement Lifestyle",
        type: "select",
        options: [
          { value: "modest", label: "Modest - €30,000/year" },
          { value: "comfortable", label: "Comfortable - €45,000/year" },
          { value: "luxury", label: "Luxury - €60,000+/year" }
        ]
      }
    ]
  },
  {
    id: 3,
    title: "Current Savings",
    explanation: "Your existing savings and investments form the foundation of your retirement plan. This includes all retirement accounts, investment portfolios, and pension plans.",
    fields: [
      {
        id: "currentSavings",
        label: "Total Current Savings (€)",
        type: "number",
        placeholder: "Enter your total savings"
      },
      {
        id: "monthlySavings",
        label: "Monthly Savings (€)",
        type: "number",
        placeholder: "Enter monthly savings amount"
      }
    ]
  },
  {
    id: 4,
    title: "Risk Profile",
    explanation: "Your risk tolerance influences investment strategies and potential returns. Conservative portfolios offer stability but lower returns, while aggressive portfolios offer higher potential returns with more volatility.",
    fields: [
      {
        id: "riskTolerance",
        label: "Investment Risk Tolerance",
        type: "select",
        options: [
          { value: "conservative", label: "Conservative - Prioritize stability" },
          { value: "moderate", label: "Moderate - Balance growth and stability" },
          { value: "aggressive", label: "Aggressive - Maximize growth potential" }
        ]
      }
    ]
  }
];

interface QuestionStepsProps {
  onComplete: (data: any) => void;
}

export default function QuestionSteps({ onComplete }: QuestionStepsProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState<Record<string, any>>({});

  const handleInputChange = (fieldId: string, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      [fieldId]: value
    }));
  };

  const handleContinue = () => {
    const step = QUESTION_STEPS[currentStep];
    const isStepValid = step.fields.every(field => 
      formData[field.id] !== undefined && formData[field.id] !== ''
    );

    if (!isStepValid) {
      alert('Please fill in all fields before continuing');
      return;
    }

    if (currentStep === QUESTION_STEPS.length - 1) {
      onComplete(formData);
    } else {
      setCurrentStep(prev => prev + 1);
    }
  };

  const currentQuestion = QUESTION_STEPS[currentStep];

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      {/* Progress Bar */}
      <div className="relative pt-1">
        <div className="flex mb-2 items-center justify-between">
          <div>
            <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-yellow-600 bg-yellow-200">
              Step {currentStep + 1} of {QUESTION_STEPS.length}
            </span>
          </div>
          <div className="text-right">
            <span className="text-xs font-semibold inline-block text-yellow-600">
              {Math.round(((currentStep + 1) / QUESTION_STEPS.length) * 100)}%
            </span>
          </div>
        </div>
        <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-yellow-200">
          <div
            style={{ width: `${((currentStep + 1) / QUESTION_STEPS.length) * 100}%` }}
            className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-yellow-500 transition-all duration-500"
          ></div>
        </div>
      </div>

      {/* Question Content */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">{currentQuestion.title}</h2>
        <p className="text-gray-600 mb-6">{currentQuestion.explanation}</p>

        <div className="space-y-6">
          {currentQuestion.fields.map(field => (
            <div key={field.id} className="space-y-2">
              <label htmlFor={field.id} className="block text-sm font-medium text-gray-700">
                {field.label}
              </label>
              {field.type === 'select' ? (
                <select
                  id={field.id}
                  className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-yellow-500 focus:border-yellow-500 sm:text-sm rounded-md"
                  value={formData[field.id] || ''}
                  onChange={(e) => handleInputChange(field.id, e.target.value)}
                >
                  <option value="">Select an option</option>
                  {field.options?.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              ) : (
                <input
                  type={field.type}
                  id={field.id}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-yellow-500 focus:border-yellow-500 sm:text-sm"
                  placeholder={field.placeholder}
                  value={formData[field.id] || ''}
                  onChange={(e) => handleInputChange(field.id, field.type === 'number' ? Number(e.target.value) : e.target.value)}
                />
              )}
            </div>
          ))}
        </div>

        {/* Navigation Buttons */}
        <div className="mt-8 flex justify-between">
          <button
            type="button"
            onClick={() => setCurrentStep(prev => prev - 1)}
            className={`px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 ${
              currentStep === 0 ? 'invisible' : ''
            }`}
          >
            Back
          </button>
          <button
            type="button"
            onClick={handleContinue}
            className="px-6 py-2 bg-yellow-500 text-white rounded-lg font-medium hover:bg-yellow-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500"
          >
            {currentStep === QUESTION_STEPS.length - 1 ? 'Calculate Results' : 'Continue'}
          </button>
        </div>
      </div>
    </div>
  );
} 