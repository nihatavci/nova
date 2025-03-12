'use client';

import Image from 'next/image';
import Link from 'next/link';

export default function AnimatedHero() {
  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-b from-gray-900 to-gray-800">
      <div className="absolute inset-0 z-0">
        <Image
          src="/images/hero-bg.jpg"
          alt="Hero background"
          fill
          className="object-cover opacity-20"
          priority
        />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-32 text-center">
        <h1 className="text-4xl sm:text-6xl font-bold text-white mb-8 animate-fadeIn">
          Plan Your Perfect Retirement
        </h1>
        
        <p className="text-xl sm:text-2xl text-gray-300 mb-12 max-w-3xl mx-auto animate-fadeIn delay-200">
          Get personalized retirement planning advice and start building your dream future today.
        </p>
        
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fadeIn delay-400">
          <Link
            href="/calculator"
            className="px-8 py-4 bg-gradient-to-r from-gray-600 to-gray-800 text-white rounded-lg shadow-lg hover:scale-102 active:scale-98 transition-transform"
          >
            Start Planning
          </Link>
          
          <Link
            href="/about"
            className="px-8 py-4 bg-white/10 text-white rounded-lg shadow-lg backdrop-blur-sm hover:scale-102 active:scale-98 transition-transform"
          >
            Learn More
          </Link>
        </div>
      </div>
    </div>
  );
} 