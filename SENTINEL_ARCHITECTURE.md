# Arsitektur dan Flow Sentinel - Dokumentasi Detail

## 📋 Daftar Isi
1. [Overview](#overview)
2. [Arsitektur Sistem](#arsitektur-sistem)
3. [Komponen Utama](#komponen-utama)
4. [Flow Deteksi](#flow-deteksi)
5. [Teknologi yang Digunakan](#teknologi-yang-digunakan)
6. [Metode Deteksi](#metode-deteksi)
7. [Privacy & Security Layer](#privacy--security-layer)
8. [Audio Alert System](#audio-alert-system)

---

## 🎯 Overview

**Sentinel** adalah sistem monitoring keamanan berbasis AI yang terintegrasi untuk mendeteksi berbagai hazard dan aktivitas berbahaya di area SPBU. Sistem ini menggunakan multiple AI models untuk deteksi real-time dan memiliki privacy-preserving layer untuk compliance dengan regulasi data privacy.

### Fitur Utama:
- ✅ Deteksi Jerigen (pengisian bensin ilegal)
- ✅ Deteksi Plat Nomor Kendaraan
- ✅ Deteksi Gerakan Mobil (Moving/Stationary)
- ✅ Camera Feed Monitoring
- ✅ Real-time Audio Alerts
- ✅ Privacy-Preserving Data Processing
- ✅ Security Logging & Audit Trail

---

## 🏗️ Arsitektur Sistem

### High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    SENTINEL DASHBOARD                        │
│                  (React Component)                           │
└─────────────────────────────────────────────────────────────┘
                            │
        ┌───────────────────┼───────────────────┐
        │                   │                   │
        ▼                   ▼                   ▼
┌──────────────┐   ┌──────────────┐   ┌──────────────┐
│  Camera      │   │  Jerigen     │   │  Plat Nomor  │
│  Section     │   │  Detection   │   │  Detection   │
└──────────────┘   └──────────────┘   └──────────────┘
        │                   │                   │
        ▼                   ▼                   ▼
┌──────────────┐   ┌──────────────┐   ┌──────────────┐
│  IP Webcam   │   │  YOLO Model  │   │  Teachable    │
│  Stream      │   │  (Jerigen)    │   │  Machine     │
│              │   │              │   │  (Plat)      │
└──────────────┘   └──────────────┘   └──────────────┘
                            │
                            ▼
                   ┌─────────────────┐
                   │  Car Motion     │
                   │  Detection      │
                   │  (YOLOv8 ONNX)  │
                   └─────────────────┘
                            │
        ┌───────────────────┼───────────────────┐
        │                   │                   │
        ▼                   ▼                   ▼
┌──────────────┐   ┌──────────────┐   ┌──────────────┐
│  Alert       │   │  Privacy     │   │  Audio       │
│  Management  │   │  Layer       │   │  System      │
└──────────────┘   └──────────────┘   └──────────────┘
```

### Component Hierarchy

```
Sentinel.jsx (Main Container)
├── Sidebar
├── Navbar
├── System Metrics Overview
├── CameraSection
│   ├── IP Webcam Stream (http://192.168.51.34:8080)
│   └── Teachable Machine Model (Brand Detection)
├── JerigenDetection
│   ├── YOLO Model (best.pt) - via Backend API atau ONNX
│   └── Detection Loop (requestAnimationFrame)
├── PlatNomorDetection
│   ├── Teachable Machine Model (model.json)
│   └── Classification-based Detection
├── CarMotionDetection
│   ├── YOLOv8 ONNX Model (yolov8n.onnx)
│   ├── ONNX Runtime (browser-based)
│   └── Motion Tracking Algorithm
├── Privacy & Security Layer
│   ├── encrypt_data() - Data Encryption
│   ├── anonymize_event() - Event Anonymization
│   ├── securityLog - Security Logging
│   └── privacyAPI - Privacy Compliance Tracking
└── Alert Management System
    ├── Alert State Management
    ├── Audio Alert (Text-to-Speech)
    └── Alert Table Display
```

---

## 🧩 Komponen Utama

### 1. **Sentinel.jsx** (Main Component)

**Lokasi**: `src/stori_demo/dashboard_stori/features/Sentinel.jsx`

**Fungsi**:
- Container utama untuk semua fitur Sentinel
- Mengelola state alerts dan metrics
- Menangani event handlers dari komponen deteksi
- Mengintegrasikan privacy layer
- Mengelola audio alert system

**State Management**:
```javascript
- alerts: Array of alert objects
- recentAlerts: Processed alerts dengan privacy layer
- playingAudioId: ID alert yang sedang diputar audio
- selectedTimeRange: '24h' | '7d' | '30d'
- sidebarMinimized: Boolean
```

**Event Handlers**:
- `handleJerigenDetected(detectionData)` - Handler untuk deteksi jerigen
- `handlePlatDetected(detectionData)` - Handler untuk deteksi plat nomor
- `handleCarMotionDetected(detectionData)` - Handler untuk deteksi gerakan mobil

---

### 2. **JerigenDetection.jsx**

**Lokasi**: `src/stori_demo/dashboard_stori/features/JerigenDetection.jsx`

**Fungsi**:
- Deteksi jerigen menggunakan YOLO model
- Real-time detection dari camera feed atau video upload
- Drawing bounding boxes pada canvas overlay

**Model Configuration**:
```javascript
MODEL_PATH: '/models/jerigen/best.pt'
BACKEND_API_URL: 'http://localhost:8000/api/detect'
USE_BACKEND_API: false (default)
```

**Detection Methods**:
1. **Backend API** (jika `USE_BACKEND_API = true`):
   - POST request ke backend dengan image blob
   - Backend menjalankan YOLO inference
   - Response: JSON dengan detections array

2. **Simulation Mode** (default untuk demo):
   - Simulasi deteksi dengan 30% probability
   - Generate random bounding boxes

3. **ONNX Model** (future implementation):
   - Load ONNX model di browser
   - Inference menggunakan ONNX Runtime

**Detection Loop**:
```javascript
detectionLoop() {
  1. Capture frame dari video
  2. Draw frame ke canvas
  3. Get image data
  4. Run detection (API atau simulation)
  5. Filter detections (confidence > 0.5)
  6. Draw bounding boxes
  7. Trigger onJerigenDetected callback (dengan debounce)
  8. Request next animation frame
}
```

**Debounce Mechanism**:
- `DETECTION_DEBOUNCE_MS = 18000` (18 detik)
- Mencegah spam event ke parent component

---

### 3. **PlatNomorDetection.jsx**

**Lokasi**: `src/stori_demo/dashboard_stori/features/PlatNomorDetection.jsx`

**Fungsi**:
- Deteksi plat nomor menggunakan Teachable Machine
- Classification-based detection (bukan object detection)
- Mendeteksi apakah ada plat nomor di frame

**Model Configuration**:
```javascript
MODEL_URL: '/model_plat/model.json'
METADATA_URL: '/model_plat/metadata.json'
CONFIDENCE_THRESHOLD: 0.5
```

**Detection Method**:
1. Load Teachable Machine model (tmImage library)
2. Predict pada setiap frame
3. Classification result: probability untuk setiap class
4. Return detection jika confidence > threshold

**Model Type**: Classification (bukan Object Detection)
- Input: Full frame image
- Output: Class probabilities (e.g., "has_plate", "no_plate")
- Bounding box: Full frame (karena classification model)

---

### 4. **CarMotionDetection.jsx**

**Lokasi**: `src/stori_demo/dashboard_stori/features/CarMotionDetection.jsx`

**Fungsi**:
- Deteksi mobil menggunakan YOLOv8 ONNX model
- Tracking gerakan mobil (moving vs stationary)
- Menghitung durasi mobil diam

**Model Configuration**:
```javascript
MODEL_PATH: '/model_mobil_listrik/yolov8n.onnx'
BACKEND_API_URL: 'http://localhost:8000/api/car-motion-detect'
USE_BACKEND_API: false (default - menggunakan ONNX)
```

**Detection Method**: ONNX Runtime (Browser-based)
1. Load ONNX model menggunakan `onnxruntime-web`
2. Preprocess image:
   - Resize ke 640x640
   - Normalize pixel values [0, 1]
   - Convert ke NCHW format: [1, 3, 640, 640]
3. Run inference
4. Post-process output:
   - Parse YOLO output format
   - Apply NMS (Non-Maximum Suppression)
   - Filter by confidence threshold
   - Scale bounding boxes ke original image size

**Motion Tracking Algorithm**:
```javascript
1. Detect cars di current frame
2. Compare dengan previous frame:
   - Calculate position difference
   - Calculate movement distance
3. Determine status:
   - MOVING: position change > MOTION_THRESHOLD (20 pixels)
   - STATIONARY: position change < MOTION_THRESHOLD
   - NO CAR: no detections
4. Track duration:
   - Start timer saat mobil menjadi stationary
   - Update duration setiap frame
   - Reset saat mobil bergerak atau hilang
```

**Motion Detection Parameters**:
```javascript
MOTION_THRESHOLD: 20 pixels
SEGMENTS: 20 (untuk motion analysis)
```

---

### 5. **CameraSection.jsx**

**Lokasi**: `src/stori_demo/dashboard_stori/features/CameraSection.jsx`

**Fungsi**:
- Menampilkan camera feed (IP Webcam atau phone camera)
- Optional: Brand detection menggunakan Teachable Machine
- Snapshot capture

**Camera Sources**:
1. **IP Webcam**:
   - URL: `http://192.168.51.34:8080`
   - Stream: `/video`
   - Snapshot: `/shot.jpg`

2. **Phone Camera**:
   - `getUserMedia()` API
   - Facing mode: 'environment' (back camera)

**Optional Feature**: Brand Detection
- Teachable Machine model: `/my_model/model.json`
- Detect camera brand dari frame
- Disabled by default (`enableTeachableMachine = false`)

---

## 🔄 Flow Deteksi

### Flow Lengkap: Jerigen Detection

```
1. User mengaktifkan Jerigen Detection
   └─> setIsActive(true)
   └─> loadModel()
       ├─> Jika USE_BACKEND_API: setModelLoaded(true)
       └─> Jika tidak: setModelLoaded(true) (simulation mode)

2. Start Camera/Video
   └─> getUserMedia() atau load video file
   └─> videoRef.current.srcObject = stream
   └─> Start detectionLoop()

3. Detection Loop (requestAnimationFrame)
   ├─> Capture frame dari video
   ├─> Draw ke canvas
   ├─> Get image data
   ├─> detectJerigen(imageData)
   │   ├─> Jika USE_BACKEND_API:
   │   │   └─> POST image ke backend API
   │   │   └─> Parse response detections
   │   └─> Jika tidak:
   │       └─> simulateDetection() (30% chance)
   ├─> Filter detections (confidence > 0.5)
   ├─> Draw bounding boxes pada overlay canvas
   └─> Jika detections valid:
       └─> Check debounce (18 detik)
       └─> onJerigenDetected(detectionData)
           └─> handleJerigenDetected() di Sentinel.jsx

4. Alert Creation (di Sentinel.jsx)
   ├─> Create new alert object
   ├─> Check recent similar alert (30 detik window)
   ├─> Update atau add alert ke state
   ├─> Process melalui privacy layer:
   │   ├─> anonymize_event(alert)
   │   ├─> encrypt_data(alert)
   │   └─> securityLog.logAnonymization()
   └─> Trigger audio alert (jika new alert dan debounce OK)

5. Audio Alert
   ├─> playAudioDirectly(alert)
   ├─> Generate message: getAudioMessage(alert)
   ├─> Web Speech API: speechSynthesis.speak()
   └─> Log audio playback
```

### Flow: Car Motion Detection

```
1. Load ONNX Model
   └─> Import onnxruntime-web
   └─> ort.InferenceSession.create(MODEL_PATH)
   └─> Store session di modelRef.current

2. Detection Loop
   ├─> Capture frame
   ├─> Preprocess:
   │   ├─> Resize ke 640x640
   │   ├─> Normalize [0, 1]
   │   └─> Convert ke NCHW tensor
   ├─> Run ONNX inference
   ├─> Post-process:
   │   ├─> Parse YOLO output
   │   ├─> Apply NMS
   │   └─> Scale bboxes
   ├─> Motion Analysis:
   │   ├─> Compare dengan previous frame
   │   ├─> Calculate movement distance
   │   └─> Determine status (MOVING/STATIONARY)
   └─> Track duration (jika stationary)

3. Alert Trigger
   └─> onCarMotionDetected(detectionData)
       └─> handleCarMotionDetected() di Sentinel.jsx
           └─> Create alert dengan duration info
           └─> Audio alert (15 detik debounce)
```

### Flow: Plat Nomor Detection

```
1. Load Teachable Machine Model
   └─> Wait for tmImage library (CDN)
   └─> tmImage.load(MODEL_URL, METADATA_URL)
   └─> Store model di modelRef.current

2. Detection Loop
   ├─> Capture frame
   ├─> model.predict(canvas)
   ├─> Get predictions (class probabilities)
   ├─> Find highest confidence
   └─> Jika confidence > threshold:
       └─> Return detection (full frame bbox)

3. Alert Trigger
   └─> onPlatDetected(detectionData)
       └─> handlePlatDetected() di Sentinel.jsx
           └─> Create alert
           └─> Process melalui privacy layer
```

---

## 🛠️ Teknologi yang Digunakan

### Frontend Framework & Libraries

1. **React 18+**
   - Component-based architecture
   - Hooks: useState, useEffect, useRef
   - Context API untuk auth

2. **Vite**
   - Build tool dan dev server
   - Fast HMR (Hot Module Replacement)

3. **Tailwind CSS**
   - Utility-first CSS framework
   - Responsive design

4. **Lucide React**
   - Icon library
   - Icons: Shield, AlertTriangle, CheckCircle, dll

### AI/ML Libraries & Models

1. **YOLOv8 (PyTorch)**
   - Model: `best.pt` (Jerigen detection)
   - Format: PyTorch (.pt)
   - Inference: Backend API atau ONNX conversion

2. **YOLOv8 ONNX**
   - Model: `yolov8n.onnx` (Car detection)
   - Library: `onnxruntime-web`
   - Browser-based inference
   - Format: ONNX (Open Neural Network Exchange)

3. **Teachable Machine**
   - Models:
     - `/model_plat/` (Plat nomor detection)
     - `/my_model/` (Brand detection - optional)
   - Library: `tmImage` (via CDN)
   - Format: TensorFlow.js (model.json + weights.bin)

### Browser APIs

1. **MediaDevices API**
   - `getUserMedia()` - Camera access
   - Video stream handling

2. **Canvas API**
   - Frame capture dari video
   - Image processing
   - Drawing bounding boxes

3. **Web Speech API**
   - `speechSynthesis` - Text-to-Speech
   - Language: Indonesian (id-ID)
   - Auto-play alerts

4. **RequestAnimationFrame**
   - Smooth detection loop
   - 60 FPS target

### Privacy & Security

1. **Web Crypto API** (simulated)
   - Data encryption
   - Demo-level implementation

2. **LocalStorage**
   - Security logs persistence
   - Privacy status storage

### Camera Integration

1. **IP Webcam**
   - Protocol: HTTP/HTTPS
   - Stream endpoint: `/video`
   - Snapshot endpoint: `/shot.jpg`
   - Two-way audio support (HTTPS)

---

## 🔬 Metode Deteksi

### 1. Object Detection (YOLO)

**Digunakan untuk**: Jerigen Detection, Car Detection

**Metode**:
- **YOLO (You Only Look Once)**: Single-stage object detector
- Input: Image (640x640 untuk YOLOv8)
- Output: Bounding boxes + class probabilities
- Post-processing: NMS (Non-Maximum Suppression)

**YOLOv8 Architecture**:
```
Input (640x640x3)
  └─> Backbone (CSPDarknet)
  └─> Neck (PANet)
  └─> Head (Detection Head)
  └─> Output: [batch, num_detections, 84]
      - 4 values: bbox (x, y, w, h)
      - 80 values: class scores (COCO dataset)
```

**ONNX Inference Flow**:
```javascript
1. Preprocess:
   - Resize image ke 640x640
   - Normalize: pixel / 255.0
   - Convert RGB ke NCHW: [1, 3, 640, 640]

2. Create Tensor:
   - Float32Array dengan shape [1, 3, 640, 640]
   - R channel: inputArray[0:640*640]
   - G channel: inputArray[640*640:2*640*640]
   - B channel: inputArray[2*640*640:3*640*640]

3. Run Inference:
   - ort.Tensor('float32', inputArray, [1, 3, 640, 640])
   - session.run({ inputName: tensor })

4. Post-process:
   - Parse output (format tergantung YOLO version)
   - Apply confidence threshold (0.5)
   - Apply NMS (IoU threshold: 0.45)
   - Scale bboxes ke original image size
```

### 2. Classification (Teachable Machine)

**Digunakan untuk**: Plat Nomor Detection

**Metode**:
- **Image Classification**: Multi-class classification
- Input: Full frame image
- Output: Class probabilities
- Model: Transfer learning dari MobileNet

**Teachable Machine Flow**:
```javascript
1. Load Model:
   - model.json (architecture)
   - metadata.json (class names, dll)
   - weights.bin (model weights)

2. Predict:
   - model.predict(canvas)
   - Returns: Array of predictions
     [
       { className: 'has_plate', probability: 0.95 },
       { className: 'no_plate', probability: 0.05 }
     ]

3. Process:
   - Find highest probability
   - Check if > confidence threshold (0.5)
   - Return detection dengan full frame bbox
```

### 3. Motion Tracking

**Digunakan untuk**: Car Motion Detection

**Metode**:
- **Frame Difference**: Compare consecutive frames
- **Position Tracking**: Track car positions across frames
- **Movement Calculation**: Euclidean distance

**Algorithm**:
```javascript
1. Detect cars di frame N
2. Store positions: [{id, x, y, w, h}, ...]

3. Di frame N+1:
   - Detect cars lagi
   - Match dengan previous positions (IoU matching)
   - Calculate movement:
     distance = sqrt((x2-x1)² + (y2-y1)²)

4. Determine Status:
   - MOVING: distance > MOTION_THRESHOLD (20px)
   - STATIONARY: distance < MOTION_THRESHOLD
   - NO CAR: no detections

5. Track Duration:
   - Start timer saat status = STATIONARY
   - Update duration setiap frame
   - Reset saat status = MOVING atau NO CAR
```

### 4. Debouncing & Throttling

**Tujuan**: Mencegah spam events dan audio alerts

**Implementation**:
```javascript
// Jerigen Detection
DETECTION_DEBOUNCE_MS = 18000 (18 detik)
AUDIO_DEBOUNCE_MS = 18000 (18 detik)

// Car Motion Detection
AUDIO_DEBOUNCE_MS = 15000 (15 detik)

// Plat Nomor Detection
DETECTION_DEBOUNCE_MS = 5000 (5 detik)
AUDIO_ALERT_DEBOUNCE_MS = 8000 (8 detik)
```

**Logic**:
```javascript
const timeSinceLastEvent = Date.now() - lastEventTimeRef.current;
const isNewAlert = !recentSimilarAlert;
const shouldTrigger = isNewAlert || (timeSinceLastEvent > DEBOUNCE_MS);
```

---

## 🔒 Privacy & Security Layer

### Architecture

```
Alert Data
    │
    ├─> anonymize_event()
    │   └─> Remove PII
    │   └─> Mask location precision
    │   └─> Round confidence values
    │   └─> Remove exact timestamps
    │
    ├─> encrypt_data()
    │   └─> Base64 encode
    │   └─> XOR cipher (demo-level)
    │   └─> Return encrypted blob
    │
    └─> securityLog.log()
        └─> Store in localStorage
        └─> Track operations
        └─> Audit trail
```

### Privacy Functions

#### 1. **encrypt_data(data, key)**

**Lokasi**: `privacy/privacyUtils.js`

**Method**:
- Base64 encoding
- XOR cipher (demo-level)
- In production: Use Web Crypto API atau crypto-js

**Flow**:
```javascript
1. JSON.stringify(data)
2. btoa() - Base64 encode
3. XOR cipher dengan key
4. btoa() lagi - Final encrypted string
5. Return: { encrypted, algorithm, timestamp, keyHash }
```

#### 2. **anonymize_event(event)**

**Lokasi**: `privacy/privacyUtils.js`

**Method**:
- Location masking: `Pump 2` → `Zone-2`
- Timestamp masking: Remove exact time, keep date only
- Description anonymization: Keep only event type
- Confidence rounding: Round to nearest 10%
- Remove PII: userId, userName, userEmail

**Flow**:
```javascript
1. Mask location: hash location string → Zone-X
2. Mask timestamp: keep only date (YYYY-MM-DD)
3. Anonymize description: use event.type only
4. Round confidence: Math.round(confidence / 10) * 10
5. Remove user identifiers
6. Add metadata: { anonymized: true, privacyCompliant: true }
```

#### 3. **securityLog**

**Lokasi**: `privacy/securityLog.js`

**Class**: SecurityLogService (Singleton)

**Methods**:
- `log(event)` - General logging
- `logEncryption(dataType, success)` - Encryption operations
- `logAnonymization(eventType, success)` - Anonymization operations
- `logAccess(resource, userId, success)` - Access attempts
- `logAPI(endpoint, method, success)` - API calls
- `logSecurityAlert(alertType, description)` - Security alerts

**Storage**: localStorage (`stori_security_logs`)
**Max Logs**: 1000 entries

#### 4. **privacyAPI**

**Lokasi**: `privacy/privacyAPI.js`

**Class**: PrivacyAPIService (Singleton)

**Features**:
- Compliance tracking (GDPR, CCPA, Local)
- Metrics: encrypted data count, anonymized events count
- Compliance score calculation
- Privacy report generation
- Recommendations

**Storage**: localStorage (`stori_privacy_status`)

---

## 🔊 Audio Alert System

### Architecture

```
Alert Trigger
    │
    ├─> Check User Interaction (autoplay policy)
    ├─> Check Debounce
    ├─> Generate Message: getAudioMessage(alert)
    │   └─> Type-based messages
    │   └─> Severity-based variations
    │   └─> Indonesian language (id-ID)
    │
    └─> playAudioDirectly(alert)
        ├─> speechSynthesis.cancel() (stop previous)
        ├─> Create SpeechSynthesisUtterance
        ├─> Configure:
        │   ├─> lang: 'id-ID'
        │   ├─> rate: 0.9
        │   ├─> pitch: 1
        │   └─> volume: 1
        ├─> speechSynthesis.speak(utterance)
        └─> Event handlers:
            ├─> onstart: setPlayingAudioId
            ├─> onend: clear playingAudioId, log success
            └─> onerror: log error, retry (max 3 attempts)
```

### Message Templates

**Jerigen Detected**:
- Critical: "Peringatan darurat! Pengisian bensin menggunakan jerigen terdeteksi di {location}. Dilarang keras mengisi bensin menggunakan jerigen karena sangat berbahaya. Segera hentikan aktivitas tersebut."
- Warning: "Peringatan! Pengisian bensin menggunakan jerigen terdeteksi di {location}. Dilarang mengisi bensin menggunakan jerigen."
- Info: "Informasi: Pengisian bensin menggunakan jerigen terdeteksi di {location}. Harap perhatikan."

**Car Motion**:
- Moving: "Peringatan! Mobil bergerak terdeteksi di {location}."
- Stationary: "Peringatan! Mobil diam terdeteksi di {location} selama {duration}. Perlu perhatian."

**Plat Nomor**:
- "Plat nomor kendaraan terdeteksi di {location}. Confidence: {confidence}%."

### User Interaction Handling

**Browser Autoplay Policy**:
- Browsers block autoplay audio tanpa user interaction
- Solution: Track user interaction flag

**Implementation**:
```javascript
1. Listen for user events:
   - click
   - keydown
   - touchstart

2. Set flag: userInteractedRef.current = true

3. Expose function: window.userInteractedForAudio
   - Untuk komponen lain (JerigenDetection)

4. Check flag sebelum play audio
```

### Retry Mechanism

**Multiple Attempts**:
- Max attempts: 3
- Delay between attempts: 300-500ms
- Check status: `speechSynthesis.speaking` dan `speechSynthesis.pending`

**Fallback**:
- Jika semua attempts gagal: Log error
- Tidak show alert ke user (silent fail)

---

## 📊 Data Flow Diagram

### Complete Flow: Detection → Alert → Audio

```
┌─────────────┐
│   Camera    │
│   Feed      │
└──────┬──────┘
       │
       ▼
┌─────────────┐
│  Detection  │
│  Component  │
│  (YOLO/TM)  │
└──────┬──────┘
       │ detectionData
       ▼
┌─────────────┐
│  Sentinel   │
│  Handler    │
└──────┬──────┘
       │
       ├─> Create Alert Object
       │
       ├─> Privacy Layer
       │   ├─> anonymize_event()
       │   ├─> encrypt_data()
       │   └─> securityLog.log()
       │
       ├─> Update Alert State
       │
       └─> Audio Alert (if conditions met)
           ├─> Check debounce
           ├─> Check user interaction
           ├─> Generate message
           └─> speechSynthesis.speak()
```

---

## 🔧 Configuration

### Model Paths

```javascript
// Jerigen Detection
MODEL_PATH: '/models/jerigen/best.pt'
BACKEND_API_URL: 'http://localhost:8000/api/detect'

// Car Motion Detection
MODEL_PATH: '/model_mobil_listrik/yolov8n.onnx'
BACKEND_API_URL: 'http://localhost:8000/api/car-motion-detect'

// Plat Nomor Detection
MODEL_URL: '/model_plat/model.json'
METADATA_URL: '/model_plat/metadata.json'

// Camera
IP_WEBCAM_URL: 'http://192.168.51.34:8080'
IP_WEBCAM_STREAM: '/video'
IP_WEBCAM_SNAPSHOT: '/shot.jpg'
```

### Thresholds

```javascript
// Detection Confidence
CONFIDENCE_THRESHOLD: 0.5 (50%)

// Motion Detection
MOTION_THRESHOLD: 20 pixels
SEGMENTS: 20

// Debounce Times
JERIGEN_DEBOUNCE: 18000ms (18s)
CAR_MOTION_DEBOUNCE: 15000ms (15s)
PLAT_NOMOR_DEBOUNCE: 5000ms (5s)
```

---

## 📝 Summary

### Arsitektur Sentinel menggunakan:

1. **Multi-Model AI System**:
   - YOLO untuk object detection (jerigen, mobil)
   - Teachable Machine untuk classification (plat nomor)
   - ONNX Runtime untuk browser-based inference

2. **Real-time Processing**:
   - requestAnimationFrame untuk smooth loop
   - Canvas API untuk frame processing
   - WebRTC/MediaDevices untuk camera access

3. **Privacy-Preserving Layer**:
   - Data encryption (demo-level)
   - Event anonymization
   - Security logging
   - Compliance tracking

4. **Alert System**:
   - Multi-severity alerts (critical, warning, info)
   - Audio alerts dengan Text-to-Speech
   - Debouncing untuk prevent spam

5. **Integration**:
   - IP Webcam support
   - Backend API support (optional)
   - LocalStorage untuk persistence

### Metode Deteksi:

1. **Object Detection** (YOLO): Jerigen, Mobil
2. **Classification** (Teachable Machine): Plat Nomor
3. **Motion Tracking**: Frame difference + position tracking
4. **Debouncing**: Time-based event throttling

---

**Dokumen ini menjelaskan arsitektur lengkap sistem Sentinel. Untuk implementasi detail, lihat source code di masing-masing komponen.**

