# Logo Setup Instructions

## 🎨 **Mengganti Logo Stori di Sidebar**

### **Langkah 1: Simpan File Logo**
1. Simpan file `Stori.jpg` yang Anda berikan ke dalam folder `public/` di root project
2. Rename file tersebut menjadi `stori-logo.png` (atau tetap .jpg jika lebih suka)
3. Pastikan file berada di: `public/stori-logo.png`

### **Langkah 2: Update Path di Sidebar.jsx**
Jika Anda ingin menggunakan format .jpg, ubah path di file `src/komponen/Sidebar.jsx`:

```jsx
<img 
  src="/stori-logo.jpg"  // Ubah dari .png ke .jpg
  alt="Stori Logo" 
  className="w-full h-full object-contain"
/>
```

### **Langkah 3: Verifikasi**
- Pastikan logo muncul di sidebar
- Logo akan otomatis menyesuaikan ukuran dengan container
- Text "STORI" dan "PREVENTIVE MAINTENANCE" akan muncul di sebelah logo

### **Alternatif: Menggunakan Base64**
Jika Anda ingin embed logo langsung ke dalam kode, konversi file gambar ke base64 dan ganti src dengan data URL.

### **Ukuran Logo yang Direkomendasikan**
- Format: PNG atau JPG
- Ukuran: 40x40 pixels atau lebih besar
- Background: Transparent (PNG) atau sesuai kebutuhan

---

**Catatan:** Setelah menyimpan file logo ke folder `public/`, logo akan otomatis muncul di sidebar dengan branding Stori yang baru.
