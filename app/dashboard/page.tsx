'use client';

import { useEffect, useState } from 'react';
import { formatCurrency, formatPercentage } from '@/lib/api-helpers';
import { RetirementScoreResponse } from '@/lib/api-types';

export default function DashboardPage() {
  const [assessmentResults, setAssessmentResults] = useState<RetirementScoreResponse['data'] | null>(null);

  useEffect(() => {
    const savedResults = localStorage.getItem('retirementCalculatorResults');
    if (savedResults) {
      try {
        const parsedResults = JSON.parse(savedResults);
        setAssessmentResults(parsedResults);
      } catch (error) {
        console.error('Error parsing saved results:', error);
      }
    }
  }, []);

  if (!assessmentResults) {
    return (
      <div className="min-h-screen bg-gray-50 py-12 animate-fadeIn">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-900">No Results Found</h2>
            <p className="mt-4 text-lg text-gray-600">
              Please complete the retirement calculator to view your personalized dashboard.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 animate-fadeIn">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900">Your Retirement Dashboard</h2>
          <p className="mt-4 text-lg text-gray-600">
            Track your progress and optimize your retirement strategy
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white rounded-lg shadow-md p-6 hover:scale-102 transition-transform">
            <h3 className="text-lg font-medium text-gray-900">Potential Annual Savings</h3>
            <p className="mt-2 text-3xl font-bold text-gray-900">
              {formatCurrency(assessmentResults.potentialSavings)}
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6 hover:scale-102 transition-transform">
            <h3 className="text-lg font-medium text-gray-900">Net Monthly Income</h3>
            <p className="mt-2 text-3xl font-bold text-gray-900">
              {formatCurrency(assessmentResults.netMonthlyIncome)}
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6 hover:scale-102 transition-transform">
            <h3 className="text-lg font-medium text-gray-900">Projected Savings</h3>
            <p className="mt-2 text-3xl font-bold text-gray-900">
              {formatCurrency(assessmentResults.projectedSavings)}
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6 hover:scale-102 transition-transform">
            <h3 className="text-lg font-medium text-gray-900">Income Replacement</h3>
            <p className="mt-2 text-3xl font-bold text-gray-900">
              {formatPercentage(assessmentResults.incomeReplacementRate)}
            </p>
          </div>
        </div>

        <div className="mt-12 bg-white rounded-lg shadow-md p-8 hover:scale-102 transition-transform">
          <h3 className="text-xl font-bold text-gray-900 mb-6">Recommendations</h3>
          <div className="space-y-6">
            {assessmentResults.recommendations.map((recommendation, index) => (
              <div key={index} className="border-l-4 border-gray-800 pl-4">
                <h4 className="text-lg font-medium text-gray-900">{recommendation.title}</h4>
                <p className="mt-2 text-gray-600">{recommendation.description}</p>
                <ul className="mt-4 list-disc list-inside space-y-2">
                  {recommendation.actionItems.map((item, itemIndex) => (
                    <li key={itemIndex} className="text-gray-600">{item}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
} 