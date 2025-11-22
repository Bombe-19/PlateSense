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
## Working Principle of YOLOv8
- **Input Image** – The image is divided into grids.
- **Feature Extraction** – The CNN backbone identifies features.
- **Bounding Box Prediction** – The model predicts object locations and class probabilities.
- **Non-Maximum Suppression (NMS)** – Removes overlapping bounding boxes.
- **Output** – Displays food items with labels and confidence scores.

## How to Run this project 
- **Clone the Repository**
  ```bash
  git clone https://github.com/your-username/PlateSense.git
  cd PlateSense
  ```
- **Install Dependencies**
   ```bash
   pip install ultralytics opencv-python matplotlib numpy pandas
   ```
- **Prepare the Dataset**
   - Organize your dataset
      ```bash
      dataset/
      ├── images/
      │   ├── train/
      │   └── val/
      └── labels/
       ├── train/
       └── val/
      ```
> If you already have the folder structure like this, you can continue training the model.

> For YOLO models, the data must follow a specific format — one folder for images and another for labels.

> If your dataset is not in this format, annotate the images using LabelImg or Roboflow.
Start by labeling around 25 images per class, then export the dataset in YOLOv8 format.

> Roboflow will automatically generate the correct folder structure and provide the data.yaml file with all the necessary details for training.

   - update data.yaml
        - file tells the YOLO model where your dataset is located and what classes it should detect. Without this file, YOLO won’t know:
        - Where the training and validation images are stored
        - How many object classes exist
        - What the names of those classes are
> data.yaml accurate ensures YOLOv8 correctly loads your data and trains on the right classes without errors.

> update the file whenever change in the dataset path, add or remove classes, rename the folders

 - **Train the Model**
   ```bash
   from ultralytics import YOLO
   model = YOLO("yolov8n.pt")  # or yolov8s.pt for better accuracy
   model.train(data="data.yaml", epochs=50, imgsz=640)
   ```
> if this gives less accuracy try with increasing the epoches to 100 or 150 and some augmentation

 - **Test the model**
   ```bash
   results = model.predict(source="test_image.jpg", conf=0.5)
   results.show()
   ```
<p align="center">
  <img src="/images1/check_1.png" width="300" />
</p>

 - Evaluation Metrics
   - Mean Average Precision (mAP)
   - Precision and Recall
   - F1 Score
   - Inference Time (Speed)
   <img width="948" height="500" alt="Evaluation_metrics" src="https://github.com/user-attachments/assets/43da7c3a-2d09-4a07-aa23-ef61f86d8b0c" />

 - Saving the model
   - After training, YOLO automatically saves the model weights in:
    ```bash
    runs/detect/train/weights/
    ```
    - best.pt → Best-performing model
    - last.pt → Last trained checkpoint
    ```bash
    model.save("models/food_detection_best.pt")
    model = save("models/food_detection_last.pt")
    ```
 - Fine tune the model
   ```bash
   from ultralytics import YOLO
   model = YOLO("runs/detect/train/weights/best.pt")  # Load your trained weights
   model.train(data="dataset/data.yaml", epochs=20, imgsz=640)
   ```
> The model path is the best performing model with pretrained bounding box and labels use this as model and annotate with new/unlabeled images

> If there are more images try annotating with small number of images with correct bounding boxes and labels and with the trained model fine-tune the new unlabeled images

## Class summary/Distribution 
  <img src="/images1/Class_summary.png" width="500" height="500" />

## Active Learning 
- Active Learning for Continuous Improvement
- After training, review predictions on new food images.
- Identify incorrect detections or missing items.
- Re-label those images in Roboflow or LabelImg.
- Add them back into the training dataset.
- Fine-tune your model again using the previously saved best.pt weights.
- This iterative process helps your model get smarter with every training round.

## Image Testing with YOLO trained model
<p align="center">
  <img src="/images1/check_4.png" width="300" />
  <img src="/images1/check_5.png" width="300" />
</p>

## Real-time detection 
This project includes live food item detection using a trained YOLO model and your device’s webcam. The system identifies and highlights various food items in real time, displaying bounding boxes and labels directly on the video stream. It’s fast, interactive, and built for practical use in kitchen automation, food logging, or smart dining applications.

## Key Features:
 - Instant Detection: Real-time object detection powered by YOLO.
 - Webcam Integration: Detect food items directly from a live camera feed.
 - Adjustable Confidence: Modify detection threshold on the fly (+ / - keys).
 - Capture Frames: Save screenshots of detected frames with a single key press (s).
 - Efficient Model: Lightweight, high-performance YOLO network for quick inference.
 - Simple Controls: q to quit, intuitive UI overlay with detection count and confidence level.

## Sample image of live time detection
<p align="center">
  <img src="/images1/check_r1.jpg" width="500" />
</p>
