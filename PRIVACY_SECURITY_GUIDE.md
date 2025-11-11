# 🛡️ Panduan Penggunaan Privacy & Security Layer - Stori Sentinel

## 🚀 Cara Menjalankan Aplikasi

### 1. Install Dependencies (jika belum)
```bash
npm install
```

### 2. Jalankan Development Server
```bash
npm run dev
```

### 3. Buka Browser
- Buka URL yang ditampilkan di terminal (biasanya `http://localhost:5173`)
- Login ke dashboard Stori
- Navigasi ke halaman **Sentinel**

---

## 📍 Lokasi Fitur Privacy & Security

Setelah masuk ke halaman **Sentinel**, Anda akan melihat:

### 1. **Privacy & Security Panel** 
Panel baru yang muncul di atas tabel "Recent Safety Alerts" dengan:
- 🛡️ Icon Shield biru
- Status "Compliant" atau "At Risk"
- 3 Tab: Overview, Logs, Compliance

### 2. **Privacy-Protected Badge**
Badge biru kecil di header tabel "Recent Safety Alerts" yang menunjukkan bahwa data sudah dilindungi.

---

## 🎯 Cara Menggunakan Fitur

### **Tab 1: Overview** (Default)

Menampilkan:
- **Privacy Compliance Score**: Skor keseluruhan (0-100) dengan level (Excellent/Good/Fair/Poor)
- **Metrics Grid**:
  - 📦 **Data Encrypted**: Jumlah operasi enkripsi
  - 👁️ **Events Anonymized**: Jumlah event yang dianonimisasi
  - ⚠️ **Privacy Violations**: Pelanggaran privacy yang terdeteksi
  - 🔒 **Access Denied**: Percobaan akses yang ditolak
- **Privacy Features Status**: Status fitur (Encryption, Anonymization, Access Control, Audit Logging)

**Cara kerja:**
- Data otomatis terupdate setiap 5 detik
- Setiap alert yang muncul otomatis dienkripsi dan dianonimisasi
- Metrics bertambah secara real-time

---

### **Tab 2: Logs**

Menampilkan **Security Logs** dengan:
- Log terbaru (10 log terakhir)
- Informasi: timestamp, severity, category, message, details
- Status: Success (hijau) atau Error/Warning (merah/kuning)

**Jenis Log yang Tercatat:**
- ✅ **Encryption**: Operasi enkripsi data
- 👁️ **Anonymization**: Operasi anonimisasi event
- 🔐 **Access**: Percobaan akses ke resource
- 🎵 **Audio**: Playback audio alerts
- ⚠️ **Alert**: Security alerts
- 🔌 **API**: API calls
- 🖥️ **System**: System events

**Cara melihat lebih banyak log:**
- Logs tersimpan di localStorage browser
- Buka Developer Console (F12) → Application → Local Storage
- Cari key: `stori_security_logs`

---

### **Tab 3: Compliance**

Menampilkan status compliance dengan regulasi:
- **GDPR** (General Data Protection Regulation)
- **CCPA** (California Consumer Privacy Act)
- **Local Regulations**

Setiap regulasi menampilkan:
- Status Compliant (✅) atau Non-Compliant (⚠️)
- Compliance Score (0-100%)
- Progress bar visual

---

## 🔄 Alur Kerja Privacy Layer

### **Otomatis (Background Process)**

1. **Saat Alert Dibuat:**
   ```
   Alert Data → Anonymize Event → Encrypt Data → Store (with privacy metadata)
   ```

2. **Saat Alert Ditampilkan:**
   - Data asli tetap ditampilkan untuk user
   - Data terenkripsi/teranonimisasi tersimpan di `_privacy` object
   - Security log mencatat semua operasi

3. **Saat Audio Diputar:**
   - Security log mencatat akses audio
   - Privacy metrics tetap terupdate

### **Manual (Untuk Testing/Demo)**

Anda bisa test fungsi privacy secara manual melalui **Browser Console**:

```javascript
// Import utilities (jika perlu)
import { encrypt_data, anonymize_event } from './privacy/privacyUtils';
import { securityLog } from './privacy/securityLog';
import { privacyAPI } from './privacy/privacyAPI';

// Test Encryption
const data = { location: 'Pump 2', description: 'Test alert' };
const encrypted = encrypt_data(data);
console.log('Encrypted:', encrypted);

// Test Anonymization
const event = { 
  type: 'Spill Detected', 
  location: 'Pump 2', 
  description: 'Bensin tumpah',
  timestamp: new Date().toISOString()
};
const anonymized = anonymize_event(event);
console.log('Anonymized:', anonymized);

// Test Security Logging
securityLog.log({
  type: 'test',
  category: 'demo',
  severity: 'low',
  message: 'Test log entry',
  details: { test: true }
});

// Get Privacy Status
privacyAPI.getPrivacyStatus().then(status => {
  console.log('Privacy Status:', status);
});

// Get Security Logs
const logs = securityLog.getRecentLogs(20);
console.log('Recent Logs:', logs);

// Get Statistics
const stats = securityLog.getStatistics();
console.log('Statistics:', stats);
```

