import Link from 'next/link';
import Image from 'next/image';
import { 
  Shield, 
  Users, 
  TrendingUp, 
  FileText, 
  MessageSquare,
  Target,
  Award,
  Zap,
  Clock,
  CheckCircle,
  ChevronDown
} from 'lucide-react';

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white scroll-smooth">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-[#0A1E3C] to-[#15294D] text-white">
        <div className="container mx-auto py-12 sm:py-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 sm:mb-6">About Nova</h1>
            <p className="text-lg sm:text-xl text-white/90 mb-6 sm:mb-8 leading-relaxed">
              Empowering German expats with tailored financial solutions for a secure future.
            </p>
            <div className="flex justify-center">
              <div className="h-1 w-20 bg-[#FBD96D] rounded-full"></div>
            </div>
            
            {/* Mobile scroll indicator */}
            <div className="mt-8 sm:hidden animate-bounce flex justify-center">
              <ChevronDown className="text-white/70" />
            </div>
          </div>
        </div>
      </div>

      {/* Mission Section */}
      <div className="py-12 sm:py-20 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <div className="flex flex-col md:flex-row items-center gap-8 md:gap-12">
              <div className="w-full md:w-1/2 max-w-sm mx-auto md:max-w-none">
                <div className="bg-[#FBD96D] p-1 rounded-lg rotate-3 shadow-lg">
                  <div className="bg-white p-1 rounded-lg -rotate-6">
                    <div className="bg-[#0A1E3C] h-48 sm:h-64 rounded-lg flex items-center justify-center">
                      <Target size={60} className="text-[#FBD96D] sm:w-20 sm:h-20" />
                    </div>
                  </div>
                </div>
              </div>
              <div className="w-full md:w-1/2 mt-8 md:mt-0">
                <h2 className="text-2xl sm:text-3xl font-bold text-[#0A1E3C] mb-4 sm:mb-6">Our Mission</h2>
                <p className="text-gray-700 mb-4 sm:mb-6 leading-relaxed">
                  Our mission is to empower German expats to make informed financial decisions, optimize their tax situations,
                  and build wealth effectively while navigating the complexities of international finance.
                </p>
                <p className="text-gray-700 leading-relaxed">
                  We believe in transparency, personalization, and using cutting-edge technology to provide 
                  financial clarity and actionable insights without the industry jargon and hidden commissions.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Team Section */}
      <div className="py-12 sm:py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-10 sm:mb-16">
              <h2 className="text-2xl sm:text-3xl font-bold text-[#0A1E3C] mb-3 sm:mb-4">Meet Our Team</h2>
              <p className="text-gray-700 max-w-2xl mx-auto px-2">
                Our team of experts combines decades of experience in international finance with 
                cutting-edge technology to deliver exceptional financial advisory services.
              </p>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-8">
              {/* Founder Card */}
              <div className="bg-white rounded-xl shadow-lg overflow-hidden transition-transform hover:scale-105 mx-auto w-full max-w-sm sm:max-w-none">
                <div className="h-36 sm:h-48 bg-gradient-to-r from-[#0A1E3C] to-[#15294D] relative">
                  <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2">
                    <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full border-4 border-white bg-[#FBD96D] flex items-center justify-center">
                      <span className="text-[#0A1E3C] font-bold text-xl">MW</span>
                    </div>
                  </div>
                </div>
                <div className="pt-12 sm:pt-16 pb-6 sm:pb-8 px-4 sm:px-6 text-center">
                  <h3 className="text-lg sm:text-xl font-bold text-[#0A1E3C] mb-1">Dr. Marcus Weber</h3>
                  <p className="text-[#FBD96D] font-medium mb-3 sm:mb-4">Founder & Lead Financial Advisor</p>
                  <p className="text-gray-600 text-sm sm:text-base">
                    With over 15 years of experience in international finance and tax optimization for German expatriates,
                    Dr. Weber founded Nova to provide clear, actionable financial guidance.
                  </p>
                </div>
              </div>
              
              {/* Team Member Card */}
              <div className="bg-white rounded-xl shadow-lg overflow-hidden transition-transform hover:scale-105 mx-auto w-full max-w-sm sm:max-w-none">
                <div className="h-36 sm:h-48 bg-gradient-to-r from-[#0A1E3C] to-[#15294D] relative">
                  <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2">
                    <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full border-4 border-white bg-[#FBD96D] flex items-center justify-center">
                      <span className="text-[#0A1E3C] font-bold text-xl">SL</span>
                    </div>
                  </div>
                </div>
                <div className="pt-12 sm:pt-16 pb-6 sm:pb-8 px-4 sm:px-6 text-center">
                  <h3 className="text-lg sm:text-xl font-bold text-[#0A1E3C] mb-1">Sophie Lehmann</h3>
                  <p className="text-[#FBD96D] font-medium mb-3 sm:mb-4">Senior Tax Specialist</p>
                  <p className="text-gray-600 text-sm sm:text-base">
                    Sophie specializes in cross-border taxation for German expats, helping clients navigate 
                    complex tax regulations and identify optimization opportunities.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Why Choose Us Section */}
      <div className="py-12 sm:py-20 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-10 sm:mb-16">
              <h2 className="text-2xl sm:text-3xl font-bold text-[#0A1E3C] mb-3 sm:mb-4">Why Choose Nova?</h2>
              <p className="text-gray-700 max-w-2xl mx-auto px-2">
                We combine expertise, technology, and personalized service to deliver exceptional value.
              </p>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-8">
              <div className="bg-white p-6 sm:p-8 rounded-xl shadow-md hover:shadow-lg transition-shadow">
                <div className="w-12 h-12 bg-[#FBD96D] rounded-lg flex items-center justify-center mb-4 sm:mb-6">
                  <Shield className="text-[#0A1E3C]" size={20} />
                </div>
                <h3 className="text-lg sm:text-xl font-bold text-[#0A1E3C] mb-2 sm:mb-3">Specialized Expertise</h3>
                <p className="text-gray-600 text-sm sm:text-base">
                  Our advisors specialize in cross-border financial planning specifically for German expats, 
                  understanding the unique challenges and opportunities.
                </p>
              </div>
              
              <div className="bg-white p-6 sm:p-8 rounded-xl shadow-md hover:shadow-lg transition-shadow">
                <div className="w-12 h-12 bg-[#FBD96D] rounded-lg flex items-center justify-center mb-4 sm:mb-6">
                  <Users className="text-[#0A1E3C]" size={20} />
                </div>
                <h3 className="text-lg sm:text-xl font-bold text-[#0A1E3C] mb-2 sm:mb-3">Personalized Approach</h3>
                <p className="text-gray-600 text-sm sm:text-base">
                  We provide tailored advice based on your unique financial situation, goals, and risk tolerance,
                  ensuring solutions that fit your specific needs.
                </p>
              </div>
              
              <div className="bg-white p-6 sm:p-8 rounded-xl shadow-md hover:shadow-lg transition-shadow">
                <div className="w-12 h-12 bg-[#FBD96D] rounded-lg flex items-center justify-center mb-4 sm:mb-6">
                  <TrendingUp className="text-[#0A1E3C]" size={20} />
                </div>
                <h3 className="text-lg sm:text-xl font-bold text-[#0A1E3C] mb-2 sm:mb-3">AI-Powered Analysis</h3>
                <p className="text-gray-600 text-sm sm:text-base">
                  Our advanced algorithms analyze your financial data to identify optimization opportunities
                  and provide data-driven recommendations.
                </p>
              </div>
              
              <div className="bg-white p-6 sm:p-8 rounded-xl shadow-md hover:shadow-lg transition-shadow">
                <div className="w-12 h-12 bg-[#FBD96D] rounded-lg flex items-center justify-center mb-4 sm:mb-6">
                  <FileText className="text-[#0A1E3C]" size={20} />
                </div>
                <h3 className="text-lg sm:text-xl font-bold text-[#0A1E3C] mb-2 sm:mb-3">Comprehensive Reports</h3>
                <p className="text-gray-600 text-sm sm:text-base">
                  Receive detailed PDF reports with actionable recommendations and clear explanations
                  of complex financial concepts in plain language.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Our Process Section - Mobile Optimized */}
      <div className="py-12 sm:py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-10 sm:mb-16">
              <h2 className="text-2xl sm:text-3xl font-bold text-[#0A1E3C] mb-3 sm:mb-4">Our Process</h2>
              <p className="text-gray-700 max-w-2xl mx-auto px-2">
                A streamlined approach to optimizing your financial future.
              </p>
            </div>
            
            {/* Mobile Process Steps (Vertical Cards) */}
            <div className="md:hidden space-y-4">
              <div className="bg-white p-6 rounded-xl shadow-md">
                <div className="flex items-center mb-4">
                  <div className="flex-shrink-0 flex items-center justify-center w-8 h-8 rounded-full bg-[#FBD96D] text-[#0A1E3C] font-bold mr-4">1</div>
                  <h3 className="text-lg font-bold text-[#0A1E3C]">Information Gathering</h3>
                </div>
                <p className="text-gray-600 text-sm">
                  Complete our comprehensive multi-step form to provide details about your financial situation.
                </p>
              </div>
              
              <div className="bg-white p-6 rounded-xl shadow-md">
                <div className="flex items-center mb-4">
                  <div className="flex-shrink-0 flex items-center justify-center w-8 h-8 rounded-full bg-[#FBD96D] text-[#0A1E3C] font-bold mr-4">2</div>
                  <h3 className="text-lg font-bold text-[#0A1E3C]">AI Analysis</h3>
                </div>
                <p className="text-gray-600 text-sm">
                  Our system analyzes your data to identify optimization opportunities and create personalized recommendations.
                </p>
              </div>
              
              <div className="bg-white p-6 rounded-xl shadow-md">
                <div className="flex items-center mb-4">
                  <div className="flex-shrink-0 flex items-center justify-center w-8 h-8 rounded-full bg-[#FBD96D] text-[#0A1E3C] font-bold mr-4">3</div>
                  <h3 className="text-lg font-bold text-[#0A1E3C]">Report Generation</h3>
                </div>
                <p className="text-gray-600 text-sm">
                  Receive a detailed PDF report with personalized recommendations and actionable insights.
                </p>
              </div>
              
              <div className="bg-white p-6 rounded-xl shadow-md">
                <div className="flex items-center mb-4">
                  <div className="flex-shrink-0 flex items-center justify-center w-8 h-8 rounded-full bg-[#FBD96D] text-[#0A1E3C] font-bold mr-4">4</div>
                  <h3 className="text-lg font-bold text-[#0A1E3C]">Implementation Support</h3>
                </div>
                <p className="text-gray-600 text-sm">
                  Track your progress and receive guidance on implementing recommendations through our platform.
                </p>
              </div>
              
              <div className="bg-white p-6 rounded-xl shadow-md">
                <div className="flex items-center mb-4">
                  <div className="flex-shrink-0 flex items-center justify-center w-8 h-8 rounded-full bg-[#FBD96D] text-[#0A1E3C] font-bold mr-4">5</div>
                  <h3 className="text-lg font-bold text-[#0A1E3C]">Ongoing Optimization</h3>
                </div>
                <p className="text-gray-600 text-sm">
                  Regular updates and adjustments to your financial strategy as your situation evolves.
                </p>
              </div>
            </div>
            
            {/* Desktop Process Steps (Timeline) */}
            <div className="hidden md:block relative">
              {/* Vertical line */}
              <div className="absolute left-1/2 top-0 bottom-0 w-0.5 bg-[#FBD96D] transform -translate-x-1/2"></div>
              
              {/* Process Steps */}
              <div className="space-y-12">
                <div className="relative flex items-start">
                  <div className="flex-shrink-0 z-10 flex items-center justify-center w-8 h-8 rounded-full bg-[#FBD96D] text-[#0A1E3C] font-bold"></div>
                  <div className="w-1/2 pr-12 text-right mr-auto">
                    <div className="bg-white p-6 rounded-xl shadow-md">
                      <h3 className="text-xl font-bold text-[#0A1E3C] mb-2">Information Gathering</h3>
                      <p className="text-gray-600">
                        Complete our comprehensive multi-step form to provide details about your financial situation.
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="relative flex items-start">
                  <div className="flex-shrink-0 z-10 flex items-center justify-center w-8 h-8 rounded-full bg-[#FBD96D] text-[#0A1E3C] font-bold ml-auto order-2"></div>
                  <div className="w-1/2 pl-12 text-left ml-auto order-1">
                    <div className="bg-white p-6 rounded-xl shadow-md">
                      <h3 className="text-xl font-bold text-[#0A1E3C] mb-2">AI Analysis</h3>
                      <p className="text-gray-600">
                        Our system analyzes your data to identify optimization opportunities and create personalized recommendations.
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="relative flex items-start">
                  <div className="flex-shrink-0 z-10 flex items-center justify-center w-8 h-8 rounded-full bg-[#FBD96D] text-[#0A1E3C] font-bold"></div>
                  <div className="w-1/2 pr-12 text-right mr-auto">
                    <div className="bg-white p-6 rounded-xl shadow-md">
                      <h3 className="text-xl font-bold text-[#0A1E3C] mb-2">Report Generation</h3>
                      <p className="text-gray-600">
                        Receive a detailed PDF report with personalized recommendations and actionable insights.
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="relative flex items-start">
                  <div className="flex-shrink-0 z-10 flex items-center justify-center w-8 h-8 rounded-full bg-[#FBD96D] text-[#0A1E3C] font-bold ml-auto order-2"></div>
                  <div className="w-1/2 pl-12 text-left ml-auto order-1">
                    <div className="bg-white p-6 rounded-xl shadow-md">
                      <h3 className="text-xl font-bold text-[#0A1E3C] mb-2">Implementation Support</h3>
                      <p className="text-gray-600">
                        Track your progress and receive guidance on implementing recommendations through our platform.
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="relative flex items-start">
                  <div className="flex-shrink-0 z-10 flex items-center justify-center w-8 h-8 rounded-full bg-[#FBD96D] text-[#0A1E3C] font-bold"></div>
                  <div className="w-1/2 pr-12 text-right mr-auto">
                    <div className="bg-white p-6 rounded-xl shadow-md">
                      <h3 className="text-xl font-bold text-[#0A1E3C] mb-2">Ongoing Optimization</h3>
                      <p className="text-gray-600">
                        Regular updates and adjustments to your financial strategy as your situation evolves.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-12 sm:py-16 bg-gradient-to-r from-[#0A1E3C] to-[#15294D] text-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-2xl sm:text-3xl font-bold mb-4 sm:mb-6">Ready to optimize your finances?</h2>
            <p className="text-base sm:text-xl text-white/80 mb-6 sm:mb-8 max-w-2xl mx-auto">
              Take the first step toward financial clarity and optimization by using our retirement calculator.
            </p>
            <Link 
              href="/" 
              className="inline-flex items-center justify-center px-6 sm:px-8 py-3 bg-[#FBD96D] text-[#0A1E3C] text-base sm:text-lg font-medium rounded-md hover:bg-[#E5B94B] transition-colors shadow-lg"
            >
              Get Started
            </Link>
          </div>
        </div>
      </div>
      
      {/* Back to top button - Mobile only */}
      <div className="fixed bottom-4 right-4 sm:hidden">
        <a 
          href="#" 
          className="bg-[#0A1E3C] text-white p-3 rounded-full shadow-lg opacity-70 hover:opacity-100 transition-opacity"
          aria-label="Back to top"
        >
          <ChevronDown className="transform rotate-180" size={20} />
        </a>
      </div>
    </div>
  );
} 