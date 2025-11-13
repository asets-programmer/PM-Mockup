# Car Motion Detection API Server

Backend API server untuk menjalankan model YOLOv8 Car Motion Detection.

## Setup

1. Install dependencies:
```bash
pip install -r requirements_api.txt
```

Atau gunakan batch file:
```bash
start_api.bat
```

## Menjalankan Server

```bash
python api_server.py
```

Server akan berjalan di `http://localhost:8000`

## Endpoints

### POST `/api/car-motion-detect`
Endpoint utama untuk deteksi mobil dan motion detection.

**Request:**
- Method: POST
- Content-Type: multipart/form-data
- Body: `image` (file gambar)

**Response:**
```json
{
  "cars": [
    {
      "class": "car",
      "confidence": 0.85,
      "bbox": {
        "x": 100,
        "y": 150,
        "width": 200,
        "height": 150
      }
    }
  ],
  "isMoving": false,
  "duration": 45.5,
  "status": "STATIONARY",
  "timestamp": 1234567890.123
}
```

### GET `/api/health`
Health check endpoint.

**Response:**
```json
{
  "status": "healthy",
  "detector_loaded": true
}
```

### POST `/api/reset`
Reset tracking state.

**Response:**
```json
{
  "status": "reset"
}
```

## Catatan

- Pastikan model `yolov8n.pt` ada di folder yang sama dengan `api_server.py`
- Model akan didownload otomatis saat pertama kali dijalankan jika belum ada
- Server menggunakan CORS untuk mengizinkan request dari frontend

