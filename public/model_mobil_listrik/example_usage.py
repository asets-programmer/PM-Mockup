"""
Contoh penggunaan Car Motion Detector
"""

from car_motion_detector import CarMotionDetector
import cv2

def example_webcam():
    """Contoh menggunakan webcam"""
    print("Starting webcam detection...")
    
    detector = CarMotionDetector(
        model_path='yolov8n.pt',
        conf_threshold=0.25,
        segments=20,
        motion_threshold=10.0,
        delay_seconds=1.0
    )
    
    detector.run(0)  # 0 untuk webcam default


def example_video_file():
    """Contoh menggunakan video file"""
    print("Starting video file detection...")
    
    detector = CarMotionDetector(
        model_path='yolov8n.pt',
        conf_threshold=0.25
    )
    
    # Ganti dengan path video Anda
    video_path = "path/to/your/video.mp4"
    detector.run(video_path)


def example_custom_processing():
    """Contoh custom processing frame per frame"""
    print("Starting custom processing...")
    
    detector = CarMotionDetector()
    
    cap = cv2.VideoCapture(0)
    
    try:
        while True:
            ret, frame = cap.read()
            if not ret:
                break
            
            # Process frame
            results = detector.process_frame(frame)
            
            # Custom logic berdasarkan results
            if results['cars']:
                print(f"Detected {len(results['cars'])} car(s)")
                if results['duration']:
                    print(f"  Duration: {results['duration']:.2f} seconds")
            
            # Draw results
            output_frame = detector.draw_results(frame, results)
            
            # Display
            cv2.imshow('Custom Processing', output_frame)
            
            if cv2.waitKey(1) & 0xFF == ord('q'):
                break
                
    finally:
        cap.release()
        cv2.destroyAllWindows()


if __name__ == "__main__":
    # Pilih salah satu contoh
    example_webcam()
    # example_video_file()
    # example_custom_processing()

