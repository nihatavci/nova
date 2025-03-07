import React from 'react';
import Link from 'next/link';

const services = [
  {
    title: 'Financial Planning',
    description: 'Comprehensive financial planning tailored for German expats, considering both German and international regulations.',
    icon: '💼',
  },
  {
    title: 'Investment Advisory',
    description: 'Expert guidance on investment opportunities optimized for your unique situation as an expat.',
    icon: '📈',
  },
  {
    title: 'Tax Optimization',
    description: 'Strategic tax planning to minimize your tax burden while maintaining compliance with German and local tax laws.',
    icon: '📊',
  },
  {
    title: 'Retirement Planning',
    description: 'Long-term planning for a secure retirement, including pension considerations for German citizens living abroad.',
    icon: '🏖️',
  },
];

export default function ServicesPage() {
  return (
    <div className="container mx-auto py-12 px-4">
      <h1 className="text-4xl font-bold mb-8 text-center">Our Services</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
        {services.map((service, index) => (
          <div key={index} className="border rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow">
            <div className="text-4xl mb-4">{service.icon}</div>
            <h2 className="text-2xl font-semibold mb-2">{service.title}</h2>
            <p className="text-muted-foreground mb-4">{service.description}</p>
            <Link 
              href="/contact" 
              className="text-primary hover:underline"
            >
              Learn more →
            </Link>
          </div>
        ))}
      </div>
      
      <div className="text-center">
        <Link 
          href="/" 
          className="text-primary hover:underline"
        >
          ← Back to Home
        </Link>
      </div>
    </div>
  );
} 