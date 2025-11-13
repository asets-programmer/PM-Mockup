import React, { useState, useRef, useEffect } from 'react';
import { Package, Play, Square, AlertTriangle, CheckCircle, Camera, Upload, X } from 'lucide-react';

const JerigenDetection = ({ onJerigenDetected }) => {
  // States
  const [isActive, setIsActive] = useState(false);
  const isActiveRef = useRef(false);
  const [isDetecting, setIsDetecting] = useState(false);
  const [detections, setDetections] = useState([]);
  const [error, setError] = useState(null);
  const [modelLoaded, setModelLoaded] = useState(false);
  const [inputMode, setInputMode] = useState('camera'); // 'camera' or 'video'
  const [uploadedVideo, setUploadedVideo] = useState(null);
  const fileInputRef = useRef(null);
  
  // Refs
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const overlayCanvasRef = useRef(null);
  const streamRef = useRef(null);
  const modelRef = useRef(null);
  const animationFrameRef = useRef(null);
  
  // Detection history untuk debounce
  const lastDetectionTimeRef = useRef(0);
  const DETECTION_DEBOUNCE_MS = 18000; // 18 detik - hanya kirim event sekali per 18 detik (mencegah spam)
  
  // Configuration
  const MODEL_PATH = '/models/jerigen/best.pt'; // Path ke model YOLO
  const BACKEND_API_URL = 'http://localhost:8000/api/detect'; // Backend API untuk inference (opsional)
  const USE_BACKEND_API = false; // Set true jika ingin menggunakan backend API
  
  // Load YOLO model
  const loadModel = async () => {
    try {
      setError(null);
      
      if (USE_BACKEND_API) {
        // Jika menggunakan backend API, tidak perlu load model di frontend
        console.log('Using backend API for detection');
        setModelLoaded(true);
        return true;
      }
      
      // Cek apakah YOLOv8 tersedia (jika menggunakan library JavaScript)
      // Untuk saat ini, kita akan menggunakan pendekatan backend API atau model yang dikonversi
      // Jika model sudah dikonversi ke ONNX atau TensorFlow.js, load di sini
      
      // Contoh: Load ONNX model (jika model dikonversi ke ONNX)
      // const session = await ort.InferenceSession.create(MODEL_PATH.replace('.pt', '.onnx'));
      // modelRef.current = session;
      
      // Untuk demo, kita akan menggunakan simulasi deteksi atau backend API
      console.log('Model loading: Using detection API or converted model');
      setModelLoaded(true);
      return true;
    } catch (error) {
      console.error('Error loading model:', error);
      setError(`Gagal memuat model: ${error.message}. Pastikan model tersedia atau gunakan backend API.`);
      return false;
    }
  };
  
  // Deteksi jerigen menggunakan backend API
  const detectJerigenAPI = async (imageData) => {
    try {
      // Convert canvas to blob
      const blob = await new Promise(resolve => {
        canvasRef.current.toBlob(resolve, 'image/jpeg', 0.8);
      });
      
      const formData = new FormData();
      formData.append('image', blob, 'frame.jpg');
      
      const response = await fetch(BACKEND_API_URL, {
        method: 'POST',
        body: formData
      });
      
      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }
      
      const result = await response.json();
      return result.detections || [];
    } catch (error) {
      console.error('API detection error:', error);
      return [];
    }
  };
  
  // Simulasi deteksi jerigen (untuk demo/testing)
  const simulateDetection = (imageData) => {
    // Simulasi: 30% chance untuk deteksi jerigen
    const random = Math.random();
    if (random < 0.3) {
      const width = imageData.width;
      const height = imageData.height;
      
      return [{
        class: 'jerigen',
        confidence: 0.75 + Math.random() * 0.2, // 75-95%
        bbox: {
          x: width * 0.2 + Math.random() * width * 0.3,
          y: height * 0.3 + Math.random() * height * 0.3,
          width: width * 0.15 + Math.random() * width * 0.1,
          height: height * 0.2 + Math.random() * height * 0.15
        }
      }];
    }
    return [];
  };
  
  // Deteksi jerigen dari frame
  const detectJerigen = async (imageData) => {
    if (USE_BACKEND_API && modelLoaded) {
      return await detectJerigenAPI(imageData);
    } else {
      // Simulasi atau gunakan model yang sudah di-load
      // Untuk production, ganti ini dengan inference model YOLO yang sebenarnya
      return simulateDetection(imageData);
    }
  };
  
  // Draw detections pada canvas
  const drawDetections = (ctx, detections, width, height) => {
    detections.forEach(detection => {
      const { bbox, confidence, class: className } = detection;
      
      // Draw bounding box
      ctx.strokeStyle = '#FF0000';
      ctx.lineWidth = 3;
      ctx.strokeRect(bbox.x, bbox.y, bbox.width, bbox.height);
      
      // Draw label background
      const label = `${className} ${(confidence * 100).toFixed(1)}%`;
      ctx.fillStyle = 'rgba(255, 0, 0, 0.8)';
      ctx.font = 'bold 16px Arial';
      const textMetrics = ctx.measureText(label);
      const labelWidth = textMetrics.width + 10;
      const labelHeight = 24;
      
      ctx.fillRect(bbox.x, bbox.y - labelHeight, labelWidth, labelHeight);
      
      // Draw label text
      ctx.fillStyle = '#FFFFFF';
      ctx.fillText(label, bbox.x + 5, bbox.y - 8);
    });
  };
  
  // Main detection loop
  const detectionLoop = async () => {
    if (!isActiveRef.current) {
      return;
    }
    if (!videoRef.current || !canvasRef.current) {
      return;
    }
    
    const video = videoRef.current;
    if (!video || video.readyState < 2) {
      animationFrameRef.current = requestAnimationFrame(() => {
        setTimeout(detectionLoop, 100);
      });
      return;
    }
    
    if (!video.videoWidth || !video.videoHeight) {
      animationFrameRef.current = requestAnimationFrame(() => {
        setTimeout(detectionLoop, 100);
      });
      return;
    }
    
    try {
      setIsDetecting(true);
      
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d', { willReadFrequently: true });
      
      // Draw video frame to canvas
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      
      // Get image data
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      
      // Detect jerigen
      const newDetections = await detectJerigen(imageData);
      
      // Filter detections dengan confidence > 0.5
      const validDetections = newDetections.filter(det => det.confidence > 0.5);
      
      if (validDetections.length > 0) {
        setDetections(validDetections);
        
        // Trigger event dengan debounce
        const currentTime = Date.now();
        if (currentTime - lastDetectionTimeRef.current >= DETECTION_DEBOUNCE_MS) {
          lastDetectionTimeRef.current = currentTime;
          
          const highestConfidence = Math.max(...validDetections.map(d => d.confidence));
          
          console.log('🔔 Jerigen detected! Confidence:', highestConfidence);
          console.log('📊 Detections:', validDetections);
          
          if (onJerigenDetected) {
            console.log('📞 Calling onJerigenDetected callback...');
            onJerigenDetected({
              detections: validDetections,
              confidence: highestConfidence,
              timestamp: new Date().toISOString()
            });
            console.log('✅ onJerigenDetected callback called');
          } else {
            console.warn('⚠️ onJerigenDetected callback is not provided');
          }
          
          // Show browser notification
          if ('Notification' in window && Notification.permission === 'granted') {
            new Notification('⚠️ Jerigen Terdeteksi!', {
              body: `Jerigen terdeteksi dengan confidence ${(highestConfidence * 100).toFixed(1)}%`,
              icon: '/assets/logo_stori-removebg-preview.png',
              tag: 'jerigen-detection'
            });
          } else if ('Notification' in window && Notification.permission !== 'denied') {
            Notification.requestPermission().then(permission => {
              if (permission === 'granted') {
                new Notification('⚠️ Jerigen Terdeteksi!', {
                  body: `Jerigen terdeteksi dengan confidence ${(highestConfidence * 100).toFixed(1)}%`,
                  icon: '/assets/logo_stori-removebg-preview.png',
                  tag: 'jerigen-detection'
                });
              }
            });
          }
        }
      } else {
        setDetections([]);
      }
      
       // Draw detections on overlay canvas (HANYA bounding box, TIDAK video frame)
       if (overlayCanvasRef.current && video.videoWidth > 0 && video.videoHeight > 0) {
         const overlayCtx = overlayCanvasRef.current.getContext('2d', { willReadFrequently: false });
         const overlayCanvas = overlayCanvasRef.current;
         
         // Set canvas size sekali saja (jika belum di-set atau berubah)
         if (overlayCanvas.width !== video.videoWidth || overlayCanvas.height !== video.videoHeight) {
           overlayCanvas.width = video.videoWidth;
           overlayCanvas.height = video.videoHeight;
         }
         
         // Clear canvas (hanya clear, tidak draw video frame lagi)
         overlayCtx.clearRect(0, 0, overlayCanvas.width, overlayCanvas.height);
         
         // Draw detections (hanya bounding box dan label)
         if (validDetections.length > 0) {
           drawDetections(overlayCtx, validDetections, overlayCanvas.width, overlayCanvas.height);
         }
         
         // Draw info overlay
         overlayCtx.fillStyle = 'rgba(0, 0, 0, 0.7)';
         overlayCtx.fillRect(10, 10, 300, 60);
         
         overlayCtx.fillStyle = '#FF0000';
         overlayCtx.font = 'bold 18px Arial';
         overlayCtx.fillText('Jerigen Detection Active', 20, 35);
         
         if (validDetections.length > 0) {
           overlayCtx.fillStyle = '#FFFF00';
           overlayCtx.fillText(`Detected: ${validDetections.length} jerigen`, 20, 60);
         } else {
           overlayCtx.fillStyle = '#00FF00';
           overlayCtx.fillText('No jerigen detected', 20, 60);
         }
       }
      
    } catch (error) {
      console.error('Error in detection loop:', error);
    } finally {
      setIsDetecting(false);
    }
    
     // Continue loop dengan throttle yang lebih baik
     const throttleDelay = inputMode === 'video' ? 200 : 300; // Lebih cepat untuk video
     animationFrameRef.current = requestAnimationFrame(() => {
       setTimeout(detectionLoop, throttleDelay);
     });
  };
  
  // Start camera
  const startCamera = async () => {
    try {
      // Mark user interaction untuk enable audio auto-play
      if (window.userInteractedForAudio) {
        window.userInteractedForAudio();
      }
      
      console.log('Starting jerigen detection camera...');
      setError(null);
      
      // Load model first
      console.log('Loading model...');
      const modelLoadedSuccess = await loadModel();
      if (!modelLoadedSuccess) {
        console.error('Model loading failed');
        throw new Error('Model tidak dapat dimuat');
      }
      console.log('Model loaded successfully');
      
      // Get user media
      console.log('Requesting camera access...');
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { ideal: 640 },
          height: { ideal: 480 },
          facingMode: 'environment'
        }
      });
      
      console.log('Camera access granted');
      streamRef.current = stream;
      
      // Wait for videoRef to be ready
      let retries = 0;
      while (!videoRef.current && retries < 10) {
        await new Promise(resolve => setTimeout(resolve, 100));
        retries++;
      }
      
      if (videoRef.current) {
        console.log('Setting video srcObject...');
        videoRef.current.srcObject = stream;
        console.log('Playing video...');
        
        // Wait for video to be ready
        await new Promise((resolve) => {
          if (videoRef.current) {
            const video = videoRef.current;
            
            const onLoadedMetadata = () => {
              console.log('Video metadata loaded');
              video.removeEventListener('loadedmetadata', onLoadedMetadata);
              resolve();
            };
            
            video.addEventListener('loadedmetadata', onLoadedMetadata);
            
            video.play().then(() => {
              console.log('Video playing');
              if (video.readyState >= 2) {
                video.removeEventListener('loadedmetadata', onLoadedMetadata);
                resolve();
              }
            }).catch((err) => {
              console.error('Error playing video:', err);
              setTimeout(() => {
                video.removeEventListener('loadedmetadata', onLoadedMetadata);
                resolve();
              }, 500);
            });
            
            setTimeout(() => {
              video.removeEventListener('loadedmetadata', onLoadedMetadata);
              resolve();
            }, 2000);
          } else {
            resolve();
          }
        });
        
        await new Promise(resolve => setTimeout(resolve, 200));
        
        console.log('Video ready, starting detection');
        isActiveRef.current = true;
        setIsActive(true);
        
        setTimeout(() => {
          console.log('Starting detection loop...');
          detectionLoop();
        }, 300);
      } else {
        throw new Error('Video element tidak ditemukan');
      }
    } catch (error) {
      console.error('Error starting camera:', error);
      setError(`Gagal mengakses kamera: ${error.message}`);
      isActiveRef.current = false;
      setIsActive(false);
    }
  };
  
  // Handle video file upload
  const handleVideoUpload = (event) => {
    const file = event.target.files[0];
    if (!file) return;
    
    if (!file.type.startsWith('video/')) {
      setError('File harus berupa video');
      return;
    }
    
    const videoURL = URL.createObjectURL(file);
    setUploadedVideo({ file, url: videoURL });
    setInputMode('video');
    setError(null);
  };
  
  // Start video detection
  const startVideoDetection = async () => {
    try {
      // Mark user interaction untuk enable audio auto-play
      if (window.userInteractedForAudio) {
        window.userInteractedForAudio();
      }
      
      console.log('Starting video detection...');
      setError(null);
      
      if (!uploadedVideo) {
        throw new Error('Tidak ada video yang di-upload');
      }
      
      // Load model first
      console.log('Loading model...');
      const modelLoadedSuccess = await loadModel();
      if (!modelLoadedSuccess) {
        console.error('Model loading failed');
        throw new Error('Model tidak dapat dimuat');
      }
      console.log('Model loaded successfully');
      
      // Wait for videoRef to be ready
      let retries = 0;
      while (!videoRef.current && retries < 10) {
        await new Promise(resolve => setTimeout(resolve, 100));
        retries++;
      }
      
      if (videoRef.current) {
        console.log('Setting video source...');
        videoRef.current.src = uploadedVideo.url;
        videoRef.current.load();
        
        // Wait for video to be ready
        await new Promise((resolve, reject) => {
          if (videoRef.current) {
            const video = videoRef.current;
            
            const onLoadedMetadata = () => {
              console.log('Video metadata loaded');
              video.removeEventListener('loadedmetadata', onLoadedMetadata);
              video.removeEventListener('error', onError);
              resolve();
            };
            
            const onError = (err) => {
              console.error('Error loading video:', err);
              video.removeEventListener('loadedmetadata', onLoadedMetadata);
              video.removeEventListener('error', onError);
              reject(new Error('Gagal memuat video'));
            };
            
            video.addEventListener('loadedmetadata', onLoadedMetadata);
            video.addEventListener('error', onError);
            
            video.play().then(() => {
              console.log('Video playing');
              if (video.readyState >= 2) {
                video.removeEventListener('loadedmetadata', onLoadedMetadata);
                video.removeEventListener('error', onError);
                resolve();
              }
            }).catch((err) => {
              console.error('Error playing video:', err);
              onError(err);
            });
            
            setTimeout(() => {
              video.removeEventListener('loadedmetadata', onLoadedMetadata);
              video.removeEventListener('error', onError);
              if (video.readyState >= 2) {
                resolve();
              } else {
                reject(new Error('Video tidak dapat dimuat'));
              }
            }, 5000);
          } else {
            reject(new Error('Video element tidak ditemukan'));
          }
        });
        
        await new Promise(resolve => setTimeout(resolve, 200));
        
        // Handle video end event untuk loop
        if (videoRef.current) {
          videoRef.current.onended = () => {
            if (isActiveRef.current && inputMode === 'video') {
              videoRef.current.currentTime = 0;
              videoRef.current.play();
            }
          };
        }
        
        console.log('Video ready, starting detection');
        isActiveRef.current = true;
        setIsActive(true);
        
        setTimeout(() => {
          console.log('Starting detection loop...');
          detectionLoop();
        }, 300);
      } else {
        throw new Error('Video element tidak ditemukan');
      }
    } catch (error) {
      console.error('Error starting video detection:', error);
      setError(`Gagal memuat video: ${error.message}`);
      isActiveRef.current = false;
      setIsActive(false);
    }
  };
  
  // Stop detection
  const stopDetection = () => {
    isActiveRef.current = false;
    setIsActive(false);
    
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }
    
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    
    if (videoRef.current) {
      if (inputMode === 'camera') {
        videoRef.current.srcObject = null;
      } else {
        videoRef.current.pause();
        videoRef.current.src = '';
      }
    }
    
    setDetections([]);
  };
  
  // Clear uploaded video
  const clearUploadedVideo = () => {
    if (uploadedVideo && uploadedVideo.url) {
      URL.revokeObjectURL(uploadedVideo.url);
    }
    setUploadedVideo(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    if (videoRef.current) {
      videoRef.current.src = '';
    }
    stopDetection();
  };
  
  // Start detection based on mode
  const startDetection = async () => {
    if (inputMode === 'camera') {
      await startCamera();
    } else {
      await startVideoDetection();
    }
  };
  
  // Request notification permission on mount
  useEffect(() => {
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }
  }, []);
  
  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopDetection();
      if (uploadedVideo && uploadedVideo.url) {
        URL.revokeObjectURL(uploadedVideo.url);
      }
    };
  }, [uploadedVideo]);
  
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold text-gray-900 flex items-center">
          <Package className="w-5 h-5 mr-2 text-red-600" />
          Jerigen Detection System
        </h2>
        <div className="flex items-center space-x-2">
          {!isActive ? (
            <>
              <button
                onClick={() => setInputMode('camera')}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center space-x-2 ${
                  inputMode === 'camera'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <Camera className="w-4 h-4" />
                <span>Kamera</span>
              </button>
              <button
                onClick={() => setInputMode('video')}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center space-x-2 ${
                  inputMode === 'video'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <Upload className="w-4 h-4" />
                <span>Upload Video</span>
              </button>
              <button
                onClick={startDetection}
                disabled={inputMode === 'video' && !uploadedVideo}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 flex items-center space-x-2 disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                <Play className="w-4 h-4" />
                <span>Start Detection</span>
              </button>
            </>
          ) : (
            <button
              onClick={stopDetection}
              className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 flex items-center space-x-2"
            >
              <Square className="w-4 h-4" />
              <span>Stop Detection</span>
            </button>
          )}
        </div>
      </div>
      
      {/* Video Upload Section */}
      {inputMode === 'video' && !isActive && (
        <div className="mb-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
          <div className="flex items-center justify-between mb-2">
            <label className="text-sm font-medium text-gray-700">Upload Video</label>
            {uploadedVideo && (
              <button
                onClick={clearUploadedVideo}
                className="text-red-600 hover:text-red-700 text-sm flex items-center space-x-1"
              >
                <X className="w-4 h-4" />
                <span>Hapus</span>
              </button>
            )}
          </div>
          <input
            ref={fileInputRef}
            type="file"
            accept="video/*"
            onChange={handleVideoUpload}
            className="hidden"
            id="video-upload-input"
          />
          <label
            htmlFor="video-upload-input"
            className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-white hover:bg-gray-50 transition-colors"
          >
            {uploadedVideo ? (
              <div className="flex flex-col items-center space-y-2">
                <CheckCircle className="w-8 h-8 text-green-600" />
                <span className="text-sm text-gray-700 font-medium">
                  {uploadedVideo.file.name}
                </span>
                <span className="text-xs text-gray-500">
                  {(uploadedVideo.file.size / (1024 * 1024)).toFixed(2)} MB
                </span>
              </div>
            ) : (
              <div className="flex flex-col items-center space-y-2">
                <Upload className="w-8 h-8 text-gray-400" />
                <span className="text-sm text-gray-600">
                  Klik untuk upload video
                </span>
                <span className="text-xs text-gray-500">
                  Format: MP4, WebM, MOV
                </span>
              </div>
            )}
          </label>
        </div>
      )}
      
      {error && (
        <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
          <div className="font-semibold mb-1">⚠️ Error</div>
          <div className="text-sm">{error}</div>
          {!USE_BACKEND_API && (
            <div className="text-xs mt-2 text-red-600">
              <strong>Catatan:</strong> Untuk menggunakan model YOLO (.pt), Anda perlu:
              <ul className="list-disc list-inside mt-1 space-y-1">
                <li>Mengkonversi model ke format ONNX atau TensorFlow.js</li>
                <li>Atau setup backend API untuk inference</li>
                <li>Atau gunakan library YOLOv8 JavaScript jika tersedia</li>
              </ul>
            </div>
          )}
        </div>
      )}
      
      {/* Camera/Video View */}
      <div className="relative bg-black rounded-lg overflow-hidden mb-4" style={{ height: '480px' }}>
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted={true}
          loop={inputMode === 'video'}
          className={isActive ? 'w-full h-full object-contain' : 'hidden'}
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            zIndex: 0
          }}
        />
        <canvas
          ref={canvasRef}
          className="hidden"
        />
         <canvas
           ref={overlayCanvasRef}
           className={isActive ? '' : 'hidden'}
           style={{ 
             position: 'absolute', 
             top: 0, 
             left: 0,
             width: '100%',
             height: '100%',
             objectFit: 'contain',
             zIndex: 1,
             pointerEvents: 'none' // Agar tidak mengganggu video playback
           }}
         />
        
        {isActive ? (
          <>
            {isDetecting && (
              <div className="absolute top-4 right-4 bg-red-600/90 text-white px-3 py-2 rounded-lg text-xs font-medium z-10">
                🔍 Detecting...
              </div>
            )}
            {inputMode === 'video' && (
              <div className="absolute top-4 left-4 bg-blue-600/90 text-white px-3 py-2 rounded-lg text-xs font-medium z-10">
                📹 Video Mode
              </div>
            )}
          </>
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-gray-400">
            <div className="text-center">
              <Package className="w-16 h-16 mx-auto mb-2 opacity-50" />
              <p>
                {inputMode === 'camera' 
                  ? 'Kamera tidak aktif' 
                  : uploadedVideo 
                    ? 'Video siap untuk deteksi' 
                    : 'Upload video untuk deteksi'}
              </p>
              <p className="text-sm mt-1">
                {inputMode === 'camera'
                  ? 'Klik "Start Detection" untuk memulai deteksi jerigen'
                  : uploadedVideo
                    ? 'Klik "Start Detection" untuk memulai deteksi jerigen'
                    : 'Pilih video terlebih dahulu'}
              </p>
            </div>
          </div>
        )}
      </div>
      
      {/* Detection Info */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-gray-50 rounded-lg p-3">
          <div className="text-xs text-gray-600 mb-1">Status</div>
          <div className={`text-sm font-medium ${
            isActive ? (detections.length > 0 ? 'text-red-600' : 'text-green-600') : 'text-gray-500'
          }`}>
            {isActive ? (detections.length > 0 ? 'Jerigen Detected' : 'Monitoring') : 'Inactive'}
          </div>
        </div>
        <div className="bg-gray-50 rounded-lg p-3">
          <div className="text-xs text-gray-600 mb-1">Detections</div>
          <div className="text-sm font-medium text-gray-900">
            {detections.length > 0 ? `${detections.length} jerigen` : '0'}
          </div>
        </div>
        <div className="bg-gray-50 rounded-lg p-3">
          <div className="text-xs text-gray-600 mb-1">Confidence</div>
          <div className={`text-sm font-medium ${
            detections.length > 0 && detections[0].confidence > 0.8 ? 'text-red-600' :
            detections.length > 0 && detections[0].confidence > 0.6 ? 'text-yellow-600' :
            'text-gray-500'
          }`}>
            {detections.length > 0 ? `${(detections[0].confidence * 100).toFixed(1)}%` : 'N/A'}
          </div>
        </div>
      </div>
    </div>
  );
};

export default JerigenDetection;

