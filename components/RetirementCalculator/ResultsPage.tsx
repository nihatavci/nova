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
import { FaAward, FaRegFilePdf, FaDownload, FaCalendarAlt, FaUserTie, FaHandshake } from 'react-icons/fa';

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
  isShared?: boolean;
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

// Free coaching offer component
const FreeCoachingOffer = () => {
  return (
    <div className="bg-gradient-to-r from-[#F9F5E3] to-[#FFFBEB] border border-[#FBD96D] rounded-lg p-6 mb-8 shadow-sm">
      <div className="flex flex-col md:flex-row items-center">
        <div className="flex-shrink-0 mr-6 mb-4 md:mb-0">
          <div className="bg-[#FBD96D] rounded-full p-4 text-[#0A1E3C]">
            <FaUserTie size={24} />
          </div>
        </div>
        <div className="flex-grow">
          <h3 className="text-xl font-bold text-[#0A1E3C] mb-2">Ready to maximize your retirement potential?</h3>
          <p className="text-gray-700 mb-4">Schedule a <span className="font-semibold">free 30-minute coaching session</span> with one of our expert financial advisors to discuss your results and create a personalized action plan.</p>
          <div className="flex flex-wrap gap-3">
            <a href="#schedule-session" className="inline-flex items-center px-4 py-2 bg-[#FBD96D] text-[#0A1E3C] rounded-md font-medium hover:bg-[#E5B94B] transition-colors">
              <FaCalendarAlt className="mr-2" />
              Schedule Free Session
            </a>
            <button className="inline-flex items-center px-4 py-2 border border-gray-300 text-gray-700 rounded-md font-medium hover:bg-gray-50 transition-colors">
              Learn More
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default function ResultsPage({ score, results, onReset, isShared = false }: ResultsPageProps) {
  const [showResults, setShowResults] = useState(false);
  const [activeTab, setActiveTab] = useState<TabType>('overview');
  const [shareUrl, setShareUrl] = useState<string | null>(null);
  const [isSharing, setIsSharing] = useState(false);
  const [shareError, setShareError] = useState<string | null>(null);
  const [showShareModal, setShowShareModal] = useState(false);
  const [isPasswordProtected, setIsPasswordProtected] = useState(false);
  const [sharePassword, setSharePassword] = useState('');
  const [isPdfGenerating, setIsPdfGenerating] = useState(false);
  
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
        position: 'nearest' as const,
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
  
  // Function to handle sharing the results
  const handleShare = async () => {
    if (!results && !score) {
      return;
    }
    
    // If we're showing the modal for the first time, just show the options
    if (!showShareModal) {
      setShowShareModal(true);
      return;
    }
    
    try {
      setIsSharing(true);
      setShareError(null);
      
      // Create the share data object
      const shareData = {
        resultData: results,
        score,
        isProtected: isPasswordProtected,
        accessPassword: isPasswordProtected ? sharePassword : null,
      };
      
      const response = await fetch('/api/share', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(shareData),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to create shared link');
      }
      
      // Use the shareUrl directly from the API response
      setShareUrl(data.shareUrl);
    } catch (err: any) {
      console.error('Error sharing results:', err);
      setShareError(err.message || 'Failed to create shared link');
    } finally {
      setIsSharing(false);
    }
  };

  // Function to copy the share URL to clipboard
  const copyToClipboard = () => {
    if (shareUrl) {
      navigator.clipboard.writeText(shareUrl)
        .then(() => {
          // Show a temporary success message
          const copyButton = document.getElementById('copy-button');
          if (copyButton) {
            copyButton.textContent = 'Copied!';
            setTimeout(() => {
              copyButton.textContent = 'Copy Link';
            }, 2000);
          }
        })
        .catch(err => {
          console.error('Failed to copy:', err);
        });
    }
  };

  // Share Modal Component
  const ShareModal = () => {
    if (!showShareModal) return null;
    
    // If we're still in the process of setting up sharing
    if (!shareUrl && !shareError) {
      return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 max-w-md w-full shadow-xl">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Share Your Results</h3>
            
            <p className="text-gray-600 mb-4">
              Choose how you want to share your retirement analysis:
            </p>
            
            <div className="space-y-4 mb-6">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="password-protect"
                  checked={isPasswordProtected}
                  onChange={(e) => setIsPasswordProtected(e.target.checked)}
                  className="h-4 w-4 text-amber-500 focus:ring-amber-500 border-gray-300 rounded"
                />
                <label htmlFor="password-protect" className="ml-2 block text-gray-700">
                  Password protect this link
                </label>
              </div>
              
              {isPasswordProtected && (
                <div className="mt-2">
                  <label htmlFor="share-password" className="block text-sm font-medium text-gray-700 mb-1">
                    Password
                  </label>
                  <input
                    type="password"
                    id="share-password"
                    value={sharePassword}
                    onChange={(e) => setSharePassword(e.target.value)}
                    placeholder="Enter a password"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  />
                  <p className="mt-1 text-sm text-gray-500">
                    Anyone who receives this link will need this password to view your results.
                  </p>
                </div>
              )}
            </div>
            
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowShareModal(false)}
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md font-medium hover:bg-gray-300 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleShare}
                disabled={isPasswordProtected && !sharePassword}
                className="px-4 py-2 bg-amber-500 text-white rounded-md font-medium hover:bg-amber-600 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
              >
                {isSharing ? 'Creating Link...' : 'Create Share Link'}
              </button>
            </div>
          </div>
        </div>
      );
    }
    
    // If we have a share URL or an error
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-lg p-6 max-w-md w-full shadow-xl">
          <h3 className="text-xl font-bold text-gray-900 mb-4">Share Your Results</h3>
          
          {shareError ? (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4">
              <p className="text-red-600 text-sm">{shareError}</p>
            </div>
          ) : (
            <>
              <p className="text-gray-600 mb-4">
                Your results are ready to share! Use the link below to share your retirement analysis with others.
              </p>
              
              <div className="flex items-center mb-4">
                <input
                  type="text"
                  value={shareUrl || ''}
                  readOnly
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent bg-gray-50"
                />
                <button
                  id="copy-button"
                  onClick={copyToClipboard}
                  className="px-4 py-2 bg-amber-500 text-white rounded-r-md font-medium hover:bg-amber-600 transition-colors"
                >
                  Copy Link
                </button>
              </div>
              
              {isPasswordProtected && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4">
                  <p className="text-blue-700 text-sm">
                    <span className="font-medium">Note:</span> This link is password protected. Anyone who receives this link will need the password to view your results.
                  </p>
                </div>
              )}
              
              <p className="text-sm text-gray-500 mb-6">
                This link will expire in 30 days. Anyone with this link can view your retirement analysis.
              </p>
            </>
          )}
          
          <div className="flex justify-end">
            <button
              onClick={() => {
                setShowShareModal(false);
                setShareUrl(null);
                setShareError(null);
              }}
              className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md font-medium hover:bg-gray-300 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    );
  };

  // Improved PDF generation function
  const generatePDF = async () => {
    if (isPdfGenerating) return;
    
    try {
      setIsPdfGenerating(true);
      
      // Import required libraries
      const { jsPDF } = await import('jspdf');
      const { default: autoTable } = await import('jspdf-autotable');
      
      // Create a new PDF document
      const pdf = new jsPDF();
      
      // Add title
      pdf.setFontSize(22);
      pdf.setTextColor(33, 33, 33);
      pdf.text('Retirement Analysis Report', 105, 20, { align: 'center' });
      
      // Add date
      pdf.setFontSize(10);
      pdf.setTextColor(100, 100, 100);
      pdf.text(`Generated on: ${new Date().toLocaleDateString()}`, 105, 30, { align: 'center' });
      
      // Add score section
      pdf.setFontSize(16);
      pdf.setTextColor(33, 33, 33);
      pdf.text('Retirement Readiness Score', 20, 45);
      
      pdf.setFontSize(14);
      pdf.setTextColor(50, 50, 50);
      pdf.text(`Score: ${scoreData.overall}/100 - ${scoreData.category}`, 20, 55);
      
      // Add financial projections
      pdf.setFontSize(16);
      pdf.setTextColor(33, 33, 33);
      pdf.text('Financial Projections', 20, 70);
      
      if (results) {
        autoTable(pdf, {
          startY: 75,
          head: [['Metric', 'Value']],
          body: [
            ['Projected Retirement Savings', `€${results.projectedSavings.toLocaleString()}`],
            ['Monthly Retirement Income', `€${monthlyRetirementIncome.toLocaleString()}`],
            ['Savings Gap', `€${results.savingsGap.toLocaleString()}`],
          ],
          theme: 'grid',
          headStyles: { fillColor: [245, 158, 11], textColor: [255, 255, 255] },
          alternateRowStyles: { fillColor: [245, 245, 245] },
        });
      }
      
      // Add breakdown section
      if (breakdownEntries.length > 0) {
        pdf.addPage();
        pdf.setFontSize(16);
        pdf.setTextColor(33, 33, 33);
        pdf.text('Retirement Readiness Breakdown', 20, 20);
        
        autoTable(pdf, {
          startY: 25,
          head: [['Category', 'Score']],
          body: breakdownEntries.map(([key, value]) => [
            key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase()),
            `${value}/100`,
          ]),
          theme: 'grid',
          headStyles: { fillColor: [245, 158, 11], textColor: [255, 255, 255] },
          alternateRowStyles: { fillColor: [245, 245, 245] },
        });
      }
      
      // Add recommendations section
      if (recommendations.length > 0) {
        pdf.addPage();
        pdf.setFontSize(16);
        pdf.setTextColor(33, 33, 33);
        pdf.text('Personalized Recommendations', 20, 20);
        
        let yPos = 30;
        recommendations.forEach((recommendation, index) => {
          pdf.setFontSize(12);
          pdf.setTextColor(33, 33, 33);
          pdf.text(`${index + 1}. ${recommendation.description}`, 20, yPos);
          pdf.setFontSize(10);
          pdf.setTextColor(100, 100, 100);
          pdf.text(`Priority: ${recommendation.impact}`, 25, yPos + 5);
          yPos += 15;
          
          // Add a new page if we're running out of space
          if (yPos > 270) {
            pdf.addPage();
            yPos = 20;
          }
        });
      }
      
      // Add footer with disclaimer
      const pageCount = pdf.getNumberOfPages();
      for (let i = 1; i <= pageCount; i++) {
        pdf.setPage(i);
        pdf.setFontSize(8);
        pdf.setTextColor(150, 150, 150);
        pdf.text(
          'This report is for informational purposes only and does not constitute financial advice.',
          105,
          pdf.internal.pageSize.height - 10,
          { align: 'center' }
        );
        pdf.text(
          `Page ${i} of ${pageCount}`,
          pdf.internal.pageSize.width - 20,
          pdf.internal.pageSize.height - 10
        );
      }
      
      // Save the PDF
      pdf.save('Retirement_Analysis_Report.pdf');
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('There was an error generating your PDF. Please try again.');
    } finally {
      setIsPdfGenerating(false);
    }
  };

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

          {/* Quick Financial Analysis - Only in Overview tab */}
          {results && (
            <div className="bg-gradient-to-br from-yellow-50 to-amber-100 rounded-xl p-6 shadow-sm border border-amber-200">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Quick Financial Analysis</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white bg-opacity-60 p-4 rounded-lg border border-amber-200">
                  <span className="text-gray-700 text-lg block mb-1">
                    <CustomTooltip content="Estimated total savings at retirement age">
                      Projected Retirement Savings
                      <InfoIcon className="inline-block w-4 h-4 ml-1 text-gray-500" />
                    </CustomTooltip>
                  </span>
                  <span className="text-2xl font-semibold text-gray-900">€{results.projectedSavings.toLocaleString()}</span>
                </div>
                <div className="bg-white bg-opacity-60 p-4 rounded-lg border border-amber-200">
                  <span className="text-gray-700 text-lg block mb-1">
                    <CustomTooltip content="Expected monthly income during retirement">
                      Monthly Retirement Income
                      <InfoIcon className="inline-block w-4 h-4 ml-1 text-gray-500" />
                    </CustomTooltip>
                  </span>
                  <span className="text-2xl font-semibold text-gray-900">€{monthlyRetirementIncome.toLocaleString()}</span>
                </div>
                <div className="bg-white bg-opacity-60 p-4 rounded-lg border border-amber-200">
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

          {/* Summary Section */}
          <div className="mt-4">
            <h2 className="text-2xl font-bold text-gray-900 mb-3">Summary</h2>
            <p className="text-lg text-gray-700 mb-4">
              Your retirement readiness requires {scoreData.overall < 70 ? 'immediate action' : 'attention'}. There&apos;s a 
              {results && results.savingsGap > 0 ? ' significant' : ''} gap between your current savings path and retirement needs. 
              Implementing our recommendations is crucial for your financial future.
            </p>
          </div>

          {/* Radar Chart */}
          <div className="grid grid-cols-1 gap-4">
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

      {/* Suggestions Tab Content - Enhanced with gradients */}
      {activeTab === 'suggestions' && (
        <div className="space-y-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Personalized Recommendations</h2>
          <div className="space-y-4">
            {recommendations.map((recommendation, index) => {
              // Determine gradient colors based on impact
              const gradientColors = recommendation.impact === 'High' 
                ? 'from-red-50 to-red-100 border-red-200' 
                : recommendation.impact === 'Medium'
                ? 'from-orange-50 to-orange-100 border-orange-200'
                : 'from-blue-50 to-blue-100 border-blue-200';
              
              const textColor = recommendation.impact === 'High' 
                ? 'text-red-800' 
                : recommendation.impact === 'Medium'
                ? 'text-orange-800'
                : 'text-blue-800';
              
              const badgeColor = recommendation.impact === 'High' 
                ? 'bg-red-100 text-red-800' 
                : recommendation.impact === 'Medium'
                ? 'bg-orange-100 text-orange-800'
                : 'bg-blue-100 text-blue-800';
              
              return (
                <div
                  key={index}
                  className={`bg-gradient-to-br ${gradientColors} rounded-xl p-6 shadow-sm border`}
                >
                  <div className="flex items-start">
                    <div className="flex-shrink-0">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center 
                        ${recommendation.impact === 'High' ? 'bg-red-200 text-red-600' : 
                          recommendation.impact === 'Medium' ? 'bg-orange-200 text-orange-600' : 
                          'bg-blue-200 text-blue-600'}`}>
                        {index + 1}
                      </div>
                    </div>
                    <div className="flex-1 ml-4">
                      {/* Badge for priority/impact */}
                      <div className={`mb-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${badgeColor}`}>
                        {recommendation.impact} Priority
                      </div>
                      <p className={`font-medium ${textColor}`}>{recommendation.description}</p>
                    </div>
                  </div>
                </div>
              );
            })}
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

      {/* Add coaching offer banner */}
      <FreeCoachingOffer />

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
          
          {!isShared && (
            <button
              onClick={() => {
                setShowShareModal(true);
                setShareUrl(null);
                setShareError(null);
              }}
              disabled={isSharing}
              className="flex items-center justify-center gap-2 px-6 py-4 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors w-1/4 text-lg relative group"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
              </svg>
              <span>{isSharing ? 'Sharing...' : 'Share'}</span>
            </button>
          )}
          
          <button
            onClick={generatePDF}
            disabled={isPdfGenerating}
            className="bg-gradient-to-r from-[#FFD75E] to-[#FFC92C] text-[#0A1E3C] px-6 py-3 rounded-lg font-medium flex items-center justify-center space-x-2 shadow-[0_8px_30px_rgb(255,215,94,0.3)] hover:opacity-90 transition-all duration-300 hover:scale-105 active:scale-98 disabled:opacity-50 disabled:cursor-not-allowed w-full sm:w-auto"
          >
            <span>{isPdfGenerating ? 'Generating...' : 'Download Full Report'}</span>
            {isPdfGenerating ? (
              <div className="ml-2 relative w-5 h-5">
                <div className="w-full h-full rounded-full border-2 border-[#0A1E3C]/20" />
                <div 
                  className="absolute top-0 left-0 w-full h-full rounded-full border-2 border-t-[#0A1E3C] animate-spin"
                  style={{ borderTopWidth: '2px', animationDuration: '1s' }}
                />
              </div>
            ) : (
              <FaDownload className="w-5 h-5 ml-2" />
            )}
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

      {/* Share Modal */}
      <ShareModal />
    </div>
  );
} 