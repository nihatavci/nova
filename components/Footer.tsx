'use client';

import Link from 'next/link';
import { Facebook, Twitter, Instagram, Linkedin, Mail, Phone, MapPin } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-gradient-to-r from-gray-700 via-gray-600 to-gray-700 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div>
            <h3 className="text-xl font-bold mb-4 text-yellow-400">Nova Financial</h3>
            <p className="text-gray-300 mb-4">
              Premium financial advisory services for German expats. Discover how to save €10k+ annually with our tailored solutions.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-300 hover:text-yellow-400 transition-colors">
                <Facebook size={20} />
              </a>
              <a href="#" className="text-gray-300 hover:text-yellow-400 transition-colors">
                <Twitter size={20} />
              </a>
              <a href="#" className="text-gray-300 hover:text-yellow-400 transition-colors">
                <Instagram size={20} />
              </a>
              <a href="#" className="text-gray-300 hover:text-yellow-400 transition-colors">
                <Linkedin size={20} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-xl font-bold mb-4 text-yellow-400">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-gray-300 hover:text-yellow-400 transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-gray-300 hover:text-yellow-400 transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/services" className="text-gray-300 hover:text-yellow-400 transition-colors">
                  Services
                </Link>
              </li>
              <li>
                <Link href="/calculator" className="text-gray-300 hover:text-yellow-400 transition-colors">
                  Financial Calculator
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-gray-300 hover:text-yellow-400 transition-colors">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Services */}
          <div>
            <h3 className="text-xl font-bold mb-4 text-yellow-400">Our Services</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/services#tax" className="text-gray-300 hover:text-yellow-400 transition-colors">
                  Tax Optimization
                </Link>
              </li>
              <li>
                <Link href="/services#investment" className="text-gray-300 hover:text-yellow-400 transition-colors">
                  Investment Planning
                </Link>
              </li>
              <li>
                <Link href="/services#pension" className="text-gray-300 hover:text-yellow-400 transition-colors">
                  Pension Planning
                </Link>
              </li>
              <li>
                <Link href="/services#mortgage" className="text-gray-300 hover:text-yellow-400 transition-colors">
                  Mortgage Advisory
                </Link>
              </li>
              <li>
                <Link href="/services#expat" className="text-gray-300 hover:text-yellow-400 transition-colors">
                  Expat Financial Services
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-xl font-bold mb-4 text-yellow-400">Contact Us</h3>
            <ul className="space-y-4">
              <li className="flex items-start">
                <MapPin size={20} className="text-yellow-400 mr-2 mt-1 flex-shrink-0" />
                <span className="text-gray-300">
                  Friedrichstraße 123<br />
                  10117 Berlin, Germany
                </span>
              </li>
              <li className="flex items-center">
                <Phone size={20} className="text-yellow-400 mr-2 flex-shrink-0" />
                <a href="tel:+4930123456789" className="text-gray-300 hover:text-yellow-400 transition-colors">
                  +49 30 123 456 789
                </a>
              </li>
              <li className="flex items-center">
                <Mail size={20} className="text-yellow-400 mr-2 flex-shrink-0" />
                <a href="mailto:info@nova-financial.de" className="text-gray-300 hover:text-yellow-400 transition-colors">
                  info@nova-financial.de
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-600 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-400 text-sm">
            © {new Date().getFullYear()} Nova Financial Advisory. All rights reserved.
          </p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <Link href="/privacy" className="text-gray-400 hover:text-yellow-400 text-sm transition-colors">
              Privacy Policy
            </Link>
            <Link href="/terms" className="text-gray-400 hover:text-yellow-400 text-sm transition-colors">
              Terms of Service
            </Link>
            <Link href="/imprint" className="text-gray-400 hover:text-yellow-400 text-sm transition-colors">
              Imprint
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
} 