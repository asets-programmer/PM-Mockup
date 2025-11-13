"""
Backend API Server untuk Car Motion Detection
Menggunakan Flask untuk endpoint API
"""

from flask import Flask, request, jsonify
from flask_cors import CORS
import cv2
import numpy as np
import base64
import io
from PIL import Image
import time
from car_motion_detector import CarMotionDetector
import logging

# Setup logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = Flask(__name__)
CORS(app)  # Enable CORS untuk frontend

# Initialize detector
detector = None
prev_car_positions = []
prev_frame_stats = None
duration_start_time = None
last_motion_time = None
is_tracking_duration = False
frozen_duration = None

def init_detector():
    """Initialize Car Motion Detector"""
    global detector
    try:
        logger.info("Initializing Car Motion Detector...")
        detector = CarMotionDetector(
            model_path='yolov8n.pt',
            conf_threshold=0.25,
            segments=20,
            motion_threshold=10.0,
            delay_seconds=1.0
        )
        logger.info("✓ Detector initialized successfully")
        return True
    except Exception as e:
        logger.error(f"Failed to initialize detector: {e}")
        return False

@app.route('/api/car-motion-detect', methods=['POST'])
def detect_car_motion():
    """Endpoint untuk deteksi mobil dan motion detection"""
    global prev_car_positions, prev_frame_stats
    global duration_start_time, last_motion_time, is_tracking_duration, frozen_duration
    
    try:
        # Get image from request
        if 'image' not in request.files:
            return jsonify({'error': 'No image provided'}), 400
        
        file = request.files['image']
        
        # Read image
        image_bytes = file.read()
        nparr = np.frombuffer(image_bytes, np.uint8)
        frame = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
        
        if frame is None:
            return jsonify({'error': 'Invalid image format'}), 400
        
        # Process frame menggunakan detector
        results = detector.process_frame(frame)
        
        # Format response
        cars = []
        for car in results['cars']:
            cars.append({
                'class': 'car',
                'confidence': car['confidence'],
                'bbox': {
                    'x': int(car['bbox'][0]),
                    'y': int(car['bbox'][1]),
                    'width': int(car['bbox'][2]),
                    'height': int(car['bbox'][3])
                }
            })
        
        # Return results
        return jsonify({
            'cars': cars,
            'isMoving': results['is_moving'],
            'duration': results['duration'],
            'status': 'MOVING' if results['is_moving'] else ('STATIONARY' if len(cars) > 0 else 'NO CAR'),
            'timestamp': time.time()
        })
        
    except Exception as e:
        logger.error(f"Error in detection: {e}")
        return jsonify({'error': str(e)}), 500

@app.route('/api/health', methods=['GET'])
def health():
    """Health check endpoint"""
    return jsonify({
        'status': 'healthy',
        'detector_loaded': detector is not None
    })

@app.route('/api/reset', methods=['POST'])
def reset():
    """Reset tracking state"""
    global prev_car_positions, prev_frame_stats
    global duration_start_time, last_motion_time, is_tracking_duration, frozen_duration
    
    prev_car_positions = []
    prev_frame_stats = None
    duration_start_time = None
    last_motion_time = time.time()
    is_tracking_duration = False
    frozen_duration = None
    
    # Reset detector state
    if detector:
        detector.prev_car_positions = []
        detector.prev_stats = None
        detector.duration_start_time = None
        detector.last_motion_time = time.time()
        detector.is_tracking_duration = False
        detector.frozen_duration = None
    
    return jsonify({'status': 'reset'})

if __name__ == '__main__':
    # Initialize detector
    if not init_detector():
        logger.error("Failed to initialize detector. Exiting...")
        exit(1)
    
    # Run server
    logger.info("Starting API server on http://localhost:8000")
    app.run(host='0.0.0.0', port=8000, debug=True)

