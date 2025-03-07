import Link from 'next/link';
import Image from 'next/image';

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <div className="container mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold text-gray-900 mb-8">About Nova</h1>
          
          <p className="text-xl text-gray-700 mb-6">
            Nova is a premium financial advisory service designed specifically for German expats living abroad.
            We understand the unique challenges that come with managing finances across multiple jurisdictions.
          </p>
          
          <h2 className="text-2xl font-semibold text-gray-900 mt-10 mb-4">Our Mission</h2>
          <p className="text-gray-700 mb-8">
            Our mission is to empower German expats to make informed financial decisions, optimize their tax situations,
            and build wealth effectively while navigating the complexities of international finance.
          </p>
          
          {/* Founder Section with Photo Placeholder */}
          <div className="flex flex-col md:flex-row items-center gap-8 my-12 p-6 bg-gradient-to-r from-gray-100 to-gray-200 rounded-xl shadow-sm">
            <div className="w-48 h-48 bg-gradient-to-br from-gray-300 to-gray-500 rounded-full flex items-center justify-center text-white text-lg font-medium overflow-hidden">
              <div className="text-center">
                <p>Photo</p>
                <p>Placeholder</p>
              </div>
            </div>
            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Dr. Marcus Weber</h3>
              <p className="text-gray-700 italic mb-4">Founder & Lead Financial Advisor</p>
              <p className="text-gray-600">
                With over 15 years of experience in international finance and tax optimization for German expatriates,
                Dr. Weber founded Nova to provide clear, actionable financial guidance without the industry jargon and hidden commissions.
              </p>
            </div>
          </div>
          
          <h2 className="text-2xl font-semibold text-gray-900 mt-10 mb-6">Why Choose Nova?</h2>
          <div className="space-y-4">
            <div className="flex items-start">
              <div className="w-6 h-6 bg-gradient-to-br from-gray-300 to-gray-500 rounded-full flex-shrink-0 mr-3 mt-1"></div>
              <div>
                <p className="text-gray-700"><span className="font-semibold text-gray-900">Specialized Expertise:</span> Our advisors specialize in cross-border financial planning for German expats.</p>
              </div>
            </div>
            
            <div className="flex items-start">
              <div className="w-6 h-6 bg-gradient-to-br from-gray-300 to-gray-500 rounded-full flex-shrink-0 mr-3 mt-1"></div>
              <div>
                <p className="text-gray-700"><span className="font-semibold text-gray-900">Personalized Approach:</span> We provide tailored advice based on your unique financial situation and goals.</p>
              </div>
            </div>
            
            <div className="flex items-start">
              <div className="w-6 h-6 bg-gradient-to-br from-gray-300 to-gray-500 rounded-full flex-shrink-0 mr-3 mt-1"></div>
              <div>
                <p className="text-gray-700"><span className="font-semibold text-gray-900">AI-Powered Analysis:</span> Our advanced algorithms analyze your financial data to identify optimization opportunities.</p>
              </div>
            </div>
            
            <div className="flex items-start">
              <div className="w-6 h-6 bg-gradient-to-br from-gray-300 to-gray-500 rounded-full flex-shrink-0 mr-3 mt-1"></div>
              <div>
                <p className="text-gray-700"><span className="font-semibold text-gray-900">Comprehensive Reports:</span> Receive detailed PDF reports with actionable recommendations.</p>
              </div>
            </div>
            
            <div className="flex items-start">
              <div className="w-6 h-6 bg-gradient-to-br from-gray-300 to-gray-500 rounded-full flex-shrink-0 mr-3 mt-1"></div>
              <div>
                <p className="text-gray-700"><span className="font-semibold text-gray-900">Ongoing Support:</span> Access to our dashboard for tracking progress and updating your financial information.</p>
              </div>
            </div>
          </div>
          
          <h2 className="text-2xl font-semibold text-gray-900 mt-10 mb-6">Our Process</h2>
          <ol className="list-decimal pl-5 space-y-4">
            <li className="pl-2">
              <p className="text-gray-700"><span className="font-semibold text-gray-900">Information Gathering:</span> Complete our comprehensive multi-step form to provide details about your financial situation.</p>
            </li>
            <li className="pl-2">
              <p className="text-gray-700"><span className="font-semibold text-gray-900">AI Analysis:</span> Our system analyzes your data to identify optimization opportunities.</p>
            </li>
            <li className="pl-2">
              <p className="text-gray-700"><span className="font-semibold text-gray-900">Report Generation:</span> Receive a detailed PDF report with personalized recommendations.</p>
            </li>
            <li className="pl-2">
              <p className="text-gray-700"><span className="font-semibold text-gray-900">Implementation Support:</span> Track your progress and receive guidance on implementing recommendations.</p>
            </li>
            <li className="pl-2">
              <p className="text-gray-700"><span className="font-semibold text-gray-900">Ongoing Optimization:</span> Regular updates and adjustments to your financial strategy as your situation evolves.</p>
            </li>
          </ol>
          
          <div className="bg-gradient-to-r from-gray-100 to-gray-200 p-6 rounded-lg border border-gray-200 mt-10 shadow-sm">
            <h3 className="text-xl font-semibold text-gray-800 mb-3">Ready to optimize your finances?</h3>
            <p className="text-gray-700 mb-4">
              Take the first step toward financial clarity and optimization by using our financial calculators.
            </p>
            <Link 
              href="/" 
              className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-gradient-to-r from-gray-700 to-gray-900 hover:from-gray-800 hover:to-gray-950 shadow-sm"
            >
              Get Started
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
} 