import React, { useState, useEffect, useRef } from 'react';
import { Thermometer, AlertTriangle, Play, Square, Send, Usb, CheckCircle } from 'lucide-react';

const ThermalDetection = ({ onThermalEvent }) => {
  // States
  const [isActive, setIsActive] = useState(false);
  const isActiveRef = useRef(false);
  const [detectedBrand, setDetectedBrand] = useState(null);
  const [confidence, setConfidence] = useState(0);
  const [temperature, setTemperature] = useState(0);
  const [status, setStatus] = useState('N/A');
  const [isDetecting, setIsDetecting] = useState(false);
  const [error, setError] = useState(null);
  
  // Serial Port States
  const [isSerialConnected, setIsSerialConnected] = useState(false);
  const [arduinoTemperature, setArduinoTemperature] = useState(null); // Suhu dari Arduino
  const [useArduinoTemp, setUseArduinoTemp] = useState(false); // Flag untuk menggunakan suhu Arduino atau simulasi
  
  // Refs
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const overlayCanvasRef = useRef(null);
  const streamRef = useRef(null);
  const modelRef = useRef(null);
  const animationFrameRef = useRef(null);
  const serialPortRef = useRef(null);
  const readerRef = useRef(null);
  const serialReadBufferRef = useRef('');
  
  // History untuk rata-rata
  const tempHistoryRef = useRef([]);
  const brandHistoryRef = useRef([]);
  const statusHistoryRef = useRef([]);
  const lastSendTimeRef = useRef(0);
  const backendConnectionFailedRef = useRef(false);
  
  // Tracking untuk event notification (debounce)
  const lastEventTimeRef = useRef({});
  const EVENT_DEBOUNCE_MS = 10000; // 10 detik - hanya kirim event sekali per 10 detik untuk status yang sama
  
  // Tracking untuk deteksi konsistensi panas dan lonjakan suhu
  const tempTimeHistoryRef = useRef([]); // Array of {temp, timestamp}
  const CONSISTENT_HOT_DURATION = 5000; // 5 detik untuk konsistensi panas
  const TEMP_SPIKE_THRESHOLD = 5; // Lonjakan suhu > 5°C dalam waktu singkat
  
  // Configuration
  const BACKEND_URL = "http://localhost:3000/data";
  const SEND_INTERVAL = 300000; // 5 menit dalam milliseconds
  const MODEL_URL = '/keras_model/model.json'; // Model harus dikonversi ke TensorFlow.js format
  
  // Batas suhu per merek
  const TEMP_LIMITS = {
    "Gilbarco": { 
      min: -20,           // Minimum suhu operasi
      normalMax: 45,      // Batas atas suhu normal
      warning: 45,        // Batas peringatan (>45°C)
      danger: 55          // Batas bahaya/shutdown (>55°C)
    },
    "Tatsuno": { 
      min: -25,           // Minimum suhu operasi
      normalMax: 55,      // Batas atas suhu normal
      warning: 55,        // Batas peringatan (>55°C)
      danger: 65          // Batas bahaya/shutdown (>65°C)
    }
  };
  
  // Load TensorFlow.js model (Keras model yang sudah dikonversi)
  const loadModel = async () => {
    try {
      // Wait for TensorFlow.js to load
      let waitCount = 0;
      while (!window.tf && waitCount < 50) {
        await new Promise(resolve => setTimeout(resolve, 100));
        waitCount++;
      }
      
      if (!window.tf) {
        throw new Error('TensorFlow.js tidak tersedia. Pastikan CDN sudah dimuat di index.html');
      }
      
      console.log('Loading model from:', MODEL_URL);
      
      // Cek apakah model.json bisa diakses
      try {
        const modelCheck = await fetch(MODEL_URL);
        if (!modelCheck.ok) {
          throw new Error(`Model file tidak ditemukan: ${modelCheck.status} ${modelCheck.statusText}. Pastikan file ada di ${MODEL_URL}`);
        }
        console.log('Model file found, loading...');
      } catch (fetchError) {
        console.error('Error checking model file:', fetchError);
        throw new Error(`Tidak dapat mengakses model file: ${fetchError.message}. Pastikan file ada di public/keras_model/model.json`);
      }
      
      // Load model
      console.log('Attempting to load model from:', MODEL_URL);
      console.log('TensorFlow.js version:', window.tf.version);
      
      // Coba load model dengan error handling yang lebih detail
      let model;
      try {
        model = await window.tf.loadLayersModel(MODEL_URL);
        console.log('Model loaded successfully:', model);
        console.log('Model summary:', model.summary());
      } catch (loadError) {
        console.error('Detailed load error:', loadError);
        // Coba dengan path alternatif jika error
        if (loadError.message && loadError.message.includes('weights')) {
          throw new Error(`Error loading weights: ${loadError.message}. Pastikan file weights ada di public/keras_model/weights/`);
        }
        throw loadError;
      }
      
      modelRef.current = model;
      return true;
    } catch (error) {
      console.error('Error loading model:', error);
      console.error('Error details:', {
        message: error.message,
        stack: error.stack,
        modelURL: MODEL_URL
      });
      setError(`Gagal memuat model: ${error.message}. Pastikan model Keras sudah dikonversi ke format TensorFlow.js dan tersedia di public/keras_model/`);
      return false;
    }
  };
  
  // Load labels
  const loadLabels = async () => {
    try {
      const response = await fetch('/keras_model/labels.txt');
      if (!response.ok) throw new Error('Labels file not found');
      const text = await response.text();
      return text.split('\n').filter(line => line.trim());
    } catch (error) {
      console.error('Error loading labels:', error);
      // Fallback labels
      return ['Gilbarco', 'Tatsuno'];
    }
  };
  
  // Simulasi suhu dari RGB
  const calculateTemperatureFromRGB = (imageData) => {
    let R = 0, G = 0, B = 0;
    const pixels = imageData.data;
    const pixelCount = imageData.width * imageData.height;
    
    for (let i = 0; i < pixels.length; i += 4) {
      R += pixels[i];
      G += pixels[i + 1];
      B += pixels[i + 2];
    }
    
    R = R / (pixelCount * 255);
    G = G / (pixelCount * 255);
    B = B / (pixelCount * 255);
    
    const tempValue = 0.6 * R + 0.3 * G + 0.1 * B;
    return 25 + (tempValue * 35); // kisaran 25–60°C
  };
  
  // Connect ke Serial Port Arduino
  const connectSerialPort = async () => {
    try {
      // Check if Web Serial API is supported
      if (!('serial' in navigator)) {
        throw new Error('Web Serial API tidak didukung di browser ini. Gunakan Chrome/Edge terbaru.');
      }

      // Pastikan port sebelumnya ditutup jika ada
      if (serialPortRef.current) {
        try {
          await disconnectSerialPort();
        } catch (e) {
          console.warn('Error closing previous port:', e);
        }
      }

      // Request port access
      const port = await navigator.serial.requestPort();
      
      // Check if port is already open
      if (port.readable || port.writable) {
        throw new Error('Port sudah digunakan. Tutup Arduino IDE Serial Monitor atau aplikasi lain yang menggunakan port ini.');
      }

      serialPortRef.current = port;

      // Open port with baud rate 9600 (sesuai dengan Arduino code)
      // Tambahkan timeout untuk handle port yang tidak responsif
      try {
        await port.open({ baudRate: 9600 });
      } catch (openError) {
        // Jika port gagal dibuka, reset reference
        serialPortRef.current = null;
        
        if (openError.message.includes('Failed to open')) {
          throw new Error('Port tidak dapat dibuka. Pastikan:\n1. Arduino IDE Serial Monitor ditutup\n2. Aplikasi lain tidak menggunakan port yang sama\n3. Port Arduino terhubung dengan benar');
        }
        throw openError;
      }

      setIsSerialConnected(true);
      setError(null);
      setUseArduinoTemp(true);

      // Setup reader
      const reader = port.readable.getReader();
      readerRef.current = reader;

      // Start reading
      readSerialData(reader);

      console.log('✅ Serial port connected');
    } catch (error) {
      console.error('Error connecting to serial port:', error);
      
      // Handle user cancellation
      if (error.name === 'NotFoundError' || error.name === 'SecurityError') {
        setError('Koneksi dibatalkan atau tidak memiliki izin akses port.');
      } else if (error.message.includes('Failed to open')) {
        setError('Port tidak dapat dibuka. Pastikan Arduino IDE Serial Monitor ditutup dan tidak ada aplikasi lain yang menggunakan port ini.');
      } else {
        setError(`Gagal koneksi ke Arduino: ${error.message}`);
      }
      
      setIsSerialConnected(false);
      setUseArduinoTemp(false);
      
      // Cleanup jika ada error
      if (serialPortRef.current) {
        try {
          await serialPortRef.current.close();
        } catch (e) {
          // Ignore cleanup errors
        }
        serialPortRef.current = null;
      }
    }
  };

  // Disconnect dari Serial Port
  const disconnectSerialPort = async () => {
    try {
      // Cancel reader first
      if (readerRef.current) {
        try {
          await readerRef.current.cancel();
        } catch (e) {
          console.warn('Error canceling reader:', e);
        }
        readerRef.current = null;
      }

      // Close port
      if (serialPortRef.current) {
        try {
          // Check if port is still open before closing
          if (serialPortRef.current.readable || serialPortRef.current.writable) {
            await serialPortRef.current.close();
          }
        } catch (e) {
          console.warn('Error closing port:', e);
        }
        serialPortRef.current = null;
      }

      setIsSerialConnected(false);
      setUseArduinoTemp(false);
      setArduinoTemperature(null);
      serialReadBufferRef.current = '';
      console.log('✅ Serial port disconnected');
    } catch (error) {
      console.error('Error disconnecting serial port:', error);
      // Don't set error on disconnect, just log it
      setIsSerialConnected(false);
      setUseArduinoTemp(false);
      setArduinoTemperature(null);
      serialReadBufferRef.current = '';
    }
  };

  // Read data dari Serial Port
  const readSerialData = async (reader) => {
    try {
      while (true) {
        const { value, done } = await reader.read();
        
        if (done) {
          console.log('Serial port reader done');
          break;
        }

        // Convert Uint8Array to string
        const text = new TextDecoder().decode(value);
        serialReadBufferRef.current += text;

        // Parse data suhu dari buffer (immediate update, no delay)
        parseArduinoTemperature();
      }
    } catch (error) {
      console.error('Error reading serial data:', error);
      if (error.name !== 'NetworkError') {
        setError(`Error membaca data: ${error.message}`);
        disconnectSerialPort();
      }
    }
  };

  // Parse suhu dari data Arduino
  // Format yang didukung:
  // - "Suhu Objek : XX.XX °C" (Format Indonesia)
  // - "Object Temperature: XX.XX °C" (Format Inggris)
  // - "Temperature: XX.XX °C" (Format alternatif)
  // - "Temp: XX.XX °C" (Format singkat)
  // - "XX.XX °C" (Format minimal)
  const parseArduinoTemperature = () => {
    const buffer = serialReadBufferRef.current;
    
    // Debug: log buffer jika ada data baru (hanya log jika buffer cukup panjang atau ada newline)
    if (buffer.length > 0 && (buffer.includes('\n') || buffer.length > 20)) {
      console.log('📥 Buffer data dari Arduino:', JSON.stringify(buffer));
    }
    
    // Cari pattern "Object Temperature: " diikuti angka (bisa ada spasi atau tidak)
    // Pattern lebih fleksibel untuk handle berbagai format
    // Mencari pattern dengan atau tanpa "°C |" di depan
    const patterns = [
      /Suhu Objek\s*:\s*([\d.]+)\s*°C/i,        // Format Indonesia: "Suhu Objek : XX.XX °C"
      /Object Temperature:\s*([\d.]+)\s*°C/i,    // Format: "Object Temperature: XX.XX °C"
      /Temperature:\s*([\d.]+)\s*°C/i,           // Format alternatif: "Temperature: XX.XX °C"
      /Temp:\s*([\d.]+)\s*°C/i,                  // Format singkat: "Temp: XX.XX °C"
      /([\d.]+)\s*°C/i                            // Format minimal: "XX.XX °C" (fallback)
    ];
    
    let tempMatch = null;
    for (const pattern of patterns) {
      tempMatch = buffer.match(pattern);
      if (tempMatch) {
        console.log('✅ Pattern matched:', pattern.toString());
        break;
      }
    }
    
    if (tempMatch) {
      const tempValue = parseFloat(tempMatch[1]);
      if (!isNaN(tempValue) && tempValue > -50 && tempValue < 150) {
        const currentTime = Date.now();
        
        // Update kedua state secara langsung untuk immediate UI update
        setArduinoTemperature(tempValue);
        if (useArduinoTemp) {
          setTemperature(tempValue); // Langsung update temperature state untuk immediate render
          
          // Update status secara real-time berdasarkan temperature dan brand yang terdeteksi
          // Gunakan brand terakhir yang terdeteksi, atau default jika belum ada
          const currentBrand = detectedBrand || 'Gilbarco'; // Default ke Gilbarco jika belum ada brand
          const statusInfo = getTemperatureStatus(tempValue, currentBrand);
          setStatus(statusInfo.status);
          
          // Track temperature history untuk deteksi konsistensi dan lonjakan
          tempTimeHistoryRef.current.push({ temp: tempValue, timestamp: currentTime });
          
          // Hapus data yang lebih dari 10 detik (untuk efisiensi)
          const tenSecondsAgo = currentTime - 10000;
          tempTimeHistoryRef.current = tempTimeHistoryRef.current.filter(
            entry => entry.timestamp > tenSecondsAgo
          );
          
          // Deteksi kondisi untuk trigger event
          checkTemperatureAnomaly(tempValue, currentBrand, currentTime);
        }
        console.log('🌡️ Suhu dari Arduino:', tempValue, '°C');
        
        // Clear buffer setelah parsing (hapus sampai setelah pattern yang ditemukan)
        const matchEnd = tempMatch.index + tempMatch[0].length;
        serialReadBufferRef.current = buffer.substring(matchEnd);
      }
    } else {
      // Jika tidak ada match, cek apakah buffer terlalu panjang (reset jika > 1000 chars)
      // Atau jika ada newline, hapus sampai newline
      if (buffer.length > 1000) {
        serialReadBufferRef.current = '';
      } else if (buffer.includes('\n')) {
        // Hapus sampai newline terakhir jika tidak ada match
        const lastNewline = buffer.lastIndexOf('\n');
        if (lastNewline > 0) {
          serialReadBufferRef.current = buffer.substring(lastNewline + 1);
        }
      }
    }
  };

  // Helper function untuk menampilkan browser notification
  const showBrowserNotification = (title, body, tag) => {
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification(title, {
        body: body,
        icon: '/assets/logo_stori-removebg-preview.png',
        tag: tag || 'thermal-alert',
        requireInteraction: false
      });
    } else if ('Notification' in window && Notification.permission !== 'denied') {
      // Request permission
      Notification.requestPermission().then(permission => {
        if (permission === 'granted') {
          new Notification(title, {
            body: body,
            icon: '/assets/logo_stori-removebg-preview.png',
            tag: tag || 'thermal-alert',
            requireInteraction: false
          });
        }
      });
    }
  };

  // Deteksi anomaly suhu (konsistensi panas atau lonjakan)
  const checkTemperatureAnomaly = (currentTemp, brand, currentTime) => {
    if (!onThermalEvent) return;
    
    const limits = TEMP_LIMITS[brand] || { min: 0, normalMax: 45, warning: 45, danger: 50 };
    const { normalMax, warning, danger } = limits;
    
    // Deteksi 0: Suhu berada pada maksimum ± 10% selama 5 detik
    const maxTemp = normalMax;
    const tenPercent = maxTemp * 0.1;
    const maxTempMin = maxTemp - tenPercent;
    const maxTempMax = maxTemp + tenPercent;
    const isNearMaxTemp = currentTemp >= maxTempMin && currentTemp <= maxTempMax;
    
    if (isNearMaxTemp) {
      const history = tempTimeHistoryRef.current;
      if (history.length >= 5) {
        const fiveSecondsAgo = currentTime - CONSISTENT_HOT_DURATION;
        const recentHistory = history.filter(entry => entry.timestamp >= fiveSecondsAgo);
        
        if (recentHistory.length >= 5) {
          // Cek apakah semua data dalam 5 detik terakhir berada dalam range maksimum ± 10%
          const allNearMaxTemp = recentHistory.every(entry => 
            entry.temp >= maxTempMin && entry.temp <= maxTempMax
          );
          
          if (allNearMaxTemp) {
            const eventKey = `${brand}-near-max-temp`;
            const lastEventTime = lastEventTimeRef.current[eventKey] || 0;
            
            // Hanya trigger sekali per 5 detik
            if (currentTime - lastEventTime >= CONSISTENT_HOT_DURATION) {
              lastEventTimeRef.current[eventKey] = currentTime;
              
              // Show browser notification
              showBrowserNotification(
                '⚠️ Warning: Suhu Mendekati Maksimum',
                `Suhu ${currentTemp.toFixed(1)}°C berada pada maksimum ± 10% (${maxTempMin.toFixed(1)}°C - ${maxTempMax.toFixed(1)}°C) selama 5 detik - ${brand}`,
                'thermal-warning-near-max'
              );
              
              console.log('🔥 Thermal event triggered (near-max):', { temperature: currentTemp, status: 'WARNING', brand });
              if (onThermalEvent) {
                onThermalEvent({
                  temperature: currentTemp,
                  status: 'WARNING',
                  brand: brand || 'Unknown',
                  confidence: confidence || 0,
                  reason: `Suhu berada pada maksimum ± 10% (${maxTempMin.toFixed(1)}°C - ${maxTempMax.toFixed(1)}°C) selama 5 detik`
                });
              } else {
                console.error('❌ onThermalEvent is not defined!');
              }
              return;
            }
          }
        }
      }
    }
    
    // Cek apakah suhu melebihi batas warning atau danger
    const isOverWarning = currentTemp > warning;
    const isOverDanger = currentTemp > danger;
    
    if (!isOverWarning && !isOverDanger) {
      return; // Suhu masih normal, tidak perlu event
    }
    
    const status = isOverDanger ? 'DANGER' : 'WARNING';
    const history = tempTimeHistoryRef.current;
    
    // Deteksi langsung: Kirim event segera ketika suhu melewati threshold
    // (tanpa menunggu konsistensi 5 detik)
    const immediateEventKey = `${brand}-${status}-immediate`;
    const lastImmediateEventTime = lastEventTimeRef.current[immediateEventKey] || 0;
    
    // Kirim event langsung dengan debounce 2 detik (untuk DANGER) atau 3 detik (untuk WARNING)
    const debounceTime = status === 'DANGER' ? 2000 : 3000;
    
    if (currentTime - lastImmediateEventTime >= debounceTime) {
      // Kirim event langsung
      lastEventTimeRef.current[immediateEventKey] = currentTime;
      
      // Show browser notification
      const notificationTitle = status === 'DANGER' 
        ? '🚨 DANGER: Komponen Overheat!' 
        : '⚠️ WARNING: Suhu Tinggi Terdeteksi';
      const notificationBody = status === 'DANGER'
        ? `Suhu ${currentTemp.toFixed(1)}°C melebihi batas bahaya (${danger}°C) untuk ${brand}. TINDAKAN SEGERA DIPERLUKAN!`
        : `Suhu ${currentTemp.toFixed(1)}°C melebihi batas peringatan (${warning}°C) untuk ${brand}.`;
      
      showBrowserNotification(
        notificationTitle,
        notificationBody,
        `thermal-${status.toLowerCase()}-immediate`
      );
      
      console.log('🔥 Thermal event triggered:', { temperature: currentTemp, status, brand, confidence: confidence || 0 });
      if (onThermalEvent) {
        onThermalEvent({
          temperature: currentTemp,
          status: status,
          brand: brand || 'Unknown', // Pastikan brand selalu ada
          confidence: confidence || 0,
          reason: `Suhu melebihi batas ${status === 'DANGER' ? 'bahaya' : 'peringatan'}`
        });
      } else {
        console.error('❌ onThermalEvent is not defined!');
      }
    }
    
    if (history.length < 2) {
      return; // Belum cukup data untuk analisis konsistensi/lonjakan
    }
    
    // Deteksi 1: Konsistensi panas (suhu konsisten panas selama 5 detik)
    const fiveSecondsAgo = currentTime - CONSISTENT_HOT_DURATION;
    const recentHistory = history.filter(entry => entry.timestamp >= fiveSecondsAgo);
    
    if (recentHistory.length >= 5) { // Minimal 5 data point dalam 5 detik
      const allOverThreshold = recentHistory.every(entry => 
        isOverDanger ? entry.temp > danger : entry.temp > warning
      );
      
      if (allOverThreshold) {
        const eventKey = `${brand}-${status}-consistent`;
        const lastEventTime = lastEventTimeRef.current[eventKey] || 0;
        
        // Hanya trigger sekali per 5 detik untuk konsistensi
        if (currentTime - lastEventTime >= CONSISTENT_HOT_DURATION) {
          lastEventTimeRef.current[eventKey] = currentTime;
          
          // Show browser notification
          const notificationTitle = status === 'DANGER' 
            ? '🚨 DANGER: Komponen Overheat!' 
            : '⚠️ WARNING: Suhu Tinggi Terdeteksi';
          const notificationBody = status === 'DANGER'
            ? `Suhu ${currentTemp.toFixed(1)}°C melebihi batas bahaya (${danger}°C) untuk ${brand}. Komponen konsisten panas selama 5 detik. TINDAKAN SEGERA DIPERLUKAN!`
            : `Suhu ${currentTemp.toFixed(1)}°C melebihi batas peringatan (${warning}°C) untuk ${brand}. Komponen konsisten panas selama 5 detik.`;
          
          showBrowserNotification(
            notificationTitle,
            notificationBody,
            `thermal-${status.toLowerCase()}-consistent`
          );
          
          console.log('🔥 Thermal event triggered (consistent):', { temperature: currentTemp, status, brand });
          if (onThermalEvent) {
            onThermalEvent({
              temperature: currentTemp,
              status: status,
              brand: brand || 'Unknown',
              confidence: confidence || 0, // Gunakan confidence dari state atau default 0
              reason: 'Suhu konsisten panas selama 5 detik'
            });
          } else {
            console.error('❌ onThermalEvent is not defined!');
          }
          return;
        }
      }
    }
    
    // Deteksi 2: Lonjakan suhu tiba-tiba (spike > 5°C dalam waktu singkat)
    if (history.length >= 2) {
      const previousTemp = history[history.length - 2].temp;
      const tempChange = currentTemp - previousTemp;
      const timeDiff = currentTime - history[history.length - 2].timestamp;
      
      // Lonjakan > 5°C dalam waktu < 2 detik
      if (tempChange > TEMP_SPIKE_THRESHOLD && timeDiff < 2000 && isOverWarning) {
        const eventKey = `${brand}-${status}-spike`;
        const lastEventTime = lastEventTimeRef.current[eventKey] || 0;
        
        // Hanya trigger sekali per 3 detik untuk lonjakan
        if (currentTime - lastEventTime >= 3000) {
          lastEventTimeRef.current[eventKey] = currentTime;
          
          // Show browser notification
          const notificationTitle = status === 'DANGER' 
            ? '🚨 DANGER: Lonjakan Suhu Drastis!' 
            : '⚠️ WARNING: Lonjakan Suhu Terdeteksi';
          const notificationBody = status === 'DANGER'
            ? `Lonjakan suhu drastis pada ${brand}: +${tempChange.toFixed(1)}°C dalam ${(timeDiff / 1000).toFixed(1)} detik. Suhu saat ini ${currentTemp.toFixed(1)}°C melebihi batas bahaya (${danger}°C). TINDAKAN SEGERA DIPERLUKAN!`
            : `Lonjakan suhu pada ${brand}: +${tempChange.toFixed(1)}°C dalam ${(timeDiff / 1000).toFixed(1)} detik. Suhu saat ini ${currentTemp.toFixed(1)}°C melebihi batas peringatan (${warning}°C).`;
          
          showBrowserNotification(
            notificationTitle,
            notificationBody,
            `thermal-${status.toLowerCase()}-spike`
          );
          
          console.log('🔥 Thermal event triggered (spike):', { temperature: currentTemp, status, brand });
          if (onThermalEvent) {
            onThermalEvent({
              temperature: currentTemp,
              status: status,
              brand: brand || 'Unknown',
              confidence: confidence || 0, // Gunakan confidence dari state atau default 0
              reason: `Lonjakan suhu tiba-tiba: +${tempChange.toFixed(1)}°C dalam ${(timeDiff / 1000).toFixed(1)} detik`
            });
          } else {
            console.error('❌ onThermalEvent is not defined!');
          }
          return;
        }
      }
    }
  };

  // Tentukan status berdasarkan suhu dan merek
  const getTemperatureStatus = (temp, brand) => {
    const limits = TEMP_LIMITS[brand] || { min: 0, normalMax: 45, warning: 45, danger: 50 };
    const { min, normalMax, warning, danger } = limits;
    
    if (temp < min) {
      // Suhu di bawah minimum operasi
      return { status: 'TOO COLD', color: '#FFFFFF' };
    } else if (temp <= normalMax) {
      // Suhu dalam range normal (min hingga normalMax)
      return { status: 'NORMAL', color: '#00FF00' };
    } else if (temp <= danger) {
      // Suhu melebihi normalMax tapi belum mencapai danger
      // Untuk Gilbarco: >45°C hingga ≤55°C = WARNING
      // Untuk Tatsuno: >55°C hingga ≤65°C = WARNING
      return { status: 'WARNING', color: '#FFA500' };
    } else {
      // Suhu melebihi batas danger (shutdown)
      // Untuk Gilbarco: >55°C = DANGER
      // Untuk Tatsuno: >65°C = DANGER
      return { status: 'DANGER', color: '#FF0000' };
    }
  };
  
  // Visualisasi heatmap
  const drawHeatmap = (imageData) => {
    const data = new Uint8ClampedArray(imageData.data);
    
    // Buat heatmap dari channel R (red)
    for (let i = 0; i < data.length; i += 4) {
      const R = data[i];
      // Konversi ke heatmap color (JET colormap approximation)
      const intensity = R / 255;
      
      // JET colormap: blue -> cyan -> green -> yellow -> red
      let r, g, b;
      if (intensity < 0.25) {
        // Blue to Cyan
        const t = intensity / 0.25;
        r = 0;
        g = Math.floor(t * 255);
        b = 255;
      } else if (intensity < 0.5) {
        // Cyan to Green
        const t = (intensity - 0.25) / 0.25;
        r = 0;
        g = 255;
        b = Math.floor((1 - t) * 255);
      } else if (intensity < 0.75) {
        // Green to Yellow
        const t = (intensity - 0.5) / 0.25;
        r = Math.floor(t * 255);
        g = 255;
        b = 0;
      } else {
        // Yellow to Red
        const t = (intensity - 0.75) / 0.25;
        r = 255;
        g = Math.floor((1 - t) * 255);
        b = 0;
      }
      
      data[i] = r;
      data[i + 1] = g;
      data[i + 2] = b;
    }
    
    return new ImageData(data, imageData.width, imageData.height);
  };
  
  // Prediksi brand dari frame
  const predictBrand = async () => {
    if (!modelRef.current || !videoRef.current) return null;
    
    try {
      // Resize dan normalisasi gambar
      const tempCanvas = document.createElement('canvas');
      tempCanvas.width = 224;
      tempCanvas.height = 224;
      const tempCtx = tempCanvas.getContext('2d', { willReadFrequently: true });
      tempCtx.drawImage(videoRef.current, 0, 0, 224, 224);
      
      // Konversi ke tensor
      const imageTensor = window.tf.browser.fromPixels(tempCanvas);
      const normalized = imageTensor.div(127.5).sub(1);
      const batched = normalized.expandDims(0);
      
      // Prediksi
      const prediction = await modelRef.current.predict(batched).data();
      const predictionArray = Array.from(prediction);
      const index = predictionArray.indexOf(Math.max(...predictionArray));
      const confidenceValue = prediction[index] * 100;
      
      // Load labels
      const labels = await loadLabels();
      const brand = labels[index] ? labels[index].trim() : 'Unknown';
      
      // Cleanup tensors
      imageTensor.dispose();
      normalized.dispose();
      batched.dispose();
      
      return { brand, confidence: confidenceValue };
    } catch (error) {
      console.error('Error predicting:', error);
      return null;
    }
  };
  
  // Kirim data ke backend
  const sendDataToBackend = async (forceSend = false) => {
    // Skip jika backend sudah diketahui tidak tersedia (kecuali forceSend)
    if (!forceSend && backendConnectionFailedRef.current) {
      return;
    }
    
    const currentTime = Date.now();
    const shouldSend = forceSend || 
                      (currentTime - lastSendTimeRef.current >= SEND_INTERVAL) ||
                      (status === 'DANGER');
    
    if (!shouldSend || tempHistoryRef.current.length === 0) return;
    
    try {
      const avgTemp = tempHistoryRef.current.reduce((a, b) => a + b, 0) / tempHistoryRef.current.length;
      
      // Most common brand
      const brandCounts = {};
      brandHistoryRef.current.forEach(b => {
        brandCounts[b] = (brandCounts[b] || 0) + 1;
      });
      const mostCommonBrand = Object.keys(brandCounts).reduce((a, b) => 
        brandCounts[a] > brandCounts[b] ? a : b
      );
      
      // Most common status
      const statusCounts = {};
      statusHistoryRef.current.forEach(s => {
        statusCounts[s] = (statusCounts[s] || 0) + 1;
      });
      const mostCommonStatus = Object.keys(statusCounts).reduce((a, b) => 
        statusCounts[a] > statusCounts[b] ? a : b
      );
      
      const payload = {
        class: mostCommonBrand,
        average_temperature: Math.round(avgTemp * 100) / 100,
        status: mostCommonStatus,
        timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19)
      };
      
      // Create AbortController for timeout
      const controller = new AbortController();
      let timeoutId = setTimeout(() => controller.abort(), 3000); // 3 second timeout
      
      try {
        const response = await fetch(BACKEND_URL, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(payload),
          signal: controller.signal
        });
        
        clearTimeout(timeoutId);
        
        if (response.ok) {
          console.log('📤 Data terkirim:', payload);
          backendConnectionFailedRef.current = false; // Reset on success
          lastSendTimeRef.current = currentTime;
          
          // Clear history setelah kirim
          tempHistoryRef.current = [];
          brandHistoryRef.current = [];
          statusHistoryRef.current = [];
        } else {
          if (!backendConnectionFailedRef.current) {
            console.warn('⚠️ Backend response error:', response.statusText);
            backendConnectionFailedRef.current = true;
          }
        }
      } catch (fetchError) {
        clearTimeout(timeoutId);
        throw fetchError; // Re-throw to outer catch
      }
    } catch (error) {
      // Only log connection errors once to avoid spam
      if (!backendConnectionFailedRef.current) {
        if (error.name === 'AbortError') {
          console.warn('⚠️ Backend request timeout (backend mungkin tidak tersedia)');
        } else if (error.message && (error.message.includes('Failed to fetch') || error.message.includes('ERR_CONNECTION_REFUSED'))) {
          console.warn('⚠️ Backend tidak tersedia di', BACKEND_URL, '(ini normal jika backend belum dijalankan)');
        } else {
          console.warn('⚠️ Gagal kirim ke backend:', error.message || error);
        }
        backendConnectionFailedRef.current = true;
      }
      // Don't throw error, just silently fail - detection loop should continue
      // Error sudah di-handle, tidak perlu di-log lagi
    }
  };
  
  // Main detection loop
  const detectionLoop = async () => {
    // Use ref instead of state to avoid race condition
    if (!isActiveRef.current) {
      console.log('Detection loop stopped: isActiveRef is false');
      return;
    }
    if (!videoRef.current) {
      console.log('Detection loop stopped: videoRef is null');
      return;
    }
    if (!canvasRef.current) {
      console.log('Detection loop stopped: canvasRef is null');
      return;
    }
    
    // Check if video is ready
    const video = videoRef.current;
    if (!video || video.readyState < 2) {
      console.log('Video not ready, waiting... readyState:', video?.readyState);
      animationFrameRef.current = requestAnimationFrame(() => {
        setTimeout(detectionLoop, 100);
      });
      return;
    }
    
    // Check video dimensions
    if (!video.videoWidth || !video.videoHeight) {
      console.log('Video dimensions not available yet, waiting...');
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
      
      // Gunakan suhu dari Arduino jika tersedia, jika tidak gunakan simulasi RGB
      let temp;
      if (useArduinoTemp && arduinoTemperature !== null) {
        // Gunakan suhu terbaru dari Arduino (sudah di-update real-time)
        temp = arduinoTemperature;
        // Temperature state sudah di-update di parseArduinoTemperature, tidak perlu set lagi
      } else {
        // Calculate temperature from RGB (fallback)
        temp = calculateTemperatureFromRGB(imageData);
        setTemperature(temp);
      }
      
      // Predict brand
      const prediction = await predictBrand();
      
      // Gunakan brand yang terdeteksi atau default
      const currentBrand = (prediction && prediction.confidence >= 80) ? prediction.brand : (detectedBrand || 'Gilbarco');
      const currentConfidence = (prediction && prediction.confidence >= 80) ? prediction.confidence : confidence;
      
      if (prediction && prediction.confidence >= 80) {
        setDetectedBrand(prediction.brand);
        setConfidence(prediction.confidence);
      }
      
      // Get status menggunakan suhu yang sudah ditentukan (Arduino atau simulasi)
      const statusInfo = getTemperatureStatus(temp, currentBrand);
      setStatus(statusInfo.status);
      
      // Add to history
      tempHistoryRef.current.push(temp);
      brandHistoryRef.current.push(currentBrand);
      statusHistoryRef.current.push(statusInfo.status);
      
      // Limit history size
      if (tempHistoryRef.current.length > 1500) {
        tempHistoryRef.current.shift();
        brandHistoryRef.current.shift();
        statusHistoryRef.current.shift();
      }
      
      // Notify parent component jika ada warning/danger
      // Untuk simulasi RGB, kirim event langsung ketika suhu melewati threshold
      if (onThermalEvent && (statusInfo.status === 'WARNING' || statusInfo.status === 'DANGER' || statusInfo.status === 'TOO COLD')) {
        const eventKey = `${currentBrand}-${statusInfo.status}`;
        const currentTime = Date.now();
        const lastEventTime = lastEventTimeRef.current[eventKey] || 0;
        
        // Kirim event langsung dengan debounce lebih pendek (2 detik) untuk respons cepat
        // Tapi tetap ada debounce untuk menghindari spam
        const debounceTime = statusInfo.status === 'DANGER' ? 2000 : 3000; // DANGER lebih cepat
        
        if (currentTime - lastEventTime >= debounceTime) {
          lastEventTimeRef.current[eventKey] = currentTime;
          
          // Show browser notification untuk kasus simulasi RGB (jika tidak menggunakan Arduino)
          // Untuk Arduino, notifikasi sudah ditangani di checkTemperatureAnomaly
          if (!useArduinoTemp || arduinoTemperature === null) {
            const limits = TEMP_LIMITS[currentBrand] || { min: 0, normalMax: 45, warning: 45, danger: 50 };
            const { warning, danger } = limits;
            
            let notificationTitle, notificationBody;
            if (statusInfo.status === 'DANGER') {
              notificationTitle = '🚨 DANGER: Komponen Overheat!';
              notificationBody = `Suhu ${temp.toFixed(1)}°C melebihi batas bahaya (${danger}°C) untuk ${currentBrand}. TINDAKAN SEGERA DIPERLUKAN!`;
            } else if (statusInfo.status === 'WARNING') {
              notificationTitle = '⚠️ WARNING: Suhu Tinggi Terdeteksi';
              notificationBody = `Suhu ${temp.toFixed(1)}°C melebihi batas peringatan (${warning}°C) untuk ${currentBrand}.`;
            } else if (statusInfo.status === 'TOO COLD') {
              notificationTitle = '❄️ WARNING: Suhu Terlalu Rendah';
              notificationBody = `Suhu ${temp.toFixed(1)}°C di bawah minimum operasi untuk ${currentBrand}.`;
            }
            
            if (notificationTitle && notificationBody) {
              showBrowserNotification(
                notificationTitle,
                notificationBody,
                `thermal-${statusInfo.status.toLowerCase()}-detection`
              );
            }
          }
          
          console.log('🔥 Thermal event triggered (RGB):', { temperature: temp, status: statusInfo.status, brand: currentBrand, confidence: currentConfidence });
          if (onThermalEvent) {
            onThermalEvent({
              temperature: temp,
              status: statusInfo.status,
              brand: currentBrand || 'Unknown', // Pastikan brand selalu ada
              confidence: currentConfidence || 0,
              reason: `Suhu melebihi batas ${statusInfo.status === 'DANGER' ? 'bahaya' : statusInfo.status === 'WARNING' ? 'peringatan' : 'minimum'}`
            });
          } else {
            console.error('❌ onThermalEvent is not defined!');
          }
        }
      }
      
      // Check if should send to backend
      await sendDataToBackend();
      
      // Jika tidak ada prediction atau confidence rendah
      if (!prediction || prediction.confidence < 80) {
        setDetectedBrand('No Dispenser');
        setConfidence(prediction ? prediction.confidence : 0);
        setStatus('N/A');
        setTemperature(0);
      }
      
      // Draw heatmap overlay
      if (overlayCanvasRef.current && video.videoWidth > 0 && video.videoHeight > 0) {
        const overlayCtx = overlayCanvasRef.current.getContext('2d', { willReadFrequently: true });
        const overlayCanvas = overlayCanvasRef.current;
        
        // Set canvas dimensions
        overlayCanvas.width = video.videoWidth;
        overlayCanvas.height = video.videoHeight;
        
        // Clear canvas first
        overlayCtx.clearRect(0, 0, overlayCanvas.width, overlayCanvas.height);
        
        // Draw video frame directly to overlay canvas first
        overlayCtx.drawImage(video, 0, 0, overlayCanvas.width, overlayCanvas.height);
        
        // Apply heatmap
        const heatmapData = overlayCtx.getImageData(0, 0, overlayCanvas.width, overlayCanvas.height);
        const heatmapProcessed = drawHeatmap(heatmapData);
        overlayCtx.putImageData(heatmapProcessed, 0, 0);
        
        // Blend with original video (60% original, 40% heatmap)
        overlayCtx.globalAlpha = 0.6;
        overlayCtx.drawImage(video, 0, 0, overlayCanvas.width, overlayCanvas.height);
        overlayCtx.globalAlpha = 1.0;
        
        // Draw info overlay
        overlayCtx.fillStyle = 'rgba(0, 0, 0, 0.7)';
        overlayCtx.fillRect(10, 10, 490, 90);
        
        if (detectedBrand && detectedBrand !== 'No Dispenser') {
          overlayCtx.fillStyle = '#00FF00';
          overlayCtx.font = 'bold 20px Arial';
          overlayCtx.fillText(`${detectedBrand} | ${confidence.toFixed(1)}%`, 20, 35);
          
          overlayCtx.fillStyle = '#FFFF00';
          overlayCtx.fillText(`Temp: ${temp.toFixed(1)}°C`, 20, 65);
          
          const statusInfo = getTemperatureStatus(temp, detectedBrand);
          overlayCtx.fillStyle = statusInfo.color;
          overlayCtx.fillText(`Status: ${statusInfo.status}`, 20, 95);
        }
      }
      
    } catch (error) {
      console.error('Error in detection loop:', error);
    } finally {
      setIsDetecting(false);
    }
    
    // Continue loop
    animationFrameRef.current = requestAnimationFrame(() => {
      setTimeout(detectionLoop, 100); // ~10 FPS
    });
  };
  
  // Start camera
  const startCamera = async () => {
    try {
      console.log('Starting camera...');
      setError(null);
      
      // Load model first
      console.log('Loading model...');
      const modelLoaded = await loadModel();
      if (!modelLoaded) {
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
      
      console.log('Camera access granted, stream:', stream);
      streamRef.current = stream;
      
      // Wait a bit untuk memastikan videoRef sudah ter-render
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
            
            // Wait for metadata
            const onLoadedMetadata = () => {
              console.log('Video metadata loaded, dimensions:', video.videoWidth, 'x', video.videoHeight);
              video.removeEventListener('loadedmetadata', onLoadedMetadata);
              resolve();
            };
            
            video.addEventListener('loadedmetadata', onLoadedMetadata);
            
            // Also try to play
            video.play().then(() => {
              console.log('Video playing');
              // If metadata already loaded, resolve immediately
              if (video.readyState >= 2) {
                video.removeEventListener('loadedmetadata', onLoadedMetadata);
                resolve();
              }
            }).catch((err) => {
              console.error('Error playing video:', err);
              // Continue anyway after a delay
              setTimeout(() => {
                video.removeEventListener('loadedmetadata', onLoadedMetadata);
                resolve();
              }, 500);
            });
            
            // Timeout fallback
            setTimeout(() => {
              video.removeEventListener('loadedmetadata', onLoadedMetadata);
              resolve();
            }, 2000);
          } else {
            resolve();
          }
        });
        
        // Wait a bit more for video to actually start streaming
        await new Promise(resolve => setTimeout(resolve, 200));
        
        console.log('Video ready, setting isActive to true');
        console.log('Video dimensions:', videoRef.current?.videoWidth, 'x', videoRef.current?.videoHeight);
        
        // Set both state and ref
        isActiveRef.current = true;
        setIsActive(true);
        
        // Start detection loop after a short delay
        setTimeout(() => {
          console.log('Starting detection loop... isActiveRef:', isActiveRef.current);
          detectionLoop();
        }, 300);
      } else {
        console.error('videoRef.current is null after retries!');
        throw new Error('Video element tidak ditemukan setelah beberapa kali percobaan');
      }
    } catch (error) {
      console.error('Error starting camera:', error);
      console.error('Error stack:', error.stack);
      setError(`Gagal mengakses kamera: ${error.message}`);
      isActiveRef.current = false;
      setIsActive(false); // Pastikan isActive di-reset jika error
    }
  };
  
  // Stop camera
  const stopCamera = () => {
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
      videoRef.current.srcObject = null;
    }
    
    // Send remaining data before stopping
    sendDataToBackend(true);
    
    setDetectedBrand(null);
    setConfidence(0);
    setTemperature(0);
    setStatus('N/A');
  };
  
  // Update temperature dan status state saat arduinoTemperature berubah (backup update)
  // Note: Primary update sudah dilakukan di parseArduinoTemperature untuk immediate response
  useEffect(() => {
    if (useArduinoTemp && arduinoTemperature !== null) {
      setTemperature(arduinoTemperature);
      
      // Update status berdasarkan temperature terbaru dan brand yang terdeteksi
      const currentBrand = detectedBrand || 'Gilbarco'; // Default ke Gilbarco jika belum ada brand
      const statusInfo = getTemperatureStatus(arduinoTemperature, currentBrand);
      setStatus(statusInfo.status);
    }
  }, [arduinoTemperature, useArduinoTemp, detectedBrand]);

  // Request notification permission on mount
  useEffect(() => {
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopCamera();
      // Disconnect serial port on unmount
      if (serialPortRef.current) {
        disconnectSerialPort();
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold text-gray-900 flex items-center">
          <Thermometer className="w-5 h-5 mr-2 text-orange-600" />
          SPBU Heat Detection System
        </h2>
        <div className="flex items-center space-x-2">
          {/* Serial Port Connection Button */}
          {!isSerialConnected ? (
            <button
              onClick={connectSerialPort}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center space-x-2"
              title="Connect ke Arduino via Serial Port"
            >
              <Usb className="w-4 h-4" />
              <span>Connect Arduino</span>
            </button>
          ) : (
            <button
              onClick={disconnectSerialPort}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center space-x-2"
              title="Disconnect dari Arduino"
            >
              <CheckCircle className="w-4 h-4" />
              <span>Arduino Connected</span>
            </button>
          )}
          
          {!isActive ? (
            <button
              onClick={startCamera}
              className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 flex items-center space-x-2"
            >
              <Play className="w-4 h-4" />
              <span>Start Detection</span>
            </button>
          ) : (
            <button
              onClick={stopCamera}
              className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 flex items-center space-x-2"
            >
              <Square className="w-4 h-4" />
              <span>Stop Detection</span>
            </button>
          )}
        </div>
      </div>
      
      {/* Arduino Connection Status */}
      {isSerialConnected && (
        <div className="mb-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded flex items-center space-x-2">
          <Usb className="w-4 h-4" />
          <span className="text-sm">
            Arduino terhubung {arduinoTemperature !== null ? `- Suhu: ${arduinoTemperature.toFixed(1)}°C` : '- Menunggu data...'}
          </span>
        </div>
      )}
      
      {error && (
        <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
          <div className="font-semibold mb-1">⚠️ Error Koneksi Arduino</div>
          <div className="text-sm whitespace-pre-line">{error}</div>
          <div className="text-xs mt-2 text-red-600">
            <strong>Tips untuk mengatasi:</strong>
            <ul className="list-disc list-inside mt-1 space-y-1">
              <li>Pastikan Arduino IDE Serial Monitor ditutup sepenuhnya</li>
              <li>Tutup aplikasi lain yang mungkin menggunakan port Arduino (PuTTY, Tera Term, dll)</li>
              <li>Cabut dan pasang kembali kabel USB Arduino</li>
              <li>Pilih port yang benar saat diminta (biasanya COM3, COM4, atau /dev/ttyUSB0)</li>
              <li>Restart browser jika masalah masih terjadi</li>
            </ul>
          </div>
        </div>
      )}
      
      {/* Camera View */}
      <div className="relative bg-black rounded-lg overflow-hidden mb-4" style={{ height: '480px' }}>
        {/* Video dan Canvas elements - selalu ada di DOM */}
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          className="hidden"
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
            objectFit: 'cover',
            zIndex: 1
          }}
        />
        
        {isActive ? (
          <>
            {isDetecting && (
              <div className="absolute top-4 right-4 bg-blue-600/90 text-white px-3 py-2 rounded-lg text-xs font-medium z-10">
                🔍 Detecting...
              </div>
            )}
          </>
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-gray-400">
            <div className="text-center">
              <Thermometer className="w-16 h-16 mx-auto mb-2 opacity-50" />
              <p>Kamera tidak aktif</p>
              <p className="text-sm mt-1">Klik "Start Detection" untuk memulai</p>
            </div>
          </div>
        )}
      </div>
      
      {/* Detection Info */}
      <div className="grid grid-cols-4 gap-4">
        <div className="bg-gray-50 rounded-lg p-3">
          <div className="text-xs text-gray-600 mb-1">Detected Brand</div>
          <div className="text-sm font-medium text-gray-900">
            {detectedBrand || 'N/A'}
          </div>
        </div>
        <div className="bg-gray-50 rounded-lg p-3">
          <div className="text-xs text-gray-600 mb-1">Confidence</div>
          <div className="text-sm font-medium text-gray-900">
            {confidence > 0 ? `${confidence.toFixed(1)}%` : 'N/A'}
          </div>
        </div>
        <div className="bg-gray-50 rounded-lg p-3">
          <div className="text-xs text-gray-600 mb-1">
            Temperature {useArduinoTemp && arduinoTemperature !== null ? '(Arduino)' : '(Simulated)'}
          </div>
          <div className={`text-sm font-medium ${
            status === 'DANGER' ? 'text-red-600' :
            status === 'WARNING' ? 'text-yellow-600' :
            status === 'NORMAL' ? 'text-green-600' :
            'text-gray-500'
          }`}>
            {useArduinoTemp && arduinoTemperature !== null 
              ? `${arduinoTemperature.toFixed(1)}°C` 
              : temperature > 0 
                ? `${temperature.toFixed(1)}°C` 
                : 'N/A'}
          </div>
        </div>
        <div className="bg-gray-50 rounded-lg p-3">
          <div className="text-xs text-gray-600 mb-1">Status</div>
          <div className={`text-sm font-medium flex items-center space-x-1 ${
            status === 'DANGER' ? 'text-red-600' :
            status === 'WARNING' ? 'text-yellow-600' :
            status === 'NORMAL' ? 'text-green-600' :
            'text-gray-500'
          }`}>
            {status === 'DANGER' && <AlertTriangle className="w-4 h-4" />}
            <span>{status}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ThermalDetection;

