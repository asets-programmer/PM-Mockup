"""
Script untuk mengkonversi model YOLOv8 (.pt) ke format ONNX
ONNX bisa dijalankan langsung di browser menggunakan ONNX.js
"""

from ultralytics import YOLO
import os

def convert_to_onnx(model_path='yolov8n.pt', output_path='yolov8n.onnx'):
    """
    Konversi model YOLOv8 ke ONNX
    
    Args:
        model_path: Path ke model YOLOv8 (.pt)
        output_path: Path output untuk model ONNX
    """
    print(f"Loading model from: {model_path}")
    
    # Load model
    model = YOLO(model_path)
    
    # Export ke ONNX
    print(f"Converting to ONNX...")
    model.export(
        format='onnx',
        imgsz=640,  # Input size
        simplify=True,  # Simplify ONNX model
        opset=12  # ONNX opset version
    )
    
    # Cari file ONNX yang dihasilkan (biasanya di folder yang sama)
    base_name = os.path.splitext(model_path)[0]
    onnx_file = f"{base_name}.onnx"
    
    if os.path.exists(onnx_file):
        print(f"✓ Model converted successfully: {onnx_file}")
        print(f"  File size: {os.path.getsize(onnx_file) / (1024*1024):.2f} MB")
        print(f"\nNext steps:")
        print(f"1. Copy {onnx_file} ke folder public/model_mobil_listrik/")
        print(f"2. Pastikan file bisa diakses di: /model_mobil_listrik/{os.path.basename(onnx_file)}")
        return onnx_file
    else:
        print(f"✗ Error: ONNX file tidak ditemukan")
        return None

if __name__ == "__main__":
    # Konversi model
    convert_to_onnx('yolov8n.pt', 'yolov8n.onnx')

