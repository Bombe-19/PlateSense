import gradio as gr
from ultralytics import YOLO
from PIL import Image
import cv2
import os
import json
import uuid
import time


MODEL_PATH = "class1/best.pt"
TEMP_DIR = "temp"
CONF_THRESHOLD = 0.2
IOU_THRESHOLD = 0.5

os.makedirs(TEMP_DIR, exist_ok=True)

if not os.path.exists(MODEL_PATH):
    raise FileNotFoundError(f"Model not found: {MODEL_PATH}")


# Load model ONCE
model = YOLO(MODEL_PATH)


# Image detection function
def detect_image(image: Image.Image):
    start = time.time()
    detections = []

    results = model.predict(
        source=image,
        conf=CONF_THRESHOLD,
        iou=IOU_THRESHOLD,
        verbose=False
    )

    for r in results:
        if r.boxes is None:
            continue

        for box in r.boxes:
            cls_id = int(box.cls[0])
            detections.append({
                "class_id": cls_id,
                "class_name": r.names[cls_id],
                "confidence": round(float(box.conf[0]), 4),
                "bbox": {
                    "x1": round(float(box.xyxy[0][0]), 2),
                    "y1": round(float(box.xyxy[0][1]), 2),
                    "x2": round(float(box.xyxy[0][2]), 2),
                    "y2": round(float(box.xyxy[0][3]), 2)
                }
            })

    return {
        "type": "image",
        "num_detections": len(detections),
        "detections": detections,
        "inference_time_sec": round(time.time() - start, 3)
    }


# Video detection function
def detect_video(video_path):
    start = time.time()
    cap = cv2.VideoCapture(video_path)

    frame_count = 0
    detections_summary = {}

    while cap.isOpened():
        ret, frame = cap.read()
        if not ret:
            break

        frame_count += 1

        results = model.predict(
            source=frame,
            conf=CONF_THRESHOLD,
            iou=IOU_THRESHOLD,
            verbose=False
        )

        for r in results:
            if r.boxes is None:
                continue

            for box in r.boxes:
                cls_id = int(box.cls[0])
                cls_name = r.names[cls_id]
                detections_summary[cls_name] = detections_summary.get(cls_name, 0) + 1

    cap.release()

    return {
        "type": "video",
        "total_frames_processed": frame_count,
        "detected_items_summary": detections_summary,
        "inference_time_sec": round(time.time() - start, 3)
    }


# Gradio Interface
with gr.Blocks(title="Food Detection System") as demo:

    gr.Markdown("""
    # 🍽️ Food Detection System  
    Upload an **image or video** to detect food items using a YOLOv8 model.  
    Output is returned as **JSON**.
    """)

    with gr.Tabs():

        # -------- Image Tab --------
        with gr.Tab("📷 Image Detection"):
            image_input = gr.Image(type="pil", label="Upload Image")
            image_output = gr.JSON(label="Detection Result (JSON)")
            image_btn = gr.Button("Detect Image")

            image_btn.click(
                fn=detect_image,
                inputs=image_input,
                outputs=image_output
            )

        # -------- Video Tab --------
        with gr.Tab("🎥 Video Detection"):
            video_input = gr.Video(label="Upload Video")
            video_output = gr.JSON(label="Detection Summary (JSON)")
            video_btn = gr.Button("Detect Video")

            video_btn.click(
                fn=detect_video,
                inputs=video_input,
                outputs=video_output
            )

    gr.Markdown("""
    ### ℹ️ Notes
    - Uses **YOLOv8**
    - Low confidence threshold (0.15) to help new classes
    - Video output is **summary-based** (not frame-by-frame)
    """)


# Launch App
if __name__ == "__main__":
    demo.launch(server_name="0.0.0.0", server_port=7860)
