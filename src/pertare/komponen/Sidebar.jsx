import React, { useState, useEffect, useRef } from 'react';
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
  ClipboardList,
  ChevronLeft,
  ChevronRight,
  MapPin
} from 'lucide-react';
import storiLogo from '/assets/Stori.jpg';
import { useAuth } from '../auth/AuthContext';

const Sidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const logoSectionRef = useRef(null);
  const toggleSectionRef = useRef(null);

  const updateNavbarHeight = () => {
    const logoH = logoSectionRef.current?.offsetHeight || 0;
    const toggleH = toggleSectionRef.current?.offsetHeight || 0;
    const total = logoH + toggleH;
    if (total > 0) {
      document.documentElement.style.setProperty('--navbar-height', `${total}px`);
    }
  };

  useEffect(() => {
    updateNavbarHeight();
    const onResize = () => updateNavbarHeight();
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  useEffect(() => {
    // recalc when collapsed state changes
    updateNavbarHeight();
  }, [isCollapsed]);
  
  // Sidebar menu items
  const allMenuItems = [
    { icon: BarChart3, label: 'Dashboard', path: '/pertare/dashboard', roles: ['admin', 'teknisi'] },
    { icon: MapPin, label: 'Unit Responsibility', path: '/pertare/unit-responsibility', roles: ['admin'] },
    { icon: Settings, label: 'Equipment', path: '/pertare/equipment', roles: ['admin', 'teknisi'] },
    { icon: CheckSquare, label: 'Task', path: '/pertare/task', roles: ['admin', 'teknisi'] },
    { icon: ClipboardList, label: 'Laporan Maintenance', path: '/pertare/maintenance-report', roles: ['teknisi'] },
    { icon: Bell, label: 'Notifikasi', path: '/pertare/notifications', roles: ['teknisi'] },
    { icon: Briefcase, label: 'Work Orders', path: '/pertare/work-orders', roles: ['admin'] },
    { icon: Bell, label: 'Notifications', path: '/pertare/notifications', roles: ['admin'] },
    { icon: BarChart3, label: 'Reports', path: '/pertare/reports', roles: ['admin'] },
    { icon: Calendar, label: 'Schedule', path: '/pertare/schedule', roles: ['admin'] },
    { icon: Users, label: 'Team', path: '/pertare/team', roles: ['admin'] },
    { icon: Settings, label: 'Settings', path: '/pertare/settings', roles: ['admin'] },
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
    <div className={`shadow-lg transition-all duration-500 ease-in-out ${isCollapsed ? 'w-16' : 'w-64'}`} style={{ backgroundColor: '#006cb8' }}>
      {/* Logo */}
      <div ref={logoSectionRef} className={`flex items-center px-4 ${isCollapsed ? 'justify-center' : ''}`} style={{ backgroundColor: '#006cb8', height: '64px' }}>
        <div className={`transition-all duration-500 ease-in-out ${isCollapsed ? 'w-12 h-12' : 'w-10 h-10 mr-3'}`}>
          <img 
            src={storiLogo} 
            alt="Stori Logo" 
            className="w-full h-full object-contain"
          />
        </div>
        <div className={`transition-all duration-500 ease-in-out overflow-hidden ${isCollapsed ? 'w-0 opacity-0' : 'w-auto opacity-100'}`}>
          <div className="font-bold text-lg" style={{ color: '#fff' }}>STORI</div>
          <div className="text-xs font-semibold" style={{ color: '#fff' }}>System Monitoring</div>
        </div>
      </div>

      {/* Toggle Button */}
      <div ref={toggleSectionRef} className="flex justify-end px-4 py-2">
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="p-2 rounded-lg hover:bg-white hover:bg-opacity-10 transition-all duration-200"
        >
          <div className="transition-transform duration-300 ease-in-out">
            {isCollapsed ? (
              <ChevronRight className="w-4 h-4 text-white" />
            ) : (
              <ChevronLeft className="w-4 h-4 text-white" />
            )}
          </div>
        </button>
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
                className={`w-full flex items-center px-4 py-3.5 text-sm cursor-pointer transition-colors hover:text-white ${isCollapsed ? 'justify-center' : ''}`}
                style={{ color: '#e53935' }}
                onMouseEnter={(e) => {
                  e.target.style.backgroundColor = '#e53935';
                  e.target.style.color = '#fff';
                }}
                onMouseLeave={(e) => {
                  e.target.style.backgroundColor = 'transparent';
                  e.target.style.color = '#e53935';
                }}
                title={isCollapsed ? item.label : ''}
              >
                <Icon className="w-5 h-5" />
                {!isCollapsed && <span className="ml-3.5">{item.label}</span>}
              </button>
            );
          }

          if (item.isComingSoon) {
            return (
              <div
                key={index}
                className={`flex items-center px-4 py-3.5 text-sm cursor-not-allowed opacity-60 ${isCollapsed ? 'justify-center' : ''}`}
                style={{ color: '#fff' }}
                title={isCollapsed ? item.label : ''}
              >
                <Icon className="w-5 h-5" />
                {!isCollapsed && <span className="ml-3.5">{item.label}</span>}
              </div>
            );
          }
          
          return (
            <Link
              key={index}
              to={item.path}
              className={`flex items-center px-4 py-3.5 text-sm cursor-pointer transition-colors ${isCollapsed ? 'justify-center' : ''}`}
              style={{
                backgroundColor: isActive ? 'rgba(255, 255, 255, 0.2)' : 'transparent',
                color: '#fff',
                borderRight: isActive ? '4px solid #acc42a' : 'none'
              }}
              onMouseEnter={(e) => {
                e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
                e.target.style.color = '#fff';
              }}
              onMouseLeave={(e) => {
                e.target.style.backgroundColor = isActive ? 'rgba(255, 255, 255, 0.2)' : 'transparent';
                e.target.style.color = '#fff';
              }}
              title={isCollapsed ? item.label : ''}
            >
              <Icon className="w-5 h-5" />
              {!isCollapsed && <span className="ml-3.5">{item.label}</span>}
            </Link>
          );
        })}
      </nav>
    </div>
  );
};

export default Sidebar;
