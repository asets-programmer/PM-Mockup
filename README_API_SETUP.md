# Setup API untuk AI Maintenance Consultant

## 📋 Konfigurasi API URL

Halaman AI Maintenance Consultant menggunakan API dari project `engine-insight-quick`.

### 1. Setup Environment Variable

Buat file `.env` di root project PM-Mockup:

```env
VITE_API_URL=http://localhost:3000
```

**Untuk Production:**
```env
VITE_API_URL=https://your-api-domain.com
```

### 2. Jalankan API Server

Pastikan API server dari `engine-insight-quick` sudah berjalan:

```bash
# Di folder engine-insight-quick
npm run api:server
# atau
deno run --allow-net --allow-env api-server.ts --port 3000
```

API akan tersedia di: `http://localhost:3000/analyze-machine`

### 3. Test API

```bash
# Health check
curl http://localhost:3000/health

# Test analyze
curl -X POST http://localhost:3000/analyze-machine \
  -H "Content-Type: application/json" \
  -d '{"image": "data:image/jpeg;base64,/9j/4AAQSkZJRg..."}'
```

## 🔧 Cara Menggunakan

1. **Start API Server** (di folder engine-insight-quick):
   ```bash
   npm run api:server
   ```

2. **Start Frontend** (di folder PM-Mockup):
   ```bash
   npm run dev
   ```

3. **Akses Halaman:**
   - Buka http://localhost:5173 (atau port Vite yang digunakan)
   - Klik card "AI Maintenance Consultant" di section Freemium Popular Features
   - Upload gambar mesin
   - Dapatkan analisis

## 📝 Catatan

- Default API URL: `http://localhost:3000` (jika VITE_API_URL tidak di-set)
- Pastikan API server berjalan sebelum menggunakan fitur ini
- API menggunakan Groq API untuk analisis gambar

## 🐛 Troubleshooting

### API tidak terhubung
- Pastikan API server sudah berjalan
- Cek URL di `.env` file
- Cek console browser untuk error

### CORS Error
- Pastikan API server sudah mengaktifkan CORS
- API server sudah dikonfigurasi untuk allow all origins

### Image upload error
- Pastikan format gambar: JPG, PNG, WEBP
- Ukuran gambar akan dikompres otomatis sebelum dikirim

