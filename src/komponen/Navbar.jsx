import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Bell, ChevronDown, User, Settings, LogOut, Building2 } from 'lucide-react';

const Navbar = () => {
  const location = useLocation();
  const [showCompanyDropdown, setShowCompanyDropdown] = useState(false);
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const companyDropdownRef = useRef(null);
  const profileDropdownRef = useRef(null);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (companyDropdownRef.current && !companyDropdownRef.current.contains(event.target)) {
        setShowCompanyDropdown(false);
      }
      if (profileDropdownRef.current && !profileDropdownRef.current.contains(event.target)) {
        setShowProfileDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);
  
  const getPageTitle = () => {
    switch (location.pathname) {
      case '/':
      case '/dashboard':
        return 'Preventive Maintenance Dashboard';
      case '/equipment':
        return 'Equipment Management';
      case '/notifications':
        return 'Notifications';
      case '/process-flow':
        return 'Process Flow';
      case '/reports':
        return 'Reports & Analytics';
      case '/schedule':
        return 'Schedule Management';
      case '/settings':
        return 'Settings';
      case '/team':
        return 'Team Management';
      case '/work-orders':
        return 'Work Orders';
      default:
        return 'Preventive Maintenance Dashboard';
    }
  };

  const companies = [
    { id: 1, name: 'Pertamina Retail', location: 'Jakarta' },
    { id: 2, name: 'Pertamina Retail Bandung', location: 'Bandung' },
    { id: 3, name: 'Pertamina Retail Surabaya', location: 'Surabaya' },
    { id: 4, name: 'Pertamina Retail Medan', location: 'Medan' }
  ];

  return (
    <div className="bg-white shadow-sm border-b px-6 py-4 sticky top-0 z-50">
      <div className="flex items-center justify-between">
        <Link to="/dashboard" className="text-xl font-semibold text-gray-800 hover:text-blue-600 transition-colors">
          {getPageTitle()}
        </Link>
        <div className="flex items-center space-x-4">
          {/* Company Dropdown */}
          <div className="relative" ref={companyDropdownRef}>
            <button 
              onClick={() => setShowCompanyDropdown(!showCompanyDropdown)}
              className="flex items-center bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors"
            >
              Pertamina Retail
              <ChevronDown className="w-4 h-4 ml-2" />
            </button>
            
            {showCompanyDropdown && (
              <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg border z-50">
                <div className="p-2">
                  <div className="px-3 py-2 text-sm font-medium text-gray-500 border-b">
                    Pilih Perusahaan
                  </div>
                  {companies.map((company) => (
                    <button
                      key={company.id}
                      className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg flex items-center"
                    >
                      <Building2 className="w-4 h-4 mr-3 text-gray-400" />
                      <div>
                        <div className="font-medium">{company.name}</div>
                        <div className="text-xs text-gray-500">{company.location}</div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Notifications */}
          <Link to="/notifications" className="relative">
            <Bell className="w-6 h-6 text-gray-500 cursor-pointer hover:text-gray-700 transition-colors" />
            <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></span>
          </Link>

          {/* Profile Dropdown */}
          <div className="relative" ref={profileDropdownRef}>
            <button 
              onClick={() => setShowProfileDropdown(!showProfileDropdown)}
              className="w-8 h-8 bg-gray-400 rounded-full cursor-pointer hover:bg-gray-500 transition-colors flex items-center justify-center"
            >
              <User className="w-4 h-4 text-white" />
            </button>
            
            {showProfileDropdown && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border z-50">
                <div className="p-2">
                  <div className="px-3 py-2 text-sm font-medium text-gray-500 border-b">
                    Admin User
                  </div>
                  <Link 
                    to="/settings" 
                    className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg flex items-center"
                  >
                    <User className="w-4 h-4 mr-3 text-gray-400" />
                    Profile
                  </Link>
                  <Link 
                    to="/settings" 
                    className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg flex items-center"
                  >
                    <Settings className="w-4 h-4 mr-3 text-gray-400" />
                    Settings
                  </Link>
                  <button className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg flex items-center">
                    <LogOut className="w-4 h-4 mr-3 text-gray-400" />
                    Logout
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
