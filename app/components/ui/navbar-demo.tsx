import Link from 'next/link';
import { cn } from "@/lib/utils";

export function NavBarDemo() {
  return (
    <div className="fixed top-0 w-full z-50 bg-white/90 backdrop-blur-lg border-b border-gray-200 shadow-sm">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="flex h-20 items-center justify-between">
          {/* Logo - Enhanced with better gradient */}
          <Link href="/" className="flex items-center space-x-3 group">
            <span className="text-2xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent transition-all duration-300 group-hover:from-gray-900 group-hover:to-gray-700">Nova</span>
            <span className="text-base text-gray-500 transition-colors duration-300 group-hover:text-gray-700">Financial</span>
          </Link>

          {/* Navigation - Styled to match button feeling */}
          <nav className="hidden md:flex items-center space-x-8">
            <NavLink href="/about">About</NavLink>
            <NavLink href="/contact" className="bg-gradient-to-r from-gray-600 to-gray-800 text-white hover:from-gray-700 hover:to-gray-900 rounded-xl px-4 py-2 shadow-md transition-all duration-300">Contact</NavLink>
          </nav>
        </div>
      </div>
    </div>
  );
}

// Custom NavLink component for consistent styling
function NavLink({ href, className, children }: { href: string; className?: string; children: React.ReactNode }) {
  const baseStyles = "font-medium text-base transition-all duration-300 rounded-lg px-3 py-1.5";
  
  // Default styling for regular nav links
  const defaultStyles = "text-gray-600 hover:text-gray-900 hover:bg-gray-100";
  
  return (
    <Link 
      href={href} 
      className={cn(
        baseStyles,
        className || defaultStyles
      )}
    >
      {children}
    </Link>
  );
} 