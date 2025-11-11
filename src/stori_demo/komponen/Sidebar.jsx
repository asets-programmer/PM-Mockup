import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  BarChart3, 
  Activity, 
  FileText, 
  Settings, 
  Bell, 
  Calendar, 
  Users, 
  LogOut,
  CheckSquare,
  Briefcase,
  Monitor,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  Droplet,
  Thermometer,
  Shield
} from 'lucide-react';
import storiLogo from '/assets/Stori.jpg';
import { useAuth } from '../auth/AuthContext';

const Sidebar = ({ minimized = false, onToggleMinimize }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [commandCenterOpen, setCommandCenterOpen] = useState(() => {
    // Auto-open if on any feature detail page
    return location.pathname.startsWith('/app/features/');
  });
  
  // Auto-open dropdown when navigating to feature pages
  useEffect(() => {
    if (location.pathname.startsWith('/app/features/')) {
      setCommandCenterOpen(true);
    }
  }, [location.pathname]);
  
  // Command Center submenu items
  const commandCenterSubmenu = [
    { icon: Droplet, label: 'Smart Drip AI', path: '/app/features/smart-drip' },
    { icon: Monitor, label: 'Touchscreen Health', path: '/app/features/touchscreen' },
    { icon: Thermometer, label: 'ThermalWatch', path: '/app/features/thermalwatch' },
    { icon: Shield, label: 'Sentinel', path: '/app/features/sentinel' }
  ];
  
  // Sidebar menu items with access levels
  const allMenuItems = [
    // Dashboard - All roles
    { icon: BarChart3, label: 'Dashboard', path: '/app/dashboard', roles: ['operator', 'technician', 'manager', 'hq_admin', 'admin', 'teknisi'] },
    
    // Command Center - Manager and HQ Admin only (with dropdown)
    { icon: Monitor, label: 'Command Center', path: '/app/command-center', roles: ['manager', 'hq_admin'], hasSubmenu: true },
    
    // Equipment - Technician, Manager, HQ Admin
    { icon: Settings, label: 'Equipment', path: '/app/equipment', roles: ['technician', 'manager', 'hq_admin', 'admin', 'teknisi'] },
    
    // Task - Technician, Manager, HQ Admin
    { icon: CheckSquare, label: 'Task', path: '/app/task', roles: ['technician', 'manager', 'hq_admin', 'admin', 'teknisi'] },
    
    // Work Orders - Manager and HQ Admin only
    { icon: Briefcase, label: 'Work Orders', path: '/app/work-orders', roles: ['manager', 'hq_admin'] },
    
    // Notifications - All roles (but different access levels)
    { icon: Bell, label: 'Notifications', path: '/app/notifications', roles: ['operator', 'technician', 'manager', 'hq_admin', 'admin'] },
    
    // Reports - Manager and HQ Admin only
    { icon: BarChart3, label: 'Reports', path: '/app/reports', roles: ['manager', 'hq_admin'] },
    
    // Schedule - Manager and HQ Admin only
    { icon: Calendar, label: 'Schedule', path: '/app/schedule', roles: ['manager', 'hq_admin'] },
    
    // HQ Analytics - HQ Admin only
    { icon: Activity, label: 'HQ Analytics', path: '/app/hq-analytics', roles: ['hq_admin'] },
    
    // Settings - Manager and HQ Admin only
    { icon: Settings, label: 'Settings', path: '/app/settings', roles: ['manager', 'hq_admin'] },
    
    // Logout - All roles
    { icon: LogOut, label: 'Logout', isLogout: true, roles: ['operator', 'technician', 'manager', 'hq_admin', 'admin', 'teknisi'] }
  ];

  // Filter menu items based on user role
  const menuItems = allMenuItems.filter(item => 
    item.roles.includes(user?.role || '')
  );

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className={`${minimized ? 'w-16' : 'w-64'} bg-[#72307C] shadow-lg transition-all duration-300 relative flex flex-col h-screen`}>
      {/* Toggle Button */}
      <button
        onClick={onToggleMinimize}
        className="absolute right-2 top-4 z-20 w-7 h-7 bg-white border-2 border-[#72307C] rounded-full flex items-center justify-center shadow-lg hover:bg-gray-50 hover:border-white transition-colors"
        title={minimized ? 'Expand Sidebar' : 'Minimize Sidebar'}
      >
        {minimized ? (
          <ChevronRight className="w-4 h-4 text-[#72307C]" />
        ) : (
          <ChevronLeft className="w-4 h-4 text-[#72307C]" />
        )}
      </button>

      {/* Logo */}
      <div className={`flex items-center p-4 border-b border-[#72307C]/30 flex-shrink-0 ${minimized ? 'justify-center' : ''}`}>
        <div className={`w-10 h-10 ${minimized ? '' : 'mr-3'}`}>
          <img 
            src={storiLogo} 
            alt="Stori Logo" 
            className="w-full h-full object-contain"
          />
        </div>
        {!minimized && (
          <div>
            <div className="font-bold text-white">STORI</div>
            <div className="text-xs text-white/80 font-semibold">System Monitoring</div>
          </div>
        )}
      </div>

      {/* Menu Items - Scrollable */}
      <nav className="mt-4 flex-1 overflow-y-auto overflow-x-hidden pb-4">
        {menuItems.map((item, index) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path || (location.pathname === '/app' && item.path === '/app/dashboard');
          const isCommandCenter = item.label === 'Command Center';
          
          // Handle Command Center with dropdown (only when not minimized)
          if (isCommandCenter && item.hasSubmenu && !minimized) {
            const isCommandCenterActive = location.pathname === '/app/command-center' || location.pathname.startsWith('/app/features/');
            return (
              <div key={index}>
                <div className="flex items-center">
                  <Link
                    to={item.path}
                    className={`flex-1 flex items-center px-4 py-3.5 text-sm cursor-pointer transition-colors ${
                      isCommandCenterActive 
                        ? 'bg-white/20 text-white border-r-2 border-white'
                        : 'text-white/80 hover:bg-white/10'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span className="ml-3.5">{item.label}</span>
                  </Link>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setCommandCenterOpen(!commandCenterOpen);
                    }}
                    className={`px-2 py-3.5 text-sm cursor-pointer transition-colors ${
                      isCommandCenterActive 
                        ? 'text-white'
                        : 'text-white/80 hover:bg-white/10'
                    }`}
                  >
                    {commandCenterOpen ? (
                      <ChevronUp className="w-4 h-4" />
                    ) : (
                      <ChevronDown className="w-4 h-4" />
                    )}
                  </button>
                </div>
                
                {/* Submenu */}
                {commandCenterOpen && (
                  <div className="bg-[#72307C]/80">
                    {commandCenterSubmenu.map((subItem, subIndex) => {
                      const SubIcon = subItem.icon;
                      const isSubActive = location.pathname === subItem.path;
                      return (
                        <Link
                          key={subIndex}
                          to={subItem.path}
                          className={`flex items-center px-4 py-2.5 text-sm cursor-pointer transition-colors pl-12 ${
                            isSubActive
                              ? 'bg-white/20 text-white border-r-2 border-white'
                              : 'text-white/70 hover:bg-white/10'
                          }`}
                        >
                          <SubIcon className="w-4 h-4" />
                          <span className="ml-3">{subItem.label}</span>
                        </Link>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          }
          
          if (item.isLogout) {
            return (
              <button
                key={index}
                onClick={handleLogout}
                className={`w-full flex items-center ${minimized ? 'justify-center px-2' : 'px-4'} py-3.5 text-sm cursor-pointer transition-colors text-white hover:bg-white/20`}
                title={minimized ? item.label : ''}
              >
                <Icon className="w-5 h-5" />
                {!minimized && <span className="ml-3.5">{item.label}</span>}
              </button>
            );
          }

          if (item.isComingSoon) {
            return (
              <div
                key={index}
                className={`flex items-center ${minimized ? 'justify-center px-2' : 'px-4'} py-3.5 text-sm text-white/50 cursor-not-allowed opacity-60`}
                title={minimized ? item.label : ''}
              >
                <Icon className="w-5 h-5" />
                {!minimized && (
                  <div className="flex flex-col ml-3.5">
                    <span>{item.label}</span>
                    {item.subtitle && (
                      <span className="text-xs text-[#e7f75b] font-medium">{item.subtitle}</span>
                    )}
                  </div>
                )}
              </div>
            );
          }
          
          // Skip Command Center if already rendered with dropdown (only when not minimized)
          if (isCommandCenter && item.hasSubmenu && !minimized) {
            return null;
          }
          
          return (
            <Link
              key={index}
              to={item.path}
              className={`flex items-center ${minimized ? 'justify-center px-2' : 'px-4'} py-3.5 text-sm cursor-pointer transition-colors ${
                isActive 
                  ? minimized
                    ? 'bg-white/20 text-white'
                    : 'bg-white/20 text-white border-r-2 border-white'
                  : 'text-white/80 hover:bg-white/10'
              }`}
              title={minimized ? item.label : ''}
            >
              <Icon className="w-5 h-5" />
              {!minimized && (
                <div className="flex flex-col ml-3.5">
                  <span>{item.label}</span>
                  {item.subtitle && (
                    <span className="text-xs text-[#AFC150] font-medium">{item.subtitle}</span>
                  )}
                </div>
              )}
            </Link>
          );
        })}
      </nav>
    </div>
  );
};

export default Sidebar;
