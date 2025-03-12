import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import Navbar from '@/components/Navbar';
import Script from 'next/script';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Nova Financial - Premium Retirement Planning for Expats in Germany',
  description: 'Calculate your retirement readiness score and get personalized recommendations for retirement planning in Germany. Expert financial advice for expats.',
  keywords: 'retirement calculator, Germany, expats, pension planning, financial planning, retirement score, tax optimization, investment strategy, expat finance',
  authors: [{ name: 'Nova Financial Advisory' }],
  category: 'Finance',
  robots: 'index, follow',
  openGraph: {
    title: 'Nova Financial - Premium Retirement Planning for Expats in Germany',
    description: 'Calculate your retirement readiness score and get personalized recommendations for retirement planning in Germany.',
    url: 'https://novafinancial.de',
    siteName: 'Nova Financial',
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Nova Financial - Premium Retirement Planning for Expats in Germany',
    description: 'Calculate your retirement readiness score and get personalized recommendations for retirement planning in Germany.',
  },
  viewport: 'width=device-width, initial-scale=1',
  themeColor: '#0A1E3C',
  alternates: {
    canonical: 'https://novafinancial.de'
  }
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <Script
          id="schema-org-data"
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@graph': [
                {
                  '@type': 'Organization',
                  '@id': 'https://novafinancial.de/#organization',
                  'name': 'Nova Financial',
                  'url': 'https://novafinancial.de',
                  'logo': 'https://novafinancial.de/logo.png',
                  'description': 'Premium retirement planning and financial advisory services for expats in Germany.',
                  'address': {
                    '@type': 'PostalAddress',
                    'addressLocality': 'Berlin',
                    'addressCountry': 'DE'
                  },
                  'contactPoint': {
                    '@type': 'ContactPoint',
                    'telephone': '+49-123-456-7890',
                    'email': 'info@novafinancial.de',
                    'contactType': 'Customer Service'
                  }
                },
                {
                  '@type': 'WebSite',
                  '@id': 'https://novafinancial.de/#website',
                  'url': 'https://novafinancial.de',
                  'name': 'Nova Financial - Premium Retirement Planning for Expats in Germany',
                  'description': 'Calculate your retirement readiness score and get personalized recommendations for retirement planning in Germany.',
                  'publisher': {
                    '@id': 'https://novafinancial.de/#organization'
                  }
                },
                {
                  '@type': 'Service',
                  '@id': 'https://novafinancial.de/calculator#service',
                  'name': 'Retirement Readiness Score Calculator',
                  'url': 'https://novafinancial.de/calculator',
                  'description': 'Get your personalized retirement readiness score and expert recommendations tailored for expats in Germany.',
                  'provider': {
                    '@id': 'https://novafinancial.de/#organization'
                  },
                  'serviceType': 'Financial Planning',
                  'areaServed': {
                    '@type': 'Country',
                    'name': 'Germany'
                  },
                  'audience': {
                    '@type': 'Audience',
                    'audienceType': 'Expats in Germany'
                  }
                },
                {
                  '@type': 'FinancialProduct',
                  'name': 'Expat Retirement Planning',
                  'description': 'Tailored retirement and investment solutions for expats living in Germany.',
                  'provider': {
                    '@id': 'https://novafinancial.de/#organization'
                  },
                  'category': 'Retirement Planning'
                },
                {
                  '@type': 'AggregateRating',
                  'itemReviewed': {
                    '@id': 'https://novafinancial.de/#organization'
                  },
                  'ratingValue': '4.8',
                  'bestRating': '5',
                  'worstRating': '1',
                  'ratingCount': '324'
                }
              ]
            })
          }}
        />
      </head>
      <body className={inter.className}>
        <div className="min-h-screen bg-[#F5F5F5]">
          {/* Header */}
          <Navbar />

          {/* Main Content */}
          <main>{children}</main>
          
          {/* Footer */}
          <footer className="bg-gradient-to-r from-[#0A1E3C] to-[#15294D] text-white py-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div>
                  <h3 className="text-lg font-semibold mb-4 text-[#E5B94B]">Nova Financial</h3>
                  <p className="text-gray-300 text-sm">
                    Premium retirement planning solutions for expats in Germany. 
                    Secure your future with our expert guidance.
                  </p>
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-4 text-[#E5B94B]">Quick Links</h3>
                  <ul className="space-y-2 text-sm">
                    <li><a href="/" className="text-gray-300 hover:text-[#E5B94B] transition-colors">Home</a></li>
                    <li><a href="/calculator" className="text-gray-300 hover:text-[#E5B94B] transition-colors">Calculator</a></li>
                    <li><a href="/about" className="text-gray-300 hover:text-[#E5B94B] transition-colors">About Us</a></li>
                    <li><a href="/contact" className="text-gray-300 hover:text-[#E5B94B] transition-colors">Contact</a></li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-4 text-[#E5B94B]">Contact Us</h3>
                  <p className="text-gray-300 text-sm mb-2">Email: info@novafinancial.de</p>
                  <p className="text-gray-300 text-sm mb-2">Phone: +49 123 456 7890</p>
                  <p className="text-gray-300 text-sm">Berlin, Germany</p>
                </div>
              </div>
              <div className="border-t border-[#1A2E4C] mt-8 pt-8 text-center text-sm text-gray-400">
                <p>© {new Date().getFullYear()} Nova Financial. All rights reserved.</p>
                <p className="mt-2">
                  <a href="/privacy" className="text-gray-400 hover:text-[#E5B94B] transition-colors">Privacy Policy</a>
                  {' | '}
                  <a href="/terms" className="text-gray-400 hover:text-[#E5B94B] transition-colors">Terms of Service</a>
                </p>
              </div>
            </div>
          </footer>
        </div>
      </body>
    </html>
  );
} 