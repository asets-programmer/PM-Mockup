import React from 'react';
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
  Briefcase
} from 'lucide-react';
import storiLogo from '../assets/Stori.jpg';
import { useAuth } from '../auth/AuthContext';

const Sidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  
  // Sidebar menu items
  const allMenuItems = [
    { icon: BarChart3, label: 'Dashboard', path: '/dashboard', roles: ['admin', 'teknisi'] },
    { icon: Settings, label: 'Equipment', path: '/equipment', roles: ['admin', 'teknisi'] },
    { icon: CheckSquare, label: 'Task', path: '/task', roles: ['admin', 'teknisi'] },
    { icon: Activity, label: 'Process Flow', path: '/process-flow', roles: ['admin'] },
    { icon: Briefcase, label: 'Work Orders', path: '/work-orders', roles: ['admin'] },
    { icon: Bell, label: 'Notifications', path: '/notifications', roles: ['admin'] },
    { icon: BarChart3, label: 'Reports', path: '/reports', roles: ['admin'] },
    { icon: Calendar, label: 'Schedule', path: '/schedule', roles: ['admin'] },
    { icon: Users, label: 'Team', path: '/team', roles: ['admin'] },
    { icon: Settings, label: 'Settings', path: '/settings', roles: ['admin'] },
    { icon: LogOut, label: 'Logout', isLogout: true, roles: ['admin', 'teknisi'] }
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
    <div className="w-64 bg-white shadow-lg">
      {/* Logo */}
      <div className="flex items-center p-4 border-b">
        <div className="w-10 h-10 mr-3">
          <img 
            src={storiLogo} 
            alt="Stori Logo" 
            className="w-full h-full object-contain"
          />
        </div>
        <div>
          <div className="font-bold text-gray-800">STORI</div>
          <div className="text-xs text-gray-500 font-semibold">System Monitoring</div>
        </div>
      </div>

      {/* Menu Items */}
      <nav className="mt-4">
        {menuItems.map((item, index) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path || (location.pathname === '/' && item.path === '/dashboard');
          
          if (item.isLogout) {
            return (
              <button
                key={index}
                onClick={handleLogout}
                className="w-full flex items-center px-4 py-3.5 text-sm cursor-pointer transition-colors text-red-500 hover:bg-red-50"
              >
                <Icon className="w-5 h-5 mr-3.5" />
                {item.label}
              </button>
            );
          }

          if (item.isComingSoon) {
            return (
              <div
                key={index}
                className="flex items-center px-4 py-3.5 text-sm text-gray-400 cursor-not-allowed opacity-60"
              >
                <Icon className="w-5 h-5 mr-3.5" />
                <div className="flex flex-col">
                  <span>{item.label}</span>
                  {item.subtitle && (
                    <span className="text-xs text-orange-500 font-medium">{item.subtitle}</span>
                  )}
                </div>
              </div>
            );
          }
          
          return (
            <Link
              key={index}
              to={item.path}
              className={`flex items-center px-4 py-3.5 text-sm cursor-pointer transition-colors ${
                isActive 
                  ? 'bg-blue-50 text-blue-600 border-r-2 border-blue-600' 
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              <Icon className="w-5 h-5 mr-3.5" />
              <div className="flex flex-col">
                <span>{item.label}</span>
                {item.subtitle && (
                  <span className="text-xs text-blue-500 font-medium">{item.subtitle}</span>
                )}
              </div>
            </Link>
          );
        })}
      </nav>
    </div>
  );
};

export default Sidebar;
