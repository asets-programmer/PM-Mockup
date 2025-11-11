import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Menu, X, ChevronDown, MessageSquare, Phone, Mail, Building2 } from 'lucide-react';
import storiLogo from '/assets/Stori.jpg';
import earthGlobeIcon from '/assets/earth-globe.png';
import userIcon from '/assets/user.png';
import { useLanguage } from '../contexts/LanguageContext';
import { languageContent } from '../data/languageContent';
import TextType from '../components/TextType';
import { 
  Navbar, 
  NavBody, 
  NavItems, 
  MobileNav, 
  MobileNavHeader, 
  MobileNavMenu, 
  MobileNavToggle, 
  NavbarLogo, 
  NavbarButton 
} from '../components/ui/resizable-navbar';

export default function PropertyDashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrollPosition, setScrollPosition] = useState(0);
  const [scrollMax, setScrollMax] = useState(0);
  const scrollContainerRef = useRef(null);
  const navigate = useNavigate();
  const { language, changeLanguage } = useLanguage();
  const content = languageContent[language];

  // STORI text array for typing animation
  const storiTexts = [
    "System Monitoring Built for Insight",
    "System Monitoring Built for Insight"
  ];

  // Navigation items for resizable navbar
  const navItems = [
    { name: content.productsServices, link: "#products", hasDropdown: false },
    { name: content.solutions, link: "#solutions", hasDropdown: true },
    { name: content.pricing, link: "#pricing", hasDropdown: false }
  ];

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      // Don't close if clicking on dropdown buttons or dropdown content
      if (event.target.closest('[data-dropdown]') || 
          event.target.closest('.dropdown-container') ||
          event.target.closest('.nav-items-container') ||
          event.target.closest('[data-solutions-dropdown]')) {
        return;
      }
      setActiveDropdown(null);
    };

    if (activeDropdown) {
      document.addEventListener('click', handleClickOutside);
      return () => document.removeEventListener('click', handleClickOutside);
    }
  }, [activeDropdown]);

  // Handle scroll for Advance STORI cards
  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const handleScroll = () => {
      const scrollLeft = container.scrollLeft;
      const scrollWidth = container.scrollWidth;
      const clientWidth = container.clientWidth;
      const maxScroll = scrollWidth - clientWidth;
      
      setScrollPosition(scrollLeft);
      setScrollMax(maxScroll);
    };

    // Initial calculation
    handleScroll();

    container.addEventListener('scroll', handleScroll);
    window.addEventListener('resize', handleScroll);

    return () => {
      container.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
    };
  }, []);

  return (
    <div className="min-h-screen">
      {/* CSS untuk navbar compact */}
      <style jsx>{`
        .navbar-compact .navbar-compact\\:hidden {
          display: none !important;
        }
        .navbar-compact .navbar-compact\\:block {
          display: block !important;
        }
        .navbar-compact .navbar-compact\\:px-0 {
          padding-left: 0 !important;
          padding-right: 0 !important;
        }
        .navbar-compact .navbar-compact\\:py-0 {
          padding-top: 0 !important;
          padding-bottom: 0 !important;
        }
        .navbar-compact .navbar-compact\\:px-1 {
          padding-left: 0.25rem !important;
          padding-right: 0.25rem !important;
        }
        .navbar-compact .navbar-compact\\:py-1 {
          padding-top: 0.25rem !important;
          padding-bottom: 0.25rem !important;
        }
        .navbar-compact .navbar-compact\\:w-6 {
          width: 1.5rem !important;
        }
        .navbar-compact .navbar-compact\\:h-6 {
          height: 1.5rem !important;
        }
        .navbar-compact .navbar-compact\\:w-8 {
          width: 2rem !important;
        }
        .navbar-compact .navbar-compact\\:h-8 {
          height: 2rem !important;
        }
        .navbar-compact .navbar-compact\\:w-10 {
          width: 2.5rem !important;
        }
        .navbar-compact .navbar-compact\\:h-10 {
          height: 2.5rem !important;
        }
        .navbar-compact .navbar-compact\\:justify-center {
          justify-content: center !important;
        }
        .navbar-compact .navbar-compact\\:items-center {
          align-items: center !important;
        }
        .navbar-compact .navbar-compact\\:flex {
          display: flex !important;
        }
        .navbar-compact .navbar-compact\\:m-auto {
          margin: auto !important;
        }
        .navbar-compact .navbar-compact\\:ml-0 {
          margin-left: 0 !important;
        }
        .navbar-compact .navbar-compact\\:mr-0 {
          margin-right: 0 !important;
        }
        
        /* Custom Hamburger Menu Styles */
        .hamburger-background {
          border-radius: 8px;
          border: 1px solid #e5e7eb;
          background: transparent;
          width: 35px;
          height: 35px;
          display: flex;
          justify-content: center;
          align-items: center;
        }
        
        .hamburger-menu-icon {
          width: 18px;
          height: 18px;
          padding: 2px;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          align-items: end;
          transition: transform .4s;
          border: none;
          background: none;
          cursor: pointer;
        }
        
        .hamburger-menu-icon span {
          width: 100%;
          height: 0.15rem;
          border-radius: 0.075rem;
          background-color: rgb(0, 122, 255);
          box-shadow: 0 .5px 2px 0 hsla(0, 0%, 0%, .2);
          transition: width .4s, transform .4s, background-color .4s;
        }
        
        .hamburger-menu-icon :nth-child(2) {
          width: 75%;
        }
        
        .hamburger-menu-icon :nth-child(3) {
          width: 50%;
        }
        
        .hamburger-menu-icon.open {
          transform: rotate(-90deg);
        }
        
        .hamburger-menu-icon.open span {
          width: .25rem;
          transform: translateX(-10px);
          background-color: rgb(255, 59, 48);
        }

        /* Social Media Icons */
        .social-icon {
          width: 20px;
          height: 20px;
          cursor: pointer;
          transition: opacity 0.2s;
        }
        .social-icon:hover {
          opacity: 0.8;
        }
        
        /* Hide scrollbar for horizontal scroll */
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
      
      {/* Top Navigation Bar - Contact and Social Media */}
      <div className="w-full flex overflow-hidden">
        {/* Left Section - Dark Green Background with Contact Information */}
        <div className="flex-1 bg-[#1a5f3f] px-4 py-2">
          <div className="max-w-7xl mx-auto flex items-center justify-center gap-8 lg:gap-10 text-sm text-white pr-4">
            <div className="flex items-center gap-1.5 mr-6">
              <Phone className="w-4 h-4" style={{color: '#C7F651'}} />
              <span className="hidden sm:inline text-white">+62 811-1010-0339</span>
            </div>
            <div className="flex items-center gap-1.5 mr-6">
              <Mail className="w-4 h-4" style={{color: '#C7F651'}} />
              <span className="hidden md:inline text-white">team@tradisco.co.id</span>
            </div>
            <div className="flex items-center gap-1.5 mr-6">
              <Building2 className="w-4 h-4" style={{color: '#C7F651'}} />
              <span className="hidden lg:inline text-white">Gedung Artha Graha, 26 floor (SCBD) Jalan Jend. Sudirman No. 52-53</span>
            </div>
          </div>
        </div>
        
        {/* Right Section - Light Green Background with Social Media Icons */}
        <div className="bg-[#C7F651] px-4 py-2 flex items-center justify-center gap-6 rounded-l-lg -ml-1">
          {/* WhatsApp */}
          <a href="#" className="text-[#1a5f3f] flex items-center justify-center">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488"/>
            </svg>
          </a>
          {/* Instagram */}
          <a href="#" className="text-[#1a5f3f] flex items-center justify-center">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
            </svg>
          </a>
          {/* Facebook */}
          <a href="#" className="text-[#1a5f3f] flex items-center justify-center">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
            </svg>
          </a>
          {/* YouTube */}
          <a href="#" className="text-[#1a5f3f] flex items-center justify-center">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
            </svg>
          </a>
        </div>
      </div>
      
      {/* Resizable Navbar */}
      <Navbar>
        <NavBody>
            {/* Logo */}
            <div className="flex items-center">
              <img 
                src={storiLogo} 
                alt="Stori Logo" 
                className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 rounded-lg object-cover"
              />
              <div className="ml-1 sm:ml-2 lg:ml-3">
                <span className="text-sm sm:text-lg lg:text-xl xl:text-2xl font-bold text-gray-900">STORI</span>
                <div className="text-xs sm:text-sm font-medium text-gray-600 hidden sm:block">System Monitoring</div>
              </div>
            </div>

          {/* Navigation Items - Custom with dropdown arrow */}
          <div className="absolute inset-0 hidden flex-1 flex-row items-center justify-center space-x-2 sm:space-x-4 text-xs sm:text-sm font-bold text-zinc-600 transition duration-200 hover:text-zinc-800 lg:flex nav-items-container">
            {navItems.map((item, idx) => (
              <div key={`link-${idx}`} className="relative" data-solutions-dropdown>
                <a
                  href={item.link}
                  className={`relative px-2 sm:px-4 py-2 text-neutral-600 hover:text-neutral-900 flex items-center gap-1 font-bold ${
                    item.hasDropdown && activeDropdown === 'solutions' ? 'border-b-2 border-[#86efac]' : ''
                  }`}
                  onClick={(e) => {
                    if (item.hasDropdown) {
                      e.preventDefault();
                      setActiveDropdown(activeDropdown === 'solutions' ? null : 'solutions');
                    }
                  }}
                >
                  {item.name}
                  {item.hasDropdown && (
                    <ChevronDown className={`w-3 h-3 transition-transform ${activeDropdown === 'solutions' ? 'rotate-180' : ''}`} />
                  )}
                </a>
                {/* Solutions Dropdown */}
                {item.hasDropdown && activeDropdown === 'solutions' && (
                  <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 bg-white rounded-lg border border-gray-800 py-3 px-6 z-50">
                    <div className="flex items-center gap-8">
                      <a href="/stori-spbu" className="text-sm text-gray-800 hover:border-b-2 hover:border-gray-800 pb-1 transition-all font-medium whitespace-nowrap">
                        STORI for SPBU
                      </a>
                      <a href="/custom-stori" className="text-sm text-gray-800 hover:border-b-2 hover:border-gray-800 pb-1 transition-all font-medium whitespace-nowrap">
                        Custom STORI
                      </a>
                      <a href="/solutions-3" className="text-sm text-gray-800 hover:border-b-2 hover:border-gray-800 pb-1 transition-all font-medium whitespace-nowrap">
                        Solutions 3
                      </a>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Right Side Actions */}
          <div className="flex items-center space-x-1 sm:space-x-2 lg:space-x-4">
            {/* Language Dropdown */}
              <div className="relative" data-dropdown>
                <button 
                  onClick={() => setActiveDropdown(activeDropdown === 'language' ? null : 'language')}
                  className="flex items-center text-gray-600 hover:text-gray-900 w-12 sm:w-16 lg:w-20 justify-center text-xs sm:text-sm lg:text-base font-bold"
                >
                  <img src={earthGlobeIcon} alt="Language" className="w-4 h-4 mr-1" /> {language} <ChevronDown className="ml-1 w-3 h-3 lg:w-4 lg:h-4" />
                </button>
                
                {/* Language Dropdown */}
                {activeDropdown === 'language' && (
                  <div className="absolute top-full right-0 mt-2 w-32 bg-white rounded-xl shadow-xl border border-gray-100 py-2 animate-in fade-in-0 zoom-in-95 duration-200 z-50">
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

            {/* Login Button - Dark Green */}
            <NavbarButton 
              href="/login"
              onClick={() => navigate('/login')}
              className="text-white px-2 sm:px-3 lg:px-12 py-1 sm:py-2 lg:py-3 rounded-full transition-colors text-xs sm:text-sm lg:text-base navbar-compact:px-1 navbar-compact:py-1 navbar-compact:w-8 navbar-compact:h-8 navbar-compact:justify-center navbar-compact:items-center navbar-compact:flex"
              style={{backgroundColor: '#1a5f3f'}}
            >
              <span className="navbar-compact:hidden">{content.login}</span>
            </NavbarButton>
            </div>
        </NavBody>

        {/* Mobile Navigation */}
        <div className="lg:hidden relative bg-white">
          <div className="flex w-full flex-row items-center justify-between bg-white px-4 py-2 border-b border-gray-200">
            {/* Mobile Logo */}
            <div className="flex items-center">
              <img 
                src={storiLogo} 
                alt="Stori Logo" 
                className="w-6 h-6 sm:w-8 sm:h-8 rounded-lg object-cover"
              />
              <span className="ml-1 sm:ml-2 text-sm sm:text-lg font-bold text-gray-900">STORI</span>
            </div>
            
            {/* Mobile Menu Toggle */}
            <div className="flex items-center">
              <div className="hamburger-background">
                <button
                  onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                  className={`hamburger-menu-icon ${mobileMenuOpen ? 'open' : ''}`}
                  aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
                >
                  <span></span>
                  <span></span>
                  <span></span>
                </button>
              </div>
            </div>
          </div>

          {/* Mobile Menu */}
          {mobileMenuOpen && (
            <div className="absolute right-0 top-full z-50 w-1/2 flex flex-col items-start justify-start gap-4 bg-white px-4 py-6 shadow-xl border border-gray-200">
              {/* Mobile Navigation Items */}
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
                        setMobileMenuOpen(false);
                      }}
                      className={`px-3 py-1 rounded text-sm ${language === 'ENG' ? 'bg-indigo-100 text-indigo-600' : 'text-gray-600'}`}
                    >
                      ENG
                    </button>
                    <button
                      onClick={() => {
                        changeLanguage('ID');
                        setMobileMenuOpen(false);
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
                    setMobileMenuOpen(false);
                  }}
                  className="w-full text-white px-4 py-3 rounded-lg transition-colors"
                  style={{backgroundColor: '#1a5f3f'}}
                >
                  {content.login}
                </button>
              </div>
            </div>
          )}
        </div>
      </Navbar>

      {/* Hero Section */}
      <div className="relative bg-[#F8FBF8]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            {/* Left Column */}
            <div className="space-y-6 lg:space-y-8">
              {/* Baris Pertama: STORI, Subtitle, dan Paragraf */}
              <div className="space-y-4">
                <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold text-gray-900">
                STORI
                </h1>
                <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900">
                  System Monitoring Built for Insight
                </h2>
                <p className="text-base sm:text-lg text-gray-900 leading-relaxed">
                  STORI is the smart solution for organizations that need real-time performance tracking and asset visibility. Stay informed, improve efficiency, and make smarter decisions effortlessly.
                </p>
              </div>

              {/* Baris Kedua: STORI AI Assistant (Diperkecil) */}
              <div className="bg-[#2F4F3F] rounded-lg p-4 sm:p-5 shadow-lg">
                <div className="flex items-start space-x-3 mb-4">
                  <div className="relative flex-shrink-0">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 bg-white rounded-full flex items-center justify-center">
                      <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center relative overflow-hidden">
                        <img 
                          src="/assets/llama.gif" 
                          alt="STORI AI Assistant" 
                          className="w-full h-full object-cover rounded-full"
                        />
                      </div>
                    </div>
                    <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                  </div>
                  <div className="text-left">
                    <h3 className="text-sm sm:text-base font-bold text-white mb-0.5">STORI AI Assistant</h3>
                    <p className="text-xs sm:text-sm text-white/80">
                      Login Required to Access AI Features
                    </p>
                  </div>
                </div>

                {/* Input and Button */}
                <div className="flex items-center gap-2">
                  <input 
                    type="text" 
                    placeholder="Ask anything about maintenance & operations..." 
                    className="flex-1 px-3 py-2 rounded-lg border border-gray-300 bg-gray-50 text-sm text-gray-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    disabled
                  />
                  <button 
                    onClick={() => navigate('/login')}
                    className="px-4 py-2 rounded-lg font-semibold text-sm text-[#1a5f3f] bg-[#A7D15B] hover:bg-[#9bc04a] transition-colors whitespace-nowrap"
                  >
                    Login to Chat
                  </button>
              </div>
            </div>
          </div>

            {/* Right Column: Image */}
            <div className="relative flex items-center justify-center">
              <div className="relative w-full max-w-md">
                <img 
                  src="/assets/mask-removebg-preview.png" 
                  alt="STORI" 
                  className="w-full h-auto object-contain"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Freemium Popular Features Section */}
      <div className="flex justify-center px-2 sm:px-4 lg:px-6" style={{backgroundColor: '#F6F6F6'}}>
        <div className="rounded-lg sm:rounded-xl lg:rounded-2xl p-2 sm:p-3 lg:p-4 w-fit">
          <div className="relative bg-purple-900 rounded-lg sm:rounded-xl lg:rounded-2xl overflow-hidden">
            <div className="mx-auto py-6 sm:py-8 lg:py-12" style={{width: '95%', maxWidth: '1400px'}}>
              <div className="mb-4 sm:mb-6 lg:mb-8">
                <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-cyan-400 mb-3 sm:mb-4">{content.freemiumTitle}</h2>
                <p className="text-sm sm:text-base lg:text-lg text-white">{content.freemiumDescription}</p>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 lg:gap-6">
              {/* AI Detects Brand - Temp (Coming soon) */}
              <div 
                onClick={() => navigate('/ai-maintenance-consultant')}
                className="bg-purple-800/50 backdrop-blur-sm rounded-lg sm:rounded-xl p-3 sm:p-4 lg:p-6 hover:bg-purple-800/70 transition-all cursor-pointer group"
              >
                <div className="mb-3 sm:mb-4">
                    <img 
                      src="/assets/AI_Maintenance_Consultant_Icon.jpg" 
                      alt="AI Detects Brand" 
                    className="w-full h-48 sm:h-56 lg:h-64 object-cover rounded-lg mb-3 sm:mb-4"
                    />
                  </div>
                <div className="relative">
                  <h3 className="text-white font-bold text-sm sm:text-base lg:text-lg mb-1 sm:mb-2">Ai Detects Brand - Temp (Coming soon)</h3>
                  <p className="text-gray-300 text-xs sm:text-sm mb-2">Automatically detect dispenser brand using AI and CNN technology. Identify Gilbarco or Tatsuno brands with high accuracy through real-time image analysis from camera or photo upload.</p>
                  <svg className="w-4 h-4 sm:w-5 sm:h-5 text-white absolute bottom-0 right-0 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>

              {/* AI Document Generator */}
              <div 
                onClick={() => navigate('/ai-document-generator')}
                className="bg-purple-800/50 backdrop-blur-sm rounded-lg sm:rounded-xl p-3 sm:p-4 lg:p-6 hover:bg-purple-800/70 transition-all cursor-pointer group"
              >
                <div className="mb-3 sm:mb-4">
                    <img 
                      src="/assets/AI_Document_Generator.png" 
                      alt="AI Document Generator" 
                    className="w-full h-48 sm:h-56 lg:h-64 object-cover rounded-lg mb-3 sm:mb-4"
                    />
                  </div>
                <div className="relative">
                  <h3 className="text-white font-bold text-sm sm:text-base lg:text-lg mb-1 sm:mb-2">{content.aiDocumentGenerator}</h3>
                  <p className="text-gray-300 text-xs sm:text-sm mb-2">{content.aiDocumentGeneratorDesc}</p>
                  <svg className="w-4 h-4 sm:w-5 sm:h-5 text-white absolute bottom-0 right-0 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>

              {/* Basic Maintenance Report Viewer */}
              <div className="bg-purple-800/50 backdrop-blur-sm rounded-lg sm:rounded-xl p-3 sm:p-4 lg:p-6 hover:bg-purple-800/70 transition-all cursor-pointer group">
                <div className="mb-3 sm:mb-4">
                    <img 
                      src="/assets/Basic_Maintenance_Report_Viewer.jpg" 
                      alt="Basic Maintenance Report Viewer" 
                    className="w-full h-48 sm:h-56 lg:h-64 object-cover rounded-lg mb-3 sm:mb-4"
                    />
                  </div>
                <div className="relative">
                  <h3 className="text-white font-bold text-sm sm:text-base lg:text-lg mb-1 sm:mb-2">{content.basicMaintenanceReport}</h3>
                  <p className="text-gray-300 text-xs sm:text-sm mb-2">{content.basicMaintenanceReportDesc}</p>
                  <svg className="w-4 h-4 sm:w-5 sm:h-5 text-white absolute bottom-0 right-0 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
              </div>
            </div>
          </div>

      {/* Rating Badges Section */}
      <div className="bg-purple-50 py-6 sm:py-8 lg:py-12">
        <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-6 xl:px-8">
          <div className="flex flex-wrap justify-center items-center gap-4 sm:gap-6 lg:gap-8">
            {/* UI / Visual Design */}
            <div className="text-center">
              <div className="flex justify-center mb-2 gap-1">
                {[...Array(4)].map((_, i) => (
                  <svg key={i} className="w-5 h-5 sm:w-6 sm:h-6 text-green-700" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
                ))}
                <svg className="w-5 h-5 sm:w-6 sm:h-6 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 20 20">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              </div>
              <div className="text-gray-700 font-semibold mb-1 text-sm sm:text-base">{content.uiDesign}</div>
              <div className="text-gray-600 text-xs sm:text-sm">4.5/5</div>
            </div>
            
            {/* Navigation & Usability */}
            <div className="text-center">
              <div className="flex justify-center mb-2 gap-1">
                {[...Array(4)].map((_, i) => (
                  <svg key={i} className="w-5 h-5 sm:w-6 sm:h-6 text-green-700" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
                <svg className="w-5 h-5 sm:w-6 sm:h-6 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 20 20">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              </div>
              <div className="text-gray-700 font-semibold mb-1 text-sm sm:text-base">{content.navigationUsability}</div>
              <div className="text-gray-600 text-xs sm:text-sm">4.6/5</div>
            </div>

            {/* Performance & Responsiveness */}
            <div className="text-center">
              <div className="flex justify-center mb-2 gap-1">
                {[...Array(4)].map((_, i) => (
                  <svg key={i} className="w-5 h-5 sm:w-6 sm:h-6 text-green-700" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
                <svg className="w-5 h-5 sm:w-6 sm:h-6 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 20 20">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              </div>
              <div className="text-gray-700 font-semibold mb-1 text-sm sm:text-base">{content.performanceResponsiveness}</div>
              <div className="text-gray-600 text-xs sm:text-sm">4.6/5</div>
            </div>

            {/* Content & System Functionality */}
            <div className="text-center">
              <div className="flex justify-center mb-2 gap-1">
                {[...Array(4)].map((_, i) => (
                  <svg key={i} className="w-5 h-5 sm:w-6 sm:h-6 text-green-700" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
                <svg className="w-5 h-5 sm:w-6 sm:h-6 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 20 20">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              </div>
              <div className="text-gray-700 font-semibold mb-1 text-sm sm:text-base">{content.contentSystemFunctionality}</div>
              <div className="text-gray-600 text-xs sm:text-sm">4.6/5</div>
            </div>
          </div>
        </div>
      </div>

      {/* Advance STORI for All Business Section */}
      <div className="flex justify-center px-2 sm:px-4 lg:px-6" style={{backgroundColor: '#F6F6F6'}}>
        <div className="rounded-lg sm:rounded-xl lg:rounded-2xl p-2 sm:p-3 lg:p-4 w-fit" style={{width: '99%'}}>
          <div className="relative bg-blue-900 rounded-lg sm:rounded-xl lg:rounded-2xl overflow-hidden">
            {/* Content */}
            <div className="mx-auto pt-6 sm:pt-8 lg:pt-12 pb-8 sm:pb-12 lg:pb-16 xl:pb-20" style={{width: '95%', maxWidth: '1400px'}}>
          {/* Header */}
          <div className="mb-6 sm:mb-8 lg:mb-12">
            <h2 className="text-xl sm:text-2xl lg:text-3xl xl:text-4xl font-bold mb-3 sm:mb-4" style={{color: '#87CEEB'}}>{content.advanceStoriTitle}</h2>
            <p className="text-sm sm:text-base lg:text-lg" style={{color: '#87CEEB'}}>{content.advanceStoriDescription}</p>
          </div>
          
          {/* Cards - Horizontal Scrollable */}
          <div ref={scrollContainerRef} className="overflow-x-auto mb-6 sm:mb-8 scrollbar-hide" style={{scrollbarWidth: 'none', msOverflowStyle: 'none', WebkitOverflowScrolling: 'touch', scrollBehavior: 'smooth'}}>
            <div className="flex gap-3 sm:gap-4 lg:gap-6 pb-4 justify-center" style={{width: 'max-content', margin: '0 auto'}}>
              {/* Dashboard Monitoring - Card 1 */}
              <div className="bg-blue-800 rounded-lg sm:rounded-xl p-3 sm:p-4 lg:p-6 hover:bg-blue-700 transition-all cursor-pointer group flex-shrink-0" style={{width: '280px', flexShrink: 0}}>
                <div className="mb-3 sm:mb-4">
                    <img 
                      src="/assets/Dashboard_Monitoring.png" 
                      alt="Dashboard Monitoring" 
                    className="w-full h-48 sm:h-56 lg:h-64 object-cover rounded-lg mb-3 sm:mb-4"
                    />
                  </div>
                <div className="relative">
                  <h3 className="text-white font-bold text-sm sm:text-base lg:text-lg mb-1 sm:mb-2">Dashboard Monitoring</h3>
                  <p className="text-gray-300 text-xs sm:text-sm mb-2">Monitor asset status, technician performance, and maintenance history in real time.</p>
                  <svg className="w-4 h-4 sm:w-5 sm:h-5 text-white absolute bottom-0 right-0 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>

              {/* Auto Scheduling & Smart Notification - Card 2 */}
              <div className="bg-blue-800 rounded-lg sm:rounded-xl p-3 sm:p-4 lg:p-6 hover:bg-blue-700 transition-all cursor-pointer group flex-shrink-0" style={{width: '280px', flexShrink: 0}}>
                <div className="mb-3 sm:mb-4">
                    <img 
                      src="/assets/Auto_Scheduling.png" 
                      alt="Auto Scheduling & Smart Notification" 
                    className="w-full h-48 sm:h-56 lg:h-64 object-cover rounded-lg mb-3 sm:mb-4"
                    />
                  </div>
                <div className="relative">
                  <h3 className="text-white font-bold text-sm sm:text-base lg:text-lg mb-1 sm:mb-2">Auto Scheduling & Smart Notification</h3>
                  <p className="text-gray-300 text-xs sm:text-sm mb-2">Automatically plan maintenance tasks and receive instant alerts via dashboard, email, or WhatsApp.</p>
                  <svg className="w-4 h-4 sm:w-5 sm:h-5 text-white absolute bottom-0 right-0 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>

              {/* Task & Assignment Management - Card 3 */}
              <div className="bg-blue-800 rounded-lg sm:rounded-xl p-3 sm:p-4 lg:p-6 hover:bg-blue-700 transition-all cursor-pointer group flex-shrink-0" style={{width: '280px', flexShrink: 0}}>
                <div className="mb-3 sm:mb-4">
                    <img 
                      src="/assets/Task.png" 
                      alt="Task & Assignment Management" 
                    className="w-full h-48 sm:h-56 lg:h-64 object-cover rounded-lg mb-3 sm:mb-4"
                    />
                  </div>
                <div className="relative">
                  <h3 className="text-white font-bold text-sm sm:text-base lg:text-lg mb-1 sm:mb-2">Task & Assignment Management</h3>
                  <p className="text-gray-300 text-xs sm:text-sm mb-2">Assign, track, and complete maintenance jobs with live progress updates.</p>
                  <svg className="w-4 h-4 sm:w-5 sm:h-5 text-white absolute bottom-0 right-0 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>

              {/* Predictive Analytics Engine - Card 4 */}
              <div className="bg-blue-800 rounded-lg sm:rounded-xl p-3 sm:p-4 lg:p-6 hover:bg-blue-700 transition-all cursor-pointer group flex-shrink-0" style={{width: '280px', flexShrink: 0}}>
                <div className="mb-3 sm:mb-4">
                      <img 
                        src="/assets/Predictive.png" 
                        alt="Predictive Analytics Engine" 
                    className="w-full h-48 sm:h-56 lg:h-64 object-cover rounded-lg mb-3 sm:mb-4"
                      />
                    </div>
                <div className="relative">
                  <h3 className="text-white font-bold text-sm sm:text-base lg:text-lg mb-1 sm:mb-2">Predictive Analytics Engine</h3>
                  <p className="text-gray-300 text-xs sm:text-sm mb-2">Forecast equipment lifespan and maintenance needs using AI-driven models.</p>
                  <svg className="w-4 h-4 sm:w-5 sm:h-5 text-white absolute bottom-0 right-0 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>

              {/* Integration Hub - Card 5 */}
              <div className="bg-blue-800 rounded-lg sm:rounded-xl p-3 sm:p-4 lg:p-6 hover:bg-blue-700 transition-all cursor-pointer group flex-shrink-0" style={{width: '280px', flexShrink: 0}}>
                <div className="mb-3 sm:mb-4">
                      <img 
                        src="/assets/Integration.png" 
                        alt="Integration Hub" 
                    className="w-full h-48 sm:h-56 lg:h-64 object-cover rounded-lg mb-3 sm:mb-4"
                      />
                    </div>
                <div className="relative">
                  <h3 className="text-white font-bold text-sm sm:text-base lg:text-lg mb-1 sm:mb-2">Integration Hub</h3>
                  <p className="text-gray-300 text-xs sm:text-sm mb-2">Seamlessly connect with ERP, IoT, and Asset Management systems for enterprise scalability.</p>
                  <svg className="w-4 h-4 sm:w-5 sm:h-5 text-white absolute bottom-0 right-0 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                </div>
              </div>
            </div>
          </div>

          {/* Navigation/Scroll Indicator */}
          <div className="flex justify-center items-center mt-4">
            <div className="relative" style={{width: '100px', height: '8px'}}>
              <div className="w-full h-1 bg-gray-600 rounded-full relative">
                <div 
                  className="h-1 bg-cyan-400 rounded-full transition-all duration-300"
                  style={{
                    width: scrollMax > 0 ? `${(scrollPosition / scrollMax) * 100}%` : '0%'
                  }}
                ></div>
              </div>
              <div 
                className="w-2 h-2 bg-cyan-400 rounded-full absolute transition-all duration-300 top-1/2 -translate-y-1/2"
                style={{
                  left: scrollMax > 0 ? `calc(${(scrollPosition / scrollMax) * 100}% - 4px)` : '0px'
                }}
              ></div>
            </div>
              </div>
            </div>
              </div>

      {/* Dashboard Preview Section */}
      <div className="flex justify-center" style={{backgroundColor: '#F6F6F6'}}>
        <div className="rounded-lg mt-10 w-fit" style={{width: '100%'}}>
          <div className="relative rounded-lg sm:rounded-xl lg:rounded-2xl overflow-hidden" style={{backgroundColor: '#14494F'}}>
            {/* Content */}
            <div className="mx-auto pt-6 sm:pt-8 lg:pt-12 pb-8 sm:pb-12 lg:pb-16 xl:pb-20" style={{width: '95%', maxWidth: '1400px'}}>
              {/* Header */}
              <div className="mb-6 sm:mb-8 lg:mb-12 text-center">
                <h2 className="text-xl sm:text-2xl lg:text-3xl xl:text-4xl font-bold mb-3 sm:mb-4" style={{color: '#E1A5F1'}}>Preventive Maintenance Dashboard</h2>
          </div>

              {/* Dashboard Image */}
              <div 
                onClick={() => window.open('https://stori.tradisco.co.id/login', '_blank')}
                className="cursor-pointer hover:opacity-90 transition-opacity"
              >
                <img 
                  src="/assets/dashboard.png" 
                  alt="Dashboard Preview" 
                  className="w-full h-auto rounded-lg shadow-lg"
                />
            </div>
          </div>
        </div>
        </div>
      </div>

      {/* As seen on */}
      <h3 className="text-center mt-10 mb-4 sm:mb-6 lg:mb-8 font-medium" style={{color: '#306BB0', fontSize: '33px'}}>{content.asSeenOn}</h3>
      <div className="bg-white py-6 sm:py-8 lg:py-12 mt-6 mb-10" style={{borderRadius: '20px'}}>
        <div className="max-w-7xl mx-auto px-2 sm:px-4">
          <div className="overflow-hidden">
            <div className="flex items-center gap-4 sm:gap-8 lg:gap-12 xl:gap-16 opacity-100 animate-marquee">
              {/* First set of logos */}
              <div className="w-20 h-12 sm:w-24 sm:h-16 lg:w-28 lg:h-20 xl:w-32 xl:h-24 flex items-center justify-center flex-shrink-0">
                <img 
                  src="/assets/kompascom.png" 
                  alt="Kompas Logo" 
                  className="w-full h-full object-contain"
                />
              </div>
              <div className="w-20 h-12 sm:w-24 sm:h-16 lg:w-28 lg:h-20 xl:w-32 xl:h-24 flex items-center justify-center flex-shrink-0">
                <img 
                  src="/assets/indo_aktual.webp" 
                  alt="Indo Aktual Logo" 
                  className="w-full h-full object-contain"
                />
              </div>
              <div className="w-20 h-12 sm:w-24 sm:h-16 lg:w-28 lg:h-20 xl:w-32 xl:h-24 flex items-center justify-center flex-shrink-0">
                <img 
                  src="/assets/kabarbaru.webp" 
                  alt="Kabar Regional Logo" 
                  className="w-full h-full object-contain"
                />
              </div>
              <div className="w-20 h-12 sm:w-24 sm:h-16 lg:w-28 lg:h-20 xl:w-32 xl:h-24 flex items-center justify-center flex-shrink-0">
                <img 
                  src="/assets/kompasiana.png" 
                  alt="Kompasiana Logo" 
                  className="w-full h-full object-contain"
                />
              </div>
              <div className="w-20 h-12 sm:w-24 sm:h-16 lg:w-28 lg:h-20 xl:w-32 xl:h-24 flex items-center justify-center flex-shrink-0">
                <img 
                  src="/assets/ieee.png" 
                  alt="IEEE Logo" 
                  className="w-full h-full object-contain"
                />
              </div>
              
              {/* Duplicate set for seamless loop */}
              <div className="w-20 h-12 sm:w-24 sm:h-16 lg:w-28 lg:h-20 xl:w-32 xl:h-24 flex items-center justify-center flex-shrink-0">
                <img 
                  src="/assets/kompascom.png" 
                  alt="Kompas Logo" 
                  className="w-full h-full object-contain"
                />
              </div>
              <div className="w-20 h-12 sm:w-24 sm:h-16 lg:w-28 lg:h-20 xl:w-32 xl:h-24 flex items-center justify-center flex-shrink-0">
                <img 
                  src="/assets/indo_aktual.webp" 
                  alt="Indo Aktual Logo" 
                  className="w-full h-full object-contain"
                />
              </div>
              <div className="w-20 h-12 sm:w-24 sm:h-16 lg:w-28 lg:h-20 xl:w-32 xl:h-24 flex items-center justify-center flex-shrink-0">
                <img 
                  src="/assets/kabarbaru.webp" 
                  alt="Kabar Regional Logo" 
                  className="w-full h-full object-contain"
                />
              </div>
              <div className="w-20 h-12 sm:w-24 sm:h-16 lg:w-28 lg:h-20 xl:w-32 xl:h-24 flex items-center justify-center flex-shrink-0">
                <img 
                  src="/assets/kompasiana.png" 
                  alt="Kompasiana Logo" 
                  className="w-full h-full object-contain"
                />
              </div>
              <div className="w-20 h-12 sm:w-24 sm:h-16 lg:w-28 lg:h-20 xl:w-32 xl:h-24 flex items-center justify-center flex-shrink-0">
                <img 
                  src="/assets/ieee.png" 
                  alt="IEEE Logo" 
                  className="w-full h-full object-contain"
                />
              </div>
            </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Section with Two Columns */}
      <div className="py-6 sm:py-8 lg:py-12 xl:py-16" style={{backgroundColor: '#F6F6F6'}}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-0 items-stretch">
            {/* Left Column */}
            <div className="flex flex-col items-start gap-4 sm:gap-6 bg-white rounded-t-2xl lg:rounded-l-2xl lg:rounded-tr-none p-4 sm:p-5 lg:p-6" style={{minHeight: 'auto'}}>
              {/* Logo STORI with Social Media Icons */}
              <div className="w-full">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 sm:gap-0 mb-4 sm:mb-6">
                  <div className="flex items-center gap-3 sm:gap-4">
                    <img 
                      src="/assets/Stori-removebg-preview (1).png"
                      alt="STORI Logo" 
                      className="h-10 sm:h-12 lg:h-16 xl:h-20 w-auto"
                    />
                    <div>
                      <h3 className="text-xl sm:text-2xl lg:text-3xl xl:text-4xl font-bold text-gray-900">STORI</h3>
                      <p className="text-xs sm:text-sm lg:text-base text-gray-600">System Monitoring</p>
                    </div>
                  </div>
                  
                  {/* Social Media Icons */}
                  <div className="flex items-center gap-3 sm:gap-4 ml-4 sm:ml-0">
                    {/* WhatsApp */}
                    <a href="#" className="text-blue-600 hover:text-blue-700 transition-colors">
                      <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488"/>
                      </svg>
                    </a>
                    {/* Instagram */}
                    <a href="#" className="text-blue-600 hover:text-blue-700 transition-colors">
                      <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                      </svg>
                    </a>
                    {/* Facebook */}
                    <a href="#" className="text-blue-600 hover:text-blue-700 transition-colors">
                      <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                      </svg>
                    </a>
                    {/* YouTube */}
                    <a href="#" className="text-blue-600 hover:text-blue-700 transition-colors">
                      <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                      </svg>
                    </a>
                  </div>
                </div>
                
                {/* Navigation Section */}
                <div className="mb-4 sm:mb-6">
                  <h4 className="text-base sm:text-lg lg:text-xl font-bold text-gray-900 mb-3 sm:mb-4">Navigate</h4>
                  <div className="flex flex-col gap-2">
                    <a href="#products" className="text-gray-700 hover:text-gray-900 transition-colors text-sm sm:text-base">Product & Services</a>
                    <a href="#solutions" className="text-gray-700 hover:text-gray-900 transition-colors text-sm sm:text-base">Solutions</a>
                    <a href="#pricing" className="text-gray-700 hover:text-gray-900 transition-colors text-sm sm:text-base">Pricing</a>
                  </div>
                </div>
              </div>
            </div>

            {/* Middle Column - Decorative Lines */}
            <div className="hidden lg:flex items-end justify-center bg-white rounded-r-2xl lg:rounded-l-none">
              <img 
                src="/assets/garis-removebg-preview.png" 
                alt="Decorative Lines" 
                className="object-contain"
                style={{height: '363px'}}
              />
            </div>

            {/* Right Column */}
            <div className="rounded-b-2xl lg:rounded-r-2xl lg:rounded-bl-none p-5 sm:p-6 lg:p-8 xl:p-10" style={{backgroundColor: '#72307C'}}>
              <h3 className="text-xl sm:text-2xl lg:text-3xl xl:text-4xl font-bold text-white mb-3 sm:mb-4 lg:mb-6">Stay Up To Date</h3>
              <p className="text-white text-sm sm:text-base lg:text-lg mb-4 sm:mb-6 lg:mb-8">
                STORI is the smart solution for organizations that need real-time performance tracking and asset visibility. Stay informed, improve efficiency, and make smarter decisions effortlessly.
              </p>
              <button className="w-full px-5 sm:px-6 py-2.5 sm:py-3 border-2 rounded-lg font-medium hover:bg-white hover:text-purple-900 transition-all flex items-center justify-center gap-2 text-sm sm:text-base" style={{borderColor: '#9BEDEF', color: '#9BEDEF'}}>
                Sign Up for Latest News
                <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="#9BEDEF" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="relative py-6 sm:py-8 lg:py-12" style={{backgroundColor: '#333333'}}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 lg:gap-8 mb-6 sm:mb-8">
            {/* Left Section - Logo */}
            <div className="lg:col-span-1">
              <div className="flex items-center gap-3 mb-2">
                <img 
                  src="/assets/Stori.jpg" 
                    alt="STORI Logo" 
                  className="h-10 sm:h-12 lg:h-14 w-auto"
                  />
                <div>
                  <h3 className="text-xl sm:text-2xl lg:text-3xl font-bold text-white">STORI</h3>
                  <p className="text-sm sm:text-base text-white">System Monitoring</p>
                </div>
              </div>
              </div>

            {/* Technical Support Section - 2 Columns */}
            <div className="lg:col-span-2">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
              <div>
                  <h4 className="text-sm sm:text-base font-bold text-white mb-2 sm:mb-3">TECHNICAL SUPPORT:</h4>
                  <div className="text-white text-xs sm:text-sm">
                    <div>+62 811-1010-0330</div>
                    <div>team@tradisco.co.id</div>
                  </div>
                  </div>
                  <div>
                  <h4 className="text-sm sm:text-base font-bold text-white mb-2 sm:mb-3">TECHNICAL SUPPORT:</h4>
                  <div className="text-white text-xs sm:text-sm">
                    <div>+62 811-102-239</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Office Addresses Section - 3 Columns */}
            <div className="lg:col-span-2">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
                <div>
                  <h4 className="text-sm sm:text-base font-bold text-white mb-2 sm:mb-3">HEAD OFFICE:</h4>
                  <div className="text-white text-xs sm:text-sm">
                    <div>Gedung Artha Graha, 26 Floor (SCBD) Jalan Jend.</div>
                    <div>Sudirman No. 52-53 Kelurahan Senayan, Kec.</div>
                    <div>Kebayoran Baru, Kota Adm Jakarta Selatan,</div>
                    <div>Provinsi DKI Jakarta 12190</div>
                  </div>
                </div>
                <div>
                  <h4 className="text-sm sm:text-base font-bold text-white mb-2 sm:mb-3">BACK OFFICE:</h4>
                  <div className="text-white text-xs sm:text-sm">
                    <div>Gedung The CEO Tower Lantai 15</div>
                    <div>Jl. TB Simatupang, Cilandak</div>
                    <div>Jakarta Selatan</div>
                </div>
                </div>
                <div>
                  <h4 className="text-sm sm:text-base font-bold text-white mb-2 sm:mb-3">OPERATION SERVICE:</h4>
                  <div className="text-white text-xs sm:text-sm">
                    <div>PALMA ONE Lantai 2</div>
                    <div>Jl. H.R. Rasuna Said Kav. X2 No.4</div>
                    <div>Kuningan, Jakarta Selatan 12950,</div>
                    <div>Indonesia</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Border and Copyright */}
          <div className="border-t border-gray-600 pt-4 sm:pt-6">
            <div className="text-center text-xs sm:text-sm text-white">
              © 2024 STORI. All rights reserved. | System Monitoring
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}