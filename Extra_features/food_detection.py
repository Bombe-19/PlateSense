from ultralytics import YOLO
import cv2

def realtime_food_detection(model_path='food_detection_model/food_detector_best.pt', conf_threshold=0.5):
    """
    Real-time food detection from webcam
    
    Args:
        model_path: Path to trained YOLO model
        conf_threshold: Confidence threshold (0-1)
    
    Controls:
        'q' - Quit
        's' - Save screenshot
        '+' - Increase confidence
        '-' - Decrease confidence
    """
    
    # Load model
    print("🔄 Loading model...")
    model = YOLO(model_path)
    print("✅ Model loaded successfully!")
    
    # Open webcam (0 = default camera, 1 = external camera)
    cap = cv2.VideoCapture(0)
    
    # Set resolution (optional)
    cap.set(cv2.CAP_PROP_FRAME_WIDTH, 1280)
    cap.set(cv2.CAP_PROP_FRAME_HEIGHT, 720)
    
    if not cap.isOpened():
        print("❌ Error: Cannot access webcam!")
        return
    
    print("✅ Webcam opened!")
    print("\n📹 Starting real-time detection...")
    print("Controls: 'q'=quit | 's'=save | '+'=more conf | '-'=less conf")
    
    screenshot_count = 0
    
    while True:
        # Read frame
        ret, frame = cap.read()
        if not ret:
            print("❌ Failed to grab frame")
            break
        
        # Predict
        results = model.predict(
            source=frame,
            conf=conf_threshold,
            verbose=False,
            stream=False
        )
        
        # Get annotated frame
        annotated_frame = results[0].plot()
        
        # Add info overlay
        info_text = f"Conf: {conf_threshold:.2f} | Press 'q' to quit"
        cv2.putText(annotated_frame, info_text, (10, 30),
                   cv2.FONT_HERSHEY_SIMPLEX, 0.7, (0, 255, 0), 2)
        
        # Count detections
        num_detections = len(results[0].boxes)
        count_text = f"Detected: {num_detections} items"
        cv2.putText(annotated_frame, count_text, (10, 60),
                   cv2.FONT_HERSHEY_SIMPLEX, 0.7, (0, 255, 0), 2)
        
        # Display frame
        cv2.imshow('PlateSense - Real-Time Food Detection', annotated_frame)
        
        # Handle keyboard input
        key = cv2.waitKey(1) & 0xFF
        
        if key == ord('q'):
            print("👋 Exiting...")
            break
        elif key == ord('s'):
            screenshot_count += 1
            filename = f'screenshot_{screenshot_count}.jpg'
            cv2.imwrite(filename, annotated_frame)
            print(f"📸 Screenshot saved: {filename}")
        elif key == ord('+') or key == ord('='):
            conf_threshold = min(0.95, conf_threshold + 0.05)
            print(f"➕ Confidence: {conf_threshold:.2f}")
        elif key == ord('-') or key == ord('_'):
            conf_threshold = max(0.1, conf_threshold - 0.05)
            print(f"➖ Confidence: {conf_threshold:.2f}")
    
    # Cleanup
    cap.release()
    cv2.destroyAllWindows()
    print("✅ Detection stopped!")

if __name__ == "__main__":
    import argparse
    
    parser = argparse.ArgumentParser(description='Real-time food detection')
    parser.add_argument('--model', default='food_detection_model/food_detector_best.pt', help='Model path')
    parser.add_argument('--conf', type=float, default=0.5, help='Confidence threshold')
    parser.add_argument('--camera', type=int, default=0, help='Camera index')
    
    args = parser.parse_args()
    
    realtime_food_detection(args.model, args.conf)