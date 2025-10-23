import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Bell, User, Settings, LogOut, CheckCircle, AlertTriangle, Clock, FileText, Wrench, CheckSquare } from 'lucide-react';
import { useAuth } from '../auth/AuthContext';

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const profileDropdownRef = useRef(null);

  // Sample notifications data for teknisi
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      type: 'new_task',
      title: 'Pekerjaan Baru',
      message: 'Task maintenance Genset A telah ditugaskan kepada Anda',
      time: '2 menit yang lalu',
      isRead: false,
      icon: Wrench,
      color: 'text-blue-600'
    },
    {
      id: 2,
      type: 'deadline',
      title: 'Deadline Mendekat',
      message: 'Task Dispenser A akan jatuh tempo dalam 2 jam',
      time: '15 menit yang lalu',
      isRead: false,
      icon: Clock,
      color: 'text-orange-600'
    },
    {
      id: 3,
      type: 'report_approved',
      title: 'Laporan Disetujui',
      message: 'Laporan maintenance Panel Listrik telah disetujui oleh ABH',
      time: '1 jam yang lalu',
      isRead: true,
      icon: CheckCircle,
      color: 'text-green-600'
    },
    {
      id: 4,
      type: 'report_rejected',
      title: 'Laporan Ditolak',
      message: 'Laporan maintenance Tank Monitoring ditolak - perlu revisi',
      time: '3 jam yang lalu',
      isRead: false,
      icon: AlertTriangle,
      color: 'text-red-600'
    },
    {
      id: 5,
      type: 'new_task',
      title: 'Pekerjaan Baru',
      message: 'Task maintenance CCTV System telah ditugaskan kepada Anda',
      time: '5 jam yang lalu',
      isRead: true,
      icon: Wrench,
      color: 'text-blue-600'
    }
  ]);

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
    // For teknisi, don't show title in header for these pages
    const teknisiPagesWithoutHeaderTitle = ['/equipment', '/task', '/maintenance-report', '/notifications-teknisi'];
    if (user?.role === 'teknisi' && teknisiPagesWithoutHeaderTitle.includes(location.pathname)) {
      return '';
    }
    
    switch (location.pathname) {
      case '/':
      case '/dashboard':
        return user?.role === 'admin' ? 'Preventive Maintenance Dashboard' : '';
      case '/equipment':
        return 'Equipment Management';
      case '/notifications':
        return 'Notifications';
      case '/notifications-teknisi':
        return 'Notifikasi Teknisi';
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
      case '/task':
        return 'Task Management';
      case '/maintenance-report':
        return 'Laporan Maintenance';
      default:
        return user?.role === 'admin' ? 'Preventive Maintenance Dashboard' : '';
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // Notification functions
  const unreadCount = notifications.filter(notif => !notif.isRead).length;

  return (
    <div className="bg-white shadow-sm border-b px-6 sticky top-0 z-50" style={{ backgroundColor: '#ffffff', height: '64px' }}>
      <div className="flex items-center justify-between h-full relative">
        <Link to="/dashboard" className="text-xl font-semibold transition-colors" style={{ color: '#e53935' }}>
          {getPageTitle()}
        </Link>

        {/* Centered Company Logo */}
        <div className="absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2 flex items-center" style={{ backgroundColor: '#fff', borderRadius: '6px', padding: '1px 4px' }}>
          <img 
            src="/assets/pertamina-patraniaga-logo.png" 
            alt="PATRA NIAGA" 
            className="h-12 w-auto object-contain"
          />
        </div>

        <div className="flex items-center space-x-4">
          {/* Notifications - For teknisi */}
          {user?.role === 'teknisi' && (
            <Link 
              to="/notifications-teknisi"
              className="relative p-2 transition-colors"
            >
              <Bell className="w-6 h-6" style={{ color: '#006cb8' }} />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 text-xs rounded-full flex items-center justify-center" style={{ backgroundColor: '#006cb8', color: '#ffffff' }}>
                  {unreadCount}
                </span>
              )}
            </Link>
          )}

          {/* Notifications - Only for admin */}
          {user?.role === 'admin' && (
            <Link to="/notifications" className="relative">
              <Bell className="w-6 h-6 cursor-pointer hover:opacity-90 transition-opacity" style={{ color: '#006cb8' }} />
              <span className="absolute -top-1 -right-1 w-3 h-3 rounded-full" style={{ backgroundColor: '#006cb8' }}></span>
            </Link>
          )}

          {/* Profile Dropdown */}
          <div className="relative" ref={profileDropdownRef}>
            <button 
              onClick={() => setShowProfileDropdown(!showProfileDropdown)}
              className="w-8 h-8 bg-white rounded-full cursor-pointer hover:bg-blue-50 transition-colors flex items-center justify-center border"
              style={{ borderColor: '#006cb8' }}
            >
              <User className="w-4 h-4" style={{ color: '#006cb8', strokeWidth: 2.5 }} />
            </button>
            
            {showProfileDropdown && (
              <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-2xl border z-50 overflow-hidden" style={{ borderColor: '#006cb8' }}>
                {/* Header with Gradient */}
                <div className="px-4 py-5" style={{ background: 'linear-gradient(to right, #006cb8, #0088e0)' }}>
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-md">
                      <User className="w-6 h-6" style={{ color: '#006cb8' }} />
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-white">
                        {user?.name || 'User'}
                      </div>
                      <div className="text-xs" style={{ color: '#b3d9f2' }}>
                        {user?.role === 'admin' ? 'Administrator' : 'Teknisi'}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Menu Items */}
                <div className="p-2">
                  {user?.role === 'admin' && (
                    <>
                      <Link 
                        to="/settings" 
                        className="w-full text-left px-4 py-3 text-sm text-gray-700 rounded-lg flex items-center transition-all group hover:bg-opacity-10"
                        style={{ '--hover-bg': '#006cb8' }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.backgroundColor = '#e6f2ff';
                          e.currentTarget.style.color = '#006cb8';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.backgroundColor = '';
                          e.currentTarget.style.color = '';
                        }}
                      >
                        <div className="w-8 h-8 rounded-lg flex items-center justify-center mr-3 transition-colors" style={{ backgroundColor: '#e6f2ff' }}>
                          <User className="w-4 h-4" style={{ color: '#006cb8' }} />
                        </div>
                        <span className="font-medium">Profile</span>
                      </Link>
                      <Link 
                        to="/settings" 
                        className="w-full text-left px-4 py-3 text-sm text-gray-700 rounded-lg flex items-center transition-all group"
                        onMouseEnter={(e) => {
                          e.currentTarget.style.backgroundColor = '#e6f2ff';
                          e.currentTarget.style.color = '#006cb8';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.backgroundColor = '';
                          e.currentTarget.style.color = '';
                        }}
                      >
                        <div className="w-8 h-8 rounded-lg flex items-center justify-center mr-3 transition-colors" style={{ backgroundColor: '#e6f2ff' }}>
                          <Settings className="w-4 h-4" style={{ color: '#006cb8' }} />
                        </div>
                        <span className="font-medium">Settings</span>
                      </Link>
                      <div className="border-t border-gray-100 my-2"></div>
                    </>
                  )}
                  <button 
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-3 text-sm text-red-600 hover:text-red-700 rounded-lg flex items-center transition-all group"
                  >
                    <LogOut className="w-4 h-4 mr-3" />
                    <span className="font-medium">Logout</span>
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
