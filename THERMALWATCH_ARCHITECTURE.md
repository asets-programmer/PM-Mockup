# Arsitektur dan Flow ThermalWatch - Dokumentasi Detail

## 📋 Daftar Isi
1. [Overview](#overview)
2. [Arsitektur Sistem](#arsitektur-sistem)
3. [Komponen Utama](#komponen-utama)
4. [Flow Deteksi](#flow-deteksi)
5. [Teknologi yang Digunakan](#teknologi-yang-digunakan)
6. [Metode Deteksi](#metode-deteksi)
7. [Privacy & Security Layer](#privacy--security-layer)
8. [Notification System](#notification-system)
9. [Arduino Integration](#arduino-integration)

---

## 🎯 Overview

**ThermalWatch** adalah sistem monitoring suhu real-time berbasis AI untuk mendeteksi overheat dan kondisi thermal berbahaya pada komponen dispenser SPBU. Sistem ini menggunakan kombinasi AI model untuk deteksi brand dispenser dan sensor suhu (Arduino atau simulasi RGB) untuk monitoring suhu real-time dengan privacy-preserving layer untuk compliance dengan regulasi data privacy.

### Fitur Utama:
- ✅ Deteksi Brand Dispenser (Gilbarco/Tatsuno) menggunakan TensorFlow.js
- ✅ Monitoring Suhu Real-time (Arduino atau Simulasi RGB)
- ✅ Deteksi Anomaly Suhu (Konsistensi Panas, Lonjakan Suhu, Near-Max Temperature)
- ✅ Status Monitoring (NORMAL, WARNING, DANGER, TOO COLD)
- ✅ Browser Notifications untuk Alerts
- ✅ Privacy-Preserving Data Processing
- ✅ Security Logging & Audit Trail
- ✅ Backend API Integration (Optional)
- ✅ Heatmap Visualization

---

## 🏗️ Arsitektur Sistem

### High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    THERMALWATCH DASHBOARD                    │
│                  (React Component)                            │
└─────────────────────────────────────────────────────────────┘
                            │
        ┌───────────────────┼───────────────────┐
        │                   │                   │
        ▼                   ▼                   ▼
┌──────────────┐   ┌──────────────┐   ┌──────────────┐
│  Thermal     │   │  Camera      │   │  Event       │
│  Detection   │   │  Section     │   │  Management  │
└──────────────┘   └──────────────┘   └──────────────┘
        │                   │                   │
        ├─> TensorFlow.js   │                   │
        │   (Brand Model)   │                   │
        │                   │                   │
        ├─> Arduino Serial  │                   │
        │   (Temperature)   │                   │
        │                   │                   │
        └─> RGB Simulation  │                   │
            (Fallback)      │                   │
                            │                   │
        ┌───────────────────┼───────────────────┐
        │                   │                   │
        ▼                   ▼                   ▼
┌──────────────┐   ┌──────────────┐   ┌──────────────┐
│  Anomaly     │   │  Privacy     │   │  Notification│
│  Detection   │   │  Layer       │   │  System      │
└──────────────┘   └──────────────┘   └──────────────┘
        │                   │                   │
        ▼                   ▼                   ▼
┌──────────────┐   ┌──────────────┐   ┌──────────────┐
│  Event       │   │  Security    │   │  Browser     │
│  Storage     │   │  Logging     │   │  Notifications│
│  (localStorage)│  └──────────────┘   └──────────────┘
└──────────────┘
```

### Component Hierarchy

```
ThermalWatch.jsx (Main Container)
├── Sidebar
├── Navbar
├── System Metrics Overview
├── ThermalDetection
│   ├── Camera Stream (getUserMedia)
│   ├── TensorFlow.js Model (Brand Detection)
│   ├── Arduino Serial Port (Temperature Sensor)
│   ├── RGB Temperature Simulation (Fallback)
│   ├── Anomaly Detection Engine
│   │   ├── Consistent Hot Detection
│   │   ├── Temperature Spike Detection
│   │   └── Near-Max Temperature Detection
│   ├── Heatmap Visualization
│   └── Detection Loop (requestAnimationFrame)
├── CameraSection
│   └── IP Webcam Stream (Optional)
├── Privacy & Security Layer
│   ├── encrypt_data() - Data Encryption
│   ├── anonymize_event() - Event Anonymization
│   ├── securityLog - Security Logging
│   └── privacyAPI - Privacy Compliance Tracking
└── Event Management System
    ├── Event State Management (localStorage)
    ├── Event Table Display
    └── Event Deletion
```

---

## 🧩 Komponen Utama

### 1. **ThermalWatch.jsx** (Main Component)

**Lokasi**: `src/stori_demo/dashboard_stori/features/ThermalWatch.jsx`

**Fungsi**:
- Container utama untuk semua fitur ThermalWatch
- Mengelola state thermal events dan metrics
- Menangani event handlers dari ThermalDetection
- Mengintegrasikan privacy layer
- Menampilkan dashboard dengan charts dan metrics

**State Management**:
```javascript
- thermalEvents: Array of thermal event objects
- selectedTimeRange: '24h' | '7d' | '30d'
- sidebarMinimized: Boolean
- eventIdRef: Counter untuk unique event IDs
```

**Event Handlers**:
- `addThermalEvent(eventData)` - Handler untuk thermal events dari ThermalDetection
- `deleteThermalEvent(eventId)` - Handler untuk menghapus event

**Storage**:
- `localStorage` key: `thermal_events` - Menyimpan array events
- `localStorage` key: `thermal_event_id_counter` - Counter untuk ID

---

### 2. **ThermalDetection.jsx**

**Lokasi**: `src/stori_demo/dashboard_stori/features/ThermalDetection.jsx`

**Fungsi**:
- Deteksi brand dispenser menggunakan TensorFlow.js (Keras model)
- Monitoring suhu real-time dari Arduino atau simulasi RGB
- Deteksi anomaly suhu (konsistensi panas, lonjakan, near-max)
- Visualisasi heatmap pada video feed
- Browser notifications untuk alerts

**Model Configuration**:
```javascript
MODEL_URL: '/keras_model/model.json'
LABELS_URL: '/keras_model/labels.txt'
CONFIDENCE_THRESHOLD: 80% (untuk brand detection)
```

**Temperature Sources**:
1. **Arduino Serial Port** (Primary):
   - Web Serial API untuk koneksi
   - Baud rate: 9600
   - Format data: "Object Temperature: XX.XX °C"
   - Real-time parsing dan update

2. **RGB Simulation** (Fallback):
   - Calculate temperature dari RGB values
   - Formula: `temp = 25 + (tempValue * 35)` (kisaran 25-60°C)
   - Digunakan jika Arduino tidak tersedia

**Temperature Limits per Brand**:
```javascript
TEMP_LIMITS = {
  "Gilbarco": {
    min: -20°C,        // Minimum operasi
    normalMax: 45°C,   // Batas atas normal
    warning: 45°C,     // Batas peringatan (>45°C)
    danger: 55°C       // Batas bahaya/shutdown (>55°C)
  },
  "Tatsuno": {
    min: -25°C,        // Minimum operasi
    normalMax: 55°C,   // Batas atas normal
    warning: 55°C,     // Batas peringatan (>55°C)
    danger: 65°C       // Batas bahaya/shutdown (>65°C)
  }
}
```

**Anomaly Detection**:
1. **Consistent Hot Detection**:
   - Suhu konsisten panas selama 5 detik
   - Threshold: Suhu > warning/danger untuk seluruh durasi
   - Debounce: 5 detik

2. **Temperature Spike Detection**:
   - Lonjakan suhu > 5°C dalam waktu < 2 detik
   - Trigger: Jika lonjakan + suhu > warning threshold
   - Debounce: 3 detik

3. **Near-Max Temperature Detection**:
   - Suhu berada pada maksimum ± 10% selama 5 detik
   - Range: `[normalMax - 10%, normalMax + 10%]`
   - Debounce: 5 detik

**Detection Loop**:
```javascript
detectionLoop() {
  1. Capture frame dari video
  2. Draw frame ke canvas
  3. Get image data
  4. Get temperature:
     - Jika Arduino tersedia: gunakan arduinoTemperature
     - Jika tidak: calculateTemperatureFromRGB(imageData)
  5. Predict brand menggunakan TensorFlow.js model
  6. Get status berdasarkan temperature dan brand
  7. Check anomaly conditions
  8. Trigger onThermalEvent callback (dengan debounce)
  9. Draw heatmap overlay
  10. Send data ke backend (jika interval tercapai)
  11. Request next animation frame
}
```

**Debounce Mechanism**:
- `EVENT_DEBOUNCE_MS = 10000` (10 detik) - Event notification
- `CONSISTENT_HOT_DURATION = 5000` (5 detik) - Konsistensi panas
- Immediate events: 2 detik (DANGER), 3 detik (WARNING)

---

### 3. **Brand Detection (TensorFlow.js)**

**Model Type**: Image Classification (Keras model converted to TensorFlow.js)

**Model Configuration**:
- Input size: 224x224 pixels
- Model format: TensorFlow.js (model.json + weights.bin)
- Classes: ["Gilbarco", "Tatsuno"]
- Confidence threshold: 80%

**Prediction Flow**:
```javascript
1. Resize frame ke 224x224
2. Convert ke tensor:
   - tf.browser.fromPixels(canvas)
   - Normalize: (pixel / 127.5) - 1
   - Batch: expandDims(0)
3. Run prediction: model.predict(batched)
4. Get class probabilities
5. Find highest confidence
6. Return { brand, confidence } jika confidence >= 80%
```

---

### 4. **Arduino Integration**

**Web Serial API**:
- Browser support: Chrome/Edge (Chromium-based)
- Protocol: Serial communication via USB
- Baud rate: 9600

**Connection Flow**:
```javascript
1. User clicks "Connect Arduino"
2. navigator.serial.requestPort() - User selects port
3. port.open({ baudRate: 9600 })
4. Setup reader: port.readable.getReader()
5. Start reading loop: readSerialData(reader)
6. Parse temperature dari buffer
7. Update state real-time
```

**Data Parsing**:
- Format dari Arduino: "Object Temperature: XX.XX °C"
- Pattern matching dengan regex
- Buffer management untuk partial data
- Immediate state update untuk real-time UI

**Error Handling**:
- Port already in use: Check if port is open
- Connection timeout: 3 second timeout
- Parse errors: Validate temperature range (-50°C to 150°C)
- Disconnect cleanup: Cancel reader, close port

---

### 5. **RGB Temperature Simulation**

**Method**: Calculate temperature dari RGB channel values

**Algorithm**:
```javascript
1. Get image data dari canvas
2. Calculate average R, G, B values:
   - R = sum(R) / (pixelCount * 255)
   - G = sum(G) / (pixelCount * 255)
   - B = sum(B) / (pixelCount * 255)
3. Calculate temp value:
   - tempValue = 0.6 * R + 0.3 * G + 0.1 * B
4. Convert to temperature:
   - temperature = 25 + (tempValue * 35)
   - Range: 25-60°C
```

**Use Case**: Fallback ketika Arduino tidak tersedia atau tidak terhubung

---

### 6. **Heatmap Visualization**

**Method**: JET colormap approximation

**Algorithm**:
```javascript
1. Get image data dari video frame
2. Convert R channel ke intensity (0-1)
3. Apply JET colormap:
   - Blue (0-0.25): Blue to Cyan
   - Cyan (0.25-0.5): Cyan to Green
   - Green (0.5-0.75): Green to Yellow
   - Yellow (0.75-1): Yellow to Red
4. Blend dengan original video (60% original, 40% heatmap)
5. Draw info overlay (brand, temperature, status)
```

---

## 🔄 Flow Deteksi

### Flow Lengkap: Thermal Detection

```
1. User mengaktifkan Thermal Detection
   └─> startCamera()
       ├─> loadModel() - Load TensorFlow.js model
       ├─> getUserMedia() - Request camera access
       ├─> videoRef.current.srcObject = stream
       └─> Start detectionLoop()

2. Optional: Connect Arduino
   └─> connectSerialPort()
       ├─> navigator.serial.requestPort()
       ├─> port.open({ baudRate: 9600 })
       ├─> Setup reader
       └─> Start readSerialData() loop

3. Detection Loop (requestAnimationFrame, ~10 FPS)
   ├─> Capture frame dari video
   ├─> Draw ke canvas
   ├─> Get temperature:
   │   ├─> Jika Arduino tersedia:
   │   │   └─> gunakan arduinoTemperature (real-time)
   │   └─> Jika tidak:
   │       └─> calculateTemperatureFromRGB(imageData)
   ├─> Predict brand:
   │   ├─> Resize frame ke 224x224
   │   ├─> Convert ke tensor
   │   ├─> model.predict(batched)
   │   └─> Get brand + confidence
   ├─> Get status:
   │   └─> getTemperatureStatus(temp, brand)
   │       ├─> Check TEMP_LIMITS[brand]
   │       └─> Return: NORMAL | WARNING | DANGER | TOO COLD
   ├─> Check anomaly conditions:
   │   ├─> checkTemperatureAnomaly(temp, brand, timestamp)
   │   │   ├─> Consistent Hot Detection
   │   │   ├─> Temperature Spike Detection
   │   │   └─> Near-Max Temperature Detection
   │   └─> Trigger onThermalEvent() jika anomaly terdeteksi
   ├─> Draw heatmap overlay
   └─> Send data ke backend (jika interval tercapai)

4. Event Creation (di ThermalWatch.jsx)
   ├─> addThermalEvent(eventData)
   ├─> Create new event object
   ├─> Process melalui privacy layer:
   │   ├─> anonymize_event(event)
   │   ├─> encrypt_data(event)
   │   └─> securityLog.logAnonymization()
   ├─> Save ke localStorage
   └─> Update UI (event table)

5. Browser Notification
   ├─> showBrowserNotification(title, body, tag)
   ├─> Check Notification permission
   ├─> Create Notification object
   └─> Display notification
```

### Flow: Arduino Temperature Reading

```
1. Serial Port Connection
   └─> connectSerialPort()
       ├─> Request port access
       ├─> Open port (9600 baud)
       └─> Start readSerialData()

2. Reading Loop
   ├─> reader.read() - Read Uint8Array
   ├─> Convert ke string (TextDecoder)
   ├─> Append ke buffer
   └─> parseArduinoTemperature()

3. Temperature Parsing
   ├─> Match pattern: "Object Temperature: XX.XX °C"
   ├─> Extract temperature value
   ├─> Validate range (-50°C to 150°C)
   ├─> Update state:
   │   ├─> setArduinoTemperature(temp)
   │   ├─> setTemperature(temp)
   │   └─> setStatus(getTemperatureStatus(temp, brand))
   ├─> Track history untuk anomaly detection
   └─> Check anomaly conditions

4. Real-time Update
   └─> UI update immediately (no delay)
```

### Flow: Anomaly Detection

```
1. Temperature History Tracking
   └─> tempTimeHistoryRef.current.push({ temp, timestamp })
   └─> Keep last 10 seconds of data

2. Consistent Hot Detection
   ├─> Filter history: last 5 seconds
   ├─> Check: all temps > threshold (warning/danger)
   ├─> If consistent: Trigger event (debounce 5s)

3. Temperature Spike Detection
   ├─> Compare: current temp vs previous temp
   ├─> Calculate: tempChange = current - previous
   ├─> Check: tempChange > 5°C AND timeDiff < 2s
   ├─> If spike: Trigger event (debounce 3s)

4. Near-Max Temperature Detection
   ├─> Calculate range: [normalMax - 10%, normalMax + 10%]
   ├─> Check: current temp dalam range
   ├─> Filter history: last 5 seconds
   ├─> Check: all temps dalam range
   ├─> If consistent: Trigger event (debounce 5s)

5. Immediate Event (No Anomaly Check)
   ├─> Check: temp > warning atau temp > danger
   ├─> Trigger event immediately (debounce 2s/3s)
   └─> Show browser notification
```

---

## 🛠️ Teknologi yang Digunakan

### Frontend Framework & Libraries

1. **React 18+**
   - Component-based architecture
   - Hooks: useState, useEffect, useRef, useCallback
   - Context API untuk auth

2. **Vite**
   - Build tool dan dev server
   - Fast HMR (Hot Module Replacement)

3. **Tailwind CSS**
   - Utility-first CSS framework
   - Responsive design

4. **Lucide React**
   - Icon library
   - Icons: Thermometer, AlertTriangle, CheckCircle, dll

### AI/ML Libraries & Models

1. **TensorFlow.js**
   - Model: Keras model converted to TensorFlow.js
   - Format: model.json + weights.bin
   - Library: `@tensorflow/tfjs` (via CDN)
   - Browser-based inference
   - Model size: 224x224 input, 2 classes output

2. **Keras Model (Original)**
   - Format: .h5 (Keras)
   - Converted to TensorFlow.js format
   - Classes: Gilbarco, Tatsuno
   - Input: 224x224 RGB images

### Browser APIs

1. **MediaDevices API**
   - `getUserMedia()` - Camera access
   - Video stream handling

2. **Web Serial API**
   - `navigator.serial` - Serial port access
   - Arduino communication
   - Browser support: Chrome/Edge (Chromium-based)

3. **Canvas API**
   - Frame capture dari video
   - Image processing
   - Heatmap visualization

4. **Notification API**
   - `Notification` - Browser notifications
   - Permission handling
   - Real-time alerts

5. **RequestAnimationFrame**
   - Smooth detection loop
   - ~10 FPS target

6. **LocalStorage API**
   - Event persistence
   - Counter storage

### Privacy & Security

1. **Web Crypto API** (simulated)
   - Data encryption
   - Demo-level implementation

2. **LocalStorage**
   - Security logs persistence
   - Privacy status storage
   - Event storage

### Backend Integration

1. **REST API**
   - Endpoint: `http://localhost:3000/data`
   - Method: POST
   - Payload: { class, average_temperature, status, timestamp }
   - Interval: 5 menit (atau jika DANGER)

---

## 🔬 Metode Deteksi

### 1. Brand Detection (Image Classification)

**Digunakan untuk**: Deteksi merek dispenser (Gilbarco/Tatsuno)

**Metode**:
- **Image Classification**: Multi-class classification
- Input: Full frame image (resized to 224x224)
- Output: Class probabilities
- Model: Keras model (converted to TensorFlow.js)

**TensorFlow.js Flow**:
```javascript
1. Preprocess:
   - Resize image ke 224x224
   - Convert ke tensor: tf.browser.fromPixels()
   - Normalize: (pixel / 127.5) - 1
   - Batch: expandDims(0) → [1, 224, 224, 3]

2. Run Inference:
   - model.predict(batched)
   - Returns: Float32Array dengan probabilities

3. Post-process:
   - Find max probability
   - Get class index
   - Check confidence >= 80%
   - Return { brand, confidence }

4. Cleanup:
   - Dispose tensors (memory management)
```

### 2. Temperature Measurement

**Method 1: Arduino Serial Port (Primary)**

**Hardware**: MLX90614 atau sensor suhu lainnya
**Protocol**: Serial communication (9600 baud)
**Format**: "Object Temperature: XX.XX °C"

**Flow**:
```javascript
1. Connect serial port
2. Read data stream
3. Parse temperature dari string
4. Validate range
5. Update state real-time
```

**Method 2: RGB Simulation (Fallback)**

**Algorithm**: Calculate dari RGB channel values

**Formula**:
```javascript
R_avg = sum(R) / (pixelCount * 255)
G_avg = sum(G) / (pixelCount * 255)
B_avg = sum(B) / (pixelCount * 255)

tempValue = 0.6 * R_avg + 0.3 * G_avg + 0.1 * B_avg
temperature = 25 + (tempValue * 35)  // Range: 25-60°C
```

**Use Case**: Demo atau ketika Arduino tidak tersedia

### 3. Anomaly Detection

**Tipe 1: Consistent Hot Detection**

**Algorithm**:
```javascript
1. Track temperature history (last 10 seconds)
2. Filter: last 5 seconds
3. Check: all temps > threshold (warning/danger)
4. If consistent: Trigger event
5. Debounce: 5 detik
```

**Tipe 2: Temperature Spike Detection**

**Algorithm**:
```javascript
1. Compare: current temp vs previous temp
2. Calculate: tempChange = current - previous
3. Calculate: timeDiff = currentTime - previousTime
4. Check conditions:
   - tempChange > 5°C
   - timeDiff < 2000ms
   - current temp > warning threshold
5. If spike: Trigger event
6. Debounce: 3 detik
```

**Tipe 3: Near-Max Temperature Detection**

**Algorithm**:
```javascript
1. Calculate range:
   - min = normalMax - (normalMax * 0.1)
   - max = normalMax + (normalMax * 0.1)
2. Check: current temp dalam range [min, max]
3. Filter history: last 5 seconds
4. Check: all temps dalam range
5. If consistent: Trigger event
6. Debounce: 5 detik
```

### 4. Status Determination

**Algorithm**:
```javascript
getTemperatureStatus(temp, brand) {
  const limits = TEMP_LIMITS[brand];
  
  if (temp < limits.min) {
    return 'TOO COLD';
  } else if (temp <= limits.normalMax) {
    return 'NORMAL';
  } else if (temp <= limits.danger) {
    return 'WARNING';
  } else {
    return 'DANGER';
  }
}
```

### 5. Debouncing & Throttling

**Tujuan**: Mencegah spam events dan notifications

**Implementation**:
```javascript
// Event Notification
EVENT_DEBOUNCE_MS = 10000 (10 detik)

// Anomaly Detection
CONSISTENT_HOT_DURATION = 5000 (5 detik)
TEMP_SPIKE_DEBOUNCE = 3000 (3 detik)
NEAR_MAX_DEBOUNCE = 5000 (5 detik)

// Immediate Events
DANGER_DEBOUNCE = 2000 (2 detik)
WARNING_DEBOUNCE = 3000 (3 detik)
```

**Logic**:
```javascript
const eventKey = `${brand}-${status}-${type}`;
const lastEventTime = lastEventTimeRef.current[eventKey] || 0;
const timeSinceLastEvent = currentTime - lastEventTime;
const shouldTrigger = timeSinceLastEvent >= DEBOUNCE_MS;
```

---

## 🔒 Privacy & Security Layer

### Architecture

```
Event Data
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

#### 2. **anonymize_event(event)**

**Lokasi**: `privacy/privacyUtils.js`

**Method**:
- Location masking
- Timestamp masking: Keep only date
- Confidence rounding: Round to nearest 10%
- Remove PII: userId, userName, userEmail

#### 3. **securityLog**

**Lokasi**: `privacy/securityLog.js`

**Methods**:
- `log(event)` - General logging
- `logEncryption(dataType, success)` - Encryption operations
- `logAnonymization(eventType, success)` - Anonymization operations
- `logAccess(resource, userId, success)` - Access attempts

**Storage**: localStorage (`stori_security_logs`)
**Max Logs**: 1000 entries

#### 4. **privacyAPI**

**Lokasi**: `privacy/privacyAPI.js`

**Features**:
- Compliance tracking (GDPR, CCPA, Local)
- Metrics: encrypted data count, anonymized events count
- Compliance score calculation

**Storage**: localStorage (`stori_privacy_status`)

---

## 🔔 Notification System

### Browser Notifications

**Architecture**:
```
Anomaly Detected
    │
    ├─> Check Notification Permission
    ├─> Generate Notification Message
    │   ├─> Title: Based on status (DANGER/WARNING)
    │   ├─> Body: Temperature + brand + reason
    │   └─> Tag: Unique tag untuk grouping
    │
    └─> showBrowserNotification(title, body, tag)
        ├─> Create Notification object
        ├─> Set icon
        ├─> Set requireInteraction: false
        └─> Display notification
```

### Notification Types

**DANGER**:
- Title: "🚨 DANGER: Komponen Overheat!"
- Body: "Suhu XX°C melebihi batas bahaya (XX°C) untuk {brand}. TINDAKAN SEGERA DIPERLUKAN!"

**WARNING**:
- Title: "⚠️ WARNING: Suhu Tinggi Terdeteksi"
- Body: "Suhu XX°C melebihi batas peringatan (XX°C) untuk {brand}."

**Near-Max**:
- Title: "⚠️ Warning: Suhu Mendekati Maksimum"
- Body: "Suhu XX°C berada pada maksimum ± 10% selama 5 detik - {brand}"

**Spike**:
- Title: "🚨 DANGER: Lonjakan Suhu Drastis!" / "⚠️ WARNING: Lonjakan Suhu Terdeteksi"
- Body: "Lonjakan suhu pada {brand}: +X°C dalam Y detik. Suhu saat ini XX°C."

### Permission Handling

```javascript
1. Check: Notification.permission
2. If 'default': Request permission
3. If 'granted': Show notification
4. If 'denied': Silent fail (no notification)
```

---

## 🔌 Arduino Integration

### Hardware Requirements

**Sensor**: MLX90614 atau sensor suhu lainnya
**Communication**: USB Serial (9600 baud)
**Format**: "Object Temperature: XX.XX °C"

### Connection Flow

```
1. User Action: Click "Connect Arduino"
   └─> connectSerialPort()

2. Port Selection
   └─> navigator.serial.requestPort()
       └─> User selects port (COM3, COM4, /dev/ttyUSB0, dll)

3. Port Opening
   └─> port.open({ baudRate: 9600 })
       ├─> Check if port already open
       └─> Handle errors (port in use, dll)

4. Reader Setup
   └─> port.readable.getReader()
       └─> Start readSerialData() loop

5. Data Reading
   └─> reader.read()
       ├─> Convert Uint8Array to string
       ├─> Append ke buffer
       └─> parseArduinoTemperature()

6. Disconnect
   └─> disconnectSerialPort()
       ├─> Cancel reader
       ├─> Close port
       └─> Cleanup state
```

### Error Handling

**Port Already in Use**:
- Check: `port.readable || port.writable`
- Error message: "Port sudah digunakan. Tutup Arduino IDE Serial Monitor..."

**Failed to Open**:
- Error message: "Port tidak dapat dibuka. Pastikan..."
- Cleanup: Reset port reference

**Parse Errors**:
- Validate temperature range: -50°C to 150°C
- Buffer management: Clear jika terlalu panjang

**Connection Timeout**:
- 3 second timeout untuk backend requests
- Silent fail untuk detection loop

---

## 📊 Data Flow Diagram

### Complete Flow: Detection → Event → Storage

```
┌─────────────┐
│   Camera    │
│   Feed      │
└──────┬──────┘
       │
       ▼
┌─────────────┐
│  Temperature│
│  Source     │
│  (Arduino/  │
│   RGB Sim)  │
└──────┬──────┘
       │
       ├─> Arduino Serial Port
       └─> RGB Simulation (fallback)
       │
       ▼
┌─────────────┐
│  Brand      │
│  Detection  │
│  (TF.js)    │
└──────┬──────┘
       │
       ▼
┌─────────────┐
│  Anomaly    │
│  Detection  │
└──────┬──────┘
       │ eventData
       ▼
┌─────────────┐
│ ThermalWatch│
│ Handler     │
└──────┬──────┘
       │
       ├─> Create Event Object
       │
       ├─> Privacy Layer
       │   ├─> anonymize_event()
       │   ├─> encrypt_data()
       │   └─> securityLog.log()
       │
       ├─> Save to localStorage
       │
       └─> Browser Notification
           └─> showBrowserNotification()
```

---

## 🔧 Configuration

### Model Paths

```javascript
// Brand Detection
MODEL_URL: '/keras_model/model.json'
LABELS_URL: '/keras_model/labels.txt'
CONFIDENCE_THRESHOLD: 80%

// Backend API
BACKEND_URL: 'http://localhost:3000/data'
SEND_INTERVAL: 300000 (5 menit)
```

### Temperature Thresholds

```javascript
// Gilbarco
min: -20°C
normalMax: 45°C
warning: 45°C
danger: 55°C

// Tatsuno
min: -25°C
normalMax: 55°C
warning: 55°C
danger: 65°C
```

### Anomaly Detection Parameters

```javascript
CONSISTENT_HOT_DURATION: 5000ms (5 detik)
TEMP_SPIKE_THRESHOLD: 5°C
NEAR_MAX_RANGE: ±10% dari normalMax
```

### Debounce Times

```javascript
EVENT_DEBOUNCE_MS: 10000ms (10 detik)
DANGER_DEBOUNCE: 2000ms (2 detik)
WARNING_DEBOUNCE: 3000ms (3 detik)
CONSISTENT_HOT_DEBOUNCE: 5000ms (5 detik)
TEMP_SPIKE_DEBOUNCE: 3000ms (3 detik)
```

### Detection Loop

```javascript
FPS: ~10 FPS (100ms delay)
FRAME_SIZE: 224x224 (untuk brand detection)
HEATMAP_BLEND: 60% original, 40% heatmap
```

---

## 📝 Summary

### Arsitektur ThermalWatch menggunakan:

1. **Multi-Source Temperature System**:
   - Arduino Serial Port (Primary) - Real-time temperature
   - RGB Simulation (Fallback) - Demo/simulation mode
   - Web Serial API untuk Arduino communication

2. **AI-Powered Brand Detection**:
   - TensorFlow.js untuk browser-based inference
   - Keras model (converted) untuk classification
   - Real-time brand detection dari camera feed

3. **Advanced Anomaly Detection**:
   - Consistent Hot Detection (5 detik)
   - Temperature Spike Detection (>5°C dalam <2s)
   - Near-Max Temperature Detection (±10% range)
   - Immediate event triggers untuk DANGER/WARNING

4. **Real-time Processing**:
   - requestAnimationFrame untuk smooth loop (~10 FPS)
   - Canvas API untuk frame processing
   - WebRTC/MediaDevices untuk camera access
   - Real-time state updates (no delay)

5. **Privacy-Preserving Layer**:
   - Data encryption (demo-level)
   - Event anonymization
   - Security logging
   - Compliance tracking

6. **Notification System**:
   - Browser notifications untuk alerts
   - Permission handling
   - Real-time alerts

7. **Data Persistence**:
   - LocalStorage untuk events
   - Backend API integration (optional)
   - Event history management

### Metode Deteksi:

1. **Image Classification** (TensorFlow.js): Brand Detection
2. **Serial Communication** (Web Serial API): Arduino Temperature
3. **RGB Analysis**: Temperature Simulation
4. **Anomaly Detection**: Multi-algorithm approach
5. **Status Determination**: Threshold-based classification

---

**Dokumen ini menjelaskan arsitektur lengkap sistem ThermalWatch. Untuk implementasi detail, lihat source code di masing-masing komponen.**

