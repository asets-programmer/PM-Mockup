from keras.models import load_model
import cv2
import numpy as np
import time
import requests

# =============== SETUP MODEL ===============
np.set_printoptions(suppress=True)
model = load_model("keras_model.h5", compile=False)
class_names = open("labels.txt", "r").readlines()

# =============== SETUP CAMERA ===============
camera = cv2.VideoCapture(0)
camera.set(3, 640)
camera.set(4, 480)

# =============== BACKEND CONFIG ===============
BACKEND_URL = "http://localhost:3000/data"

# Timer untuk interval kirim
last_send_time = 0
SEND_INTERVAL = 300  # 5 menit = 300 detik

while True:
    ret, frame = camera.read()
    if not ret:
        print("Gagal membaca kamera!")
        break

    # Resize ke input model
    img_resized = cv2.resize(frame, (224, 224), interpolation=cv2.INTER_AREA)
    img_array = np.asarray(img_resized, dtype=np.float32).reshape(1, 224, 224, 3)
    img_array = (img_array / 127.5) - 1

    # Prediksi
    prediction = model.predict(img_array, verbose=0)
    index = np.argmax(prediction)
    class_name = class_names[index].strip()
    confidence = float(prediction[0][index]) * 100

    # =============== SIMULASI SUHU DARI RGB ===============
    R = np.mean(frame[:, :, 2])
    G = np.mean(frame[:, :, 1])
    B = np.mean(frame[:, :, 0])
    temp_value = (0.6 * R + 0.3 * G + 0.1 * B)
    simulated_temp = 25 + (temp_value / 255) * 35  # 25°C–60°C

    # =============== STATUS SUHU ===============
    if simulated_temp < 40:
        status = "COOL"
        color = (0, 255, 255)
    elif 40 <= simulated_temp < 45:
        status = "NORMAL"
        color = (0, 255, 0)
    elif 45 <= simulated_temp < 50:
        status = "WARNING"
        color = (0, 165, 255)
    else:
        status = "DANGER"
        color = (0, 0, 255)

    # =============== VISUALISASI (heatmap) ===============
    heat_source = frame[:, :, 2]
    heatmap = cv2.applyColorMap(heat_source, cv2.COLORMAP_JET)
    overlay = cv2.addWeighted(frame, 0.6, heatmap, 0.4, 0)

    # Tambah overlay teks
    cv2.rectangle(overlay, (10, 10), (450, 90), (0, 0, 0), -1)
    cv2.putText(overlay, f"Class: {class_name[2:]} ({confidence:.1f}%)", (20, 35),
                cv2.FONT_HERSHEY_SIMPLEX, 0.7, (0,255,0), 2)
    cv2.putText(overlay, f"Temp: {simulated_temp:.1f}°C | Status: {status}", (20, 70),
                cv2.FONT_HERSHEY_SIMPLEX, 0.7, color, 2)

    # Tampilkan frame hasil
    cv2.imshow("SPBU Heat Detection System", overlay)

    # =============== PENGIRIMAN DATA ===============
    current_time = time.time()
    should_send = False

    # kirim jika sudah 5 menit
    if current_time - last_send_time >= SEND_INTERVAL:
        should_send = True

    # kirim segera jika danger
    if status == "DANGER":
        should_send = True

    if should_send:
        payload = {
            "class": class_name[2:].strip(),
            "confidence": round(confidence, 2),
            "temperature": round(simulated_temp, 2),
            "status": status,
            "timestamp": time.strftime("%Y-%m-%d %H:%M:%S")
        }
        try:
            response = requests.post(BACKEND_URL, json=payload, timeout=3)
            if response.status_code == 200:
                print(f"📤 Data terkirim: {payload}")
        except Exception as e:
            print("⚠️ Gagal kirim ke backend:", e)
        last_send_time = current_time

    # =============== KELUAR ===============
    key = cv2.waitKey(1) & 0xFF
    if key == ord('q') or key == 27:
        print("👋 Keluar dari program...")
        break

camera.release()
cv2.destroyAllWindows()
