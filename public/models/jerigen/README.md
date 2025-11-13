# Jerigen Detection Model Setup

## Model File Location

Model YOLO untuk deteksi jerigen harus ditempatkan di folder ini:
```
public/models/jerigen/best.pt
```

## Cara Setup Model

### Opsi 1: Menggunakan Backend API (Recommended)

1. Setup backend API yang dapat menjalankan inference YOLO model
2. Update `USE_BACKEND_API = true` di `JerigenDetection.jsx`
3. Update `BACKEND_API_URL` sesuai dengan URL backend Anda
4. Backend API harus menerima POST request dengan form-data:
   - Field: `image` (file gambar)
   - Response: JSON dengan format:
     ```json
     {
       "detections": [
         {
           "class": "jerigen",
           "confidence": 0.95,
           "bbox": {
             "x": 100,
             "y": 150,
             "width": 200,
             "height": 300
           }
         }
       ]
     }
     ```

### Opsi 2: Konversi Model ke Format Browser-Compatible

Model `.pt` (PyTorch) perlu dikonversi ke format yang didukung browser:

#### A. Konversi ke ONNX

```python
# Install dependencies
pip install ultralytics onnx

# Convert model
from ultralytics import YOLO
model = YOLO('best.pt')
model.export(format='onnx')
```

Kemudian:
1. Copy file `best.onnx` ke `public/models/jerigen/best.onnx`
2. Install ONNX Runtime untuk JavaScript:
   ```bash
   npm install onnxruntime-web
   ```
3. Update `JerigenDetection.jsx` untuk menggunakan ONNX Runtime

#### B. Konversi ke TensorFlow.js

```python
# Install dependencies
pip install tensorflowjs

# Convert model (perlu konversi PyTorch -> TensorFlow dulu)
# Ini lebih kompleks, disarankan menggunakan ONNX atau Backend API
```

### Opsi 3: Menggunakan YOLOv8 JavaScript Library

Jika tersedia library YOLOv8 untuk JavaScript:
1. Install library YOLOv8 JavaScript
2. Update `JerigenDetection.jsx` untuk menggunakan library tersebut
3. Load model dari path `public/models/jerigen/best.pt`

## File Structure

```
public/
  models/
    jerigen/
      best.pt          # Model YOLO (PyTorch format)
      best.onnx        # Model ONNX (jika dikonversi)
      README.md        # File ini
```

## Testing

Untuk testing tanpa model yang sebenarnya, komponen `JerigenDetection` sudah memiliki simulasi deteksi yang dapat digunakan untuk development.

## Catatan

- Model `.pt` tidak dapat langsung digunakan di browser
- Disarankan menggunakan Backend API untuk production
- Untuk development/testing, gunakan simulasi deteksi yang sudah tersedia

