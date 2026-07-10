import torch
import cv2
import numpy as np
import json
from datetime import datetime
from pathlib import Path
from ultralytics import YOLO
from transformers import pipeline
import warnings
warnings.filterwarnings('ignore')

# Set optimal CPU thread count — use half of available logical cores (balance speed vs memory)
import multiprocessing as _mp
_optimal_threads = max(2, _mp.cpu_count() // 2)
torch.set_num_threads(_optimal_threads)
print(f"⚡ torch threads set to {_optimal_threads} (of {_mp.cpu_count()} logical cores)")


class FoodVolumeAnalyzer:
    """
    Complete food volumetric analysis system with component detection
    """
    
    def __init__(self, yolo_model_path, plate_diameter_cm=25):
        """
        Initialize the analyzer
        
        Args:
            yolo_model_path: Path to trained YOLO model
            plate_diameter_cm: Standard plate diameter for reference
        """
        print("🔧 Initializing Food Volume Analyzer...")
        
        # Load YOLO model
        self.yolo_model = YOLO(yolo_model_path)
        print(f"✅ YOLO model loaded: {yolo_model_path}")
        
        # Load depth estimation model
        print("⏳ Loading depth estimation model...")
        self.depth_estimator = pipeline(
            "depth-estimation",
            model="LiheYoung/depth-anything-small-hf"  # Lightweight & fast
        )
        print("✅ Depth model loaded")
        
        # Configuration
        self.plate_diameter_cm = plate_diameter_cm
        self.pixels_per_cm = None
        
        # Component mapping - Define which sub-items can appear in main dishes
        self.component_map = {
            'curd_rice': ['pomegranate', 'pickle', 'curry_leaves', 'coriander'],
            'biryani': ['raita', 'egg', 'chicken', 'mutton', 'onion'],
            'dosa': ['chutney', 'sambar', 'potato', 'masala'],
            'idli': ['sambar', 'chutney', 'podi'],
            'thali': ['rice', 'roti', 'dal', 'curry', 'pickle', 'papad'],
            'pulao': ['raita', 'pickle', 'papad'],
            'paratha': ['curd', 'pickle', 'butter'],
            # Add more mappings based on your classes
        }
        
        # Food height estimates (in cm) - for volume calculation
        self.food_height_estimates = {
            'rice': 2.5,
            'curd_rice': 3.0,
            'biryani': 3.5,
            'curry': 3.0,
            'dal': 3.0,
            'sambar': 3.5,
            'roti': 0.3,
            'paratha': 0.4,
            'dosa': 0.2,
            'idli': 2.5,
            'chapati': 0.3,
            'naan': 0.5,
            'pickle': 1.5,
            'chutney': 2.0,
            'raita': 2.5,
            'salad': 2.0,
            'papad': 0.2,
            # Default for unknown items
            'default': 2.0
        }
        
        # Fill factors (how much of bounding box is actually food)
        self.fill_factors = {
            'round': 0.78,      # circular items (idli, vada)
            'rectangular': 0.85, # roti, paratha
            'irregular': 0.70,   # curry, rice
            'default': 0.75
        }
        
        # Food density database (grams per ml)
        # Based on typical Indian food densities
        self.food_densities = {
            # Rice varieties
            'rice': 0.85,
            'white_rice': 0.85,
            'brown_rice': 0.80,
            'curd_rice': 0.90,
            'biryani': 0.75,
            'pulao': 0.70,
            'fried_rice': 0.65,
            
            # Breads
            'roti': 0.45,
            'chapati': 0.45,
            'paratha': 0.60,
            'naan': 0.50,
            'puri': 0.40,
            'dosa': 0.55,
            'idli': 0.50,
            'vada': 0.65,
            
            # Curries and gravies
            'curry': 0.95,
            'dal': 0.90,
            'sambar': 0.92,
            'rasam': 0.88,
            'gravy': 0.95,
            
            # Vegetables
            'vegetable': 0.70,
            'potato': 0.75,
            'paneer': 1.05,
            'palak': 0.65,
            'bhindi': 0.60,
            
            # Condiments
            'pickle': 1.10,
            'chutney': 0.85,
            'raita': 0.95,
            'salad': 0.50,
            'papad': 0.35,
            
            # Sweets
            'sweet': 1.15,
            'kheer': 1.00,
            'halwa': 1.20,
            'gulab_jamun': 1.10,
            'ladoo': 0.90,
            
            # Fruits
            'pomegranate': 0.60,
            'banana': 0.55,
            'apple': 0.50,
            'mango': 0.60,
            
            # Proteins
            'chicken': 0.95,
            'mutton': 1.00,
            'fish': 0.90,
            'egg': 1.05,
            
            # Others
            'coriander': 0.30,
            'curry_leaves': 0.25,
            'onion': 0.55,
            'tomato': 0.60,
            
            # Default
            'default': 0.85
        }
        
        print("✅ Analyzer ready!\n")
    
    
    def calibrate_scale(self, image, detections):
        """
        Calibrate pixel-to-cm ratio using plate or known reference
        """
        # Try to find plate or reference object
        for i, box in enumerate(detections):
            cls_id = int(box.cls[0])
            class_name = self.yolo_model.names[cls_id].lower()
            
            # Check if it's a reference object
            if 'plate' in class_name or 'thali' in class_name:
                x1, y1, x2, y2 = map(int, box.xyxy[0])
                width_pixels = x2 - x1
                self.pixels_per_cm = width_pixels / self.plate_diameter_cm
                return True
        
        # Fallback: use image width as approximate plate width
        h, w = image.shape[:2]
        self.pixels_per_cm = w / self.plate_diameter_cm
        return False
    
    
    def estimate_depth(self, image):
        """
        Estimate depth map for the image.
        OPTIMIZATION: Downscale image to max 640px before passing to pipeline to
        drastically reduce transformer computation time on CPU.
        """
        from PIL import Image as PILImage
        
        h, w = image.shape[:2]
        
        # Down-scale before depth inference
        MAX_DIM = 640
        scale = min(1.0, MAX_DIM / max(h, w))
        if scale < 1.0:
            new_w = int(w * scale)
            new_h = int(h * scale)
            img_small = cv2.resize(image, (new_w, new_h), interpolation=cv2.INTER_AREA)
        else:
            img_small = image
            
        # Convert BGR to RGB
        img_rgb = cv2.cvtColor(img_small, cv2.COLOR_BGR2RGB)
        
        # Convert to PIL Image for depth estimator
        pil_image = PILImage.fromarray(img_rgb)
        
        # Get depth prediction
        depth_result = self.depth_estimator(pil_image)
        depth_map = np.array(depth_result['depth'])
        
        # Resize back to original image dimensions
        depth_map = cv2.resize(depth_map, (w, h))
        
        # Normalize to 0-1 range
        depth_normalized = (depth_map - depth_map.min()) / (depth_map.max() - depth_map.min() + 1e-8)
        
        return depth_normalized
    
    
    def calculate_volume(self, bbox, depth_region, class_name):
        """
        Calculate volume and weight for a food item
        """
        x1, y1, x2, y2 = bbox
        
        # Calculate area in pixels
        width_pixels = x2 - x1
        height_pixels = y2 - y1
        area_pixels = width_pixels * height_pixels
        
        # Convert to cm²
        area_cm2 = area_pixels / (self.pixels_per_cm ** 2)
        
        # Get food-specific height estimate
        food_class = class_name.lower().replace(' ', '_')
        estimated_height_cm = self.food_height_estimates.get(
            food_class, 
            self.food_height_estimates['default']
        )
        
        # Refine height using depth map
        avg_depth = np.mean(depth_region)
        # Scale depth (0-1) to realistic height range
        depth_height_cm = avg_depth * 8  # Adjust multiplier based on your setup
        
        # Blend estimated and depth-based height
        final_height_cm = (estimated_height_cm * 0.6) + (depth_height_cm * 0.4)
        
        # Get fill factor
        fill_factor = self.fill_factors.get('irregular', self.fill_factors['default'])
        
        # Calculate volume (area × height × fill_factor)
        volume_ml = area_cm2 * final_height_cm * fill_factor
        
        # Calculate weight (volume × density)
        density = self.food_densities.get(food_class, self.food_densities['default'])
        weight_grams = volume_ml * density
        
        return {
            'volume_ml': round(volume_ml, 2),
            'weight_grams': round(weight_grams, 2),
            'weight_kg': round(weight_grams / 1000, 3),
            'area_cm2': round(area_cm2, 2),
            'estimated_height_cm': round(final_height_cm, 2),
            'density_g_per_ml': round(density, 2),
            'dimensions_cm': {
                'width': round(width_pixels / self.pixels_per_cm, 2),
                'height': round(height_pixels / self.pixels_per_cm, 2)
            }
        }
    
    
    def detect_components(self, image, main_bbox, main_class, detections):
        """
        Detect sub-components within a main food item
        """
        x1, y1, x2, y2 = main_bbox
        main_class_lower = main_class.lower().replace(' ', '_')
        
        # Check if this food type has known components
        if main_class_lower not in self.component_map:
            return []
        
        expected_components = self.component_map[main_class_lower]
        found_components = []
        
        # Check all detections for overlapping components
        for box in detections:
            comp_x1, comp_y1, comp_x2, comp_y2 = map(int, box.xyxy[0])
            comp_cls_id = int(box.cls[0])
            comp_class = self.yolo_model.names[comp_cls_id].lower().replace(' ', '_')
            comp_conf = float(box.conf[0])
            
            # Check if component is in expected list
            if comp_class not in expected_components:
                continue
            
            # Check if component bbox overlaps with main item bbox (IoU)
            # Calculate overlap
            overlap_x1 = max(x1, comp_x1)
            overlap_y1 = max(y1, comp_y1)
            overlap_x2 = min(x2, comp_x2)
            overlap_y2 = min(y2, comp_y2)
            
            if overlap_x1 < overlap_x2 and overlap_y1 < overlap_y2:
                overlap_area = (overlap_x2 - overlap_x1) * (overlap_y2 - overlap_y1)
                comp_area = (comp_x2 - comp_x1) * (comp_y2 - comp_y1)
                overlap_ratio = overlap_area / comp_area
                
                # If component is mostly inside main item (>50% overlap)
                if overlap_ratio > 0.5:
                    found_components.append({
                        'name': comp_class,
                        'confidence': round(comp_conf, 4),
                        'overlap_ratio': round(overlap_ratio, 2)
                    })
        
        return found_components
    
    
    def analyze_image(self, image_path, output_json_path=None):
        """
        Perform complete volumetric analysis on an image
        
        Args:
            image_path: Path to input image
            output_json_path: Optional path to save JSON output
            
        Returns:
            dict: Complete analysis results
        """
        print(f"\n{'='*70}")
        print(f"🔍 ANALYZING: {Path(image_path).name}")
        print(f"{'='*70}")
        
        # Load image
        image = cv2.imread(str(image_path))
        if image is None:
            raise ValueError(f"Could not load image: {image_path}")
        
        h, w = image.shape[:2]
        
        # Step 1: Run YOLO detection
        print("📦 Step 1/4: Running object detection...")
        results = self.yolo_model(image, verbose=False)
        detections = results[0].boxes
        
        if len(detections) == 0:
            print("⚠️  No food items detected!")
            return self._create_empty_result(image_path)
        
        print(f"   ✅ Detected {len(detections)} items")
        
        # Step 2: Calibrate scale
        print("📏 Step 2/4: Calibrating scale...")
        calibrated = self.calibrate_scale(image, detections)
        if calibrated:
            print(f"   ✅ Calibrated using reference object")
        else:
            print(f"   ⚠️  Using default calibration")
        
        # Step 3: Estimate depth
        print("🌊 Step 3/4: Estimating depth map...")
        depth_map = self.estimate_depth(image)
        print("   ✅ Depth map generated")
        
        # Step 4: Calculate volumes and detect components
        print("📊 Step 4/4: Calculating volumes & detecting components...")
        
        food_items = []
        total_volume = 0
        
        for i, box in enumerate(detections):
            x1, y1, x2, y2 = map(int, box.xyxy[0])
            cls_id = int(box.cls[0])
            class_name = self.yolo_model.names[cls_id]
            confidence = float(box.conf[0])
            
            # Extract depth region
            depth_region = depth_map[y1:y2, x1:x2]
            
            # Calculate volume
            volume_info = self.calculate_volume([x1, y1, x2, y2], depth_region, class_name)
            
            # Detect components
            components = self.detect_components(image, [x1, y1, x2, y2], class_name, detections)
            
            # Build food item result
            food_item = {
                'item_id': i + 1,
                'name': class_name,
                'confidence': round(confidence, 4),
                'bounding_box': {
                    'x1': x1,
                    'y1': y1,
                    'x2': x2,
                    'y2': y2,
                    'center_x': (x1 + x2) // 2,
                    'center_y': (y1 + y2) // 2
                },
                'volume': volume_info,
                'components': components if components else None
            }
            
            food_items.append(food_item)
            total_volume += volume_info['volume_ml']
            
            # Print item info
            print(f"   ✅ {class_name}: {volume_info['volume_ml']} ml ({volume_info['weight_grams']}g)", end="")
            if components:
                print(f" (with {len(components)} components)")
            else:
                print()
        
        # Create final result
        result = {
            'analysis_metadata': {
                'timestamp': datetime.now().isoformat(),
                'image_path': str(image_path),
                'image_filename': Path(image_path).name,
                'image_dimensions': {
                    'width': w,
                    'height': h
                },
                'model_used': str(self.yolo_model.ckpt_path) if hasattr(self.yolo_model, 'ckpt_path') else 'unknown',
                'calibration_method': 'reference_object' if calibrated else 'default',
                'reference_plate_diameter_cm': self.plate_diameter_cm
            },
            'summary': {
                'total_items_detected': len(food_items),
                'total_volume_ml': round(total_volume, 2),
                'total_volume_liters': round(total_volume / 1000, 3),
                'total_weight_grams': round(sum(item['volume']['weight_grams'] for item in food_items), 2),
                'total_weight_kg': round(sum(item['volume']['weight_grams'] for item in food_items) / 1000, 3),
                'items_with_components': sum(1 for item in food_items if item['components'])
            },
            'food_items': food_items
        }
        
        # Save JSON if path provided
        if output_json_path:
            self._save_json(result, output_json_path)
        
        print(f"\n{'='*70}")
        print(f"✅ ANALYSIS COMPLETE")
        print(f"   Total items: {len(food_items)}")
        print(f"   Total volume: {total_volume:.2f} ml ({total_volume/1000:.3f} L)")
        print(f"   Total weight: {result['summary']['total_weight_grams']:.2f}g ({result['summary']['total_weight_kg']:.3f} kg)")
        print(f"{'='*70}\n")
        
        return result
    
    
    def analyze_batch(self, image_folder, output_folder=None):
        """
        Analyze multiple images in a folder
        
        Args:
            image_folder: Path to folder containing images
            output_folder: Optional folder to save JSON outputs
            
        Returns:
            list: List of all analysis results
        """
        image_folder = Path(image_folder)
        
        # Find all images
        image_extensions = ['.jpg', '.jpeg', '.png', '.bmp']
        image_files = []
        for ext in image_extensions:
            image_files.extend(image_folder.glob(f'*{ext}'))
            image_files.extend(image_folder.glob(f'*{ext.upper()}'))
        
        if len(image_files) == 0:
            print(f"⚠️  No images found in {image_folder}")
            return []
        
        print(f"\n{'='*70}")
        print(f"📁 BATCH ANALYSIS: {len(image_files)} images")
        print(f"{'='*70}\n")
        
        # Create output folder if needed
        if output_folder:
            output_folder = Path(output_folder)
            output_folder.mkdir(parents=True, exist_ok=True)
        
        results = []
        for i, img_path in enumerate(image_files, 1):
            print(f"\n[{i}/{len(image_files)}]", end=" ")
            
            # Determine output path
            if output_folder:
                output_json = output_folder / f"{img_path.stem}_analysis.json"
            else:
                output_json = None
            
            try:
                result = self.analyze_image(img_path, output_json)
                results.append(result)
            except Exception as e:
                print(f"❌ Error processing {img_path.name}: {str(e)}")
                continue
        
        # Create batch summary
        if output_folder:
            batch_summary = self._create_batch_summary(results)
            summary_path = output_folder / "batch_summary.json"
            self._save_json(batch_summary, summary_path)
            print(f"\n📊 Batch summary saved to: {summary_path}")
        
        return results
    
    
    def _create_empty_result(self, image_path):
        """Create result structure for images with no detections"""
        return {
            'analysis_metadata': {
                'timestamp': datetime.now().isoformat(),
                'image_path': str(image_path),
                'image_filename': Path(image_path).name,
            },
            'summary': {
                'total_items_detected': 0,
                'total_volume_ml': 0,
                'total_volume_liters': 0,
                'items_with_components': 0
            },
            'food_items': []
        }
    
    
    def _create_batch_summary(self, results):
        """Create summary for batch processing"""
        total_images = len(results)
        total_items = sum(r['summary']['total_items_detected'] for r in results)
        total_volume = sum(r['summary']['total_volume_ml'] for r in results)
        
        # Find most common items
        item_counts = {}
        for result in results:
            for item in result['food_items']:
                name = item['name']
                item_counts[name] = item_counts.get(name, 0) + 1
        
        most_common = sorted(item_counts.items(), key=lambda x: x[1], reverse=True)[:10]
        
        return {
            'batch_summary': {
                'timestamp': datetime.now().isoformat(),
                'total_images_analyzed': total_images,
                'total_items_detected': total_items,
                'total_volume_ml': round(total_volume, 2),
                'total_volume_liters': round(total_volume / 1000, 3),
                'average_items_per_image': round(total_items / total_images, 2) if total_images > 0 else 0,
                'average_volume_per_image_ml': round(total_volume / total_images, 2) if total_images > 0 else 0,
                'most_common_items': [
                    {'name': name, 'count': count, 'percentage': round(count/total_items*100, 1)}
                    for name, count in most_common
                ]
            },
            'individual_results': results
        }
    
    
    def _save_json(self, data, output_path):
        """Save data to JSON file"""
        output_path = Path(output_path)
        output_path.parent.mkdir(parents=True, exist_ok=True)
        
        with open(output_path, 'w', encoding='utf-8') as f:
            json.dump(data, f, indent=2, ensure_ascii=False)
        
        print(f"💾 JSON saved to: {output_path}")
    
    
    def visualize_results(self, image_path, analysis_result, output_path=None):
        """
        Create visualization with bounding boxes and volume labels
        
        Args:
            image_path: Path to original image
            analysis_result: Analysis result dict from analyze_image()
            output_path: Optional path to save visualization
            
        Returns:
            numpy.ndarray: Annotated image
        """
        image = cv2.imread(str(image_path))
        
        for item in analysis_result['food_items']:
            bbox = item['bounding_box']
            x1, y1, x2, y2 = bbox['x1'], bbox['y1'], bbox['x2'], bbox['y2']
            
            # Draw bounding box
            color = (0, 255, 0)  # Green
            cv2.rectangle(image, (x1, y1), (x2, y2), color, 2)
            
            # Prepare label
            label = f"{item['name']}: {item['volume']['volume_ml']}ml"
            
            # Add component count if present
            if item['components']:
                label += f" (+{len(item['components'])})"
            
            # Draw label background
            (text_w, text_h), _ = cv2.getTextSize(label, cv2.FONT_HERSHEY_SIMPLEX, 0.6, 2)
            cv2.rectangle(image, (x1, y1 - text_h - 10), (x1 + text_w, y1), color, -1)
            
            # Draw label text
            cv2.putText(image, label, (x1, y1 - 5),
                       cv2.FONT_HERSHEY_SIMPLEX, 0.6, (0, 0, 0), 2)
            
            # Draw components if present
            if item['components']:
                comp_y = y1 + 25
                for comp in item['components']:
                    comp_label = f"  └─ {comp['name']}"
                    cv2.putText(image, comp_label, (x1 + 5, comp_y),
                               cv2.FONT_HERSHEY_SIMPLEX, 0.4, (255, 255, 0), 1)
                    comp_y += 20
        
        # Add summary text
        summary_text = f"Total: {analysis_result['summary']['total_volume_ml']}ml | Items: {analysis_result['summary']['total_items_detected']}"
        cv2.putText(image, summary_text, (10, 30),
                   cv2.FONT_HERSHEY_SIMPLEX, 0.8, (255, 255, 255), 2)
        
        if output_path:
            cv2.imwrite(str(output_path), image)
            print(f"🖼️  Visualization saved to: {output_path}")
        
        return image


def main():
    """
    Example usage
    """
    print("\n" + "="*70)
    print("🍽️  FOOD VOLUMETRIC ANALYSIS SYSTEM")
    print("="*70 + "\n")
    
    # ==============================
    # CONFIGURATION
    # ==============================
    # UPDATE THESE PATHS
    YOLO_MODEL_PATH = "runs/detect/model_v5_optimized/weights/best.pt"  # Your trained model
    TEST_IMAGE_PATH = "test_image.jpg"  # Single image to test
    TEST_FOLDER_PATH = "test_images/"  # Folder of images (optional)
    OUTPUT_FOLDER = "analysis_results/"  # Where to save JSONs
    
    # ==============================
    # Initialize Analyzer
    # ==============================
    analyzer = FoodVolumeAnalyzer(
        yolo_model_path=YOLO_MODEL_PATH,
        plate_diameter_cm=25  
    )
    
    # ==============================
    # OPTION 1: Analyze Single Image
    # ==============================
    print("\n📸 SINGLE IMAGE ANALYSIS")
    print("-" * 70)
    
    result = analyzer.analyze_image(
        image_path=TEST_IMAGE_PATH,
        output_json_path=f"{OUTPUT_FOLDER}/single_analysis.json"
    )
    
    # Print formatted JSON
    print("\n📄 JSON OUTPUT:")
    print(json.dumps(result, indent=2))
    
    # Create visualization
    vis_image = analyzer.visualize_results(
        TEST_IMAGE_PATH,
        result,
        output_path=f"{OUTPUT_FOLDER}/visualization.jpg"
    )
    
    """
    print("\n📁 BATCH ANALYSIS")
    print("-" * 70)
    
    batch_results = analyzer.analyze_batch(
        image_folder=TEST_FOLDER_PATH,
        output_folder=OUTPUT_FOLDER
    )
    """
    
    print("\n✅ All done!")


if __name__ == "__main__":
    main()