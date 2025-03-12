import { useState } from 'react';
import QuestionSteps from './QuestionSteps';
import ResultsPage from './ResultsPage';
import { calculateRetirementResults } from '@/utils/retirementCalculator';

export default function Calculator() {
  const [showResults, setShowResults] = useState(false);
  const [results, setResults] = useState<any>(null);

  const handleQuestionComplete = (formData: any) => {
    // Calculate results using the form data
    const calculatedResults = calculateRetirementResults(formData);
    setResults(calculatedResults);
    setShowResults(false); // Initially hide results while calculating
  };

  const handleReset = () => {
    setShowResults(false);
    setResults(null);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {!results ? (
        <QuestionSteps onComplete={handleQuestionComplete} />
      ) : (
        <ResultsPage
          results={results}
          onReset={handleReset}
        />
      )}
    </div>
  );
} 