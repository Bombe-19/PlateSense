# 🥗 Food Caliper (PlateSense) - AI Volumetric Food & Nutrition Intelligence Platform

> **A State-of-the-Art 3D Volumetric Food Estimation, Computer Vision Portion Analysis, and Personal Nutrition Web Application.**

[![React](https://img.shields.io/badge/React-18.3-blue.svg?logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8-blue.svg?logo=typescript)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-5.4-purple.svg?logo=vite)](https://vitejs.dev/)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.100+-green.svg?logo=fastapi)](https://fastapi.tiangolo.com/)
[![YOLOv8](https://img.shields.io/badge/YOLOv8-Ultralytics-orange.svg?logo=python)](https://docs.ultralytics.com/)
[![MySQL](https://img.shields.io/badge/MySQL-8.0+-blue.svg?logo=mysql)](https://www.mysql.com/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-38B2AC.svg?logo=tailwind-css)](https://tailwindcss.com/)

---

## 📋 Table of Contents

- [1. Executive Overview](#1-executive-overview)
- [2. Key Product Features](#2-key-product-features)
- [3. End-to-End Architecture & Data Flow](#3-end-to-end-architecture--data-flow)
- [4. Complete Technology Stack](#4-complete-technology-stack)
- [5. Computer Vision & Mathematical Principles](#5-computer-vision--mathematical-principles)
  - [5.1 YOLOv8 Detection & Polygon Segmentation](#51-yolov8-detection--polygon-segmentation)
  - [5.2 Real-World Scale Calibration Matrix](#52-real-world-scale-calibration-matrix)
  - [5.3 3D Volumetric Mesh & Depth Estimation](#53-3d-volumetric-mesh--depth-estimation)
  - [5.4 Density & Nutritional Database Synthesis](#54-density--nutritional-database-synthesis)
- [6. Project Directory & Component Architecture](#6-project-directory--component-architecture)
- [7. Complete Setup & Installation Guide](#7-complete-setup--installation-guide)
  - [7.1 Prerequisites](#71-prerequisites)
  - [7.2 MySQL Database Setup](#72-mysql-database-setup)
  - [7.3 FastAPI Backend Setup](#73-fastapi-backend-setup)
  - [7.4 React Frontend Setup](#74-react-frontend-setup)
  - [7.5 Environment Configuration](#75-environment-configuration)
- [8. Frontend UI/UX Deep-Dive](#8-frontend-uiux-deep-dive)
  - [8.1 Pages & Workflows](#81-pages--workflows)
  - [8.2 Key UI Components & Animations](#82-key-ui-components--animations)
  - [8.3 API Client Integration](#83-api-client-integration)
- [9. REST API Endpoint Reference](#9-rest-api-endpoint-reference)
- [10. Production Deployment & Dockerization](#10-production-deployment--dockerization)
- [11. Troubleshooting & FAQ](#11-troubleshooting--faq)

---

## 1. Executive Overview

**Food Caliper** (also known as **PlateSense**) is a next-generation AI-powered web platform designed to solve one of the hardest challenges in dietary tracking: **accurate portion size estimation without manual weighing**.

Traditional calorie-tracking apps rely on subjective human estimations (e.g., "1 cup of rice" or "1 medium bowl"), leading to macro calculation errors of up to 40%. **Food Caliper** transforms standard food photography into clinical-grade nutritional audits by integrating **deep convolutional neural networks (YOLOv8)**, **spatial geometric volumetric modeling**, and **density-based nutritional synthesis**.

Through an interactive, modern web interface built with React 18, Vite, GSAP, and Tailwind CSS, users can upload plate images or scan meals live via webcam. The system automatically segments food items, calibrates camera scale using known physical reference standards (such as plate diameter in centimeters), estimates 3D volume ($cm^3$), calculates exact mass ($grams$), and maps micronutrients and macronutrients in real time.

---

## 2. Key Product Features

### 🎯 AI-Powered Volumetric Scanner
- **Single-Image Portion Analysis**: Upload an image or capture via webcam to receive instant weight ($g$), volume ($cm^3$), and calorie breakdowns.
- **Dynamic Scale Calibration**: Adjustable caliper slider allows users to set exact plate diameters ($cm$), compensating for camera distance and perspective tilt.
- **Multi-Item Segmentation**: Detects and delineates multiple overlapping food items on a single plate simultaneously with individual confidence scoring.

### 📊 Comprehensive Nutrition Dashboard
- **Daily Budget Rings**: Visual progress rings tracking Daily Calorie targets against consumed values.
- **Macronutrient Breakdown**: Live distribution of Proteins, Carbohydrates, Fats, and Dietary Fiber.
- **Interactive Analytics**: Historical trend charts powered by Recharts (weekly calories, macro splits, top detected foods).
- **Hydration Log Counter**: Integrated daily water intake logging system with quick-add functionality.

### 📜 Historical Audits & Exportable Reports
- **Detailed Log Records**: Filterable search history of all scanned meals.
- **CSV & PDF Export**: Instant generation of structured data reports for dietitians, clinical research, or personal record-keeping.
- **Meal Classification**: Categorization by breakfast, lunch, dinner, or snack slots.

### 👤 Profile & Target Personalization
- **BMR & TDEE Calculator**: Personal statistics input (height, weight, age, activity level) automatically sets baseline caloric targets.
- **Dietary Preference Tags**: Support for Vegan, Keto, High-Protein, Gluten-Free, and Mediterranean diet profiles.
- **Custom Macro Ratios**: Customizable target percentages for protein, carb, and fat goals.

---

## 3. End-to-End Architecture & Data Flow

The following diagram illustrates how data flows between the React frontend, FastAPI backend, YOLO ML engine, density database, and MySQL storage:

```mermaid
sequenceDiagram
    autonumber
    actor User as User / Browser
    participant React as React Frontend (Vite)
    participant API as FastAPI Backend (:8000)
    participant ML as Volumetric Analysis Engine
    participant YOLO as YOLOv8 Detection Model
    participant DB as MySQL Database

    User->>React: Upload Meal Image + Set Plate Diameter (e.g., 25cm)
    React->>API: POST /api/v1/analysis/upload (FormData + user_id)
    API->>ML: Pass image file & calibration scale
    ML->>YOLO: Run inference on image (best.pt)
    YOLO-->>ML: Return Bounding Boxes, Segments & Confidence Scores
    ML->>ML: 1. Calculate Pixel-to-CM Ratio from Plate Diameter
    ML->>ML: 2. Compute 2D Area (cm²) & Estimate Height (cm)
    ML->>ML: 3. Compute 3D Volume (cm³) using Geometric Model
    ML->>ML: 4. Lookup Density (g/cm³) & Calculate Mass (g)
    ML->>ML: 5. Query Nutritional Database for Cal/Protein/Carb/Fat
    ML-->>API: Return Structured Analysis JSON Result
    API->>DB: Store record in `analyses` & `analysis_items` tables
    API-->>React: Response 200 OK + Full Analysis Payload
    React-->>User: Render Interactive Visual Overlay, Volume, Weight & Charts
```

---

## 4. Complete Technology Stack

| Layer | Technology | Description |
| :--- | :--- | :--- |
| **Frontend Core** | React 18, TypeScript, Vite 5 | SPA web application framework providing high performance and type safety. |
| **UI & Styling** | Tailwind CSS 3.4, Shadcn UI | Utility-first styling with accessible Radix UI primitives. |
| **Animations** | GSAP 3, Framer Motion 12, Lenis | Smooth inertia scrolling, scroll-triggered animations, and micro-interactions. |
| **State & Data** | TanStack React Query v5, Axios | Async state management, API caching, and robust network layer. |
| **Data Viz** | Recharts 2.15, Lucide React | Responsive chart rendering for calorie trends and macro distributions. |
| **Backend API** | Python 3.10+, FastAPI, Uvicorn | Asynchronous high-throughput RESTful API web server. |
| **Database & ORM** | MySQL 8.0, SQLAlchemy, Pydantic | Relational database storage with schema enforcement and ORM mapping. |
| **Computer Vision** | PyTorch, Ultralytics YOLOv8, OpenCV | Deep learning object detection, polygon segmentation, and contour calculation. |
| **Authentication** | PyJWT, Passlib (Bcrypt) | Secure JSON Web Token auth with password hashing and session persistence. |

---

## 5. Computer Vision & Mathematical Principles

Understanding portion size requires transforming a **2D image space ($pixels$)** into a **3D physical space ($centimeters^3$)**, and then into **mass ($grams$)**. Food Caliper accomplishes this via a 4-step pipeline:

```
[ 2D Image (px) ] ──(YOLOv8)──> [ Contours & Boxes ] ──(Scale Matrix)──> [ Real Dimensions (cm) ]
                                                                                  │
                                                                       (Geometric Mesh)
                                                                                  ▼
[ Calorie/Macro Data ] ◄──(Nutrition DB)─── [ Mass (g) ] ◄──(Density ρ)─── [ Volume (cm³) ]
```

### 5.1 YOLOv8 Detection & Polygon Segmentation
The neural network (`best.pt`) evaluates input image $I \in \mathbb{R}^{H \times W \times 3}$ in a single pass to produce object bounding coordinates and polygon boundary points:

$$\text{Detection Output} = \{ (B_i, C_i, S_i, P_i) \}_{i=1}^{N}$$

Where:
- $B_i$: Bounding box $[x_{\min}, y_{\min}, x_{\max}, y_{\max}]$
- $C_i$: Predicted food class index (e.g., Rice, Chicken Curry, Salad, Roti)
- $S_i$: Confidence score ($0 \le S_i \le 1$)
- $P_i$: Contour polygon vertices mapping exact edge boundaries in pixel space.

### 5.2 Real-World Scale Calibration Matrix
Camera distance varies across photos. To establish physical scale, the system uses a known reference object—by default, the physical dinner plate diameter $D_{\text{plate (cm)}}$ (e.g., $25\text{ cm}$).

1. **Pixel Diameter Calculation**:
   $$D_{\text{plate (px)}} = \max(W_{\text{plate-bbox}}, H_{\text{plate-bbox}})$$

2. **Pixel-to-Centimeter Scale Ratio ($S$)**:
   $$S = \frac{D_{\text{plate (cm)}}}{D_{\text{plate (px)}}} \quad \left[\frac{\text{cm}}{\text{px}}\right]$$

3. **Physical Area Conversion**:
   Given contour area in pixels $A_{\text{px}}$ derived via Green's theorem on polygon contour vertices:
   $$A_{\text{cm}^2} = A_{\text{px}} \times S^2$$

### 5.3 3D Volumetric Mesh & Depth Estimation
Since single-view RGB cameras lack direct depth channels, height $H_{\text{cm}}$ is geometrically estimated based on aspect ratio and morphological classification of specific food types (e.g., planar foods like naan/dosa vs. spherical/ellipsoidal foods like dumplings/apples vs. piled foods like rice):

- **Ellipsoidal / Dome-shaped Foods (e.g., Rice bowl, Curry, Salad)**:
  $$V_{\text{cm}^3} = \frac{2}{3} \cdot A_{\text{cm}^2} \cdot H_{\text{est}}$$

- **Planar / Flat Foods (e.g., Pizza, Pancake, Dosa, Roti)**:
  $$V_{\text{cm}^3} = A_{\text{cm}^2} \cdot H_{\text{flat-thickness}}$$

- **Cylindrical / Prismatic Foods (e.g., Cake slice, Sandwiches)**:
  $$V_{\text{cm}^3} = A_{\text{cm}^2} \cdot H_{\text{height}} \cdot K_{\text{taper}}$$

Where $K_{\text{taper}}$ is a shape factor compensation constant ($\approx 0.85$).

### 5.4 Density & Nutritional Database Synthesis
Once volume $V_{\text{cm}^3}$ (equivalent to $mL$) is computed, mass $M_{\text{grams}}$ is derived using item-specific bulk density values ($\rho \text{ in g/cm}^3$):

$$M_{\text{grams}} = V_{\text{cm}^3} \times \rho_{\text{food}}$$

*Sample Densities ($\rho$):*
- White Rice (cooked): $0.85 \text{ g/cm}^3$
- Chicken Curry: $1.05 \text{ g/cm}^3$
- Green Salad: $0.35 \text{ g/cm}^3$
- Whole Wheat Roti: $0.65 \text{ g/cm}^3$

Finally, macronutrient values are calculated against the nutritional database (`Indian_Food_Nutrition_Processed.csv` / MySQL table):

$$\text{Nutrient}_{\text{total}} = \text{Nutrient}_{\text{per 100g}} \times \frac{M_{\text{grams}}}{100}$$


---

## 6. Project Directory & Component Architecture

```
Food_caliper/
├── public/                         # Static public assets (favicon, images)
├── src/
│   ├── assets/                     # Hero images, logos, background textures
│   │   ├── hero-food.jpg
│   │   ├── logo.png
│   │   └── bg-texture.jpg
│   ├── components/                 # Reusable UI & Layout Components
│   │   ├── ui/                     # Shadcn UI primitives (Button, Dialog, Card, Tabs, etc.)
│   │   ├── AnimatedCounter.tsx      # Smooth number ticker animation
│   │   ├── BackgroundLayout.tsx     # Ambient dynamic layout wrapper
│   │   ├── CardSwap.tsx            # Animated feature card switcher
│   │   ├── Carousel.tsx            # Interactive showcase carousel
│   │   ├── CinematicLoader.tsx     # Fullscreen intro loader sequence
│   │   ├── DarkModeToggle.tsx      # Theme mode switcher button
│   │   ├── Dock.tsx                # Floating macOS-style navigation dock
│   │   ├── FeedbackButton.tsx      # Feedback trigger modal
│   │   ├── LenisGSAPBridge.tsx     # Synchronizes Lenis smooth scroll with GSAP
│   │   ├── LogoLoop.tsx            # Infinite scrolling technology brand ticker
│   │   ├── Navbar.tsx              # Top global navigation bar with mobile menu
│   │   ├── PlatformSection.tsx     # Technical platform highlights block
│   │   ├── ScanAnimation.tsx       # Laser scanner visual effect over food images
│   │   ├── ScrollReveal.tsx        # Scroll-triggered fade/rise animations
│   │   ├── StackCarousel.tsx       # 3D stacked card deck component
│   │   └── TargetCursor.tsx        # Dynamic animated target cursor follower
│   ├── contexts/
│   │   └── ThemeContext.tsx        # Light/Dark mode state provider
│   ├── hooks/
│   │   ├── use-mobile.tsx          # Mobile screen breakpoint observer
│   │   └── use-toast.ts            # Toast notification dispatcher
│   ├── lib/
│   │   └── utils.ts                # Tailwind class merge helper (`cn()`)
│   ├── pages/                      # Application Route Views
│   │   ├── Index.tsx               # Main landing portal with interactive demo
│   │   ├── Login.tsx               # JWT Authentication portal (Sign In / Sign Up)
│   │   ├── Analysis.tsx            # Core Volumetric Scanning & Calibration portal
│   │   ├── Dashboard.tsx           # Daily nutrition, hydration & macro dashboard
│   │   ├── Reports.tsx             # Audit logs, history filtering & CSV exports
│   │   ├── Profile.tsx             # User body metrics, BMR/TDEE & target goals
│   │   └── NotFound.tsx            # 404 Error page view
│   ├── services/
│   │   └── apiClient.ts            # Central Axios API client with token management
│   ├── App.tsx                     # Main App component with routes & providers
│   ├── main.tsx                    # React DOM entry point
│   └── index.css                   # Global styles, Tailwind directives & CSS variables
├── .env.local                      # Local environment configuration
├── components.json                 # Shadcn UI configuration
├── eslint.config.js                # ESLint code linting rules
├── index.html                      # HTML template entry point
├── package.json                    # Dependencies & scripts
├── postcss.config.js               # PostCSS & Tailwind plugin setup
├── tailwind.config.ts              # Tailwind CSS design system tokens
├── tsconfig.json                   # Main TypeScript configuration
└── vite.config.ts                  # Vite bundler & path aliases setup
```

---

## 7. Complete Setup & Installation Guide

### 7.1 Prerequisites
Ensure the following tools are installed on your workstation:
- **Node.js**: v18.0.0 or higher
- **npm** (v9+) or **Bun** / **Yarn**
- **Python**: v3.10 or higher
- **MySQL Server**: v8.0 or higher (or Workbench)

---

### 7.2 MySQL Database Setup

1. Launch MySQL CLI or MySQL Workbench and log in as root:
   ```bash
   mysql -u root -p
   ```

2. Create the database:
   ```sql
   CREATE DATABASE IF NOT EXISTS food_caliper_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
   ```

3. Database tables (`users`, `analyses`, `analysis_items`, `food_nutrition`) are automatically created by SQLAlchemy models upon starting the backend application for the first time.

---

### 7.3 FastAPI Backend Setup

1. Open your terminal and navigate to the backend directory:
   ```bash
   cd Food/backend
   ```

2. Create and activate a Python virtual environment:
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

3. Install required Python packages:
   ```bash
   pip install -r requirements.txt
   ```

4. Create a `.env` file inside `Food/backend/.env`:
   ```env
   DATABASE_URL=mysql+pymysql://root:your_mysql_password@localhost:3306/food_caliper_db
   SECRET_KEY=super-secret-jwt-key-change-in-production-32chars
   ALGORITHM=HS256
   ACCESS_TOKEN_EXPIRE_MINUTES=1440
   YOLO_MODEL_PATH=../best.pt
   API_HOST=0.0.0.0
   API_PORT=8000
   FRONTEND_URL=http://localhost:5173
   ```

5. Run the FastAPI dev server:
   ```bash
   python main.py
   ```
   *The server will boot at `http://localhost:8000`. Test docs at `http://localhost:8000/docs`.*

---

### 7.4 React Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd Food/Website/Food_caliper
   ```

2. Install Node module dependencies:
   ```bash
   npm install
   ```

3. Create `.env.local` inside `Website/Food_caliper/.env.local`:
   ```env
   VITE_API_URL=http://localhost:8000
   ```

4. Start the Vite development server:
   ```bash
   npm run dev
   ```

5. Open your browser and navigate to:
   ```
   http://localhost:5173
   ```

---

### 7.5 Environment Configuration

| File | Environment Variable | Required Value / Example | Description |
| :--- | :--- | :--- | :--- |
| `backend/.env` | `DATABASE_URL` | `mysql+pymysql://root:pass@localhost:3306/food_caliper_db` | MySQL DB connection string. |
| `backend/.env` | `YOLO_MODEL_PATH` | `../best.pt` | Path to trained PyTorch weights. |
| `backend/.env` | `SECRET_KEY` | `your-random-32-character-secret` | Key for signing JWT tokens. |
| `Food_caliper/.env.local` | `VITE_API_URL` | `http://localhost:8000` | Address of running FastAPI server. |

---

## 8. Frontend UI/UX Deep-Dive

### 8.1 Pages & Workflows

1. **Landing Portal (`/`)**:
   - Features a high-converting hero section with interactive scanner preview.
   - Smooth Lenis momentum scrolling integrated with GSAP trigger animations.
   - Interactive bento grid explaining Computer Vision, 3D Mesh Generation, Plate Scale Matrix, and Nutritional Audit.

2. **Scanner & Analysis Portal (`/analysis`)**:
   - **Dual Input Modes**: Drag-and-drop file uploader (PNG, JPG, WEBP) or live webcam stream.
   - **Interactive Caliper**: Real-time slider adjusting physical plate diameter from $15\text{ cm}$ to $35\text{ cm}$.
   - **Visual Overlay**: Renders bounding boxes and item names directly over analyzed food images.
   - **Results Card**: Detailed macro breakdown (Calories, Weight, Volume, Protein, Carbs, Fats) with instant CSV report download.

3. **Dashboard (`/dashboard`)**:
   - Daily progress bars tracking calorie goals calculated via individual Mifflin-St Jeor BMR targets.
   - Water cup hydration counter with dynamic increment buttons.
   - Recharts visual charts displaying weekly calorie intake trends and top detected food categories.

4. **Audit History & Reports (`/reports`)**:
   - Table view listing past meal scans with dates, estimated weights, and item breakdowns.
   - Filter controls by date range or search keyword.

5. **Profile & Personalization (`/profile`)**:
   - Personal physical metrics input (Height in cm, Weight in kg, Age, Gender, Activity Level).
   - Target goal configuration (Weight Loss, Maintenance, Muscle Gain).

---

### 8.2 Key UI Components & Animations

- **TargetCursor (`TargetCursor.tsx`)**: Customized dynamic crosshair cursor that follows mouse position with smooth lag physics and spins on hover over action elements.
- **CinematicLoader (`CinematicLoader.tsx`)**: Fullscreen initial loading animation session state, establishing a high-end futuristic product presentation.
- **Dock (`Dock.tsx`)**: Floating macOS-style bottom dock providing instant access to scanner, dashboard, reports, and profile views.
- **ScanAnimation (`ScanAnimation.tsx`)**: Laser line scanning effect superimposed over uploaded food images during analysis wait states.

---

### 8.3 API Client Integration

All frontend network requests are funneled through `apiClient.ts`, an Axios singleton class managing session tokens and user state:

```typescript
import { apiClient } from "@/services/apiClient";

// Example 1: Register User
const user = await apiClient.register("john_doe", "john@example.com", "secret123", "John Doe");

// Example 2: Analyze Meal Image
const fileInput = document.getElementById("food-image-input") as HTMLInputElement;
const file = fileInput.files[0];
const analysisResult = await apiClient.uploadImage(file);

console.log("Detected Items:", analysisResult.food_items);
console.log("Total Calories:", analysisResult.summary.total_calories);
```

---

## 9. REST API Endpoint Reference

### Authentication Endpoints (`/api/v1/auth`)

| Method | Endpoint | Description | Request Body |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/v1/auth/register` | Create a new user account | `{ username, email, password, full_name }` |
| `POST` | `/api/v1/auth/login` | Authenticate user & return JWT token | `{ email, password }` |
| `GET` | `/api/v1/auth/profile/{id}` | Fetch profile details for specified user ID | *None* |
| `PUT` | `/api/v1/auth/profile/{id}` | Update body metrics and macro targets | `{ height_cm, weight_kg, age, ... }` |

### Volumetric Analysis Endpoints (`/api/v1/analysis`)

| Method | Endpoint | Description | Query / Body |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/v1/analysis/upload` | Upload meal photo and execute YOLO 3D analysis | `FormData: file`, `params: user_id` |
| `GET` | `/api/v1/analysis/{id}` | Get full details for specific analysis ID | `params: user_id` |
| `GET` | `/api/v1/analysis/history/all` | Fetch paginated analysis history for user | `params: user_id, limit, offset` |
| `DELETE` | `/api/v1/analysis/{id}` | Delete an analysis record | `params: user_id` |

### User Analytics Endpoints (`/api/v1/user`)

| Method | Endpoint | Description | Query Parameters |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/v1/user/dashboard` | Get combined daily summary, recent scans & macro rings | `user_id` |
| `GET` | `/api/v1/user/stats/weekly` | Get weekly calorie intake and macro distribution | `user_id` |
| `GET` | `/api/v1/user/stats/monthly` | Get monthly historic macro trends | `user_id` |

---

## 10. Production Deployment & Dockerization

To deploy Food Caliper to production cloud environments (AWS, GCP, DigitalOcean, or Azure), you can run the full stack via Docker containers.

### Dockerfile Deployment

A root `Dockerfile` is provided for containerizing the full application stack:

```bash
# Build Docker image
docker build -t food-caliper:latest .

# Run container with environment file
docker run -d \
  -p 8000:8000 \
  -p 5173:5173 \
  --env-file backend/.env \
  --name food-caliper-app \
  food-caliper:latest
```

---

## 11. Troubleshooting & FAQ

### Q1: The backend returns `YOLO model not found` during analysis.
**Solution**: Ensure that `best.pt` exists in the project root directory and that `YOLO_MODEL_PATH=../best.pt` in `backend/.env` points to the correct absolute or relative file location.

### Q2: How can I change the default plate diameter for calibration?
**Solution**: In the Scanner UI (`/analysis`), adjust the **Plate Diameter** slider. Alternatively, configure `PLATE_DIAMETER_CM=25` in `backend/.env`.

### Q3: Why does volume calculation show 0 for a custom food item?
**Solution**: Ensure the detected item name exists in `Indian_Food_Nutrition_Processed.csv` or the `food_nutrition_database` table so density values ($\rho$) can be resolved.

### Q4: CORS errors occur when calling the API from the frontend.
**Solution**: Ensure `FRONTEND_URL=http://localhost:5173` is set in `backend/.env` and matches the origin address where Vite is running.

---

<p align="center">
  <b>Food Caliper (PlateSense)</b> • Built with React, Vite, FastAPI, YOLOv8 & MySQL.
</p>
