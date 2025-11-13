# Setup Keras Model untuk ThermalDetection

## Konversi Model Keras ke TensorFlow.js

Untuk menggunakan model Keras (`keras_model.h5`) di JavaScript, Anda perlu mengkonversinya ke format TensorFlow.js.

### ⚠️ Masalah Kompatibilitas NumPy 2.x

Jika Anda menggunakan NumPy 2.x, `tensorflowjs` akan error karena menggunakan `np.object` dan `np.bool` yang sudah dihapus.

### Solusi 1: Menggunakan Script Python (Disarankan)

1. **Install TensorFlow.js converter:**
```bash
pip install tensorflowjs
```

2. **Uninstall tensorflow-hub (tidak diperlukan dan menyebabkan error):**
```bash
pip uninstall tensorflow-hub -y
```

3. **Fix kompatibilitas dengan NumPy 2.x:**
```bash
python fix_tensorflowjs.py
```

4. **Fix masalah tensorflow_hub (opsional, jika masih error):**
```bash
python fix_tensorflow_hub.py
```

5. **Konversi model menggunakan script Python:**
```bash
# Dengan argumen (non-interaktif)
python convert_model.py keras_model.h5 public/keras_model/

# Atau tanpa argumen (interaktif)
python convert_model.py
```

Script akan meminta path ke model dan output folder jika tidak diberikan sebagai argumen.

**Catatan:** Script `convert_model.py` sudah memiliki mock untuk `tensorflow_hub`, jadi seharusnya tidak perlu install ulang `tensorflow-hub`.

### Solusi 1b: Menggunakan CLI (Jika Solusi 1 tidak bekerja)

Jika script Python tidak bekerja, coba CLI:
```bash
tensorflowjs_converter --input_format keras keras_model.h5 public/keras_model/
```

### Solusi 2: Downgrade NumPy (Alternatif)

Jika Solusi 1 tidak bekerja, downgrade NumPy:

```bash
pip install "numpy<2.0"
```

Kemudian konversi model:
```bash
tensorflowjs_converter --input_format keras keras_model.h5 public/keras_model/
```

### Solusi 3: Gunakan TensorFlow.js Converter Online

Jika kedua solusi di atas tidak bekerja, gunakan converter online:
- https://convertmodel.com/
- Upload `keras_model.h5` dan download hasil konversi

### Setelah Konversi:

1. **Struktur file yang dihasilkan:**
```
public/keras_model/
  ├── model.json          # Model architecture dan weights metadata
  ├── weights_*.bin       # Model weights (bisa beberapa file)
  └── labels.txt          # Label classes (buat manual)
```

2. **Buat file labels.txt:**
Buat file `labels.txt` di folder `public/keras_model/` dengan format:
```
Gilbarco
Tatsuno
```

Atau sesuai dengan urutan class di model Anda.

### Catatan:
- Model akan di-load dari `/keras_model/model.json`
- Pastikan semua file model ada di folder `public/keras_model/`
- TensorFlow.js sudah dimuat via CDN di `index.html`

### Testing:
Setelah konversi, pastikan file-file berikut ada:
- `public/keras_model/model.json`
- `public/keras_model/weights_*.bin` (satu atau lebih file)
- `public/keras_model/labels.txt`

