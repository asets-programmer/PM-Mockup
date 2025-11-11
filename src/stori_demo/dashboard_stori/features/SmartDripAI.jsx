import React, { useState, useEffect } from 'react';
import { Droplet, TrendingUp, AlertTriangle, CheckCircle, Clock, Activity, BarChart3 } from 'lucide-react';
import Sidebar from '../../komponen/Sidebar';
import Navbar from '../../komponen/Navbar';
import { useAuth } from '../../auth/AuthContext';
import CameraSection from './CameraSection';
import PrivacySecurityPanel from './privacy/PrivacySecurityPanel';
import { encrypt_data, anonymize_event } from './privacy/privacyUtils';
import { securityLog } from './privacy/securityLog';
import { privacyAPI } from './privacy/privacyAPI';

const SmartDripAI = () => {
  const { user } = useAuth();
  const [sidebarMinimized, setSidebarMinimized] = useState(false);
  const [selectedTimeRange, setSelectedTimeRange] = useState('24h');

  // Original data
  const originalDripEvents = [
    { id: 1, time: '14:32', location: 'Pump 2', severity: 'normal', count: 2, status: 'Stable', timestamp: new Date().toISOString() },
    { id: 2, time: '13:15', location: 'Pump 1', severity: 'warning', count: 5, status: 'Increased', timestamp: new Date().toISOString() },
    { id: 3, time: '12:45', location: 'Pump 3', severity: 'normal', count: 1, status: 'Stable', timestamp: new Date().toISOString() },
    { id: 4, time: '11:20', location: 'Pump 2', severity: 'normal', count: 3, status: 'Stable', timestamp: new Date().toISOString() },
    { id: 5, time: '10:05', location: 'Pump 1', severity: 'normal', count: 2, status: 'Stable', timestamp: new Date().toISOString() },
  ];

  // Process events through privacy layer
  const [dripEvents] = useState(() => {
    return originalDripEvents.map(event => {
      const anonymized = anonymize_event(event);
      const encrypted = encrypt_data({
        originalLocation: event.location,
        count: event.count,
        timestamp: event.timestamp
      });
      
      securityLog.logAnonymization('drip_event', true);
      securityLog.logEncryption('drip_data', true);
      privacyAPI.incrementAnonymized();
      privacyAPI.incrementEncrypted();
      
      return {
        ...event,
        _privacy: { anonymized, encrypted, privacyCompliant: true }
      };
    });
  });

  // Initialize privacy/security logging
  useEffect(() => {
    securityLog.logAccess('smart_drip_ai_dashboard', user?.id || 'system', true);
    securityLog.log({
      type: 'system',
      category: 'initialization',
      severity: 'low',
      message: 'Smart Drip AI dashboard initialized with privacy-preserving AI layer',
      details: { feature: 'privacy_security_layer' }
    });
  }, [user]);

  const dripFrequencyData = [
    { day: 'Mon', count: 2, predicted: 2 },
    { day: 'Tue', count: 1, predicted: 1 },
    { day: 'Wed', count: 3, predicted: 3 },
    { day: 'Thu', count: 2, predicted: 2 },
    { day: 'Fri', count: 4, predicted: 4 },
    { day: 'Sat', count: 1, predicted: 1 },
    { day: 'Sun', count: 0, predicted: 0 }
  ];

  const systemHealth = {
    overall: 98,
    pumps: [
      { id: 1, name: 'Pump 1', health: 95, status: 'Good', lastDrip: '2h ago' },
      { id: 2, name: 'Pump 2', health: 98, status: 'Excellent', lastDrip: '1h ago' },
      { id: 3, name: 'Pump 3', health: 92, status: 'Good', lastDrip: '3h ago' },
    ]
  };

  const predictions = {
    nextMaintenance: '2025-01-20',
    failureRisk: 'Low (5%)',
    estimatedDays: 45
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar 
        minimized={sidebarMinimized} 
        onToggleMinimize={() => setSidebarMinimized(!sidebarMinimized)} 
      />
      
      <div className="flex-1 overflow-auto">
        <Navbar />
        
        <div className="p-6 space-y-6">
          {/* Header */}
          <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-blue-100 rounded-lg">
                  <Droplet className="w-8 h-8 text-blue-600" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-gray-900">Smart Drip AI</h1>
                  <p className="text-gray-600 mt-1">AI-powered drip detection and predictive maintenance</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                {['24h', '7d', '30d'].map((range) => (
                  <button
                    key={range}
                    onClick={() => setSelectedTimeRange(range)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                      selectedTimeRange === range
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {range}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* System Health Overview */}
          <div className="grid grid-cols-4 gap-6">
            <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <span className="text-gray-600 text-sm">Overall Health</span>
                <Activity className="w-5 h-5 text-green-500" />
              </div>
              <div className="text-3xl font-bold text-gray-900">{systemHealth.overall}%</div>
              <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-green-500 h-2 rounded-full" 
                  style={{ width: `${systemHealth.overall}%` }}
                />
              </div>
            </div>

            <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <span className="text-gray-600 text-sm">Total Drips (24h)</span>
                <Droplet className="w-5 h-5 text-blue-500" />
              </div>
              <div className="text-3xl font-bold text-gray-900">13</div>
              <div className="text-sm text-gray-500 mt-2">Within normal range</div>
            </div>

            <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <span className="text-gray-600 text-sm">Failure Risk</span>
                <AlertTriangle className="w-5 h-5 text-yellow-500" />
              </div>
              <div className="text-3xl font-bold text-gray-900">{predictions.failureRisk}</div>
              <div className="text-sm text-gray-500 mt-2">Next maintenance: {predictions.nextMaintenance}</div>
            </div>

            <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <span className="text-gray-600 text-sm">Estimated Days</span>
                <Clock className="w-5 h-5 text-blue-500" />
              </div>
              <div className="text-3xl font-bold text-gray-900">{predictions.estimatedDays}</div>
              <div className="text-sm text-gray-500 mt-2">Until next maintenance</div>
            </div>
          </div>

          {/* Camera Section */}
          <CameraSection />

          {/* Privacy & Security Panel */}
          {/* <PrivacySecurityPanel /> */}

          {/* Main Content Grid */}
          <div className="grid grid-cols-3 gap-6">
            {/* Drip Frequency Chart */}
            <div className="col-span-2 bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
              <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                <BarChart3 className="w-5 h-5 mr-2 text-blue-600" />
                Drip Frequency Trend
              </h2>
              <div className="h-64 flex items-end justify-between space-x-2">
                {dripFrequencyData.map((data, index) => (
                  <div key={index} className="flex-1 flex flex-col items-center">
                    <div className="w-full flex flex-col justify-end space-y-1" style={{ height: '200px' }}>
                      <div
                        className="w-full bg-blue-500/50 rounded-t"
                        style={{ height: `${(data.count / 5) * 100}%` }}
                        title={`${data.count} drips`}
                      />
                      <div
                        className="w-full bg-blue-300/30 rounded-t border border-blue-400 border-dashed"
                        style={{ height: `${(data.predicted / 5) * 100}%` }}
                        title={`Predicted: ${data.predicted}`}
                      />
                    </div>
                    <div className="text-xs text-gray-600 mt-2">{data.day}</div>
                  </div>
                ))}
              </div>
              <div className="mt-4 flex items-center justify-center space-x-4 text-xs text-gray-600">
                <div className="flex items-center space-x-1">
                  <div className="w-3 h-3 bg-blue-500/50 rounded"></div>
                  <span>Actual</span>
                </div>
                <div className="flex items-center space-x-1">
                  <div className="w-3 h-3 bg-blue-300/30 border border-blue-400 border-dashed rounded"></div>
                  <span>Predicted</span>
                </div>
              </div>
            </div>

            {/* Pump Status */}
            <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
              <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                <Activity className="w-5 h-5 mr-2 text-blue-600" />
                Pump Status
              </h2>
              <div className="space-y-4">
                {systemHealth.pumps.map((pump) => (
                  <div key={pump.id} className="p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium text-gray-900">{pump.name}</span>
                      <span className={`text-xs px-2 py-1 rounded ${
                        pump.status === 'Excellent' ? 'bg-green-100 text-green-700' :
                        pump.status === 'Good' ? 'bg-blue-100 text-blue-700' :
                        'bg-yellow-100 text-yellow-700'
                      }`}>
                        {pump.status}
                      </span>
                    </div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-gray-600">Health: {pump.health}%</span>
                      <span className="text-xs text-gray-500">Last drip: {pump.lastDrip}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full ${
                          pump.health >= 95 ? 'bg-green-500' :
                          pump.health >= 85 ? 'bg-blue-500' :
                          'bg-yellow-500'
                        }`}
                        style={{ width: `${pump.health}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Recent Drip Events */}
          <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
            <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
              <Clock className="w-5 h-5 mr-2 text-blue-600" />
              Recent Drip Events
              <span className="ml-2 px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs font-medium">
                Privacy-Protected
              </span>
            </h2>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Time</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Location</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Count</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Status</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Severity</th>
                  </tr>
                </thead>
                <tbody>
                  {dripEvents.map((event) => (
                    <tr key={event.id} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-3 px-4 text-sm text-gray-900">{event.time}</td>
                      <td className="py-3 px-4 text-sm text-gray-700">{event.location}</td>
                      <td className="py-3 px-4 text-sm text-gray-700">{event.count}</td>
                      <td className="py-3 px-4 text-sm">
                        <span className={`px-2 py-1 rounded text-xs ${
                          event.status === 'Stable' ? 'bg-green-100 text-green-700' :
                          'bg-yellow-100 text-yellow-700'
                        }`}>
                          {event.status}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-sm">
                        {event.severity === 'normal' ? (
                          <CheckCircle className="w-5 h-5 text-green-500" />
                        ) : (
                          <AlertTriangle className="w-5 h-5 text-yellow-500" />
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SmartDripAI;

