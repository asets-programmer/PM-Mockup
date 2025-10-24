import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Menu, X, ChevronDown, MessageSquare } from 'lucide-react';
import storiLogo from '/assets/Stori.jpg';
import { useLanguage } from '../contexts/LanguageContext';
import { languageContent } from '../data/languageContent';

export default function PropertyDashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [displayedText, setDisplayedText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);
  const navigate = useNavigate();
  const { language, changeLanguage } = useLanguage();
  const content = languageContent[language];

  const fullText = `${content.heroTitle}\n${content.heroSubtitle}\n${content.heroDescription}`;

  // Typing animation effect with smooth loop
  useEffect(() => {
    if (currentIndex < fullText.length) {
      const timeout = setTimeout(() => {
        setDisplayedText(prev => prev + fullText[currentIndex]);
        setCurrentIndex(prev => prev + 1);
      }, 80); // Faster typing speed

      return () => clearTimeout(timeout);
    } else {
      // When typing is complete, wait 3 seconds then smoothly restart
      const restartTimeout = setTimeout(() => {
        // Smooth fade out effect
        setDisplayedText('');
        setCurrentIndex(0);
      }, 3000);

      return () => clearTimeout(restartTimeout);
    }
  }, [currentIndex, fullText]);

  // Reset typing animation when language changes
  useEffect(() => {
    setDisplayedText('');
    setCurrentIndex(0);
  }, [language]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      // Don't close if clicking on dropdown buttons or dropdown content
      if (event.target.closest('[data-dropdown]') || event.target.closest('.dropdown-container')) {
        return;
      }
      setActiveDropdown(null);
    };

    if (activeDropdown) {
      document.addEventListener('click', handleClickOutside);
      return () => document.removeEventListener('click', handleClickOutside);
    }
  }, [activeDropdown]);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar */}
      <nav className="bg-white border-b border-gray-200 fixed w-full z-30 top-0">
        <div className="px-4 sm:px-6 lg:px-20 py-3">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <div className="flex items-center">
              <img 
                src={storiLogo} 
                alt="Stori Logo" 
                className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 rounded-lg object-cover"
              />
              <div className="ml-2 sm:ml-3">
                <span className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900">STORI</span>
                <div className="text-xs sm:text-sm font-medium text-gray-600">System Monitoring</div>
              </div>
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden">
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="text-gray-600 hover:text-gray-900 p-2"
              >
                <Menu className="w-6 h-6" />
              </button>
            </div>

            {/* Navigation Menu - Desktop */}
            <div className="hidden md:flex items-center space-x-4 lg:space-x-8">
              <div className="relative group">
                <button className="flex items-center text-gray-700 hover:text-gray-900 transition-colors">
                  {content.productsServices} <ChevronDown className="ml-1 w-4 h-4 transition-transform group-hover:rotate-180" />
                </button>
                
                {/* Products & Services Dropdown */}
                <div className="absolute top-full left-0 mt-3 w-72 bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl border border-gray-200/50 py-4 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
                  <div className="px-2">
                    <a
                      href="/ai-document-generator"
                      className="flex items-center px-4 py-3 text-gray-700 hover:bg-gradient-to-r hover:from-indigo-50 hover:to-purple-50 hover:text-indigo-600 transition-all duration-200 rounded-xl group/item"
                    >
                      <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center mr-3 group-hover/item:scale-110 transition-transform">
                        <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                      </div>
                      <div>
                        <div className="font-semibold">AI Document Generator</div>
                        <div className="text-xs text-gray-500">Smart document creation</div>
                      </div>
                    </a>
                    <a
                      href="/ai-maintenance-consultant"
                      className="flex items-center px-4 py-3 text-gray-700 hover:bg-gradient-to-r hover:from-indigo-50 hover:to-purple-50 hover:text-indigo-600 transition-all duration-200 rounded-xl group/item"
                    >
                      <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg flex items-center justify-center mr-3 group-hover/item:scale-110 transition-transform">
                        <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                        </svg>
                      </div>
                      <div>
                        <div className="font-semibold">AI Maintenance Consultant</div>
                        <div className="text-xs text-gray-500">Intelligent maintenance advice</div>
                      </div>
                    </a>
                  </div>
                </div>
              </div>
              
              <div className="relative group">
                <button className="flex items-center text-gray-700 hover:text-gray-900 transition-colors">
                  {content.solutions} <ChevronDown className="ml-1 w-4 h-4 transition-transform group-hover:rotate-180" />
                </button>
                
                {/* Solutions Dropdown */}
                <div className="absolute top-full left-0 mt-3 w-72 bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl border border-gray-200/50 py-4 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
                  <div className="px-2">
                    <a
                      href="/stori-spbu"
                      className="flex items-center px-4 py-3 text-gray-700 hover:bg-gradient-to-r hover:from-indigo-50 hover:to-purple-50 hover:text-indigo-600 transition-all duration-200 rounded-xl group/item"
                    >
                      <div className="w-8 h-8 bg-gradient-to-br from-orange-500 to-red-600 rounded-lg flex items-center justify-center mr-3 group-hover/item:scale-110 transition-transform">
                        <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                        </svg>
                      </div>
                      <div>
                        <div className="font-semibold">STORI for SPBU</div>
                        <div className="text-xs text-gray-500">Fuel station management</div>
                      </div>
                    </a>
                    <a
                      href="/custom-stori"
                      className="flex items-center px-4 py-3 text-gray-700 hover:bg-gradient-to-r hover:from-indigo-50 hover:to-purple-50 hover:text-indigo-600 transition-all duration-200 rounded-xl group/item"
                    >
                      <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-600 rounded-lg flex items-center justify-center mr-3 group-hover/item:scale-110 transition-transform">
                        <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                      </div>
                      <div>
                        <div className="font-semibold">Custom STORI</div>
                        <div className="text-xs text-gray-500">Tailored solutions</div>
                      </div>
                    </a>
                  </div>
                </div>
              </div>
              
              <div className="relative group">
                <button className="flex items-center text-gray-700 hover:text-gray-900 transition-colors">
                  {content.pricing} <ChevronDown className="ml-1 w-4 h-4 transition-transform group-hover:rotate-180" />
                </button>
                
                {/* Pricing Dropdown */}
                <div className="absolute top-full left-0 mt-3 w-72 bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl border border-gray-200/50 py-4 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
                  <div className="px-2">
                    <a
                      href="/product-pricelist"
                      className="flex items-center px-4 py-3 text-gray-700 hover:bg-gradient-to-r hover:from-indigo-50 hover:to-purple-50 hover:text-indigo-600 transition-all duration-200 rounded-xl group/item"
                    >
                      <div className="w-8 h-8 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-lg flex items-center justify-center mr-3 group-hover/item:scale-110 transition-transform">
                        <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                        </svg>
                      </div>
                      <div>
                        <div className="font-semibold">Product Pricelist</div>
                        <div className="text-xs text-gray-500">Standard pricing plans</div>
                      </div>
                    </a>
                    <a
                      href="/custom-solution-pricing"
                      className="flex items-center px-4 py-3 text-gray-700 hover:bg-gradient-to-r hover:from-indigo-50 hover:to-purple-50 hover:text-indigo-600 transition-all duration-200 rounded-xl group/item"
                    >
                      <div className="w-8 h-8 bg-gradient-to-br from-amber-500 to-orange-600 rounded-lg flex items-center justify-center mr-3 group-hover/item:scale-110 transition-transform">
                        <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                        </svg>
                      </div>
                      <div>
                        <div className="font-semibold">Custom Solution Pricing</div>
                        <div className="text-xs text-gray-500">Personalized quotes</div>
                      </div>
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Side - Desktop */}
            <div className="hidden md:flex items-center space-x-2 lg:space-x-4">
              <div className="relative" data-dropdown>
                <button 
                  onClick={() => setActiveDropdown(activeDropdown === 'language' ? null : 'language')}
                  className="flex items-center text-gray-600 hover:text-gray-900 w-16 lg:w-20 justify-center text-sm lg:text-base"
                >
                  <span className="mr-1">🌐</span> {language} <ChevronDown className="ml-1 w-3 h-3 lg:w-4 lg:h-4" />
                </button>
                
                {/* Language Dropdown */}
                {activeDropdown === 'language' && (
                  <div className="absolute top-full right-0 mt-2 w-32 bg-white rounded-xl shadow-xl border border-gray-100 py-2 animate-in fade-in-0 zoom-in-95 duration-200">
                    <button
                      onClick={() => {
                        changeLanguage('ENG');
                        setActiveDropdown(null);
                      }}
                      className={`block w-full text-left px-4 py-2 text-sm transition-colors duration-200 ${
                        language === 'ENG' ? 'bg-indigo-50 text-indigo-600' : 'text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      English
                    </button>
                    <button
                      onClick={() => {
                        changeLanguage('ID');
                        setActiveDropdown(null);
                      }}
                      className={`block w-full text-left px-4 py-2 text-sm transition-colors duration-200 ${
                        language === 'ID' ? 'bg-indigo-50 text-indigo-600' : 'text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      Indonesia
                    </button>
                  </div>
                )}
              </div>
              <button 
                onClick={() => navigate('/login')}
                className="text-white px-3 lg:px-6 py-2 lg:py-3 rounded-full transition-colors text-sm lg:text-base"
                style={{backgroundColor: '#3730A3'}}
                onMouseEnter={(e) => e.target.style.backgroundColor = '#312E81'}
                onMouseLeave={(e) => e.target.style.backgroundColor = '#3730A3'}
              >
                {content.login}
              </button>
              <button className="bg-green-500 text-white px-3 lg:px-6 py-2 lg:py-3 rounded-full flex items-center hover:bg-green-600 transition-colors text-sm lg:text-base">
                <svg className="w-4 h-4 lg:w-5 lg:h-5 mr-1 lg:mr-2" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488"/>
                </svg>
                <span className="hidden lg:inline">{content.contactUs}</span>
              </button>
            </div>
          </div>
        </div>
        {/* Mobile Menu */}
        {sidebarOpen && (
          <div className="md:hidden fixed inset-0 z-40 bg-black bg-opacity-50" onClick={() => setSidebarOpen(false)}>
            <div className="absolute right-0 top-0 h-full w-80 bg-white shadow-xl" onClick={(e) => e.stopPropagation()}>
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center">
                    <img 
                      src={storiLogo} 
                      alt="Stori Logo" 
                      className="w-8 h-8 rounded-lg object-cover"
                    />
                    <span className="ml-2 text-lg font-bold text-gray-900">STORI</span>
                  </div>
                  <button
                    onClick={() => setSidebarOpen(false)}
                    className="text-gray-600 hover:text-gray-900"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>
                
                {/* Mobile Navigation */}
                <div className="space-y-4">
                  <div className="space-y-2">
                    <div className="text-sm font-medium text-gray-500 uppercase tracking-wider">{content.productsServices}</div>
                    <a href="/ai-document-generator" className="block py-2 text-gray-700 hover:text-indigo-600">AI Document Generator</a>
                    <a href="/ai-maintenance-consultant" className="block py-2 text-gray-700 hover:text-indigo-600">AI Maintenance Consultant</a>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="text-sm font-medium text-gray-500 uppercase tracking-wider">{content.solutions}</div>
                    <a href="/stori-spbu" className="block py-2 text-gray-700 hover:text-indigo-600">STORI for SPBU</a>
                    <a href="/custom-stori" className="block py-2 text-gray-700 hover:text-indigo-600">Custom STORI</a>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="text-sm font-medium text-gray-500 uppercase tracking-wider">{content.pricing}</div>
                    <a href="/product-pricelist" className="block py-2 text-gray-700 hover:text-indigo-600">Product Pricelist</a>
                    <a href="/custom-solution-pricing" className="block py-2 text-gray-700 hover:text-indigo-600">Custom Solution Pricing</a>
                  </div>
                </div>
                
                {/* Mobile Language & Login */}
                <div className="mt-8 space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Language:</span>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => {
                          changeLanguage('ENG');
                          setSidebarOpen(false);
                        }}
                        className={`px-3 py-1 rounded text-sm ${language === 'ENG' ? 'bg-indigo-100 text-indigo-600' : 'text-gray-600'}`}
                      >
                        ENG
                      </button>
                      <button
                        onClick={() => {
                          changeLanguage('ID');
                          setSidebarOpen(false);
                        }}
                        className={`px-3 py-1 rounded text-sm ${language === 'ID' ? 'bg-indigo-100 text-indigo-600' : 'text-gray-600'}`}
                      >
                        ID
                      </button>
                    </div>
                  </div>
                  
                  <button 
                    onClick={() => {
                      navigate('/login');
                      setSidebarOpen(false);
                    }}
                    className="w-full text-white px-4 py-3 rounded-lg transition-colors"
                    style={{backgroundColor: '#3730A3'}}
                  >
                    {content.login}
                  </button>
                  
                  <button className="w-full bg-green-500 text-white px-4 py-3 rounded-lg flex items-center justify-center hover:bg-green-600 transition-colors">
                    <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488"/>
                    </svg>
                    {content.contactUs}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <div className="relative bg-gradient-to-br from-indigo-900 via-indigo-800 to-indigo-900 pt-16 sm:pt-20">
        {/* Building Background Image */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-20"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80')`
          }}
        ></div>
        {/* Content */}
        <div className="relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 sm:pt-12 lg:pt-20 pb-12 sm:pb-16 lg:pb-20 text-center">
          <div className="mb-4 min-h-[150px] sm:min-h-[180px] lg:min-h-[200px] flex flex-col items-center justify-center">
            <div className="whitespace-pre-line transition-all duration-300 ease-in-out text-center">
              <div className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white">
                {displayedText.split('\n')[0]}
                <span className="animate-pulse">|</span>
              </div>
              {displayedText.split('\n').slice(1).map((line, index) => (
                <div key={index} className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-semibold text-white mt-1 sm:mt-2">
                  {line}
                </div>
              ))}
            </div>
          </div>
          <p className="text-base sm:text-lg lg:text-xl text-indigo-100 mb-6 sm:mb-8 px-4">
            {content.heroText.split('\n').map((line, index) => (
              <React.Fragment key={index}>
                {line}
                {index < content.heroText.split('\n').length - 1 && <br />}
              </React.Fragment>
            ))}
          </p>

          {/* AI Assistant Banner */}
          <div className="max-w-4xl mx-auto mt-8 sm:mt-12 lg:mt-16 mb-8 sm:mb-10 lg:mb-12">
            <div className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-xl">
              <div className="flex flex-col sm:flex-row items-center justify-between space-y-4 sm:space-y-0">
                {/* Left Side - AI Assistant Info */}
                <div className="flex items-center space-x-3 sm:space-x-4">
                  <div className="relative">
                    <div className="w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 bg-white rounded-full flex items-center justify-center">
                      <div className="w-10 h-10 sm:w-11 sm:h-11 lg:w-12 lg:h-12 rounded-full flex items-center justify-center relative overflow-hidden">
                        <img 
                          src="/assets/llama.gif" 
                          alt="STORI AI Assistant" 
                          className="w-full h-full object-cover rounded-full"
                        />
                      </div>
                    </div>
                    <div className="absolute -top-1 -right-1 w-3 h-3 sm:w-4 sm:h-4 bg-green-500 rounded-full border-2 border-white"></div>
                  </div>
                  <div>
                    <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900 mb-1">{content.aiAssistantTitle}</h3>
                    <p className="text-gray-600 text-xs sm:text-sm flex items-center">
                      <span className="w-2 h-2 bg-white-600 rounded-full mr-2"></span>
                      {content.aiAssistantSubtitle}
                    </p>
                  </div>
                </div>

                {/* Right Side - Ask Section */}
                <div className="flex items-center space-x-2 sm:space-x-4">
                  <div className="text-center sm:text-right">
                    <p className="text-gray-600 text-xs sm:text-sm">{content.askAbout}</p>
                    <p className="text-gray-900 font-semibold text-sm sm:text-base lg:text-lg">{content.maintenanceOperations}</p>
                  </div>
                </div>
              </div>
              
              {/* Input Placeholder */}
              <div className="mt-4 sm:mt-6">
                <div className="relative">
                  <input 
                    type="text" 
                    placeholder={content.askPlaceholder} 
                    className="w-full px-3 sm:px-4 py-2 sm:py-3 pr-20 sm:pr-24 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-gray-600 bg-gray-50 text-sm sm:text-base"
                    disabled
                  />
                  <button 
                    onClick={() => navigate('/login')}
                    className="absolute right-1 sm:right-2 top-1/2 transform -translate-y-1/2 text-white px-2 sm:px-4 py-1 sm:py-2 rounded-md font-semibold text-xs sm:text-sm hover:opacity-90 transition-colors flex items-center shadow-sm" 
                    style={{backgroundColor: '#3730a3'}}
                  >
                    <span className="hidden sm:inline">{content.loginToChat}</span>
                    <span className="sm:hidden">Login</span>
                    <svg className="w-3 h-3 sm:w-4 sm:h-4 ml-1 sm:ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                </div>
                <p className="text-gray-500 text-xs mt-2">{content.loginRequired}</p>
              </div>
            </div>
          </div>

          {/* Freemium Popular Features */}
          <div className="max-w-6xl mx-auto mb-12 sm:mb-16">
            <div className="text-center mb-6 sm:mb-8">
              <div className="inline-flex items-center bg-green-100 text-green-800 text-xs sm:text-sm font-medium px-3 py-1 rounded-full mb-4">
                <svg className="w-3 h-3 sm:w-4 sm:h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                {content.freeFeatures}
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4">{content.freemiumTitle}</h2>
              <p className="text-base sm:text-lg text-indigo-100 px-4">{content.freemiumDescription}</p>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {/* AI Maintenance Consultant */}
              <div className="bg-gradient-to-br from-cyan-500/20 to-cyan-600/20 backdrop-blur-sm rounded-lg sm:rounded-xl p-4 sm:p-6 hover:from-cyan-500/30 hover:to-cyan-600/30 transition-all cursor-pointer group border border-cyan-400/30">
                <div className="flex items-center justify-between mb-3 sm:mb-4">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-cyan-500 rounded-lg flex items-center justify-center">
                    <svg className="w-5 h-5 sm:w-6 sm:h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                    </svg>
                  </div>
                  <svg className="w-4 h-4 sm:w-5 sm:h-5 text-white group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
                <h3 className="text-white font-bold text-base sm:text-lg mb-2">{content.aiMaintenanceConsultant}</h3>
                <p className="text-indigo-200 text-xs sm:text-sm">{content.aiMaintenanceConsultantDesc}</p>
              </div>

              {/* AI Document Generator */}
              <div 
                onClick={() => navigate('/ai-document-generator')}
                className="bg-gradient-to-br from-lime-500/20 to-lime-600/20 backdrop-blur-sm rounded-lg sm:rounded-xl p-4 sm:p-6 hover:from-lime-500/30 hover:to-lime-600/30 transition-all cursor-pointer group border border-lime-400/30"
              >
                <div className="flex items-center justify-between mb-3 sm:mb-4">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-lime-500 rounded-lg flex items-center justify-center">
                    <svg className="w-5 h-5 sm:w-6 sm:h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <svg className="w-4 h-4 sm:w-5 sm:h-5 text-white group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
                <h3 className="text-white font-bold text-base sm:text-lg mb-2">{content.aiDocumentGenerator}</h3>
                <p className="text-indigo-200 text-xs sm:text-sm">{content.aiDocumentGeneratorDesc}</p>
              </div>

              {/* Basic Maintenance Report Viewer */}
              <div className="bg-gradient-to-br from-pink-500/20 to-pink-600/20 backdrop-blur-sm rounded-lg sm:rounded-xl p-4 sm:p-6 hover:from-pink-500/30 hover:to-pink-600/30 transition-all cursor-pointer group border border-pink-400/30">
                <div className="flex items-center justify-between mb-3 sm:mb-4">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-pink-500 rounded-lg flex items-center justify-center">
                    <svg className="w-5 h-5 sm:w-6 sm:h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  </div>
                  <svg className="w-4 h-4 sm:w-5 sm:h-5 text-white group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
                <h3 className="text-white font-bold text-base sm:text-lg mb-2">{content.basicMaintenanceReport}</h3>
                <p className="text-indigo-200 text-xs sm:text-sm">{content.basicMaintenanceReportDesc}</p>
              </div>
            </div>
          </div>

          {/* Advance STORI for All Business */}
          <div className="max-w-6xl mx-auto mb-12 sm:mb-16">
            <div className="text-center mb-6 sm:mb-8">
              <div className="inline-flex items-center bg-gradient-to-r from-yellow-400 to-orange-500 text-white text-xs sm:text-sm font-bold px-3 sm:px-4 py-1 sm:py-2 rounded-full mb-4 shadow-lg">
                <svg className="w-3 h-3 sm:w-4 sm:h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
                {content.premiumFeatures}
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4">{content.advanceStoriTitle}</h2>
              <p className="text-base sm:text-lg text-indigo-100 px-4">{content.advanceStoriDescription}</p>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {/* Dashboard Monitoring */}
              <div className="bg-gradient-to-br from-indigo-500/30 to-purple-600/30 backdrop-blur-sm rounded-xl p-6 hover:from-indigo-500/40 hover:to-purple-600/40 transition-all cursor-pointer group border border-indigo-400/40 shadow-xl">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center shadow-lg">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                  </div>
                  <svg className="w-5 h-5 text-white group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
                <h3 className="text-white font-bold text-lg mb-2">{content.dashboardMonitoring}</h3>
                <p className="text-indigo-200 text-sm">{content.dashboardMonitoringDesc}</p>
              </div>

              {/* Auto Scheduling & Smart Notification */}
              <div className="bg-gradient-to-br from-emerald-500/30 to-teal-600/30 backdrop-blur-sm rounded-xl p-6 hover:from-emerald-500/40 hover:to-teal-600/40 transition-all cursor-pointer group border border-emerald-400/40 shadow-xl">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-lg flex items-center justify-center shadow-lg">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <svg className="w-5 h-5 text-white group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
                <h3 className="text-white font-bold text-lg mb-2">{content.autoScheduling}</h3>
                <p className="text-indigo-200 text-sm">{content.autoSchedulingDesc}</p>
              </div>

              {/* Task & Assignment Management */}
              <div className="bg-gradient-to-br from-violet-500/30 to-purple-600/30 backdrop-blur-sm rounded-xl p-6 hover:from-violet-500/40 hover:to-purple-600/40 transition-all cursor-pointer group border border-violet-400/40 shadow-xl">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-violet-500 to-purple-600 rounded-lg flex items-center justify-center shadow-lg">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                    </svg>
                  </div>
                  <svg className="w-5 h-5 text-white group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
                <h3 className="text-white font-bold text-lg mb-2">{content.taskManagement}</h3>
                <p className="text-indigo-200 text-sm">{content.taskManagementDesc}</p>
              </div>

              {/* Centered row: Predictive + Integration */}
              <div className="lg:col-span-3 flex flex-col md:flex-row justify-center gap-6">
                {/* Predictive Analytics Engine */}
                <div className="bg-gradient-to-br from-amber-500/30 to-orange-600/30 backdrop-blur-sm rounded-xl p-6 hover:from-amber-500/40 hover:to-orange-600/40 transition-all cursor-pointer group w-full md:w-auto md:max-w-sm border border-amber-400/40 shadow-xl">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-amber-500 to-orange-600 rounded-lg flex items-center justify-center shadow-lg">
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                      </svg>
                    </div>
                    <svg className="w-5 h-5 text-white group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                  <h3 className="text-white font-bold text-lg mb-2">{content.predictiveAnalytics}</h3>
                  <p className="text-indigo-200 text-sm">{content.predictiveAnalyticsDesc}</p>
                </div>

                {/* Integration Hub */}
                <div className="bg-gradient-to-br from-rose-500/30 to-pink-600/30 backdrop-blur-sm rounded-xl p-6 hover:from-rose-500/40 hover:to-pink-600/40 transition-all cursor-pointer group w-full md:w-auto md:max-w-sm border border-rose-400/40 shadow-xl">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-rose-500 to-pink-600 rounded-lg flex items-center justify-center shadow-lg">
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                      </svg>
                    </div>
                    <svg className="w-5 h-5 text-white group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                  <h3 className="text-white font-bold text-lg mb-2">{content.integrationHub}</h3>
                  <p className="text-indigo-200 text-sm">{content.integrationHubDesc}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Rating Badges */}
          <div className="flex flex-wrap justify-center items-center gap-4 sm:gap-6 lg:gap-8 mb-12 sm:mb-16">
            <div className="text-center">
              <div className="flex text-yellow-400 mb-2 justify-center">
                {[...Array(5)].map((_, i) => (
                  <span key={i} className={i < 4 ? 'text-yellow-400' : 'text-gray-400'}>★</span>
                ))}
              </div>
              <div className="text-white font-semibold mb-1 text-sm sm:text-base">{content.uiDesign}</div>
              <div className="text-indigo-200 text-xs sm:text-sm">4.6 / 5</div>
            </div>
            <div className="text-center">
              <div className="flex text-yellow-400 mb-2 justify-center">
                {[...Array(5)].map((_, i) => (
                  <span key={i} className={i < 4 ? 'text-yellow-400' : 'text-gray-400'}>★</span>
                ))}
              </div>
              <div className="text-white font-semibold mb-1 text-sm sm:text-base">{content.navigationUsability}</div>
              <div className="text-indigo-200 text-xs sm:text-sm">4.7 / 5</div>
            </div>
            <div className="text-center">
              <div className="flex text-yellow-400 mb-2 justify-center">
                {[...Array(5)].map((_, i) => (
                  <span key={i} className={i < 4 ? 'text-yellow-400' : 'text-gray-400'}>★</span>
                ))}
              </div>
              <div className="text-white font-semibold mb-1 text-sm sm:text-base">{content.performanceResponsiveness}</div>
              <div className="text-indigo-200 text-xs sm:text-sm">4.5 / 5</div>
            </div>
            <div className="text-center">
              <div className="flex text-yellow-400 mb-2 justify-center">
                {[...Array(5)].map((_, i) => (
                  <span key={i} className={i < 4 ? 'text-yellow-400' : 'text-gray-400'}>★</span>
                ))}
              </div>
              <div className="text-white font-semibold mb-1 text-sm sm:text-base">{content.contentSystemFunctionality}</div>
              <div className="text-indigo-200 text-xs sm:text-sm">4.8 / 5</div>
            </div>
          </div>

          {/* Dashboard Preview */}
          <div className="relative max-w-6xl mx-auto">
            <div className="bg-white rounded-xl sm:rounded-2xl shadow-2xl overflow-hidden">
              <div className="bg-gray-100 p-4 sm:p-6 lg:p-8 flex items-center justify-center" style={{minHeight: '300px', sm: '400px', lg: '600px'}}>
                <img 
                  src="/assets/dashboard.png" 
                  alt="Dashboard Preview" 
                  className="max-w-full h-auto rounded-lg shadow-lg cursor-pointer hover:opacity-90 transition-opacity"
                  onClick={() => navigate('/login')}
                />
              </div>
            </div>
          </div>
        </div>
        </div>
      </div>

      {/* As seen on */}
      <div className="bg-white py-8 sm:py-12">
        <div className="max-w-7xl mx-auto px-4">
          <h3 className="text-center text-gray-500 mb-6 sm:mb-8 text-sm sm:text-base">{content.asSeenOn}</h3>
          <div className="flex flex-wrap justify-center items-center gap-4 sm:gap-6 lg:gap-12 opacity-60">
            <div className="w-24 h-16 sm:w-28 sm:h-20 lg:w-32 lg:h-24 flex items-center justify-center">
              <img 
                src="/assets/kompascom.png" 
                alt="Kompas Logo" 
                className="w-full h-full object-contain"
              />
            </div>
            <div className="w-24 h-16 sm:w-28 sm:h-20 lg:w-32 lg:h-24 flex items-center justify-center">
              <img 
                src="/assets/indo_aktual.webp" 
                alt="Indo Aktual Logo" 
                className="w-full h-full object-contain"
              />
            </div>
            <div className="w-24 h-16 sm:w-28 sm:h-20 lg:w-32 lg:h-24 flex items-center justify-center">
              <img 
                src="/assets/kabarbaru.webp" 
                alt="Kabar Regional Logo" 
                className="w-full h-full object-contain"
              />
            </div>
            <div className="w-24 h-16 sm:w-28 sm:h-20 lg:w-32 lg:h-24 flex items-center justify-center">
              <img 
                src="/assets/kompasiana.png" 
                alt="Kabar Regional Logo" 
                className="w-full h-full object-contain"
              />
            </div>
            <div className="w-24 h-16 sm:w-28 sm:h-20 lg:w-32 lg:h-24 flex items-center justify-center">
              <img 
                src="/assets/ieee.png" 
                alt="Kabar Regional Logo" 
                className="w-full h-full object-contain"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="relative py-8 sm:py-12 bg-gradient-to-br from-indigo-900 via-indigo-800 to-indigo-900 overflow-hidden">
        {/* Building Background Image */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-10"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80')`
          }}
        ></div>
        
        <div className="relative z-10 max-w-7xl mx-auto px-4">
          <div className="flex flex-col lg:flex-row gap-6 sm:gap-8">
            {/* Left Section - Logo & Contact */}
            <div className="flex-1">
              <div className="mb-4 sm:mb-6">
                <div className="flex items-center mb-2">
                  <img 
                    src={storiLogo} 
                    alt="STORI Logo" 
                    className="w-6 h-6 sm:w-8 sm:h-8 rounded-lg object-cover mr-2 sm:mr-3"
                  />
                  <span className="text-xl sm:text-2xl font-bold text-white">STORI</span>
                </div>
                <p className="text-purple-100 text-xs sm:text-sm">System Monitoring</p>
              </div>

              {/* Contact Us */}
              <div>
                <h4 className="text-xs sm:text-sm font-semibold text-white mb-2 sm:mb-3">{content.contactUs}</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 text-xs sm:text-sm text-purple-100">
                  <div>
                    <div className="font-semibold text-white mb-1">{content.customerSupport}</div>
                    <div>Phone: +62 811-1010-0339</div>
                    <div>Email: team@tradisco.co.id</div>
                  </div>
                  <div>
                    <div className="font-semibold text-white mb-1">{content.technicalSupport}</div>
                    <div>Phone: +62 811-102-239</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Section - Office Locations */}
            <div className="flex-1">
              <h4 className="text-xs sm:text-sm font-semibold text-white mb-2 sm:mb-3">{content.officeLocations}</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 text-xs sm:text-sm text-purple-100">
                <div>
                  <div className="font-semibold text-white mb-1 sm:mb-2">{content.headOffice}</div>
                  <div>Gedung Artha Graha, 26 floor (SCBD)<br />
                  Jalan Jend. Sudirman No. 52-53,<br />
                  Kelurahan Senayan, Kec. Kebayoran Baru,<br />
                  Kota Adm Jakarta Selatan,<br />
                  Provinsi DKI Jakarta. 12190.</div>
                </div>
                <div>
                  <div className="font-semibold text-white mb-1 sm:mb-2">{content.backOffice}</div>
                  <div>Gedung The CEO Tower Lantai 15<br />
                  Jl.TB Simatupang, Cilandak,<br />
                  Jakarta Selatan.</div>
                </div>
                <div className="sm:col-span-2 lg:col-span-1">
                  <div className="font-semibold text-white mb-1 sm:mb-2">{content.operationService}</div>
                  <div>PALMA ONE Lantai 2<br />
                  Jl.H.R Rasuna Said Kav. X2 No.4<br />
                  Kuningan, Jakarta Selatan 12950,<br />
                  Indonesia.</div>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Border */}
          <div className="border-t border-purple-400/30 mt-6 sm:mt-8 pt-4 sm:pt-6">
            <div className="text-center text-xs sm:text-sm text-purple-100">
              {content.copyright}
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}