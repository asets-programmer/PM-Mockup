# Car Motion Detection dengan Duration Tracking

Proyek ini menggabungkan **object detection** (untuk mendeteksi mobil) dan **motion detection** (untuk mendeteksi gerakan mobil) dengan fitur tracking durasi.

## Fitur

- ✅ Deteksi mobil menggunakan YOLOv8
- ✅ Deteksi gerakan mobil dengan membandingkan posisi antar frame
- ✅ Tracking durasi saat mobil **diam**
- ✅ Duration direset saat mobil **bergerak**
- ✅ Visualisasi real-time dengan bounding box dan duration counter

## Logika Kerja

1. **Mobil terdeteksi + Diam** → Duration mulai dihitung dan ditampilkan
2. **Mobil terdeteksi + Bergerak** → Duration direset (tidak ditampilkan)
3. **Tidak ada mobil** → Tidak ada duration

## Instalasi

1. Install dependencies:
```bash
pip install -r requirements.txt
```

2. Download model YOLO (otomatis saat pertama kali dijalankan):
   - Model default: `yolov8n.pt` (akan didownload otomatis oleh ultralytics)
   - Atau gunakan model yang sudah ada di folder `OptiVision-AI-Platform/`

## Penggunaan

### Menggunakan Webcam
```bash
python car_motion_detector.py
```

### Menggunakan Video File
```bash
python car_motion_detector.py --source "path/to/video.mp4"
```

### Menggunakan Model YOLO Lain
```bash
python car_motion_detector.py --model "yolov8x.pt"
```

### Parameter Lainnya
```bash
python car_motion_detector.py \
    --source 0 \
    --model yolov8n.pt \
    --conf 0.25 \
    --segments 20 \
    --motion-threshold 10.0 \
    --delay 1.0
```

**Parameter:**
- `--source`: Video source (0 untuk webcam, atau path ke file video)
- `--model`: Path ke model YOLO (default: yolov8n.pt)
- `--conf`: Confidence threshold untuk deteksi (default: 0.25)
- `--segments`: Jumlah segment untuk motion detection (default: 20)
- `--motion-threshold`: Threshold untuk mendeteksi gerakan (default: 10.0)
- `--delay`: Delay sebelum mulai menghitung duration dalam detik (default: 1.0)

## Kontrol

- Tekan **'q'** untuk keluar dari aplikasi

## Output

Aplikasi akan menampilkan:
- **Bounding box hijau**: Mobil yang diam
- **Bounding box merah**: Mobil yang bergerak
- **Duration counter**: Durasi mobil dalam keadaan diam (format: HH:MM:SS)
- **Status text**: Status deteksi (MOVING, STATIONARY, NO CAR DETECTED)

## Contoh Penggunaan dalam Kode

```python
from car_motion_detector import CarMotionDetector

# Inisialisasi detector
detector = CarMotionDetector(
    model_path='yolov8n.pt',
    conf_threshold=0.25,
    segments=20,
    motion_threshold=10.0,
    delay_seconds=1.0
)

# Jalankan dengan webcam
detector.run(0)

# Atau process frame per frame
import cv2
cap = cv2.VideoCapture(0)
while True:
    ret, frame = cap.read()
    if not ret:
        break
    
    results = detector.process_frame(frame)
    output_frame = detector.draw_results(frame, results)
    
    cv2.imshow('Output', output_frame)
    if cv2.waitKey(1) & 0xFF == ord('q'):
        break
```

## Catatan

- Model YOLOv8 akan didownload otomatis saat pertama kali dijalankan
- Untuk performa lebih baik, gunakan GPU (CUDA) jika tersedia
- Semakin banyak segments, semakin akurat motion detection tapi lebih lambat
- Threshold motion yang lebih rendah = lebih sensitif terhadap gerakan

## Struktur Proyek

```
car-motion-detection/
├── car_motion_detector.py  # File utama
├── requirements.txt        # Dependencies
└── README.md              # Dokumentasi
```

## Lisensi

Proyek ini menggabungkan:
- Object Detection dari OptiVision-AI-Platform
- Motion Detection dari segmental-motion-detection

