'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { 
  BarChart3, 
  PieChart, 
  TrendingUp, 
  Download, 
  FileText, 
  Settings, 
  Bell, 
  User,
  Calendar,
  Euro,
  ArrowUpRight,
  ArrowDownRight,
  Clock,
  Lock
} from 'lucide-react';

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState('overview');

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Financial Dashboard</h1>
              <p className="text-gray-600 mt-1">Access to your personalized financial insights</p>
            </div>
            
            <div className="mt-4 md:mt-0 flex flex-col sm:flex-row gap-4">
              <Link 
                href="/contact" 
                className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-gradient-to-r from-gray-700 to-gray-900 hover:from-gray-800 hover:to-gray-950 shadow-sm"
              >
                <Lock className="mr-2 h-4 w-4" />
                Sign Up for Full Access
              </Link>
            </div>
          </div>
          
          {/* Locked Content Notice */}
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 mb-8">
            <div className="flex items-center">
              <div className="flex-shrink-0 bg-gray-100 rounded-full p-3">
                <Lock className="h-6 w-6 text-gray-500" />
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-medium text-gray-900">Premium Content Locked</h3>
                <p className="text-gray-600 mt-1">
                  Sign up for a premium account to access your personalized financial dashboard, detailed reports, and expert recommendations.
                </p>
                <div className="mt-3">
                  <Link 
                    href="/contact" 
                    className="inline-flex items-center text-sm font-medium text-gray-700 hover:text-gray-900"
                  >
                    Learn more about premium benefits
                    <svg className="ml-1 h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </Link>
                </div>
              </div>
            </div>
          </div>
          
          {/* Sample Dashboard Preview */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Dashboard Preview</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="bg-white rounded-lg border border-gray-200 shadow-sm p-6"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-sm font-medium text-gray-500">Total Savings</p>
                    <h3 className="text-2xl font-bold text-gray-900 mt-1">€8,240</h3>
                    <span className="inline-flex items-center text-sm font-medium text-green-600 mt-1">
                      <ArrowUpRight className="h-4 w-4 mr-1" />
                      +12.5%
                    </span>
                  </div>
                  <div className="bg-gray-100 rounded-full p-3">
                    <Euro className="h-6 w-6 text-gray-500" />
                  </div>
                </div>
              </motion.div>
              
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.1 }}
                className="bg-white rounded-lg border border-gray-200 shadow-sm p-6"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-sm font-medium text-gray-500">Tax Optimization</p>
                    <h3 className="text-2xl font-bold text-gray-900 mt-1">€3,120</h3>
                    <span className="inline-flex items-center text-sm font-medium text-green-600 mt-1">
                      <ArrowUpRight className="h-4 w-4 mr-1" />
                      +8.3%
                    </span>
                  </div>
                  <div className="bg-gray-100 rounded-full p-3">
                    <FileText className="h-6 w-6 text-gray-500" />
                  </div>
                </div>
              </motion.div>
              
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.2 }}
                className="bg-white rounded-lg border border-gray-200 shadow-sm p-6"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-sm font-medium text-gray-500">Investment Returns</p>
                    <h3 className="text-2xl font-bold text-gray-900 mt-1">€5,120</h3>
                    <span className="inline-flex items-center text-sm font-medium text-green-600 mt-1">
                      <ArrowUpRight className="h-4 w-4 mr-1" />
                      +15.2%
                    </span>
                  </div>
                  <div className="bg-gray-100 rounded-full p-3">
                    <TrendingUp className="h-6 w-6 text-gray-500" />
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
          
          {/* Call to Action */}
          <div className="bg-gradient-to-r from-gray-100 to-gray-200 rounded-lg p-6 text-center">
            <h3 className="text-xl font-semibold text-gray-800 mb-2">Ready to optimize your finances?</h3>
            <p className="text-gray-600 mb-4">Get personalized recommendations and start saving today.</p>
            <Link 
              href="/contact" 
              className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-gradient-to-r from-gray-700 to-gray-900 hover:from-gray-800 hover:to-gray-950 shadow-sm"
            >
              Contact Us to Get Started
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
} 