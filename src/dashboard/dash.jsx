import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Menu, X, ChevronDown, MessageSquare } from 'lucide-react';
import storiLogo from '/assets/Stori.jpg';

export default function PropertyDashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [language, setLanguage] = useState('ENG');
  const navigate = useNavigate();

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
        <div className="px-20 py-3">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <div className="flex items-center">
              <img 
                src={storiLogo} 
                alt="Stori Logo" 
                className="w-12 h-12 rounded-lg object-cover"
              />
              <div className="ml-3">
                <span className="text-2xl font-bold text-gray-900">STORI</span>
                <div className="text-sm font-medium text-gray-600">System Monitoring</div>
              </div>
            </div>

            {/* Navigation Menu */}
            <div className="hidden md:flex items-center space-x-8">
              <div className="relative group">
                <button className="flex items-center text-gray-700 hover:text-gray-900 transition-colors">
                  Products & Services <ChevronDown className="ml-1 w-4 h-4 transition-transform group-hover:rotate-180" />
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
                  Solutions <ChevronDown className="ml-1 w-4 h-4 transition-transform group-hover:rotate-180" />
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
                  Pricing <ChevronDown className="ml-1 w-4 h-4 transition-transform group-hover:rotate-180" />
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

            {/* Right Side */}
            <div className="flex items-center space-x-4">
              <div className="relative" data-dropdown>
                <button 
                  onClick={() => setActiveDropdown(activeDropdown === 'language' ? null : 'language')}
                  className="flex items-center text-gray-600 hover:text-gray-900 w-20 justify-center"
                >
                  <span className="mr-1">🌐</span> {language} <ChevronDown className="ml-1 w-4 h-4" />
                </button>
                
                {/* Language Dropdown */}
                {activeDropdown === 'language' && (
                  <div className="absolute top-full right-0 mt-2 w-32 bg-white rounded-xl shadow-xl border border-gray-100 py-2 animate-in fade-in-0 zoom-in-95 duration-200">
                    <button
                      onClick={() => {
                        setLanguage('ENG');
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
                        setLanguage('ID');
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
                className="text-white px-6 py-3 rounded-full transition-colors"
                style={{backgroundColor: '#3730A3'}}
                onMouseEnter={(e) => e.target.style.backgroundColor = '#312E81'}
                onMouseLeave={(e) => e.target.style.backgroundColor = '#3730A3'}
              >
                Login
              </button>
              <button className="bg-green-500 text-white px-6 py-3 rounded-full flex items-center hover:bg-green-600 transition-colors">
                <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488"/>
                </svg>
                Contact Us
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="relative bg-gradient-to-br from-indigo-900 via-indigo-800 to-indigo-900 pt-20">
        {/* Building Background Image */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-20"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80')`
          }}
        ></div>
        {/* Content */}
        <div className="relative z-10">
        <div className="max-w-7xl mx-auto px-4 pt-32 pb-20 text-center">
          <h1 className="text-5xl font-bold text-white mb-4">
          STORI <br /> System Monitoring <br />Built for <span className="text-white">Insight</span>
          </h1>
          <p className="text-xl text-indigo-100 mb-8">
            STORI is the smart solution for organizations that need real-time performance tracking and asset visibility.<br />
            Stay informed, improve efficiency, and make smarter decisions effortlessly.
          </p>

          {/* AI Assistant Banner */}
          <div className="max-w-4xl mx-auto mt-16 mb-12">
            <div className="bg-white rounded-2xl p-6 shadow-xl">
              <div className="flex items-center justify-between">
                {/* Left Side - AI Assistant Info */}
                <div className="flex items-center space-x-4">
                  <div className="relative">
                    <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center">
                      <div className="w-12 h-12 bg-gradient-to-br from-amber-200 to-amber-300 rounded-full flex items-center justify-center relative">
                        <svg className="w-8 h-8 text-blue-600" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                        </svg>
                      </div>
                    </div>
                    <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white"></div>
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-1">STORI AI Assistant</h3>
                    <p className="text-gray-600 text-sm flex items-center">
                      <span className="w-2 h-2 bg-white-600 rounded-full mr-2"></span>
                      Login Required to Access AI Features
                    </p>
                  </div>
                </div>

                {/* Right Side - Ask Section */}
                <div className="flex items-center space-x-4">
                  <div className="text-right">
                    <p className="text-gray-600 text-sm">Ask anything about</p>
                    <p className="text-gray-900 font-semibold text-lg">Maintenance & Operations</p>
                  </div>
                  <button className="text-white px-6 py-3 rounded-lg font-semibold hover:opacity-90 transition-colors flex items-center shadow-sm" style={{backgroundColor: '#3730a3'}}>
                    Login to Chat
                    <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Freemium Popular Features */}
          <div className="max-w-6xl mx-auto mb-16">
            <div className="text-center mb-8">
              <div className="inline-flex items-center bg-green-100 text-green-800 text-sm font-medium px-3 py-1 rounded-full mb-4">
                <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                FREE FEATURES
              </div>
              <h2 className="text-3xl font-bold text-white mb-4">Freemium Popular Features</h2>
              <p className="text-lg text-indigo-100">AI-powered maintenance solutions to transform your operations. Try it out today!</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* AI Maintenance Consultant */}
              <div className="bg-gradient-to-br from-cyan-500/20 to-cyan-600/20 backdrop-blur-sm rounded-xl p-6 hover:from-cyan-500/30 hover:to-cyan-600/30 transition-all cursor-pointer group border border-cyan-400/30">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-cyan-500 rounded-lg flex items-center justify-center">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                    </svg>
                  </div>
                  <svg className="w-5 h-5 text-white group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
                <h3 className="text-white font-bold text-lg mb-2">AI Maintenance Consultant</h3>
                <p className="text-indigo-200 text-sm">Transform manual CMMS data into interactive dashboards and smart recommendations instantly.</p>
              </div>

              {/* AI Document Generator */}
              <div className="bg-gradient-to-br from-lime-500/20 to-lime-600/20 backdrop-blur-sm rounded-xl p-6 hover:from-lime-500/30 hover:to-lime-600/30 transition-all cursor-pointer group border border-lime-400/30">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-lime-500 rounded-lg flex items-center justify-center">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <svg className="w-5 h-5 text-white group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
                <h3 className="text-white font-bold text-lg mb-2">AI Document Generator</h3>
                <p className="text-indigo-200 text-sm">Automatically create professional maintenance reports in PDF or PPT format — just like iLovePDF, but smarter.</p>
              </div>

              {/* Basic Maintenance Report Viewer */}
              <div className="bg-gradient-to-br from-pink-500/20 to-pink-600/20 backdrop-blur-sm rounded-xl p-6 hover:from-pink-500/30 hover:to-pink-600/30 transition-all cursor-pointer group border border-pink-400/30">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-pink-500 rounded-lg flex items-center justify-center">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  </div>
                  <svg className="w-5 h-5 text-white group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
                <h3 className="text-white font-bold text-lg mb-2">Basic Maintenance Report Viewer</h3>
                <p className="text-indigo-200 text-sm">Preview sample reports and AI insights using demo data — no setup required.</p>
              </div>
            </div>
          </div>

          {/* Advance STORI for All Business */}
          <div className="max-w-6xl mx-auto mb-16">
            <div className="text-center mb-8">
              <div className="inline-flex items-center bg-gradient-to-r from-yellow-400 to-orange-500 text-white text-sm font-bold px-4 py-2 rounded-full mb-4 shadow-lg">
                <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
                PREMIUM FEATURES
              </div>
              <h2 className="text-3xl font-bold text-white mb-4">Advance STORI for All Business</h2>
              <p className="text-lg text-indigo-100">Unlock full automation, predictive insights, and seamless monitoring for every operation.</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
                <h3 className="text-white font-bold text-lg mb-2">Dashboard Monitoring</h3>
                <p className="text-indigo-200 text-sm">Monitor asset status, technician performance, and maintenance history in real time.</p>
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
                <h3 className="text-white font-bold text-lg mb-2">Auto Scheduling & Smart Notification</h3>
                <p className="text-indigo-200 text-sm">Automatically plan maintenance tasks and receive instant alerts via dashboard, email, or WhatsApp.</p>
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
                <h3 className="text-white font-bold text-lg mb-2">Task & Assignment Management</h3>
                <p className="text-indigo-200 text-sm">Assign, track, and complete maintenance jobs with live progress updates.</p>
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
                  <h3 className="text-white font-bold text-lg mb-2">Predictive Analytics Engine</h3>
                  <p className="text-indigo-200 text-sm">Forecast equipment lifespan and maintenance needs using AI-driven models.</p>
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
                  <h3 className="text-white font-bold text-lg mb-2">Integration Hub</h3>
                  <p className="text-indigo-200 text-sm">Seamlessly connect with ERP, IoT, and Asset Management systems for enterprise scalability.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Rating Badges */}
          <div className="flex justify-center items-center space-x-8 mb-16">
            <div className="text-center">
              <div className="flex text-yellow-400 mb-2 justify-center">
                {[...Array(5)].map((_, i) => (
                  <span key={i} className={i < 4 ? 'text-yellow-400' : 'text-gray-400'}>★</span>
                ))}
              </div>
              <div className="text-white font-semibold mb-1">UI / Visual Design</div>
              <div className="text-indigo-200 text-sm">4.6 / 5</div>
            </div>
            <div className="text-center">
              <div className="flex text-yellow-400 mb-2 justify-center">
                {[...Array(5)].map((_, i) => (
                  <span key={i} className={i < 4 ? 'text-yellow-400' : 'text-gray-400'}>★</span>
                ))}
              </div>
              <div className="text-white font-semibold mb-1">Navigation & Usability</div>
              <div className="text-indigo-200 text-sm">4.7 / 5</div>
            </div>
            <div className="text-center">
              <div className="flex text-yellow-400 mb-2 justify-center">
                {[...Array(5)].map((_, i) => (
                  <span key={i} className={i < 4 ? 'text-yellow-400' : 'text-gray-400'}>★</span>
                ))}
              </div>
              <div className="text-white font-semibold mb-1">Performance & Responsiveness</div>
              <div className="text-indigo-200 text-sm">4.5 / 5</div>
            </div>
            <div className="text-center">
              <div className="flex text-yellow-400 mb-2 justify-center">
                {[...Array(5)].map((_, i) => (
                  <span key={i} className={i < 4 ? 'text-yellow-400' : 'text-gray-400'}>★</span>
                ))}
              </div>
              <div className="text-white font-semibold mb-1">Content & System Functionality</div>
              <div className="text-indigo-200 text-sm">4.8 / 5</div>
            </div>
          </div>

          {/* Dashboard Preview */}
          <div className="relative max-w-6xl mx-auto">
            <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
              <div className="bg-gray-100 p-8 flex items-center justify-center" style={{minHeight: '600px'}}>
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
      <div className="bg-white py-12">
        <div className="max-w-7xl mx-auto px-4">
          <h3 className="text-center text-gray-500 mb-8">As seen on</h3>
          <div className="flex justify-center items-center space-x-12 opacity-60">
            <div className="w-32 h-24 flex items-center justify-center">
              <img 
                src="/assets/kompascom.png" 
                alt="Kompas Logo" 
                className="w-full h-full object-contain"
              />
            </div>
            <div className="w-32 h-24 flex items-center justify-center">
              <img 
                src="/assets/indo_aktual.webp" 
                alt="Indo Aktual Logo" 
                className="w-full h-full object-contain"
              />
            </div>
            <div className="w-32 h-24 flex items-center justify-center">
              <img 
                src="/assets/kabarbaru.webp" 
                alt="Kabar Regional Logo" 
                className="w-full h-full object-contain"
              />
            </div>
            <div className="w-32 h-24 flex items-center justify-center">
              <img 
                src="/assets/kompasiana.png" 
                alt="Kabar Regional Logo" 
                className="w-full h-full object-contain"
              />
            </div>
            <div className="w-32 h-24 flex items-center justify-center">
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
      <footer className="relative py-12 bg-gradient-to-br from-indigo-900 via-indigo-800 to-indigo-900 overflow-hidden">
        {/* Building Background Image */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-10"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80')`
          }}
        ></div>
        
        <div className="relative z-10 max-w-7xl mx-auto px-4">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Left Section - Logo & Contact */}
            <div className="flex-1">
              <div className="mb-6">
                <div className="flex items-center mb-2">
                  <img 
                    src={storiLogo} 
                    alt="STORI Logo" 
                    className="w-8 h-8 rounded-lg object-cover mr-3"
                  />
                  <span className="text-2xl font-bold text-white">STORI</span>
                </div>
                <p className="text-purple-100 text-sm">System Monitoring Infrastructure</p>
              </div>

              {/* Contact Us */}
              <div>
                <h4 className="text-sm font-semibold text-white mb-3">CONTACT US</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-purple-100">
                  <div>
                    <div className="font-semibold text-white mb-1">CUSTOMER SUPPORT:</div>
                    <div>Phone: +62 811-1010-0339</div>
                    <div>Email: team@tradisco.co.id</div>
                  </div>
                  <div>
                    <div className="font-semibold text-white mb-1">TECHNICAL SUPPORT:</div>
                    <div>Phone: +62 811-102-239</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Section - Office Locations */}
            <div className="flex-1">
              <h4 className="text-sm font-semibold text-white mb-3">OFFICE LOCATIONS</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-purple-100">
                <div>
                  <div className="font-semibold text-white mb-2">HEAD OFFICE:</div>
                  <div>Gedung Artha Graha, 26 floor (SCBD)<br />
                  Jalan Jend. Sudirman No. 52-53,<br />
                  Kelurahan Senayan, Kec. Kebayoran Baru,<br />
                  Kota Adm Jakarta Selatan,<br />
                  Provinsi DKI Jakarta. 12190.</div>
                </div>
                <div>
                  <div className="font-semibold text-white mb-2">BACK OFFICE:</div>
                  <div>Gedung The CEO Tower Lantai 15<br />
                  Jl.TB Simatupang, Cilandak,<br />
                  Jakarta Selatan.</div>
                </div>
                <div>
                  <div className="font-semibold text-white mb-2">OPERATION SERVICE:</div>
                  <div>PALMA ONE Lantai 2<br />
                  Jl.H.R Rasuna Said Kav. X2 No.4<br />
                  Kuningan, Jakarta Selatan 12950,<br />
                  Indonesia.</div>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Border */}
          <div className="border-t border-purple-400/30 mt-8 pt-6">
            <div className="text-center text-sm text-purple-100">
              © 2024 STORI. All rights reserved. | System Monitoring Infrastructure
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}