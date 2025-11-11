import React, { useState, useEffect, useRef } from 'react';
import { 
  AlertTriangle, 
  Droplet, 
  Monitor, 
  Thermometer, 
  Shield, 
  Volume2, 
  VolumeX,
  CheckCircle,
  Clock,
  TrendingUp,
  Activity,
  Camera,
  Users,
  X,
  Play,
  Pause,
  Menu,
  ChevronLeft,
  MapPin,
  Calendar,
  Cloud,
  ChevronDown,
  User,
  Sun,
  Moon,
  Download,
  FileText
} from 'lucide-react';
import Sidebar from '../komponen/Sidebar';
import Navbar from '../komponen/Navbar';
import { useAuth } from '../auth/AuthContext';
import PrivacySecurityPanel from './features/privacy/PrivacySecurityPanel';
import { encrypt_data, anonymize_event } from './features/privacy/privacyUtils';
import { securityLog } from './features/privacy/securityLog';
import { privacyAPI } from './features/privacy/privacyAPI';

const CommandCenterDashboard = () => {
  const { user } = useAuth();
  const [muted, setMuted] = useState(false);
  const [selectedFeature, setSelectedFeature] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [sidebarMinimized, setSidebarMinimized] = useState(false);
  const [selectedView, setSelectedView] = useState('Overview');
  const [currentDateTime, setCurrentDateTime] = useState(new Date());
  const [weather, setWeather] = useState({ temp: 28, condition: 'Sunny', icon: '☀️' });
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const saved = localStorage.getItem('commandCenterTheme');
    return saved ? saved === 'dark' : true; // Default to dark
  });
  
  // Camera & Brand Detection States
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [cameraMode, setCameraMode] = useState('phone'); // 'phone' or 'ipwebcam'
  const [cameraStream, setCameraStream] = useState(null);
  const [detectedBrand, setDetectedBrand] = useState(null);
  const [detectionConfidence, setDetectionConfidence] = useState(0);
  const [isDetecting, setIsDetecting] = useState(false);
  const [apiConnectionError, setApiConnectionError] = useState(false);
  const videoRef = useRef(null);
  const imgRef = useRef(null);
  const canvasRef = useRef(null);
  const detectionIntervalRef = useRef(null);
  const snapshotIntervalRef = useRef(null);
  
  // API Configuration - Brand Detection from engine-insight-quick
  // Try multiple ports in case server is running on different port
  const BRAND_DETECTION_API_PORTS = [3000, 8080];
  const getBrandDetectionAPI = () => {
    // Try to find which port is available (you can customize this)
    const port = BRAND_DETECTION_API_PORTS[0]; // Default to 3000 (from package.json)
    return `http://localhost:${port}/detect-brand-realtime`;
  };
  const BRAND_DETECTION_API = getBrandDetectionAPI();
  
  // IP Webcam Configuration
  const IP_WEBCAM_URL = 'http://192.168.1.38:8080';
  const IP_WEBCAM_STREAM = `${IP_WEBCAM_URL}/video`; // MJPEG stream endpoint
  const IP_WEBCAM_SNAPSHOT = `${IP_WEBCAM_URL}/shot.jpg`; // JPEG snapshot endpoint

  // Sample data untuk 4 fitur
  const systemStatus = [
    {
      id: 'smart-drip',
      name: 'Smart Drip AI',
      status: 'Normal',
      health: 98,
      lastAlert: '1h ago',
      icon: Droplet,
      color: 'green',
      statusColor: 'bg-green-500'
    },
    {
      id: 'touchscreen',
      name: 'Touchscreen Health',
      status: 'Delayed',
      health: 82,
      lastAlert: '10m ago',
      icon: Monitor,
      color: 'yellow',
      statusColor: 'bg-yellow-500'
    },
    {
      id: 'thermalwatch',
      name: 'ThermalWatch',
      status: 'Stable',
      health: 95,
      lastAlert: '3h ago',
      icon: Thermometer,
      color: 'green',
      statusColor: 'bg-green-500'
    },
    {
      id: 'sentinel',
      name: 'Sentinel',
      status: 'Hazard Detected',
      health: 75,
      lastAlert: '2m ago',
      icon: Shield,
      color: 'red',
      statusColor: 'bg-red-500'
    }
  ];

  const originalActiveAlerts = [
    {
      id: 1,
      severity: 'critical',
      event: 'Spill detected',
      source: 'Sentinel',
      time: '14:32',
      location: 'Pump 2',
      confidence: 92,
      timestamp: new Date().toISOString()
    },
    {
      id: 2,
      severity: 'warning',
      event: 'Touchscreen delay > 3s',
      source: 'Touchscreen',
      time: '14:28',
      location: 'Dispenser 3',
      confidence: 85,
      timestamp: new Date().toISOString()
    },
    {
      id: 3,
      severity: 'info',
      event: 'Drip stable',
      source: 'Smart Drip',
      time: '14:00',
      location: 'All Pumps',
      confidence: 98,
      timestamp: new Date().toISOString()
    }
  ];

  // Process alerts through privacy layer
  const [activeAlerts] = useState(() => {
    return originalActiveAlerts.map(alert => {
      const anonymized = anonymize_event(alert);
      const encrypted = encrypt_data({
        originalLocation: alert.location,
        event: alert.event,
        timestamp: alert.timestamp
      });
      
      securityLog.logAnonymization('command_center_alert', true);
      securityLog.logEncryption('alert_data', true);
      privacyAPI.incrementAnonymized();
      privacyAPI.incrementEncrypted();
      
      return {
        ...alert,
        _privacy: { anonymized, encrypted, privacyCompliant: true }
      };
    });
  });

  // Initialize privacy/security logging
  useEffect(() => {
    securityLog.logAccess('command_center_dashboard', user?.id || 'system', true);
    securityLog.log({
      type: 'system',
      category: 'initialization',
      severity: 'low',
      message: 'Command Center dashboard initialized with privacy-preserving AI layer',
      details: { feature: 'privacy_security_layer' }
    });
  }, [user]);

  // Sample data untuk graphs
  const temperatureData = [
    { time: '08:00', dispenser1: 28, dispenser2: 30, dispenser3: 29, safeMax: 40 },
    { time: '10:00', dispenser1: 32, dispenser2: 33, dispenser3: 31, safeMax: 40 },
    { time: '12:00', dispenser1: 35, dispenser2: 36, dispenser3: 34, safeMax: 40 },
    { time: '14:00', dispenser1: 38, dispenser2: 37, dispenser3: 36, safeMax: 40 },
    { time: '16:00', dispenser1: 36, dispenser2: 35, dispenser3: 34, safeMax: 40 }
  ];

  const responseTimeData = [
    { time: '08:00', avg: 120 },
    { time: '10:00', avg: 150 },
    { time: '12:00', avg: 180 },
    { time: '14:00', avg: 320 },
    { time: '16:00', avg: 280 }
  ];

  const dripFrequencyData = [
    { day: 'Mon', count: 2 },
    { day: 'Tue', count: 1 },
    { day: 'Wed', count: 3 },
    { day: 'Thu', count: 2 },
    { day: 'Fri', count: 4 },
    { day: 'Sat', count: 1 },
    { day: 'Sun', count: 0 }
  ];

  const safetyEventsData = {
    spills: 45,
    queueAlerts: 30,
    hazards: 25
  };

  // Track previous brand detection to avoid duplicate notifications
  const prevBrandRef = useRef(null);
  
  // Notifikasi ketika brand terdeteksi dari kamera
  useEffect(() => {
    if (detectedBrand && detectionConfidence > 0) {
      // Cek apakah ini deteksi baru (bukan duplikat)
      const currentBrandKey = `${detectedBrand}-${detectionConfidence}`;
      if (prevBrandRef.current !== currentBrandKey) {
        const newNotification = {
          id: Date.now(),
          type: 'info',
          message: `Brand terdeteksi: ${detectedBrand} (Confidence: ${detectionConfidence}%)`,
          time: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })
        };
        setNotifications(prev => [newNotification, ...prev].slice(0, 5));
        prevBrandRef.current = currentBrandKey;
      }
    } else if (!detectedBrand && detectionConfidence === 0) {
      // Reset previous brand ketika tidak ada deteksi
      prevBrandRef.current = null;
    }
  }, [detectedBrand, detectionConfidence]);

  // Update date and time
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentDateTime(new Date());
    }, 1000); // Update every second

    return () => clearInterval(interval);
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };

    if (dropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [dropdownOpen]);

  // Save theme preference
  useEffect(() => {
    localStorage.setItem('commandCenterTheme', isDarkMode ? 'dark' : 'light');
  }, [isDarkMode]);

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };

  // Start camera stream - Phone camera or IP Webcam
  const startCamera = async (mode = 'phone') => {
    try {
      setCameraMode(mode);
      setIsCameraActive(true);
      
      if (mode === 'phone') {
        // Use phone camera (getUserMedia)
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { 
            facingMode: 'environment', // Use back camera if available
            width: { ideal: 1280 },
            height: { ideal: 720 }
          }
        });
        
        setCameraStream(stream);
        
        // Attach stream to video element
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          
          // Wait for video to be ready
          videoRef.current.onloadedmetadata = () => {
            console.log('Phone camera video metadata loaded');
            if (videoRef.current) {
              videoRef.current.play().then(() => {
                console.log('Phone camera video playing');
              }).catch(err => {
                console.error('Error playing phone camera video:', err);
              });
            }
          };
          
          // Ensure video plays immediately
          videoRef.current.play().then(() => {
            console.log('Phone camera video started playing');
          }).catch(err => {
            console.error('Error playing phone camera video:', err);
          });
        }
        
        // Start detection interval after a short delay
        setTimeout(() => {
          startBrandDetection();
        }, 1000);
      } else {
        // Use IP Webcam - Try MJPEG stream first, fallback to snapshot refresh
        if (imgRef.current) {
          // Try MJPEG stream first
          imgRef.current.src = IP_WEBCAM_STREAM;
          imgRef.current.onerror = () => {
            // If MJPEG fails, use snapshot with auto-refresh
            console.log('MJPEG stream failed, using snapshot refresh');
            imgRef.current.src = IP_WEBCAM_SNAPSHOT + '?t=' + Date.now();
            
            // Refresh snapshot every 100ms for smooth video-like experience
            snapshotIntervalRef.current = setInterval(() => {
              if (imgRef.current && isCameraActive) {
                imgRef.current.src = IP_WEBCAM_SNAPSHOT + '?t=' + Date.now();
              }
            }, 100);
          };
          
          imgRef.current.onload = () => {
            console.log('IP Webcam stream loaded');
          };
        }
        
        // Start detection interval after a short delay
        setTimeout(() => {
          startBrandDetection();
        }, 2000); // Give more time for IP webcam to load
      }
    } catch (error) {
      console.error('Error accessing camera:', error);
      if (mode === 'phone') {
        alert('Tidak dapat mengakses kamera HP. Pastikan izin kamera sudah diberikan.');
      } else {
        alert('Tidak dapat mengakses IP Webcam. Pastikan IP Webcam aktif dan dapat diakses di ' + IP_WEBCAM_URL);
      }
      setIsCameraActive(false);
    }
  };

  // Effect to ensure video stream is attached when camera becomes active (phone mode)
  useEffect(() => {
    if (isCameraActive && cameraMode === 'phone' && cameraStream && videoRef.current) {
      if (videoRef.current.srcObject !== cameraStream) {
        videoRef.current.srcObject = cameraStream;
        videoRef.current.play().catch(err => {
          console.error('Error playing video in useEffect:', err);
        });
      }
    }
  }, [isCameraActive, cameraMode, cameraStream]);
  
  // Effect to ensure image stream is attached when camera becomes active (IP webcam mode)
  useEffect(() => {
    if (isCameraActive && cameraMode === 'ipwebcam' && imgRef.current && !imgRef.current.src) {
      imgRef.current.src = IP_WEBCAM_STREAM;
    }
  }, [isCameraActive, cameraMode]);

  // Stop camera stream
  const stopCamera = () => {
    setIsCameraActive(false);
    
    // Stop phone camera stream
    if (cameraStream) {
      cameraStream.getTracks().forEach(track => track.stop());
      setCameraStream(null);
    }
    
    // Stop IP webcam stream
    if (imgRef.current) {
      imgRef.current.src = '';
    }
    
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    
    // Stop snapshot refresh interval
    if (snapshotIntervalRef.current) {
      clearInterval(snapshotIntervalRef.current);
      snapshotIntervalRef.current = null;
    }
    
    // Stop detection interval
    if (detectionIntervalRef.current) {
      clearInterval(detectionIntervalRef.current);
      detectionIntervalRef.current = null;
    }
    
    setDetectedBrand(null);
    setDetectionConfidence(0);
  };

  // Capture frame from image/video and send to API
  const captureAndDetect = async () => {
    if ((!imgRef.current && !videoRef.current) || !canvasRef.current || isDetecting) return;
    
    try {
      setIsDetecting(true);
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      
      // Use img element if available (IP webcam), otherwise use video
      const sourceElement = imgRef.current || videoRef.current;
      
      if (!sourceElement) return;
      
      // Get dimensions
      const width = sourceElement.naturalWidth || sourceElement.videoWidth || 640;
      const height = sourceElement.naturalHeight || sourceElement.videoHeight || 480;
      
      // Set canvas size
      canvas.width = width;
      canvas.height = height;
      
      // Clear canvas first
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      let imageBase64;
      
      // For video from getUserMedia (phone camera), direct draw works fine
      if (sourceElement === videoRef.current && videoRef.current) {
        // Video from getUserMedia doesn't have CORS issues - draw directly
        ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
        
        // Export canvas - this should work for getUserMedia video
        try {
          imageBase64 = canvas.toDataURL('image/jpeg', 0.8);
        } catch (error) {
          console.error('Failed to export video canvas:', error);
          throw error;
        }
      } 
      // For image from IP webcam, fetch snapshot directly to avoid CORS
      else if (sourceElement === imgRef.current && imgRef.current) {
        try {
          // For IP webcam, fetch snapshot directly as blob
          // Use snapshot endpoint with timestamp to get fresh image
          const snapshotUrl = IP_WEBCAM_SNAPSHOT + '?t=' + Date.now();
          
          // Try to fetch snapshot (may fail due to CORS, but worth trying)
          const response = await fetch(snapshotUrl, {
            cache: 'no-cache',
            // Don't use mode: 'no-cors' as we need to read the response
          });
          
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          
          // Convert response to blob
          const blob = await response.blob();
          
          // Convert blob directly to base64 (skip canvas to avoid CORS)
          const reader = new FileReader();
          imageBase64 = await new Promise((resolve, reject) => {
            reader.onload = () => {
              // reader.result is already a data URL (base64)
              resolve(reader.result);
            };
            reader.onerror = () => {
              reject(new Error('Failed to read IP webcam image'));
            };
            reader.readAsDataURL(blob);
          });
          
          // Note: We bypass canvas for IP webcam to completely avoid CORS issues
          // The base64 data URL is ready to send to API
        } catch (fetchError) {
          console.warn('Failed to fetch IP webcam snapshot directly:', fetchError);
          console.warn('IP webcam may not allow CORS. Trying canvas method...');
          
          // Fallback: try direct canvas draw (may fail due to CORS)
          try {
            ctx.drawImage(imgRef.current, 0, 0, canvas.width, canvas.height);
            imageBase64 = canvas.toDataURL('image/jpeg', 0.8);
          } catch (canvasError) {
            console.error('Canvas draw also failed due to CORS:', canvasError);
            // If both methods fail, suggest using phone camera
            console.warn('⚠️ IP webcam has CORS restrictions. Please use phone camera for brand detection.');
            throw new Error('IP webcam CORS restriction: Use phone camera instead for brand detection');
          }
        }
      }
      
      // Try multiple ports if first one fails
      let lastError = null;
      for (const port of BRAND_DETECTION_API_PORTS) {
        let timeoutId = null;
        try {
          const apiUrl = `http://localhost:${port}/detect-brand-realtime`;
          
          // Create abort controller for timeout
          const controller = new AbortController();
          timeoutId = setTimeout(() => controller.abort(), 5000); // 5 second timeout
          
          const response = await fetch(apiUrl, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              image_base64: imageBase64
            }),
            signal: controller.signal
          });
          
          clearTimeout(timeoutId);
          timeoutId = null;
          
          if (!response.ok) {
            throw new Error(`API request failed with status ${response.status}`);
          }
          
          const result = await response.json();
          
          if (result.detected && result.brand) {
            setDetectedBrand(result.brand);
            setDetectionConfidence(Math.round(result.confidence * 100));
            setApiConnectionError(false); // API is working
            return; // Success, exit function
          } else {
            setDetectedBrand(null);
            setDetectionConfidence(0);
            setApiConnectionError(false); // API is working, just no brand detected
            return; // No brand detected, but API responded
          }
        } catch (error) {
          // Clear timeout if still active
          if (timeoutId) {
            clearTimeout(timeoutId);
          }
          lastError = error;
          console.log(`API port ${port} failed, trying next...`);
          // Continue to next port
        }
      }
      
      // If all ports failed, show error
      if (lastError) {
        console.error('All API ports failed:', lastError);
        setApiConnectionError(true);
        // Only show error once to avoid spam
        if (!lastError.message.includes('API server')) {
          console.warn('⚠️ API server tidak berjalan. Pastikan engine-insight-quick API server sudah dijalankan:');
          console.warn('   cd engine-insight-quick');
          console.warn('   npm run api:server');
          console.warn('   atau');
          console.warn('   deno run --allow-net --allow-env --allow-run --allow-read --allow-write api-server.ts --port 3000');
        }
        setDetectedBrand(null);
        setDetectionConfidence(0);
      }
    } catch (error) {
      console.error('Error detecting brand:', error);
      setDetectedBrand(null);
      setDetectionConfidence(0);
    } finally {
      setIsDetecting(false);
    }
  };

  // Start brand detection interval
  const startBrandDetection = () => {
    // Detect every 3 seconds
    detectionIntervalRef.current = setInterval(() => {
      captureAndDetect();
    }, 3000);
    
    // Initial detection after 1 second
    setTimeout(() => {
      captureAndDetect();
    }, 1000);
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (cameraStream) {
        cameraStream.getTracks().forEach(track => track.stop());
      }
      if (detectionIntervalRef.current) {
        clearInterval(detectionIntervalRef.current);
      }
      if (snapshotIntervalRef.current) {
        clearInterval(snapshotIntervalRef.current);
      }
      if (imgRef.current) {
        imgRef.current.src = '';
      }
      if (videoRef.current) {
        videoRef.current.src = '';
        videoRef.current.srcObject = null;
      }
    };
  }, [cameraStream]);

  const handleDownloadAnalytics = () => {
    // Download analytics data as JSON
    const analyticsData = {
      stationId: 'SPBU 31.12.902 (Kemang)',
      manager: user?.name || 'Manager SPBU Kemang',
      generatedAt: new Date().toISOString(),
      systemStatus,
      activeAlerts,
      temperatureData,
      responseTimeData,
      dripFrequencyData,
      safetyEventsData
    };

    const dataStr = JSON.stringify(analyticsData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `STORI_Analytics_${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleDownloadTatsunoManual = () => {
    // Download Tatsuno manual book PDF
    const link = document.createElement('a');
    link.href = '/assets/manual book tatsuno.pdf';
    link.download = 'manual book tatsuno.pdf';
    link.target = '_blank';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleDownloadGilbarcoManual = () => {
    // Download Gilbarco manual book PDF
    const link = document.createElement('a');
    link.href = '/assets/manual book gilbarco.pdf';
    link.download = 'manual book gilbarco.pdf';
    link.target = '_blank';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleExportPDF = () => {
    // Dynamic import jsPDF
    import('jspdf').then((jsPDF) => {
      const { jsPDF: JSPDF } = jsPDF;
      const doc = new JSPDF('p', 'mm', 'a4');
      
      // Colors
      const primaryBlue = [0, 95, 163]; // #005FA3
      const darkGray = [51, 51, 51];
      const lightGray = [128, 128, 128];
      
      // Header
      doc.setFillColor(...primaryBlue);
      doc.rect(10, 10, 190, 20, 'F');
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(20);
      doc.setFont('helvetica', 'bold');
      doc.text('STORI Command Center Report', 105, 22, { align: 'center' });
      
      // Station Info
      let yPos = 40;
      doc.setTextColor(...darkGray);
      doc.setFontSize(14);
      doc.setFont('helvetica', 'bold');
      doc.text('Station Information', 10, yPos);
      
      yPos += 8;
      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(...lightGray);
      doc.text(`Station ID: SPBU 31.12.902 (Kemang)`, 10, yPos);
      yPos += 6;
      doc.text(`Manager: ${user?.name || 'Manager SPBU Kemang'}`, 10, yPos);
      yPos += 6;
      doc.text(`Role: ${user?.role || 'Manager'}`, 10, yPos);
      yPos += 6;
      doc.text(`Report Generated: ${new Date().toLocaleString('id-ID')}`, 10, yPos);
      
      // System Status
      yPos += 12;
      doc.setFontSize(14);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(...darkGray);
      doc.text('System Status Summary', 10, yPos);
      
      yPos += 8;
      doc.setFontSize(9);
      doc.setFont('helvetica', 'normal');
      systemStatus.forEach((system, index) => {
        if (yPos > 270) {
          doc.addPage();
          yPos = 20;
        }
        doc.setTextColor(...darkGray);
        doc.setFont('helvetica', 'bold');
        doc.text(`${system.name}:`, 10, yPos);
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(...lightGray);
        doc.text(`Status: ${system.status}`, 30, yPos);
        doc.text(`Health: ${system.health}%`, 100, yPos);
        doc.text(`Last Alert: ${system.lastAlert}`, 140, yPos);
        yPos += 7;
      });
      
      // Active Alerts
      yPos += 5;
      if (yPos > 270) {
        doc.addPage();
        yPos = 20;
      }
      doc.setFontSize(14);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(...darkGray);
      doc.text('Active Alerts', 10, yPos);
      
      yPos += 8;
      doc.setFontSize(9);
      doc.setFont('helvetica', 'normal');
      activeAlerts.forEach((alert) => {
        if (yPos > 270) {
          doc.addPage();
          yPos = 20;
        }
        const severityColor = alert.severity === 'critical' ? [114, 48, 124] : // #72307C purple
                               alert.severity === 'warning' ? [175, 193, 80] : // #AFC150 yellow-green
                               [0, 95, 163]; // #005FA3 blue
        doc.setFillColor(...severityColor);
        doc.circle(12, yPos - 2, 2, 'F');
        doc.setTextColor(...darkGray);
        doc.setFont('helvetica', 'bold');
        doc.text(`${alert.event}`, 18, yPos);
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(...lightGray);
        doc.text(`${alert.source} • ${alert.location} • ${alert.time}`, 18, yPos + 5);
        yPos += 10;
      });
      
      // Summary Statistics
      yPos += 5;
      if (yPos > 270) {
        doc.addPage();
        yPos = 20;
      }
      doc.setFontSize(14);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(...darkGray);
      doc.text('Summary Statistics', 10, yPos);
      
      yPos += 8;
      doc.setFontSize(9);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(...lightGray);
      doc.text(`Total Active Alerts: ${activeAlerts.length}`, 10, yPos);
      yPos += 6;
      doc.text(`Critical Alerts: ${activeAlerts.filter(a => a.severity === 'critical').length}`, 10, yPos);
      yPos += 6;
      doc.text(`Warning Alerts: ${activeAlerts.filter(a => a.severity === 'warning').length}`, 10, yPos);
      yPos += 6;
      doc.text(`Average System Health: ${Math.round(systemStatus.reduce((sum, s) => sum + s.health, 0) / systemStatus.length)}%`, 10, yPos);
      
      // Footer
      const pageCount = doc.internal.pages.length - 1;
      for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        doc.setFontSize(8);
        doc.setTextColor(...lightGray);
        doc.text(`Page ${i} of ${pageCount}`, 105, 285, { align: 'center' });
        doc.text(`STORI AI - Generated on ${new Date().toLocaleDateString('id-ID')}`, 105, 290, { align: 'center' });
      }
      
      // Save PDF
      doc.save(`STORI_Report_${new Date().toISOString().split('T')[0]}.pdf`);
    }).catch((error) => {
      console.error('Error loading jsPDF:', error);
      alert('Error generating PDF. Please install jsPDF: npm install jspdf');
    });
  };

  const handleAcknowledge = (alertId) => {
    console.log('Acknowledge alert:', alertId);
  };

  const handleDispatch = (alertId) => {
    console.log('Dispatch alert:', alertId);
  };

  const handleAssignTech = (alertId) => {
    console.log('Assign tech to alert:', alertId);
  };

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'critical':
        return isDarkMode 
          ? 'bg-red-500/20 border-red-500 text-red-300' 
          : 'bg-red-500/20 border-red-500 text-red-700';
      case 'warning':
        return isDarkMode 
          ? 'bg-yellow-500/20 border-yellow-500 text-yellow-300' 
          : 'bg-yellow-500/20 border-yellow-500 text-yellow-700';
      case 'info':
        return isDarkMode 
          ? 'bg-green-500/20 border-green-500 text-green-300' 
          : 'bg-green-500/20 border-green-500 text-green-700';
      default:
        return 'bg-gray-500/20 border-gray-500 text-gray-400';
    }
  };

  const getSeverityIcon = (severity) => {
    switch (severity) {
      case 'critical':
        return <AlertTriangle className="w-5 h-5 text-red-500" />;
      case 'warning':
        return <AlertTriangle className="w-5 h-5 text-yellow-500" />;
      case 'info':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      default:
        return <Clock className="w-5 h-5 text-gray-500" />;
    }
  };

  const getNotificationStyle = (type) => {
    switch (type) {
      case 'critical':
        return {
          border: 'border-red-500/50',
          icon: <AlertTriangle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />,
          bg: isDarkMode ? 'bg-red-500/10' : 'bg-red-50'
        };
      case 'warning':
        return {
          border: 'border-yellow-500/50',
          icon: <AlertTriangle className="w-5 h-5 text-yellow-500 flex-shrink-0 mt-0.5" />,
          bg: isDarkMode ? 'bg-yellow-500/10' : 'bg-yellow-50'
        };
      case 'info':
        return {
          border: 'border-[#005FA3]/50',
          icon: <CheckCircle className="w-5 h-5 text-[#005FA3] flex-shrink-0 mt-0.5" />,
          bg: isDarkMode ? 'bg-[#005FA3]/10' : 'bg-blue-50'
        };
      default:
        return {
          border: 'border-gray-500/50',
          icon: <Clock className="w-5 h-5 text-gray-500 flex-shrink-0 mt-0.5" />,
          bg: isDarkMode ? 'bg-gray-500/10' : 'bg-gray-50'
        };
    }
  };

  // Theme-based class names with custom palette
  const themeClasses = {
    bg: isDarkMode ? 'bg-[#0a0a0a]' : 'bg-gray-50',
    text: isDarkMode ? 'text-white' : 'text-gray-900',
    textSecondary: isDarkMode ? 'text-gray-400' : 'text-gray-600',
    card: isDarkMode ? 'bg-[#2A4333]' : 'bg-white',
    border: isDarkMode ? 'border-[#2A4333]' : 'border-gray-200',
    input: isDarkMode ? 'bg-[#2A4333]' : 'bg-gray-100',
    hover: isDarkMode ? 'hover:bg-[#2A4333]/80' : 'hover:bg-gray-100'
  };

  return (
    <div className={`flex h-screen ${themeClasses.bg} ${themeClasses.text}`}>
      {/* CSS Animations for Scanning */}
      <style>{`
        @keyframes scanLine {
          0% {
            top: 0%;
            opacity: 1;
          }
          50% {
            opacity: 0.8;
          }
          100% {
            top: 100%;
            opacity: 1;
          }
        }
        @keyframes scanBorder {
          0%, 100% {
            opacity: 0.6;
            box-shadow: 0 0 20px rgba(0, 95, 163, 0.6), inset 0 0 20px rgba(0, 95, 163, 0.3);
          }
          50% {
            opacity: 1;
            box-shadow: 0 0 30px rgba(0, 95, 163, 0.9), inset 0 0 30px rgba(0, 95, 163, 0.5);
          }
        }
      `}</style>
      
      {/* Sidebar */}
      <Sidebar 
        minimized={sidebarMinimized} 
        onToggleMinimize={() => setSidebarMinimized(!sidebarMinimized)} 
      />

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        {/* Navbar */}
        <Navbar />

        {/* Command Center Content */}
        <div className="p-6 space-y-6">
          {/* Header */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h1 className={`text-3xl font-bold ${themeClasses.text} mb-2`}>STORI Command Center</h1>
                <p className={themeClasses.textSecondary}>One screen to monitor all predictive & preventive activities in your station</p>
              </div>
              <div className="flex items-center space-x-4">
                {/* Theme Toggle */}
                <button
                  onClick={toggleTheme}
                  className={`px-2 py-1.5 rounded-lg flex items-center space-x-1.5 transition-colors ${
                    isDarkMode
                      ? 'bg-[#2A4333] text-white hover:bg-[#2A4333]/80'
                      : 'bg-gray-200 text-gray-900 hover:bg-gray-300'
                  }`}
                  title={isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
                >
                  {isDarkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
                </button>
                <button
                  onClick={() => setMuted(!muted)}
                  className={`px-2 py-1.5 rounded-lg flex items-center space-x-1.5 transition-colors text-xs ${
                    muted 
                      ? `${isDarkMode ? 'bg-[#2A4333] text-gray-400 hover:bg-[#2A4333]/80' : 'bg-gray-200 text-gray-600 hover:bg-gray-300'}` 
                      : 'bg-[#005FA3] text-white hover:bg-[#005FA3]/80'
                  }`}
                >
                  {muted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                  <span>{muted ? 'Unmute' : 'Mute All'}</span>
                </button>
                <div className={`px-2 py-1.5 ${isDarkMode ? 'bg-[#2A4333]' : 'bg-gray-200'} rounded-lg`}>
                  <div className="flex items-center space-x-1.5">
                    <div className="w-1.5 h-1.5 bg-[#AFC150] rounded-full animate-pulse"></div>
                    <span className="text-xs">Live</span>
                  </div>
                </div>
                {/* Download & Export Buttons */}
                <button
                  onClick={handleDownloadAnalytics}
                  className={`px-2 py-1.5 rounded-lg flex items-center space-x-1.5 transition-colors text-xs ${
                    isDarkMode
                      ? 'bg-[#2A4333] text-white hover:bg-[#2A4333]/80'
                      : 'bg-gray-200 text-gray-900 hover:bg-gray-300'
                  }`}
                  title="Download Analytics (JSON)"
                >
                  <Download className="w-4 h-4" />
                  <span className="hidden sm:inline">Download</span>
                </button>
                <button
                  onClick={handleExportPDF}
                  className={`px-2 py-1.5 rounded-lg flex items-center space-x-1.5 transition-colors text-xs ${
                    isDarkMode
                      ? 'bg-[#005FA3] text-white hover:bg-[#005FA3]/80'
                      : 'bg-[#005FA3] text-white hover:bg-[#005FA3]/80'
                  }`}
                  title="Export Report as PDF"
                >
                  <FileText className="w-4 h-4" />
                  <span className="hidden sm:inline">Export PDF</span>
                </button>
                {/* Manual Book Downloads */}
                <button
                  onClick={handleDownloadTatsunoManual}
                  className={`px-2 py-1.5 rounded-lg flex items-center space-x-1.5 transition-colors text-xs ${
                    isDarkMode
                      ? 'bg-[#2A4333] text-white hover:bg-[#2A4333]/80'
                      : 'bg-gray-200 text-gray-900 hover:bg-gray-300'
                  }`}
                  title="Download Tatsuno Manual Book"
                >
                  <FileText className="w-4 h-4" />
                  <span className="hidden sm:inline">Tatsuno Manual</span>
                </button>
                <button
                  onClick={handleDownloadGilbarcoManual}
                  className={`px-2 py-1.5 rounded-lg flex items-center space-x-1.5 transition-colors text-xs ${
                    isDarkMode
                      ? 'bg-[#2A4333] text-white hover:bg-[#2A4333]/80'
                      : 'bg-gray-200 text-gray-900 hover:bg-gray-300'
                  }`}
                  title="Download Gilbarco Manual Book"
                >
                  <FileText className="w-4 h-4" />
                  <span className="hidden sm:inline">Gilbarco Manual</span>
                </button>
              </div>
            </div>

            {/* Info Bar */}
            <div className={`flex items-center justify-between ${themeClasses.card} rounded-lg border ${themeClasses.border} p-4 shadow-sm`}>
              {/* Left: Station ID */}
              <div className="flex items-center space-x-2">
                <MapPin className="w-5 h-5 text-[#005FA3]" />
                <span className={`${themeClasses.text} font-medium`}>Station ID:</span>
                <span className={themeClasses.textSecondary}>SPBU 31.12.902 (Kemang)</span>
              </div>

              {/* Center: Date & Time + Weather */}
              <div className="flex items-center space-x-6">
                <div className="flex items-center space-x-3">
                  <Calendar className="w-5 h-5 text-gray-400" />
                  <div className={themeClasses.text}>
                    <div className="text-sm font-medium">
                      {currentDateTime.toLocaleDateString('id-ID', { 
                        weekday: 'long', 
                        year: 'numeric', 
                        month: 'long', 
                        day: 'numeric' 
                      })}
                    </div>
                    <div className={`text-xs ${themeClasses.textSecondary}`}>
                      {currentDateTime.toLocaleTimeString('id-ID', { 
                        hour: '2-digit', 
                        minute: '2-digit', 
                        second: '2-digit' 
                      })}
                    </div>
                  </div>
                </div>
                <div className={`flex items-center space-x-2 ${isDarkMode ? 'bg-[#2A4333]' : 'bg-gray-200'} rounded-lg px-3 py-2`}>
                  <span className="text-2xl">{weather.icon}</span>
                  <div>
                    <div className={`${themeClasses.text} text-sm font-medium`}>{weather.temp}°C</div>
                    <div className={`${themeClasses.textSecondary} text-xs`}>{weather.condition}</div>
                  </div>
                </div>
              </div>

              {/* Right: Dropdown + User */}
              <div className="flex items-center space-x-4">
                {/* View Dropdown */}
                <div className="relative" ref={dropdownRef}>
                  <button
                    onClick={() => setDropdownOpen(!dropdownOpen)}
                    className={`flex items-center space-x-2 px-4 py-2 ${isDarkMode ? 'bg-[#2A4333]' : 'bg-gray-200'} rounded-lg ${isDarkMode ? 'hover:bg-[#2A4333]/80' : 'hover:bg-gray-300'} transition-colors`}
                  >
                    <span className={`${themeClasses.text} text-sm font-medium`}>{selectedView}</span>
                    <ChevronDown className={`w-4 h-4 ${themeClasses.textSecondary} transition-transform ${dropdownOpen ? 'rotate-180' : ''}`} />
                  </button>
                  {dropdownOpen && (
                    <div className={`absolute top-full left-0 mt-2 w-40 ${isDarkMode ? 'bg-[#2A4333]' : 'bg-white'} rounded-lg border ${themeClasses.border} shadow-lg z-10`}>
                      {['Overview', 'Alerts', 'Maintenance', 'Reports'].map((view) => (
                        <button
                          key={view}
                          onClick={() => {
                            setSelectedView(view);
                            setDropdownOpen(false);
                          }}
                          className={`w-full text-left px-4 py-2 text-sm transition-colors ${
                            selectedView === view
                              ? 'bg-[#005FA3] text-white'
                              : `${themeClasses.textSecondary} ${isDarkMode ? 'hover:bg-[#2A4333]/80' : 'hover:bg-gray-100'}`
                          }`}
                        >
                          {view}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* User Info */}
                <div className={`flex items-center space-x-2 px-4 py-2 ${isDarkMode ? 'bg-gray-800' : 'bg-gray-200'} rounded-lg`}>
                  <User className={`w-5 h-5 ${themeClasses.textSecondary}`} />
                  <div>
                    <div className={`${themeClasses.text} text-sm font-medium`}>Manager SPBU Kemang</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="space-y-6">
            {/* Main Grid Layout */}
            <div className="grid grid-cols-12 gap-6">
              {/* Left Panel - Live System Status Summary */}
              <div className={`col-span-3 ${themeClasses.card} rounded-lg border ${themeClasses.border} p-4 shadow-sm`}>
                <h2 className={`text-lg font-semibold ${themeClasses.text} mb-4 flex items-center`}>
                  <Activity className="w-5 h-5 mr-2 text-[#005FA3]" />
                  System Status
                </h2>
                <div className="space-y-3">
                  {systemStatus.map((system) => {
                    const Icon = system.icon;
                    return (
                      <div
                        key={system.id}
                        onClick={() => setSelectedFeature(system.id)}
                        className={`p-3 rounded-lg border cursor-pointer transition-all ${
                          selectedFeature === system.id
                            ? 'border-[#005FA3] bg-[#005FA3]/10'
                            : `${themeClasses.border} ${isDarkMode ? 'bg-[#2A4333]/50 hover:border-[#2A4333]' : 'bg-gray-50 hover:border-gray-300'}`
                        }`}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center space-x-2">
                            <div className={`w-3 h-3 rounded-full ${system.statusColor}`}></div>
                            <Icon className={`w-4 h-4 ${themeClasses.textSecondary}`} />
                            <span className={`text-sm font-medium ${themeClasses.text}`}>{system.name}</span>
                          </div>
                        </div>
                        <div className="flex items-center justify-between mt-2">
                          <div>
                            <div className={`text-xs ${themeClasses.textSecondary}`}>{system.status}</div>
                            <div className={`text-xs ${isDarkMode ? 'text-gray-500' : 'text-gray-400'} mt-1`}>Last: {system.lastAlert}</div>
                          </div>
                          <div className="text-right">
                            <div className={`text-lg font-bold ${themeClasses.text}`}>{system.health}%</div>
                            <div className={`text-xs ${themeClasses.textSecondary}`}>Health</div>
                          </div>
                        </div>
                        <div className={`mt-2 w-full ${isDarkMode ? 'bg-[#2A4333]' : 'bg-gray-200'} rounded-full h-1.5`}>
                          <div
                            className={`h-1.5 rounded-full ${
                              system.color === 'green' ? 'bg-green-500' :
                              system.color === 'yellow' ? 'bg-yellow-500' :
                              'bg-red-500'
                            }`}
                            style={{ width: `${system.health}%` }}
                          ></div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Center Panel - Live CCTV & AI Overlay */}
              <div className={`col-span-6 ${themeClasses.card} rounded-lg border ${themeClasses.border} p-4 shadow-sm`}>
                <div className="flex items-center justify-between mb-4">
                  <h2 className={`text-lg font-semibold ${themeClasses.text} flex items-center`}>
                    <Camera className="w-5 h-5 mr-2 text-[#005FA3]" />
                    Live CCTV Feed
                  </h2>
                  <div className="flex items-center space-x-2">
                    {!isCameraActive && (
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => startCamera('phone')}
                          className="px-3 py-1 bg-[#005FA3] text-white rounded-lg text-sm hover:bg-[#005FA3]/80 flex items-center space-x-2"
                          title="Gunakan Kamera HP"
                        >
                          <Camera className="w-4 h-4" />
                          <span>Kamera HP</span>
                        </button>
                        <button
                          onClick={() => startCamera('ipwebcam')}
                          className="px-3 py-1 bg-[#2A4333] text-white rounded-lg text-sm hover:bg-[#2A4333]/80 flex items-center space-x-2"
                          title="Gunakan IP Webcam"
                        >
                          <Camera className="w-4 h-4" />
                          <span>IP Webcam</span>
                        </button>
                      </div>
                    )}
                    {isCameraActive && (
                      <button className="px-3 py-1 bg-[#005FA3] text-white rounded-lg text-sm hover:bg-[#005FA3]/80 flex items-center space-x-2">
                        <Play className="w-4 h-4" />
                        <span>Play Voice Alert</span>
                      </button>
                    )}
                  </div>
                </div>
                
                {/* CCTV View */}
                <div className="relative bg-black rounded-lg overflow-hidden mb-4" style={{ height: '400px', minHeight: '400px' }}>
                  {/* Camera Feed */}
                  {isCameraActive ? (
                    <>
                      {/* Phone Camera (Video Element) */}
                      {cameraMode === 'phone' && (
                        <video
                          ref={videoRef}
                          autoPlay
                          playsInline
                          muted
                          className="w-full h-full object-cover"
                          style={{ 
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            width: '100%',
                            height: '100%',
                            minWidth: '100%',
                            minHeight: '100%',
                            zIndex: 1,
                            backgroundColor: '#000',
                            display: 'block'
                          }}
                          onLoadedMetadata={() => {
                            console.log('Phone camera video metadata loaded in element');
                            if (videoRef.current) {
                              videoRef.current.play().catch(err => {
                                console.error('Error playing video:', err);
                              });
                            }
                          }}
                          onCanPlay={() => {
                            console.log('Phone camera video can play');
                            if (videoRef.current) {
                              videoRef.current.play().catch(err => {
                                console.error('Error playing video on canPlay:', err);
                              });
                            }
                          }}
                          onPlaying={() => {
                            console.log('Phone camera video is playing');
                          }}
                          onError={(e) => {
                            console.error('Phone camera video error:', e);
                          }}
                        />
                      )}
                      
                      {/* IP Webcam (Image Element) */}
                      {cameraMode === 'ipwebcam' && (
                        <img
                          ref={imgRef}
                          alt="IP Webcam Stream"
                          className="w-full h-full object-cover"
                          style={{ 
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            width: '100%',
                            height: '100%',
                            minWidth: '100%',
                            minHeight: '100%',
                            zIndex: 1,
                            backgroundColor: '#000',
                            display: 'block'
                          }}
                          onError={(e) => {
                            console.error('IP Webcam image error:', e);
                            // Try snapshot fallback
                            if (imgRef.current) {
                              imgRef.current.src = IP_WEBCAM_SNAPSHOT + '?t=' + Date.now();
                              // Start snapshot refresh
                              if (!snapshotIntervalRef.current) {
                                snapshotIntervalRef.current = setInterval(() => {
                                  if (imgRef.current && isCameraActive) {
                                    imgRef.current.src = IP_WEBCAM_SNAPSHOT + '?t=' + Date.now();
                                  }
                                }, 100);
                              }
                            }
                          }}
                          onLoad={() => {
                            console.log('IP Webcam image loaded');
                          }}
                        />
                      )}
                      
                      {/* Hidden canvas for frame capture */}
                      <canvas ref={canvasRef} className="hidden" />
                      
                      {/* Scanning Animation Overlay */}
                      {isDetecting && (
                        <div className="absolute inset-0 z-20 pointer-events-none">
                          {/* Scanning Line Animation */}
                          <div 
                            className="absolute left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[#005FA3] to-transparent shadow-[0_0_20px_rgba(0,95,163,0.8)]"
                            style={{
                              animation: 'scanLine 2s linear infinite',
                              top: 0
                            }}
                          />
                          
                          {/* Scanning Border Animation */}
                          <div 
                            className="absolute inset-0 border-2 border-[#005FA3]"
                            style={{
                              boxShadow: '0 0 20px rgba(0, 95, 163, 0.6), inset 0 0 20px rgba(0, 95, 163, 0.3)',
                              animation: 'scanBorder 1.5s ease-in-out infinite'
                            }}
                          />
                          
                          {/* Corner Brackets */}
                          <div className="absolute top-4 left-4 w-8 h-8 border-t-2 border-l-2 border-[#005FA3] animate-pulse" />
                          <div className="absolute top-4 right-4 w-8 h-8 border-t-2 border-r-2 border-[#005FA3] animate-pulse" />
                          <div className="absolute bottom-4 left-4 w-8 h-8 border-b-2 border-l-2 border-[#005FA3] animate-pulse" />
                          <div className="absolute bottom-4 right-4 w-8 h-8 border-b-2 border-r-2 border-[#005FA3] animate-pulse" />
                          
                          {/* Scanning Text Overlay */}
                          <div className="absolute inset-0 flex items-center justify-center">
                            <div className="bg-[#005FA3]/90 backdrop-blur-sm px-6 py-3 rounded-lg shadow-xl">
                              <div className="flex items-center space-x-3">
                                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                <span className="text-white font-semibold text-sm">Scanning Brand...</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                    </>
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-900 to-gray-800">
                      <div className="text-center">
                        <Camera className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                        <p className="text-gray-500">Live CCTV Feed</p>
                        <p className="text-sm text-gray-600 mt-2">AI Overlay Active</p>
                        <div className="mt-4 flex items-center justify-center space-x-2">
                          <button
                            onClick={() => startCamera('phone')}
                            className="px-4 py-2 bg-[#005FA3] text-white rounded-lg hover:bg-[#005FA3]/80 transition-colors flex items-center space-x-2"
                            title="Gunakan Kamera HP untuk deteksi merk"
                          >
                            <Camera className="w-4 h-4" />
                            <span>Kamera HP</span>
                          </button>
                          <button
                            onClick={() => startCamera('ipwebcam')}
                            className="px-4 py-2 bg-[#2A4333] text-white rounded-lg hover:bg-[#2A4333]/80 transition-colors flex items-center space-x-2"
                            title="Gunakan IP Webcam"
                          >
                            <Camera className="w-4 h-4" />
                            <span>IP Webcam</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* AI Overlay - Brand Detection Result */}
                  {detectedBrand && (
                    <div className="absolute top-4 left-4 bg-[#005FA3]/90 text-white px-4 py-2 rounded-lg text-sm font-medium shadow-lg z-10">
                      <div className="flex items-center space-x-2">
                        <span>🏷️</span>
                        <div>
                          <div className="font-bold">Brand: {detectedBrand}</div>
                          <div className="text-xs opacity-90">Confidence: {detectionConfidence}%</div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Detection Status */}
                  {isDetecting && (
                    <div className="absolute top-4 right-4 bg-[#2A4333]/90 text-white px-3 py-2 rounded-lg text-xs font-medium z-10">
                      🔍 Detecting...
                    </div>
                  )}
                  
                  {/* API Connection Error Warning */}
                  {apiConnectionError && !isDetecting && isCameraActive && (
                    <div className="absolute top-16 right-4 bg-yellow-500/90 text-white px-3 py-2 rounded-lg text-xs font-medium z-10 max-w-xs shadow-lg">
                      <div className="flex items-start space-x-2">
                        <span>⚠️</span>
                        <div>
                          <div className="font-bold mb-1">API Server Tidak Terhubung</div>
                          <div className="text-xs opacity-90">
                            Jalankan API server dari folder engine-insight-quick:
                          </div>
                          <div className="text-xs opacity-75 mt-1 font-mono">
                            npm run api:server
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Stop Camera Button */}
                  {isCameraActive && (
                    <button
                      onClick={stopCamera}
                      className="absolute bottom-4 right-4 bg-red-500/90 text-white px-3 py-2 rounded-lg text-sm font-medium hover:bg-red-600 transition-colors z-10"
                    >
                      Stop Camera
                    </button>
                  )}

                  {/* AI Overlay Markers (Sample) */}
                  {!isCameraActive && (
                    <>
                      <div className="absolute top-4 left-4 bg-red-500/80 text-white px-3 py-2 rounded-lg text-sm font-medium">
                        🔴 Spill Detected - Pump 2
                      </div>
                      <div className="absolute top-20 left-4 bg-yellow-500/80 text-white px-3 py-2 rounded-lg text-sm font-medium">
                        ⚠️ Touchscreen Delay - Dispenser 3
                      </div>
                      <div className="absolute bottom-4 right-4 bg-green-500/80 text-white px-3 py-2 rounded-lg text-sm font-medium">
                        🌡️ Temp: 38°C / 40°C - Dispenser 1
                      </div>
                    </>
                  )}
                </div>

                {/* Metadata */}
                <div className="grid grid-cols-3 gap-4">
                  <div className={`${isDarkMode ? 'bg-[#2A4333]/50' : 'bg-gray-100'} rounded-lg p-3`}>
                    <div className={`text-xs ${themeClasses.textSecondary} mb-1`}>Detected Brand</div>
                    <div className={`text-sm font-medium ${themeClasses.text}`}>
                      {detectedBrand || 'Not Detected'}
                    </div>
                  </div>
                  <div className={`${isDarkMode ? 'bg-[#2A4333]/50' : 'bg-gray-100'} rounded-lg p-3`}>
                    <div className={`text-xs ${themeClasses.textSecondary} mb-1`}>Confidence</div>
                    <div className={`text-sm font-medium ${
                      detectionConfidence >= 80 ? 'text-green-500' :
                      detectionConfidence >= 50 ? 'text-yellow-500' :
                      'text-gray-500'
                    }`}>
                      {detectionConfidence > 0 ? `${detectionConfidence}%` : 'N/A'}
                    </div>
                  </div>
                  <div className={`${isDarkMode ? 'bg-[#2A4333]/50' : 'bg-gray-100'} rounded-lg p-3`}>
                    <div className={`text-xs ${themeClasses.textSecondary} mb-1`}>Status</div>
                    <div className={`text-sm font-medium ${
                      isCameraActive 
                        ? (isDetecting ? 'text-yellow-500' : detectedBrand ? 'text-green-500' : 'text-blue-500')
                        : 'text-gray-500'
                    }`}>
                      {isCameraActive 
                        ? (isDetecting ? 'Detecting...' : detectedBrand ? 'Detected' : 'Active')
                        : 'Inactive'
                      }
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Panel - Active Alerts & Actions */}
              <div className={`col-span-3 ${themeClasses.card} rounded-lg border ${themeClasses.border} p-4 shadow-sm`}>
                <h2 className={`text-lg font-semibold ${themeClasses.text} mb-4 flex items-center`}>
                  <AlertTriangle className="w-5 h-5 mr-2 text-[#005FA3]" />
                  Active Alerts
                </h2>
                <div className="space-y-3 max-h-[500px] overflow-y-auto">
                  {activeAlerts.map((alert) => (
                    <div
                      key={alert.id}
                      className={`p-3 rounded-lg border ${getSeverityColor(alert.severity)}`}
                    >
                      <div className="flex items-start space-x-2 mb-2">
                        {getSeverityIcon(alert.severity)}
                        <div className="flex-1">
                          <div className={`text-sm font-medium mb-1 ${
                            alert.severity === 'critical' 
                              ? isDarkMode ? 'text-red-300' : 'text-red-700'
                              : alert.severity === 'warning'
                              ? isDarkMode ? 'text-yellow-300' : 'text-yellow-700'
                              : isDarkMode ? 'text-green-300' : 'text-green-700'
                          }`}>{alert.event}</div>
                          <div className={`text-xs ${
                            alert.severity === 'critical' 
                              ? isDarkMode ? 'text-red-400/80' : 'text-red-600/80'
                              : alert.severity === 'warning'
                              ? isDarkMode ? 'text-yellow-400/80' : 'text-yellow-600/80'
                              : isDarkMode ? 'text-green-400/80' : 'text-green-600/80'
                          }`}>{alert.source} • {alert.location}</div>
                          <div className={`text-xs ${
                            alert.severity === 'critical' 
                              ? isDarkMode ? 'text-red-400/70' : 'text-red-600/70'
                              : alert.severity === 'warning'
                              ? isDarkMode ? 'text-yellow-400/70' : 'text-yellow-600/70'
                              : isDarkMode ? 'text-green-400/70' : 'text-green-600/70'
                          } mt-1`}>{alert.time}</div>
                        </div>
                      </div>
                      <div className="flex space-x-2 mt-3">
                        {alert.severity === 'critical' && (
                          <>
                            <button
                              onClick={() => handleAcknowledge(alert.id)}
                              className={`flex-1 px-2 py-1 ${isDarkMode ? 'bg-[#2A4333] text-white hover:bg-[#2A4333]/80' : 'bg-gray-300 text-gray-900 hover:bg-gray-400'} rounded text-xs`}
                            >
                              Acknowledge
                            </button>
                            <button
                              onClick={() => handleDispatch(alert.id)}
                              className="flex-1 px-2 py-1 bg-[#005FA3] text-white rounded text-xs hover:bg-[#005FA3]/80"
                            >
                              Dispatch
                            </button>
                          </>
                        )}
                        {alert.severity === 'warning' && (
                          <button
                            onClick={() => handleAssignTech(alert.id)}
                            className="w-full px-2 py-1 bg-yellow-500 text-white rounded text-xs hover:bg-yellow-600"
                          >
                            Assign Tech
                          </button>
                        )}
                        {alert.severity === 'info' && (
                          <button
                            onClick={() => console.log('View log:', alert.id)}
                            className="w-full px-2 py-1 bg-green-500 text-white rounded text-xs hover:bg-green-600"
                          >
                            View Log
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Privacy & Security Panel */}
            {/* <PrivacySecurityPanel /> */}

            {/* Bottom Panel - Predictive Health Graphs */}
            <div className="grid grid-cols-2 gap-6">
              {/* Component Temperature Trend */}
              <div className={`${themeClasses.card} rounded-lg border ${themeClasses.border} p-4 shadow-sm`}>
                <h3 className={`text-lg font-semibold ${themeClasses.text} mb-4 flex items-center`}>
                  <Thermometer className="w-5 h-5 mr-2 text-[#005FA3]" />
                  Component Temperature Trend
                </h3>
                <div className="h-48 flex items-end justify-between space-x-2">
                  {temperatureData.map((data, index) => (
                    <div key={index} className="flex-1 flex flex-col items-center space-y-1">
                      <div className="w-full flex flex-col justify-end space-y-1" style={{ height: '120px' }}>
                        <div
                          className="w-full bg-[#005FA3]/30 rounded-t"
                          style={{ height: `${(data.dispenser1 / 40) * 100}%` }}
                          title={`Dispenser 1: ${data.dispenser1}°C`}
                        ></div>
                        <div
                          className="w-full bg-[#AFC150]/30 rounded-t"
                          style={{ height: `${(data.dispenser2 / 40) * 100}%` }}
                          title={`Dispenser 2: ${data.dispenser2}°C`}
                        ></div>
                        <div
                          className="w-full bg-[#2A4333]/30 rounded-t"
                          style={{ height: `${(data.dispenser3 / 40) * 100}%` }}
                          title={`Dispenser 3: ${data.dispenser3}°C`}
                        ></div>
                      </div>
                      <div className={`text-xs ${themeClasses.textSecondary}`}>{data.time}</div>
                    </div>
                  ))}
                </div>
                <div className={`mt-4 flex items-center justify-center space-x-4 text-xs ${themeClasses.textSecondary}`}>
                  <div className="flex items-center space-x-1">
                    <div className="w-3 h-3 bg-[#005FA3]/30 rounded"></div>
                    <span>Dispenser 1</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <div className="w-3 h-3 bg-[#AFC150]/30 rounded"></div>
                    <span>Dispenser 2</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <div className="w-3 h-3 bg-[#2A4333]/30 rounded"></div>
                    <span>Dispenser 3</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <div className="w-3 h-3 border border-[#005FA3] border-dashed"></div>
                    <span>Safe Max (40°C)</span>
                  </div>
                </div>
              </div>

              {/* Response Time Trend */}
              <div className={`${themeClasses.card} rounded-lg border ${themeClasses.border} p-4 shadow-sm`}>
                <h3 className={`text-lg font-semibold ${themeClasses.text} mb-4 flex items-center`}>
                  <Monitor className="w-5 h-5 mr-2 text-[#005FA3]" />
                  Response Time Trend
                </h3>
                <div className="h-48 flex items-end justify-between space-x-2">
                  {responseTimeData.map((data, index) => (
                    <div key={index} className="flex-1 flex flex-col items-center">
                      <div
                        className="w-full bg-[#005FA3]/50 rounded-t"
                        style={{ height: `${(data.avg / 400) * 100}%` }}
                        title={`Avg: ${data.avg}ms`}
                      ></div>
                      <div className={`text-xs ${themeClasses.textSecondary} mt-1`}>{data.time}</div>
                    </div>
                  ))}
                </div>
                <div className={`mt-4 text-center text-xs ${themeClasses.textSecondary}`}>
                  Average Response Time (ms) per hour
                </div>
              </div>

              {/* Drip Frequency */}
              <div className={`${themeClasses.card} rounded-lg border ${themeClasses.border} p-4 shadow-sm`}>
                <h3 className={`text-lg font-semibold ${themeClasses.text} mb-4 flex items-center`}>
                  <Droplet className="w-5 h-5 mr-2 text-[#005FA3]" />
                  Drip Frequency
                </h3>
                <div className="h-48 flex items-end justify-between space-x-2">
                  {dripFrequencyData.map((data, index) => (
                    <div key={index} className="flex-1 flex flex-col items-center">
                      <div
                        className="w-full bg-[#AFC150]/50 rounded-t"
                        style={{ height: `${(data.count / 5) * 100}%` }}
                        title={`${data.count} drips`}
                      ></div>
                      <div className={`text-xs ${themeClasses.textSecondary} mt-1`}>{data.day}</div>
                    </div>
                  ))}
                </div>
                <div className={`mt-4 text-center text-xs ${themeClasses.textSecondary}`}>
                  Daily drips count + predicted failure date
                </div>
              </div>

              {/* Safety Events */}
              <div className={`${themeClasses.card} rounded-lg border ${themeClasses.border} p-4 shadow-sm`}>
                <h3 className={`text-lg font-semibold ${themeClasses.text} mb-4 flex items-center`}>
                  <Shield className="w-5 h-5 mr-2 text-[#005FA3]" />
                  Safety Events (This Week)
                </h3>
                <div className="h-48 flex items-center justify-center">
                  <div className="relative w-40 h-40">
                    <svg className="w-40 h-40 transform -rotate-90">
                      <circle
                        cx="80"
                        cy="80"
                        r="60"
                        stroke="#1f1f1f"
                        strokeWidth="20"
                        fill="none"
                      />
                      <circle
                        cx="80"
                        cy="80"
                        r="60"
                        stroke="#005FA3"
                        strokeWidth="20"
                        fill="none"
                        strokeDasharray={`${(safetyEventsData.spills / 100) * 377} 377`}
                        strokeDashoffset="0"
                      />
                      <circle
                        cx="80"
                        cy="80"
                        r="60"
                        stroke="#AFC150"
                        strokeWidth="20"
                        fill="none"
                        strokeDasharray={`${(safetyEventsData.queueAlerts / 100) * 377} 377`}
                        strokeDashoffset={`-${(safetyEventsData.spills / 100) * 377}`}
                      />
                      <circle
                        cx="80"
                        cy="80"
                        r="60"
                        stroke="#2A4333"
                        strokeWidth="20"
                        fill="none"
                        strokeDasharray={`${(safetyEventsData.hazards / 100) * 377} 377`}
                        strokeDashoffset={`-${((safetyEventsData.spills + safetyEventsData.queueAlerts) / 100) * 377}`}
                      />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="text-center">
                        <div className={`text-2xl font-bold ${themeClasses.text}`}>{safetyEventsData.spills + safetyEventsData.queueAlerts + safetyEventsData.hazards}</div>
                        <div className={`text-xs ${themeClasses.textSecondary}`}>Total Events</div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="mt-4 space-y-2 text-xs">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 bg-[#005FA3] rounded"></div>
                      <span className={themeClasses.textSecondary}>Spills</span>
                    </div>
                    <span className={themeClasses.text}>{safetyEventsData.spills}%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 bg-[#AFC150] rounded"></div>
                      <span className={themeClasses.textSecondary}>Queue Alerts</span>
                    </div>
                    <span className={themeClasses.text}>{safetyEventsData.queueAlerts}%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 bg-[#2A4333] rounded"></div>
                      <span className={themeClasses.textSecondary}>Hazards</span>
                    </div>
                    <span className={themeClasses.text}>{safetyEventsData.hazards}%</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className={`${themeClasses.card} rounded-lg border ${themeClasses.border} p-4 shadow-sm`}>
              <div className="flex items-center justify-between">
                <div className={`flex items-center space-x-6 text-sm ${themeClasses.textSecondary}`}>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-[#AFC150] rounded-full animate-pulse"></div>
                    <span>Data latency: &lt;1.2s (Edge synched)</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <TrendingUp className="w-4 h-4" />
                    <span>AI inference confidence: 92%</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span>API connection status: OK</span>
                  </div>
                </div>
                <div className={`text-sm ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                  Copyright © 2025 STORI AI
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Floating Notifications */}
      <div className="fixed bottom-6 right-6 space-y-3 z-50">
        {notifications.map((notification) => {
          const notificationStyle = getNotificationStyle(notification.type || 'info');
          return (
            <div
              key={notification.id}
              className={`${themeClasses.card} border ${notificationStyle.border} rounded-lg p-4 shadow-xl max-w-sm animate-slide-in`}
            >
              <div className="flex items-start space-x-3">
                {notificationStyle.icon}
                <div className="flex-1">
                  <p className={`text-sm ${themeClasses.text}`}>{notification.message}</p>
                  <p className={`text-xs ${themeClasses.textSecondary} mt-1`}>{notification.time}</p>
                </div>
                <button
                  onClick={() => setNotifications(prev => prev.filter(n => n.id !== notification.id))}
                  className={`${themeClasses.textSecondary} ${isDarkMode ? 'hover:text-white' : 'hover:text-gray-900'}`}
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default CommandCenterDashboard;

