interface Step {
  title: string;
  description: string;
}

interface ProgressBarProps {
  steps: Step[];
  currentStep: number;
  onStepClick: (step: number) => void;
}

export default function ProgressBar({
  steps,
  currentStep,
  onStepClick,
}: ProgressBarProps) {
  return (
    <div className="relative">
      <div
        className="absolute top-4 w-full h-1 bg-gray-200"
        aria-hidden="true"
      >
        <div
          className="h-full bg-blue-600 transition-all duration-500"
          style={{
            width: `${((currentStep + 1) / steps.length) * 100}%`,
          }}
        />
      </div>

      <ul className="relative flex justify-between">
        {steps.map((step, index) => {
          const isCompleted = index < currentStep;
          const isCurrent = index === currentStep;

          return (
            <li
              key={step.title}
              className="flex flex-col items-center text-center"
            >
              <button
                onClick={() => onStepClick(index)}
                className={`w-8 h-8 rounded-full border-2 flex items-center justify-center mb-2 transition-colors duration-200 ${
                  isCompleted
                    ? 'bg-blue-600 border-blue-600 text-white'
                    : isCurrent
                    ? 'border-blue-600 text-blue-600'
                    : 'border-gray-300 text-gray-300'
                }`}
              >
                {isCompleted ? (
                  <svg
                    className="w-4 h-4"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                ) : (
                  index + 1
                )}
              </button>
              <span
                className={`text-sm font-medium ${
                  isCurrent ? 'text-blue-600' : 'text-gray-500'
                }`}
              >
                {step.title}
              </span>
              <span className="text-xs text-gray-400">{step.description}</span>
            </li>
          );
        })}
      </ul>
    </div>
  );
} 