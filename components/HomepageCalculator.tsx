'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { Card } from "@/components/ui/card";
import { PiggyBank, TrendingUp, Landmark, Home as HomeIcon } from 'lucide-react';

type CalculatorType = 'tax' | 'investment' | 'pension' | 'mortgage';

interface CalculatorOption {
  type: CalculatorType;
  title: string;
  description: string;
  icon: React.ReactNode;
  color: string;
}

export default function HomepageCalculator() {
  const router = useRouter();
  
  const calculatorOptions: CalculatorOption[] = [
    {
      type: 'tax',
      title: 'Tax Assessment',
      description: 'Optimize your tax situation and discover potential savings',
      icon: <PiggyBank size={32} className="text-white" />,
      color: 'from-blue-500 to-blue-600'
    },
    {
      type: 'investment',
      title: 'Investment Planning',
      description: 'Plan your investments and project future returns',
      icon: <TrendingUp size={32} className="text-white" />,
      color: 'from-teal-500 to-teal-600'
    },
    {
      type: 'pension',
      title: 'Pension Planning',
      description: 'Secure your future with optimal pension planning',
      icon: <Landmark size={32} className="text-white" />,
      color: 'from-purple-500 to-purple-600'
    },
    {
      type: 'mortgage',
      title: 'Mortgage Planning',
      description: 'Find the optimal mortgage solution for your needs',
      icon: <HomeIcon size={32} className="text-white" />,
      color: 'from-pink-500 to-pink-600'
    }
  ];

  const handleCalculatorSelect = (type: CalculatorType) => {
    router.push(`/calculator?type=${type}`);
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
      <div className="p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Financial Calculator</h2>
        <p className="text-gray-600 mb-6">Select a calculator to get personalized financial insights</p>
        
        <div className="grid grid-cols-1 gap-4">
          {calculatorOptions.map((option) => (
            <Card 
              key={option.type}
              className="overflow-hidden cursor-pointer hover:shadow-lg transition-all relative z-30 border-0"
              onClick={() => handleCalculatorSelect(option.type)}
            >
              <div className="flex items-center p-4">
                <div className={`w-12 h-12 rounded-full bg-gradient-to-r ${option.color} flex items-center justify-center mr-4 flex-shrink-0`}>
                  {option.icon}
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">{option.title}</h3>
                  <p className="text-sm text-gray-500">{option.description}</p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
      
      <div className="bg-gray-50 px-6 py-4 text-center">
        <p className="text-sm text-gray-500">
          * Based on Finanztest/issue #12/2024, testing 22 private pension insurances
        </p>
      </div>
    </div>
  );
} 