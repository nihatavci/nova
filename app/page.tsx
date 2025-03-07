import Link from 'next/link';
import Image from 'next/image';
import EnhancedRetirementCalculator from '../components/EnhancedRetirementCalculator';
import { Check, Shield, Clock } from 'lucide-react';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        {/* Hero section with calculator */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          {/* Left side - Content */}
          <div className="text-left">
            <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 sm:text-5xl md:text-6xl">
              <span className="block mb-2">Premium Financial Advisory</span>
              <span className="inline-block bg-gradient-to-r from-gray-300 via-gray-200 to-gray-300 px-4 py-2 rounded-lg shadow-sm">
                <span className="text-gray-800">for German Expats</span>
              </span>
            </h1>
            <p className="mt-5 text-base text-gray-600 sm:text-lg md:text-xl max-w-2xl">
              Discover how to save €10k+ annually with our tailored financial solutions. No jargon, no commission - just clear financial advice.
            </p>
            
            {/* Trust indicators */}
            <div className="mt-8 flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
              <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100 transition-all hover:shadow flex-1 flex items-center">
                <div className="w-12 h-12 bg-gradient-to-br from-gray-300 to-gray-500 rounded-full flex items-center justify-center mr-3 shadow-inner flex-shrink-0">
                  <Shield className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-gray-900">GDPR Compliant</h3>
                  <p className="text-xs text-gray-500">Your data is secure</p>
                </div>
              </div>
              
              <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100 transition-all hover:shadow flex-1 flex items-center">
                <div className="w-12 h-12 bg-gradient-to-br from-yellow-300 to-yellow-500 rounded-full flex items-center justify-center mr-3 shadow-inner flex-shrink-0">
                  <Check className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-gray-900">3,400+ Satisfied</h3>
                  <p className="text-xs text-gray-500">Trusted by expats</p>
                </div>
              </div>
              
              <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100 transition-all hover:shadow flex-1 flex items-center">
                <div className="w-12 h-12 bg-gradient-to-br from-gray-300 to-gray-500 rounded-full flex items-center justify-center mr-3 shadow-inner flex-shrink-0">
                  <Clock className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-gray-900">15-Minute Process</h3>
                  <p className="text-xs text-gray-500">Quick & efficient</p>
                </div>
              </div>
            </div>
            
            <div className="mt-12 flex justify-left">
              <Link 
                href="/dashboard" 
                className="inline-flex items-center justify-center px-8 py-4 border border-transparent text-lg font-medium rounded-lg text-white bg-gradient-to-r from-gray-700 to-gray-900 hover:from-gray-800 hover:to-gray-950 shadow-md transition-all"
              >
                View Your Financial Dashboard
                <svg className="ml-2 -mr-1 w-6 h-6" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                  <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </Link>
            </div>
          </div>
          
          {/* Right side - Calculator */}
          <div className="w-full bg-white rounded-xl shadow-md overflow-hidden border border-gray-100 mt-6 lg:mt-0">
            <EnhancedRetirementCalculator />
          </div>
        </div>
      </div>
    </div>
  );
} 