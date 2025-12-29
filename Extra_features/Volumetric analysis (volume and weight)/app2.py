import torch
import cv2
import numpy as np
import json
from datetime import datetime
from pathlib import Path
from ultralytics import YOLO
from transformers import pipeline
import gradio as gr
import pandas as pd
import warnings
warnings.filterwarnings('ignore')
from volumetric_food_analysis import FoodVolumeAnalyzer

ANALYZER = None
CURRENT_RESULT = None


def initialize_analyzer(model_path, plate_size):
    global ANALYZER
    ANALYZER = FoodVolumeAnalyzer(
        yolo_model_path=model_path,
        plate_diameter_cm=plate_size
    )
    return "Model loaded"


def analyze_image_ui(image, model_path, plate_size):
    global ANALYZER, CURRENT_RESULT

    if image is None:
        return None, "No image uploaded", {}, None

    if ANALYZER is None:
        initialize_analyzer(model_path, plate_size)

    temp_img = "temp_input.jpg"
    cv2.imwrite(temp_img, cv2.cvtColor(image, cv2.COLOR_RGB2BGR))

    result = ANALYZER.analyze_image(temp_img)
    CURRENT_RESULT = result

    annotated = ANALYZER.visualize_results(temp_img, result)
    annotated = cv2.cvtColor(annotated, cv2.COLOR_BGR2RGB)

    # Summary text
    summary = [
        f"Total Items: {result['summary']['total_items_detected']}",
        f"Total Volume: {result['summary']['total_volume_ml']} ml",
        f"Total Weight: {result['summary']['total_weight_grams']} g",
        ""
    ]

    for item in result["food_items"]:
        summary.append(
            f"- {item['name']} | "
            f"{item['volume']['volume_ml']} ml | "
            f"{item['volume']['weight_grams']} g"
        )

    summary_text = "\n".join(summary)

    # CSV
    rows = []
    for item in result["food_items"]:
        rows.append({
            "Food": item["name"],
            "Volume_ml": item["volume"]["volume_ml"],
            "Weight_g": item["volume"]["weight_grams"],
            "Area_cm2": item["volume"]["area_cm2"],
            "Height_cm": item["volume"]["estimated_height_cm"],
            "Confidence": item["confidence"]
        })

    df = pd.DataFrame(rows)

    return annotated, summary_text, result, df

# GRADIO APP
with gr.Blocks(title="Food Volumetric Analysis") as demo:

    gr.Markdown("""
    # 🍽️ Food Detection, Volume & Weight Estimation  
    Upload a food image to estimate **volume (ml)** and **weight (grams)**.
    """)

    with gr.Row():
        with gr.Column():
            image_input = gr.Image(type="numpy", label="Upload Food Image")

            model_path = gr.Textbox(
                label="YOLO Model Path",
                value="best.pt"
            )

            plate_size = gr.Slider(
                label="Plate Diameter (cm)",
                minimum=15,
                maximum=35,
                value=25
            )

            analyze_btn = gr.Button("Analyze")

        with gr.Column():
            output_image = gr.Image(label="Annotated Result")
            summary_output = gr.Textbox(label="Summary", lines=8)

    json_output = gr.JSON(label="JSON Output")
    csv_output = gr.Dataframe(label="CSV Output")

    analyze_btn.click(
        fn=analyze_image_ui,
        inputs=[image_input, model_path, plate_size],
        outputs=[output_image, summary_output, json_output, csv_output]
    )

    gr.Markdown("""
    **Notes**
    - Uses YOLOv8 for detection  
    - Volume = Area × Height × Fill Factor  
    - Weight = Volume × Density  
    - Depth estimation via Depth-Anything  
    """)

# LAUNCH
if __name__ == "__main__":
    demo.launch(
        server_name="0.0.0.0",
        server_port=7860,
        show_error=True
    )
