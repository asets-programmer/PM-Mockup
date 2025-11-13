# Cara Menggunakan Model YOLOv8 di Frontend (ONNX)

## Langkah 1: Konversi Model ke ONNX

Jalankan script konversi:

```bash
cd PM-Mockup/public/model_mobil_listrik
python convert_to_onnx.py
```

Script ini akan:
- Load model `yolov8n.pt`
- Konversi ke format ONNX
- Generate file `yolov8n.onnx`

## Langkah 2: Pastikan File ONNX Ada

Setelah konversi, pastikan file `yolov8n.onnx` ada di:
```
PM-Mockup/public/model_mobil_listrik/yolov8n.onnx
```

## Langkah 3: Jalankan Aplikasi

1. Start React dev server:
   ```bash
   npm run dev
   ```

2. Buka aplikasi dan navigasi ke fitur Sentinel

3. Klik "Start Detection" pada Car Motion Detection

## Catatan

- Model ONNX akan di-load langsung di browser menggunakan ONNX Runtime
- Tidak perlu backend API
- Model akan didownload saat pertama kali digunakan
- Pastikan koneksi internet stabil untuk download model pertama kali

## Troubleshooting

### Error: "Model file tidak ditemukan"
- Pastikan file `yolov8n.onnx` ada di folder `public/model_mobil_listrik/`
- Jalankan `convert_to_onnx.py` untuk generate file

### Error: "ONNX Runtime tidak tersedia"
- Pastikan CDN ONNX Runtime sudah dimuat di `index.html`
- Check console browser untuk error loading CDN

### Model terlalu besar
- Model YOLOv8n sekitar 6MB
- Pertimbangkan menggunakan model yang lebih kecil atau kompresi

