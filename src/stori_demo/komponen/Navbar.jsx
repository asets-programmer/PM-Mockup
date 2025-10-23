import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Bell, User, Settings, LogOut } from 'lucide-react';
import { useAuth } from '../auth/AuthContext';

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const profileDropdownRef = useRef(null);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
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
      case '/app':
      case '/app/dashboard':
        return 'Preventive Maintenance Dashboard';
      case '/app/equipment':
        return 'Equipment Management';
      case '/app/notifications':
        return 'Notifications';
      case '/app/process-flow':
        return 'Process Flow';
      case '/app/reports':
        return 'Reports & Analytics';
      case '/app/schedule':
        return 'Schedule Management';
      case '/app/settings':
        return 'Settings';
      case '/app/team':
        return 'Team Management';
      case '/app/work-orders':
        return 'Work Orders';
      case '/app/task':
        return 'Task Management';
      default:
        return 'Preventive Maintenance Dashboard';
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="bg-white shadow-sm border-b px-6 py-4 sticky top-0 z-50">
      <div className="flex items-center justify-between">
        <Link to="/app/dashboard" className="text-xl font-semibold text-gray-800 hover:text-blue-600 transition-colors">
          {getPageTitle()}
        </Link>
        <div className="flex items-center space-x-4">
          {/* Notifications - Only for admin */}
          {user?.role === 'admin' && (
            <Link to="/app/notifications" className="relative">
              <Bell className="w-6 h-6 text-gray-500 cursor-pointer hover:text-gray-700 transition-colors" />
              <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></span>
            </Link>
          )}

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
                    {user?.name || 'User'}
                  </div>
                  <div className="px-3 py-1 text-xs text-gray-400 border-b">
                    Role: {user?.role === 'admin' ? 'Administrator' : 'Teknisi'}
                  </div>
                  {user?.role === 'admin' && (
                    <>
                      <Link 
                        to="/app/settings" 
                        className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg flex items-center"
                      >
                        <User className="w-4 h-4 mr-3 text-gray-400" />
                        Profile
                      </Link>
                      <Link 
                        to="/app/settings" 
                        className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg flex items-center"
                      >
                        <Settings className="w-4 h-4 mr-3 text-gray-400" />
                        Settings
                      </Link>
                    </>
                  )}
                  <button 
                    onClick={handleLogout}
                    className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg flex items-center"
                  >
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
