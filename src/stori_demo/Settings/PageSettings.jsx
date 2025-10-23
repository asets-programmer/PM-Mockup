import React, { useState } from 'react';
import { 
  Search, 
  Filter, 
  Download, 
  Save,
  User,
  Bell,
  Shield,
  Key,
  Eye,
  EyeOff,
  Check,
  X,
  Edit,
  Trash2,
  Plus,
  AlertTriangle,
  CheckCircle,
  Settings
} from 'lucide-react';
import Navbar from '../komponen/Navbar';
import Sidebar from '../komponen/Sidebar';

const PageSettings = () => {
  const [activeTab, setActiveTab] = useState('profile');
  const [showPassword, setShowPassword] = useState(false);
  const [showApiKey, setShowApiKey] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [saved, setSaved] = useState(false);

  // Sample data pengaturan
  const userProfile = {
    name: 'Admin Pertamina',
    email: 'admin@pertamina.com',
    role: 'Super Admin',
    department: 'IT Maintenance',
    phone: '+62 812-3456-7890',
    avatar: null,
    lastLogin: '2025-08-15 14:30:25',
    permissions: ['read', 'write', 'delete', 'admin']
  };

  const notificationSettings = {
    email: {
      enabled: true,
      highPriority: true,
      maintenanceDue: true,
      taskCompleted: true,
      systemUpdates: false
    },
    whatsapp: {
      enabled: true,
      highPriority: true,
      maintenanceDue: false,
      taskCompleted: false,
      systemUpdates: false
    },
    push: {
      enabled: true,
      highPriority: true,
      maintenanceDue: true,
      taskCompleted: true,
      systemUpdates: true
    }
  };

  const systemSettings = {
    maintenance: {
      autoWorkOrder: true,
      slaThreshold: 95,
      escalationTime: 4,
      reminderInterval: 2
    },
    equipment: {
      // Maintenance intervals berdasarkan running hours (jam operasi)
      dispenserMaintenanceInterval: 250, // Dispenser: maintenance setiap 250 jam
      gensetMaintenanceInterval: 500,    // Genset: maintenance setiap 500 jam
      cctvMaintenanceInterval: 1000,    // CCTV: maintenance setiap 1000 jam
      atgMaintenanceInterval: 750,      // ATG: maintenance setiap 750 jam
      panelMaintenanceInterval: 2000,   // Panel Listrik: maintenance setiap 2000 jam
      
      // Health score degradation per jam operasi
      healthDegradationRate: 0.01,      // Health turun 0.01% per jam operasi
      criticalThreshold: 70,            // Health < 70% = Critical
      warningThreshold: 85,             // Health 70-85% = Warning
      autoAlert: true
    },
    reporting: {
      autoGenerate: true,
      schedule: 'daily',
      recipients: ['admin@pertamina.com', 'manager@pertamina.com'],
      format: 'pdf'
    }
  };


  const apiKeys = [
    {
      id: 'api-001',
      name: 'Maintenance API',
      key: 'pm_sk_1234567890abcdef',
      permissions: ['read', 'write'],
      lastUsed: '2025-08-15 14:30:25',
      expires: '2025-12-31',
      status: 'Active'
    },
    {
      id: 'api-002',
      name: 'Reporting API',
      key: 'pm_rp_abcdef1234567890',
      permissions: ['read'],
      lastUsed: '2025-08-15 10:15:30',
      expires: '2025-06-30',
      status: 'Active'
    },
    {
      id: 'api-003',
      name: 'Integration API',
      key: 'pm_in_9876543210fedcba',
      permissions: ['read', 'write', 'admin'],
      lastUsed: '2025-08-14 16:45:20',
      expires: '2025-03-31',
      status: 'Expired'
    }
  ];

  const tabs = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'system', label: 'System', icon: Settings },
    { id: 'security', label: 'Security', icon: Shield }
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'Connected': return 'text-green-600 bg-green-100';
      case 'Disconnected': return 'text-red-600 bg-red-100';
      case 'Active': return 'text-green-600 bg-green-100';
      case 'Expired': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };


  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const maskApiKey = (key) => {
    return key.substring(0, 8) + '...' + key.substring(key.length - 4);
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        {/* Navbar */}
        <Navbar />

        <div className="p-6">
          {/* Header */}
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-800 mb-2">Settings</h1>
            <p className="text-gray-600">Kelola pengaturan sistem dan preferensi pengguna</p>
          </div>

          {/* Tabs */}
          <div className="bg-white rounded-lg shadow-sm mb-6">
            <div className="border-b border-gray-200">
              <nav className="flex space-x-8 px-6">
                {tabs.map((tab) => {
                  const Icon = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`flex items-center py-4 px-1 border-b-2 font-medium text-sm ${
                        activeTab === tab.id
                          ? 'border-blue-500 text-blue-600'
                          : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                      }`}
                    >
                      <Icon className="w-4 h-4 mr-2" />
                      {tab.label}
                    </button>
                  );
                })}
              </nav>
            </div>

            <div className="p-6">
              {/* Profile Tab */}
              {activeTab === 'profile' && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h2 className="text-lg font-semibold text-gray-800">Profile Information</h2>
                    <button
                      onClick={() => setIsEditing(!isEditing)}
                      className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      <Edit className="w-4 h-4 mr-2" />
                      {isEditing ? 'Cancel' : 'Edit Profile'}
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                      <input
                        type="text"
                        value={userProfile.name}
                        disabled={!isEditing}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                      <input
                        type="email"
                        value={userProfile.email}
                        disabled={!isEditing}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Role</label>
                      <input
                        type="text"
                        value={userProfile.role}
                        disabled
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-100"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Department</label>
                      <input
                        type="text"
                        value={userProfile.department}
                        disabled={!isEditing}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
                      <input
                        type="tel"
                        value={userProfile.phone}
                        disabled={!isEditing}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Last Login</label>
                      <input
                        type="text"
                        value={userProfile.lastLogin}
                        disabled
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-100"
                      />
                    </div>
                  </div>

                  {isEditing && (
                    <div className="flex justify-end space-x-4">
                      <button
                        onClick={() => setIsEditing(false)}
                        className="px-4 py-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-colors"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={handleSave}
                        className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                      >
                        <Save className="w-4 h-4 mr-2" />
                        Save Changes
                      </button>
                    </div>
                  )}
                </div>
              )}

              {/* Notifications Tab */}
              {activeTab === 'notifications' && (
                <div className="space-y-6">
                  <h2 className="text-lg font-semibold text-gray-800">Notification Preferences</h2>
                  
                  <div className="space-y-6">
                    {/* Email Notifications */}
                    <div className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-md font-semibold text-gray-800">Email Notifications</h3>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input type="checkbox" className="sr-only peer" defaultChecked={notificationSettings.email.enabled} />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                        </label>
                      </div>
                      <div className="space-y-2">
                        {Object.entries(notificationSettings.email).slice(1).map(([key, value]) => (
                          <label key={key} className="flex items-center">
                            <input type="checkbox" className="rounded border-gray-300 text-blue-600 focus:ring-blue-500" defaultChecked={value} />
                            <span className="ml-2 text-sm text-gray-700 capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</span>
                          </label>
                        ))}
                      </div>
                    </div>

                    {/* WhatsApp Notifications */}
                    <div className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-md font-semibold text-gray-800">WhatsApp Notifications</h3>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input type="checkbox" className="sr-only peer" defaultChecked={notificationSettings.whatsapp.enabled} />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                        </label>
                      </div>
                      <div className="space-y-2">
                        {Object.entries(notificationSettings.whatsapp).slice(1).map(([key, value]) => (
                          <label key={key} className="flex items-center">
                            <input type="checkbox" className="rounded border-gray-300 text-blue-600 focus:ring-blue-500" defaultChecked={value} />
                            <span className="ml-2 text-sm text-gray-700 capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</span>
                          </label>
                        ))}
                      </div>
                    </div>

                    {/* Push Notifications */}
                    <div className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-md font-semibold text-gray-800">Push Notifications</h3>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input type="checkbox" className="sr-only peer" defaultChecked={notificationSettings.push.enabled} />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                        </label>
                      </div>
                      <div className="space-y-2">
                        {Object.entries(notificationSettings.push).slice(1).map(([key, value]) => (
                          <label key={key} className="flex items-center">
                            <input type="checkbox" className="rounded border-gray-300 text-blue-600 focus:ring-blue-500" defaultChecked={value} />
                            <span className="ml-2 text-sm text-gray-700 capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-end">
                    <button
                      onClick={handleSave}
                      className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                    >
                      <Save className="w-4 h-4 mr-2" />
                      Save Settings
                    </button>
                  </div>
                </div>
              )}

              {/* System Tab */}
              {activeTab === 'system' && (
                <div className="space-y-6">
                  <h2 className="text-lg font-semibold text-gray-800">System Configuration</h2>
                  
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Left Column */}
                    <div className="space-y-6">
                      {/* Maintenance Settings */}
                      <div className="border border-gray-200 rounded-lg p-4">
                        <h3 className="text-md font-semibold text-gray-800 mb-4">Maintenance Settings</h3>
                        <div className="space-y-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Auto Work Order Generation</label>
                            <label className="relative inline-flex items-center cursor-pointer">
                              <input type="checkbox" className="sr-only peer" defaultChecked={systemSettings.maintenance.autoWorkOrder} />
                              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                            </label>
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">SLA Threshold (%)</label>
                            <input
                              type="number"
                              defaultValue={systemSettings.maintenance.slaThreshold}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Escalation Time (hours)</label>
                            <input
                              type="number"
                              defaultValue={systemSettings.maintenance.escalationTime}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                          </div>
                        </div>
                      </div>

                      {/* Health Score Settings */}
                      <div className="border border-gray-200 rounded-lg p-4">
                        <h3 className="text-md font-semibold text-gray-800 mb-4">Health Score Settings</h3>
                        <div className="space-y-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Health Degradation Rate (% per hour)</label>
                            <input
                              type="number"
                              step="0.01"
                              defaultValue={systemSettings.equipment.healthDegradationRate}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                            <p className="text-xs text-gray-500 mt-1">Health score turun 0.01% per jam operasi</p>
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">Critical Threshold (%)</label>
                              <input
                                type="number"
                                defaultValue={systemSettings.equipment.criticalThreshold}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                              />
                              <p className="text-xs text-gray-500 mt-1">Health &lt; 70% = Critical</p>
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">Warning Threshold (%)</label>
                              <input
                                type="number"
                                defaultValue={systemSettings.equipment.warningThreshold}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                              />
                              <p className="text-xs text-gray-500 mt-1">Health 70-85% = Warning</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Equipment Settings */}
                    <div className="border border-gray-200 rounded-lg p-4">
                      <h3 className="text-md font-semibold text-gray-800 mb-4">Equipment Maintenance Intervals (Running Hours)</h3>
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Dispenser Maintenance Interval (hours)</label>
                          <input
                            type="number"
                            defaultValue={systemSettings.equipment.dispenserMaintenanceInterval}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          />
                          <p className="text-xs text-gray-500 mt-1">Maintenance setiap 250 jam operasi dispenser</p>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Genset Maintenance Interval (hours)</label>
                          <input
                            type="number"
                            defaultValue={systemSettings.equipment.gensetMaintenanceInterval}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          />
                          <p className="text-xs text-gray-500 mt-1">Maintenance setiap 500 jam operasi genset</p>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">CCTV Maintenance Interval (hours)</label>
                          <input
                            type="number"
                            defaultValue={systemSettings.equipment.cctvMaintenanceInterval}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          />
                          <p className="text-xs text-gray-500 mt-1">Maintenance setiap 1000 jam operasi CCTV</p>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">ATG Maintenance Interval (hours)</label>
                          <input
                            type="number"
                            defaultValue={systemSettings.equipment.atgMaintenanceInterval}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          />
                          <p className="text-xs text-gray-500 mt-1">Maintenance setiap 750 jam operasi ATG</p>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Panel Listrik Maintenance Interval (hours)</label>
                          <input
                            type="number"
                            defaultValue={systemSettings.equipment.panelMaintenanceInterval}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          />
                          <p className="text-xs text-gray-500 mt-1">Maintenance setiap 2000 jam operasi panel</p>
                        </div>
                      </div>
                    </div>

                  </div>

                  <div className="flex justify-end">
                    <button
                      onClick={handleSave}
                      className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                    >
                      <Save className="w-4 h-4 mr-2" />
                      Save Settings
                    </button>
                  </div>
                </div>
              )}


              {/* Security Tab */}
              {activeTab === 'security' && (
                <div className="space-y-6">
                  <h2 className="text-lg font-semibold text-gray-800">Security & API Keys</h2>
                  
                  {/* Change Password */}
                  <div className="border border-gray-200 rounded-lg p-4">
                    <h3 className="text-md font-semibold text-gray-800 mb-4">Change Password</h3>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Current Password</label>
                        <div className="relative">
                          <input
                            type={showPassword ? 'text' : 'password'}
                            className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="Enter current password"
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute inset-y-0 right-0 pr-3 flex items-center"
                          >
                            {showPassword ? <EyeOff className="w-4 h-4 text-gray-400" /> : <Eye className="w-4 h-4 text-gray-400" />}
                          </button>
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">New Password</label>
                        <input
                          type="password"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="Enter new password"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Confirm New Password</label>
                        <input
                          type="password"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="Confirm new password"
                        />
                      </div>
                    </div>
                    <div className="mt-4">
                      <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                        Change Password
                      </button>
                    </div>
                  </div>

                  {/* API Keys */}
                  <div className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-md font-semibold text-gray-800">API Keys</h3>
                      <button className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                        <Plus className="w-4 h-4 mr-2" />
                        Generate New Key
                      </button>
                    </div>
                    
                    <div className="space-y-4">
                      {apiKeys.map((apiKey) => (
                        <div key={apiKey.id} className="border border-gray-200 rounded-lg p-4">
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="font-medium text-gray-800">{apiKey.name}</h4>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(apiKey.status)}`}>
                              {apiKey.status}
                            </span>
                          </div>
                          <div className="space-y-2 text-sm text-gray-600">
                            <div className="flex items-center justify-between">
                              <span>Key:</span>
                              <div className="flex items-center space-x-2">
                                <span className="font-mono">{maskApiKey(apiKey.key)}</span>
                                <button
                                  onClick={() => setShowApiKey(!showApiKey)}
                                  className="text-gray-400 hover:text-gray-600"
                                >
                                  {showApiKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                </button>
                              </div>
                            </div>
                            <div className="flex items-center justify-between">
                              <span>Permissions:</span>
                              <span>{apiKey.permissions.join(', ')}</span>
                            </div>
                            <div className="flex items-center justify-between">
                              <span>Last Used:</span>
                              <span>{apiKey.lastUsed}</span>
                            </div>
                            <div className="flex items-center justify-between">
                              <span>Expires:</span>
                              <span>{apiKey.expires}</span>
                            </div>
                          </div>
                          <div className="mt-3 flex space-x-2">
                            <button className="px-3 py-1 text-sm bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors">
                              Regenerate
                            </button>
                            <button className="px-3 py-1 text-sm bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors">
                              Revoke
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

            </div>
          </div>

          {/* Success Message */}
          {saved && (
            <div className="fixed top-4 right-4 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-lg flex items-center z-50">
              <CheckCircle className="w-5 h-5 mr-2" />
              Settings saved successfully!
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PageSettings;
