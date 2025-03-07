'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Facebook, Twitter, Linkedin } from 'lucide-react';

interface FormData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

export default function ContactPage() {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate form submission
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
      
      // Reset form after submission
      setFormData({
        name: '',
        email: '',
        subject: '',
        message: ''
      });
      
      // Reset submission status after a delay
      setTimeout(() => {
        setIsSubmitted(false);
      }, 5000);
    }, 1500);
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Contact Us</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Have questions about our financial advisory services for German expats? Our team is here to help you navigate your financial journey.
          </p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Form */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-white rounded-xl shadow-md p-8 border border-gray-100"
          >
            <h2 className="text-2xl font-semibold text-gray-900 mb-6">Get in Touch</h2>
            <p className="text-gray-600 mb-8">Fill out the form and our team will get back to you within 24 hours.</p>
            
            {isSubmitted ? (
              <div className="bg-gradient-to-r from-gray-100 to-gray-200 p-6 rounded-lg text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-gray-300 to-gray-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Thank You!</h3>
                <p className="text-gray-700">Your message has been sent successfully. We'll get back to you soon.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit}>
                <div className="mb-6">
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">Name</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-transparent"
                    placeholder="Your name"
                    required
                  />
                </div>
                
                <div className="mb-6">
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-transparent"
                    placeholder="your.email@example.com"
                    required
                  />
                </div>
                
                <div className="mb-6">
                  <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-2">Subject</label>
                  <select
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-transparent appearance-none bg-white"
                    required
                  >
                    <option value="">Select a subject</option>
                    <option value="General Inquiry">General Inquiry</option>
                    <option value="Financial Advisory">Financial Advisory</option>
                    <option value="Tax Optimization">Tax Optimization</option>
                    <option value="Investment Planning">Investment Planning</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                
                <div className="mb-6">
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">Message</label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    rows={5}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-transparent"
                    placeholder="How can we help you?"
                    required
                  ></textarea>
                </div>
                
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full px-6 py-3 bg-gradient-to-r from-gray-700 to-gray-900 text-white font-medium rounded-md shadow-md hover:from-gray-800 hover:to-gray-950 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-opacity-50 transition-all"
                >
                  {isSubmitting ? 'Sending...' : 'Send Message'}
                </button>
              </form>
            )}
          </motion.div>
          
          {/* Contact Information */}
          <div>
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="bg-white rounded-xl shadow-md p-8 border border-gray-100 mb-8"
            >
              <h2 className="text-2xl font-semibold text-gray-900 mb-6">Our Offices</h2>
              
              <div className="space-y-8">
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Berlin Headquarters</h3>
                  <p className="text-gray-600 mb-1">Friedrichstraße 123</p>
                  <p className="text-gray-600 mb-1">10117 Berlin, Germany</p>
                  <p className="text-gray-600 mb-1">+49 30 1234 5678</p>
                  <p className="text-gray-600 mb-1">berlin@novafinancial.com</p>
                </div>
                
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Munich Office</h3>
                  <p className="text-gray-600 mb-1">Maximilianstraße 45</p>
                  <p className="text-gray-600 mb-1">80539 Munich, Germany</p>
                  <p className="text-gray-600 mb-1">+49 89 9876 5432</p>
                  <p className="text-gray-600 mb-1">munich@novafinancial.com</p>
                </div>
                
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Frankfurt Office</h3>
                  <p className="text-gray-600 mb-1">Mainzer Landstraße 78</p>
                  <p className="text-gray-600 mb-1">60329 Frankfurt, Germany</p>
                  <p className="text-gray-600 mb-1">+49 69 8765 4321</p>
                  <p className="text-gray-600 mb-1">frankfurt@novafinancial.com</p>
                </div>
              </div>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="bg-white rounded-xl shadow-md p-8 border border-gray-100"
            >
              <h2 className="text-2xl font-semibold text-gray-900 mb-6">Follow Us</h2>
              <div className="flex space-x-4">
                <a href="#" className="w-12 h-12 bg-gradient-to-br from-gray-300 to-gray-500 rounded-full flex items-center justify-center text-white hover:from-gray-400 hover:to-gray-600 transition-all">
                  <Facebook size={20} />
                </a>
                <a href="#" className="w-12 h-12 bg-gradient-to-br from-gray-300 to-gray-500 rounded-full flex items-center justify-center text-white hover:from-gray-400 hover:to-gray-600 transition-all">
                  <Twitter size={20} />
                </a>
                <a href="#" className="w-12 h-12 bg-gradient-to-br from-gray-300 to-gray-500 rounded-full flex items-center justify-center text-white hover:from-gray-400 hover:to-gray-600 transition-all">
                  <Linkedin size={20} />
                </a>
              </div>
            </motion.div>
          </div>
        </div>
        
        {/* Map Placeholder */}
        <div className="mt-16 bg-gradient-to-r from-gray-100 to-gray-200 rounded-xl h-96 flex items-center justify-center shadow-md">
          <p className="text-gray-600 text-lg">Interactive Map Placeholder</p>
        </div>
        
        {/* FAQ Section */}
        <div className="mt-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Frequently Asked Questions</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
              <h3 className="text-xl font-semibold text-gray-900 mb-3">How does the initial consultation work?</h3>
              <p className="text-gray-600">
                Our initial consultation is free and can be conducted virtually. We'll discuss your financial situation, goals, and how our services can help you optimize your finances as a German expat.
              </p>
            </div>
            
            <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
              <h3 className="text-xl font-semibold text-gray-900 mb-3">What documents should I prepare?</h3>
              <p className="text-gray-600">
                For the most effective consultation, we recommend having your recent tax returns, investment statements, pension information, and any other relevant financial documents ready.
              </p>
            </div>
            
            <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
              <h3 className="text-xl font-semibold text-gray-900 mb-3">How much can I expect to save?</h3>
              <p className="text-gray-600">
                While savings vary based on individual circumstances, our clients typically save €10,000+ annually through our tax optimization strategies and investment recommendations.
              </p>
            </div>
            
            <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Do you offer ongoing support?</h3>
              <p className="text-gray-600">
                Yes, we provide continuous support through our dashboard, regular check-ins, and updates to your financial strategy as your situation evolves or as regulations change.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 