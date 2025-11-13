# Quick Start Guide

## Instalasi Cepat

1. **Install dependencies:**
```bash
pip install -r requirements.txt
```

2. **Jalankan dengan webcam:**
```bash
python car_motion_detector.py
```
atau double-click `run.bat`

3. **Jalankan dengan video file:**
```bash
python car_motion_detector.py --source "path/to/video.mp4"
```
atau double-click `run_video.bat` dan masukkan path video

## Cara Kerja

- **Mobil terdeteksi + DIAM** → Duration muncul dan terus bertambah
- **Mobil terdeteksi + BERGERAK** → Duration direset (tidak muncul)
- **Tidak ada mobil** → Tidak ada duration

## Kontrol

- Tekan **'q'** untuk keluar

## Troubleshooting

**Model tidak ditemukan?**
- Model YOLOv8 akan didownload otomatis saat pertama kali dijalankan
- Atau copy model dari `../OptiVision-AI-Platform/yolov8n.pt`

**Webcam tidak terbuka?**
- Pastikan webcam tidak digunakan aplikasi lain
- Coba ubah `--source 0` menjadi `--source 1` atau `--source 2`

**Deteksi tidak akurat?**
- Turunkan `--conf` untuk lebih banyak deteksi (contoh: `--conf 0.15`)
- Naikkan `--conf` untuk deteksi lebih akurat (contoh: `--conf 0.4`)

