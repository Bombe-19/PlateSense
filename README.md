# PlateSense
This project is an application of machine learning to the task of identifying and recognizing which food items are present on a plate. We put together a system that looks at food images and which in turn is able to very accurately identify, classify and label each item.
## Objective
- The main goal of this project is to:
   - Detect and classify different food items in an image.
   - Provide bounding boxes and labels for each detected item.
   - Deliver a fast and efficient solution using YOLOv8, suitable for both real-time and research use.
## The Model to be used=YOLO?
- **Fast and Real-Time** – Detects all items in one pass (single-stage detection).
- **High Accuracy** – Excellent performance even with small datasets.
- **Versatile** – Supports detection, segmentation, and classification.
- **Easy to Train and Deploy** – Simple implementation using the Ultralytics library.
## Tools and Technology 
| Category                   | Tools/Frameworks                               |
| -------------------------- | ---------------------------------------------- |
| **Programming Language**   | Python                                         |
| **Object Detection Model** | YOLOv8 (Ultralytics)                           |
| **Libraries Used**         | OpenCV, NumPy, Pandas, Matplotlib, Ultralytics |
| **Annotation Tool**        | LabelImg / Roboflow                            |
## Dataset
public datasets like Food-101, UECFOOD256, or create a custom dataset.
  - https://datasetninja.com/food-recognition#download
  - https://www.kaggle.com/datasets/trolukovich/food11-image-dataset
  - https://www.kaggle.com/datasets/rkuo2000/uecfood256
    
Each image must contain:
  - Bounding boxes around food items.
  - Labels (e.g., Rice, Curry, Salad).
  - Annotations can be done manually using tools like LabelImg.
## Project Pipeline
```bash
Data Collection
     ↓
Data Annotation (Bounding Boxes & Labels)
     ↓
Data Preprocessing (Resize, Normalize, Split)
     ↓
Model Selection – YOLOv8
     ↓
Model Training (Custom Food Dataset)
     ↓
Object Detection & Bounding Box Prediction
     ↓
Post-Processing (Non-Max Suppression)
     ↓
Evaluation (mAP, Precision, Recall)
     ↓
Visualization & Deployment (Optional)
```
## Model Training Steps
- Step 1: Install Dependencies
```bash
pip install ultralytics opencv-python matplotlib numpy
```
- Step 2:Import YOLOv8
```bash
from ultralytics import YOLO
```
- Step 3: Load Pretrained Model
```bash
model = YOLO("yolov8n.pt")
```
- Step 4: Train on Custom Dataset
```bash
model.train(data="data.yaml", epochs=50, imgsz=640)(for sample)
```
- Step 5: Make Predictions
```bash
results = model.predict(source="test_image.jpg", conf=0.5)
results.show()
```
## Working Principle of YOLOv8
- **Input Image** – The image is divided into grids.
- **Feature Extraction** – The CNN backbone identifies features.
- **Bounding Box Prediction** – The model predicts object locations and class probabilities.
- **Non-Maximum Suppression (NMS)** – Removes overlapping bounding boxes.
- **Output** – Displays food items with labels and confidence scores.

## Evaluation Metrics
- Mean Average Precision (mAP)
- Precision and Recall
- F1 Score
- Inference Time (Speed)
<img width="948" height="500" alt="Evaluation_metrics" src="https://github.com/user-attachments/assets/43da7c3a-2d09-4a07-aa23-ef61f86d8b0c" />





