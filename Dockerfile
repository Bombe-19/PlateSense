# ── Base image: slim Python for smaller final image size ──────────────────────
FROM python:3.11-slim

# ── System dependencies for OpenCV (headless) and build tools ─────────────────
RUN apt-get update && apt-get install -y \
    libglib2.0-0 \
    libsm6 \
    libxext6 \
    libxrender-dev \
    libgomp1 \
    libglib2.0-dev \
    && rm -rf /var/lib/apt/lists/*

# ── Set working directory ──────────────────────────────────────────────────────
WORKDIR /app

# ── Copy requirements first (Docker cache optimization) ───────────────────────
COPY backend/requirements.txt ./requirements.txt

# ── Install Python dependencies ────────────────────────────────────────────────
RUN pip install --no-cache-dir --upgrade pip && \
    pip install --no-cache-dir -r requirements.txt && \
    pip install --no-cache-dir huggingface_hub

# ── Copy backend source code ───────────────────────────────────────────────────
COPY backend/ ./

# ── Copy the nutrition dataset ────────────────────────────────────────────────
COPY Indian_Food_Nutrition_Processed.csv ./Indian_Food_Nutrition_Processed.csv

# ── Copy the volumetric analysis core module ──────────────────────────────────
COPY volumetric_food_analysis.py ./volumetric_food_analysis.py

# ── Create uploads folder ──────────────────────────────────────────────────────
RUN mkdir -p uploads

# ── Create startup script that downloads model then starts server ─────────────
RUN echo '#!/bin/bash\n\
echo "Checking for YOLO model..."\n\
if [ ! -f "/app/best.pt" ]; then\n\
    echo "Downloading best.pt from HuggingFace Hub..."\n\
    python -c "from huggingface_hub import hf_hub_download; hf_hub_download(repo_id=\"Bombe-19/platesense-model\", filename=\"best.pt\", local_dir=\"/app\")"\n\
    echo "Model downloaded!"\n\
else\n\
    echo "Model already exists, skipping download."\n\
fi\n\
exec uvicorn main:app --host 0.0.0.0 --port 7860 --workers 1' > /app/start.sh && \
    chmod +x /app/start.sh

# ── HuggingFace Spaces requires port 7860 ─────────────────────────────────────
EXPOSE 7860

# ── Environment defaults (override in HF Spaces Settings → Variables) ─────────
ENV API_HOST=0.0.0.0
ENV API_PORT=7860
ENV ENVIRONMENT=production
ENV YOLO_MODEL_PATH=/app/best.pt
ENV YOLO_CONFIG_DIR=/tmp/Ultralytics

# ── Start via startup script (downloads model if needed, then runs server) ────
CMD ["/bin/bash", "/app/start.sh"]
