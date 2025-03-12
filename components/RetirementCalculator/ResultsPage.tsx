import { RRSScore } from '@/types/calculator';
import { RetirementResults, convertToRRSScore } from '@/utils/retirementCalculator';
import { Radar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip as ChartTooltip,
  Legend
} from 'chart.js';
import { useState, useEffect } from 'react';
import { LightbulbIcon, TrendingUpIcon, ArrowRightIcon, InfoIcon } from 'lucide-react';
import { FaAward, FaRegFilePdf } from 'react-icons/fa';

// Register Chart.js components
ChartJS.register(
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  ChartTooltip,
  Legend
);

interface ResultsPageProps {
  score?: RRSScore;
  results?: RetirementResults;
  onReset: () => void;
}

// Define tab types
type TabType = 'overview' | 'suggestions' | 'investment' | 'pension' | 'tax';

// Add custom tooltip component
function CustomTooltip({ content, children }: { content: string; children: React.ReactNode }) {
  return (
    <div className="group relative inline-block">
      {children}
      <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-gray-900 text-white text-sm rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 whitespace-normal w-64 z-50">
        {content}
        <div className="absolute top-full left-1/2 transform -translate-x-1/2 -mt-1">
          <div className="border-4 border-transparent border-t-gray-900"></div>
        </div>
      </div>
    </div>
  );
}

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
        backgroundColor: 'rgba(252, 211, 77, 0.5)',  // More vibrant yellow background
        borderColor: 'rgba(245, 158, 11, 1)',      // Amber border
        borderWidth: 2,
        pointBackgroundColor: 'rgba(245, 158, 11, 1)',
        pointBorderColor: '#fff',
        pointHoverBackgroundColor: '#fff',
        pointHoverBorderColor: 'rgba(245, 158, 11, 1)',
        pointRadius: 5,
        pointHoverRadius: 7,
      },
    ],
  };
  
  // Define tooltips for radar chart axes - shorter and more concise
  const radarTooltips: Record<string, string> = {
    'Savings Rate': 'Percentage of income saved for retirement',
    'Time Horizon': 'Years until your planned retirement',
    'Investment Allocation': 'Distribution across stocks, bonds, and other assets',
    'Risk Management': 'How well you balance risk in your portfolio',
    'Pension Coverage': 'Extent of pension plan coverage',
    'Retirement Readiness': 'Overall preparedness for retirement',
  };
  
  const radarOptions = {
    scales: {
      r: {
        angleLines: {
          display: true,
          color: 'rgba(245, 158, 11, 0.3)',  // Amber angle lines
        },
        grid: {
          color: 'rgba(245, 158, 11, 0.2)',  // Amber grid lines
        },
        suggestedMin: 0,
        suggestedMax: 100,
        ticks: {
          stepSize: 20,
          backdropColor: 'transparent',
          color: 'rgba(107, 114, 128, 0.8)',  // Tick color
        },
        pointLabels: {
          font: {
            size: 13,
            weight: 'bold' as const
          },
          padding: 20,
          color: 'rgba(31, 41, 55, 0.9)',  // Darker label color for better readability
          callback: function(value: string) {
            const words = value.split(' ');
            if (words.length > 2) {
              return [words.slice(0, 2).join(' '), words.slice(2).join(' ')];
            }
            return value;
          }
        }
      },
    },
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        enabled: true,
        position: 'nearest',
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleColor: '#fff',
        bodyColor: '#fff',
        padding: 10,
        cornerRadius: 4,
        displayColors: false,
        callbacks: {
          title: function(context: any) {
            return context[0].label;
          },
          label: function(context: any) {
            return `Score: ${context.raw}/100`;
          },
          afterLabel: function(context: any) {
            const title = context.label;
            return radarTooltips[title] || '';
          }
        }
      }
    },
    maintainAspectRatio: false,
    onHover: (event: any, chartElement: any) => {
      if (event.native) {
        event.native.target.style.cursor = chartElement[0] ? 'pointer' : 'default';
      }
    }
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
                ? 'border-amber-500 text-amber-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
            onClick={() => setActiveTab('overview')}
          >
            Overview
          </button>
          <button
            className={`py-4 px-6 border-b-2 font-medium ${
              activeTab === 'suggestions'
                ? 'border-amber-500 text-amber-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
            onClick={() => setActiveTab('suggestions')}
          >
            Suggestions
          </button>
          <button
            className={`py-4 px-6 border-b-2 font-medium ${
              activeTab === 'investment'
                ? 'border-amber-500 text-amber-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
            onClick={() => setActiveTab('investment')}
          >
            Investment Ideas
          </button>
          <button
            className={`py-4 px-6 border-b-2 font-medium ${
              activeTab === 'pension'
                ? 'border-amber-500 text-amber-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
            onClick={() => setActiveTab('pension')}
          >
            Pension Plans
          </button>
          <button
            className={`py-4 px-6 border-b-2 font-medium ${
              activeTab === 'tax'
                ? 'border-amber-500 text-amber-600'
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
          <div className={`bg-gradient-to-r from-amber-100 to-yellow-200 p-6 rounded-lg border border-amber-300 shadow-md`}>
            <div className="flex items-center gap-4">
              <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-r from-amber-500 to-yellow-500 flex items-center justify-center shadow-md">
                <span className="text-white text-lg font-bold">!</span>
              </div>
              <p className="text-lg">
                Your retirement readiness score is <span className={`font-bold text-xl ${getScoreColor(scoreData.overall)}`}>{scoreData.overall}</span>, which is considered <span className={`font-bold text-xl ${getCategoryColor(scoreData.category)}`}>{scoreData.category}</span>.
              </p>
            </div>
          </div>

          {/* Summary Section */}
          <div className="mt-4">
            <h2 className="text-2xl font-bold text-gray-900 mb-3">Summary</h2>
            <p className="text-lg text-gray-700 mb-4">
              Your retirement readiness requires {scoreData.overall < 70 ? 'immediate action' : 'attention'}. There&apos;s a 
              {results && results.savingsGap > 0 ? ' significant' : ''} gap between your current savings path and retirement needs. 
              Implementing our recommendations is crucial for your financial future.
            </p>
          </div>

          {/* Radar Chart and Key Metrics */}
          <div className="grid grid-cols-1 gap-4">
            {/* Radar Chart */}
            {breakdownEntries.length > 0 && (
              <div className="bg-gradient-to-br from-yellow-50 to-amber-100 rounded-xl p-6 shadow-sm border border-amber-200">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">
                  Retirement Readiness Profile
                </h3>
                <div className="w-full h-[400px] p-4">
                  <Radar
                    data={radarData}
                    options={radarOptions}
                  />
                </div>
              </div>
            )}

            {/* Key Financial Metrics */}
            {results && (
              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">
                  Financial Projections
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-gradient-to-br from-amber-50 to-yellow-100 p-4 rounded-lg border border-amber-200">
                    <span className="text-gray-700 text-lg block mb-1">
                      <CustomTooltip content="Estimated total savings at retirement age">
                        Projected Retirement Savings
                        <InfoIcon className="inline-block w-4 h-4 ml-1 text-gray-500" />
                      </CustomTooltip>
                    </span>
                    <span className="text-2xl font-semibold text-gray-900">€{results.projectedSavings.toLocaleString()}</span>
                  </div>
                  <div className="bg-gradient-to-br from-amber-50 to-yellow-100 p-4 rounded-lg border border-amber-200">
                    <span className="text-gray-700 text-lg block mb-1">
                      <CustomTooltip content="Expected monthly income during retirement">
                        Monthly Retirement Income
                        <InfoIcon className="inline-block w-4 h-4 ml-1 text-gray-500" />
                      </CustomTooltip>
                    </span>
                    <span className="text-2xl font-semibold text-gray-900">€{monthlyRetirementIncome.toLocaleString()}</span>
                  </div>
                  <div className="bg-gradient-to-br from-amber-50 to-yellow-100 p-4 rounded-lg border border-amber-200">
                    <span className="text-gray-700 text-lg block mb-1">
                      <CustomTooltip content="Difference between desired and projected income">
                        Savings Gap
                        <InfoIcon className="inline-block w-4 h-4 ml-1 text-gray-500" />
                      </CustomTooltip>
                    </span>
                    <span className={`text-2xl font-semibold ${results.savingsGap > 0 ? 'text-red-600' : 'text-green-600'}`}>
                      €{results.savingsGap.toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Next Steps Section */}
          <div className="mt-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Next Steps</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Review Suggestions Card */}
              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                <div className="flex items-start">
                  <div className="flex-shrink-0 mr-4">
                    <LightbulbIcon className="w-8 h-8 text-yellow-500" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">Review Suggestions</h3>
                    <p className="text-lg text-gray-600 mb-4">
                      We&apos;ve provided personalized suggestions to improve your retirement readiness.
                    </p>
                    <button 
                      onClick={() => setActiveTab('suggestions')}
                      className="text-blue-600 text-lg font-medium flex items-center hover:text-blue-800"
                    >
                      View Suggestions <ArrowRightIcon className="w-5 h-5 ml-1" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Explore Investments Card */}
              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                <div className="flex items-start">
                  <div className="flex-shrink-0 mr-4">
                    <TrendingUpIcon className="w-8 h-8 text-blue-500" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">Explore Investments</h3>
                    <p className="text-lg text-gray-600 mb-4">
                      Discover investment options tailored to your risk profile and financial goals.
                    </p>
                    <button 
                      onClick={() => setActiveTab('investment')}
                      className="text-blue-600 text-lg font-medium flex items-center hover:text-blue-800"
                    >
                      View Investments <ArrowRightIcon className="w-5 h-5 ml-1" />
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
            Based on your retirement goals and risk profile, we&apos;ve tailored these specific investment strategies 
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
                        <span className="text-sm text-gray-500 block">
                          <CustomTooltip content="Years until your planned retirement">
                            Time Horizon
                            <InfoIcon className="inline-block w-4 h-4 ml-1 text-gray-400" />
                          </CustomTooltip>
                        </span>
                        <span className="text-lg font-semibold text-blue-600">Long Term (20+ years)</span>
                      </div>
                      <div className="bg-gray-50 p-3 rounded-lg">
                        <span className="text-sm text-gray-500 block">
                          <CustomTooltip content="Distribution across stocks, bonds, and other assets">
                            Investment Allocation
                            <InfoIcon className="inline-block w-4 h-4 ml-1 text-gray-400" />
                          </CustomTooltip>
                        </span>
                        <span className="text-lg font-semibold text-blue-600">80/20 Stocks/Bonds</span>
                      </div>
                      <div className="bg-gray-50 p-3 rounded-lg">
                        <span className="text-sm text-gray-500 block">
                          <CustomTooltip content="Level of uncertainty in your investment strategy">
                            Risk Level
                            <InfoIcon className="inline-block w-4 h-4 ml-1 text-gray-400" />
                          </CustomTooltip>
                        </span>
                        <span className="text-lg font-semibold text-blue-600">Moderate</span>
                      </div>
                      <div className="bg-gray-50 p-3 rounded-lg">
                        <span className="text-sm text-gray-500 block">
                          <CustomTooltip content="Recommended monthly investment amount">
                            Monthly Investment
                            <InfoIcon className="inline-block w-4 h-4 ml-1 text-gray-400" />
                          </CustomTooltip>
                        </span>
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
                        <span className="text-sm text-gray-500 block">
                          <CustomTooltip content="The length of time you plan to hold your investments, typically from now until your retirement age.">
                            Time Horizon
                            <InfoIcon className="inline-block w-4 h-4 ml-1 text-gray-400" />
                          </CustomTooltip>
                        </span>
                        <span className="text-lg font-semibold text-blue-600">Long Term (20+ years)</span>
                      </div>
                      <div className="bg-gray-50 p-3 rounded-lg">
                        <span className="text-sm text-gray-500 block">
                          <CustomTooltip content="Tax advantages specific to German retirement accounts, including deductions for contributions and tax-free growth of investments.">
                            Tax Benefits
                            <InfoIcon className="inline-block w-4 h-4 ml-1 text-gray-400" />
                          </CustomTooltip>
                        </span>
                        <span className="text-lg font-semibold text-green-600">€2,500/year</span>
                      </div>
                      <div className="bg-gray-50 p-3 rounded-lg">
                        <span className="text-sm text-gray-500 block">
                          <CustomTooltip content="The level of uncertainty and potential for loss in your investment strategy, balanced against potential returns.">
                            Risk Level
                            <InfoIcon className="inline-block w-4 h-4 ml-1 text-gray-400" />
                          </CustomTooltip>
                        </span>
                        <span className="text-lg font-semibold text-blue-600">Low-Moderate</span>
                      </div>
                      <div className="bg-gray-50 p-3 rounded-lg">
                        <span className="text-sm text-gray-500 block">
                          <CustomTooltip content="The recommended amount to invest each month to reach your retirement goals, considering your time horizon and risk tolerance.">
                            Monthly Investment
                            <InfoIcon className="inline-block w-4 h-4 ml-1 text-gray-400" />
                          </CustomTooltip>
                        </span>
                        <span className="text-lg font-semibold text-blue-600">€500</span>
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
                        <span className="text-sm text-gray-500 block">
                          <CustomTooltip content="The length of time you plan to hold your investments, typically from now until your retirement age.">
                            Time Horizon
                            <InfoIcon className="inline-block w-4 h-4 ml-1 text-gray-400" />
                          </CustomTooltip>
                        </span>
                        <span className="text-lg font-semibold text-blue-600">Long Term (20+ years)</span>
                      </div>
                      <div className="bg-gray-50 p-3 rounded-lg">
                        <span className="text-sm text-gray-500 block">
                          <CustomTooltip content="Tax advantages specific to German retirement accounts, including deductions for contributions and tax-free growth of investments.">
                            Tax Benefits
                            <InfoIcon className="inline-block w-4 h-4 ml-1 text-gray-400" />
                          </CustomTooltip>
                        </span>
                        <span className="text-lg font-semibold text-green-600">Up to €3,800/year</span>
                      </div>
                      <div className="bg-gray-50 p-3 rounded-lg">
                        <span className="text-sm text-gray-500 block">
                          <CustomTooltip content="The level of uncertainty and potential for loss in your investment strategy, balanced against potential returns.">
                            Risk Level
                            <InfoIcon className="inline-block w-4 h-4 ml-1 text-gray-400" />
                          </CustomTooltip>
                        </span>
                        <span className="text-lg font-semibold text-blue-600">Moderate</span>
                      </div>
                      <div className="bg-gray-50 p-3 rounded-lg">
                        <span className="text-sm text-gray-500 block">
                          <CustomTooltip content="The recommended amount to invest each month to reach your retirement goals, considering your time horizon and risk tolerance.">
                            Monthly Investment
                            <InfoIcon className="inline-block w-4 h-4 ml-1 text-gray-400" />
                          </CustomTooltip>
                        </span>
                        <span className="text-lg font-semibold text-blue-600">€500</span>
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
                        <span className="text-sm text-gray-500 block">
                          <CustomTooltip content="Tax advantages specific to German retirement accounts, including deductions for contributions and tax-free growth of investments.">
                            Tax Benefits
                            <InfoIcon className="inline-block w-4 h-4 ml-1 text-gray-400" />
                          </CustomTooltip>
                        </span>
                        <span className="text-lg font-semibold text-green-600">Up to €26,528</span>
                      </div>
                      <div className="bg-gray-50 p-3 rounded-lg">
                        <span className="text-sm text-gray-500 block">
                          <CustomTooltip content="The level of uncertainty and potential for loss in your investment strategy, balanced against potential returns.">
                            Risk Level
                            <InfoIcon className="inline-block w-4 h-4 ml-1 text-gray-400" />
                          </CustomTooltip>
                        </span>
                        <span className="text-lg font-semibold text-green-600">€7,500+</span>
                      </div>
                      <div className="bg-gray-50 p-3 rounded-lg">
                        <span className="text-sm text-gray-500 block">
                          <CustomTooltip content="The recommended amount to invest each month to reach your retirement goals, considering your time horizon and risk tolerance.">
                            Monthly Investment
                            <InfoIcon className="inline-block w-4 h-4 ml-1 text-gray-400" />
                          </CustomTooltip>
                        </span>
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
                        <span className="text-sm text-gray-500 block">
                          <CustomTooltip content="Tax advantages specific to German retirement accounts, including deductions for contributions and tax-free growth of investments.">
                            Tax Benefits
                            <InfoIcon className="inline-block w-4 h-4 ml-1 text-gray-400" />
                          </CustomTooltip>
                        </span>
                        <span className="text-lg font-semibold text-green-600">Up to €584/month</span>
                      </div>
                      <div className="bg-gray-50 p-3 rounded-lg">
                        <span className="text-sm text-gray-500 block">
                          <CustomTooltip content="The level of uncertainty and potential for loss in your investment strategy, balanced against potential returns.">
                            Risk Level
                            <InfoIcon className="inline-block w-4 h-4 ml-1 text-gray-400" />
                          </CustomTooltip>
                        </span>
                        <span className="text-lg font-semibold text-green-600">Up to €1,752/year</span>
                      </div>
                      <div className="bg-gray-50 p-3 rounded-lg">
                        <span className="text-sm text-gray-500 block">
                          <CustomTooltip content="The recommended amount to invest each month to reach your retirement goals, considering your time horizon and risk tolerance.">
                            Monthly Investment
                            <InfoIcon className="inline-block w-4 h-4 ml-1 text-gray-400" />
                          </CustomTooltip>
                        </span>
                        <span className="text-lg font-semibold text-blue-600">15% (mandatory)</span>
                      </div>
                      <div className="bg-gray-50 p-3 rounded-lg">
                        <span className="text-sm text-gray-500 block">
                          <CustomTooltip content="The recommended amount to invest each month to reach your retirement goals, considering your time horizon and risk tolerance.">
                            Monthly Investment
                            <InfoIcon className="inline-block w-4 h-4 ml-1 text-gray-400" />
                          </CustomTooltip>
                        </span>
                        <span className="text-lg font-semibold text-blue-600">€500</span>
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
                        <span className="text-sm text-gray-500 block">
                          <CustomTooltip content="The level of uncertainty and potential for loss in your investment strategy, balanced against potential returns.">
                            Risk Level
                            <InfoIcon className="inline-block w-4 h-4 ml-1 text-gray-400" />
                          </CustomTooltip>
                        </span>
                        <span className="text-lg font-semibold text-blue-600">Very High</span>
                      </div>
                      <div className="bg-gray-50 p-3 rounded-lg">
                        <span className="text-sm text-gray-500 block">
                          <CustomTooltip content="The recommended amount to invest each month to reach your retirement goals, considering your time horizon and risk tolerance.">
                            Monthly Investment
                            <InfoIcon className="inline-block w-4 h-4 ml-1 text-gray-400" />
                          </CustomTooltip>
                        </span>
                        <span className="text-lg font-semibold text-blue-600">€500</span>
                      </div>
                      <div className="bg-gray-50 p-3 rounded-lg">
                        <span className="text-sm text-gray-500 block">
                          <CustomTooltip content="Tax advantages specific to German retirement accounts, including deductions for contributions and tax-free growth of investments.">
                            Tax Benefits
                            <InfoIcon className="inline-block w-4 h-4 ml-1 text-gray-400" />
                          </CustomTooltip>
                        </span>
                        <span className="text-lg font-semibold text-yellow-600">Varies by country</span>
                      </div>
                      <div className="bg-gray-50 p-3 rounded-lg">
                        <span className="text-sm text-gray-500 block">
                          <CustomTooltip content="The recommended amount to invest each month to reach your retirement goals, considering your time horizon and risk tolerance.">
                            Monthly Investment
                            <InfoIcon className="inline-block w-4 h-4 ml-1 text-gray-400" />
                          </CustomTooltip>
                        </span>
                        <span className="text-lg font-semibold text-blue-600">€500</span>
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
                <h3 className="font-medium text-gray-800">
                  <CustomTooltip content="Special tax deductions available only to expatriates working in Germany, which can reduce your taxable income significantly.">
                    Special Expatriate Tax Deductions
                    <InfoIcon className="inline-block w-4 h-4 ml-1 text-gray-400" />
                  </CustomTooltip>
                </h3>
                <p className="text-gray-600 text-sm">Specific deductions available for foreign professionals</p>
              </div>
            </li>
            <li className="flex items-start">
              <div className="flex-shrink-0 w-5 h-5 rounded-full bg-blue-100 flex items-center justify-center mr-3 mt-0.5">
                <span className="text-blue-600 text-xs">2</span>
              </div>
              <div>
                <h3 className="font-medium text-gray-800">
                  <CustomTooltip content="In Germany, you can earn up to €801 (€1,602 for married couples) in capital gains and dividends tax-free each year.">
                    Tax-Free Investment Allowances
                    <InfoIcon className="inline-block w-4 h-4 ml-1 text-gray-400" />
                  </CustomTooltip>
                </h3>
                <p className="text-gray-600 text-sm">Annual tax-free allowances for capital gains and dividends</p>
              </div>
            </li>
            <li className="flex items-start">
              <div className="flex-shrink-0 w-5 h-5 rounded-full bg-blue-100 flex items-center justify-center mr-3 mt-0.5">
                <span className="text-blue-600 text-xs">3</span>
              </div>
              <div>
                <h3 className="font-medium text-gray-800">
                  <CustomTooltip content="Contributions to German pension plans like Rürup or company pensions can be deducted from your taxable income, reducing your overall tax burden.">
                    Pension Contribution Tax Benefits
                    <InfoIcon className="inline-block w-4 h-4 ml-1 text-gray-400" />
                  </CustomTooltip>
                </h3>
                <p className="text-gray-600 text-sm">Significant tax deductions for contributions to approved pension plans</p>
              </div>
            </li>
          </ul>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex flex-col items-center gap-4 pt-6 min-h-[48px]">
        <div className="flex w-full max-w-2xl justify-between gap-4">
          <button
            onClick={onReset}
            className="flex items-center justify-center gap-2 px-6 py-4 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition-colors w-1/4 text-lg"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            <span>Recalculate</span>
          </button>
          <button
            onClick={() => {
              // Save current tab
              const currentTab = activeTab;
              
              // Create a PDF with all tabs
              const generateFullPDF = async () => {
                // Create a container to hold all content
                const allContent = document.createElement('div');
                allContent.style.width = '100%';
                allContent.style.padding = '20px';
                
                // Temporarily hide the container
                allContent.style.position = 'absolute';
                allContent.style.left = '-9999px';
                document.body.appendChild(allContent);
                
                // Array of all tabs
                const tabs: TabType[] = ['overview', 'suggestions', 'investment', 'pension', 'tax'];
                
                // For each tab, switch to it, clone the content, and add to our container
                for (const tab of tabs) {
                  setActiveTab(tab);
                  
                  // Wait for render
                  await new Promise(resolve => setTimeout(resolve, 100));
                  
                  // Clone the main content
                  const tabContent = document.querySelector('.space-y-6.max-w-4xl.mx-auto');
                  if (tabContent) {
                    // Create a tab title
                    const tabTitle = document.createElement('h2');
                    tabTitle.textContent = tab.charAt(0).toUpperCase() + tab.slice(1);
                    tabTitle.style.fontSize = '24px';
                    tabTitle.style.fontWeight = 'bold';
                    tabTitle.style.marginTop = '30px';
                    tabTitle.style.marginBottom = '15px';
                    tabTitle.style.pageBreakBefore = 'always';
                    
                    // Add to our container
                    if (tab !== 'overview') { // Don't add page break for first tab
                      allContent.appendChild(tabTitle);
                    }
                    allContent.appendChild(tabContent.cloneNode(true));
                  }
                }
                
                // Use html2canvas and jsPDF to create PDF
                try {
                  const { jsPDF } = await import('jspdf');
                  const html2canvas = (await import('html2canvas')).default;
                  
                  const canvas = await html2canvas(allContent, {
                    scale: 1,
                    useCORS: true,
                    logging: false
                  });
                  
                  const imgData = canvas.toDataURL('image/png');
                  const pdf = new jsPDF('p', 'mm', 'a4');
                  const pdfWidth = pdf.internal.pageSize.getWidth();
                  const pdfHeight = pdf.internal.pageSize.getHeight();
                  const imgWidth = canvas.width;
                  const imgHeight = canvas.height;
                  const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight);
                  const imgX = (pdfWidth - imgWidth * ratio) / 2;
                  
                  let heightLeft = imgHeight;
                  let position = 0;
                  
                  pdf.addImage(imgData, 'PNG', imgX, position, imgWidth * ratio, imgHeight * ratio);
                  heightLeft -= pdfHeight;
                  
                  while (heightLeft >= 0) {
                    position = heightLeft - imgHeight;
                    pdf.addPage();
                    pdf.addImage(imgData, 'PNG', imgX, position, imgWidth * ratio, imgHeight * ratio);
                    heightLeft -= pdfHeight;
                  }
                  
                  pdf.save('Retirement_Analysis_Report.pdf');
                } catch (error) {
                  console.error('Error generating PDF:', error);
                  alert('There was an error generating your PDF. Please try again.');
                }
                
                // Clean up
                document.body.removeChild(allContent);
                
                // Restore original tab
                setActiveTab(currentTab);
              };
              
              generateFullPDF();
            }}
            className="flex items-center justify-center gap-2 px-6 py-4 bg-gradient-to-r from-amber-500 to-yellow-500 text-white rounded-lg font-medium hover:from-amber-600 hover:to-yellow-600 transition-all shadow-md w-2/4 relative group text-lg"
          >
            <span>Download Full Report</span>
            <FaRegFilePdf className="h-6 w-6 absolute right-4 top-1/2 transform -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity" />
          </button>
          <button
            className="flex items-center justify-center gap-2 px-6 py-4 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors w-1/4 text-lg"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            <span>Email</span>
          </button>
        </div>
      </div>

      {/* Immediate Financial Analysis Display */}
      {results && (
        <div className="mt-6 bg-gradient-to-br from-yellow-50 to-amber-100 rounded-xl p-6 shadow-sm border border-amber-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Financial Analysis</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-white bg-opacity-60 p-3 rounded-lg border border-amber-200">
              <span className="text-sm text-gray-700 block">
                <CustomTooltip content="The estimated monthly income you'll receive during retirement, based on your current savings and investment trajectory.">
                  Monthly Income
                  <InfoIcon className="inline-block w-4 h-4 ml-1 text-gray-500" />
                </CustomTooltip>
              </span>
              <span className="text-lg font-semibold text-blue-600">€{monthlyRetirementIncome.toLocaleString()}</span>
            </div>
            <div className="bg-white bg-opacity-60 p-3 rounded-lg border border-amber-200">
              <span className="text-sm text-gray-700 block">
                <CustomTooltip content="The total amount you're projected to save by retirement age, including investment returns and compound interest.">
                  Total Savings
                  <InfoIcon className="inline-block w-4 h-4 ml-1 text-gray-500" />
                </CustomTooltip>
              </span>
              <span className="text-lg font-semibold text-blue-600">€{results.projectedSavings.toLocaleString()}</span>
            </div>
            <div className="bg-white bg-opacity-60 p-3 rounded-lg border border-amber-200">
              <span className="text-sm text-gray-700 block">
                <CustomTooltip content="The difference between what you need for your desired retirement lifestyle and what you're on track to have. A positive number indicates a shortfall.">
                  Gap
                  <InfoIcon className="inline-block w-4 h-4 ml-1 text-gray-500" />
                </CustomTooltip>
              </span>
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