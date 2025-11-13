import React, { useState, useRef, useEffect } from 'react';
import { Car, Play, Square, AlertTriangle, CheckCircle, Camera, Upload, X, Clock, Activity } from 'lucide-react';

const CarMotionDetection = ({ onCarMotionDetected }) => {
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
  
  // Motion detection states
  const [isMoving, setIsMoving] = useState(false);
  const [duration, setDuration] = useState(null); // Duration in seconds
  const [status, setStatus] = useState('NO CAR'); // 'NO CAR', 'MOVING', 'STATIONARY'
  
  // Refs
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const overlayCanvasRef = useRef(null);
  const streamRef = useRef(null);
  const modelRef = useRef(null);
  const animationFrameRef = useRef(null);
  const modelLoadedRef = useRef(false); // Ref untuk tracking model loaded state
  
  // Motion tracking refs
  const prevCarPositionsRef = useRef([]);
  const prevFrameStatsRef = useRef(null);
  const durationStartTimeRef = useRef(null);
  const lastMotionTimeRef = useRef(null);
  const isTrackingDurationRef = useRef(false);
  const frozenDurationRef = useRef(null);
  
  // Configuration
  const MODEL_PATH = '/model_mobil_listrik/yolov8n.onnx'; // Model ONNX untuk browser
  const BACKEND_API_URL = 'http://localhost:8000/api/car-motion-detect';
  const USE_BACKEND_API = false; // Menggunakan model ONNX langsung di browser
  
  // Motion detection parameters
  const MOTION_THRESHOLD = 20; // pixels - threshold untuk mendeteksi gerakan mobil
  const SEGMENTS = 20; // Jumlah segment untuk motion detection
  const DELAY_SECONDS = 1.0; // Delay sebelum mulai menghitung duration
  const CONFIDENCE_THRESHOLD = 0.25; // Confidence threshold untuk deteksi mobil
  const CAR_CLASS_ID = 2; // Class ID untuk mobil di COCO dataset
  
  // Detection history untuk debounce
  const lastDetectionTimeRef = useRef(0);
  const DETECTION_DEBOUNCE_MS = 5000; // 5 detik
  
  // Wait for ONNX Runtime to load
  const waitForONNX = async (maxWait = 10000) => {
    const startTime = Date.now();
    while (!window.ort && (Date.now() - startTime) < maxWait) {
      await new Promise(resolve => setTimeout(resolve, 100));
    }
    if (!window.ort) {
      throw new Error('ONNX Runtime tidak tersedia. Pastikan CDN sudah dimuat di index.html');
    }
    return window.ort;
  };

  // Load ONNX model untuk deteksi mobil
  const loadModel = async () => {
    try {
      setError(null);
      
      if (USE_BACKEND_API) {
        console.log('Using backend API for car motion detection');
        setModelLoaded(true);
        modelLoadedRef.current = true;
        return true;
      }
      
      // Wait for ONNX Runtime
      const ort = await waitForONNX();
      console.log('ONNX Runtime loaded, version:', ort.env.versions?.onnxruntime);
      
      // Load ONNX model
      console.log('Loading ONNX model from:', MODEL_PATH);
      
      // Check if model file exists
      try {
        const modelCheck = await fetch(MODEL_PATH);
        if (!modelCheck.ok) {
          throw new Error(`Model file tidak ditemukan: ${modelCheck.status}. Pastikan file ${MODEL_PATH} ada. Jalankan convert_to_onnx.py untuk konversi model.`);
        }
        console.log('Model file found, loading...');
      } catch (fetchError) {
        console.error('Error checking model file:', fetchError);
        throw new Error(`Tidak dapat mengakses model file: ${fetchError.message}. Pastikan file ada di ${MODEL_PATH} atau jalankan convert_to_onnx.py untuk konversi model.`);
      }
      
      // Create inference session
      const session = await ort.InferenceSession.create(MODEL_PATH);
      console.log('✓ ONNX model loaded successfully');
      console.log('Model inputs:', session.inputNames);
      console.log('Model outputs:', session.outputNames);
      
      // Log model input/output shapes untuk debugging
      if (session.inputNames.length > 0) {
        const inputMetadata = session.inputMetadata[session.inputNames[0]];
        console.log('Input shape:', inputMetadata?.shape);
      }
      if (session.outputNames.length > 0) {
        const outputMetadata = session.outputMetadata[session.outputNames[0]];
        console.log('Output shape:', outputMetadata?.shape);
      }
      
      modelRef.current = {
        session: session,
        ort: ort
      };
      
      setModelLoaded(true);
      modelLoadedRef.current = true; // Update ref juga
      console.log('✅ Model loaded and stored in modelRef:', {
        hasSession: !!modelRef.current.session,
        hasOrt: !!modelRef.current.ort,
        inputNames: session.inputNames,
        outputNames: session.outputNames
      });
      return true;
    } catch (error) {
      console.error('Error loading model:', error);
      const errorMessage = error.message.includes('404') || error.message.includes('not found')
        ? `Model ONNX tidak ditemukan di ${MODEL_PATH}. Silakan jalankan convert_to_onnx.py untuk mengkonversi model.`
        : `Gagal memuat model: ${error.message}. Pastikan model ONNX ada di ${MODEL_PATH} atau jalankan convert_to_onnx.py untuk konversi model.`;
      setError(errorMessage);
      setModelLoaded(false);
      modelLoadedRef.current = false;
      return false;
    }
  };
  
  // Calculate segment statistics untuk motion detection
  const calculateSegmentStats = (frame) => {
    const frameHeight = frame.height;
    const frameWidth = frame.width;
    const segmentHeight = Math.floor(frameHeight / SEGMENTS);
    const segmentWidth = Math.floor(frameWidth / SEGMENTS);
    const stats = [];
    
    const imageData = frame.data;
    const channels = 4; // RGBA
    
    for (let i = 0; i < SEGMENTS; i++) {
      const rowStats = [];
      for (let j = 0; j < SEGMENTS; j++) {
        const startY = i * segmentHeight;
        const endY = Math.min((i + 1) * segmentHeight, frameHeight);
        const startX = j * segmentWidth;
        const endX = Math.min((j + 1) * segmentWidth, frameWidth);
        
        let sum = 0;
        let sumSq = 0;
        let count = 0;
        
        for (let y = startY; y < endY; y++) {
          for (let x = startX; x < endX; x++) {
            const idx = (y * frameWidth + x) * channels;
            const r = imageData[idx];
            const g = imageData[idx + 1];
            const b = imageData[idx + 2];
            // Convert to grayscale
            const gray = 0.299 * r + 0.587 * g + 0.114 * b;
            sum += gray;
            sumSq += gray * gray;
            count++;
          }
        }
        
        const avg = sum / count;
        const variance = (sumSq / count) - (avg * avg);
        const std = Math.sqrt(Math.max(0, variance));
        
        rowStats.push([avg, std]);
      }
      stats.push(rowStats);
    }
    
    return stats;
  };
  
  // Detect general movement in frame
  const detectGeneralMovement = (prevStats, currentStats) => {
    if (!prevStats || !currentStats) {
      return false;
    }
    
    for (let i = 0; i < Math.min(prevStats.length, currentStats.length); i++) {
      for (let j = 0; j < Math.min(prevStats[i].length, currentStats[i].length); j++) {
        const avgDiff = Math.abs(prevStats[i][j][0] - currentStats[i][j][0]);
        const stdDiff = Math.abs(prevStats[i][j][1] - currentStats[i][j][1]);
        
        if (avgDiff > 10 || stdDiff > 10) {
          return true;
        }
      }
    }
    
    return false;
  };
  
  // Calculate center point of bounding box
  const getCenter = (bbox) => {
    return {
      x: bbox.x + bbox.width / 2,
      y: bbox.y + bbox.height / 2
    };
  };
  
  // Detect car movement by comparing positions
  const detectCarMovement = (currentCars, previousCars) => {
    if (!currentCars || currentCars.length === 0) {
      return false;
    }
    
    if (!previousCars || previousCars.length === 0) {
      // Mobil baru muncul - jangan langsung anggap bergerak
      // Biarkan duration tracking dimulai, nanti akan terdeteksi jika benar-benar bergerak
      return false; // Anggap stationary dulu, akan terdeteksi di frame berikutnya jika bergerak
    }
    
    let totalDisplacement = 0;
    let matchedCount = 0;
    
    for (const currCar of currentCars) {
      const currCenter = getCenter(currCar.bbox);
      let minDistance = Infinity;
      
      for (const prevCar of previousCars) {
        const prevCenter = getCenter(prevCar.bbox);
        const distance = Math.sqrt(
          Math.pow(currCenter.x - prevCenter.x, 2) +
          Math.pow(currCenter.y - prevCenter.y, 2)
        );
        if (distance < minDistance) {
          minDistance = distance;
        }
      }
      
      if (minDistance < Infinity) {
        totalDisplacement += minDistance;
        matchedCount++;
      }
    }
    
    if (matchedCount === 0) {
      return true; // Mobil baru muncul
    }
    
    const avgDisplacement = totalDisplacement / matchedCount;
    return avgDisplacement > MOTION_THRESHOLD;
  };
  
  // Detect cars using backend API dengan model YOLOv8 asli
  const detectCarsAPI = async (imageData) => {
    try {
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
      
      // Update state dari API response
      if (result.duration !== undefined) {
        setDuration(result.duration);
      }
      if (result.isMoving !== undefined) {
        setIsMoving(result.isMoving);
      }
      if (result.status) {
        setStatus(result.status);
      }
      
      return result.cars || [];
    } catch (error) {
      console.error('API detection error:', error);
      // Fallback ke simulasi jika API error
      if (error.message.includes('Failed to fetch') || error.message.includes('NetworkError')) {
        console.warn('API tidak tersedia, menggunakan simulasi...');
        return simulateCarDetection(imageData);
      }
      return [];
    }
  };
  
  // Detect cars menggunakan ONNX model
  const detectCarsONNX = async (imageData) => {
    if (!modelRef.current || !modelRef.current.session) {
      return [];
    }
    
    try {
      const { session, ort } = modelRef.current;
      const canvas = canvasRef.current;
      
      if (!canvas) {
        return [];
      }
      
      // Preprocess image untuk YOLOv8
      // YOLOv8 expects: RGB image, normalized to [0, 1], resized to 640x640, NCHW format
      const inputSize = 640;
      const tempCanvas = document.createElement('canvas');
      tempCanvas.width = inputSize;
      tempCanvas.height = inputSize;
      const tempCtx = tempCanvas.getContext('2d');
      
      // Draw and resize image
      tempCtx.drawImage(canvas, 0, 0, inputSize, inputSize);
      
      // Get image data
      const imageDataResized = tempCtx.getImageData(0, 0, inputSize, inputSize);
      const data = imageDataResized.data;
      
      // Convert to tensor (NCHW format: [1, 3, 640, 640])
      const inputArray = new Float32Array(1 * 3 * inputSize * inputSize);
      
      // Normalize pixel values to [0, 1] and convert RGB to NCHW format
      for (let i = 0; i < inputSize * inputSize; i++) {
        const r = data[i * 4] / 255.0;
        const g = data[i * 4 + 1] / 255.0;
        const b = data[i * 4 + 2] / 255.0;
        
        // NCHW format: [batch, channels, height, width]
        inputArray[i] = r; // R channel
        inputArray[i + inputSize * inputSize] = g; // G channel
        inputArray[i + inputSize * inputSize * 2] = b; // B channel
      }
      
      // Create tensor
      const inputTensor = new ort.Tensor('float32', inputArray, [1, 3, inputSize, inputSize]);
      
      // Run inference
      const feeds = { [session.inputNames[0]]: inputTensor };
      const results = await session.run(feeds);
      
      // Get output (YOLOv8 ONNX output format: [batch, 84, num_detections] atau [batch, num_detections, 84])
      // 84 = 4 (bbox: x, y, w, h) + 80 (class scores)
      const output = results[session.outputNames[0]];
      const outputData = output.data;
      const outputDims = output.dims;
      
      console.log('ONNX output shape:', outputDims);
      console.log('ONNX output names:', session.outputNames);
      
      // Parse detections
      const cars = [];
      const numClasses = 80; // COCO dataset
      
      const originalWidth = imageData.width;
      const originalHeight = imageData.height;
      const scaleX = originalWidth / inputSize;
      const scaleY = originalHeight / inputSize;
      
      // YOLOv8 ONNX format biasanya: [1, 84, 8400] atau [1, 8400, 84]
      // Format: [batch, features, detections] atau [batch, detections, features]
      let numDetections, featuresPerDetection;
      
      if (outputDims.length === 3) {
        // Format [batch, features, detections] atau [batch, detections, features]
        if (outputDims[1] === 84 || outputDims[1] === (4 + numClasses)) {
          // Format [1, 84, num_detections]
          featuresPerDetection = outputDims[1];
          numDetections = outputDims[2];
        } else {
          // Format [1, num_detections, 84]
          numDetections = outputDims[1];
          featuresPerDetection = outputDims[2];
        }
      } else {
        console.warn('Unexpected output format:', outputDims);
        return [];
      }
      
      // Parse detections
      for (let i = 0; i < numDetections; i++) {
        let bboxX, bboxY, bboxW, bboxH;
        let classScores = [];
        
        if (featuresPerDetection === 84 || featuresPerDetection === (4 + numClasses)) {
          // Format [1, 84, num_detections] - transpose needed
          if (outputDims[1] === 84) {
            // [batch, 84, detections] - access as [detection * 84 + feature]
            bboxX = outputData[i + 0 * numDetections];
            bboxY = outputData[i + 1 * numDetections];
            bboxW = outputData[i + 2 * numDetections];
            bboxH = outputData[i + 3 * numDetections];
            for (let j = 0; j < numClasses; j++) {
              classScores.push(outputData[i + (4 + j) * numDetections]);
            }
          } else {
            // Format [1, detections, 84] - access as [detection * 84 + feature]
            const offset = i * featuresPerDetection;
            bboxX = outputData[offset + 0];
            bboxY = outputData[offset + 1];
            bboxW = outputData[offset + 2];
            bboxH = outputData[offset + 3];
            for (let j = 0; j < numClasses; j++) {
              classScores.push(outputData[offset + 4 + j]);
            }
          }
        } else {
          // Fallback: assume [1, detections, 84]
          const offset = i * featuresPerDetection;
          bboxX = outputData[offset + 0];
          bboxY = outputData[offset + 1];
          bboxW = outputData[offset + 2];
          bboxH = outputData[offset + 3];
          for (let j = 0; j < numClasses; j++) {
            classScores.push(outputData[offset + 4 + j]);
          }
        }
        
        // Find max class score
        let maxClassScore = 0;
        let maxClassIndex = 0;
        for (let j = 0; j < classScores.length; j++) {
          if (classScores[j] > maxClassScore) {
            maxClassScore = classScores[j];
            maxClassIndex = j;
          }
        }
        
        // Filter: hanya mobil (class 2 di COCO) dan confidence > threshold
        if (maxClassIndex === CAR_CLASS_ID && maxClassScore >= CONFIDENCE_THRESHOLD) {
          // Convert from center format to top-left format
          // YOLOv8 output: center_x, center_y, width, height (normalized [0, 1])
          const centerX = bboxX * originalWidth;
          const centerY = bboxY * originalHeight;
          const width = bboxW * originalWidth;
          const height = bboxH * originalHeight;
          
          const x = centerX - width / 2;
          const y = centerY - height / 2;
          
          cars.push({
            class: 'car',
            confidence: maxClassScore,
            bbox: {
              x: Math.max(0, Math.round(x)),
              y: Math.max(0, Math.round(y)),
              width: Math.min(Math.round(width), originalWidth - Math.max(0, Math.round(x))),
              height: Math.min(Math.round(height), originalHeight - Math.max(0, Math.round(y)))
            }
          });
        }
      }
      
      console.log(`ONNX detected ${cars.length} cars`);
      return cars;
    } catch (error) {
      console.error('ONNX detection error:', error);
      return [];
    }
  };

  // Detect cars from frame
  const detectCars = async (imageData) => {
    if (USE_BACKEND_API && modelLoadedRef.current) {
      console.log('🔵 Using backend API for detection');
      return await detectCarsAPI(imageData);
    } else if (modelLoadedRef.current && modelRef.current && modelRef.current.session) {
      // Gunakan ONNX model (gunakan ref untuk menghindari race condition)
      try {
        const result = await detectCarsONNX(imageData);
        if (result.length > 0) {
          console.log(`✅ ONNX detected ${result.length} car(s)`);
        }
        return result;
      } catch (error) {
        console.error('❌ Error in ONNX detection:', error);
        console.error('Error details:', error.stack);
        // Jangan fallback ke simulasi, return empty array
        return [];
      }
    } else {
      // Model belum loaded - log sekali saja untuk menghindari spam
      const now = Date.now();
      if (!lastDetectionTimeRef.current || (now - lastDetectionTimeRef.current) > 5000) {
        if (!modelLoadedRef.current) {
          console.warn('⚠️ Model belum dimuat. Pastikan model ONNX ada di', MODEL_PATH);
          console.warn('⚠️ Jalankan convert_to_onnx.py untuk mengkonversi model');
        } else if (!modelRef.current) {
          console.warn('⚠️ modelRef.current tidak tersedia');
        } else if (!modelRef.current.session) {
          console.warn('⚠️ Model session tidak tersedia di modelRef.current');
        }
        lastDetectionTimeRef.current = now;
      }
      return [];
    }
  };
  
  // Format duration to HH:MM:SS
  const formatDuration = (seconds) => {
    if (seconds === null || seconds === undefined) {
      return '00:00:00';
    }
    
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);
    
    return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };
  
  // Draw detections and motion info on canvas (optimized untuk menghindari flicker)
  const drawDetections = (ctx, detections, width, height, isMoving, duration) => {
    // Gunakan save/restore untuk batch operations
    ctx.save();
    
    // Canvas sudah di-clear di detectionLoop, tidak perlu clear lagi di sini
    
    if (detections.length === 0) {
      ctx.restore();
      return;
    }
    
    // Draw bounding boxes
    detections.forEach(detection => {
      const { bbox, confidence, class: className } = detection;
      
      // Color: green for stationary, red for moving
      const color = isMoving ? '#FF0000' : '#00FF00';
      const thickness = isMoving ? 2 : 3;
      
      // Draw bounding box
      ctx.strokeStyle = color;
      ctx.lineWidth = thickness;
      ctx.strokeRect(bbox.x, bbox.y, bbox.width, bbox.height);
      
      // Draw label
      const label = `${className} [${isMoving ? 'MOVING' : 'STATIONARY'}] ${(confidence * 100).toFixed(1)}%`;
      ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
      ctx.font = 'bold 16px Arial';
      const textMetrics = ctx.measureText(label);
      const labelWidth = textMetrics.width + 10;
      const labelHeight = 24;
      
      ctx.fillRect(bbox.x, bbox.y - labelHeight, labelWidth, labelHeight);
      ctx.fillStyle = color;
      ctx.fillText(label, bbox.x + 5, bbox.y - 8);
      
      // Draw duration below bounding box if stationary
      if (!isMoving && duration !== null) {
        const durationLabel = `Duration: ${formatDuration(duration)}`;
        ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
        ctx.font = '14px Arial';
        const durMetrics = ctx.measureText(durationLabel);
        const durWidth = durMetrics.width + 10;
        const durHeight = 20;
        
        ctx.fillRect(bbox.x, bbox.y + bbox.height, durWidth, durHeight);
        ctx.fillStyle = '#00FF00';
        ctx.fillText(durationLabel, bbox.x + 5, bbox.y + bbox.height + 15);
      }
    });
    
    // Draw main info panel (top left)
    const durationStr = formatDuration(duration);
    let mainText, statusText, textColor;
    
    if (detections.length > 0) {
      if (isMoving) {
        mainText = `Duration: ${durationStr} [STOPPED]`;
        statusText = 'STATUS: MOVING';
        textColor = '#FFA500'; // Orange
      } else {
        mainText = `Duration: ${durationStr} [RUNNING]`;
        statusText = 'STATUS: STATIONARY';
        textColor = '#00FF00'; // Green
      }
    } else {
      mainText = 'Duration: 00:00:00';
      statusText = 'STATUS: NO CAR';
      textColor = '#808080'; // Gray
    }
    
    // Draw panel background
    ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
    ctx.fillRect(10, 10, 350, 80);
    ctx.strokeStyle = textColor;
    ctx.lineWidth = 3;
    ctx.strokeRect(10, 10, 350, 80);
    
    // Draw duration text
    ctx.fillStyle = textColor;
    ctx.font = 'bold 20px Arial';
    ctx.fillText(mainText, 20, 40);
    
    // Draw status text
    ctx.fillStyle = '#FFFFFF';
    ctx.font = '16px Arial';
    ctx.fillText(statusText, 20, 65);
    
    // Draw car count
    if (detections.length > 0) {
      ctx.fillStyle = '#FFFFFF';
      ctx.font = '14px Arial';
      ctx.fillText(`Cars Detected: ${detections.length}`, 20, 85);
    }
    
    ctx.restore();
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
      
      // Draw video frame to canvas (hanya set size jika berubah untuk menghindari flicker)
      if (canvas.width !== video.videoWidth || canvas.height !== video.videoHeight) {
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
      }
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      
      // Get image data
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      
      // Calculate segment stats for motion detection
      const currentStats = calculateSegmentStats(imageData);
      const generalMovement = detectGeneralMovement(prevFrameStatsRef.current, currentStats);
      
      // Detect cars
      const cars = await detectCars(imageData);
      const validCars = cars.filter(car => car.confidence >= CONFIDENCE_THRESHOLD);
      
      // Jika menggunakan API, ambil hasil dari API (sudah include motion detection)
      let carMoving = false;
      let currentDuration = duration;
      
      if (USE_BACKEND_API && modelLoaded) {
        // API sudah menghitung motion detection dan duration
        // Gunakan nilai dari state yang sudah di-update oleh detectCarsAPI
        carMoving = isMoving;
        currentDuration = duration;
      } else {
        // Detect car movement secara lokal
        carMoving = detectCarMovement(validCars, prevCarPositionsRef.current);
        
        // Update duration tracking
        const currentTime = Date.now() / 1000; // Convert to seconds
        
        if (validCars.length > 0 && !carMoving) {
          // Car detected and STATIONARY → Duration RUNNING (increasing)
          // Jangan update lastMotionTimeRef untuk generalMovement karena itu hanya noise/background
          // Hanya update lastMotionTimeRef ketika mobil benar-benar bergerak (carMoving = true)
          
          // Jika sudah tracking duration, langsung lanjutkan tanpa cek delay lagi
          if (isTrackingDurationRef.current && durationStartTimeRef.current !== null) {
            // Continue tracking duration (mobil masih stationary)
            currentDuration = currentTime - durationStartTimeRef.current;
            // Update state dengan debounce untuk menghindari flicker
            if (Math.floor(currentDuration) !== Math.floor(duration || 0)) {
              setDuration(currentDuration);
            }
            if (isMoving) {
              setIsMoving(false);
              setStatus('STATIONARY');
            }
          } else {
            // Belum mulai tracking, cek delay dulu
            // Jika lastMotionTimeRef null, berarti mobil baru pertama kali terdeteksi
            // Set ke waktu yang sudah melewati delay agar bisa langsung mulai tracking
            if (lastMotionTimeRef.current === null) {
              lastMotionTimeRef.current = currentTime - DELAY_SECONDS;
            }
            
            const timeSinceLastMotion = currentTime - lastMotionTimeRef.current;
            
            if (timeSinceLastMotion >= DELAY_SECONDS) {
              // Start tracking duration
              if (frozenDurationRef.current !== null && frozenDurationRef.current > 0) {
                // Continue from frozen duration (resume setelah mobil bergerak)
                durationStartTimeRef.current = currentTime - frozenDurationRef.current;
                frozenDurationRef.current = null;
              } else {
                // Start new duration tracking
                durationStartTimeRef.current = currentTime - (timeSinceLastMotion - DELAY_SECONDS);
              }
              isTrackingDurationRef.current = true;
              
              // Calculate duration immediately
              currentDuration = currentTime - durationStartTimeRef.current;
              if (currentDuration > 0) {
                setDuration(currentDuration);
              }
              if (isMoving) {
                setIsMoving(false);
                setStatus('STATIONARY');
              }
            } else {
              // Still in delay - show frozen duration if exists, otherwise show 0
              if (frozenDurationRef.current !== null && frozenDurationRef.current > 0) {
                if (frozenDurationRef.current !== duration) {
                  setDuration(frozenDurationRef.current);
                }
              } else {
                // Belum ada duration, set ke null atau 0
                if (duration !== null && duration !== 0) {
                  setDuration(null);
                }
              }
              if (isMoving) {
                setIsMoving(false);
                setStatus('STATIONARY');
              }
            }
          }
        } else {
          // Car moving or no car → Duration STOPPED (freeze)
          if (carMoving && validCars.length > 0) {
            // Car moving → Save and freeze duration
            if (isTrackingDurationRef.current) {
              // Freeze duration yang sedang berjalan
              frozenDurationRef.current = currentTime - durationStartTimeRef.current;
              isTrackingDurationRef.current = false;
              durationStartTimeRef.current = null;
            }
            // Update lastMotionTime untuk delay tracking saat mobil kembali stationary
            lastMotionTimeRef.current = currentTime;
            
            // Update duration display dengan frozen duration (jika ada)
            if (frozenDurationRef.current !== null && frozenDurationRef.current !== duration) {
              setDuration(frozenDurationRef.current);
            } else if (frozenDurationRef.current === null && duration !== null && duration > 0) {
              // Jika tidak ada frozen duration tapi ada duration sebelumnya, freeze duration tersebut
              frozenDurationRef.current = duration;
              setDuration(frozenDurationRef.current);
            }
            
            if (!isMoving) {
              setIsMoving(true);
              setStatus('MOVING');
            }
          } else {
            // No car → Reset all
            if (isTrackingDurationRef.current) {
              isTrackingDurationRef.current = false;
              durationStartTimeRef.current = null;
            }
            frozenDurationRef.current = null;
            if (duration !== null) {
              setDuration(null);
            }
            if (isMoving || status !== 'NO CAR') {
              setIsMoving(false);
              setStatus('NO CAR');
            }
            // Reset lastMotionTime saat tidak ada mobil
            lastMotionTimeRef.current = null;
          }
        }
      }
      
      // Jika menggunakan API, duration sudah dihitung di backend
      // Hanya update status jika perlu (untuk API mode)
      if (USE_BACKEND_API && modelLoaded && validCars.length === 0) {
        setStatus('NO CAR');
      }
      
      // Update previous state (hanya untuk local detection)
      if (!USE_BACKEND_API || !modelLoaded) {
        prevFrameStatsRef.current = currentStats;
        prevCarPositionsRef.current = validCars;
      } else {
        // Update car positions untuk tracking visual
        prevCarPositionsRef.current = validCars;
      }
      
      // Update detections state
      setDetections(validCars);
      
      // Trigger event dengan debounce
      if (validCars.length > 0) {
        const currentTimeMs = Date.now();
        if (currentTimeMs - lastDetectionTimeRef.current >= DETECTION_DEBOUNCE_MS) {
          lastDetectionTimeRef.current = currentTimeMs;
          
          if (onCarMotionDetected) {
            onCarMotionDetected({
              cars: validCars,
              isMoving: USE_BACKEND_API && modelLoaded ? isMoving : carMoving,
              duration: USE_BACKEND_API && modelLoaded ? duration : currentDuration,
              status: status,
              timestamp: new Date().toISOString()
            });
          }
        }
      }
      
      // Draw detections on overlay canvas (optimized untuk menghindari flicker)
      if (overlayCanvasRef.current && video.videoWidth > 0 && video.videoHeight > 0) {
        const overlayCtx = overlayCanvasRef.current.getContext('2d', { willReadFrequently: false });
        const overlayCanvas = overlayCanvasRef.current;
        
        // Hanya set size jika berubah untuk menghindari flicker
        if (overlayCanvas.width !== video.videoWidth || overlayCanvas.height !== video.videoHeight) {
          overlayCanvas.width = video.videoWidth;
          overlayCanvas.height = video.videoHeight;
        }
        
        // Clear canvas dengan save/restore untuk performa lebih baik
        overlayCtx.save();
        overlayCtx.clearRect(0, 0, overlayCanvas.width, overlayCanvas.height);
        
        if (validCars.length > 0) {
          const displayMoving = USE_BACKEND_API && modelLoaded ? isMoving : carMoving;
          const displayDuration = USE_BACKEND_API && modelLoaded ? duration : currentDuration;
          drawDetections(overlayCtx, validCars, overlayCanvas.width, overlayCanvas.height, displayMoving, displayDuration);
        }
        
        // Draw info overlay
        overlayCtx.fillStyle = 'rgba(0, 0, 0, 0.7)';
        overlayCtx.fillRect(10, 100, 300, 50);
        
        overlayCtx.fillStyle = '#00FF00';
        overlayCtx.font = 'bold 18px Arial';
        overlayCtx.fillText('Car Motion Detection Active', 20, 125);
        
        if (validCars.length > 0) {
          const displayMoving = USE_BACKEND_API && modelLoaded ? isMoving : carMoving;
          overlayCtx.fillStyle = displayMoving ? '#FF0000' : '#00FF00';
          overlayCtx.fillText(`Cars: ${validCars.length} - ${displayMoving ? 'MOVING' : 'STATIONARY'}`, 20, 145);
        } else {
          overlayCtx.fillStyle = '#FFFFFF';
          overlayCtx.fillText('No car detected', 20, 145);
        }
        
        overlayCtx.restore();
      }
      
    } catch (error) {
      console.error('Error in detection loop:', error);
    } finally {
      setIsDetecting(false);
    }
    
    // Continue loop dengan throttle yang lebih baik untuk menghindari flicker
    const throttleDelay = inputMode === 'video' ? 200 : 250; // Ditingkatkan untuk mengurangi flicker
    animationFrameRef.current = requestAnimationFrame(() => {
      setTimeout(detectionLoop, throttleDelay);
    });
  };
  
  // Start camera
  const startCamera = async () => {
    try {
      console.log('Starting car motion detection camera...');
      setError(null);
      
      // Load model terlebih dahulu
      console.log('Loading model...');
      const modelLoadedSuccess = await loadModel();
      if (!modelLoadedSuccess) {
        console.error('Model loading failed');
        throw new Error('Model tidak dapat dimuat. Pastikan file yolov8n.onnx ada di public/model_mobil_listrik/');
      }
      console.log('Model loaded successfully, modelLoaded:', modelLoaded, 'modelRef:', modelRef.current);
      
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { ideal: 640 },
          height: { ideal: 480 },
          facingMode: 'environment'
        }
      });
      
      streamRef.current = stream;
      
      let retries = 0;
      while (!videoRef.current && retries < 10) {
        await new Promise(resolve => setTimeout(resolve, 100));
        retries++;
      }
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        
        await new Promise((resolve) => {
          if (videoRef.current) {
            const video = videoRef.current;
            
            const onLoadedMetadata = () => {
              video.removeEventListener('loadedmetadata', onLoadedMetadata);
              resolve();
            };
            
            video.addEventListener('loadedmetadata', onLoadedMetadata);
            
            video.play().then(() => {
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
        
        // Reset tracking state
        prevCarPositionsRef.current = [];
        prevFrameStatsRef.current = null;
        durationStartTimeRef.current = null;
        lastMotionTimeRef.current = Date.now() / 1000;
        isTrackingDurationRef.current = false;
        frozenDurationRef.current = null;
        
        isActiveRef.current = true;
        setIsActive(true);
        
        setTimeout(() => {
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
      console.log('Starting video detection...');
      setError(null);
      
      if (!uploadedVideo) {
        throw new Error('Tidak ada video yang di-upload');
      }
      
      const modelLoadedSuccess = await loadModel();
      if (!modelLoadedSuccess) {
        throw new Error('Model tidak dapat dimuat');
      }
      
      let retries = 0;
      while (!videoRef.current && retries < 10) {
        await new Promise(resolve => setTimeout(resolve, 100));
        retries++;
      }
      
      if (videoRef.current) {
        videoRef.current.src = uploadedVideo.url;
        videoRef.current.load();
        
        await new Promise((resolve, reject) => {
          if (videoRef.current) {
            const video = videoRef.current;
            
            const onLoadedMetadata = () => {
              video.removeEventListener('loadedmetadata', onLoadedMetadata);
              video.removeEventListener('error', onError);
              resolve();
            };
            
            const onError = (err) => {
              video.removeEventListener('loadedmetadata', onLoadedMetadata);
              video.removeEventListener('error', onError);
              reject(new Error('Gagal memuat video'));
            };
            
            video.addEventListener('loadedmetadata', onLoadedMetadata);
            video.addEventListener('error', onError);
            
            video.play().then(() => {
              if (video.readyState >= 2) {
                video.removeEventListener('loadedmetadata', onLoadedMetadata);
                video.removeEventListener('error', onError);
                resolve();
              }
            }).catch((err) => {
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
        
        if (videoRef.current) {
          videoRef.current.onended = () => {
            if (isActiveRef.current && inputMode === 'video') {
              videoRef.current.currentTime = 0;
              videoRef.current.play();
            }
          };
        }
        
        // Reset tracking state
        prevCarPositionsRef.current = [];
        prevFrameStatsRef.current = null;
        durationStartTimeRef.current = null;
        lastMotionTimeRef.current = Date.now() / 1000;
        isTrackingDurationRef.current = false;
        frozenDurationRef.current = null;
        
        // Pastikan model sudah loaded sebelum start detection (gunakan ref)
        if (!modelLoadedRef.current || !modelRef.current) {
          console.warn('Model belum loaded, mencoba load lagi...');
          const retryLoad = await loadModel();
          if (!retryLoad || !modelRef.current || !modelLoadedRef.current) {
            throw new Error('Model tidak dapat dimuat. Pastikan file yolov8n.onnx ada di public/model_mobil_listrik/');
          }
        }
        
        isActiveRef.current = true;
        setIsActive(true);
        
        setTimeout(() => {
          console.log('Starting detection loop, modelLoaded:', modelLoadedRef.current, 'modelRef:', !!modelRef.current);
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
    
    // Reset states
    setDetections([]);
    setIsMoving(false);
    setDuration(null);
    setStatus('NO CAR');
    prevCarPositionsRef.current = [];
    prevFrameStatsRef.current = null;
    durationStartTimeRef.current = null;
    lastMotionTimeRef.current = null;
    isTrackingDurationRef.current = false;
    frozenDurationRef.current = null;
    modelLoadedRef.current = false; // Reset model loaded ref
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
          <Car className="w-5 h-5 mr-2 text-blue-600" />
          Car Motion Detection with Duration Tracking
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
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center space-x-2 disabled:bg-gray-400 disabled:cursor-not-allowed"
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
              <strong>Cara memperbaiki:</strong>
              <ol className="list-decimal list-inside mt-1 space-y-1">
                <li>Buka terminal di folder <code>PM-Mockup/public/model_mobil_listrik/</code></li>
                <li>Jalankan: <code>python convert_to_onnx.py</code> atau <code>convert_to_onnx.bat</code></li>
                <li>Pastikan file <code>yolov8n.onnx</code> ada di folder tersebut</li>
                <li>Refresh halaman dan coba lagi</li>
              </ol>
            </div>
          )}
        </div>
      )}
      
      {!modelLoaded && !error && !USE_BACKEND_API && (
        <div className="mb-4 p-3 bg-blue-100 border border-blue-400 text-blue-700 rounded">
          <div className="font-semibold mb-1">ℹ️ Info</div>
          <div className="text-sm">Model ONNX akan dimuat saat Anda klik "Start Detection".</div>
          <div className="text-xs mt-2 text-blue-600">
            <strong>Catatan:</strong> Pastikan file <code>yolov8n.onnx</code> ada di <code>public/model_mobil_listrik/</code>
          </div>
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
            pointerEvents: 'none'
          }}
        />
        
        {isActive ? (
          <>
            {isDetecting && (
              <div className="absolute top-4 right-4 bg-blue-600/90 text-white px-3 py-2 rounded-lg text-xs font-medium z-10">
                🔍 Detecting...
              </div>
            )}
            {inputMode === 'video' && (
              <div className="absolute top-4 left-4 bg-blue-600/90 text-white px-3 py-2 rounded-lg text-xs font-medium z-10">
                📹 Video Mode
              </div>
            )}
            {modelLoaded && (
              <div className="absolute bottom-4 left-4 bg-green-600/90 text-white px-3 py-2 rounded-lg text-xs font-medium z-10">
                ✅ Model Loaded
              </div>
            )}
          </>
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-gray-400">
            <div className="text-center">
              <Car className="w-16 h-16 mx-auto mb-2 opacity-50" />
              <p>
                {inputMode === 'camera' 
                  ? 'Kamera tidak aktif' 
                  : uploadedVideo 
                    ? 'Video siap untuk deteksi' 
                    : 'Upload video untuk deteksi'}
              </p>
              <p className="text-sm mt-1">
                {inputMode === 'camera'
                  ? 'Klik "Start Detection" untuk memulai deteksi mobil dan tracking durasi'
                  : uploadedVideo
                    ? 'Klik "Start Detection" untuk memulai deteksi mobil dan tracking durasi'
                    : 'Pilih video terlebih dahulu'}
              </p>
            </div>
          </div>
        )}
      </div>
      
      {/* Detection Info */}
      <div className="grid grid-cols-4 gap-4">
        <div className="bg-gray-50 rounded-lg p-3">
          <div className="text-xs text-gray-600 mb-1">Status</div>
          <div className={`text-sm font-medium ${
            isActive ? (
              status === 'STATIONARY' ? 'text-green-600' :
              status === 'MOVING' ? 'text-red-600' :
              'text-gray-500'
            ) : 'text-gray-500'
          }`}>
            {isActive ? status : 'Inactive'}
          </div>
        </div>
        <div className="bg-gray-50 rounded-lg p-3">
          <div className="text-xs text-gray-600 mb-1 flex items-center">
            <Clock className="w-3 h-3 mr-1" />
            Duration
          </div>
          <div className={`text-sm font-medium ${
            duration !== null && !isMoving ? 'text-green-600' :
            duration !== null && isMoving ? 'text-orange-600' :
            'text-gray-500'
          }`}>
            {formatDuration(duration)}
          </div>
        </div>
        <div className="bg-gray-50 rounded-lg p-3">
          <div className="text-xs text-gray-600 mb-1">Cars Detected</div>
          <div className="text-sm font-medium text-gray-900">
            {detections.length > 0 ? `${detections.length} car(s)` : '0'}
          </div>
        </div>
        <div className="bg-gray-50 rounded-lg p-3">
          <div className="text-xs text-gray-600 mb-1 flex items-center">
            <Activity className="w-3 h-3 mr-1" />
            Motion
          </div>
          <div className={`text-sm font-medium ${
            isMoving ? 'text-red-600' : 'text-green-600'
          }`}>
            {isMoving ? 'MOVING' : detections.length > 0 ? 'STATIONARY' : 'N/A'}
          </div>
        </div>
      </div>
      
      {/* Info Panel */}
      {isActive && detections.length > 0 && (
        <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="text-xs text-blue-800">
            <strong>Info:</strong> Duration hanya dihitung saat mobil <strong>diam</strong>. 
            Duration akan direset saat mobil <strong>bergerak</strong>.
          </div>
        </div>
      )}
    </div>
  );
};

export default CarMotionDetection;

