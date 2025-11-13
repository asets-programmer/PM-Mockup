import React, { useState, useRef, useEffect } from 'react';
import { Car, Play, Square, AlertTriangle, CheckCircle, Camera, Upload, X } from 'lucide-react';

const PlatNomorDetection = ({ onPlatDetected }) => {
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
  const DETECTION_DEBOUNCE_MS = 5000; // 5 detik - hanya kirim event sekali per 5 detik
  
  // Audio alert untuk Non subsidized car
  const lastAudioAlertTimeRef = useRef(0);
  const AUDIO_ALERT_DEBOUNCE_MS = 8000; // 8 detik - hanya play audio sekali per 8 detik
  const audioAlertRef = useRef(null);
  const userInteractedRef = useRef(false); // Flag untuk user interaction (autoplay policy)
  
  // Configuration
  const MODEL_URL = '/model_plat/model.json';
  const METADATA_URL = '/model_plat/metadata.json';
  const CONFIDENCE_THRESHOLD = 0.5; // Minimum confidence untuk deteksi
  
  // Smoothing & Tracking (simplified for classification model)
  const smoothedDetectionsRef = useRef([]); // Detections yang sudah di-smooth
  
  // Wait for Teachable Machine Image library to load
  const waitForTMImage = async (maxWait = 5000) => {
    const startTime = Date.now();
    while (!window.tmImage && (Date.now() - startTime) < maxWait) {
      await new Promise(resolve => setTimeout(resolve, 100));
    }
    if (!window.tmImage) {
      throw new Error('Teachable Machine Image library tidak tersedia. Pastikan CDN sudah dimuat di index.html');
    }
    return window.tmImage;
  };

  // Load Teachable Machine Image Model
  const loadModel = async () => {
    try {
      setError(null);
      console.log('Loading Teachable Machine model from:', MODEL_URL);
      
      // Wait for tmImage library
      const tmImage = await waitForTMImage();
      
      // Load model and metadata
      const model = await tmImage.load(MODEL_URL, METADATA_URL);
      const maxPredictions = model.getTotalClasses();
      
      console.log('Teachable Machine model loaded successfully');
      console.log('Total classes:', maxPredictions);
      
      modelRef.current = {
        model: model,
        maxPredictions: maxPredictions,
        tmImage: tmImage
      };
      setModelLoaded(true);
      return true;
    } catch (error) {
      console.error('Error loading Teachable Machine model:', error);
      setError(`Gagal memuat model: ${error.message}`);
      setModelLoaded(false);
      return false;
    }
  };
  
  // Deteksi menggunakan Teachable Machine Image Model
  const detectPlatNomor = async () => {
    if (!modelRef.current || !modelRef.current.model) {
      return [];
    }
    
    try {
      const video = videoRef.current;
      if (!video || !video.videoWidth || !video.videoHeight) {
        return [];
      }
      
      // Create canvas from video frame
      const canvas = document.createElement('canvas');
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      
      // Predict using Teachable Machine model
      const predictions = await modelRef.current.model.predict(canvas);
      
      // Find the highest confidence prediction
      let highestConfidence = 0;
      let bestPrediction = null;
      
      for (let i = 0; i < predictions.length; i++) {
        if (predictions[i].probability > highestConfidence) {
          highestConfidence = predictions[i].probability;
          bestPrediction = predictions[i];
        }
      }
      
      // Return detection if confidence is above threshold
      if (bestPrediction && highestConfidence >= CONFIDENCE_THRESHOLD) {
        // Since Teachable Machine is a classification model (not object detection),
        // we'll return a full-frame detection with the classification result
        return [{
          class: bestPrediction.className,
          confidence: highestConfidence,
          bbox: {
            x: 0,
            y: 0,
            width: video.videoWidth,
            height: video.videoHeight
          },
          allPredictions: predictions.map(p => ({
            className: p.className,
            probability: p.probability
          }))
        }];
      }
      
      return [];
    } catch (error) {
      console.error('Error during detection:', error);
      return [];
    }
  };
  
  // Validasi detection untuk Teachable Machine (classification model)
  const isValidDetection = (confidence) => {
    return confidence >= CONFIDENCE_THRESHOLD;
  };

  // Fungsi untuk memutar audio alert narasi ketika Non subsidized car terdeteksi
  const playAudioAlert = () => {
    const currentTime = Date.now();
    
    // Debounce: hanya play audio jika sudah lebih dari 8 detik sejak terakhir
    if (currentTime - lastAudioAlertTimeRef.current < AUDIO_ALERT_DEBOUNCE_MS) {
      console.log('⏸️ Audio debounced, menunggu...');
      return;
    }
    
    lastAudioAlertTimeRef.current = currentTime;
    
    console.log('🔊 Memulai audio alert...');
    
    try {
      // Cek apakah Speech Synthesis API tersedia
      if (!('speechSynthesis' in window)) {
        console.warn('Speech Synthesis API tidak tersedia, menggunakan beep fallback');
        playBeepFallback();
        return;
      }
      
      // Cancel any ongoing speech
      window.speechSynthesis.cancel();
      
      // Tunggu sebentar untuk memastikan cancel selesai
      setTimeout(() => {
        try {
          // Buat utterance dengan narasi yang diminta
          const utterance = new SpeechSynthesisUtterance(
            'Mobil non-subsidi terdeteksi. Harap isi Pertamax. Pindah jalur segera.'
          );
          
          // Set properties untuk speech
          utterance.lang = 'id-ID'; // Bahasa Indonesia
          utterance.rate = 1.0; // Kecepatan bicara (0.1 - 10, default 1)
          utterance.pitch = 1.0; // Nada suara (0 - 2, default 1)
          utterance.volume = 1.0; // Volume (0 - 1, default 1)
          
          // Coba gunakan voice Indonesia jika tersedia
          const voices = window.speechSynthesis.getVoices();
          console.log('🔊 Available voices:', voices.length);
          
          const indonesianVoice = voices.find(voice => 
            voice.lang.includes('id') || voice.lang.includes('ID')
          );
          
          if (indonesianVoice) {
            utterance.voice = indonesianVoice;
            console.log('🔊 Using Indonesian voice:', indonesianVoice.name);
          } else {
            // Fallback ke voice default
            const defaultVoice = voices.find(voice => voice.default) || voices[0];
            if (defaultVoice) {
              utterance.voice = defaultVoice;
              console.log('🔊 Using default voice:', defaultVoice.name);
            }
          }
          
          // Event handlers
          utterance.onstart = () => {
            console.log('✅ Audio narasi dimulai');
          };
          
          utterance.onend = () => {
            console.log('✅ Audio narasi selesai');
            // Clear reference setelah selesai
            audioAlertRef.current = null;
          };
          
          utterance.onerror = (event) => {
            console.error('❌ Error pada speech synthesis:', event.error);
            console.error('Error details:', {
              error: event.error,
              type: event.type,
              charIndex: event.charIndex,
              charLength: event.charLength
            });
            // Fallback ke beep jika speech gagal
            playBeepFallback();
          };
          
          // Simpan reference untuk bisa di-cancel jika diperlukan
          audioAlertRef.current = utterance;
          
          // Play speech
          console.log('🔊 Attempting to speak...');
          window.speechSynthesis.speak(utterance);
          
          // Double check setelah 100ms apakah speech benar-benar dimulai
          setTimeout(() => {
            if (window.speechSynthesis.pending || window.speechSynthesis.speaking) {
              console.log('✅ Speech synthesis is active');
            } else {
              console.warn('⚠️ Speech synthesis tidak aktif, mencoba fallback...');
              playBeepFallback();
            }
          }, 100);
          
        } catch (error) {
          console.error('❌ Error dalam setTimeout speech:', error);
          playBeepFallback();
        }
      }, 100);
      
    } catch (error) {
      console.error('❌ Error playing audio alert:', error);
      // Fallback ke beep jika ada error
      playBeepFallback();
    }
  };

  // Fungsi fallback untuk memutar beep jika speech synthesis tidak tersedia
  const playBeepFallback = () => {
    try {
      console.log('🔊 Memutar beep fallback...');
      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      if (!AudioContextClass) {
        console.warn('Web Audio API tidak tersedia');
        return;
      }
      
      const audioContext = new AudioContextClass();
      
      // Resume audio context jika suspended (browser autoplay policy)
      if (audioContext.state === 'suspended') {
        console.log('🔊 AudioContext suspended, attempting to resume...');
        audioContext.resume().then(() => {
          console.log('✅ AudioContext resumed');
          playBeep(audioContext);
        }).catch(err => {
          console.error('❌ Failed to resume AudioContext:', err);
        });
      } else {
        playBeep(audioContext);
      }
      
      function playBeep(ctx) {
        try {
          const oscillator = ctx.createOscillator();
          const gainNode = ctx.createGain();
          
          oscillator.connect(gainNode);
          gainNode.connect(ctx.destination);
          
          oscillator.frequency.value = 800;
          oscillator.type = 'sine';
          
          const now = ctx.currentTime;
          gainNode.gain.setValueAtTime(0.3, now);
          gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.5);
          
          oscillator.start(now);
          oscillator.stop(now + 0.5);
          
          oscillator.onended = () => {
            ctx.close().catch(() => {});
            console.log('✅ Beep selesai');
          };
          
          console.log('✅ Beep dimulai');
        } catch (error) {
          console.error('❌ Error playing beep:', error);
        }
      }
    } catch (error) {
      console.error('❌ Beep fallback juga gagal:', error);
    }
  };
  
  // Simplified tracking for classification model (no bounding box tracking needed)
  const trackDetections = (newDetections) => {
    // For classification model, we just return the detections as-is
    // No need for complex tracking since we're classifying the whole frame
    return newDetections;
  };
  
  /**
   * Draw classification results (for Teachable Machine model)
   */
  const drawDetections = (ctx, detections, width, height) => {
    // Clear canvas
    ctx.clearRect(0, 0, width, height);
    
    if (detections.length === 0) return;
    
    // Get the best detection
    const detection = detections[0];
    const { confidence, class: className, allPredictions } = detection;
    
    // Draw classification label at top center
    const label = `${className}: ${(confidence * 100).toFixed(1)}%`;
    ctx.fillStyle = confidence > 0.8 
      ? 'rgba(0, 255, 0, 0.85)' 
      : confidence > 0.6 
        ? 'rgba(255, 255, 0, 0.85)' 
        : 'rgba(255, 165, 0, 0.85)';
    ctx.font = 'bold 20px Arial';
    const textMetrics = ctx.measureText(label);
    const labelWidth = textMetrics.width + 20;
    const labelHeight = 35;
    const labelX = (width - labelWidth) / 2;
    const labelY = 50;
    
    // Rounded rectangle untuk label
    const radius = 8;
    ctx.beginPath();
    ctx.moveTo(labelX + radius, labelY - labelHeight);
    ctx.lineTo(labelX + labelWidth - radius, labelY - labelHeight);
    ctx.quadraticCurveTo(labelX + labelWidth, labelY - labelHeight, labelX + labelWidth, labelY - labelHeight + radius);
    ctx.lineTo(labelX + labelWidth, labelY);
    ctx.lineTo(labelX, labelY);
    ctx.lineTo(labelX, labelY - labelHeight + radius);
    ctx.quadraticCurveTo(labelX, labelY - labelHeight, labelX + radius, labelY - labelHeight);
    ctx.closePath();
    ctx.fill();
    
    // Draw label text
    ctx.fillStyle = '#000000';
    ctx.fillText(label, labelX + 10, labelY - 12);
    
    // Draw all predictions if available
    if (allPredictions && allPredictions.length > 1) {
      let yOffset = labelY + 20;
      allPredictions.forEach((pred, index) => {
        const predLabel = `${pred.className}: ${(pred.probability * 100).toFixed(1)}%`;
        ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
        ctx.font = '14px Arial';
        ctx.fillText(predLabel, labelX, yOffset);
        yOffset += 20;
      });
    }
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
      
      // Detect using Teachable Machine
      const newDetections = await detectPlatNomor();
      
      // Filter detections dengan confidence > threshold
      const validDetections = newDetections.filter(det => {
        return isValidDetection(det.confidence);
      });
      
      // Track detections (simplified for classification model)
      const smoothedDetections = trackDetections(validDetections);
      smoothedDetectionsRef.current = smoothedDetections;
      
      // Update state hanya untuk detections dengan confidence tinggi (untuk UI)
      if (smoothedDetections.length > 0) {
        setDetections(smoothedDetections);
        
        // Trigger event dengan debounce
        const currentTime = Date.now();
        if (currentTime - lastDetectionTimeRef.current >= DETECTION_DEBOUNCE_MS) {
          lastDetectionTimeRef.current = currentTime;
          
          const highestConfidence = Math.max(...smoothedDetections.map(d => d.confidence));
          
          const detection = smoothedDetections[0];
          console.log('🔔 Detection:', detection.class, 'Confidence:', highestConfidence);
          console.log('📊 All predictions:', detection.allPredictions || []);
          
          // Audio alert untuk Non subsidized car
          if (detection.class === 'Non subsidized car') {
            console.log('🚨 Non subsidized car terdeteksi! Memutar audio alert...');
            console.log('🔊 User interacted:', userInteractedRef.current);
            
            // Pastikan user sudah berinteraksi (untuk browser autoplay policy)
            if (!userInteractedRef.current) {
              console.warn('⚠️ User belum berinteraksi, audio mungkin tidak akan diputar');
              // Tetap coba play, beberapa browser mungkin mengizinkan
            }
            
            playAudioAlert();
          }
          
          if (onPlatDetected) {
            onPlatDetected({
              detections: smoothedDetections,
              confidence: highestConfidence,
              className: detection.class,
              timestamp: new Date().toISOString()
            });
          }
          
          // Show browser notification
          if ('Notification' in window && Notification.permission === 'granted') {
            new Notification('🚗 Detection Result!', {
              body: `${detection.class} terdeteksi dengan confidence ${(highestConfidence * 100).toFixed(1)}%`,
              icon: '/assets/logo_stori-removebg-preview.png',
              tag: 'plat-detection'
            });
          } else if ('Notification' in window && Notification.permission !== 'denied') {
            Notification.requestPermission().then(permission => {
              if (permission === 'granted') {
                new Notification('🚗 Detection Result!', {
                  body: `${detection.class} terdeteksi dengan confidence ${(highestConfidence * 100).toFixed(1)}%`,
                  icon: '/assets/logo_stori-removebg-preview.png',
                  tag: 'plat-detection'
                });
              }
            });
          }
        }
      } else {
        // Jika tidak ada detections, tetap update state untuk clear UI
        setDetections([]);
      }
      
      // Draw detections on overlay canvas dengan smoothing
      if (overlayCanvasRef.current && video.videoWidth > 0 && video.videoHeight > 0) {
        const overlayCtx = overlayCanvasRef.current.getContext('2d', { willReadFrequently: false });
        const overlayCanvas = overlayCanvasRef.current;
        
        // Set canvas size (hanya jika berubah untuk menghindari flicker)
        if (overlayCanvas.width !== video.videoWidth || overlayCanvas.height !== video.videoHeight) {
          overlayCanvas.width = video.videoWidth;
          overlayCanvas.height = video.videoHeight;
        }
        
        // Clear canvas dengan alpha untuk smooth transition (opsional)
        overlayCtx.clearRect(0, 0, overlayCanvas.width, overlayCanvas.height);
        
        // Draw smoothed detections (menggunakan smoothedDetections bukan validDetections)
        if (smoothedDetections.length > 0) {
          drawDetections(overlayCtx, smoothedDetections, overlayCanvas.width, overlayCanvas.height);
        }
        
        // Draw info overlay
        overlayCtx.fillStyle = 'rgba(0, 0, 0, 0.7)';
        overlayCtx.fillRect(10, 10, 300, 60);
        
        overlayCtx.fillStyle = '#00FF00';
        overlayCtx.font = 'bold 18px Arial';
        overlayCtx.fillText('Jenis Mobil Detection Active', 20, 35);
        
        if (validDetections.length > 0) {
          overlayCtx.fillStyle = '#FFFF00';
          const detection = validDetections[0];
          overlayCtx.fillText(`Detected: ${detection.class} (${(detection.confidence * 100).toFixed(1)}%)`, 20, 60);
        } else {
          overlayCtx.fillStyle = '#FFFFFF';
          overlayCtx.fillText('No detection', 20, 60);
        }
      }
      
    } catch (error) {
      console.error('Error in detection loop:', error);
    } finally {
      setIsDetecting(false);
    }
    
    // Continue loop dengan frame rate yang lebih konsisten untuk smoothing
    // Frame rate lebih tinggi = smoothing lebih halus, tapi lebih berat
    const throttleDelay = inputMode === 'video' ? 100 : 150; // Dikurangi untuk smoother tracking
    animationFrameRef.current = requestAnimationFrame(() => {
      setTimeout(detectionLoop, throttleDelay);
    });
  };
  
  // Start camera
  const startCamera = async () => {
    try {
      console.log('Starting Jenis Mobil detection camera...');
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
    
    // Clear detections
    setDetections([]);
    smoothedDetectionsRef.current = [];
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
  
  // Handler untuk user interaction (untuk unlock audio)
  const handleUserInteraction = () => {
    if (!userInteractedRef.current) {
      userInteractedRef.current = true;
      console.log('✅ User interaction detected, audio unlocked');
      
      // Resume AudioContext jika ada yang suspended
      if (audioAlertRef.current && audioAlertRef.current.state === 'suspended') {
        audioAlertRef.current.resume().catch(() => {});
      }
    }
  };
  
  // Request notification permission dan load voices on mount
  useEffect(() => {
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }
    
    // Load voices untuk speech synthesis (beberapa browser perlu ini)
    if ('speechSynthesis' in window) {
      // Chrome memerlukan voices di-load terlebih dahulu
      const loadVoices = () => {
        const voices = window.speechSynthesis.getVoices();
        if (voices.length > 0) {
          console.log('Voices loaded:', voices.length);
        }
      };
      
      // Load voices immediately jika sudah tersedia
      loadVoices();
      
      // Beberapa browser memerlukan event listener
      if (window.speechSynthesis.onvoiceschanged !== undefined) {
        window.speechSynthesis.onvoiceschanged = loadVoices;
      }
    }
    
    // Add event listeners untuk user interaction
    const events = ['click', 'touchstart', 'keydown'];
    events.forEach(event => {
      document.addEventListener(event, handleUserInteraction, { once: true });
    });
    
    return () => {
      events.forEach(event => {
        document.removeEventListener(event, handleUserInteraction);
      });
    };
  }, []);
  
  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopDetection();
      if (uploadedVideo && uploadedVideo.url) {
        URL.revokeObjectURL(uploadedVideo.url);
      }
      // Clear model reference
      if (modelRef.current) {
        modelRef.current = null;
      }
      // Cleanup audio alert
      if (audioAlertRef.current) {
        // Jika speech synthesis, cancel
        if ('speechSynthesis' in window) {
          window.speechSynthesis.cancel();
        }
        // Jika audio context, close
        if (audioAlertRef.current.close) {
          audioAlertRef.current.close().catch(() => {});
        }
        audioAlertRef.current = null;
      }
    };
  }, [uploadedVideo]);
  
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold text-gray-900 flex items-center">
          <Car className="w-5 h-5 mr-2 text-blue-600" />
          Jenis Mobil Detection System
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
        <div className="mb-4 p-3 bg-yellow-100 border border-yellow-400 text-yellow-700 rounded">
          <div className="font-semibold mb-1">ℹ️ Info</div>
          <div className="text-sm">{error}</div>
          <div className="text-xs mt-2 text-yellow-600">
            <strong>Catatan:</strong> Fitur ini menggunakan Teachable Machine Image Model.
            <ul className="list-disc list-inside mt-1 space-y-1">
              <li>Model harus berada di <code>public/model_plat/</code></li>
              <li>File yang diperlukan: <code>model.json</code>, <code>metadata.json</code>, dan <code>weights.bin</code></li>
              <li>Model ini adalah classification model, bukan object detection</li>
            </ul>
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
                  ? 'Klik "Start Detection" untuk memulai deteksi Jenis Mobil'
                  : uploadedVideo
                    ? 'Klik "Start Detection" untuk memulai deteksi Jenis Mobil'
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
            isActive ? (detections.length > 0 ? 'text-green-600' : 'text-blue-600') : 'text-gray-500'
          }`}>
            {isActive ? (detections.length > 0 ? 'Detected' : 'Monitoring') : 'Inactive'}
          </div>
        </div>
        <div className="bg-gray-50 rounded-lg p-3">
          <div className="text-xs text-gray-600 mb-1">Class</div>
          <div className={`text-sm font-medium ${
            detections.length > 0 && detections[0].class === 'Non subsidized car' 
              ? 'text-red-600 font-bold' 
              : 'text-gray-900'
          }`}>
            {detections.length > 0 ? (
              <span className="flex items-center">
                {detections[0].class}
                {detections[0].class === 'Non subsidized car' && (
                  <span className="ml-2 text-red-500 animate-pulse">🔊</span>
                )}
              </span>
            ) : 'N/A'}
          </div>
        </div>
        <div className="bg-gray-50 rounded-lg p-3">
          <div className="text-xs text-gray-600 mb-1">Confidence</div>
          <div className={`text-sm font-medium ${
            detections.length > 0 && detections[0].confidence > 0.8 ? 'text-green-600' :
            detections.length > 0 && detections[0].confidence > 0.6 ? 'text-yellow-600' :
            'text-gray-500'
          }`}>
            {detections.length > 0 ? `${(detections[0].confidence * 100).toFixed(1)}%` : 'N/A'}
          </div>
        </div>
      </div>
      
      {/* Audio Alert Info */}
      {detections.length > 0 && detections[0].class === 'Non subsidized car' && (
        <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
          <div className="flex items-center space-x-2">
            <AlertTriangle className="w-5 h-5 text-red-600" />
            <div>
              <div className="text-sm font-semibold text-red-800">Peringatan: Non subsidized car Terdeteksi!</div>
              <div className="text-xs text-red-600">Audio alert telah diputar</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PlatNomorDetection;

