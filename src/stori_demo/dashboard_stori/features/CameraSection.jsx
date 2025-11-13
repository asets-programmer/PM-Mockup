import React, { useState, useEffect, useRef } from 'react';
import { Camera, Play, X } from 'lucide-react';

const CameraSection = ({ enableTeachableMachine = false }) => {
  // Camera & Brand Detection States
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [cameraMode, setCameraMode] = useState('phone'); // 'phone' or 'ipwebcam'
  const [cameraStream, setCameraStream] = useState(null);
  const [isStreaming, setIsStreaming] = useState(false);
  const [detectedBrand, setDetectedBrand] = useState(null);
  const [detectionConfidence, setDetectionConfidence] = useState(0);
  const [isDetecting, setIsDetecting] = useState(false);
  const [apiConnectionError, setApiConnectionError] = useState(false);
  const videoRef = useRef(null);
  const imgRef = useRef(null);
  const canvasRef = useRef(null);
  const detectionIntervalRef = useRef(null);
  const snapshotIntervalRef = useRef(null);
  
  // Teachable Machine Model Configuration
  const MODEL_URL = '/my_model/';
  const modelRef = useRef(null);
  const webcamRef = useRef(null);
  const maxPredictionsRef = useRef(0);
  const labelContainerRef = useRef(null);
  const isLoopingRef = useRef(false);
  
  // IP Webcam Configuration
  const IP_WEBCAM_URL = 'http://192.168.51.34:8080';
  const IP_WEBCAM_STREAM = `${IP_WEBCAM_URL}/video`;
  const IP_WEBCAM_SNAPSHOT = `${IP_WEBCAM_URL}/shot.jpg`;

  // Wait for Teachable Machine CDN to load (only if enabled)
  const waitForTMImage = async (maxWait = 5000) => {
    if (!enableTeachableMachine) return null;
    
    const startTime = Date.now();
    while (!window.tmImage && (Date.now() - startTime) < maxWait) {
      await new Promise(resolve => setTimeout(resolve, 100));
    }
    if (!window.tmImage) {
      throw new Error('Teachable Machine library not loaded. Please check if CDN scripts are loaded.');
    }
    return window.tmImage;
  };

  // Load Teachable Machine model (only if enabled)
  const loadModel = async () => {
    if (!enableTeachableMachine) {
      return { success: false, tmImage: null };
    }
    
    try {
      // Wait for CDN to load
      const tmImage = await waitForTMImage();
      if (!tmImage) {
        return { success: false, tmImage: null };
      }
      
      const modelURL = MODEL_URL + "model.json";
      const metadataURL = MODEL_URL + "metadata.json";
      
      // Load the model and metadata
      const model = await tmImage.load(modelURL, metadataURL);
      modelRef.current = model;
      maxPredictionsRef.current = model.getTotalClasses();
      
      return { success: true, tmImage };
    } catch (error) {
      console.error('Error loading model:', error);
      setApiConnectionError(true);
      return { success: false, tmImage: null };
    }
  };

  // Initialize Teachable Machine webcam (only if enabled)
  const initTeachableMachine = async () => {
    if (!enableTeachableMachine) {
      // Fallback to regular getUserMedia if Teachable Machine is disabled
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
        setIsStreaming(true);
      }
      return true;
    }
    
    try {
      // Load model first (this will also import tmImage)
      const result = await loadModel();
      if (!result.success || !result.tmImage) {
        throw new Error('Failed to load model');
      }
      
      const tmImage = result.tmImage;

      // Setup webcam - use larger size to match display
      const flip = true; // whether to flip the webcam
      const webcam = new tmImage.Webcam(640, 480, flip); // width, height, flip
      await webcam.setup(); // request access to the webcam
      await webcam.play();
      
      webcamRef.current = webcam;
      
      // Append canvas to video element container
      if (videoRef.current && webcam.canvas) {
        const container = videoRef.current.parentNode;
        if (container) {
          // Remove any existing Teachable Machine canvas
          const existingCanvas = container.querySelector('canvas[data-teachable-machine]');
          if (existingCanvas) {
            container.removeChild(existingCanvas);
          }
          
          // Mark canvas for identification
          webcam.canvas.setAttribute('data-teachable-machine', 'true');
          
          // Append canvas to container
          container.appendChild(webcam.canvas);
          
          // Style the canvas to match video display
          webcam.canvas.style.cssText = `
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            object-fit: cover;
            z-index: 1;
          `;
          
          // Hide the video element since we're using the canvas
          if (videoRef.current) {
            videoRef.current.style.display = 'none';
          }
        }
      }
      
      // Start prediction loop
      isLoopingRef.current = true;
      loop();
      
      return true;
    } catch (error) {
      console.error('Error initializing Teachable Machine:', error);
      setApiConnectionError(true);
      return false;
    }
  };

  // Prediction loop (only if Teachable Machine is enabled)
  const loop = async () => {
    if (!enableTeachableMachine) return;
    if (webcamRef.current && modelRef.current && isLoopingRef.current) {
      webcamRef.current.update(); // update the webcam frame
      await predict();
      // Continue loop if camera is still active
      if (webcamRef.current && modelRef.current && isLoopingRef.current) {
        window.requestAnimationFrame(loop);
      }
    }
  };

  // Run prediction (only if Teachable Machine is enabled)
  const predict = async () => {
    if (!enableTeachableMachine) return;
    if (!modelRef.current || !webcamRef.current) return;
    
    try {
      setIsDetecting(true);
      // predict can take in an image, video or canvas html element
      const prediction = await modelRef.current.predict(webcamRef.current.canvas);
      
      // Find the highest confidence prediction
      let highestConfidence = 0;
      let bestPrediction = null;
      
      for (let i = 0; i < maxPredictionsRef.current; i++) {
        if (prediction[i].probability > highestConfidence) {
          highestConfidence = prediction[i].probability;
          bestPrediction = prediction[i];
        }
      }
      
      // Update detected brand and confidence
      if (bestPrediction && highestConfidence > 0.1) { // Only show if confidence > 10%
        setDetectedBrand(bestPrediction.className);
        setDetectionConfidence(Math.round(highestConfidence * 100));
        setApiConnectionError(false);
      } else {
        setDetectedBrand(null);
        setDetectionConfidence(0);
      }
    } catch (error) {
      console.error('Prediction error:', error);
      setDetectedBrand(null);
      setDetectionConfidence(0);
    } finally {
      setIsDetecting(false);
    }
  };

  // Start camera stream
  const startCamera = async (mode = 'phone') => {
    try {
      setCameraMode(mode);
      setIsCameraActive(true);
      
      if (mode === 'phone') {
        if (enableTeachableMachine) {
          // Use Teachable Machine for phone camera
          const success = await initTeachableMachine();
          if (!success) {
            setIsCameraActive(false);
            alert('Tidak dapat mengakses kamera HP. Pastikan izin kamera sudah diberikan dan model Teachable Machine tersedia.');
          }
        } else {
          // Use regular getUserMedia if Teachable Machine is disabled
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
            setIsStreaming(true);
            }
        }
      } else {
        // IP Webcam mode - keep existing logic but use Teachable Machine for detection
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
        
        // Load model for IP Webcam detection (only if enabled)
        if (enableTeachableMachine) {
          const result = await loadModel();
          if (result.success) {
        setTimeout(() => {
          startBrandDetection();
        }, 2000);
          } else {
            setIsCameraActive(false);
            alert('Tidak dapat memuat model Teachable Machine.');
          }
        }
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

  // Effect to ensure video stream is attached (for IP Webcam mode)
  useEffect(() => {
    if (isCameraActive && cameraMode === 'ipwebcam' && imgRef.current && !imgRef.current.src) {
      imgRef.current.src = IP_WEBCAM_STREAM;
    }
  }, [isCameraActive, cameraMode]);

  // Stop camera stream
  const stopCamera = () => {
    setIsCameraActive(false);
    setIsStreaming(false);
    
    // Stop prediction loop
    isLoopingRef.current = false;
    
    // Stop Teachable Machine webcam (only if enabled)
    if (enableTeachableMachine && webcamRef.current) {
      webcamRef.current.stop();
      
      // Remove canvas from DOM
      if (webcamRef.current.canvas && webcamRef.current.canvas.parentNode) {
        webcamRef.current.canvas.parentNode.removeChild(webcamRef.current.canvas);
      }
      
      webcamRef.current = null;
    }
    
    // Show video element again if it was hidden
    if (videoRef.current) {
      videoRef.current.style.display = '';
      videoRef.current.srcObject = null;
    }
    
    if (cameraStream) {
      cameraStream.getTracks().forEach(track => track.stop());
      setCameraStream(null);
    }
    
    if (imgRef.current) {
      imgRef.current.src = '';
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

  // Capture frame and detect using Teachable Machine (for IP Webcam mode, only if enabled)
  const captureAndDetect = async () => {
    if (!enableTeachableMachine) return; // Skip detection if Teachable Machine is disabled
    if (!imgRef.current || !canvasRef.current || !modelRef.current || isDetecting) return;
    
    try {
      setIsDetecting(true);
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      
      if (!imgRef.current) return;
      
      const width = imgRef.current.naturalWidth || 640;
      const height = imgRef.current.naturalHeight || 480;
      
      canvas.width = width;
      canvas.height = height;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      try {
        // Try to fetch fresh snapshot
          const snapshotUrl = IP_WEBCAM_SNAPSHOT + '?t=' + Date.now();
          const response = await fetch(snapshotUrl, { cache: 'no-cache' });
          
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          
          const blob = await response.blob();
        const imageUrl = URL.createObjectURL(blob);
        const img = new Image();
        
        await new Promise((resolve, reject) => {
          img.onload = () => {
            ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
            URL.revokeObjectURL(imageUrl);
            resolve();
          };
          img.onerror = () => {
            URL.revokeObjectURL(imageUrl);
            // Fallback to drawing from imgRef
            try {
              ctx.drawImage(imgRef.current, 0, 0, canvas.width, canvas.height);
              resolve();
            } catch (canvasError) {
              reject(new Error('Failed to draw image'));
            }
          };
          img.src = imageUrl;
          });
        } catch (fetchError) {
          console.warn('Failed to fetch IP webcam snapshot:', fetchError);
          try {
            ctx.drawImage(imgRef.current, 0, 0, canvas.width, canvas.height);
          } catch (canvasError) {
            console.error('Canvas draw failed:', canvasError);
            throw new Error('IP webcam CORS restriction');
          }
      }
      
      // Use Teachable Machine to predict
      const prediction = await modelRef.current.predict(canvas);
      
      // Find the highest confidence prediction
      let highestConfidence = 0;
      let bestPrediction = null;
      
      for (let i = 0; i < maxPredictionsRef.current; i++) {
        if (prediction[i].probability > highestConfidence) {
          highestConfidence = prediction[i].probability;
          bestPrediction = prediction[i];
        }
      }
      
      // Update detected brand and confidence
      if (bestPrediction && highestConfidence > 0.1) { // Only show if confidence > 10%
        setDetectedBrand(bestPrediction.className);
        setDetectionConfidence(Math.round(highestConfidence * 100));
        setApiConnectionError(false);
      } else {
        setDetectedBrand(null);
        setDetectionConfidence(0);
        setApiConnectionError(false);
      }
    } catch (error) {
      console.error('Error detecting brand:', error);
      setDetectedBrand(null);
      setDetectionConfidence(0);
      setApiConnectionError(true);
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
      // Stop prediction loop
      isLoopingRef.current = false;
      
      // Stop Teachable Machine webcam (only if enabled)
      if (enableTeachableMachine && webcamRef.current) {
        webcamRef.current.stop();
        
        // Remove canvas from DOM
        if (webcamRef.current.canvas && webcamRef.current.canvas.parentNode) {
          webcamRef.current.canvas.parentNode.removeChild(webcamRef.current.canvas);
        }
        
        webcamRef.current = null;
      }
      
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
        videoRef.current.style.display = '';
      }
    };
  }, [cameraStream, enableTeachableMachine]);

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
                    zIndex: enableTeachableMachine ? 0 : 1, // Lower z-index when Teachable Machine canvas is active
                    backgroundColor: '#000',
                    display: enableTeachableMachine && webcamRef.current ? 'none' : 'block' // Hide when Teachable Machine canvas is active
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
              
              {/* Scanning Animation - Only show if Teachable Machine is enabled */}
              {enableTeachableMachine && isDetecting && (
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

          {/* Brand Detection Result - Only show if Teachable Machine is enabled */}
          {enableTeachableMachine && detectedBrand && (
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

          {/* Detection Status - Only show if Teachable Machine is enabled */}
          {enableTeachableMachine && isDetecting && (
            <div className="absolute top-4 right-4 bg-gray-800/90 text-white px-3 py-2 rounded-lg text-xs font-medium z-10">
              🔍 Detecting...
            </div>
          )}
          
          {/* Model Error - Only show if Teachable Machine is enabled */}
          {enableTeachableMachine && apiConnectionError && !isDetecting && isCameraActive && (
            <div className="absolute top-16 right-4 bg-yellow-500/90 text-white px-3 py-2 rounded-lg text-xs font-medium z-10 max-w-xs shadow-lg">
              <div className="flex items-start space-x-2">
                <span>⚠️</span>
                <div>
                  <div className="font-bold mb-1">Model Tidak Ditemukan</div>
                  <div className="text-xs opacity-90">
                    Pastikan model Teachable Machine tersedia di:
                  </div>
                  <div className="text-xs opacity-75 mt-1 font-mono">
                    public/my_model/
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Metadata - Only show brand detection if Teachable Machine is enabled */}
        {enableTeachableMachine ? (
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
        ) : (
          <div className="grid grid-cols-1 gap-4">
            <div className="bg-gray-50 rounded-lg p-3">
              <div className="text-xs text-gray-600 mb-1">Camera Status</div>
              <div className={`text-sm font-medium ${
                isCameraActive ? 'text-green-500' : 'text-gray-500'
              }`}>
                {isCameraActive ? 'Active' : 'Inactive'}
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default CameraSection;

