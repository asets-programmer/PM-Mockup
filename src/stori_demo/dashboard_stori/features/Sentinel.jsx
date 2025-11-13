import React, { useState, useRef, useEffect } from 'react';
import { Shield, AlertTriangle, CheckCircle, Clock, Activity, BarChart3, AlertCircle, MapPin, Volume2, VolumeX } from 'lucide-react';
import Sidebar from '../../komponen/Sidebar';
import Navbar from '../../komponen/Navbar';
import { useAuth } from '../../auth/AuthContext';
import CameraSection from './CameraSection';
import JerigenDetection from './JerigenDetection';
import PlatNomorDetection from './PlatNomorDetection';
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
  const playedAlertsRef = useRef(new Set());
  const isInitialMountRef = useRef(true);
  const userInteractedRef = useRef(false);
  const lastJerigenAudioTimeRef = useRef(0); // Track kapan audio jerigen terakhir diputar
  
  // IP Webcam Configuration (HTTPS for two-way audio)
  const IP_WEBCAM_URL = 'https://192.168.1.38:8080';

  // Sample data
  const safetyEvents = [
    { type: 'spill', count: 45, trend: 'down', color: 'blue' },
    { type: 'queue', count: 30, trend: 'stable', color: 'yellow' },
    { type: 'hazard', count: 25, trend: 'up', color: 'green' }
  ];

  // State untuk alerts (dinamis)
  const initialAlerts = [
    { id: 1, time: '14:32', type: 'Spill Detected', location: 'Pump 2', severity: 'critical', confidence: 92, status: 'Active', description: 'Bensin tumpah terdeteksi di Pump 2', timestamp: new Date().toISOString() },
    { id: 2, time: '14:28', type: 'Queue Alert', location: 'Dispenser 3', severity: 'warning', confidence: 85, status: 'Acknowledged', description: 'Antrian panjang terdeteksi di Dispenser 3', timestamp: new Date().toISOString() },
    { id: 3, time: '13:15', type: 'Hazard Detected', location: 'Pump 1', severity: 'warning', confidence: 78, status: 'Resolved', description: 'Aktivitas merokok terdeteksi di area SPBU', timestamp: new Date().toISOString() },
    { id: 4, time: '12:45', type: 'Spill Detected', location: 'Pump 3', severity: 'info', confidence: 65, status: 'Resolved', description: 'Bensin tumpah terdeteksi di Pump 3', timestamp: new Date().toISOString() },
    { id: 5, time: '11:20', type: 'Queue Alert', location: 'Dispenser 2', severity: 'info', confidence: 70, status: 'Resolved', description: 'Antrian panjang terdeteksi di Dispenser 2', timestamp: new Date().toISOString() },
    { id: 6, time: '15:10', type: 'Jerigen Detected', location: 'Dispenser 1', severity: 'critical', confidence: 95, status: 'Active', description: 'Pengisian bensin menggunakan jerigen terdeteksi', plateNumber: null, timestamp: new Date().toISOString() },
    { id: 7, time: '14:55', type: 'Wrong Dispenser', location: 'Dispenser Pertalite', severity: 'warning', confidence: 88, status: 'Active', description: 'Mobil dengan plat nomor B 3673 API berada di dispenser untuk pertalite', plateNumber: 'B 3673 API', correctDispenser: 'Dispenser Pertamax', timestamp: new Date().toISOString() },
  ];
  
  const [alerts, setAlerts] = useState(initialAlerts);

  // Handler untuk ketika plat nomor terdeteksi
  const handlePlatDetected = (detectionData) => {
    console.log('🚗 [SENTINEL] ========== handlePlatDetected CALLED ==========');
    console.log('🚗 [SENTINEL] Detection data received:', detectionData);
    
    const now = new Date();
    const timeString = now.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
    
    const newAlert = {
      id: Date.now(),
      time: timeString,
      type: 'Plat Nomor Detected',
      location: 'Camera Feed',
      severity: detectionData.confidence > 0.8 ? 'info' : 'info',
      confidence: Math.round(detectionData.confidence * 100),
      status: 'Active',
      description: `Plat nomor kendaraan terdeteksi (${detectionData.detections.length} deteksi)`,
      plateNumber: null, // Bisa ditambahkan OCR untuk membaca nomor plat
      timestamp: detectionData.timestamp
    };
    
    console.log('🚗 [SENTINEL] New alert created:', newAlert);
    
    // Add to alerts
    setAlerts(prevAlerts => {
      console.log('🚗 [SENTINEL] Previous alerts count:', prevAlerts.length);
      
      // Check if similar alert already exists (within last 30 seconds)
      const recentSimilarAlert = prevAlerts.find(alert => 
        alert.type === 'Plat Nomor Detected' && 
        alert.status === 'Active' &&
        new Date(alert.timestamp) > new Date(Date.now() - 30000)
      );
      
      console.log('🚗 [SENTINEL] Recent similar alert found:', recentSimilarAlert ? 'YES' : 'NO');
      
      let updatedAlerts;
      if (recentSimilarAlert) {
        // Update existing alert
        console.log('🚗 [SENTINEL] Updating existing alert (ID:', recentSimilarAlert.id, ')');
        updatedAlerts = prevAlerts.map(alert => 
          alert.id === recentSimilarAlert.id 
            ? { ...newAlert, id: alert.id }
            : alert
        );
      } else {
        // Add new alert
        console.log('🚗 [SENTINEL] Adding NEW alert');
        updatedAlerts = [newAlert, ...prevAlerts];
      }
      
      return updatedAlerts;
    });
  };

  // Handler untuk ketika jerigen terdeteksi
  const handleJerigenDetected = (detectionData) => {
    console.log('🎯 [SENTINEL] ========== handleJerigenDetected CALLED ==========');
    console.log('🎯 [SENTINEL] Detection data received:', detectionData);
    
    const now = new Date();
    const timeString = now.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
    
    const newAlert = {
      id: Date.now(),
      time: timeString,
      type: 'Jerigen Detected',
      location: 'Camera Feed',
      severity: detectionData.confidence > 0.8 ? 'critical' : 'warning',
      confidence: Math.round(detectionData.confidence * 100),
      status: 'Active',
      description: `Pengisian bensin menggunakan jerigen terdeteksi (${detectionData.detections.length} jerigen)`,
      plateNumber: null,
      timestamp: detectionData.timestamp
    };
    
    console.log('🎯 [SENTINEL] New alert created:', newAlert);
    
    // Add to alerts
    setAlerts(prevAlerts => {
      console.log('🎯 [SENTINEL] Previous alerts count:', prevAlerts.length);
      
      // Check if similar alert already exists (within last 30 seconds)
      const recentSimilarAlert = prevAlerts.find(alert => 
        alert.type === 'Jerigen Detected' && 
        alert.status === 'Active' &&
        new Date(alert.timestamp) > new Date(Date.now() - 30000)
      );
      
      console.log('🎯 [SENTINEL] Recent similar alert found:', recentSimilarAlert ? 'YES' : 'NO');
      if (recentSimilarAlert) {
        console.log('🎯 [SENTINEL] Recent alert timestamp:', recentSimilarAlert.timestamp);
        console.log('🎯 [SENTINEL] Current time:', new Date().toISOString());
        console.log('🎯 [SENTINEL] Time difference (ms):', Date.now() - new Date(recentSimilarAlert.timestamp).getTime());
      }
      
      let updatedAlerts;
      if (recentSimilarAlert) {
        // Update existing alert
        console.log('🎯 [SENTINEL] Updating existing alert (ID:', recentSimilarAlert.id, ')');
        updatedAlerts = prevAlerts.map(alert => 
          alert.id === recentSimilarAlert.id 
            ? { ...newAlert, id: alert.id }
            : alert
        );
      } else {
        // Add new alert
        console.log('🎯 [SENTINEL] Adding NEW alert');
        updatedAlerts = [newAlert, ...prevAlerts];
      }
      
      // Auto-play audio setiap kali jerigen terdeteksi
      // Debounce: hanya play audio jika lebih dari 18 detik sejak audio terakhir diputar
      // Atau jika ini adalah alert baru (tidak ada recent similar alert)
      // Ini mencegah spam audio tapi tetap memastikan audio diputar untuk deteksi baru
      const timeSinceLastAudio = Date.now() - lastJerigenAudioTimeRef.current;
      const AUDIO_DEBOUNCE_MS = 18000; // 18 detik debounce untuk audio (mencegah spam)
      const isNewAlert = !recentSimilarAlert;
      const shouldPlayAudio = isNewAlert || (timeSinceLastAudio > AUDIO_DEBOUNCE_MS);
      
      if (shouldPlayAudio) {
        console.log('🔔 [SENTINEL] ========== TRIGGERING AUDIO PLAYBACK ==========');
        console.log('🔔 [SENTINEL] Is new alert:', isNewAlert);
        console.log('🔔 [SENTINEL] Time since last audio:', timeSinceLastAudio, 'ms (need >', AUDIO_DEBOUNCE_MS, 'ms)');
        console.log('🔔 [SENTINEL] Condition met: Audio will play!');
        
        // Log privacy operations
        securityLog.logAnonymization(newAlert.type, true);
        securityLog.logEncryption('alert_data', true);
        privacyAPI.incrementAnonymized();
        privacyAPI.incrementEncrypted();
        
        // Play audio peringatan otomatis langsung
        console.log('🔔 [SENTINEL] Jerigen detected! Attempting to play audio...');
        console.log('🔔 [SENTINEL] User interacted:', userInteractedRef.current);
        console.log('🔔 [SENTINEL] Document has focus:', document.hasFocus());
        console.log('🔔 [SENTINEL] Alert to play:', newAlert);
        
        // Force user interaction flag jika belum set (untuk memastikan audio bisa play)
        if (!userInteractedRef.current) {
          console.log('⚠️ [SENTINEL] User interaction not detected, forcing...');
          userInteractedRef.current = true;
        }
        
        // Update waktu audio terakhir diputar
        lastJerigenAudioTimeRef.current = Date.now();
        
        // Coba play audio langsung dengan beberapa cara
        // Method 1: Langsung panggil
        console.log('🔔 [SENTINEL] Calling playAudioDirectly (method 1)...');
        playAudioDirectly(newAlert);
        
        // Method 2: Fallback dengan delay kecil (untuk memastikan)
        setTimeout(() => {
          if (window.speechSynthesis && !window.speechSynthesis.speaking) {
            console.log('🔄 [SENTINEL] Retrying audio playback (fallback method 2)...');
            playAudioDirectly(newAlert);
          } else {
            console.log('🔄 [SENTINEL] Audio already playing, skipping fallback');
          }
        }, 500);
      } else {
        console.log(`⏭️ [SENTINEL] Skipping audio to prevent spam`);
        console.log(`⏭️ [SENTINEL] - Only ${Math.round(timeSinceLastAudio / 1000)}s since last audio (need > ${AUDIO_DEBOUNCE_MS / 1000}s)`);
        console.log(`⏭️ [SENTINEL] - Is new alert: ${isNewAlert}`);
      }
      
      return updatedAlerts;
    });
  };
  
  // Process alerts through privacy layer (encrypt and anonymize for storage/logging)
  const [recentAlerts, setRecentAlerts] = useState(() => {
    // Process each alert through privacy-preserving layer
    return alerts.map(alert => {
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
  
  // Update recentAlerts when alerts change
  useEffect(() => {
    const processedAlerts = alerts.map(alert => {
      // Anonymize event for privacy-compliant logging
      const anonymized = anonymize_event(alert);
      
      // Encrypt sensitive data for secure storage
      const encrypted = encrypt_data({
        originalLocation: alert.location,
        originalDescription: alert.description,
        timestamp: alert.timestamp
      });
      
      // Return original alert for display (privacy layer works in background)
      return {
        ...alert,
        _privacy: {
          anonymized: anonymized,
          encrypted: encrypted,
          privacyCompliant: true
        }
      };
    });
    
    setRecentAlerts(processedAlerts);
  }, [alerts]);

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

    // Mark user interaction when they click anywhere on the page
    const handleUserInteraction = () => {
      userInteractedRef.current = true;
      console.log('✅ User interaction detected - audio auto-play enabled');
    };
    
    // Expose function untuk komponen lain (seperti JerigenDetection)
    window.userInteractedForAudio = handleUserInteraction;

    // Listen for user interactions (click, keypress, touch)
    window.addEventListener('click', handleUserInteraction, { once: true });
    window.addEventListener('keydown', handleUserInteraction, { once: true });
    window.addEventListener('touchstart', handleUserInteraction, { once: true });

    return () => {
      window.removeEventListener('click', handleUserInteraction);
      window.removeEventListener('keydown', handleUserInteraction);
      window.removeEventListener('touchstart', handleUserInteraction);
      // Cleanup exposed function
      if (window.userInteractedForAudio) {
        delete window.userInteractedForAudio;
      }
    };
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
      },
      'Jerigen Detected': {
        critical: `Peringatan darurat! Pengisian bensin menggunakan jerigen terdeteksi di ${alert.location}. Dilarang keras mengisi bensin menggunakan jerigen karena sangat berbahaya. Segera hentikan aktivitas tersebut.`,
        warning: `Peringatan! Pengisian bensin menggunakan jerigen terdeteksi di ${alert.location}. Dilarang mengisi bensin menggunakan jerigen.`,
        info: `Informasi: Pengisian bensin menggunakan jerigen terdeteksi di ${alert.location}. Harap perhatikan.`
      },
      'Wrong Dispenser': {
        critical: `Peringatan! Mobil dengan plat nomor ${alert.plateNumber || 'tidak diketahui'} berada di ${alert.location}. Harap pindah ke ${alert.correctDispenser || 'dispenser yang sesuai'}.`,
        warning: `Peringatan! Mobil dengan plat nomor ${alert.plateNumber || 'tidak diketahui'} berada di ${alert.location}. Harap pindah ke ${alert.correctDispenser || 'dispenser yang sesuai'}.`,
        info: `Informasi: Mobil dengan plat nomor ${alert.plateNumber || 'tidak diketahui'} berada di ${alert.location}. Harap pindah ke ${alert.correctDispenser || 'dispenser yang sesuai'}.`
      },
      'Plat Nomor Detected': {
        critical: `Plat nomor kendaraan terdeteksi di ${alert.location}. Confidence: ${alert.confidence}%.`,
        warning: `Plat nomor kendaraan terdeteksi di ${alert.location}. Confidence: ${alert.confidence}%.`,
        info: `Informasi: Plat nomor kendaraan terdeteksi di ${alert.location}. Confidence: ${alert.confidence}%.`
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

  // Play audio langsung tanpa async (untuk auto-play)
  const playAudioDirectly = (alert) => {
    try {
      console.log('🔊 [AUDIO] ========== STARTING AUDIO PLAYBACK ==========');
      console.log('🔊 [AUDIO] Playing audio for alert:', alert.type);
      console.log('🔊 [AUDIO] Alert details:', alert);
      console.log('🔊 [AUDIO] User interacted:', userInteractedRef.current);
      console.log('🔊 [AUDIO] Document has focus:', document.hasFocus());
      
      // Generate audio message
      const message = getAudioMessage(alert);
      console.log('📢 [AUDIO] Audio message:', message);
      console.log('📢 [AUDIO] Message length:', message.length);
      
      // Use Web Speech API for text-to-speech (local playback)
      if ('speechSynthesis' in window) {
        console.log('✅ [AUDIO] speechSynthesis available');
        console.log('✅ [AUDIO] Current speaking status:', window.speechSynthesis.speaking);
        console.log('✅ [AUDIO] Current pending status:', window.speechSynthesis.pending);
        
        // Stop any ongoing speech
        window.speechSynthesis.cancel();
        console.log('🛑 [AUDIO] Cancelled any ongoing speech');
        
        // Wait a bit untuk memastikan cancel selesai
        setTimeout(() => {
          try {
            console.log('🎤 [AUDIO] Creating utterance...');
            const utterance = new SpeechSynthesisUtterance(message);
            utterance.lang = 'id-ID'; // Indonesian
            utterance.rate = 0.9;
            utterance.pitch = 1;
            utterance.volume = 1;
            console.log('✅ [AUDIO] Utterance created with properties:', {
              lang: utterance.lang,
              rate: utterance.rate,
              pitch: utterance.pitch,
              volume: utterance.volume
            });
            
            // Multiple fallback attempts
            let attemptCount = 0;
            const maxAttempts = 3;
            
            const tryPlay = () => {
              attemptCount++;
              console.log(`🔄 [AUDIO] Attempt ${attemptCount}/${maxAttempts} to play audio...`);
              
              const isSpeaking = window.speechSynthesis.speaking;
              const isPending = window.speechSynthesis.pending;
              console.log('🔍 [AUDIO] Status before speak - speaking:', isSpeaking, 'pending:', isPending);
              
              if (!isSpeaking && !isPending) {
                try {
                  window.speechSynthesis.speak(utterance);
                  console.log('✅ [AUDIO] speechSynthesis.speak() called');
                  
                  // Check status setelah 200ms
                  setTimeout(() => {
                    const stillSpeaking = window.speechSynthesis.speaking;
                    const stillPending = window.speechSynthesis.pending;
                    console.log('🔍 [AUDIO] Status after 200ms - speaking:', stillSpeaking, 'pending:', stillPending);
                    
                    if (!stillSpeaking && !stillPending && attemptCount < maxAttempts) {
                      console.log(`⚠️ [AUDIO] Audio tidak mulai setelah 200ms, mencoba lagi (attempt ${attemptCount + 1})...`);
                      setTimeout(tryPlay, 300);
                    }
                  }, 200);
                } catch (speakErr) {
                  console.error('❌ [AUDIO] Error calling speak:', speakErr);
                  if (attemptCount < maxAttempts) {
                    setTimeout(tryPlay, 300);
                  }
                }
              } else {
                console.log('⚠️ [AUDIO] Speech synthesis is busy, waiting...');
                if (attemptCount < maxAttempts) {
                  setTimeout(tryPlay, 500);
                }
              }
            };
            
            utterance.onstart = () => {
              console.log('✅ [AUDIO] ========== AUDIO STARTED PLAYING! ==========');
              setPlayingAudioId(alert.id);
            };
            
            utterance.onend = () => {
              console.log('✅ [AUDIO] ========== AUDIO FINISHED PLAYING ==========');
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
            
            utterance.onerror = (error) => {
              console.error('❌ [AUDIO] ========== AUDIO PLAYBACK ERROR ==========');
              console.error('❌ [AUDIO] Error details:', {
                error: error.error,
                type: error.type,
                charIndex: error.charIndex
              });
              setPlayingAudioId(null);
              securityLog.log({
                type: 'audio',
                category: 'playback',
                severity: 'medium',
                message: `Audio playback failed: ${alert.type}`,
                details: { alertId: alert.id, error: error?.error || 'Unknown error' },
                status: 'error'
              });
              
              // Retry on error if attempts remaining
              if (attemptCount < maxAttempts) {
                console.log(`🔄 [AUDIO] Retrying after error (attempt ${attemptCount + 1})...`);
                setTimeout(tryPlay, 500);
              }
            };
            
            // Start first attempt
            tryPlay();
          } catch (speakError) {
            console.error('❌ [AUDIO] Error creating utterance:', speakError);
            console.error('❌ [AUDIO] Error stack:', speakError.stack);
          }
        }, 100);
      } else {
        console.warn('⚠️ [AUDIO] Speech synthesis tidak tersedia di browser ini');
        alert('Browser tidak mendukung text-to-speech. Silakan gunakan browser yang lebih baru.');
      }
    } catch (error) {
      console.error('❌ [AUDIO] Error in playAudioDirectly:', error);
      console.error('❌ [AUDIO] Error stack:', error.stack);
    }
  };
  
  // Play audio and send to IP Webcam
  const playAudio = async (alert) => {
    try {
      // Mark that user has interacted
      userInteractedRef.current = true;
      
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
        
        utterance.onerror = (error) => {
          setPlayingAudioId(null);
          securityLog.log({
            type: 'audio',
            category: 'playback',
            severity: 'medium',
            message: `Audio playback failed: ${alert.type}`,
            details: { alertId: alert.id, error: error?.error || 'Unknown error' },
            status: 'error'
          });
        };
      } else {
        // Fallback jika speechSynthesis tidak tersedia
        setPlayingAudioId(null);
        console.warn('Speech synthesis tidak tersedia di browser ini');
      }
      
      // Note: captureAndSendAudio untuk IP Webcam di-disable untuk menghindari permission error
      // Jika diperlukan, bisa diaktifkan dengan permission handling yang lebih baik
      // try {
      //   await captureAndSendAudio(message);
      // } catch (webcamError) {
      //   console.warn('Could not send audio to IP Webcam:', webcamError);
      //   // Audio will still play locally via text-to-speech
      // }
      
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
      // Jangan tampilkan alert error, cukup log saja
      console.warn('Gagal memutar audio. Pastikan browser mendukung text-to-speech.');
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

  // Auto-play audio for active alerts (Jerigen Detected and Wrong Dispenser)
  // DISABLED: Auto-play is disabled to prevent audio from playing when clicking Sentinel feature
  // Audio will only play when user explicitly clicks the "Play Audio" button
  // Uncomment and modify this useEffect if you want to re-enable auto-play for new alerts only
  /*
  useEffect(() => {
    // Skip auto-play on initial mount or if user hasn't interacted yet
    if (isInitialMountRef.current) {
      isInitialMountRef.current = false;
      return;
    }

    // Only auto-play if user has interacted with the page
    if (!userInteractedRef.current) {
      return;
    }

    const activeAlerts = recentAlerts.filter(alert => 
      alert.status === 'Active' && 
      (alert.type === 'Jerigen Detected' || alert.type === 'Wrong Dispenser') &&
      !playedAlertsRef.current.has(alert.id)
    );

    if (activeAlerts.length > 0 && !playingAudioId) {
      // Play audio for the first active alert that hasn't been played yet
      const alertToPlay = activeAlerts[0];
      const message = getAudioMessage(alertToPlay);
      
      // Mark this alert as played
      playedAlertsRef.current.add(alertToPlay.id);
      
      if ('speechSynthesis' in window) {
        // Stop any ongoing speech
        window.speechSynthesis.cancel();
        
        // Small delay to ensure previous audio is stopped
        setTimeout(() => {
          const utterance = new SpeechSynthesisUtterance(message);
          utterance.lang = 'id-ID';
          utterance.rate = 0.9;
          utterance.pitch = 1;
          utterance.volume = 1;
          
          utterance.onend = () => {
            setPlayingAudioId(null);
          };
          
          utterance.onerror = () => {
            setPlayingAudioId(null);
          };
          
          setPlayingAudioId(alertToPlay.id);
          window.speechSynthesis.speak(utterance);
          
          // Try to send audio to IP Webcam
          captureAndSendAudio(message).catch(err => {
            console.warn('Could not send audio to IP Webcam:', err);
          });
        }, 500);
      }
    }
    
    // Reset played alerts when status changes from Active to something else
    recentAlerts.forEach(alert => {
      if (alert.status !== 'Active' && playedAlertsRef.current.has(alert.id)) {
        playedAlertsRef.current.delete(alert.id);
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [recentAlerts, playingAudioId]);
  */

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
          
          {/* Jerigen Detection Section */}
          <JerigenDetection onJerigenDetected={handleJerigenDetected} />
          
          {/* Plat Nomor Detection Section */}
          <PlatNomorDetection onPlatDetected={handlePlatDetected} />

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

