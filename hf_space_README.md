---
title: PlateSense Backend
emoji: 🍽️
colorFrom: green
colorTo: emerald
sdk: docker
pinned: false
app_port: 7860
---

# PlateSense Backend API

AI-powered food volumetric analysis and nutrition tracking system.

## API Endpoints

- `GET /` — Root / welcome
- `GET /health` — Health check
- `GET /docs` — Interactive Swagger UI
- `POST /api/v1/auth/register` — Register new user
- `POST /api/v1/auth/login` — Login
- `POST /api/v1/analysis/upload` — Upload food image for analysis

## Tech Stack

- **FastAPI** — REST API framework
- **YOLO (Ultralytics)** — Food detection model
- **Depth-Anything** — Monocular depth estimation
- **PyTorch** (CPU) — ML inference
- **SQLAlchemy** — ORM / database
