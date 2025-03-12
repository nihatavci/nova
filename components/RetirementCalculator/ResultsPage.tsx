import { RRSScore } from '@/types/calculator';
import { RetirementResults, convertToRRSScore } from '@/utils/retirementCalculator';
import { Radar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend
} from 'chart.js';
import { useState, useEffect } from 'react';
import { LightbulbIcon, TrendingUpIcon, ArrowRightIcon } from 'lucide-react';

// Register Chart.js components
ChartJS.register(
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend
);

interface ResultsPageProps {
  score?: RRSScore;
  results?: RetirementResults;
  onReset: () => void;
}

// Define tab types
type TabType = 'overview' | 'suggestions' | 'investment' | 'pension' | 'tax';

export default function ResultsPage({ score, results, onReset }: ResultsPageProps) {
  const [showResults, setShowResults] = useState(false);
  const [activeTab, setActiveTab] = useState<TabType>('overview');
  
  useEffect(() => {
    // When results are ready, we can enable the view results button
    if (results || score) {
      setTimeout(() => {
        setShowResults(true);
      }, 1500); // Give a slight delay to show the completion animation
    }
  }, [results, score]);

  if (!showResults) {
    return (
      <div className="text-center space-y-6 max-w-xl mx-auto py-8">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Creating Your Financial Roadmap</h2>
          <p className="text-gray-600">Your personalized retirement analysis is almost ready...</p>
        </div>
        
        <div className="relative">
          <div className="h-2 bg-gray-200 rounded-full">
            <div className="h-2 bg-yellow-500 rounded-full w-full transition-all duration-1000"></div>
          </div>
        </div>
        
        <div className="flex items-center justify-center space-x-2 text-gray-600">
          <span className="relative flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-yellow-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-yellow-500"></span>
          </span>
          <p>Analyzing Your Financial Future</p>
        </div>

        <div className="mt-4">
          <p className="text-sm text-gray-500">
            Our premium algorithm is building your personalized retirement roadmap.
          </p>
        </div>

        {showResults && (
          <button
            onClick={() => setShowResults(true)}
            className="mt-6 px-6 py-2 bg-yellow-500 text-white rounded-lg font-medium hover:bg-yellow-600 transition-colors"
          >
            View Your Results →
          </button>
        )}
      </div>
    );
  }

  // Use either the provided score or convert results to RRSScore format
  const scoreData: RRSScore = score || 
    (results ? convertToRRSScore(results) : {
      overall: 0,
      category: 'Fair',
      breakdown: {},
      recommendations: []
    });
  
  // Check if we have any meaningful data to display
  const hasData = scoreData.overall > 0 || 
                  (scoreData.breakdown && Object.keys(scoreData.breakdown).length > 0) || 
                  (scoreData.recommendations && scoreData.recommendations.length > 0);
  
  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'Excellent':
        return 'text-green-600';
      case 'Very Good':
        return 'text-blue-600';
      case 'Good':
        return 'text-yellow-600';
      case 'Fair':
        return 'text-orange-600';
      case 'Needs Attention':
      case 'Poor':
        return 'text-red-600';
      default:
        return 'text-gray-600';
    }
  };

  const getCategoryBgColor = (category: string) => {
    switch (category) {
      case 'Excellent':
        return 'bg-green-50';
      case 'Very Good':
        return 'bg-blue-50';
      case 'Good':
        return 'bg-yellow-50';
      case 'Fair':
        return 'bg-orange-50';
      case 'Needs Attention':
      case 'Poor':
        return 'bg-red-50';
      default:
        return 'bg-gray-50';
    }
  };

  const getScoreColor = (value: number) => {
    if (value >= 90) return 'text-green-600';
    if (value >= 80) return 'text-blue-600';
    if (value >= 70) return 'text-yellow-600';
    if (value >= 60) return 'text-orange-600';
    return 'text-red-600';
  };

  const getChartColor = (category: string) => {
    switch (category) {
      case 'Excellent':
        return 'rgba(34, 197, 94, 0.7)'; // green
      case 'Very Good':
      case 'Good':
        return 'rgba(59, 130, 246, 0.7)'; // blue
      case 'Fair':
        return 'rgba(234, 179, 8, 0.7)'; // yellow
      case 'Needs Attention':
      case 'Poor':
        return 'rgba(239, 68, 68, 0.7)'; // red
      default:
        return 'rgba(107, 114, 128, 0.7)'; // gray
    }
  };

  // Ensure breakdown exists and is not null
  const breakdownEntries = scoreData.breakdown ? Object.entries(scoreData.breakdown) : [];
  // Ensure recommendations exists and is not null
  const recommendations = scoreData.recommendations || [];
  
  // Prepare data for radar chart
  const radarData = {
    labels: breakdownEntries.map(([key]) => 
      key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())
    ),
    datasets: [
      {
        label: 'Your Scores',
        data: breakdownEntries.map(([_, value]) => value),
        backgroundColor: getChartColor(scoreData.category) + '0.4',
        borderColor: getChartColor(scoreData.category),
        borderWidth: 2,
        pointBackgroundColor: getChartColor(scoreData.category),
        pointBorderColor: '#fff',
        pointHoverBackgroundColor: '#fff',
        pointHoverBorderColor: getChartColor(scoreData.category),
        pointRadius: 4,
      },
    ],
  };
  
  const radarOptions = {
    scales: {
      r: {
        angleLines: {
          display: true,
          color: 'rgba(0, 0, 0, 0.1)',
        },
        suggestedMin: 0,
        suggestedMax: 100,
        ticks: {
          stepSize: 20,
          backdropColor: 'transparent',
        },
      },
    },
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        callbacks: {
          label: function(context: any) {
            return `Score: ${context.raw}/100`;
          }
        }
      }
    },
    maintainAspectRatio: false,
  };

  // Calculate monthly retirement income
  const monthlyRetirementIncome = results ? Math.round(results.retirementIncome / 12) : 0;
  
  // ===== DRAFT-2 UI Implementation =====
  // Tab-based layout with integrated score and recommendations
  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Tab Navigation */}
      <div className="border-b border-gray-200">
        <div className="flex space-x-4 -mb-px">
          <button
            className={`py-4 px-6 border-b-2 font-medium ${
              activeTab === 'overview'
                ? 'border-yellow-500 text-yellow-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
            onClick={() => setActiveTab('overview')}
          >
            Overview
          </button>
          <button
            className={`py-4 px-6 border-b-2 font-medium ${
              activeTab === 'suggestions'
                ? 'border-yellow-500 text-yellow-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
            onClick={() => setActiveTab('suggestions')}
          >
            Suggestions
          </button>
          <button
            className={`py-4 px-6 border-b-2 font-medium ${
              activeTab === 'investment'
                ? 'border-yellow-500 text-yellow-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
            onClick={() => setActiveTab('investment')}
          >
            Investment Ideas
          </button>
          <button
            className={`py-4 px-6 border-b-2 font-medium ${
              activeTab === 'pension'
                ? 'border-yellow-500 text-yellow-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
            onClick={() => setActiveTab('pension')}
          >
            Pension Plans
          </button>
          <button
            className={`py-4 px-6 border-b-2 font-medium ${
              activeTab === 'tax'
                ? 'border-yellow-500 text-yellow-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
            onClick={() => setActiveTab('tax')}
          >
            Tax Benefits
          </button>
        </div>
      </div>

      {/* Overview Tab Content */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* Score Alert Box */}
          <div className={`${getCategoryBgColor(scoreData.category)} p-4 rounded-lg border ${
            scoreData.overall < 50 ? 'border-red-300' : 'border-gray-200'
          }`}>
            <div className="flex items-center gap-3">
              <div className="flex-shrink-0 w-6 h-6 rounded-full bg-yellow-400 flex items-center justify-center">
                <span className="text-white font-bold">!</span>
              </div>
              <p className="font-medium">
                Your retirement readiness score is <span className={`font-bold ${getScoreColor(scoreData.overall)}`}>{scoreData.overall}</span>, which is considered <span className={`font-bold ${getCategoryColor(scoreData.category)}`}>{scoreData.category}</span>.
              </p>
            </div>
          </div>

          {/* Summary Section */}
          <div className="mt-6">
            <h2 className="text-xl font-bold text-gray-900 mb-3">Summary</h2>
            <p className="text-gray-700 mb-4">
              Your retirement readiness requires {scoreData.overall < 70 ? 'immediate action' : 'attention'}. There&apos;s a 
              {results && results.savingsGap > 0 ? ' significant' : ''} gap between your current savings path and retirement needs. 
              Implementing our recommendations is crucial for your financial future.
            </p>
          </div>

          {/* Radar Chart and Key Metrics */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Radar Chart */}
            {breakdownEntries.length > 0 && (
              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Retirement Readiness Profile
                </h3>
                <div className="h-72">
                  <Radar data={radarData} options={radarOptions} />
                </div>
              </div>
            )}

            {/* Key Financial Metrics */}
            {results && (
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Financial Projections
        </h3>
        <div className="space-y-4">
                  <div className="flex flex-col md:flex-row items-center justify-between mb-4 border-b pb-3 relative">
                    <span className="text-gray-600">Projected Retirement Savings:</span>
                    <span className="text-lg font-semibold text-gray-900">€{results.projectedSavings.toLocaleString()}</span>
                  </div>
                  <div className="flex flex-col md:flex-row items-center justify-between mb-4 border-b pb-3 relative">
                    <span className="text-gray-600">Monthly Retirement Income:</span>
                    <span className="text-lg font-semibold text-gray-900">€{monthlyRetirementIncome.toLocaleString()}</span>
                  </div>
                  <div className="flex flex-col md:flex-row items-center justify-between">
                    <span className="text-gray-600">Savings Gap:</span>
                    <span className={`text-lg font-semibold ${results.savingsGap > 0 ? 'text-red-600' : 'text-green-600'}`}>
                      €{results.savingsGap.toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Next Steps Section */}
          <div className="mt-8">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Next Steps</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Review Suggestions Card */}
              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                <div className="flex items-start">
                  <div className="flex-shrink-0 mr-4">
                    <LightbulbIcon className="w-6 h-6 text-yellow-500" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Review Suggestions</h3>
                    <p className="text-gray-600 mb-4">
                      We've provided personalized suggestions to improve your retirement readiness.
                    </p>
                    <button 
                      onClick={() => setActiveTab('suggestions')}
                      className="text-blue-600 font-medium flex items-center hover:text-blue-800"
                    >
                      View Suggestions <ArrowRightIcon className="w-4 h-4 ml-1" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Explore Investments Card */}
              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                <div className="flex items-start">
                  <div className="flex-shrink-0 mr-4">
                    <TrendingUpIcon className="w-6 h-6 text-blue-500" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Explore Investments</h3>
                    <p className="text-gray-600 mb-4">
                      Discover investment options tailored to your risk profile and financial goals.
                    </p>
                    <button 
                      onClick={() => setActiveTab('investment')}
                      className="text-blue-600 font-medium flex items-center hover:text-blue-800"
                    >
                      View Investments <ArrowRightIcon className="w-4 h-4 ml-1" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Retirement Income Gap Alert */}
          {results && results.savingsGap > 0 && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mt-6">
              <h3 className="text-lg font-semibold text-red-700 mb-2">Retirement Income Gap</h3>
              <p className="text-red-700">
                There&apos;s a projected gap of €{results.savingsGap.toLocaleString()} per year between your 
                desired retirement income and projected income.
              </p>
            </div>
          )}
        </div>
      )}

      {/* Suggestions Tab Content */}
      {activeTab === 'suggestions' && (
        <div className="space-y-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Personalized Recommendations</h2>
      <div className="space-y-4">
            {recommendations.map((recommendation, index) => (
          <div
            key={index}
            className="bg-white rounded-xl p-6 shadow-sm border border-gray-100"
          >
                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center 
                      ${recommendation.impact === 'High' ? 'bg-red-100 text-red-600' : 
                        recommendation.impact === 'Medium' ? 'bg-orange-100 text-orange-600' : 
                        'bg-blue-100 text-blue-600'}`}>
                      {index + 1}
                    </div>
                  </div>
                  <div className="flex-1 ml-4">
                    {/* Single badge for priority/impact */}
                    <div className="mb-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium 
                      ${recommendation.impact === 'High' ? 'bg-red-100 text-red-800' : 
                        recommendation.impact === 'Medium' ? 'bg-orange-100 text-orange-800' : 
                        'bg-blue-100 text-blue-800'}">
                      {recommendation.impact} Priority
                    </div>
                    <p className="text-gray-700 font-medium">{recommendation.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Investment Ideas Tab - Enhanced with specific recommendations */}
      {activeTab === 'investment' && (
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Investment Ideas</h2>
          <p className="text-gray-600 mb-6">
            Based on your retirement goals and risk profile, we've tailored these specific investment strategies 
            to help close your savings gap and optimize your retirement readiness.
          </p>
          <div className="space-y-6">
            {/* ETF Portfolio Option */}
            <div className="border border-gray-200 rounded-lg p-5">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center">
                    <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center mr-3">
                      <span className="text-blue-600 font-medium">1</span>
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900">MSCI World ESG ETF Portfolio</h3>
                  </div>
                  <div className="mt-3 pl-11">
                    <p className="text-gray-700 mb-3">A globally diversified portfolio of sustainable companies with 80% stocks / 20% bonds allocation.</p>
                    <div className="grid grid-cols-2 gap-4 mt-4">
                      <div className="bg-gray-50 p-3 rounded-lg">
                        <span className="text-sm text-gray-500 block">Expected Annual Return</span>
                        <span className="text-lg font-semibold text-blue-600">7-9%</span>
                      </div>
                      <div className="bg-gray-50 p-3 rounded-lg">
                        <span className="text-sm text-gray-500 block">Potential 10yr Growth</span>
                        <span className="text-lg font-semibold text-blue-600">€{Math.round(48000).toLocaleString()}+</span>
                      </div>
                      <div className="bg-gray-50 p-3 rounded-lg">
                        <span className="text-sm text-gray-500 block">Risk Level</span>
                        <span className="text-lg font-semibold text-blue-600">Moderate</span>
                      </div>
                      <div className="bg-gray-50 p-3 rounded-lg">
                        <span className="text-sm text-gray-500 block">Monthly Investment</span>
                        <span className="text-lg font-semibold text-blue-600">€500</span>
                      </div>
                    </div>
                    <div className="mt-4">
                      <h4 className="font-medium text-gray-700 mb-2">Recommended Allocation:</h4>
                      <ul className="space-y-1 text-gray-600">
                        <li>• iShares MSCI World ESG Enhanced (60%)</li>
                        <li>• Xtrackers MSCI Europe ESG (20%)</li>
                        <li>• Lyxor Green Bond ETF (20%)</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Real Estate Fund Option */}
            <div className="border border-gray-200 rounded-lg p-5">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center">
                    <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center mr-3">
                      <span className="text-blue-600 font-medium">2</span>
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900">German Real Estate Fund</h3>
                  </div>
                  <div className="mt-3 pl-11">
                    <p className="text-gray-700 mb-3">A tax-advantaged investment in German commercial and residential real estate markets with stable income.</p>
                    <div className="grid grid-cols-2 gap-4 mt-4">
                      <div className="bg-gray-50 p-3 rounded-lg">
                        <span className="text-sm text-gray-500 block">Expected Annual Return</span>
                        <span className="text-lg font-semibold text-blue-600">4-6%</span>
                      </div>
                      <div className="bg-gray-50 p-3 rounded-lg">
                        <span className="text-sm text-gray-500 block">Tax Advantages</span>
                        <span className="text-lg font-semibold text-green-600">€2,500/year</span>
                      </div>
                      <div className="bg-gray-50 p-3 rounded-lg">
                        <span className="text-sm text-gray-500 block">Risk Level</span>
                        <span className="text-lg font-semibold text-blue-600">Low-Moderate</span>
                      </div>
                      <div className="bg-gray-50 p-3 rounded-lg">
                        <span className="text-sm text-gray-500 block">Minimum Investment</span>
                        <span className="text-lg font-semibold text-blue-600">€10,000</span>
                      </div>
                    </div>
                    <div className="mt-4">
                      <h4 className="font-medium text-gray-700 mb-2">Specific Options:</h4>
                      <ul className="space-y-1 text-gray-600">
                        <li>• Deka ImmobilienEuropa Fund</li>
                        <li>• UniImmo: Deutschland</li>
                        <li>• Wealthcap Immobilien Deutschland 42</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Expat-Specific Investment Option */}
            <div className="border border-gray-200 rounded-lg p-5">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center">
                    <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center mr-3">
                      <span className="text-blue-600 font-medium">3</span>
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900">International Tax-Optimized Portfolio</h3>
                  </div>
                  <div className="mt-3 pl-11">
                    <p className="text-gray-700 mb-3">Specifically designed for expatriates in Germany, leveraging international tax treaties and optimization strategies.</p>
                    <div className="grid grid-cols-2 gap-4 mt-4">
                      <div className="bg-gray-50 p-3 rounded-lg">
                        <span className="text-sm text-gray-500 block">Expected Annual Return</span>
                        <span className="text-lg font-semibold text-blue-600">6-8%</span>
                      </div>
                      <div className="bg-gray-50 p-3 rounded-lg">
                        <span className="text-sm text-gray-500 block">Tax Savings</span>
                        <span className="text-lg font-semibold text-green-600">Up to €3,800/year</span>
                      </div>
                      <div className="bg-gray-50 p-3 rounded-lg">
                        <span className="text-sm text-gray-500 block">Risk Level</span>
                        <span className="text-lg font-semibold text-blue-600">Moderate</span>
                      </div>
                      <div className="bg-gray-50 p-3 rounded-lg">
                        <span className="text-sm text-gray-500 block">Flexibility</span>
                        <span className="text-lg font-semibold text-blue-600">High</span>
                      </div>
                    </div>
                    <div className="mt-4">
                      <h4 className="font-medium text-gray-700 mb-2">Key Components:</h4>
                      <ul className="space-y-1 text-gray-600">
                        <li>• Luxembourg-based SICAV funds</li>
                        <li>• Ireland-domiciled ETFs</li>
                        <li>• Tax-optimized dividend strategy</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Pension Plans Tab - Enhanced with specific recommendations */}
      {activeTab === 'pension' && (
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Pension Plans</h2>
          <p className="text-gray-600 mb-6">
            For expatriates in Germany, these specific pension options can significantly improve your retirement outlook 
            and provide tax advantages unique to your situation.
          </p>
          <div className="space-y-6">
            {/* Rürup Pension Option */}
            <div className="border border-gray-200 rounded-lg p-5">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center">
                    <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center mr-3">
                      <span className="text-blue-600 font-medium">1</span>
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900">Rürup Pension (Basis-Rente)</h3>
                  </div>
                  <div className="mt-3 pl-11">
                    <p className="text-gray-700 mb-3">Tax-advantaged private pension ideal for self-employed expats and high-income earners.</p>
                    <div className="grid grid-cols-2 gap-4 mt-4">
                      <div className="bg-gray-50 p-3 rounded-lg">
                        <span className="text-sm text-gray-500 block">2023 Tax Deduction</span>
                        <span className="text-lg font-semibold text-green-600">Up to €26,528</span>
                      </div>
                      <div className="bg-gray-50 p-3 rounded-lg">
                        <span className="text-sm text-gray-500 block">Annual Tax Savings</span>
                        <span className="text-lg font-semibold text-green-600">€7,500+</span>
                      </div>
                      <div className="bg-gray-50 p-3 rounded-lg">
                        <span className="text-sm text-gray-500 block">Deductible Portion</span>
                        <span className="text-lg font-semibold text-blue-600">94% (2023)</span>
                      </div>
                      <div className="bg-gray-50 p-3 rounded-lg">
                        <span className="text-sm text-gray-500 block">Monthly Contribution</span>
                        <span className="text-lg font-semibold text-blue-600">€500 - €2,000</span>
                      </div>
                    </div>
                    <div className="mt-4">
                      <h4 className="font-medium text-gray-700 mb-2">Recommended Providers:</h4>
                      <ul className="space-y-1 text-gray-600">
                        <li>• Allianz Basis-Rente Perspektive</li>
                        <li>• DWS Premium Pension Rürup</li>
                        <li>• Cosmos Direkt RürupRente</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Company Pension Option */}
            <div className="border border-gray-200 rounded-lg p-5">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center">
                    <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center mr-3">
                      <span className="text-blue-600 font-medium">2</span>
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900">Company Pension (bAV)</h3>
                  </div>
                  <div className="mt-3 pl-11">
                    <p className="text-gray-700 mb-3">Employer-sponsored pension with significant tax and social security contribution advantages.</p>
                    <div className="grid grid-cols-2 gap-4 mt-4">
                      <div className="bg-gray-50 p-3 rounded-lg">
                        <span className="text-sm text-gray-500 block">Tax-Free Contribution</span>
                        <span className="text-lg font-semibold text-green-600">Up to €584/month</span>
                      </div>
                      <div className="bg-gray-50 p-3 rounded-lg">
                        <span className="text-sm text-gray-500 block">Social Security Savings</span>
                        <span className="text-lg font-semibold text-green-600">Up to €1,752/year</span>
                      </div>
                      <div className="bg-gray-50 p-3 rounded-lg">
                        <span className="text-sm text-gray-500 block">Employer Contribution</span>
                        <span className="text-lg font-semibold text-blue-600">15% (mandatory)</span>
                      </div>
                      <div className="bg-gray-50 p-3 rounded-lg">
                        <span className="text-sm text-gray-500 block">Portability</span>
                        <span className="text-lg font-semibold text-blue-600">Medium</span>
                      </div>
                    </div>
                    <div className="mt-4">
                      <h4 className="font-medium text-gray-700 mb-2">Implementation Options:</h4>
                      <ul className="space-y-1 text-gray-600">
                        <li>• Direct Insurance (Direktversicherung)</li>
                        <li>• Pension Fund (Pensionsfonds)</li>
                        <li>• Support Fund (Unterstützungskasse)</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* International Pension Option */}
            <div className="border border-gray-200 rounded-lg p-5">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center">
                    <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center mr-3">
                      <span className="text-blue-600 font-medium">3</span>
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900">International Pension Solution</h3>
                  </div>
                  <div className="mt-3 pl-11">
                    <p className="text-gray-700 mb-3">Flexible pension solutions for expatriates planning international careers or potential relocation.</p>
                    <div className="grid grid-cols-2 gap-4 mt-4">
                      <div className="bg-gray-50 p-3 rounded-lg">
                        <span className="text-sm text-gray-500 block">Flexibility</span>
                        <span className="text-lg font-semibold text-blue-600">Very High</span>
                      </div>
                      <div className="bg-gray-50 p-3 rounded-lg">
                        <span className="text-sm text-gray-500 block">Currency Options</span>
                        <span className="text-lg font-semibold text-blue-600">Multi-currency</span>
                      </div>
                      <div className="bg-gray-50 p-3 rounded-lg">
                        <span className="text-sm text-gray-500 block">Tax Treatment</span>
                        <span className="text-lg font-semibold text-yellow-600">Varies by country</span>
                      </div>
                      <div className="bg-gray-50 p-3 rounded-lg">
                        <span className="text-sm text-gray-500 block">Portability</span>
                        <span className="text-lg font-semibold text-blue-600">Excellent</span>
                      </div>
                    </div>
                    <div className="mt-4">
                      <h4 className="font-medium text-gray-700 mb-2">Options Include:</h4>
                      <ul className="space-y-1 text-gray-600">
                        <li>• Zurich International Pension Plan</li>
                        <li>• Allianz Global Pension Solution</li>
                        <li>• QROPS for UK expatriates</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tax Benefits Tab Placeholder */}
      {activeTab === 'tax' && (
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Tax Benefits</h2>
          <p className="text-gray-600">
            As an expatriate in Germany, you can leverage these tax advantages for retirement planning:
          </p>
          <ul className="mt-4 space-y-3">
            <li className="flex items-start">
              <div className="flex-shrink-0 w-5 h-5 rounded-full bg-blue-100 flex items-center justify-center mr-3 mt-0.5">
                <span className="text-blue-600 text-xs">1</span>
              </div>
              <div>
                <h3 className="font-medium text-gray-800">Special Expatriate Tax Deductions</h3>
                <p className="text-gray-600 text-sm">Specific deductions available for foreign professionals</p>
              </div>
            </li>
            <li className="flex items-start">
              <div className="flex-shrink-0 w-5 h-5 rounded-full bg-blue-100 flex items-center justify-center mr-3 mt-0.5">
                <span className="text-blue-600 text-xs">2</span>
              </div>
              <div>
                <h3 className="font-medium text-gray-800">Tax-Free Investment Allowances</h3>
                <p className="text-gray-600 text-sm">Annual tax-free allowances for capital gains and dividends</p>
              </div>
            </li>
            <li className="flex items-start">
              <div className="flex-shrink-0 w-5 h-5 rounded-full bg-blue-100 flex items-center justify-center mr-3 mt-0.5">
                <span className="text-blue-600 text-xs">3</span>
              </div>
              <div>
                <h3 className="font-medium text-gray-800">Pension Contribution Tax Benefits</h3>
                <p className="text-gray-600 text-sm">Significant tax deductions for contributions to approved pension plans</p>
              </div>
            </li>
          </ul>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex flex-wrap justify-center gap-4 pt-4 min-h-[48px]">
        <button
          onClick={onReset}
          className="w-32 px-6 py-2 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200"
        >
          Recalculate
        </button>
        <button
          onClick={() => window.print()}
          className="w-32 px-6 py-2 bg-yellow-500 text-white rounded-lg font-medium hover:bg-yellow-600"
        >
          Download
        </button>
        <button
          className="w-32 px-6 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700"
        >
          Email
        </button>
      </div>

      {/* Immediate Financial Analysis Display */}
      {results && (
        <div className="mt-6 bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Financial Analysis</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-gray-50 p-3 rounded-lg">
              <span className="text-sm text-gray-500 block">Monthly Income</span>
              <span className="text-lg font-semibold text-blue-600">€{monthlyRetirementIncome.toLocaleString()}</span>
            </div>
            <div className="bg-gray-50 p-3 rounded-lg">
              <span className="text-sm text-gray-500 block">Total Savings</span>
              <span className="text-lg font-semibold text-blue-600">€{results.projectedSavings.toLocaleString()}</span>
            </div>
            <div className="bg-gray-50 p-3 rounded-lg">
              <span className="text-sm text-gray-500 block">Gap</span>
              <span className={`text-lg font-semibold ${results.savingsGap > 0 ? 'text-red-600' : 'text-green-600'}`}>
                €{results.savingsGap.toLocaleString()}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 