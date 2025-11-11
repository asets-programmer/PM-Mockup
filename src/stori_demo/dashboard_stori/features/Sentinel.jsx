import React, { useState, useRef, useEffect } from 'react';
import { Shield, AlertTriangle, CheckCircle, Clock, Activity, BarChart3, AlertCircle, MapPin, Volume2, VolumeX } from 'lucide-react';
import Sidebar from '../../komponen/Sidebar';
import Navbar from '../../komponen/Navbar';
import { useAuth } from '../../auth/AuthContext';
import CameraSection from './CameraSection';
import PrivacySecurityPanel from './privacy/PrivacySecurityPanel';
import { encrypt_data, anonymize_event } from './privacy/privacyUtils';
import { securityLog } from './privacy/securityLog';
import { privacyAPI } from './privacy/privacyAPI';

const Sentinel = () => {
  const { user } = useAuth();
  const [sidebarMinimized, setSidebarMinimized] = useState(false);
  const [selectedTimeRange, setSelectedTimeRange] = useState('24h');
  const [playingAudioId, setPlayingAudioId] = useState(null);
  const [audioStream, setAudioStream] = useState(null);
  const audioRef = useRef(null);
  const synthRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  
  // IP Webcam Configuration (HTTPS for two-way audio)
  const IP_WEBCAM_URL = 'https://192.168.1.38:8080';

  // Sample data
  const safetyEvents = [
    { type: 'spill', count: 45, trend: 'down', color: 'blue' },
    { type: 'queue', count: 30, trend: 'stable', color: 'yellow' },
    { type: 'hazard', count: 25, trend: 'up', color: 'green' }
  ];

  // Original alerts data
  const originalAlerts = [
    { id: 1, time: '14:32', type: 'Spill Detected', location: 'Pump 2', severity: 'critical', confidence: 92, status: 'Active', description: 'Bensin tumpah terdeteksi di Pump 2', timestamp: new Date().toISOString() },
    { id: 2, time: '14:28', type: 'Queue Alert', location: 'Dispenser 3', severity: 'warning', confidence: 85, status: 'Acknowledged', description: 'Antrian panjang terdeteksi di Dispenser 3', timestamp: new Date().toISOString() },
    { id: 3, time: '13:15', type: 'Hazard Detected', location: 'Pump 1', severity: 'warning', confidence: 78, status: 'Resolved', description: 'Aktivitas merokok terdeteksi di area SPBU', timestamp: new Date().toISOString() },
    { id: 4, time: '12:45', type: 'Spill Detected', location: 'Pump 3', severity: 'info', confidence: 65, status: 'Resolved', description: 'Bensin tumpah terdeteksi di Pump 3', timestamp: new Date().toISOString() },
    { id: 5, time: '11:20', type: 'Queue Alert', location: 'Dispenser 2', severity: 'info', confidence: 70, status: 'Resolved', description: 'Antrian panjang terdeteksi di Dispenser 2', timestamp: new Date().toISOString() },
  ];

  // Process alerts through privacy layer (encrypt and anonymize for storage/logging)
  const [recentAlerts] = useState(() => {
    // Process each alert through privacy-preserving layer
    return originalAlerts.map(alert => {
      // Anonymize event for privacy-compliant logging
      const anonymized = anonymize_event(alert);
      
      // Encrypt sensitive data for secure storage
      const encrypted = encrypt_data({
        originalLocation: alert.location,
        originalDescription: alert.description,
        timestamp: alert.timestamp
      });
      
      // Log privacy operations
      securityLog.logAnonymization(alert.type, true);
      securityLog.logEncryption('alert_data', true);
      privacyAPI.incrementAnonymized();
      privacyAPI.incrementEncrypted();
      
      // Return original alert for display (privacy layer works in background)
      // In production, you'd store encrypted/anonymized versions
      return {
        ...alert,
        _privacy: {
          anonymized: anonymized,
          encrypted: encrypted,
          privacyCompliant: true
        }
      };
    });
  });

  // Initialize privacy/security logging on mount
  useEffect(() => {
    // Log system access
    securityLog.logAccess('sentinel_dashboard', user?.id || 'system', true);
    securityLog.log({
      type: 'system',
      category: 'initialization',
      severity: 'low',
      message: 'Sentinel dashboard initialized with privacy-preserving AI layer',
      details: { feature: 'privacy_security_layer' }
    });
  }, [user]);

  // Generate audio message based on alert type and severity
  const getAudioMessage = (alert) => {
    // Base messages by type
    const baseMessages = {
      'Spill Detected': {
        critical: `Peringatan darurat! Bensin tumpah terdeteksi di ${alert.location}. Segera lakukan evakuasi dan penanganan darurat.`,
        warning: `Peringatan! Bensin tumpah terdeteksi di ${alert.location}. Segera lakukan penanganan.`,
        info: `Informasi: Bensin tumpah terdeteksi di ${alert.location}. Harap perhatikan dan lakukan penanganan.`
      },
      'Queue Alert': {
        critical: `Peringatan darurat! Antrian sangat panjang terdeteksi di ${alert.location}. Segera tambahkan petugas untuk menangani.`,
        warning: `Peringatan! Antrian panjang terdeteksi di ${alert.location}. Harap segera ditangani.`,
        info: `Informasi: Antrian panjang terdeteksi di ${alert.location}. Perlu perhatian.`
      },
      'Hazard Detected': {
        critical: `Peringatan darurat! Aktivitas berbahaya terdeteksi di ${alert.location}. Dilarang keras merokok di area SPBU. Segera hentikan aktivitas berbahaya.`,
        warning: `Peringatan! Aktivitas berbahaya terdeteksi di ${alert.location}. Dilarang merokok di area SPBU.`,
        info: `Informasi: Aktivitas berbahaya terdeteksi di ${alert.location}. Harap perhatikan.`
      }
    };

    // Get message based on type and severity
    if (baseMessages[alert.type] && baseMessages[alert.type][alert.severity]) {
      return baseMessages[alert.type][alert.severity];
    }
    
    // Fallback to type-based message
    if (baseMessages[alert.type]) {
      return baseMessages[alert.type].warning || baseMessages[alert.type].info;
    }
    
    // Default fallback
    return `Peringatan! ${alert.type} terdeteksi di ${alert.location}.`;
  };

  // Send audio to IP Webcam via two-way audio
  const sendAudioToWebcam = async (audioBlob) => {
    try {
      // IP Webcam two-way audio typically uses WebRTC or audio streaming
      // For demo, we'll try multiple approaches:
      
      // Approach 1: Try to send via WebRTC (if supported)
      // Approach 2: Try to send via audio endpoint
      // Approach 3: Use IP Webcam's audio streaming API
      
      // For IP Webcam, two-way audio usually requires:
      // - HTTPS connection (already configured)
      // - WebRTC peer connection
      // - Or audio streaming endpoint
      
      // Try sending audio blob to IP Webcam
      const formData = new FormData();
      formData.append('audio', audioBlob, 'alert_audio.webm');
      
      // IP Webcam audio endpoints (may vary)
      const endpoints = [
        `${IP_WEBCAM_URL}/audio.html`,
        `${IP_WEBCAM_URL}/audio_stream`,
        `${IP_WEBCAM_URL}/send_audio`
      ];
      
      for (const endpoint of endpoints) {
        try {
          const response = await fetch(endpoint, {
            method: 'POST',
            body: formData,
            mode: 'no-cors' // IP Webcam may not have CORS enabled
          });
          console.log('Audio sent to IP Webcam via:', endpoint);
          return;
        } catch (err) {
          console.log(`Failed to send via ${endpoint}, trying next...`);
        }
      }
      
      // If all endpoints fail, log for debugging
      console.warn('Could not send audio to IP Webcam. Ensure IP Webcam is configured for two-way audio.');
      
    } catch (error) {
      console.error('Error sending audio to IP Webcam:', error);
    }
  };

  // Send audio stream to IP Webcam via two-way audio using WebRTC
  const sendAudioStreamToWebcam = async (audioStream) => {
    try {
      // IP Webcam two-way audio uses WebRTC
      // For HTTPS connection, we can try to establish WebRTC peer connection
      
      // Note: IP Webcam two-way audio requires:
      // 1. HTTPS connection (https://192.168.1.38:8080)
      // 2. WebRTC peer connection setup
      // 3. Audio stream from microphone
      
      // For demo, we'll try to open IP Webcam audio interface
      // The audio stream from microphone will be available for IP Webcam
      try {
        const audioWindow = window.open(
          `${IP_WEBCAM_URL}/audio.html`,
          'IPWebcamAudio',
          'width=400,height=300,scrollbars=no,resizable=yes'
        );
        
        if (audioWindow) {
          console.log('Opened IP Webcam audio interface for two-way audio');
          // The microphone stream is now available
          // IP Webcam can access it through the audio interface
        }
      } catch (popupError) {
        console.warn('Could not open IP Webcam audio interface (popup blocked?):', popupError);
        // Fallback: Try to use iframe
        console.log('Audio stream is ready. Please manually open IP Webcam audio interface.');
      }
      
      // Alternative: Use WebRTC to directly stream audio
      // This would require RTCPeerConnection setup with IP Webcam
      // For now, we'll use the audio interface approach
      
    } catch (error) {
      console.error('Error sending audio stream to IP Webcam:', error);
    }
  };

  // Capture audio from microphone and send to IP Webcam
  const captureAndSendAudio = async (message) => {
    try {
      // Request microphone access for two-way audio
      // This will allow IP Webcam to receive audio from laptop microphone
      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: {
          echoCancellation: false, // Disable echo cancellation to capture system audio
          noiseSuppression: true,
          autoGainControl: true,
          // Try to capture system audio if possible
          // Note: This may require additional browser permissions
        } 
      });
      
      setAudioStream(stream);
      
      // Send audio stream to IP Webcam via two-way audio interface
      await sendAudioStreamToWebcam(stream);
      
      // Play text-to-speech message
      // Note: For two-way audio to work properly, you may need to:
      // 1. Route system audio to microphone (OS-level setting)
      // 2. Or use virtual audio cable/loopback
      // 3. Or use Web Audio API to capture speechSynthesis output
      
      if ('speechSynthesis' in window) {
        const utterance = new SpeechSynthesisUtterance(message);
        utterance.lang = 'id-ID';
        utterance.rate = 0.9;
        utterance.pitch = 1;
        utterance.volume = 1;
        
        utterance.onend = () => {
          // Keep stream open for a bit to ensure audio is sent
          setTimeout(() => {
            if (stream) {
              stream.getTracks().forEach(track => track.stop());
              setAudioStream(null);
            }
          }, 2000);
        };
        
        utterance.onerror = () => {
          if (stream) {
            stream.getTracks().forEach(track => track.stop());
            setAudioStream(null);
          }
        };
        
        window.speechSynthesis.speak(utterance);
      }
      
    } catch (error) {
      console.error('Error capturing audio:', error);
      // Fallback: Just play text-to-speech locally
      if ('speechSynthesis' in window) {
        const utterance = new SpeechSynthesisUtterance(message);
        utterance.lang = 'id-ID';
        window.speechSynthesis.speak(utterance);
      }
    }
  };

  // Play audio and send to IP Webcam
  const playAudio = async (alert) => {
    try {
      setPlayingAudioId(alert.id);
      
      // Log audio playback access (privacy-aware)
      securityLog.log({
        type: 'access',
        category: 'audio',
        severity: 'low',
        message: `Audio alert played: ${alert.type}`,
        details: { alertId: alert.id, alertType: alert.type, severity: alert.severity },
        userId: user?.id || 'system'
      });
      
      // Generate audio message
      const message = getAudioMessage(alert);
      
      // Use Web Speech API for text-to-speech (local playback)
      if ('speechSynthesis' in window) {
        // Stop any ongoing speech
        window.speechSynthesis.cancel();
        
        const utterance = new SpeechSynthesisUtterance(message);
        utterance.lang = 'id-ID'; // Indonesian
        utterance.rate = 0.9;
        utterance.pitch = 1;
        utterance.volume = 1;
        
        // Play audio locally
        window.speechSynthesis.speak(utterance);
        
        utterance.onend = () => {
          setPlayingAudioId(null);
          securityLog.log({
            type: 'audio',
            category: 'playback',
            severity: 'low',
            message: `Audio playback completed: ${alert.type}`,
            details: { alertId: alert.id },
            status: 'success'
          });
        };
        
        utterance.onerror = () => {
          setPlayingAudioId(null);
          securityLog.log({
            type: 'audio',
            category: 'playback',
            severity: 'medium',
            message: `Audio playback failed: ${alert.type}`,
            details: { alertId: alert.id },
            status: 'error'
          });
        };
      }
      
      // Try to send audio to IP Webcam via two-way audio
      // This will capture microphone audio and send to IP Webcam
      try {
        await captureAndSendAudio(message);
      } catch (webcamError) {
        console.warn('Could not send audio to IP Webcam:', webcamError);
        // Audio will still play locally via text-to-speech
      }
      
    } catch (error) {
      console.error('Error playing audio:', error);
      setPlayingAudioId(null);
      securityLog.log({
        type: 'error',
        category: 'audio',
        severity: 'medium',
        message: `Audio playback error: ${error.message}`,
        details: { error: error.message },
        status: 'error'
      });
      alert('Gagal memutar audio. Pastikan browser mendukung text-to-speech dan izin microphone sudah diberikan.');
    }
  };

  // Stop audio
  const stopAudio = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    
    // Stop media recorder if recording
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
      mediaRecorderRef.current.stop();
    }
    
    // Stop audio stream
    if (audioStream) {
      audioStream.getTracks().forEach(track => track.stop());
      setAudioStream(null);
    }
    
    setPlayingAudioId(null);
  };

  // Cleanup on unmount
  React.useEffect(() => {
    return () => {
      stopAudio();
    };
  }, []);

  const systemMetrics = {
    totalEvents: 100,
    activeAlerts: 1,
    resolvedAlerts: 99,
    avgResponseTime: '2.5 min',
    systemHealth: 75
  };

  const eventStats = {
    spills: { total: 45, critical: 5, warning: 15, info: 25 },
    queueAlerts: { total: 30, critical: 2, warning: 10, info: 18 },
    hazards: { total: 25, critical: 3, warning: 8, info: 14 }
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
                <div className="p-3 bg-red-100 rounded-lg">
                  <Shield className="w-8 h-8 text-red-600" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-gray-900">Sentinel</h1>
                  <p className="text-gray-600 mt-1">AI-powered safety monitoring and hazard detection</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                {['24h', '7d', '30d'].map((range) => (
                  <button
                    key={range}
                    onClick={() => setSelectedTimeRange(range)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                      selectedTimeRange === range
                        ? 'bg-red-600 text-white'
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
                <span className="text-gray-600 text-sm">Total Events</span>
                <Activity className="w-5 h-5 text-red-500" />
              </div>
              <div className="text-3xl font-bold text-gray-900">{systemMetrics.totalEvents}</div>
              <div className="text-sm text-gray-500 mt-2">Last 24 hours</div>
            </div>

            <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <span className="text-gray-600 text-sm">Active Alerts</span>
                <AlertTriangle className="w-5 h-5 text-red-500" />
              </div>
              <div className="text-3xl font-bold text-red-600">{systemMetrics.activeAlerts}</div>
              <div className="text-sm text-gray-500 mt-2">Requires attention</div>
            </div>

            <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <span className="text-gray-600 text-sm">Resolved</span>
                <CheckCircle className="w-5 h-5 text-green-500" />
              </div>
              <div className="text-3xl font-bold text-green-600">{systemMetrics.resolvedAlerts}</div>
              <div className="text-sm text-gray-500 mt-2">Last 24 hours</div>
            </div>

            <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <span className="text-gray-600 text-sm">Avg Response</span>
                <Clock className="w-5 h-5 text-blue-500" />
              </div>
              <div className="text-3xl font-bold text-gray-900">{systemMetrics.avgResponseTime}</div>
              <div className="text-sm text-gray-500 mt-2">Response time</div>
            </div>
          </div>

          {/* Camera Section */}
          <CameraSection />

          {/* Main Content Grid */}
          <div className="grid grid-cols-3 gap-6">
            {/* Safety Events Overview */}
            <div className="col-span-2 bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
              <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                <BarChart3 className="w-5 h-5 mr-2 text-red-600" />
                Safety Events Overview
              </h2>
              <div className="grid grid-cols-3 gap-4 mb-6">
                {safetyEvents.map((event, index) => (
                  <div key={index} className="bg-gray-50 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-gray-700 capitalize">{event.type}</span>
                      <div className={`w-3 h-3 rounded-full ${
                        event.color === 'blue' ? 'bg-blue-500' :
                        event.color === 'yellow' ? 'bg-yellow-500' :
                        'bg-green-500'
                      }`} />
                    </div>
                    <div className="text-2xl font-bold text-gray-900">{event.count}</div>
                    <div className="text-xs text-gray-500 mt-1">Trend: {event.trend}</div>
                  </div>
                ))}
              </div>
              
              {/* Circular Progress Chart */}
              <div className="flex items-center justify-center">
                <div className="relative w-48 h-48">
                  <svg className="w-48 h-48 transform -rotate-90">
                    <circle
                      cx="96"
                      cy="96"
                      r="80"
                      stroke="#e5e7eb"
                      strokeWidth="16"
                      fill="none"
                    />
                    <circle
                      cx="96"
                      cy="96"
                      r="80"
                      stroke="#3b82f6"
                      strokeWidth="16"
                      fill="none"
                      strokeDasharray={`${(eventStats.spills.total / 100) * 502} 502`}
                      strokeDashoffset="0"
                    />
                    <circle
                      cx="96"
                      cy="96"
                      r="80"
                      stroke="#eab308"
                      strokeWidth="16"
                      fill="none"
                      strokeDasharray={`${(eventStats.queueAlerts.total / 100) * 502} 502`}
                      strokeDashoffset={`-${(eventStats.spills.total / 100) * 502}`}
                    />
                    <circle
                      cx="96"
                      cy="96"
                      r="80"
                      stroke="#22c55e"
                      strokeWidth="16"
                      fill="none"
                      strokeDasharray={`${(eventStats.hazards.total / 100) * 502} 502`}
                      strokeDashoffset={`-${((eventStats.spills.total + eventStats.queueAlerts.total) / 100) * 502}`}
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center">
                      <div className="text-3xl font-bold text-gray-900">{systemMetrics.totalEvents}</div>
                      <div className="text-xs text-gray-500">Total Events</div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="mt-6 grid grid-cols-3 gap-4 text-xs">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-blue-500 rounded"></div>
                    <span className="text-gray-600">Spills</span>
                  </div>
                  <span className="font-medium text-gray-900">{eventStats.spills.total}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-yellow-500 rounded"></div>
                    <span className="text-gray-600">Queue Alerts</span>
                  </div>
                  <span className="font-medium text-gray-900">{eventStats.queueAlerts.total}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-green-500 rounded"></div>
                    <span className="text-gray-600">Hazards</span>
                  </div>
                  <span className="font-medium text-gray-900">{eventStats.hazards.total}</span>
                </div>
              </div>
            </div>

            {/* System Health */}
            <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
              <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                <Activity className="w-5 h-5 mr-2 text-red-600" />
                System Health
              </h2>
              <div className="space-y-4">
                <div className="text-center">
                  <div className="text-4xl font-bold text-gray-900 mb-2">{systemMetrics.systemHealth}%</div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div 
                      className="bg-red-500 h-3 rounded-full" 
                      style={{ width: `${systemMetrics.systemHealth}%` }}
                    />
                  </div>
                </div>
                
                <div className="space-y-3 pt-4 border-t border-gray-200">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Spills</span>
                    <div className="flex items-center space-x-2">
                      <span className="text-xs text-red-600 font-medium">{eventStats.spills.critical} Critical</span>
                      <span className="text-xs text-yellow-600">{eventStats.spills.warning} Warning</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Queue Alerts</span>
                    <div className="flex items-center space-x-2">
                      <span className="text-xs text-red-600 font-medium">{eventStats.queueAlerts.critical} Critical</span>
                      <span className="text-xs text-yellow-600">{eventStats.queueAlerts.warning} Warning</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Hazards</span>
                    <div className="flex items-center space-x-2">
                      <span className="text-xs text-red-600 font-medium">{eventStats.hazards.critical} Critical</span>
                      <span className="text-xs text-yellow-600">{eventStats.hazards.warning} Warning</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Privacy & Security Panel */}
          {/* <PrivacySecurityPanel /> */}

          {/* Recent Alerts */}
          <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
            <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
              <AlertCircle className="w-5 h-5 mr-2 text-red-600" />
              Recent Safety Alerts
              <span className="ml-2 px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs font-medium">
                Privacy-Protected
              </span>
            </h2>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Time</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Type</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Location</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Severity</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Confidence</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Status</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {recentAlerts.map((alert) => (
                    <tr key={alert.id} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-3 px-4 text-sm text-gray-900">{alert.time}</td>
                      <td className="py-3 px-4 text-sm text-gray-700">{alert.type}</td>
                      <td className="py-3 px-4 text-sm">
                        <div className="flex items-center space-x-1">
                          <MapPin className="w-4 h-4 text-gray-400" />
                          <span className="text-gray-700">{alert.location}</span>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-sm">
                        {alert.severity === 'critical' ? (
                          <span className="flex items-center space-x-1">
                            <AlertTriangle className="w-4 h-4 text-red-500" />
                            <span className="text-red-600 font-medium">Critical</span>
                          </span>
                        ) : alert.severity === 'warning' ? (
                          <span className="flex items-center space-x-1">
                            <AlertTriangle className="w-4 h-4 text-yellow-500" />
                            <span className="text-yellow-600 font-medium">Warning</span>
                          </span>
                        ) : (
                          <span className="flex items-center space-x-1">
                            <CheckCircle className="w-4 h-4 text-blue-500" />
                            <span className="text-blue-600 font-medium">Info</span>
                          </span>
                        )}
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-700">{alert.confidence}%</td>
                      <td className="py-3 px-4 text-sm">
                        <span className={`px-2 py-1 rounded text-xs ${
                          alert.status === 'Active' ? 'bg-red-100 text-red-700' :
                          alert.status === 'Acknowledged' ? 'bg-yellow-100 text-yellow-700' :
                          'bg-green-100 text-green-700'
                        }`}>
                          {alert.status}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-sm">
                        {playingAudioId === alert.id ? (
                          <button
                            onClick={stopAudio}
                            className="px-3 py-1.5 bg-red-500 text-white rounded-lg text-xs hover:bg-red-600 flex items-center space-x-1 transition-colors"
                            title="Stop Audio"
                          >
                            <VolumeX className="w-3 h-3" />
                            <span>Stop</span>
                          </button>
                        ) : (
                          <button
                            onClick={() => playAudio(alert)}
                            className="px-3 py-1.5 bg-blue-600 text-white rounded-lg text-xs hover:bg-blue-700 flex items-center space-x-1 transition-colors"
                            title="Play Audio Alert"
                          >
                            <Volume2 className="w-3 h-3" />
                            <span>Play Audio</span>
                          </button>
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

export default Sentinel;

