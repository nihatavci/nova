"use client";

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import ResultsPage from '@/components/RetirementCalculator/ResultsPage';
import { RRSScore } from '@/types/calculator';
import { RetirementResults } from '@/utils/retirementCalculator';
import { FaLock, FaEye, FaCalendarAlt, FaExclamationTriangle } from 'react-icons/fa';

interface SharedResultData {
  shareId: string;
  resultData: RetirementResults;
  score: RRSScore;
  createdAt: string;
  expiresAt: string;
  viewCount: number;
  isProtected?: boolean;
}

const SharedResultPage = () => {
  const params = useParams() || {};
  const id = Array.isArray(params.id) ? params.id[0] : params.id as string;
  
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sharedData, setSharedData] = useState<SharedResultData | null>(null);
  const [isPasswordProtected, setIsPasswordProtected] = useState(false);
  const [password, setPassword] = useState('');
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [isVerifying, setIsVerifying] = useState(false);

  useEffect(() => {
    const fetchSharedResult = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(`/api/share?id=${id}`);
        
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Failed to fetch shared result');
        }
        
        const data = await response.json();
        
        if (data.isProtected) {
          setIsPasswordProtected(true);
          setSharedData({
            shareId: data.shareId,
            resultData: null as any,
            score: null as any,
            createdAt: data.createdAt,
            expiresAt: data.expiresAt,
            viewCount: 0,
          });
        } else {
          setSharedData(data);
        }
      } catch (err: any) {
        console.error('Error fetching shared result:', err);
        setError(err.message || 'Failed to load shared result');
      } finally {
        setIsLoading(false);
      }
    };

    if (id) {
      fetchSharedResult();
    }
  }, [id]);

  const handleVerifyPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!password.trim()) {
      return;
    }
    
    try {
      setIsVerifying(true);
      const response = await fetch('/api/share/verify', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          shareId: id,
          password,
        }),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Invalid password');
      }
      
      const data = await response.json();
      setSharedData(data);
      setIsPasswordProtected(false);
    } catch (err: any) {
      console.error('Error verifying password:', err);
      setError(err.message || 'Failed to verify password');
    } finally {
      setIsVerifying(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-amber-500"></div>
        </div>
      ) : error ? (
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
          <h2 className="text-xl font-semibold text-red-700 mb-2">Error</h2>
          <p className="text-red-600">{error}</p>
        </div>
      ) : isPasswordProtected && !sharedData ? (
        <div className="max-w-md mx-auto bg-white rounded-lg shadow-md p-6 border border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Password Protected Results</h2>
          <p className="text-gray-600 mb-4">
            This retirement analysis is password protected. Please enter the password to view the results.
          </p>
          
          {passwordError && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4">
              <p className="text-red-600 text-sm">{passwordError}</p>
            </div>
          )}
          
          <div className="mb-4">
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
              placeholder="Enter password"
            />
          </div>
          
          <button
            onClick={handleVerifyPassword}
            disabled={isVerifying || !password}
            className="w-full px-4 py-2 bg-amber-500 text-white rounded-md font-medium hover:bg-amber-600 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
          >
            {isVerifying ? 'Verifying...' : 'View Results'}
          </button>
        </div>
      ) : sharedData ? (
        <div>
          <div className="mb-6 bg-gradient-to-r from-amber-100 to-yellow-200 p-6 rounded-lg border border-amber-300 shadow-md">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Shared Retirement Analysis</h1>
            <p className="text-gray-700">
              This retirement analysis was shared with you on {formatDate(sharedData.createdAt)}.
            </p>
          </div>
          
          <ResultsPage 
            score={sharedData.score} 
            results={sharedData.resultData}
            onReset={() => {}} // No-op for shared view
            isShared={true} // Indicate this is a shared view
          />
        </div>
      ) : (
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
          <h2 className="text-xl font-semibold text-red-700 mb-2">Not Found</h2>
          <p className="text-red-600">The shared results you&apos;re looking for could not be found or have expired.</p>
        </div>
      )}
    </div>
  );
}

export default SharedResultPage; 