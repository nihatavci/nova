"use client";

import Link from 'next/link';
import { useState } from 'react';
import { usePathname } from 'next/navigation';
import { FaAward, FaChartLine, FaShieldAlt, FaBars, FaTimes } from 'react-icons/fa';

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();
  
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };
  
  const isActive = (path: string) => {
    return pathname === path;
  };
  
  const navLinks = [
    { href: '/', label: 'Home' },
    { href: '/dashboard', label: 'Dashboard' },
    { href: '/calculator', label: 'Calculator' },
    { href: '/about', label: 'About' },
    { href: '/contact', label: 'Contact' },
    { href: '/api-docs', label: 'API Docs' }
  ];
  
  return (
    <nav className="bg-[#0A1E3C] shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20 items-center">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link href="/" className="flex items-center">
              <FaAward className="h-8 w-8 text-[#E5B94B]" />
              <span className="ml-2 text-xl font-bold text-white">Nova <span className="text-[#E5B94B]">Financial</span></span>
            </Link>
          </div>

          {/* Navigation Items - Desktop */}
          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`text-sm font-medium transition-colors duration-200 ${
                  isActive(link.href)
                    ? 'text-[#E5B94B] border-b-2 border-[#E5B94B] pb-1'
                    : 'text-gray-300 hover:text-[#E5B94B]'
                }`}
              >
                {link.label}
              </Link>
            ))}
            <button className="bg-gradient-to-r from-[#E5B94B] to-[#D4AF37] text-[#0A1E3C] px-4 py-2 rounded-md font-medium shadow-md hover:from-[#D4AF37] hover:to-[#C4A137] transition-all duration-300 flex items-center">
              <FaChartLine className="mr-2" />
              Get Started
            </button>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              type="button"
              onClick={toggleMenu}
              className="text-gray-300 hover:text-[#E5B94B] focus:outline-none"
              aria-label="Toggle menu"
            >
              {isMenuOpen ? (
                <FaTimes className="h-6 w-6" />
              ) : (
                <FaBars className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-[#0A1E3C] border-t border-[#1A2E4C]">
          <div className="px-2 pt-2 pb-3 space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`block px-3 py-2 rounded-md text-base font-medium ${
                  isActive(link.href)
                    ? 'text-[#E5B94B] bg-[#1A2E4C]'
                    : 'text-gray-300 hover:text-[#E5B94B] hover:bg-[#1A2E4C]'
                }`}
                onClick={toggleMenu}
              >
                {link.label}
              </Link>
            ))}
            <div className="px-3 py-3">
              <button className="w-full bg-gradient-to-r from-[#E5B94B] to-[#D4AF37] text-[#0A1E3C] px-4 py-2 rounded-md font-medium shadow-md hover:from-[#D4AF37] hover:to-[#C4A137] transition-all duration-300 flex items-center justify-center">
                <FaChartLine className="mr-2" />
                Get Started
              </button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
} 