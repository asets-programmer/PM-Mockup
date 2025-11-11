import React, { useState, useEffect } from 'react';
import { Monitor, AlertTriangle, CheckCircle, Clock, Activity, BarChart3, TrendingUp, Zap } from 'lucide-react';
import Sidebar from '../../komponen/Sidebar';
import Navbar from '../../komponen/Navbar';
import { useAuth } from '../../auth/AuthContext';
import CameraSection from './CameraSection';
import PrivacySecurityPanel from './privacy/PrivacySecurityPanel';
import { encrypt_data, anonymize_event } from './privacy/privacyUtils';
import { securityLog } from './privacy/securityLog';
import { privacyAPI } from './privacy/privacyAPI';

const TouchscreenHealth = () => {
  const { user } = useAuth();
  const [sidebarMinimized, setSidebarMinimized] = useState(false);
  const [selectedTimeRange, setSelectedTimeRange] = useState('24h');

  // Sample data
  const responseTimeData = [
    { time: '08:00', avg: 120, max: 180, min: 80 },
    { time: '10:00', avg: 150, max: 220, min: 100 },
    { time: '12:00', avg: 180, max: 280, min: 120 },
    { time: '14:00', avg: 320, max: 450, min: 200 },
    { time: '16:00', avg: 280, max: 380, min: 180 }
  ];

  const originalDelayEvents = [
    { id: 1, time: '14:32', dispenser: 'Dispenser 3', delay: 3200, severity: 'critical', action: 'Requires attention', timestamp: new Date().toISOString() },
    { id: 2, time: '14:28', dispenser: 'Dispenser 2', delay: 2800, severity: 'warning', action: 'Monitor', timestamp: new Date().toISOString() },
    { id: 3, time: '13:15', dispenser: 'Dispenser 1', delay: 1500, severity: 'normal', action: 'OK', timestamp: new Date().toISOString() },
    { id: 4, time: '12:45', dispenser: 'Dispenser 3', delay: 1200, severity: 'normal', action: 'OK', timestamp: new Date().toISOString() },
    { id: 5, time: '11:20', dispenser: 'Dispenser 2', delay: 1100, severity: 'normal', action: 'OK', timestamp: new Date().toISOString() },
  ];

  // Process events through privacy layer
  const [delayEvents] = useState(() => {
    return originalDelayEvents.map(event => {
      const anonymized = anonymize_event(event);
      const encrypted = encrypt_data({
        originalDispenser: event.dispenser,
        delay: event.delay,
        timestamp: event.timestamp
      });
      
      securityLog.logAnonymization('delay_event', true);
      securityLog.logEncryption('delay_data', true);
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
    securityLog.logAccess('touchscreen_health_dashboard', user?.id || 'system', true);
    securityLog.log({
      type: 'system',
      category: 'initialization',
      severity: 'low',
      message: 'Touchscreen Health dashboard initialized with privacy-preserving AI layer',
      details: { feature: 'privacy_security_layer' }
    });
  }, [user]);

  const dispenserStatus = [
    { id: 1, name: 'Dispenser 1', avgResponse: 120, maxResponse: 180, health: 95, status: 'Good', lastDelay: '2h ago' },
    { id: 2, name: 'Dispenser 2', avgResponse: 150, maxResponse: 280, health: 88, status: 'Good', lastDelay: '1h ago' },
    { id: 3, name: 'Dispenser 3', avgResponse: 320, maxResponse: 450, health: 75, status: 'Warning', lastDelay: '5m ago' },
  ];

  const systemMetrics = {
    avgResponseTime: 197,
    maxResponseTime: 450,
    delayThreshold: 3000,
    criticalDelays: 1,
    totalDelays: 2
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
                <div className="p-3 bg-purple-100 rounded-lg">
                  <Monitor className="w-8 h-8 text-purple-600" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-gray-900">Touchscreen Health</h1>
                  <p className="text-gray-600 mt-1">Delay detection and response time monitoring</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                {['24h', '7d', '30d'].map((range) => (
                  <button
                    key={range}
                    onClick={() => setSelectedTimeRange(range)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                      selectedTimeRange === range
                        ? 'bg-purple-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {range}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* System Metrics Overview */}
          <div className="grid grid-cols-4 gap-6">
            <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <span className="text-gray-600 text-sm">Avg Response Time</span>
                <Zap className="w-5 h-5 text-purple-500" />
              </div>
              <div className="text-3xl font-bold text-gray-900">{systemMetrics.avgResponseTime}ms</div>
              <div className="text-sm text-gray-500 mt-2">Target: &lt;200ms</div>
            </div>

            <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <span className="text-gray-600 text-sm">Max Response Time</span>
                <TrendingUp className="w-5 h-5 text-red-500" />
              </div>
              <div className="text-3xl font-bold text-gray-900">{systemMetrics.maxResponseTime}ms</div>
              <div className="text-sm text-gray-500 mt-2">Threshold: {systemMetrics.delayThreshold}ms</div>
            </div>

            <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <span className="text-gray-600 text-sm">Critical Delays</span>
                <AlertTriangle className="w-5 h-5 text-red-500" />
              </div>
              <div className="text-3xl font-bold text-red-600">{systemMetrics.criticalDelays}</div>
              <div className="text-sm text-gray-500 mt-2">Last 24 hours</div>
            </div>

            <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <span className="text-gray-600 text-sm">Total Delays</span>
                <Clock className="w-5 h-5 text-yellow-500" />
              </div>
              <div className="text-3xl font-bold text-gray-900">{systemMetrics.totalDelays}</div>
              <div className="text-sm text-gray-500 mt-2">Last 24 hours</div>
            </div>
          </div>

          {/* Camera Section */}
          <CameraSection />

          {/* Privacy & Security Panel */}
          {/* <PrivacySecurityPanel /> */}

          {/* Main Content Grid */}
          <div className="grid grid-cols-3 gap-6">
            {/* Response Time Trend Chart */}
            <div className="col-span-2 bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
              <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                <BarChart3 className="w-5 h-5 mr-2 text-purple-600" />
                Response Time Trend
              </h2>
              <div className="h-64 flex items-end justify-between space-x-2">
                {responseTimeData.map((data, index) => (
                  <div key={index} className="flex-1 flex flex-col items-center">
                    <div className="w-full flex flex-col justify-end space-y-1" style={{ height: '200px' }}>
                      <div
                        className="w-full bg-purple-500/50 rounded-t"
                        style={{ height: `${(data.avg / 500) * 100}%` }}
                        title={`Avg: ${data.avg}ms`}
                      />
                      <div
                        className="w-full bg-red-500/30 rounded-t"
                        style={{ height: `${(data.max / 500) * 100}%` }}
                        title={`Max: ${data.max}ms`}
                      />
                    </div>
                    <div className="text-xs text-gray-600 mt-2">{data.time}</div>
                  </div>
                ))}
              </div>
              <div className="mt-4 flex items-center justify-center space-x-4 text-xs text-gray-600">
                <div className="flex items-center space-x-1">
                  <div className="w-3 h-3 bg-purple-500/50 rounded"></div>
                  <span>Average</span>
                </div>
                <div className="flex items-center space-x-1">
                  <div className="w-3 h-3 bg-red-500/30 rounded"></div>
                  <span>Maximum</span>
                </div>
                <div className="flex items-center space-x-1">
                  <div className="w-3 h-3 border border-purple-500 border-dashed"></div>
                  <span>Threshold (3000ms)</span>
                </div>
              </div>
            </div>

            {/* Dispenser Status */}
            <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
              <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                <Activity className="w-5 h-5 mr-2 text-purple-600" />
                Dispenser Status
              </h2>
              <div className="space-y-4">
                {dispenserStatus.map((dispenser) => (
                  <div key={dispenser.id} className="p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium text-gray-900">{dispenser.name}</span>
                      <span className={`text-xs px-2 py-1 rounded ${
                        dispenser.status === 'Good' ? 'bg-green-100 text-green-700' :
                        'bg-yellow-100 text-yellow-700'
                      }`}>
                        {dispenser.status}
                      </span>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">Avg: {dispenser.avgResponse}ms</span>
                        <span className="text-gray-600">Max: {dispenser.maxResponse}ms</span>
                      </div>
                      <div className="flex items-center justify-between text-xs text-gray-500 mb-2">
                        <span>Health: {dispenser.health}%</span>
                        <span>Last delay: {dispenser.lastDelay}</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className={`h-2 rounded-full ${
                            dispenser.health >= 90 ? 'bg-green-500' :
                            dispenser.health >= 80 ? 'bg-yellow-500' :
                            'bg-red-500'
                          }`}
                          style={{ width: `${dispenser.health}%` }}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Recent Delay Events */}
          <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
            <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
              <Clock className="w-5 h-5 mr-2 text-purple-600" />
              Recent Delay Events
              <span className="ml-2 px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs font-medium">
                Privacy-Protected
              </span>
            </h2>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Time</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Dispenser</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Delay (ms)</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Severity</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {delayEvents.map((event) => (
                    <tr key={event.id} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-3 px-4 text-sm text-gray-900">{event.time}</td>
                      <td className="py-3 px-4 text-sm text-gray-700">{event.dispenser}</td>
                      <td className="py-3 px-4 text-sm text-gray-700">{event.delay.toLocaleString()}ms</td>
                      <td className="py-3 px-4 text-sm">
                        {event.severity === 'critical' ? (
                          <span className="flex items-center space-x-1">
                            <AlertTriangle className="w-4 h-4 text-red-500" />
                            <span className="text-red-600 font-medium">Critical</span>
                          </span>
                        ) : event.severity === 'warning' ? (
                          <span className="flex items-center space-x-1">
                            <AlertTriangle className="w-4 h-4 text-yellow-500" />
                            <span className="text-yellow-600 font-medium">Warning</span>
                          </span>
                        ) : (
                          <span className="flex items-center space-x-1">
                            <CheckCircle className="w-4 h-4 text-green-500" />
                            <span className="text-green-600 font-medium">Normal</span>
                          </span>
                        )}
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-700">{event.action}</td>
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

export default TouchscreenHealth;

