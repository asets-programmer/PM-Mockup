import React, { useState, useEffect, useRef } from 'react';
import { Camera, Play, X } from 'lucide-react';

const CameraSection = () => {
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
  const BRAND_DETECTION_API_PORTS = [3000, 8080];
  const getBrandDetectionAPI = () => {
    const port = BRAND_DETECTION_API_PORTS[0];
    return `http://localhost:${port}/detect-brand-realtime`;
  };
  const BRAND_DETECTION_API = getBrandDetectionAPI();
  
  // IP Webcam Configuration
  const IP_WEBCAM_URL = 'http://192.168.1.38:8080';
  const IP_WEBCAM_STREAM = `${IP_WEBCAM_URL}/video`;
  const IP_WEBCAM_SNAPSHOT = `${IP_WEBCAM_URL}/shot.jpg`;

  // Start camera stream
  const startCamera = async (mode = 'phone') => {
    try {
      setCameraMode(mode);
      setIsCameraActive(true);
      
      if (mode === 'phone') {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { 
            facingMode: 'environment',
            width: { ideal: 1280 },
            height: { ideal: 720 }
          }
        });
        
        setCameraStream(stream);
        
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.onloadedmetadata = () => {
            if (videoRef.current) {
              videoRef.current.play().catch(err => {
                console.error('Error playing video:', err);
              });
            }
          };
          videoRef.current.play().catch(err => {
            console.error('Error playing video:', err);
          });
        }
        
        setTimeout(() => {
          startBrandDetection();
        }, 1000);
      } else {
        if (imgRef.current) {
          imgRef.current.src = IP_WEBCAM_STREAM;
          imgRef.current.onerror = () => {
            console.log('MJPEG stream failed, using snapshot refresh');
            imgRef.current.src = IP_WEBCAM_SNAPSHOT + '?t=' + Date.now();
            
            snapshotIntervalRef.current = setInterval(() => {
              if (imgRef.current && isCameraActive) {
                imgRef.current.src = IP_WEBCAM_SNAPSHOT + '?t=' + Date.now();
              }
            }, 100);
          };
        }
        
        setTimeout(() => {
          startBrandDetection();
        }, 2000);
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

  // Effect to ensure video stream is attached
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
  
  useEffect(() => {
    if (isCameraActive && cameraMode === 'ipwebcam' && imgRef.current && !imgRef.current.src) {
      imgRef.current.src = IP_WEBCAM_STREAM;
    }
  }, [isCameraActive, cameraMode]);

  // Stop camera stream
  const stopCamera = () => {
    setIsCameraActive(false);
    
    if (cameraStream) {
      cameraStream.getTracks().forEach(track => track.stop());
      setCameraStream(null);
    }
    
    if (imgRef.current) {
      imgRef.current.src = '';
    }
    
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    
    if (snapshotIntervalRef.current) {
      clearInterval(snapshotIntervalRef.current);
      snapshotIntervalRef.current = null;
    }
    
    if (detectionIntervalRef.current) {
      clearInterval(detectionIntervalRef.current);
      detectionIntervalRef.current = null;
    }
    
    setDetectedBrand(null);
    setDetectionConfidence(0);
  };

  // Capture frame and detect
  const captureAndDetect = async () => {
    if ((!imgRef.current && !videoRef.current) || !canvasRef.current || isDetecting) return;
    
    try {
      setIsDetecting(true);
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      
      const sourceElement = imgRef.current || videoRef.current;
      if (!sourceElement) return;
      
      const width = sourceElement.naturalWidth || sourceElement.videoWidth || 640;
      const height = sourceElement.naturalHeight || sourceElement.videoHeight || 480;
      
      canvas.width = width;
      canvas.height = height;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      let imageBase64;
      
      if (sourceElement === videoRef.current && videoRef.current) {
        ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
        try {
          imageBase64 = canvas.toDataURL('image/jpeg', 0.8);
        } catch (error) {
          console.error('Failed to export video canvas:', error);
          throw error;
        }
      } else if (sourceElement === imgRef.current && imgRef.current) {
        try {
          const snapshotUrl = IP_WEBCAM_SNAPSHOT + '?t=' + Date.now();
          const response = await fetch(snapshotUrl, { cache: 'no-cache' });
          
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          
          const blob = await response.blob();
          const reader = new FileReader();
          imageBase64 = await new Promise((resolve, reject) => {
            reader.onload = () => resolve(reader.result);
            reader.onerror = () => reject(new Error('Failed to read IP webcam image'));
            reader.readAsDataURL(blob);
          });
        } catch (fetchError) {
          console.warn('Failed to fetch IP webcam snapshot:', fetchError);
          try {
            ctx.drawImage(imgRef.current, 0, 0, canvas.width, canvas.height);
            imageBase64 = canvas.toDataURL('image/jpeg', 0.8);
          } catch (canvasError) {
            console.error('Canvas draw failed:', canvasError);
            throw new Error('IP webcam CORS restriction');
          }
        }
      }
      
      // Try multiple ports
      let lastError = null;
      for (const port of BRAND_DETECTION_API_PORTS) {
        let timeoutId = null;
        try {
          const apiUrl = `http://localhost:${port}/detect-brand-realtime`;
          const controller = new AbortController();
          timeoutId = setTimeout(() => controller.abort(), 5000);
          
          const response = await fetch(apiUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ image_base64: imageBase64 }),
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
            setApiConnectionError(false);
            return;
          } else {
            setDetectedBrand(null);
            setDetectionConfidence(0);
            setApiConnectionError(false);
            return;
          }
        } catch (error) {
          if (timeoutId) {
            clearTimeout(timeoutId);
          }
          lastError = error;
        }
      }
      
      if (lastError) {
        console.error('All API ports failed:', lastError);
        setApiConnectionError(true);
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
    detectionIntervalRef.current = setInterval(() => {
      captureAndDetect();
    }, 3000);
    
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

  return (
    <>
      <style>{`
        @keyframes scanLine {
          0% { top: 0%; opacity: 1; }
          50% { opacity: 0.8; }
          100% { top: 100%; opacity: 1; }
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
      
      <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-900 flex items-center">
            <Camera className="w-5 h-5 mr-2 text-blue-600" />
            Live CCTV Feed
          </h2>
          <div className="flex items-center space-x-2">
            {!isCameraActive && (
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => startCamera('phone')}
                  className="px-3 py-1 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 flex items-center space-x-2"
                >
                  <Camera className="w-4 h-4" />
                  <span>Kamera HP</span>
                </button>
                <button
                  onClick={() => startCamera('ipwebcam')}
                  className="px-3 py-1 bg-gray-700 text-white rounded-lg text-sm hover:bg-gray-800 flex items-center space-x-2"
                >
                  <Camera className="w-4 h-4" />
                  <span>IP Webcam</span>
                </button>
              </div>
            )}
            {isCameraActive && (
              <button
                onClick={stopCamera}
                className="px-3 py-1 bg-red-500 text-white rounded-lg text-sm hover:bg-red-600 flex items-center space-x-2"
              >
                <X className="w-4 h-4" />
                <span>Stop Camera</span>
              </button>
            )}
          </div>
        </div>
        
        {/* CCTV View */}
        <div className="relative bg-black rounded-lg overflow-hidden mb-4" style={{ height: '400px', minHeight: '400px' }}>
          {isCameraActive ? (
            <>
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
                    zIndex: 1,
                    backgroundColor: '#000'
                  }}
                />
              )}
              
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
                    zIndex: 1,
                    backgroundColor: '#000'
                  }}
                />
              )}
              
              <canvas ref={canvasRef} className="hidden" />
              
              {/* Scanning Animation */}
              {isDetecting && (
                <div className="absolute inset-0 z-20 pointer-events-none">
                  <div 
                    className="absolute left-0 right-0 h-1 bg-gradient-to-r from-transparent via-blue-500 to-transparent shadow-[0_0_20px_rgba(59,130,246,0.8)]"
                    style={{ animation: 'scanLine 2s linear infinite', top: 0 }}
                  />
                  <div 
                    className="absolute inset-0 border-2 border-blue-500"
                    style={{
                      boxShadow: '0 0 20px rgba(59, 130, 246, 0.6), inset 0 0 20px rgba(59, 130, 246, 0.3)',
                      animation: 'scanBorder 1.5s ease-in-out infinite'
                    }}
                  />
                  <div className="absolute top-4 left-4 w-8 h-8 border-t-2 border-l-2 border-blue-500 animate-pulse" />
                  <div className="absolute top-4 right-4 w-8 h-8 border-t-2 border-r-2 border-blue-500 animate-pulse" />
                  <div className="absolute bottom-4 left-4 w-8 h-8 border-b-2 border-l-2 border-blue-500 animate-pulse" />
                  <div className="absolute bottom-4 right-4 w-8 h-8 border-b-2 border-r-2 border-blue-500 animate-pulse" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="bg-blue-600/90 backdrop-blur-sm px-6 py-3 rounded-lg shadow-xl">
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
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
                  >
                    <Camera className="w-4 h-4" />
                    <span>Kamera HP</span>
                  </button>
                  <button
                    onClick={() => startCamera('ipwebcam')}
                    className="px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-800 transition-colors flex items-center space-x-2"
                  >
                    <Camera className="w-4 h-4" />
                    <span>IP Webcam</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Brand Detection Result */}
          {detectedBrand && (
            <div className="absolute top-4 left-4 bg-blue-600/90 text-white px-4 py-2 rounded-lg text-sm font-medium shadow-lg z-10">
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
            <div className="absolute top-4 right-4 bg-gray-800/90 text-white px-3 py-2 rounded-lg text-xs font-medium z-10">
              🔍 Detecting...
            </div>
          )}
          
          {/* API Error */}
          {apiConnectionError && !isDetecting && isCameraActive && (
            <div className="absolute top-16 right-4 bg-yellow-500/90 text-white px-3 py-2 rounded-lg text-xs font-medium z-10 max-w-xs shadow-lg">
              <div className="flex items-start space-x-2">
                <span>⚠️</span>
                <div>
                  <div className="font-bold mb-1">API Server Tidak Terhubung</div>
                  <div className="text-xs opacity-90">Pastikan API server sudah dijalankan</div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Metadata */}
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-gray-50 rounded-lg p-3">
            <div className="text-xs text-gray-600 mb-1">Detected Brand</div>
            <div className="text-sm font-medium text-gray-900">
              {detectedBrand || 'Not Detected'}
            </div>
          </div>
          <div className="bg-gray-50 rounded-lg p-3">
            <div className="text-xs text-gray-600 mb-1">Confidence</div>
            <div className={`text-sm font-medium ${
              detectionConfidence >= 80 ? 'text-green-500' :
              detectionConfidence >= 50 ? 'text-yellow-500' :
              'text-gray-500'
            }`}>
              {detectionConfidence > 0 ? `${detectionConfidence}%` : 'N/A'}
            </div>
          </div>
          <div className="bg-gray-50 rounded-lg p-3">
            <div className="text-xs text-gray-600 mb-1">Status</div>
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
    </>
  );
};

export default CameraSection;

