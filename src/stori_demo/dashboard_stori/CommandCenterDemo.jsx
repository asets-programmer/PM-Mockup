import React, { useEffect } from 'react';
import { AuthProvider } from '../auth/AuthContext';
import CommandCenterDashboard from './CommandCenterDashboard';

// Demo user untuk show ke juri
const demoUser = {
  id: 'demo-user',
  name: 'Demo Manager',
  role: 'manager',
  email: 'demo@stori.ai'
};

// Wrapper untuk set demo user di localStorage
const DemoAuthWrapper = ({ children }) => {
  useEffect(() => {
    // Set demo user di localStorage untuk AuthProvider
    localStorage.setItem('user', JSON.stringify(demoUser));
    
    // Cleanup saat unmount (optional, bisa dihapus jika ingin tetap login)
    return () => {
      // Bisa dihapus atau dibiarkan tergantung kebutuhan
    };
  }, []);

  return <>{children}</>;
};

const CommandCenterDemo = () => {
  return (
    <AuthProvider>
      <DemoAuthWrapper>
        <CommandCenterDashboard />
      </DemoAuthWrapper>
    </AuthProvider>
  );
};

export default CommandCenterDemo;

