import cv2
import numpy as np
import time
from datetime import datetime
import logging
import torch
from ultralytics import YOLO

# Set up logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class CarMotionDetector:
    """
    Deteksi mobil dengan tracking durasi saat mobil diam.
    - Jika mobil bergerak: duration direset (tidak ditampilkan)
    - Jika mobil diam: duration ditampilkan dan terus bertambah
    """
    
    def __init__(self, 
                 model_path='yolov8n.pt',
                 conf_threshold=0.25,
                 segments=20,
                 motion_threshold=10,
                 delay_seconds=1.0):
        """
        Initialize Car Motion Detector
        
        Args:
            model_path: Path ke model YOLO
            conf_threshold: Confidence threshold untuk deteksi mobil
            segments: Jumlah segment untuk motion detection
            motion_threshold: Threshold untuk mendeteksi gerakan
            delay_seconds: Delay sebelum mulai menghitung duration (detik)
        """
        self.conf_threshold = conf_threshold
        self.segments = segments
        self.motion_threshold = motion_threshold
        self.delay_seconds = delay_seconds
        
        # Class ID untuk mobil di COCO dataset
        self.CAR_CLASS_ID = 2  # 'car' di COCO
        
        # Device
        self.device = 'cuda' if torch.cuda.is_available() else 'cpu'
        logger.info(f"Using device: {self.device}")
        
        # Load YOLO model
        self._load_model(model_path)
        
        # Motion detection state
        self.last_motion_time = time.time()
        self.duration_start_time = None
        self.is_tracking_duration = False
        self.frozen_duration = None  # Simpan duration terakhir saat mobil bergerak
        
        # Previous frame stats untuk motion detection
        self.prev_stats = None
        
        # Previous car positions untuk tracking gerakan mobil
        self.prev_car_positions = []
        
    def _load_model(self, model_path):
        """Load YOLO model"""
        try:
            logger.info(f"Loading YOLO model from {model_path}...")
            self.model = YOLO(model_path)
            self.model.to(self.device)
            logger.info("✓ Model loaded successfully")
        except Exception as e:
            logger.error(f"Failed to load model: {e}")
            raise
    
    def segment_calculation(self, frame):
        """
        Hitung statistik untuk setiap segment frame
        Digunakan untuk mendeteksi gerakan umum di frame
        """
        frame_height, frame_width = frame.shape[:2]
        segment_height = frame_height // self.segments
        segment_width = frame_width // self.segments
        stats = []
        
        for i in range(self.segments):
            row_stats = []
            for j in range(self.segments):
                start_y = i * segment_height
                end_y = (i + 1) * segment_height if (i + 1) * segment_height < frame_height else frame_height
                start_x = j * segment_width
                end_x = (j + 1) * segment_width if (j + 1) * segment_width < frame_width else frame_width
                
                segment = frame[start_y:end_y, start_x:end_x]
                segment_average = np.mean(segment)
                segment_standard_deviation = np.std(segment)
                row_stats.append((segment_average, segment_standard_deviation))
            stats.append(row_stats)
        
        return stats
    
    def detect_movement(self, previous_stats, current_stats):
        """
        Deteksi gerakan dengan membandingkan statistik segment
        """
        movement_detected = False
        movement_segments = []
        
        if previous_stats is None or current_stats is None:
            return False, []
        
        for i in range(min(len(previous_stats), len(current_stats))):
            for j in range(min(len(previous_stats[i]), len(current_stats[i]))):
                avg_diff = abs(previous_stats[i][j][0] - current_stats[i][j][0])
                std_diff = abs(previous_stats[i][j][1] - current_stats[i][j][1])
                
                if avg_diff > self.motion_threshold or std_diff > self.motion_threshold:
                    movement_detected = True
                    movement_segments.append((i, j))
        
        return movement_detected, movement_segments
    
    def detect_car_movement(self, current_cars, previous_cars):
        """
        Deteksi apakah mobil bergerak dengan membandingkan posisi mobil
        antara frame sekarang dan sebelumnya
        """
        if not current_cars or not previous_cars:
            return False
        
        # Hitung perpindahan rata-rata mobil
        total_displacement = 0
        matched_count = 0
        
        for curr_car in current_cars:
            curr_center = self._get_center(curr_car['bbox'])
            
            # Cari mobil terdekat di frame sebelumnya
            min_distance = float('inf')
            for prev_car in previous_cars:
                prev_center = self._get_center(prev_car['bbox'])
                distance = np.sqrt((curr_center[0] - prev_center[0])**2 + 
                                  (curr_center[1] - prev_center[1])**2)
                if distance < min_distance:
                    min_distance = distance
            
            if min_distance < float('inf'):
                total_displacement += min_distance
                matched_count += 1
        
        if matched_count == 0:
            return True  # Mobil baru muncul, anggap bergerak
        
        avg_displacement = total_displacement / matched_count
        
        # Jika perpindahan > threshold, mobil dianggap bergerak
        movement_threshold = 20  # pixels
        return avg_displacement > movement_threshold
    
    def _get_center(self, bbox):
        """Hitung center point dari bounding box"""
        x, y, w, h = bbox
        return (x + w // 2, y + h // 2)
    
    def detect_cars(self, frame):
        """
        Deteksi mobil di frame menggunakan YOLO
        Hanya return deteksi mobil (class_id = 2)
        """
        try:
            # Run YOLO inference
            results = self.model(frame, conf=self.conf_threshold, verbose=False)
            
            cars = []
            for result in results:
                boxes = result.boxes
                if boxes is not None and len(boxes) > 0:
                    xyxy = boxes.xyxy.cpu().numpy()
                    conf = boxes.conf.cpu().numpy()
                    cls = boxes.cls.cpu().numpy().astype(int)
                    
                    for i in range(len(xyxy)):
                        class_id = int(cls[i])
                        
                        # Hanya ambil deteksi mobil
                        if class_id == self.CAR_CLASS_ID:
                            x1, y1, x2, y2 = xyxy[i]
                            confidence = float(conf[i])
                            
                            x = int(x1)
                            y = int(y1)
                            w = int(x2 - x1)
                            h = int(y2 - y1)
                            
                            cars.append({
                                'bbox': [x, y, w, h],
                                'confidence': confidence
                            })
            
            return cars
            
        except Exception as e:
            logger.error(f"Error detecting cars: {e}")
            return []
    
    def process_frame(self, frame):
        """
        Process satu frame: deteksi mobil, deteksi gerakan, update duration
        
        Returns:
            dict dengan informasi:
            - cars: list mobil yang terdeteksi
            - is_moving: apakah mobil bergerak
            - duration: durasi mobil diam (dalam detik, None jika bergerak)
            - movement_segments: segment yang terdeteksi gerakan
        """
        # Convert ke grayscale untuk motion detection
        gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
        current_stats = self.segment_calculation(gray)
        
        # Deteksi gerakan umum di frame
        general_movement, movement_segments = self.detect_movement(
            self.prev_stats, current_stats
        )
        
        # Deteksi mobil
        cars = self.detect_cars(frame)
        
        # Deteksi apakah mobil bergerak
        car_moving = False
        if cars:
            if self.prev_car_positions:
                car_moving = self.detect_car_movement(cars, self.prev_car_positions)
            else:
                # Mobil baru muncul, anggap bergerak
                car_moving = True
        
        # Update state berdasarkan kondisi
        current_time = time.time()
        
        if cars and not car_moving:
            # Mobil terdeteksi dan DIAM → Duration JALAN (bertambah)
            # Update last motion time jika ada gerakan umum (untuk delay)
            if general_movement:
                self.last_motion_time = current_time
            
            # Cek apakah sudah melewati delay sejak gerakan terakhir
            time_since_last_motion = current_time - self.last_motion_time
            
            if time_since_last_motion >= self.delay_seconds:
                # Sudah melewati delay, mulai/lanjutkan tracking duration
                if not self.is_tracking_duration:
                    # Jika ada frozen duration, lanjutkan dari nilai tersebut
                    if self.frozen_duration is not None:
                        # Lanjutkan dari duration yang di-freeze
                        self.duration_start_time = current_time - self.frozen_duration
                        self.frozen_duration = None
                        logger.info(f"Mobil diam - lanjutkan duration dari {self.duration_start_time}")
                    else:
                        # Mulai tracking duration baru
                        self.duration_start_time = current_time - (time_since_last_motion - self.delay_seconds)
                        logger.info("Mobil terdeteksi dan diam - mulai tracking duration")
                    self.is_tracking_duration = True
                
                # Hitung duration (duration JALAN saat mobil diam)
                duration = current_time - self.duration_start_time
            else:
                # Masih dalam delay
                if self.is_tracking_duration:
                    # Simpan duration saat ini sebelum reset
                    self.frozen_duration = current_time - self.duration_start_time
                    self.is_tracking_duration = False
                    self.duration_start_time = None
                # Tampilkan frozen duration jika ada
                duration = self.frozen_duration if self.frozen_duration is not None else None
        else:
            # Mobil bergerak atau tidak ada mobil → Duration BERHENTI (freeze)
            if car_moving and cars:
                # Mobil bergerak → Simpan duration terakhir dan freeze
                if self.is_tracking_duration:
                    # Simpan duration terakhir sebelum mobil bergerak
                    self.frozen_duration = current_time - self.duration_start_time
                    self.is_tracking_duration = False
                    self.duration_start_time = None
                    logger.info(f"Mobil bergerak - duration berhenti di {self.frozen_duration:.2f} detik")
                # Jika sudah ada frozen_duration, tetap gunakan (tidak update)
                # Tampilkan frozen duration (duration BERHENTI, tidak bertambah)
                duration = self.frozen_duration if self.frozen_duration is not None else None
                
                # Update last motion time saat mobil bergerak
                self.last_motion_time = current_time
            else:
                # Tidak ada mobil → Reset semua
                if self.is_tracking_duration:
                    self.is_tracking_duration = False
                    self.duration_start_time = None
                self.frozen_duration = None
                duration = None
        
        # Update previous state
        self.prev_stats = current_stats
        self.prev_car_positions = cars
        
        return {
            'cars': cars,
            'is_moving': car_moving,
            'duration': duration,
            'movement_segments': movement_segments,
            'general_movement': general_movement
        }
    
    def draw_results(self, frame, results):
        """
        Draw hasil deteksi pada frame
        """
        result_frame = frame.copy()
        frame_height, frame_width = result_frame.shape[:2]
        
        # Format duration untuk ditampilkan
        if results['duration'] is not None:
            hours = int(results['duration'] // 3600)
            minutes = int((results['duration'] % 3600) // 60)
            seconds = int(results['duration'] % 60)
            duration_str = f"{hours:02d}:{minutes:02d}:{seconds:02d}"
        else:
            duration_str = "00:00:00"
        
        # Draw bounding box untuk setiap mobil
        for car in results['cars']:
            x, y, w, h = car['bbox']
            confidence = car['confidence']
            
            # Draw bounding box
            color = (0, 255, 0) if not results['is_moving'] else (0, 0, 255)
            thickness = 3 if not results['is_moving'] else 2
            cv2.rectangle(result_frame, (x, y), (x + w, y + h), color, thickness)
            
            # Draw label dengan duration
            if results['is_moving']:
                label = f"Car [MOVING] - {confidence:.2f}"
                label_color = (0, 0, 255)
            else:
                label = f"Car [STATIONARY] - {confidence:.2f}"
                label_color = (0, 255, 0)
            
            # Background untuk label
            (label_width, label_height), baseline = cv2.getTextSize(
                label, cv2.FONT_HERSHEY_SIMPLEX, 0.7, 2
            )
            cv2.rectangle(
                result_frame,
                (x, y - label_height - baseline - 10),
                (x + label_width + 10, y),
                (0, 0, 0),
                -1
            )
            cv2.putText(result_frame, label, (x + 5, y - 5),
                       cv2.FONT_HERSHEY_SIMPLEX, 0.7, label_color, 2)
            
            # Tampilkan duration di bawah bounding box jika mobil diam
            if not results['is_moving'] and results['duration'] is not None:
                duration_label = f"Duration: {duration_str}"
                (dur_width, dur_height), dur_baseline = cv2.getTextSize(
                    duration_label, cv2.FONT_HERSHEY_SIMPLEX, 0.6, 2
                )
                # Background untuk duration
                cv2.rectangle(
                    result_frame,
                    (x, y + h),
                    (x + dur_width + 10, y + h + dur_height + dur_baseline + 10),
                    (0, 0, 0),
                    -1
                )
                cv2.putText(
                    result_frame,
                    duration_label,
                    (x + 5, y + h + dur_height + 5),
                    cv2.FONT_HERSHEY_SIMPLEX,
                    0.6,
                    (0, 255, 0),
                    2
                )
        
        # Draw duration utama di pojok kiri atas (selalu ditampilkan)
        if results['duration'] is not None:
            if not results['is_moving']:
                # Mobil diam → Duration JALAN
                main_text = f"Duration: {duration_str} [RUNNING]"
                status_text = "STATUS: STATIONARY"
                text_color = (0, 255, 0)  # Hijau
            else:
                # Mobil bergerak → Duration BERHENTI
                main_text = f"Duration: {duration_str} [STOPPED]"
                status_text = "STATUS: MOVING"
                text_color = (0, 165, 255)  # Orange
        else:
            if results['cars']:
                main_text = "Duration: 00:00:00"
                status_text = "STATUS: MOVING"
                text_color = (0, 0, 255)  # Merah
            else:
                main_text = "Duration: 00:00:00"
                status_text = "STATUS: NO CAR"
                text_color = (128, 128, 128)  # Abu-abu
        
        # Background panel untuk info utama
        (main_width, main_height), main_baseline = cv2.getTextSize(
            main_text, cv2.FONT_HERSHEY_SIMPLEX, 1.2, 3
        )
        (status_width, status_height), status_baseline = cv2.getTextSize(
            status_text, cv2.FONT_HERSHEY_SIMPLEX, 0.8, 2
        )
        
        panel_width = max(main_width, status_width) + 40
        panel_height = main_height + status_height + main_baseline + status_baseline + 40
        
        # Draw panel background
        cv2.rectangle(
            result_frame,
            (10, 10),
            (10 + panel_width, 10 + panel_height),
            (0, 0, 0),
            -1
        )
        cv2.rectangle(
            result_frame,
            (10, 10),
            (10 + panel_width, 10 + panel_height),
            text_color,
            3
        )
        
        # Draw duration text (besar dan jelas)
        cv2.putText(
            result_frame,
            main_text,
            (20, 20 + main_height + 10),
            cv2.FONT_HERSHEY_SIMPLEX,
            1.2,
            text_color,
            3
        )
        
        # Draw status text
        cv2.putText(
            result_frame,
            status_text,
            (20, 20 + main_height + status_height + 20),
            cv2.FONT_HERSHEY_SIMPLEX,
            0.8,
            (255, 255, 255),
            2
        )
        
        # Info tambahan: jumlah mobil
        if results['cars']:
            car_count_text = f"Cars Detected: {len(results['cars'])}"
            cv2.putText(
                result_frame,
                car_count_text,
                (20, 20 + panel_height + 30),
                cv2.FONT_HERSHEY_SIMPLEX,
                0.7,
                (255, 255, 255),
                2
            )
        
        # Draw movement segments (optional, untuk debugging)
        if results['movement_segments']:
            segment_height = frame_height // self.segments
            segment_width = frame_width // self.segments
            for (i, j) in results['movement_segments'][:10]:  # Limit untuk performa
                top_left = (j * segment_width, i * segment_height)
                bottom_right = ((j + 1) * segment_width, (i + 1) * segment_height)
                cv2.rectangle(result_frame, top_left, bottom_right, (255, 0, 0), 1)
        
        return result_frame
    
    def run(self, video_source=0):
        """
        Run detector pada video source (camera atau video file)
        
        Args:
            video_source: 0 untuk webcam, atau path ke video file
        """
        logger.info("Starting Car Motion Detector...")
        logger.info("Press 'q' to quit")
        
        cap = cv2.VideoCapture(video_source)
        if not cap.isOpened():
            logger.error(f"Error: Could not open video source: {video_source}")
            return
        
        # Set window properties
        cv2.namedWindow('Car Motion Detection', cv2.WINDOW_NORMAL)
        
        frame_count = 0
        
        try:
            while True:
                ret, frame = cap.read()
                if not ret:
                    logger.warning("Could not read frame")
                    break
                
                # Process frame
                results = self.process_frame(frame)
                
                # Draw results
                output_frame = self.draw_results(frame, results)
                
                # Display
                cv2.imshow('Car Motion Detection', output_frame)
                
                # Log setiap 30 frame
                frame_count += 1
                if frame_count % 30 == 0:
                    if results['cars']:
                        status = "MOVING" if results['is_moving'] else "STATIONARY"
                        logger.info(f"Frame {frame_count}: {len(results['cars'])} car(s) detected - {status}")
                
                # Exit on 'q' key
                if cv2.waitKey(1) & 0xFF == ord('q'):
                    logger.info("Exiting...")
                    break
                    
        except KeyboardInterrupt:
            logger.info("Interrupted by user")
        finally:
            cap.release()
            cv2.destroyAllWindows()
            logger.info("Released resources")


def main():
    """Main function"""
    import argparse
    
    parser = argparse.ArgumentParser(description='Car Motion Detection with Duration Tracking')
    parser.add_argument('--source', type=str, default='0',
                       help='Video source: 0 for webcam, or path to video file')
    parser.add_argument('--model', type=str, default='yolov8n.pt',
                       help='Path to YOLO model file')
    parser.add_argument('--conf', type=float, default=0.25,
                       help='Confidence threshold')
    parser.add_argument('--segments', type=int, default=20,
                       help='Number of segments for motion detection')
    parser.add_argument('--motion-threshold', type=float, default=10.0,
                       help='Motion detection threshold')
    parser.add_argument('--delay', type=float, default=1.0,
                       help='Delay before starting duration count (seconds)')
    
    args = parser.parse_args()
    
    # Convert source to int if it's a number
    try:
        video_source = int(args.source)
    except ValueError:
        video_source = args.source
    
    # Create detector
    detector = CarMotionDetector(
        model_path=args.model,
        conf_threshold=args.conf,
        segments=args.segments,
        motion_threshold=args.motion_threshold,
        delay_seconds=args.delay
    )
    
    # Run
    detector.run(video_source)


if __name__ == "__main__":
    main()

