<div align="center">
  <picture>
    <img alt="PlateSense / Food Caliper logo" src="Website/Food_caliper/public/logo.png" width="96">
  </picture>
  <br>
  <h1>PlateSense / Food Caliper (<code>food-caliper</code>)</h1>
  <p><b>AI-Powered 3D Volumetric Food Estimation & Personal Nutrition Intelligence Platform</b></p>
</div>

<p align="center">
  <a href="https://react.dev/"><img src="https://img.shields.io/badge/React-18.3-blue.svg?logo=react" alt="React"></a>
  <a href="https://www.typescriptlang.org/"><img src="https://img.shields.io/badge/TypeScript-5.8-blue.svg?logo=typescript" alt="TypeScript"></a>
  <a href="https://vitejs.dev/"><img src="https://img.shields.io/badge/Vite-5.4-purple.svg?logo=vite" alt="Vite"></a>
  <a href="https://fastapi.tiangolo.com/"><img src="https://img.shields.io/badge/FastAPI-0.100+-green.svg?logo=fastapi" alt="FastAPI"></a>
  <a href="https://docs.ultralytics.com/"><img src="https://img.shields.io/badge/YOLOv8-Ultralytics-orange.svg?logo=python" alt="YOLOv8"></a>
  <a href="https://pytorch.org/"><img src="https://img.shields.io/badge/PyTorch-2.0+-EE4C2C.svg?logo=pytorch" alt="PyTorch"></a>
  <a href="https://www.mysql.com/"><img src="https://img.shields.io/badge/MySQL-8.0+-blue.svg?logo=mysql" alt="MySQL"></a>
  <a href="https://tailwindcss.com/"><img src="https://img.shields.io/badge/Tailwind-3.4-38B2AC.svg?logo=tailwind-css" alt="Tailwind CSS"></a>
</p>

---


## 📋 Table of Contents

