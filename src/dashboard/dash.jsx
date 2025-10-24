import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Menu, X, ChevronDown, MessageSquare } from 'lucide-react';
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
    { name: content.productsServices, link: "#products" },
    { name: content.solutions, link: "#solutions" },
    { name: content.pricing, link: "#pricing" }
  ];

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
      `}</style>
      
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

          {/* Navigation Items */}
          <NavItems items={navItems} />

          {/* Right Side Actions */}
          <div className="flex items-center space-x-1 sm:space-x-2 lg:space-x-4">
            {/* Language Dropdown */}
              <div className="relative" data-dropdown>
                <button 
                  onClick={() => setActiveDropdown(activeDropdown === 'language' ? null : 'language')}
                  className="flex items-center text-gray-600 hover:text-gray-900 w-12 sm:w-16 lg:w-20 justify-center text-xs sm:text-sm lg:text-base"
                >
                  <img src={earthGlobeIcon} alt="Language" className="w-4 h-4 mr-1" /> {language} <ChevronDown className="ml-1 w-3 h-3 lg:w-4 lg:h-4" />
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

            {/* Login Button */}
            <NavbarButton 
              href="/login"
              onClick={() => navigate('/login')}
              className="text-white px-2 sm:px-3 lg:px-6 py-1 sm:py-2 lg:py-3 rounded-full transition-colors text-xs sm:text-sm lg:text-base navbar-compact:px-1 navbar-compact:py-1 navbar-compact:w-8 navbar-compact:h-8 navbar-compact:justify-center navbar-compact:items-center navbar-compact:flex"
              style={{backgroundColor: '#3730A3'}}
            >
              <img 
                src={userIcon} 
                alt="User" 
                className="w-4 h-4 lg:w-5 lg:h-5 mr-1 lg:mr-2 navbar-compact:mr-0 navbar-compact:w-4 navbar-compact:h-4 navbar-compact:block hidden navbar-compact:m-auto navbar-compact:ml-0"
                style={{filter: 'brightness(0) invert(1)'}}
              />
              <span className="navbar-compact:hidden">{content.login}</span>
            </NavbarButton>

            {/* Contact Button */}
            <NavbarButton 
              className="bg-green-500 text-white px-2 sm:px-3 lg:px-6 py-1 sm:py-2 lg:py-3 rounded-full flex items-center hover:bg-green-600 transition-colors text-xs sm:text-sm lg:text-base navbar-compact:px-1 navbar-compact:py-1 navbar-compact:w-8 navbar-compact:h-8 navbar-compact:justify-center"
            >
              <svg className="w-4 h-4 lg:w-5 lg:h-5 mr-1 lg:mr-2 navbar-compact:mr-0 navbar-compact:w-4 navbar-compact:h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488"/>
              </svg>
              <span className="navbar-compact:hidden">{content.contactUs}</span>
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
                  style={{backgroundColor: '#3730A3'}}
                >
                  {content.login}
                </button>
                
                <button 
                  className="w-full bg-green-500 text-white px-4 py-3 rounded-lg flex items-center justify-center hover:bg-green-600 transition-colors"
                >
                  <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488"/>
                  </svg>
                  {content.contactUs}
                </button>
              </div>
            </div>
          )}
        </div>
      </Navbar>

      {/* Hero Section */}
      <div className="relative bg-gradient-to-br from-indigo-900 via-indigo-800 to-indigo-900">
        {/* Building Background Image */}
        <div 
          className="absolute inset-0 bg-center bg-no-repeat opacity-20"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80')`,
            backgroundSize: 'cover',
            backgroundAttachment: 'fixed'
          }}
        ></div>
        {/* Content */}
        <div className="relative z-10">
        <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-6 xl:px-8 pt-6 sm:pt-8 lg:pt-12 pb-8 sm:pb-12 lg:pb-16 xl:pb-20 text-center">
          <div className="mb-2 sm:mb-4 min-h-[60px] sm:min-h-[80px] lg:min-h-[100px] xl:min-h-[120px] flex flex-col items-center justify-center">
            <div className="text-center">
              {/* Static STORI text */}
              <div className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-white mb-1 sm:mb-2">
                STORI
              </div>
              {/* Animated subtitle */}
              <TextType
                text={["System Monitoring Built for Insight"]}
                typingSpeed={80}
                pauseDuration={2000}
                deletingSpeed={40}
                loop={true}
                className="text-lg sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl font-semibold text-white"
                showCursor={true}
                cursorCharacter="|"
                cursorClassName="text-white animate-pulse"
                textColors={['#ffffff', '#e0e7ff', '#c7d2fe']}
                initialDelay={500}
              />
            </div>
          </div>
          <p className="text-sm sm:text-base lg:text-lg xl:text-xl text-indigo-100 mb-4 sm:mb-6 lg:mb-8 px-2 sm:px-4">
            {content.heroText.split('\n').map((line, index) => (
              <React.Fragment key={index}>
                {line}
                {index < content.heroText.split('\n').length - 1 && <br />}
              </React.Fragment>
            ))}
          </p>

          {/* AI Assistant Banner */}
          <div className="max-w-4xl mx-auto mt-6 sm:mt-8 lg:mt-12 xl:mt-16 mb-6 sm:mb-8 lg:mb-10 xl:mb-12">
            <div className="bg-white rounded-lg sm:rounded-xl lg:rounded-2xl p-3 sm:p-4 lg:p-6 shadow-xl">
              <div className="flex flex-col items-start justify-start space-y-4">
                {/* AI Assistant Info */}
                <div className="flex items-start space-x-3 sm:space-x-4">
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
                  <div className="text-left">
                    <h3 className="text-base sm:text-lg lg:text-xl xl:text-2xl font-bold text-gray-900 mb-1">{content.aiAssistantTitle}</h3>
                    <p className="text-gray-600 text-xs sm:text-sm">
                      {content.aiAssistantSubtitle}
                    </p>
                  </div>
                </div>

                {/* Ask Section */}
                <div className="flex items-center space-x-2 sm:space-x-4">
                  <div className="text-left">
                    <p className="text-gray-600 text-xs sm:text-sm">{content.askAbout}</p>
                    <p className="text-gray-900 font-semibold text-sm sm:text-base lg:text-lg">{content.maintenanceOperations}</p>
                  </div>
                </div>
              </div>
              
              {/* Input Placeholder */}
              <div className="mt-3 sm:mt-4 lg:mt-6">
                <div className="relative">
                  <input 
                    type="text" 
                    placeholder={content.askPlaceholder} 
                    className="w-full px-2 sm:px-3 lg:px-4 py-2 sm:py-3 pr-16 sm:pr-20 lg:pr-24 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-gray-600 bg-gray-50 text-xs sm:text-sm lg:text-base"
                    disabled
                  />
                  <button 
                    onClick={() => navigate('/login')}
                    className="absolute right-1 sm:right-2 top-1/2 transform -translate-y-1/2 text-white px-2 sm:px-3 lg:px-4 py-1 sm:py-2 rounded-md font-semibold text-xs sm:text-sm hover:opacity-90 transition-colors flex items-center shadow-sm" 
                    style={{backgroundColor: '#3730a3'}}
                  >
                    <span className="hidden sm:inline">{content.loginToChat}</span>
                    <span className="sm:hidden">Login</span>
                    <svg className="w-3 h-3 sm:w-4 sm:h-4 ml-1 sm:ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                </div>
                <p className="text-gray-500 text-xs mt-1 sm:mt-2">{content.loginRequired}</p>
              </div>
            </div>
          </div>

          {/* Freemium Popular Features */}
          <div className="max-w-6xl mx-auto mb-8 sm:mb-12 lg:mb-16">
            <div className="text-center mb-4 sm:mb-6 lg:mb-8">
              <div className="inline-flex items-center bg-green-100 text-green-800 text-xs sm:text-sm font-medium px-2 sm:px-3 py-1 rounded-full mb-3 sm:mb-4">
                <svg className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                {content.freeFeatures}
              </div>
              <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-white mb-3 sm:mb-4">{content.freemiumTitle}</h2>
              <p className="text-sm sm:text-base lg:text-lg text-indigo-100 px-2 sm:px-4">{content.freemiumDescription}</p>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 lg:gap-6">
              {/* AI Maintenance Consultant */}
              <div className="bg-gradient-to-br from-cyan-500/20 to-cyan-600/20 backdrop-blur-sm rounded-lg sm:rounded-xl p-3 sm:p-4 lg:p-6 hover:from-cyan-500/30 hover:to-cyan-600/30 transition-all cursor-pointer group border border-cyan-400/30">
                <div className="flex items-center justify-between mb-2 sm:mb-3 lg:mb-4">
                  <div className="w-12 h-12 sm:w-16 sm:h-16 lg:w-20 lg:h-20 bg-cyan-500 rounded-lg flex items-center justify-center">
                    <img 
                      src="/assets/AI_Maintenance_Consultant_Icon.jpg" 
                      alt="AI Maintenance Consultant" 
                      className="w-full h-full object-cover rounded-lg"
                    />
                  </div>
                  <svg className="w-4 h-4 sm:w-5 sm:h-5 text-white group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
                <h3 className="text-white font-bold text-sm sm:text-base lg:text-lg mb-1 sm:mb-2">{content.aiMaintenanceConsultant}</h3>
                <p className="text-indigo-200 text-xs sm:text-sm">{content.aiMaintenanceConsultantDesc}</p>
              </div>

              {/* AI Document Generator */}
              <div 
                onClick={() => navigate('/ai-document-generator')}
                className="bg-gradient-to-br from-lime-500/20 to-lime-600/20 backdrop-blur-sm rounded-lg sm:rounded-xl p-3 sm:p-4 lg:p-6 hover:from-lime-500/30 hover:to-lime-600/30 transition-all cursor-pointer group border border-lime-400/30"
              >
                <div className="flex items-center justify-between mb-2 sm:mb-3 lg:mb-4">
                  <div className="w-12 h-12 sm:w-16 sm:h-16 lg:w-20 lg:h-20 bg-lime-500 rounded-lg flex items-center justify-center">
                    <img 
                      src="/assets/AI_Document_Generator.png" 
                      alt="AI Document Generator" 
                      className="w-full h-full object-cover rounded-lg"
                    />
                  </div>
                  <svg className="w-4 h-4 sm:w-5 sm:h-5 text-white group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
                <h3 className="text-white font-bold text-sm sm:text-base lg:text-lg mb-1 sm:mb-2">{content.aiDocumentGenerator}</h3>
                <p className="text-indigo-200 text-xs sm:text-sm">{content.aiDocumentGeneratorDesc}</p>
              </div>

              {/* Basic Maintenance Report Viewer */}
              <div className="bg-gradient-to-br from-pink-500/20 to-pink-600/20 backdrop-blur-sm rounded-lg sm:rounded-xl p-3 sm:p-4 lg:p-6 hover:from-pink-500/30 hover:to-pink-600/30 transition-all cursor-pointer group border border-pink-400/30">
                <div className="flex items-center justify-between mb-2 sm:mb-3 lg:mb-4">
                  <div className="w-12 h-12 sm:w-16 sm:h-16 lg:w-20 lg:h-20 bg-pink-500 rounded-lg flex items-center justify-center">
                    <img 
                      src="/assets/Basic_Maintenance_Report_Viewer.jpg" 
                      alt="Basic Maintenance Report Viewer" 
                      className="w-full h-full object-cover rounded-lg"
                    />
                  </div>
                  <svg className="w-4 h-4 sm:w-5 sm:h-5 text-white group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
                <h3 className="text-white font-bold text-sm sm:text-base lg:text-lg mb-1 sm:mb-2">{content.basicMaintenanceReport}</h3>
                <p className="text-indigo-200 text-xs sm:text-sm">{content.basicMaintenanceReportDesc}</p>
              </div>
            </div>
          </div>

          {/* Advance STORI for All Business */}
          <div className="max-w-6xl mx-auto mb-8 sm:mb-12 lg:mb-16">
            <div className="text-center mb-4 sm:mb-6 lg:mb-8">
              <div className="inline-flex items-center text-white text-xs sm:text-sm font-bold px-2 sm:px-3 lg:px-4 py-1 sm:py-2 rounded-full mb-3 sm:mb-4 shadow-lg" style={{background: 'linear-gradient(135deg, #FFD700, #FFA500, #FFD700)'}}>
                <svg className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
                {content.premiumFeatures}
              </div>
              <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-white mb-3 sm:mb-4">{content.advanceStoriTitle}</h2>
              <p className="text-sm sm:text-base lg:text-lg text-indigo-100 px-2 sm:px-4">{content.advanceStoriDescription}</p>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 lg:gap-6">
              {/* Dashboard Monitoring */}
              <div className="bg-gradient-to-br from-indigo-500/30 to-purple-600/30 backdrop-blur-sm rounded-lg sm:rounded-xl p-4 sm:p-5 lg:p-6 hover:from-indigo-500/40 hover:to-purple-600/40 transition-all cursor-pointer group border border-indigo-400/40 shadow-xl">
                <div className="flex items-center justify-between mb-3 sm:mb-4">
                  <div className="w-16 h-16 sm:w-18 sm:h-18 lg:w-20 lg:h-20 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center shadow-lg">
                    <img 
                      src="/assets/Dashboard_Monitoring.png" 
                      alt="Dashboard Monitoring" 
                      className="w-full h-full object-cover rounded-lg"
                    />
                  </div>
                  <svg className="w-5 h-5 text-white group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
                <h3 className="text-white font-bold text-base sm:text-lg mb-1 sm:mb-2">{content.dashboardMonitoring}</h3>
                <p className="text-indigo-200 text-xs sm:text-sm">{content.dashboardMonitoringDesc}</p>
              </div>

              {/* Auto Scheduling & Smart Notification */}
              <div className="bg-gradient-to-br from-emerald-500/30 to-teal-600/30 backdrop-blur-sm rounded-lg sm:rounded-xl p-4 sm:p-5 lg:p-6 hover:from-emerald-500/40 hover:to-teal-600/40 transition-all cursor-pointer group border border-emerald-400/40 shadow-xl">
                <div className="flex items-center justify-between mb-3 sm:mb-4">
                  <div className="w-16 h-16 sm:w-18 sm:h-18 lg:w-20 lg:h-20 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-lg flex items-center justify-center shadow-lg">
                    <img 
                      src="/assets/Auto_Scheduling.png" 
                      alt="Auto Scheduling & Smart Notification" 
                      className="w-full h-full object-cover rounded-lg"
                    />
                  </div>
                  <svg className="w-5 h-5 text-white group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
                <h3 className="text-white font-bold text-base sm:text-lg mb-1 sm:mb-2">{content.autoScheduling}</h3>
                <p className="text-indigo-200 text-xs sm:text-sm">{content.autoSchedulingDesc}</p>
              </div>

              {/* Task & Assignment Management */}
              <div className="bg-gradient-to-br from-violet-500/30 to-purple-600/30 backdrop-blur-sm rounded-lg sm:rounded-xl p-4 sm:p-5 lg:p-6 hover:from-violet-500/40 hover:to-purple-600/40 transition-all cursor-pointer group border border-violet-400/40 shadow-xl">
                <div className="flex items-center justify-between mb-3 sm:mb-4">
                  <div className="w-16 h-16 sm:w-18 sm:h-18 lg:w-20 lg:h-20 bg-gradient-to-br from-violet-500 to-purple-600 rounded-lg flex items-center justify-center shadow-lg">
                    <img 
                      src="/assets/Task.png" 
                      alt="Task & Assignment Management" 
                      className="w-full h-full object-cover rounded-lg"
                    />
                  </div>
                  <svg className="w-5 h-5 text-white group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
                <h3 className="text-white font-bold text-base sm:text-lg mb-1 sm:mb-2">{content.taskManagement}</h3>
                <p className="text-indigo-200 text-xs sm:text-sm">{content.taskManagementDesc}</p>
              </div>

              {/* Centered row: Predictive + Integration */}
              <div className="lg:col-span-3 flex flex-col md:flex-row justify-center gap-3 sm:gap-4 lg:gap-6">
                {/* Predictive Analytics Engine */}
                <div className="bg-gradient-to-br from-amber-500/30 to-orange-600/30 backdrop-blur-sm rounded-lg sm:rounded-xl p-4 sm:p-5 lg:p-6 hover:from-amber-500/40 hover:to-orange-600/40 transition-all cursor-pointer group w-full md:w-auto md:max-w-sm border border-amber-400/40 shadow-xl">
                  <div className="flex items-center justify-between mb-3 sm:mb-4">
                    <div className="w-16 h-16 sm:w-18 sm:h-18 lg:w-20 lg:h-20 bg-gradient-to-br from-amber-500 to-orange-600 rounded-lg flex items-center justify-center shadow-lg">
                      <img 
                        src="/assets/Predictive.png" 
                        alt="Predictive Analytics Engine" 
                        className="w-full h-full object-cover rounded-lg"
                      />
                    </div>
                    <svg className="w-5 h-5 text-white group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                  <h3 className="text-white font-bold text-base sm:text-lg mb-1 sm:mb-2">{content.predictiveAnalytics}</h3>
                  <p className="text-indigo-200 text-xs sm:text-sm">{content.predictiveAnalyticsDesc}</p>
                </div>

                {/* Integration Hub */}
                <div className="bg-gradient-to-br from-rose-500/30 to-pink-600/30 backdrop-blur-sm rounded-lg sm:rounded-xl p-4 sm:p-5 lg:p-6 hover:from-rose-500/40 hover:to-pink-600/40 transition-all cursor-pointer group w-full md:w-auto md:max-w-sm border border-rose-400/40 shadow-xl">
                  <div className="flex items-center justify-between mb-3 sm:mb-4">
                    <div className="w-16 h-16 sm:w-18 sm:h-18 lg:w-20 lg:h-20 bg-gradient-to-br from-rose-500 to-pink-600 rounded-lg flex items-center justify-center shadow-lg">
                      <img 
                        src="/assets/Integration.png" 
                        alt="Integration Hub" 
                        className="w-full h-full object-cover rounded-lg"
                      />
                    </div>
                    <svg className="w-5 h-5 text-white group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                  <h3 className="text-white font-bold text-base sm:text-lg mb-1 sm:mb-2">{content.integrationHub}</h3>
                  <p className="text-indigo-200 text-xs sm:text-sm">{content.integrationHubDesc}</p>
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
      <div className="bg-white py-6 sm:py-8 lg:py-12">
        <div className="max-w-7xl mx-auto px-2 sm:px-4">
          <h3 className="text-center text-gray-500 mb-4 sm:mb-6 lg:mb-8 text-xs sm:text-sm lg:text-base">{content.asSeenOn}</h3>
          <div className="overflow-hidden">
            <div className="flex items-center gap-4 sm:gap-8 lg:gap-12 xl:gap-16 opacity-60 animate-marquee">
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

      {/* Footer */}
      <footer className="relative py-6 sm:py-8 lg:py-12 bg-gradient-to-br from-indigo-900 via-indigo-800 to-indigo-900 overflow-hidden">
        {/* Building Background Image */}
        <div 
          className="absolute inset-0 bg-center bg-no-repeat opacity-10"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80')`,
            backgroundSize: 'cover',
            backgroundAttachment: 'fixed'
          }}
        ></div>
        
        <div className="relative z-10 max-w-7xl mx-auto px-2 sm:px-4">
          <div className="flex flex-col lg:flex-row gap-4 sm:gap-6 lg:gap-8">
            {/* Left Section - Logo & Contact */}
            <div className="flex-1">
              <div className="mb-3 sm:mb-4 lg:mb-6">
                <div className="flex items-center mb-1 sm:mb-2">
                  <img 
                    src={storiLogo} 
                    alt="STORI Logo" 
                    className="w-5 h-5 sm:w-6 sm:h-6 lg:w-8 lg:h-8 rounded-lg object-cover mr-1 sm:mr-2 lg:mr-3"
                  />
                  <span className="text-lg sm:text-xl lg:text-2xl font-bold text-white">STORI</span>
                </div>
                <p className="text-purple-100 text-xs sm:text-sm">System Monitoring</p>
              </div>

              {/* Contact Us */}
              <div>
                <h4 className="text-xs sm:text-sm font-semibold text-white mb-1 sm:mb-2 lg:mb-3">{content.contactUs}</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3 lg:gap-4 text-xs sm:text-sm text-purple-100">
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
              <h4 className="text-xs sm:text-sm font-semibold text-white mb-1 sm:mb-2 lg:mb-3">{content.officeLocations}</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-3 lg:gap-4 text-xs sm:text-sm text-purple-100">
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
          <div className="border-t border-purple-400/30 mt-4 sm:mt-6 lg:mt-8 pt-3 sm:pt-4 lg:pt-6">
            <div className="text-center text-xs sm:text-sm text-purple-100">
              {content.copyright}
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}