---

## 🎤 Demo Flow untuk Hackathon

### **Scenario 1: Normal Operation**
1. Buka halaman Sentinel
2. Lihat Privacy & Security Panel → Tab Overview
3. Perhatikan Compliance Score (harus tinggi, >90)
4. Lihat metrics: Data Encrypted dan Events Anonymized bertambah
5. Klik tab **Logs** → Lihat log "Sentinel dashboard initialized"
6. Klik tab **Compliance** → Lihat semua regulasi compliant

### **Scenario 2: Alert Processing**
1. Alert muncul di tabel "Recent Safety Alerts"
2. Klik **Play Audio** pada salah satu alert
3. Kembali ke tab **Logs** → Lihat log "Audio alert played"
4. Kembali ke tab **Overview** → Metrics tetap terupdate

### **Scenario 3: Security Monitoring**
1. Buka tab **Logs**
2. Perhatikan berbagai jenis log:
   - Encryption logs (setiap alert)
   - Anonymization logs (setiap alert)
   - Access logs (dashboard access)
   - Audio logs (saat play audio)
3. Filter berdasarkan severity (high/medium/low)
4. Lihat timestamp untuk tracking real-time

### **Scenario 4: Compliance Check**
1. Buka tab **Compliance**
2. Tunjukkan GDPR, CCPA, dan Local compliance
3. Jelaskan bahwa sistem otomatis menghitung compliance score
4. Tunjukkan bahwa semua regulasi compliant (score >90)

---

## 📊 Fitur Advanced (Untuk Development)

### **Reset Metrics** (Testing)
```javascript
// Di Browser Console
privacyAPI.resetMetrics();
location.reload(); // Refresh untuk lihat perubahan
```

### **Clear Security Logs** (Testing)
```javascript
// Di Browser Console
securityLog.clearLogs();
location.reload();
```

### **Simulate Privacy Violation** (Demo)
```javascript
// Di Browser Console
privacyAPI.recordViolation('test', 'Simulated violation for demo');
// Lihat di Overview → Privacy Violations bertambah
// Compliance status bisa berubah ke "At Risk"
```

---

## 🐛 Troubleshooting

### **Panel tidak muncul?**
- Pastikan file `PrivacySecurityPanel.jsx` ada di folder `privacy/`
- Cek console browser untuk error
- Pastikan import di `Sentinel.jsx` benar

### **Metrics tidak update?**
- Refresh halaman (F5)
- Cek localStorage: `stori_privacy_status` dan `stori_security_logs`
- Pastikan tidak ada error di console

### **Logs tidak muncul?**
- Cek apakah `securityLog` berfungsi di console
- Pastikan localStorage tidak penuh
- Cek browser compatibility (modern browser required)

---

## 📝 Catatan Penting

1. **Demo-Level**: Fitur ini adalah simulasi untuk demo hackathon
   - Encryption menggunakan XOR cipher (bukan AES real)
   - Anonymization adalah masking sederhana
   - Untuk production, gunakan library crypto yang proper

2. **Data Storage**: 
   - Privacy metrics disimpan di localStorage
   - Security logs disimpan di localStorage
   - Data hilang jika clear browser data

3. **Real-time Updates**:
   - Panel auto-refresh setiap 5 detik
   - Logs update saat ada event baru
   - Metrics update saat ada operasi privacy

4. **Privacy Compliance**:
   - Sistem otomatis menghitung compliance score
   - Score berdasarkan regulasi dan violations
   - Rekomendasi otomatis muncul jika ada masalah

---

## 🎯 Quick Start untuk Presentasi

1. **Buka Sentinel Dashboard**
2. **Tunjukkan Privacy & Security Panel** → "Ini adalah privacy-preserving AI layer"
3. **Klik Tab Overview** → "Compliance score menunjukkan sistem compliant"
4. **Klik Tab Logs** → "Semua operasi tercatat untuk audit"
5. **Klik Tab Compliance** → "Compliant dengan GDPR, CCPA, dan regulasi lokal"
6. **Klik Play Audio pada alert** → "Setiap akses dicatat di security log"
7. **Kembali ke Logs** → "Lihat log audio playback terbaru"

**Total waktu demo: ~2-3 menit**

---

## ✅ Checklist untuk Hackathon

- [x] Privacy & Security Panel terlihat di Sentinel
- [x] Compliance Score menampilkan angka (0-100)
- [x] Metrics (Encrypted, Anonymized) bertambah
- [x] Security Logs menampilkan entries
- [x] Compliance tab menampilkan regulasi
- [x] Badge "Privacy-Protected" muncul di alerts table
- [x] Tidak ada error di console browser
- [x] Auto-refresh bekerja (update setiap 5 detik)

---

**Selamat menggunakan! 🚀**

Untuk pertanyaan atau issue, cek console browser atau file-file di folder `privacy/`.