- [1. Executive Summary & Platform Overview](#1-executive-summary--platform-overview)
- [2. System Architecture & End-to-End Data Flow](#2-system-architecture--end-to-end-data-flow)
- [3. Complete Technology Stack Matrix](#3-complete-technology-stack-matrix)
- [4. Three Core Platform Pillars](#4-three-core-platform-pillars)
  - [4.1 Pillar 1: Full-Stack Web Application (`Website/Food_caliper`)](#41-pillar-1-full-stack-web-application-websitefood_caliper)
  - [4.2 Pillar 2: High-Performance REST API Backend (`backend/`)](#42-pillar-2-high-performance-rest-api-backend-backend)
  - [4.3 Pillar 3: AI Volumetric & Computer Vision Engine](#43-pillar-3-ai-volumetric--computer-vision-engine)
- [5. Computer Vision & Mathematical Core](#5-computer-vision--mathematical-core)
  - [5.1 YOLOv8 Detection & Polygon Segmentation](#51-yolov8-detection--polygon-segmentation)
  - [5.2 Real-World Scale Calibration Matrix](#52-real-world-scale-calibration-matrix)
  - [5.3 3D Volumetric Mesh & Height Estimation](#53-3d-volumetric-mesh--height-estimation)
  - [5.4 Bulk Density & Mass Synthesis](#54-bulk-density--mass-synthesis)
- [6. Repository Directory & Architecture Map](#6-repository-directory--architecture-map)
- [7. PlateSense Model Training, Datasets & Active Learning](#7-platesense-model-training-datasets--active-learning)
  - [7.1 Model Objective & YOLOv8 Features](#71-model-objective--yolov8-features)
  - [7.2 Datasets & Annotation Tools](#72-datasets--annotation-tools)
  - [7.3 Google Colab GPU Setup & Drive Mounting](#73-google-colab-gpu-setup--drive-mounting)
  - [7.4 YOLOv8 Model Training & Preparation](#74-yolov8-model-training--preparation)
  - [7.5 Model Evaluation Metrics](#75-model-evaluation-metrics)
  - [7.6 Model Weight Saving & Fine-Tuning](#76-model-weight-saving--fine-tuning)
  - [7.7 Active Learning Loop](#77-active-learning-loop)
- [8. Real-Time Webcam Detection & Standalone Gradio UI](#8-real-time-webcam-detection--standalone-gradio-ui)
  - [8.1 Live Webcam Detection & Keyboard Controls](#81-live-webcam-detection--keyboard-controls)
  - [8.2 Standalone Gradio Volumetric Analysis UI](#82-standalone-gradio-volumetric-analysis-ui)
  - [8.3 Output Formats & Sample JSON Schema](#83-output-formats--sample-json-schema)
- [9. Complete Installation & Quick Start Guide](#9-complete-installation--quick-start-guide)
  - [9.1 Prerequisites](#91-prerequisites)
  - [9.2 Step 1: MySQL Database Setup](#92-step-1-mysql-database-setup)
  - [9.3 Step 2: FastAPI Backend Setup](#93-step-2-fastapi-backend-setup)
  - [9.4 Step 3: React Web Frontend Setup](#94-step-3-react-web-frontend-setup)
  - [9.5 Step 4: Standalone Gradio / Volumetric Execution](#95-step-4-standalone-gradio--volumetric-execution)
- [10. REST API Endpoint Reference](#10-rest-api-endpoint-reference)
- [11. Production Deployment & Dockerization](#11-production-deployment--dockerization)
- [12. Open Source, Cloning & Contribution Guide](#12-open-source-cloning--contribution-guide)


---

## 1. Executive Summary & Platform Overview

**PlateSense / Food Caliper** is an end-to-end artificial intelligence platform built to solve portion size estimation and nutritional auditing without manual food weighing. Traditional dietary tracking apps rely on subjective human guesses, resulting in macro measurement errors of up to 40%. 

This project bridges **deep learning object detection (Ultralytics YOLOv8)**, **3D spatial volume estimation**, **bulk density mapping**, and a **production-grade web application** built with React 18, Vite, FastAPI, and MySQL.

### Core Capabilities:
1. **Multi-Food Identification**: Accurately detects and classifies multiple distinct food items in a single image.
2. **Volumetric Estimation**: Converts 2D pixel contours into 3D volume ($cm^3$ or $mL$) using physical plate calibration.
3. **Weight & Macro Synthesis**: Estimates exact physical mass ($grams$), calories, protein, carbohydrates, fats, and micronutrients.
4. **Interactive Web Portal**: Full-featured React web client with live webcam scanning, calibration sliders, daily calorie rings, macro trends, and downloadable CSV/PDF reports.

---

## 2. System Architecture & End-to-End Data Flow

The diagram below illustrates how a user request flows through the full platform stack:

```mermaid
sequenceDiagram
    autonumber
    actor User as User / Browser
    participant React as React Web App (:5173)
    participant API as FastAPI Backend (:8000)
    participant ML as Volumetric Analysis Engine
    participant YOLO as YOLOv8 Neural Model (best.pt)
    participant DB as MySQL Database (food_caliper_db)

    User->>React: Upload Meal Photo + Set Plate Diameter (e.g., 25cm)
    React->>API: POST /api/v1/analysis/upload (FormData + user_id)
    API->>ML: Forward image file & scale parameters
    ML->>YOLO: Run inference on image tensor
    YOLO-->>ML: Return Bounding Boxes, Polygon Contours & Class Scores
    ML->>ML: 1. Calculate Pixel-to-CM Scale Ratio from Plate Diameter
    ML->>ML: 2. Compute 2D Area (cm²) & Estimate Height (cm)
    ML->>ML: 3. Estimate 3D Volume (cm³) using Geometric Mesh
    ML->>ML: 4. Lookup Density (g/cm³) & Calculate Mass (g)
    ML->>ML: 5. Query Nutritional Database for Cal/Protein/Carb/Fat
    ML-->>API: Return Structured Analysis JSON Payload
    API->>DB: Persist scan record in `analyses` & `analysis_items`
    API-->>React: HTTP 200 OK + Analysis Results
    React-->>User: Render Bounding Box Overlays, Volume (cm³), Weight (g) & Charts
```

---

## 3. Complete Technology Stack Matrix

| Layer | Technology | Purpose & Description |
| :--- | :--- | :--- |
| **Frontend Framework** | React 18.3, TypeScript 5.8, Vite 5.4 | Single Page Application framework with strict typing and fast HMR bundler. |
| **UI & Styling** | Tailwind CSS 3.4, Shadcn UI (Radix) | Accessible design primitives with custom dark mode glassmorphism theme. |
| **Animations** | GSAP 3, Framer Motion 12, Lenis | Inertia smooth scrolling, scroll triggers, and dynamic target cursor. |
| **Data Viz & State** | TanStack React Query v5, Recharts 2.15 | Asynchronous data fetching, caching, and responsive macro trend visualization. |
| **Backend Framework** | Python 3.10+, FastAPI, Uvicorn | Asynchronous RESTful API server with high concurrency performance. |
| **Database & ORM** | MySQL 8.0, SQLAlchemy, Pydantic | Relational database storage for users, meal logs, and nutritional density records. |
| **AI / Machine Learning** | Ultralytics YOLOv8, PyTorch, OpenCV | Single-stage deep convolutional network for object detection and contour segmentation. |
| **Auth & Security** | PyJWT, Passlib (Bcrypt) | Secure JSON Web Token authentication with bcrypt password hashing. |
| **UI Standalone / Test** | Gradio UI (`app.py`, `app2.py`) | Interactive rapid prototyping web UI for local testing and research. |

---

## 4. Three Core Platform Pillars

### 4.1 Pillar 1: Full-Stack Web Application (`Website/Food_caliper`)
- **Landing Portal (`/`)**: Interactive hero showcase, bento grid features, technology brand loop, and smooth Lenis scrolling.
- **Volumetric Scanner (`/analysis`)**: Drag-and-drop image uploader, live webcam capture, real-time plate diameter calibration slider ($15\text{ cm} - 35\text{ cm}$), visual bounding overlays, and instant CSV audit exports.
- **Daily Dashboard (`/dashboard`)**: Progress rings tracking daily caloric targets, macro distribution charts, hydration water intake counter, and weekly intake history.
- **Audit Reports (`/reports`)**: Searchable historical scan log with date filtering and detailed nutrient breakdowns.
- **User Profile (`/profile`)**: Physical metrics configuration (Height, Weight, Age) for automatic BMR/TDEE target calculation.

### 4.2 Pillar 2: High-Performance REST API Backend (`backend/`)
- **FastAPI Web Application (`main.py`)**: Asynchronous endpoint handlers with CORS configuration.
- **Relational Models (`app/models`)**: SQLAlchemy database models for Users, Meal Analyses, and Analysis Items.
- **Pydantic Schemas (`app/schemas`)**: Request/response validation schemas for auth tokens, profile updates, and scan payloads.
- **JWT Middleware**: Token generation, validation, and user session management.

### 4.3 Pillar 3: AI Volumetric & Computer Vision Engine
- **Inference Model (`best.pt`)**: YOLOv8 neural network trained on annotated food datasets.
- **Spatial Calibration Matrix**: Translates image pixel dimensions to physical metric units ($cm$).
- **3D Mesh Reconstruction**: Calculates physical volume ($cm^3$) based on geometric modeling (Ellipsoid, Cylinder, Prism).
- **Nutritional Database**: Maps food items against `Indian_Food_Nutrition_Processed.csv` and MySQL tables for exact nutrient density calculations.

---

## 5. Computer Vision & Mathematical Core

Transforming a 2D photograph into 3D volumetric estimates and mass ($grams$) requires a 4-step mathematical pipeline:

```
[ 2D Image (px) ] ──(YOLOv8)──> [ Contours & Boxes ] ──(Scale Matrix)──> [ Real Dimensions (cm) ]
                                                                                  │
                                                                       (Geometric Mesh)
                                                                                  ▼
[ Calorie/Macro Data ] ◄──(Nutrition DB)─── [ Mass (g) ] ◄──(Density ρ)─── [ Volume (cm³) ]
```

### 5.1 YOLOv8 Detection & Polygon Segmentation
Input image $I \in \mathbb{R}^{H \times W \times 3}$ is evaluated in a single pass to produce object bounding coordinates and polygon boundary points:

$$\text{Detection Output} = \{ (B_i, C_i, S_i, P_i) \}_{i=1}^{N}$$

Where $B_i$ is the bounding box, $C_i$ is the predicted class, $S_i$ is the confidence score, and $P_i$ represents contour polygon vertices in pixel space.

### 5.2 Real-World Scale Calibration Matrix
Camera distance varies across photos. To establish physical scale, the system uses a known reference object—by default, the physical dinner plate diameter $D_{\text{plate (cm)}}$ (e.g., $25\text{ cm}$).

1. **Pixel Diameter Calculation**:
   $$D_{\text{plate (px)}} = \max(W_{\text{plate-bbox}}, H_{\text{plate-bbox}})$$

2. **Pixel-to-Centimeter Scale Ratio ($S$)**:
   $$S = \frac{D_{\text{plate (cm)}}}{D_{\text{plate (px)}}} \quad \left[\frac{\text{cm}}{\text{px}}\right]$$

3. **Physical Area Conversion**:
   Given contour area in pixels $A_{\text{px}}$ derived via Green's theorem on polygon contour vertices:
   $$A_{\text{cm}^2} = A_{\text{px}} \times S^2$$

### 5.3 3D Volumetric Mesh & Height Estimation
Single-view RGB cameras lack direct depth channels. Height $H_{\text{cm}}$ is geometrically estimated based on aspect ratio and morphological classification of specific food types:

- **Ellipsoidal / Dome-shaped Foods (e.g., Rice bowl, Curry, Salad)**:
  $$V_{\text{cm}^3} = \frac{2}{3} \cdot A_{\text{cm}^2} \cdot H_{\text{est}}$$

- **Planar / Flat Foods (e.g., Pizza, Pancake, Dosa, Roti)**:
  $$V_{\text{cm}^3} = A_{\text{cm}^2} \cdot H_{\text{flat-thickness}}$$

- **Cylindrical / Prismatic Foods (e.g., Cake slice, Sandwiches)**:
  $$V_{\text{cm}^3} = A_{\text{cm}^2} \cdot H_{\text{height}} \cdot K_{\text{taper}}$$

Where $K_{\text{taper}}$ is a shape factor compensation constant ($\approx 0.85$).

### 5.4 Bulk Density & Mass Synthesis
Once volume $V_{\text{cm}^3}$ ($mL$) is computed, mass $M_{\text{grams}}$ is derived using item-specific bulk density values ($\rho \text{ in g/cm}^3$):

$$M_{\text{grams}} = V_{\text{cm}^3} \times \rho_{\text{food}}$$

*Sample Bulk Densities ($\rho$):*
- White Rice (cooked): $0.85 \text{ g/cm}^3$
- Chicken Curry: $1.05 \text{ g/cm}^3$
- Green Salad: $0.35 \text{ g/cm}^3$
- Whole Wheat Roti: $0.65 \text{ g/cm}^3$

Finally, macronutrient values are calculated against the nutritional database:

$$\text{Nutrient}_{\text{total}} = \text{Nutrient}_{\text{per 100g}} \times \frac{M_{\text{grams}}}{100}$$

---

## 6. Repository Directory & Architecture Map

```
Food/
├── backend/                           # FastAPI Python Backend Service
│   ├── app/
│   │   ├── models/                    # SQLAlchemy Database Models (User, Analysis, etc.)
│   │   ├── schemas/                   # Pydantic Input/Output Schemas
│   │   ├── routes/                    # API Endpoints (Auth, Analysis, User Stats)
│   │   ├── utils/                     # JWT Authentication & Password Hashing
│   │   └── database.py                # MySQL Connection Engine & Base Class
│   ├── uploads/                       # Uploaded Image Files Storage
│   ├── main.py                        # FastAPI Application Entry Point
│   ├── migrate_db.py                  # Database Migration Utility
│   ├── requirements.txt               # Backend Python Dependencies
│   └── .env                           # Backend Environment Configuration
│
├── Website/Food_caliper/               # React 18 + Vite Production Web Application
│   ├── src/
│   │   ├── assets/                    # Image & Vector Branding Assets
│   │   ├── components/                # Reusable UI, Dock, TargetCursor & Animations
│   │   ├── contexts/                  # ThemeContext (Dark/Light mode)
│   │   ├── hooks/                     # Custom React Hooks (use-mobile, use-toast)
│   │   ├── pages/                     # App Routes (Index, Login, Analysis, Dashboard, Reports, Profile)
│   │   ├── services/                  # Central Axios API Client (`apiClient.ts`)
│   │   ├── App.tsx                    # Main App Routing & Providers Component
│   │   └── main.tsx                   # React Entry Point
│   ├── package.json                   # Frontend Dependencies & Scripts
│   ├── tailwind.config.ts             # Design System & Token Configuration
│   ├── vite.config.ts                 # Vite Bundler Settings & Aliases
│   ├── IMPLEMENTATION_GUIDE.md        # Full Step-by-Step Setup Guide
│   └── README.md                      # Frontend Dedicated Documentation
│
├── code/                              # Google Colab Training Notebooks
│   └── PlateSense(1).ipynb            # YOLOv8 Training & Fine-Tuning Notebook
│
├── images1/                           # Training & Evaluation Screenshot Artifacts
├── volumetric_food_analysis.py         # Core Computer Vision & Volumetric Math Engine
├── food_calibration_data.py           # Food Density & Caloric Reference Database
├── food_detection.py                  # Standalone YOLO Detection & Webcam Script
├── app.py / app1.py / app2.py         # Standalone Gradio Interface Scripts
├── best.pt                            # Trained YOLOv8 PyTorch Model Weights
├── Indian_Food_Nutrition_Processed.csv # Processed Food Nutrition Dataset
├── database_schema.sql                # Raw SQL Schema Script
├── Dockerfile                         # Production Multi-Stage Container Dockerfile
├── requirements.txt                   # Root Python Requirements
└── README.md                          # Master Repository Documentation (This File)
```

---

## 7. PlateSense Model Training, Datasets & Active Learning

### 7.1 Model Objective & YOLOv8 Features
The core machine learning objective is detecting, classifying, and segmenting food items present on a plate in real time. **YOLOv8 (Ultralytics)** was selected for the following advantages:
- **Single-Stage Real-Time Speed**: Evaluates bounding coordinates and class probabilities in a single pass.
- **High Accuracy**: Strong performance even with smaller custom datasets.
- **Multi-Task Capability**: Native support for object detection, instance segmentation, and classification.
- **Ease of Deployment**: Simple Python API via the `ultralytics` package.

---

### 7.2 Datasets & Annotation Tools

Public datasets used for training and benchmarking include:
- [DatasetNinja Food Recognition](https://datasetninja.com/food-recognition#download)
- [Kaggle Food-11 Image Dataset](https://www.kaggle.com/datasets/trolukovich/food11-image-dataset)
- [Kaggle UECFOOD256 Dataset](https://www.kaggle.com/datasets/rkuo2000/uecfood256)

#### Annotation Pipeline:
Each image in the dataset requires:
- Precise bounding boxes surrounding each food item.
- Class labels (e.g., Rice, Curry, Salad, Roti, Waffles).
- Image annotations were created using **LabelImg** and **Roboflow**.

---

### 7.3 Google Colab GPU Setup & Drive Mounting

Training YOLOv8 requires GPU acceleration. Follow these steps in Google Colab:

1. Open [Google Colab](https://colab.research.google.com) and upload `code/PlateSense(1).ipynb`.
2. Enable GPU: Navigate to `Runtime → Change runtime type` $\rightarrow$ set `Hardware Accelerator` to `GPU` $\rightarrow$ click **Save**.
3. Verify GPU availability:
   ```bash
   !nvidia-smi
   ```
4. Mount Google Drive to preserve dataset files, checkpoints, and model weights across sessions:
   ```python
   from google.colab import drive
   drive.mount('/content/drive')
   ```
5. Specify your dataset directory path:
   ```python
   dataset_path = '/content/drive/MyDrive/Data_1_'
   ```

---

### 7.4 YOLOv8 Model Training & Preparation

#### 1. Install Dependencies:
```bash
pip install ultralytics opencv-python matplotlib numpy pandas
```

#### 2. Directory Structure (`data.yaml`):
Organize dataset directories in YOLO format:
```
dataset/
├── images/
│   ├── train/
│   └── val/
└── labels/
    ├── train/
    └── val/
```

Configure `data.yaml` to define dataset locations, class counts, and label names:
```yaml
path: /path/to/dataset
train: images/train
val: images/val

names:
  0: rice
  1: curry
  2: salad
  3: roti
  4: waffles
```

#### 3. Train the Model:
```python
from ultralytics import YOLO

# Load base model (yolov8n.pt or yolov8s.pt)
model = YOLO("yolov8n.pt")

# Train on custom dataset
model.train(data="data.yaml", epochs=50, imgsz=640)
```
*Tip: If accuracy needs improvement, increase training duration to 100-150 epochs and enable image augmentations.*

#### 4. Run Model Prediction / Inference:
```python
results = model.predict(source="test_image.jpg", conf=0.5)
results.show()
```

<p align="center">
  <img src="images1/check_1.png" width="300" alt="YOLOv8 Detection Test" />
</p>

---

### 7.5 Model Evaluation Metrics

Model performance is evaluated using standard computer vision metrics:
- **Mean Average Precision (mAP)**: Evaluates bounding box overlap and class correctness across thresholds.
- **Precision & Recall**: Measures false positive vs. missed detection trade-offs.
- **F1 Score**: Harmonic mean of Precision and Recall.
- **Inference Speed**: Milliseconds per frame.

<p align="center">
  <img src="https://github.com/user-attachments/assets/43da7c3a-2d09-4a07-aa23-ef61f86d8b0c" width="700" alt="Evaluation Metrics" />
</p>

---

### 7.6 Model Weight Saving & Fine-Tuning

After training completes, YOLOv8 automatically saves model weight checkpoints in `runs/detect/train/weights/`:
- `best.pt`: Highest performing model checkpoint.
- `last.pt`: Final epoch training state.

Save and export the weights:
```python
model.save("models/food_detection_best.pt")
```

#### Fine-Tuning on New Unlabeled Images:
```python
from ultralytics import YOLO

# Load previously trained best weights
model = YOLO("runs/detect/train/weights/best.pt")

# Continue training on updated dataset
model.train(data="dataset/data.yaml", epochs=20, imgsz=640)
```

<p align="center">
  <img src="images1/Class_summary.png" width="400" alt="Class Distribution Summary" />
</p>

---

### 7.7 Active Learning Loop

To continuously improve detection precision over time, implement an **Active Learning Loop**:

```
[ New Unseen Food Images ] ──> [ Model Prediction ] ──> [ Human Review ]
                                                               │
[ Model Fine-Tuning (best.pt) ] ◄── [ Add to Dataset ] ◄── [ Re-Label Errors ]
```

1. Run inference on newly collected food photographs.
2. Review predictions to identify missing items or misclassifications.
3. Re-label corrected bounding boxes in Roboflow or LabelImg.
4. Merge new annotated samples back into the training split.
5. Fine-tune using `best.pt` as the starting checkpoint.

---

## 8. Real-Time Webcam Detection & Standalone Gradio UI

### 8.1 Live Webcam Detection & Keyboard Controls

`food_detection.py` supports real-time food detection directly via your computer's webcam feed.

<p align="center">
  <img src="check_r1.jpg" width="450" alt="Real-time Live Webcam Detection" />
</p>

#### Interactive Controls:
| Key | Action |
| :---: | :--- |
| `q` | Quit webcam live feed |
| `s` | Save screenshot of current detected frame |
| `+` / `-` | Increase or decrease detection confidence threshold dynamically |

---

### 8.2 Standalone Gradio Volumetric Analysis UI

`app2.py` (or `app.py`) launches an interactive Gradio web application for quick local experimentation:

```bash
python app2.py
```
*Access the interface at `http://localhost:7860`.*

Features:
- Upload food images and specify the custom `best.pt` model path.
- Adjust **Plate Diameter (cm)** slider for scale calibration.
- Download structured results in JSON and CSV formats.

<p align="center">
  <img src="images1/gardio_!.png" width="400" alt="Gradio Interface 1" />
  <img src="images1/gardio_2.png" width="400" alt="Gradio Interface 2" />
</p>

---

### 8.3 Output Formats & Sample JSON Schema

The system produces structured outputs containing visual bounding overlays, summary totals, and detailed item attributes.

#### Sample JSON Result Payload:
```json
{
  "summary": {
    "total_items_detected": 1,
    "total_volume_ml": 638.99,
    "total_volume_liters": 0.639,
    "total_weight_grams": 543.15,
    "total_weight_kg": 0.543,
    "items_with_components": 0
  },
  "food_items": [
    {
      "item_id": 1,
      "name": "waffles",
      "confidence": 0.8909,
      "bounding_box": {
        "x_min": 120,
        "y_min": 85,
        "x_max": 450,
        "y_max": 390
      },
      "volume": {
        "volume_ml": 638.99,
        "weight_grams": 543.15,
        "weight_kg": 0.543,
        "area_cm2": 316.2,
        "estimated_height_cm": 2.89,
        "density_g_per_ml": 0.85
      }
    }
  ]
}
```

---

## 9. Complete Installation & Quick Start Guide

### 9.1 Prerequisites
Ensure the following tools are installed:
- **Python**: v3.10 or higher
- **Node.js**: v18.0.0 or higher (npm / bun)
- **MySQL Server**: v8.0 or higher (or Workbench)

---

### 9.2 Step 1: MySQL Database Setup

1. Log in to MySQL:
   ```bash
   mysql -u root -p
   ```
2. Create database:
   ```sql
   CREATE DATABASE IF NOT EXISTS food_caliper_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
   ```
3. Database tables are automatically initialized by SQLAlchemy when starting the backend.

---

### 9.3 Step 2: FastAPI Backend Setup

1. Navigate to the backend folder:
   ```bash
   cd backend
   ```
2. Create and activate Python virtual environment:
   - **Windows**:
     ```bash
     python -m venv venv
     venv\Scripts\activate
     ```
   - **macOS / Linux**:
     ```bash
     python3 -m venv venv
     source venv/bin/activate
     ```
3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```
4. Create `.env` file inside `backend/.env`:
   ```env
   DATABASE_URL=mysql+pymysql://root:your_password@localhost:3306/food_caliper_db
   SECRET_KEY=super-secret-jwt-key-change-this-in-production-32chars
   ALGORITHM=HS256
   ACCESS_TOKEN_EXPIRE_MINUTES=1440
   YOLO_MODEL_PATH=../best.pt
   API_HOST=0.0.0.0
   API_PORT=8000
   FRONTEND_URL=http://localhost:5173
   ```
5. Run the server:
   ```bash
   python main.py
   ```
   *API will run at `http://localhost:8000`. Interactive docs available at `http://localhost:8000/docs`.*

---

### 9.4 Step 3: React Web Frontend Setup

1. Open a new terminal and navigate to the frontend folder:
   ```bash
   cd Website/Food_caliper
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create `.env.local` inside `Website/Food_caliper/.env.local`:
   ```env
   VITE_API_URL=http://localhost:8000
   ```
4. Start the Vite dev server:
   ```bash
   npm run dev
   ```
5. Open browser at:
   ```
   http://localhost:5173
   ```

---

### 9.5 Step 4: Standalone Gradio / Volumetric Execution

To run standalone volumetric analysis without the web server:
```bash
python app2.py
```
*Access Gradio interface at `http://localhost:7860`.*

---

## 10. REST API Endpoint Reference

### Authentication Endpoints (`/api/v1/auth`)
| Method | Endpoint | Purpose | Payload |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/v1/auth/register` | Register a new user | `{ username, email, password, full_name }` |
| `POST` | `/api/v1/auth/login` | Login user & return JWT token | `{ email, password }` |
| `GET` | `/api/v1/auth/profile/{id}` | Get user profile details | *None* |
| `PUT` | `/api/v1/auth/profile/{id}` | Update body stats (Height, Weight, Age) | `{ height_cm, weight_kg, age }` |

### Volumetric Analysis Endpoints (`/api/v1/analysis`)
| Method | Endpoint | Purpose | Query / Form Data |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/v1/analysis/upload` | Upload image & run YOLO 3D analysis | `FormData: file`, `params: user_id` |
| `GET` | `/api/v1/analysis/{id}` | Get details for specific analysis ID | `params: user_id` |
| `GET` | `/api/v1/analysis/history/all` | Get paginated analysis history | `params: user_id, limit, offset` |
| `DELETE` | `/api/v1/analysis/{id}` | Delete analysis record | `params: user_id` |

### User Dashboard Endpoints (`/api/v1/user`)
| Method | Endpoint | Purpose | Query Parameters |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/v1/user/dashboard` | Get daily summary & macro rings | `user_id` |
| `GET` | `/api/v1/user/stats/weekly` | Get weekly calorie trends & food categories | `user_id` |
| `GET` | `/api/v1/user/stats/monthly` | Get monthly historic macro data | `user_id` |

---

## 11. Production Deployment & Dockerization

The root directory includes a production multi-stage `Dockerfile`:

```bash
# Build Docker image
docker build -t platesense-app:latest .

# Run container with environment file
docker run -d \
  -p 8000:8000 \
  -p 5173:5173 \
  --env-file backend/.env \
  --name platesense-container \
  platesense-app:latest
```

---

## 12. Open Source, Cloning & Contribution Guide

### 12.1 Cloning the Repository

To set up PlateSense / Food Caliper locally or contribute to development, clone the repository:

```bash
# Clone the repository
git clone https://github.com/your-username/PlateSense.git

# Navigate into the project root directory
cd PlateSense
```

---

### 12.2 Open Source Contribution Guidelines

We welcome open-source contributions from developers, researchers, and computer vision enthusiasts! Follow these steps to contribute:

1. **Fork the Repository**: Click **Fork** at the top right of the GitHub repository.
2. **Create a Feature Branch**:
   ```bash
   git checkout -b feature/AmazingFeature
   ```
3. **Commit your Changes**:
   ```bash
   git commit -m 'Add some AmazingFeature'
   ```
4. **Push to the Branch**:
   ```bash
   git push origin feature/AmazingFeature
   ```
5. **Open a Pull Request**: Submit a PR describing your feature, bug fix, or performance improvement.

---

### 12.3 Quick Reference & Troubleshooting

- **YOLO Model Weights**: Place `best.pt` in the root directory or set `YOLO_MODEL_PATH=../best.pt` in `backend/.env`.
- **Scale Calibration**: Adjust plate diameter slider in the Web App (`/analysis`) or set `PLATE_DIAMETER_CM=25` in `backend/.env`.
- **CORS Configuration**: Verify `FRONTEND_URL=http://localhost:5173` matches the Vite dev server origin in `backend/.env`.

---

### 12.4 License & Community Terms

This project is open-source software licensed under the **MIT License**. You are free to use, modify, distribute, and integrate it into academic research, personal projects, or commercial applications.

---

<p align="center">
  <b>PlateSense / Food Caliper</b> • Open Source AI Volumetric Food & Nutrition Platform
</p>

