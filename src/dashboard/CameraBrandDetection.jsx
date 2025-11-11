import { useEffect, useRef, useState } from 'react';
import { Camera, Loader2, Tag, AlertCircle, X } from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

function CameraBrandDetection() {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const overlayCanvasRef = useRef(null);
  const [detectedBrand, setDetectedBrand] = useState(null);
  const [detectedObjects, setDetectedObjects] = useState(null);
  const [isDetecting, setIsDetecting] = useState(false);
  const [isStreaming, setIsStreaming] = useState(false);
  const [error, setError] = useState(null);
  const [detectionMode, setDetectionMode] = useState('brand'); // 'brand' or 'objects'
  const detectionIntervalRef = useRef(null);

  useEffect(() => {
    return () => {
      // Cleanup on unmount
      stopCamera();
      if (detectionIntervalRef.current) {
        clearInterval(detectionIntervalRef.current);
      }
    };
  }, []);

  const startCamera = async () => {
    try {
      setError(null);
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { 
          facingMode: 'environment', // Use back camera if available
          width: { ideal: 1280 },
          height: { ideal: 720 }
        } 
      });
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setIsStreaming(true);
        startDetection();
      }
    } catch (err) {
      console.error('Error accessing camera:', err);
      setError('Tidak dapat mengakses kamera. Pastikan izin kamera sudah diberikan.');
    }
  };

  const stopCamera = () => {
    stopDetection(); // Stop detection first
    if (videoRef.current?.srcObject) {
      const stream = videoRef.current.srcObject;
      const tracks = stream.getTracks();
      tracks.forEach(track => track.stop());
      videoRef.current.srcObject = null;
      setIsStreaming(false);
    }
    clearBoundingBoxes();
    setDetectedObjects(null);
    setDetectedBrand(null);
  };

  const captureFrame = () => {
    const canvas = canvasRef.current;
    const video = videoRef.current;
    
    if (!canvas || !video || !video.videoWidth || !video.videoHeight) {
      return null;
    }
    
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    
    return canvas.toDataURL('image/jpeg', 0.8);
  };

  const detectBrand = async () => {
    if (isDetecting) return; // Skip if already detecting
    
    const frame = captureFrame();
    if (!frame) return;
    
    const base64 = frame.split(',')[1];
    
    setIsDetecting(true);
    try {
      const response = await fetch(`${API_URL}/detect-brand-realtime`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ image: base64 })
      });
      
      if (!response.ok) {
        throw new Error('Failed to detect brand');
      }
      
      const result = await response.json();
      setDetectedBrand(result);
      setDetectedObjects(null);
    } catch (err) {
      console.error('Detection error:', err);
      setError('Gagal mendeteksi merk. Pastikan API server berjalan.');
    } finally {
      setIsDetecting(false);
    }
  };

  const detectObjects = async () => {
    if (isDetecting) return; // Skip if already detecting
    
    const frame = captureFrame();
    if (!frame) return;
    
    const base64 = frame.split(',')[1];
    
    setIsDetecting(true);
    try {
      const response = await fetch(`${API_URL}/detect-objects`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ image: base64 })
      });
      
      if (!response.ok) {
        // Try to get error details from response
        let errorData;
        try {
          errorData = await response.json();
        } catch (e) {
          errorData = { message: `HTTP ${response.status}: ${response.statusText}` };
        }
        throw new Error(errorData.message || errorData.error || 'Failed to detect objects');
      }
      
      const result = await response.json();
      console.log('Object detection result:', result);
      console.log('Result success:', result.success);
      console.log('Detections count:', result.detections?.length || 0);
      console.log('Detections:', result.detections);
      console.log('Image shape:', result.image_shape);
      
      setDetectedObjects(result);
      setDetectedBrand(null);
      
      // Draw bounding boxes on overlay canvas
      if (result.success && result.detections && result.detections.length > 0) {
        console.log('Drawing bounding boxes:', result.detections);
        console.log('Video dimensions:', videoRef.current?.videoWidth, videoRef.current?.videoHeight);
        console.log('Overlay canvas:', overlayCanvasRef.current);
        
        // Wait for video to be ready with multiple retries
        let retryCount = 0;
        const maxRetries = 10;
        
        const tryDraw = () => {
          if (videoRef.current && videoRef.current.videoWidth > 0 && videoRef.current.videoHeight > 0) {
            console.log('Video ready, drawing bounding boxes...');
            drawBoundingBoxes(result.detections, result.image_shape);
          } else if (retryCount < maxRetries) {
            retryCount++;
            console.log(`Video not ready yet, retrying... (${retryCount}/${maxRetries})`);
            setTimeout(tryDraw, 200);
          } else {
            console.warn('Video not ready after max retries, drawing anyway...');
            if (result.image_shape) {
              drawBoundingBoxes(result.detections, result.image_shape);
            }
          }
        };
        
        tryDraw();
      } else {
        // Clear bounding boxes if no detections
        console.log('No detections found, clearing bounding boxes');
        clearBoundingBoxes();
        if (!result.success) {
          // Show error from result
          setError(result.message || result.error || 'Object detection failed');
        } else if (result.detections && result.detections.length === 0) {
          console.log('No objects detected in image');
        }
      }
    } catch (err) {
      console.error('Object detection error:', err);
      const errorMessage = err.message || 'Gagal mendeteksi objek. Pastikan API server dan Python service berjalan.';
      setError(errorMessage);
      // Set error result for display
      setDetectedObjects({
        success: false,
        error: err.message || 'Unknown error',
        message: errorMessage,
        details: 'Check console for more details. Make sure Python 3.8-3.12 is installed and inference package is installed.'
      });
    } finally {
      setIsDetecting(false);
    }
  };

  const clearBoundingBoxes = () => {
    const overlayCanvas = overlayCanvasRef.current;
    if (!overlayCanvas) return;
    
    const ctx = overlayCanvas.getContext('2d');
    ctx.clearRect(0, 0, overlayCanvas.width, overlayCanvas.height);
  };

  const drawBoundingBoxes = (detections, imageShape) => {
    const overlayCanvas = overlayCanvasRef.current;
    const video = videoRef.current;
    
    console.log('drawBoundingBoxes called with:', {
      detectionsCount: detections?.length,
      imageShape,
      hasOverlayCanvas: !!overlayCanvas,
      hasVideo: !!video,
      videoWidth: video?.videoWidth,
      videoHeight: video?.videoHeight
    });
    
    if (!overlayCanvas) {
      console.error('Cannot draw: overlayCanvas is null');
      return;
    }
    
    if (!video) {
      console.error('Cannot draw: video is null');
      return;
    }
    
    if (!imageShape) {
      console.warn('No imageShape provided, using video dimensions');
      imageShape = { width: video.videoWidth, height: video.videoHeight };
    }
    
    // Set canvas size to match video
    overlayCanvas.width = video.videoWidth;
    overlayCanvas.height = video.videoHeight;
    
    const ctx = overlayCanvas.getContext('2d');
    if (!ctx) {
      console.error('Cannot get 2d context from canvas');
      return;
    }
    
    // Clear canvas
    ctx.clearRect(0, 0, overlayCanvas.width, overlayCanvas.height);
    
    // Calculate scale factors
    const scaleX = overlayCanvas.width / imageShape.width;
    const scaleY = overlayCanvas.height / imageShape.height;
    
    console.log('Drawing', detections.length, 'bounding boxes');
    console.log('Scale factors:', { scaleX, scaleY });
    console.log('Canvas size:', overlayCanvas.width, 'x', overlayCanvas.height);
    console.log('Image shape:', imageShape.width, 'x', imageShape.height);
    
    let drawnCount = 0;
    detections.forEach((detection, index) => {
      if (!detection.bbox) {
        console.warn(`Detection ${index} missing bbox:`, detection);
        return;
      }
      
      const bbox = detection.bbox;
      const x = bbox.x * scaleX;
      const y = bbox.y * scaleY;
      const width = bbox.width * scaleX;
      const height = bbox.height * scaleY;
      
      console.log(`Drawing detection ${index}:`, {
        class: detection.class,
        confidence: detection.confidence,
        bbox: { x, y, width, height },
        originalBbox: bbox
      });
      
      // Validate coordinates
      if (isNaN(x) || isNaN(y) || isNaN(width) || isNaN(height)) {
        console.warn(`Invalid coordinates for detection ${index}:`, { x, y, width, height });
        return;
      }
      
      // Draw bounding box
      ctx.strokeStyle = '#00ff00';
      ctx.lineWidth = 3;
      ctx.strokeRect(x, y, width, height);
      
      // Draw label background
      const label = `${detection.class || 'object'} (${Math.round((detection.confidence || 0) * 100)}%)`;
      ctx.fillStyle = 'rgba(0, 255, 0, 0.7)';
      ctx.font = 'bold 16px Arial';
      const textMetrics = ctx.measureText(label);
      const textHeight = 20;
      ctx.fillRect(x, Math.max(0, y - textHeight), textMetrics.width + 10, textHeight);
      
      // Draw label text
      ctx.fillStyle = '#000';
      ctx.fillText(label, x + 5, Math.max(textHeight - 5, y - 5));
      
      drawnCount++;
    });
    
    console.log(`Successfully drew ${drawnCount} bounding boxes`);
  };

  const detect = () => {
    if (detectionMode === 'brand') {
      detectBrand();
    } else {
      detectObjects();
    }
  };

  const startDetection = () => {
    // Stop any existing detection
    if (detectionIntervalRef.current) {
      clearInterval(detectionIntervalRef.current);
      detectionIntervalRef.current = null;
    }
    
    // First detection immediately
    detect();
    
    // Then detect every 3 seconds (reduced frequency to avoid too many requests)
    detectionIntervalRef.current = setInterval(() => {
      if (!isDetecting) { // Only detect if not already detecting
        detect();
      }
    }, 3000);
  };

  const stopDetection = () => {
    if (detectionIntervalRef.current) {
      clearInterval(detectionIntervalRef.current);
      detectionIntervalRef.current = null;
    }
    clearBoundingBoxes();
  };

  const getConditionColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'normal':
        return 'bg-green-100 text-green-800 border-green-300';
      case 'warning':
        return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'critical':
        return 'bg-red-100 text-red-800 border-red-300';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8 px-4">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Deteksi Merk Dispenser dari Kamera
          </h1>
          <p className="text-gray-600">
            Arahkan kamera ke dispenser untuk mendeteksi merk secara real-time
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center gap-3">
            <AlertCircle className="h-5 w-5 text-red-600" />
            <p className="text-red-600">{error}</p>
            <button
              onClick={() => setError(null)}
              className="ml-auto"
            >
              <X className="h-5 w-5 text-red-600" />
            </button>
          </div>
        )}

        {/* Detection Mode Toggle */}
        <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-1">Mode Deteksi</h3>
              <p className="text-sm text-gray-600">Pilih mode deteksi yang ingin digunakan</p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setDetectionMode('brand')}
                className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
                  detectionMode === 'brand'
                    ? 'bg-indigo-600 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                Brand Detection
              </button>
              <button
                onClick={() => setDetectionMode('objects')}
                className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
                  detectionMode === 'objects'
                    ? 'bg-indigo-600 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                Object Detection (Bounding Boxes)
              </button>
            </div>
          </div>
        </div>

        {/* Camera Section */}
        <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-200">
          <div className="relative">
            <video
              ref={videoRef}
              autoPlay
              playsInline
              className="w-full rounded-lg bg-black"
              style={{ maxHeight: '500px', objectFit: 'contain' }}
            />
            
            {/* Overlay canvas for bounding boxes */}
            <canvas
              ref={overlayCanvasRef}
              className="absolute top-0 left-0 pointer-events-none"
              style={{ 
                width: '100%',
                height: '100%',
                maxHeight: '500px',
                objectFit: 'contain',
                zIndex: 10
              }}
            />
            
            {!isStreaming && (
              <div className="absolute inset-0 flex items-center justify-center bg-gray-900 bg-opacity-75 rounded-lg">
                <div className="text-center text-white">
                  <Camera className="h-16 w-16 mx-auto mb-4 opacity-50" />
                  <p className="text-lg">Kamera belum diaktifkan</p>
                  <button
                    onClick={startCamera}
                    className="mt-4 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-semibold transition-colors"
                  >
                    Aktifkan Kamera
                  </button>
                </div>
              </div>
            )}

            {isStreaming && (
              <div className="absolute top-4 right-4">
                <button
                  onClick={stopCamera}
                  className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-semibold transition-colors flex items-center gap-2"
                >
                  <X className="h-4 w-4" />
                  Stop
                </button>
              </div>
            )}

            {/* Detection Indicator */}
            {isDetecting && (
              <div className="absolute bottom-4 left-4 bg-black bg-opacity-75 text-white px-4 py-2 rounded-lg flex items-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Mendeteksi...</span>
              </div>
            )}
          </div>

          <canvas ref={canvasRef} style={{ display: 'none' }} />
        </div>

        {/* Object Detection Result */}
        {detectedObjects && (
          <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-200">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 rounded-lg bg-green-100">
                <Tag className="h-6 w-6 text-green-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900">Hasil Object Detection</h2>
            </div>

            {detectedObjects.success ? (
              <div className="space-y-4">
                {detectedObjects.detections && detectedObjects.detections.length > 0 ? (
                  <>
                    <div className="text-sm text-gray-600 mb-2">
                      Ditemukan {detectedObjects.count || detectedObjects.detections.length} objek
                    </div>
                    <div className="space-y-2">
                      {detectedObjects.detections.map((detection, index) => (
                        <div
                          key={index}
                          className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg p-4 border-2 border-green-200"
                        >
                          <div className="flex items-center justify-between">
                            <div>
                              <div className="text-lg font-bold text-green-700">
                                {detection.class}
                              </div>
                              <div className="text-sm text-gray-600 mt-1">
                                Confidence: {Math.round(detection.confidence * 100)}%
                              </div>
                            </div>
                            <div className="text-xs text-gray-500">
                              BBox: ({detection.bbox.x}, {detection.bbox.y}) - {detection.bbox.width}x{detection.bbox.height}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </>
                ) : (
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                    <div className="flex items-center gap-2 text-yellow-800">
                      <AlertCircle className="h-5 w-5" />
                      <p className="font-semibold">{detectedObjects.message || 'Tidak ada objek terdeteksi'}</p>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <div className="flex items-center gap-2 text-red-800">
                  <AlertCircle className="h-5 w-5" />
                  <div>
                    <p className="font-semibold">Error: {detectedObjects.error}</p>
                    <p className="text-sm text-red-700 mt-1">{detectedObjects.message}</p>
                    {detectedObjects.details && (
                      <p className="text-xs text-red-600 mt-1">{detectedObjects.details}</p>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Brand Detection Result */}
        {detectedBrand && (
          <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-200">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 rounded-lg bg-indigo-100">
                <Tag className="h-6 w-6 text-indigo-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900">Hasil Deteksi</h2>
            </div>

            {detectedBrand.detected ? (
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-lg p-6 border-2 border-indigo-200">
                    <div className="text-sm text-gray-600 mb-2">Merk Terdeteksi</div>
                    <div className="text-4xl font-bold text-indigo-600 mb-2">
                      {detectedBrand.brand}
                    </div>
                    <div className="text-xs text-gray-500">
                      Label: {detectedBrand.label}
                    </div>
                  </div>

                  <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-lg p-6 border-2 border-indigo-200">
                    <div className="text-sm text-gray-600 mb-2">Tingkat Kepercayaan</div>
                    <div className="text-4xl font-bold text-indigo-600 mb-2">
                      {Math.round(detectedBrand.confidence * 100)}%
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3 mt-2">
                      <div 
                        className="bg-indigo-600 h-3 rounded-full transition-all"
                        style={{ width: `${detectedBrand.confidence * 100}%` }}
                      ></div>
                    </div>
                  </div>
                </div>

                {detectedBrand.timestamp && (
                  <div className="text-xs text-gray-500 text-center">
                    Terdeteksi pada: {new Date(detectedBrand.timestamp).toLocaleString('id-ID')}
                  </div>
                )}
              </div>
            ) : (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <div className="flex items-center gap-2 text-yellow-800">
                  <AlertCircle className="h-5 w-5" />
                  <p className="font-semibold">{detectedBrand.message || 'Dispenser tidak terdeteksi'}</p>
                </div>
                <p className="text-sm text-yellow-700 mt-2">
                  Pastikan dispenser terlihat jelas di kamera dan cukup cahaya.
                </p>
              </div>
            )}
          </div>
        )}

        {/* Instructions */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="font-semibold text-blue-900 mb-3">Cara Penggunaan:</h3>
          <ol className="list-decimal list-inside space-y-2 text-blue-800 text-sm">
            <li>Klik tombol "Aktifkan Kamera" untuk memulai</li>
            <li>Arahkan kamera ke dispenser yang ingin dideteksi</li>
            <li>Pastikan dispenser terlihat jelas dan cukup cahaya</li>
            <li>Sistem akan mendeteksi merk secara otomatis setiap 2 detik</li>
            <li>Hasil deteksi akan muncul di bawah video</li>
          </ol>
        </div>
      </div>
    </div>
  );
}

export default CameraBrandDetection;

