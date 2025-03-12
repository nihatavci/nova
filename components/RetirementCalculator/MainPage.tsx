'use client';

import MultiStepForm from './MultiStepForm';
import Image from 'next/image';
import { FaChartLine, FaCheckCircle, FaAward } from 'react-icons/fa';
import { HiArrowRight } from 'react-icons/hi';

export default function MainPage() {
  return (
    <main className="min-h-screen bg-[#F5F5F5] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col lg:flex-row lg:items-start lg:space-x-8">
          {/* Left Column - Content */}
          <div className="lg:w-1/2 mb-8 lg:mb-0">
            <div className="mb-8">
              <h1 className="text-4xl font-bold text-[#0A1E3C] mb-3">Retirement Planning for Expats in Germany</h1>
              <div className="bg-gradient-to-r from-[#E5B94B] to-[#D4AF37] text-[#0A1E3C] font-medium px-4 py-2 rounded-md inline-block mb-5 shadow-sm text-lg">
                Get Your Free Retirement Readiness Score
              </div>
              <p className="text-xl text-gray-700 mb-6">
                Discover how our expert retirement planning can help expats in Germany save €10k+ annually with tailored financial solutions.
              </p>
            </div>

            {/* Premium Features Section with reduced text */}
            <div className="bg-white rounded-lg shadow-md p-6 mb-8 border border-gray-200">
              <h2 className="text-2xl font-bold text-[#0A1E3C] mb-5 flex items-center">
                <FaAward className="text-[#E5B94B] mr-3" />
                Premium Financial Analysis
              </h2>
              
              <ul className="space-y-4">
                <li className="flex items-start">
                  <FaCheckCircle className="text-[#E5B94B] mt-1 mr-3 flex-shrink-0 text-lg" />
                  <span className="text-gray-700 text-lg">Personalized retirement readiness score</span>
                </li>
                <li className="flex items-start">
                  <FaCheckCircle className="text-[#E5B94B] mt-1 mr-3 flex-shrink-0 text-lg" />
                  <span className="text-gray-700 text-lg">Tailored investment recommendations</span>
                </li>
                <li className="flex items-start">
                  <FaCheckCircle className="text-[#E5B94B] mt-1 mr-3 flex-shrink-0 text-lg" />
                  <span className="text-gray-700 text-lg">German tax optimization strategies</span>
                </li>
              </ul>
            </div>

            {/* CTA Button */}
            <button
              className="flex items-center bg-gradient-to-r from-[#E5B94B] to-[#D4AF37] text-[#0A1E3C] px-7 py-4 rounded-lg font-medium shadow-md hover:from-[#D4AF37] hover:to-[#C4A137] transition-all duration-300 text-lg"
            >
              View Your Financial Dashboard
              <HiArrowRight className="w-5 h-5 ml-3" />
            </button>
          </div>

          {/* Right Column - Calculator */}
          <div className="lg:w-1/2">
            <MultiStepForm />
          </div>
        </div>
      </div>
    </main>
  );
} 