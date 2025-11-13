import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Thermometer, AlertTriangle, CheckCircle, Clock, Activity, BarChart3, TrendingUp, Flame, Trash2 } from 'lucide-react';
import Sidebar from '../../komponen/Sidebar';
import Navbar from '../../komponen/Navbar';
import { useAuth } from '../../auth/AuthContext';
import CameraSection from './CameraSection';
import ThermalDetection from './ThermalDetection';
import PrivacySecurityPanel from './privacy/PrivacySecurityPanel';
import { encrypt_data, anonymize_event } from './privacy/privacyUtils';
import { securityLog } from './privacy/securityLog';
import { privacyAPI } from './privacy/privacyAPI';

const ThermalWatch = () => {
  const { user } = useAuth();
  const [sidebarMinimized, setSidebarMinimized] = useState(false);
  const [selectedTimeRange, setSelectedTimeRange] = useState('24h');

  // Sample data
  const temperatureData = [
    { time: '08:00', dispenser1: 28, dispenser2: 30, dispenser3: 29, safeMax: 40 },
    { time: '10:00', dispenser1: 32, dispenser2: 33, dispenser3: 31, safeMax: 40 },
    { time: '12:00', dispenser1: 35, dispenser2: 36, dispenser3: 34, safeMax: 40 },
    { time: '14:00', dispenser1: 38, dispenser2: 37, dispenser3: 36, safeMax: 40 },
    { time: '16:00', dispenser1: 36, dispenser2: 35, dispenser3: 34, safeMax: 40 }
  ];

  // Key untuk localStorage
  const STORAGE_KEY = 'thermal_events';
  const EVENT_ID_KEY = 'thermal_event_id_counter';

  // Load dari localStorage saat mount
  const [thermalEvents, setThermalEvents] = useState(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        return parsed;
      }
    } catch (error) {
      console.error('Error loading thermal events from localStorage:', error);
    }
    return [];
  });

  // Counter untuk ID event - load dari localStorage
  const eventIdRef = useRef((() => {
    try {
      const stored = localStorage.getItem(EVENT_ID_KEY);
      if (stored) {
        return parseInt(stored, 10);
      }
    } catch (error) {
      console.error('Error loading event ID counter from localStorage:', error);
    }
    return 1;
  })());

  // Save ke localStorage setiap kali thermalEvents berubah
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(thermalEvents));
      localStorage.setItem(EVENT_ID_KEY, eventIdRef.current.toString());
    } catch (error) {
      console.error('Error saving thermal events to localStorage:', error);
    }
  }, [thermalEvents]);

  // Fungsi untuk menambahkan event baru dari ThermalDetection
  const addThermalEvent = useCallback((eventData) => {
    console.log('📥 addThermalEvent called with:', eventData);
    const { temperature, status, brand, confidence, reason } = eventData;
    
    // Hanya tambahkan event jika status WARNING atau DANGER
    if (status !== 'WARNING' && status !== 'DANGER' && status !== 'TOO COLD') {
      console.log('❌ Event rejected - status not WARNING/DANGER/TOO_COLD:', status);
      return;
    }

    // Format waktu
    const now = new Date();
    const time = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
    
    // Tentukan location berdasarkan brand
    const location = brand ? `${brand} Dispenser` : 'Unknown Dispenser';
    
    // Tentukan action berdasarkan status dan reason
    let action = 'OK';
    if (status === 'DANGER') {
      action = reason || 'Immediate shutdown required';
    } else if (status === 'WARNING') {
      action = reason || 'Monitor closely';
    } else if (status === 'TOO COLD') {
      action = reason || 'Check system operation';
    }

    // Buat event object
    const newEvent = {
      id: eventIdRef.current++,
      time: time,
      location: location,
      temperature: Math.round(temperature * 10) / 10, // Round to 1 decimal
      status: status === 'DANGER' ? 'danger' : status === 'WARNING' ? 'warning' : 'normal',
      action: action,
      reason: reason || null, // Tambahkan reason ke event
      timestamp: now.toISOString(),
      brand: brand,
      confidence: confidence
    };

    // Process through privacy layer
    const anonymized = anonymize_event(newEvent);
    const encrypted = encrypt_data({
      originalLocation: newEvent.location,
      temperature: newEvent.temperature,
      timestamp: newEvent.timestamp
    });
    
    securityLog.logAnonymization('thermal_event', true);
    securityLog.logEncryption('thermal_data', true);
    privacyAPI.incrementAnonymized();
    privacyAPI.incrementEncrypted();
    
    const processedEvent = {
      ...newEvent,
      _privacy: { anonymized, encrypted, privacyCompliant: true }
    };

    // Tambahkan event baru ke state (prepend untuk menampilkan yang terbaru di atas)
    console.log('✅ Adding thermal event to state:', processedEvent);
    setThermalEvents(prev => {
      const updated = [processedEvent, ...prev].slice(0, 100); // Limit to 100 most recent events
      console.log('📊 Updated thermal events count:', updated.length);
      return updated;
    });
    
    // Update event ID counter di localStorage (useEffect akan handle save thermalEvents)
    try {
      localStorage.setItem(EVENT_ID_KEY, eventIdRef.current.toString());
    } catch (error) {
      console.error('Error saving event ID counter to localStorage:', error);
    }
  }, []);

  // Fungsi untuk menghapus event
  const deleteThermalEvent = useCallback((eventId) => {
    setThermalEvents(prev => {
      const filtered = prev.filter(event => event.id !== eventId);
      return filtered;
    });
    
    // Log deletion
    securityLog.log({
      type: 'access',
      category: 'thermal_event',
      severity: 'low',
      message: `Thermal event deleted: ${eventId}`,
      details: { eventId },
      userId: user?.id || 'system'
    });
  }, [user]);

  // Initialize privacy/security logging
  useEffect(() => {
    securityLog.logAccess('thermal_watch_dashboard', user?.id || 'system', true);
    securityLog.log({
      type: 'system',
      category: 'initialization',
      severity: 'low',
      message: 'ThermalWatch dashboard initialized with privacy-preserving AI layer',
      details: { feature: 'privacy_security_layer' }
    });
  }, [user]);

  const dispenserTemps = [
    { id: 1, name: 'Dispenser 1', current: 38, max: 40, avg: 34, health: 95, status: 'Warning', trend: 'up' },
    { id: 2, name: 'Dispenser 2', current: 37, max: 40, avg: 33, health: 92, status: 'Good', trend: 'stable' },
    { id: 3, name: 'Dispenser 3', current: 36, max: 40, avg: 32, health: 90, status: 'Good', trend: 'down' },
  ];

  const systemMetrics = {
    avgTemperature: 37,
    maxTemperature: 38,
    safeMax: 40,
    criticalAlerts: 0,
    warningAlerts: 1
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
                <div className="p-3 bg-orange-100 rounded-lg">
                  <Thermometer className="w-8 h-8 text-orange-600" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-gray-900">ThermalWatch</h1>
                  <p className="text-gray-600 mt-1">Real-time temperature monitoring and thermal safety</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                {['24h', '7d', '30d'].map((range) => (
                  <button
                    key={range}
                    onClick={() => setSelectedTimeRange(range)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                      selectedTimeRange === range
                        ? 'bg-orange-600 text-white'
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
                <span className="text-gray-600 text-sm">Avg Temperature</span>
                <Thermometer className="w-5 h-5 text-orange-500" />
              </div>
              <div className="text-3xl font-bold text-gray-900">{systemMetrics.avgTemperature}°C</div>
              <div className="text-sm text-gray-500 mt-2">Safe max: {systemMetrics.safeMax}°C</div>
            </div>

            <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <span className="text-gray-600 text-sm">Max Temperature</span>
                <Flame className="w-5 h-5 text-red-500" />
              </div>
              <div className="text-3xl font-bold text-gray-900">{systemMetrics.maxTemperature}°C</div>
              <div className="text-sm text-gray-500 mt-2">Threshold: {systemMetrics.safeMax}°C</div>
            </div>

            <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <span className="text-gray-600 text-sm">Warning Alerts</span>
                <AlertTriangle className="w-5 h-5 text-yellow-500" />
              </div>
              <div className="text-3xl font-bold text-yellow-600">{systemMetrics.warningAlerts}</div>
              <div className="text-sm text-gray-500 mt-2">Last 24 hours</div>
            </div>

            <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <span className="text-gray-600 text-sm">Critical Alerts</span>
                <AlertTriangle className="w-5 h-5 text-red-500" />
              </div>
              <div className="text-3xl font-bold text-red-600">{systemMetrics.criticalAlerts}</div>
              <div className="text-sm text-gray-500 mt-2">Last 24 hours</div>
            </div>
          </div>

          {/* Thermal Detection System */}
          <ThermalDetection onThermalEvent={addThermalEvent} />
          
          {/* Camera Section */}
          <CameraSection enableTeachableMachine={true} />

          {/* Privacy & Security Panel */}
          {/* <PrivacySecurityPanel /> */}

          {/* Main Content Grid */}
          <div className="grid grid-cols-3 gap-6">
            {/* Temperature Trend Chart */}
            <div className="col-span-2 bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
              <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                <BarChart3 className="w-5 h-5 mr-2 text-orange-600" />
                Component Temperature Trend
              </h2>
              <div className="h-64 flex items-end justify-between space-x-2">
                {temperatureData.map((data, index) => (
                  <div key={index} className="flex-1 flex flex-col items-center space-y-1">
                    <div className="w-full flex flex-col justify-end space-y-1" style={{ height: '200px' }}>
                      <div
                        className="w-full bg-blue-500/50 rounded-t"
                        style={{ height: `${(data.dispenser1 / 40) * 100}%` }}
                        title={`Dispenser 1: ${data.dispenser1}°C`}
                      />
                      <div
                        className="w-full bg-green-500/50 rounded-t"
                        style={{ height: `${(data.dispenser2 / 40) * 100}%` }}
                        title={`Dispenser 2: ${data.dispenser2}°C`}
                      />
                      <div
                        className="w-full bg-purple-500/50 rounded-t"
                        style={{ height: `${(data.dispenser3 / 40) * 100}%` }}
                        title={`Dispenser 3: ${data.dispenser3}°C`}
                      />
                    </div>
                    <div className="text-xs text-gray-600">{data.time}</div>
                  </div>
                ))}
              </div>
              <div className="mt-4 flex items-center justify-center space-x-4 text-xs text-gray-600">
                <div className="flex items-center space-x-1">
                  <div className="w-3 h-3 bg-blue-500/50 rounded"></div>
                  <span>Dispenser 1</span>
                </div>
                <div className="flex items-center space-x-1">
                  <div className="w-3 h-3 bg-green-500/50 rounded"></div>
                  <span>Dispenser 2</span>
                </div>
                <div className="flex items-center space-x-1">
                  <div className="w-3 h-3 bg-purple-500/50 rounded"></div>
                  <span>Dispenser 3</span>
                </div>
                <div className="flex items-center space-x-1">
                  <div className="w-3 h-3 border border-red-500 border-dashed"></div>
                  <span>Safe Max (40°C)</span>
                </div>
              </div>
            </div>

            {/* Dispenser Temperature Status */}
            <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
              <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                <Activity className="w-5 h-5 mr-2 text-orange-600" />
                Dispenser Temperature
              </h2>
              <div className="space-y-4">
                {dispenserTemps.map((dispenser) => (
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
                      <div className="flex items-center justify-between">
                        <span className="text-2xl font-bold text-gray-900">{dispenser.current}°C</span>
                        <div className="flex items-center space-x-1">
                          {dispenser.trend === 'up' && <TrendingUp className="w-4 h-4 text-red-500" />}
                          {dispenser.trend === 'down' && <TrendingUp className="w-4 h-4 text-green-500 rotate-180" />}
                          {dispenser.trend === 'stable' && <div className="w-4 h-4 border-2 border-gray-400 rounded-full" />}
                        </div>
                      </div>
                      <div className="flex items-center justify-between text-sm text-gray-600">
                        <span>Max: {dispenser.max}°C</span>
                        <span>Avg: {dispenser.avg}°C</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className={`h-2 rounded-full ${
                            dispenser.current >= 38 ? 'bg-red-500' :
                            dispenser.current >= 35 ? 'bg-yellow-500' :
                            'bg-green-500'
                          }`}
                          style={{ width: `${(dispenser.current / dispenser.max) * 100}%` }}
                        />
                      </div>
                      <div className="text-xs text-gray-500">Health: {dispenser.health}%</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Recent Thermal Events */}
          <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
            <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
              <Clock className="w-5 h-5 mr-2 text-orange-600" />
              Recent Thermal Events
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
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Temperature</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Status</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Reason</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Action</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Delete</th>
                  </tr>
                </thead>
                <tbody>
                  {thermalEvents.length === 0 ? (
                    <tr>
                      <td colSpan="7" className="py-8 px-4 text-center text-gray-500">
                        <div className="flex flex-col items-center space-y-2">
                          <Thermometer className="w-8 h-8 text-gray-300" />
                          <p className="text-sm">Belum ada event thermal terdeteksi</p>
                          <p className="text-xs text-gray-400">Event akan muncul otomatis ketika sistem mendeteksi WARNING atau DANGER</p>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    thermalEvents.map((event) => (
                      <tr key={event.id} className="border-b border-gray-100 hover:bg-gray-50">
                        <td className="py-3 px-4 text-sm text-gray-900">{event.time}</td>
                        <td className="py-3 px-4 text-sm text-gray-700">{event.location}</td>
                        <td className="py-3 px-4 text-sm">
                          <span className="font-medium text-gray-900">{event.temperature}°C</span>
                          <span className="text-gray-500 ml-2">/ {event.brand === 'Gilbarco' ? '45°C' : '55°C'}</span>
                        </td>
                        <td className="py-3 px-4 text-sm">
                          {event.status === 'danger' ? (
                            <span className="flex items-center space-x-1">
                              <AlertTriangle className="w-4 h-4 text-red-500" />
                              <span className="text-red-600 font-medium">Danger</span>
                            </span>
                          ) : event.status === 'warning' ? (
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
                        <td className="py-3 px-4 text-sm text-gray-700">
                          {event.reason ? (
                            <span className="text-xs bg-blue-50 text-blue-700 px-2 py-1 rounded">
                              {event.reason}
                            </span>
                          ) : (
                            <span className="text-gray-400">-</span>
                          )}
                        </td>
                        <td className="py-3 px-4 text-sm text-gray-700">{event.action}</td>
                        <td className="py-3 px-4 text-sm">
                          <button
                            onClick={() => deleteThermalEvent(event.id)}
                            className="px-3 py-1.5 bg-red-500 text-white rounded-lg text-xs hover:bg-red-600 flex items-center space-x-1 transition-colors"
                            title="Delete Event"
                          >
                            <Trash2 className="w-3 h-3" />
                            <span>Delete</span>
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ThermalWatch;

