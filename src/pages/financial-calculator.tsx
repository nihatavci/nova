import React from 'react';
import Head from 'next/head';

const FinancialCalculator: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50 py-12 px-4">
      <Head>
        <title>Financial Calculator | Nova Financial Advisory</title>
        <meta name="description" content="Plan your financial future with our easy-to-use calculators" />
      </Head>
      
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Financial Calculator</h1>
        
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">Retirement Calculator</h2>
          
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-4">
              <div>
                <label htmlFor="currentAge" className="block text-sm font-medium text-gray-700 mb-1">
                  Current Age
                </label>
                <input
                  type="number"
                  id="currentAge"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  placeholder="30"
                />
              </div>
              
              <div>
                <label htmlFor="retirementAge" className="block text-sm font-medium text-gray-700 mb-1">
                  Retirement Age
                </label>
                <input
                  type="number"
                  id="retirementAge"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  placeholder="65"
                />
              </div>
              
              <div>
                <label htmlFor="currentSavings" className="block text-sm font-medium text-gray-700 mb-1">
                  Current Savings ($)
                </label>
                <input
                  type="number"
                  id="currentSavings"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  placeholder="50000"
                />
              </div>
            </div>
            
            <div className="space-y-4">
              <div>
                <label htmlFor="monthlySavings" className="block text-sm font-medium text-gray-700 mb-1">
                  Monthly Contribution ($)
                </label>
                <input
                  type="number"
                  id="monthlySavings"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  placeholder="500"
                />
              </div>
              
              <div>
                <label htmlFor="expectedReturn" className="block text-sm font-medium text-gray-700 mb-1">
                  Expected Annual Return (%)
                </label>
                <input
                  type="number"
                  id="expectedReturn"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  placeholder="7"
                />
              </div>
              
              <div className="pt-7">
                <button
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition"
                >
                  Calculate
                </button>
              </div>
            </div>
          </div>
          
          <div className="mt-8 p-4 bg-gray-50 rounded-md">
            <h3 className="text-lg font-medium text-gray-900 mb-2">Results</h3>
            <p className="text-gray-600">Complete the form and click calculate to see your retirement projection.</p>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">Need Professional Advice?</h2>
          <p className="text-gray-600 mb-4">
            Our financial advisors can help you create a personalized retirement plan tailored to your unique needs and goals.
          </p>
          <button
            className="bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-md transition"
          >
            Schedule a Consultation
          </button>
        </div>
      </div>
    </div>
  );
};

export default FinancialCalculator;

 