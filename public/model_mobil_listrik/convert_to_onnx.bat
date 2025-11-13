@echo off
echo ========================================
echo Konversi Model YOLOv8 ke ONNX
echo ========================================
echo.

REM Check if Python is available
python --version >nul 2>&1
if errorlevel 1 (
    echo ERROR: Python tidak ditemukan!
    echo Pastikan Python sudah terinstall dan ada di PATH
    pause
    exit /b 1
)

echo Python ditemukan, melanjutkan konversi...
echo.

REM Install dependencies if needed
echo Installing/checking dependencies...
pip install ultralytics onnx --quiet

echo.
echo ========================================
echo Memulai konversi model...
echo ========================================
echo.

REM Run conversion script
python convert_to_onnx.py

echo.
echo ========================================
echo Selesai!
echo ========================================
echo.
echo Pastikan file yolov8n.onnx ada di folder ini
echo File akan digunakan langsung di browser tanpa API
echo.

pause

