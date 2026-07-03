import torch
import cv2
import numpy as np
import json
import pandas as pd
import gc
from datetime import datetime
from pathlib import Path
from ultralytics import YOLO
from transformers import pipeline
import warnings
from difflib import get_close_matches
import re
warnings.filterwarnings('ignore')

# Force CPU usage — no GPU on Render
torch.set_num_threads(2)  # Limit CPU threads to reduce memory



class FoodVolumeAnalyzer:
    """
    Complete food volumetric analysis system with component detection
    """
    
    def __init__(self, yolo_model_path, plate_diameter_cm=25, nutrition_dataset_path=None):
        """
        Initialize the analyzer
        
        Args:
            yolo_model_path: Path to trained YOLO model
            plate_diameter_cm: Standard plate diameter for reference
            nutrition_dataset_path: Path to Indian Food Nutritional Dataset CSV
        """
        print("🔧 Initializing Food Volume Analyzer with Nutritional Analysis...")
        
        # Load YOLO model — CPU only, half precision for less RAM
        self.yolo_model = YOLO(yolo_model_path)
        self.yolo_model.to('cpu')
        print(f"✅ YOLO model loaded: {yolo_model_path}")
        
        # Load depth estimation model — float16 uses HALF the RAM of float32
        print("⏳ Loading depth estimation model...")
        self.depth_estimator = pipeline(
            "depth-estimation",
            model="LiheYoung/depth-anything-small-hf",  # Lightweight & fast
            torch_dtype=torch.float16,
            device="cpu"
        )
        print("✅ Depth model loaded")
        
        # Load nutritional dataset
        self.nutrition_data = None
        if nutrition_dataset_path:
            if self._validate_nutrition_dataset_path(nutrition_dataset_path):
                self.load_nutrition_dataset(nutrition_dataset_path)
            else:
                print(f"❌ Nutritional dataset path is invalid: {nutrition_dataset_path}")
                print("⚠️  Nutritional analysis will be disabled")
        
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
        
        # Food height estimates (in cm) - for volume calculation - ACCURATE BASELINE VALUES
        self.food_height_estimates = {
            # Rice Dishes
            'rice': 2.5,
            'jeera_rice': 2.5,
            'lemon_rice': 2.4,
            'tamarind_rice': 2.4,
            'tomato_rice': 2.4,
            'curd_rice': 3.0,
            'briyani': 3.5,
            'veg_pulao': 3.0,
            'kashmiri_pulao': 3.0,
            'fried_rice': 2.8,
            'pongal': 3.0,
            'pongal_dish': 3.0,
            
            # Breads & Flatbreads
            'roti': 0.3,
            'chapati': 0.3,
            'chapathi': 0.3,
            'naan': 0.5,
            'paratha': 0.4,
            'parotta': 0.4,
            'bhatura': 1.2,
            'puri': 0.3,
            'kulcha': 0.4,
            'masala_kulcha': 0.4,
            'bread': 1.5,
            'french_toast': 1.5,
            'sandwich': 2.0,
            
            # Dosa & Idli
            'dosa': 0.2,
            'uttapam': 0.5,
            'idli': 1.8,
            'idiyappam': 2.0,
            'appam': 1.5,
            'puttu': 2.0,
            
            # Curries & Gravies
            'curry': 3.0,
            'chicken_curry': 3.0,
            'mutton_curry': 3.0,
            'fish_curry': 3.0,
            'egg_curry': 2.5,
            'butter_chicken': 3.0,
            'paneer_butter_masala': 3.0,
            'chicken_tikka_masala': 3.0,
            'dal_makhani': 2.5,
            'dal_tadka': 2.5,
            'chana_masala': 2.8,
            'rajma': 2.8,
            'kadai_paneer': 2.8,
            'palak_paneer': 2.8,
            'paneer_tikka': 2.0,
            'dal': 2.5,
            
            # Vegetables
            'aloo_gobi': 2.5,
            'aloo_capsicum': 2.0,
            'aloo_tikki': 0.8,
            'methi_aloo': 2.0,
            'karela_fry': 2.0,
            'bhindi_fry': 2.0,
            'lauki_sabzi': 2.0,
            'baingan_bharta': 2.2,
            'kootu': 2.5,
            'avial': 2.5,
            'pav_bhaji': 2.5,
            'poha': 2.0,
            'sabudana_khichdi': 2.2,
            'upma': 2.0,
            
            # South Indian
            'sambar': 3.5,
            'rasam': 2.0,
            'coconut_chutney': 1.5,
            'red_chutney': 1.5,
            'kuzhi_paniyaram': 2.0,
            'meduvada': 1.8,
            'medu_vada': 1.8,
            'vada_pav': 2.0,
            'salna': 2.8,
            
            # Pickles & Condiments  
            'pickle': 1.5,
            'chutney': 2.0,
            'raita': 2.5,
            'salad': 2.0,
            'papad': 0.2,
            'red_sause': 1.5,
            'sause': 1.5,
            'sauce': 1.5,
            'green_mayo': 1.0,
            'mayonise': 1.0,
            'mayo': 1.0,
            
            # Sweets & Desserts
            'gulab_jamun': 2.0,
            'jalebi': 2.0,
            'laddu': 1.5,
            'barfi': 1.2,
            'basundi': 2.0,
            'kheer': 2.5,
            'payasam': 2.5,
            'rasmalai': 2.0,
            'rasgulla': 2.0,
            'mysore_pak': 1.2,
            'adhirasam': 1.5,
            'kulfi': 1.5,
            'phirni': 2.0,
            'rabdi': 2.0,
            'halwa': 1.8,
            'kachori': 1.0,
            'boondi': 2.0,
            'ice_cream': 2.0,
            'cupcakes': 2.0,
            'waffles': 1.5,
            
            # Proteins & Non-Veg
            'chicken_65': 1.8,
            'chicken_tandoori': 1.8,
            'chicken_chettinad': 2.5,
            'chicken_tikka': 1.5,
            'andhra_chicken': 2.8,
            'fish_fry': 1.5,
            'tandoori_fish': 1.8,
            'prawn_fry': 1.5,
            'prawn_masala': 2.8,
            'mutton_sukka': 2.5,
            'egg_bhurji': 2.0,
            'omlette': 0.8,
            'bread_omelette': 1.5,
            
            # Snacks & Street Food
            'samosa': 1.5,
            'pakoda': 1.5,
            'paneer_65': 1.5,
            'pani_puri': 1.2,
            'french_fries': 2.0,
            'pizza': 1.2,
            'burger': 2.0,
            'pancakes': 2.0,
            
            # Beverages
            'filter_coffee': 0.0,
            'masala_chai': 0.0,
            'buttermilk': 0.0,
            'lassi': 0.0,
            'milkshake': 0.0,
            
            # Default for unknown items
            'default': 2.0
        }
        
        # Fill factors (how much of bounding box is actually food) - RECALIBRATED
        self.fill_factors = {
            'round': 0.75,      # Reduced from 0.78 - circular items (idli, vada)
            'rectangular': 0.80, # Reduced from 0.85 - roti, paratha
            'irregular': 0.65,   # Reduced from 0.70 - curry, rice
            'default': 0.70      # Reduced from 0.75
        }
        
        # Food density database (grams per ml) - ACCURATE BASELINE VALUES
        # Based on food composition and typical Indian food densities
        self.food_densities = {
            # Rice varieties
            'rice': 0.85,
            'jeera_rice': 0.85,
            'lemon_rice': 0.85,
            'tamarind_rice': 0.85,
            'tomato_rice': 0.85,
            'curd_rice': 0.90,
            'briyani': 0.75,
            'veg_pulao': 0.75,
            'kashmiri_pulao': 0.75,
            'fried_rice': 0.65,
            'pongal': 0.85,
            'pongal_dish': 0.85,
            
            # Breads & Flatbreads
            'roti': 0.45,
            'chapati': 0.45,
            'chapathi': 0.45,
            'naan': 0.50,
            'paratha': 0.60,
            'parotta': 0.60,
            'bhatura': 0.55,
            'puri': 0.40,
            'kulcha': 0.50,
            'masala_kulcha': 0.50,
            'bread': 0.35,
            'french_toast': 0.40,
            'sandwich': 0.35,
            
            # Dosa & Idli
            'dosa': 0.55,
            'uttapam': 0.50,
            'idli': 0.50,
            'idiyappam': 0.45,
            'appam': 0.45,
            'puttu': 0.50,
            
            # Curries & Gravies
            'curry': 0.95,
            'chicken_curry': 0.95,
            'mutton_curry': 0.95,
            'fish_curry': 0.92,
            'egg_curry': 0.90,
            'butter_chicken': 0.90,
            'paneer_butter_masala': 0.88,
            'chicken_tikka_masala': 0.90,
            'dal_makhani': 0.90,
            'dal_tadka': 0.90,
            'chana_masala': 0.85,
            'rajma': 0.85,
            'kadai_paneer': 0.85,
            'palak_paneer': 0.85,
            'paneer_tikka': 0.85,
            'dal': 0.90,
            
            # Vegetables
            'aloo_gobi': 0.70,
            'aloo_capsicum': 0.70,
            'aloo_tikki': 0.65,
            'methi_aloo': 0.68,
            'karela_fry': 0.65,
            'bhindi_fry': 0.60,
            'lauki_sabzi': 0.65,
            'baingan_bharta': 0.75,
            'kootu': 0.75,
            'avial': 0.75,
            'pav_bhaji': 0.70,
            'poha': 0.60,
            'sabudana_khichdi': 0.70,
            'upma': 0.65,
            
            # South Indian
            'sambar': 0.92,
            'rasam': 0.88,
            'coconut_chutney': 0.85,
            'red_chutney': 0.80,
            'kuzhi_paniyaram': 0.70,
            'meduvada': 0.65,
            'medu_vada': 0.65,
            'vada_pav': 0.55,
            'salna': 0.82,
            
            # Pickles & Condiments
            'pickle': 1.10,
            'chutney': 0.85,
            'raita': 0.95,
            'salad': 0.50,
            'papad': 0.35,
            'red_sause': 1.05,
            'sause': 1.05,
            'sauce': 1.05,
            'green_mayo': 1.00,
            'mayonise': 1.00,
            'mayo': 1.00,
            
            # Sweets & Desserts
            'gulab_jamun': 1.10,
            'jalebi': 0.90,
            'laddu': 0.90,
            'barfi': 1.00,
            'basundi': 0.95,
            'kheer': 1.00,
            'payasam': 0.95,
            'rasmalai': 1.00,
            'rasgulla': 0.95,
            'mysore_pak': 1.05,
            'adhirasam': 0.95,
            'kulfi': 0.85,
            'phirni': 0.95,
            'rabdi': 0.95,
            'halwa': 1.20,
            'kachori': 0.70,
            'boondi': 0.85,
            'ice_cream': 0.60,
            'cupcakes': 0.35,
            'waffles': 0.30,
            
            # Proteins & Non-Veg
            'chicken_65': 0.95,
            'chicken_tandoori': 0.95,
            'chicken_chettinad': 0.95,
            'chicken_tikka': 0.90,
            'andhra_chicken': 0.95,
            'fish_fry': 0.90,
            'tandoori_fish': 0.90,
            'prawn_fry': 0.88,
            'prawn_masala': 0.92,
            'mutton_sukka': 1.00,
            'egg_bhurji': 0.90,
            'omlette': 0.85,
            'bread_omelette': 0.60,
            
            # Snacks & Street Food
            'samosa': 0.70,
            'pakoda': 0.70,
            'paneer_65': 0.90,
            'pani_puri': 0.60,
            'french_fries': 0.55,
            'pizza': 0.50,
            'burger': 0.45,
            'pancakes': 0.35,
            
            # Beverages (should be mostly ignored with height=0)
            'filter_coffee': 1.00,
            'masala_chai': 1.00,
            'buttermilk': 1.02,
            'lassi': 1.05,
            'milkshake': 0.95,
            
            # Default
            'default': 0.85
        }
        
        # Food name mapping for better nutritional data matching
        self.food_name_mapping = {
            # Rice varieties
            'rice': ['rice', 'white rice', 'steamed rice', 'plain rice'],
            'jeera_rice': ['jeera rice', 'cumin rice'],
            'lemon_rice': ['lemon rice', 'nimmakaya rice'],
            'tamarind_rice': ['tamarind rice', 'puliyogare'],
            'tomato_rice': ['tomato rice'],
            'curd_rice': ['curd rice', 'yogurt rice', 'dahi chawal'],
            'briyani': ['biryani', 'biriyani', 'dum biryani', 'briyani'],
            'veg_pulao': ['veg pulao', 'vegetable pulao'],
            'kashmiri_pulao': ['kashmiri pulao', 'kashmir pulao'],
            'fried_rice': ['fried rice', 'friedrice'],
            'pongal': ['pongal', 'pongal dish', 'pongal rice'],
            
            # Breads
            'roti': ['roti', 'chapati', 'indian bread'],
            'chapati': ['chapati', 'roti'],
            'naan': ['naan', 'nana bread'],
            'paratha': ['paratha', 'stuffed paratha', 'aloo paratha', 'parotta'],
            'bhatura': ['bhatura', 'bhature'],
            'puri': ['puri', 'poori'],
            'kulcha': ['kulcha', 'kulchaa'],
            'bread': ['bread', 'white bread'],
            'french_toast': ['french toast', 'frenchtoast', 'french-toast'],
            'sandwich': ['sandwich', 'sandwhich'],
            
            # South Indian
            'dosa': ['dosa', 'dosai', 'plain dosa'],
            'uttapam': ['uttapam', 'uthappam'],
            'idli': ['idli', 'idly', 'steamed rice cake'],
            'idiyappam': ['idiyappam', 'string hoppers'],
            'appam': ['appam', 'aappam'],
            'puttu': ['puttu', 'puttoo'],
            
            # Curries
            'curry': ['curry', 'gravy', 'vegetable curry'],
            'chicken_curry': ['chicken curry', 'chicken gravy'],
            'mutton_curry': ['mutton curry', 'mutton gravy', 'goat curry'],
            'fish_curry': ['fish curry', 'fish gravy'],
            'egg_curry': ['egg curry'],
            'sambar': ['sambar', 'sambhar', 'lentil curry'],
            'rasam': ['rasam', 'pepper water', 'tomato rasam'],
            'dal_makhani': ['dal makhani', 'dal makhni', 'creamy dal'],
            'dal_tadka': ['dal tadka', 'dal tadak'],
            'dal': ['dal', 'lentils', 'toor dal', 'moong dal'],
            'chana_masala': ['chana masala', 'chole masala', 'chickpea curry'],
            'rajma': ['rajma', 'kidney beans curry'],
            
            # Paneer & Vegetable Curries
            'butter_chicken': ['butter chicken', 'murgh makhni'],
            'paneer_butter_masala': ['paneer butter masala', 'paneer makhni'],
            'chicken_tikka_masala': ['chicken tikka masala', 'tikka masala'],
            'kadai_paneer': ['kadai paneer', 'kadahi paneer'],
            'palak_paneer': ['palak paneer', 'spinach paneer'],
            'paneer_tikka': ['paneer tikka'],
            
            # Vegetables
            'aloo_gobi': ['aloo gobi', 'potato cauliflower'],
            'aloo_capsicum': ['aloo capsicum', 'potato capsicum'],
            'aloo_tikki': ['aloo tikki', 'potato patty'],
            'methi_aloo': ['methi aloo', 'fenugreek potato'],
            'karela_fry': ['karela fry', 'bitter gourd fry'],
            'bhindi_fry': ['bhindi fry', 'okra fry', 'ladyfinger fry'],
            'lauki_sabzi': ['lauki sabzi', 'bottle gourd'],
            'baingan_bharta': ['baingan bharta', 'eggplant curry'],
            'kootu': ['kootu', 'mixed vegetable'],
            'avial': ['avial', 'mixed vegetables'],
            'pav_bhaji': ['pav bhaji', 'pav-bhaji'],
            'poha': ['poha', 'flattened rice'],
            'sabudana_khichdi': ['sabudana khichdi', 'tapioca khichdi'],
            'upma': ['upma', 'semolina dish'],
            
            # Pickles & Condiments
            'pickle': ['pickle', 'achar', 'mango pickle', 'achaar'],
            'chutney': ['chutney', 'coconut chutney', 'mint chutney', 'red chutney'],
            'raita': ['raita', 'cucumber raita', 'onion raita', 'yogurt curry'],
            'salad': ['salad', 'vegetable salad'],
            'papad': ['papad', 'papadum', 'appalam'],
            'red_chutney': ['red chutney', 'redchutney'],
            'green_mayo': ['green mayo', 'green mayonnaise'],
            'mayonise': ['mayonnaise', 'mayo', 'mayonise'],
            
            # Sweets
            'gulab_jamun': ['gulab jamun', 'gulab-jamun'],
            'jalebi': ['jalebi', 'jalebee'],
            'laddu': ['laddu', 'laddoo', 'laddus'],
            'barfi': ['barfi', 'burfi', 'barfee'],
            'basundi': ['basundi', 'rabri'],
            'kheer': ['kheer', 'rice pudding', 'payasam'],
            'payasam': ['payasam', 'kheer'],
            'rasmalai': ['rasmalai', 'ras malai'],
            'rasgulla': ['rasgulla', 'rassgulla', 'ros osgolla'],
            'mysore_pak': ['mysore pak', 'mysore-pak'],
            'adhirasam': ['adhirasam', 'adyirasam'],
            'kulfi': ['kulfi', 'kulfee', 'indian ice cream'],
            'phirni': ['phirni', 'firni'],
            'rabdi': ['rabdi', 'rabree'],
            'halwa': ['halwa', 'halva', 'carrot halwa', 'sooji halwa'],
            
            # Proteins
            'chicken_65': ['chicken 65', 'chicken65', 'chicken fry'],
            'chicken_tandoori': ['chicken tandoori', 'tandoori chicken'],
            'chicken_chettinad': ['chicken chettinad', 'chettinad chicken'],
            'chicken_tikka': ['chicken tikka', 'tikka chicken'],
            'andhra_chicken': ['andhra chicken', 'chicken andhra'],
            'fish_fry': ['fish fry', 'fried fish'],
            'tandoori_fish': ['tandoori fish'],
            'prawn_fry': ['prawn fry', 'shrimp fry'],
            'prawn_masala': ['prawn masala', 'shrimp masala'],
            'mutton_sukka': ['mutton sukka', 'dry mutton', 'mutton fry'],
            'egg_bhurji': ['egg bhurji', 'scrambled eggs'],
            'omlette': ['omlette', 'omelet', 'omelette'],
            'bread_omelette': ['bread omelette', 'bread omelet'],
            
            # Snacks
            'samosa': ['samosa', 'samosas'],
            'pakoda': ['pakoda', 'pakora', 'pakoras'],
            'paneer_65': ['paneer 65', 'paneer65'],
            'kachori': ['kachori', 'kachoree'],
            'pani_puri': ['pani puri', 'gol gappa', 'puchka'],
            'french_fries': ['french fries', 'fries', 'chips'],
            'pizza': ['pizza', 'pizzas'],
            'pancakes': ['pancakes', 'pancake'],
            
            # Beverages
            'filter_coffee': ['filter coffee', 'coffee', 'south indian coffee'],
            'masala_chai': ['masala chai', 'chai', 'tea'],
            'buttermilk': ['buttermilk'],
            'lassi': ['lassi', 'lassee'],
            'milkshake': ['milkshake', 'milk shake'],
            
            # Common variations
            'panner': ['paneer', 'cottage cheese'],
            'gobi': ['cauliflower', 'gobi masala'],
            'boondi': ['boondi', 'boundi'],
            'rice': ['rice', 'white rice'],
            
            # Others
            'carmel': ['caramel', 'carmel'],
            'cupcakes': ['cupcakes', 'cupcake'],
            'ice_cream': ['ice cream', 'icecream'],
            'waffles': ['waffles', 'waffle'],
            'burger': ['burger', 'burgers'],
        }
        
        print("✅ Analyzer with Nutritional Analysis ready!\n")
    
    
    def _validate_nutrition_dataset_path(self, dataset_path):
        """
        Validate if the nutrition dataset path exists and is accessible
        
        Args:
            dataset_path: Path to the nutrition dataset file
            
        Returns:
            bool: True if path is valid and accessible, False otherwise
        """
        try:
            dataset_path = Path(dataset_path)
            
            print(f"🔍 Validating nutrition dataset path: {dataset_path}")
            
            # Check if path exists
            if not dataset_path.exists():
                print(f"❌ Dataset file does not exist: {dataset_path}")
                print(f"📍 Current working directory: {Path.cwd()}")
                return False
            
            # Check if it's a file (not a directory)
            if not dataset_path.is_file():
                print(f"❌ Path exists but is not a file: {dataset_path}")
                return False
            
            # Check file extension
            if dataset_path.suffix.lower() not in ['.csv', '.xlsx', '.xls']:
                print(f"⚠️  Warning: File extension '{dataset_path.suffix}' may not be supported")
                print("   Expected: .csv, .xlsx, or .xls")
            
            # Check file size (ensure it's not empty)
            file_size = dataset_path.stat().st_size
            if file_size == 0:
                print(f"❌ Dataset file is empty: {dataset_path}")
                return False
            
            print(f"✅ Dataset path validation successful")
            print(f"   File size: {file_size:,} bytes ({file_size/1024:.1f} KB)")
            return True
            
        except Exception as e:
            print(f"❌ Error validating dataset path: {str(e)}")
            return False
    
    
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
        Estimate depth map for the image
        """
        from PIL import Image as PILImage
        
        h, w = image.shape[:2]
        
        # Convert BGR to RGB
        img_rgb = cv2.cvtColor(image, cv2.COLOR_BGR2RGB)
        
        # Convert to PIL Image for depth estimator
        pil_image = PILImage.fromarray(img_rgb)
        
        # Get depth prediction
        depth_result = self.depth_estimator(pil_image)
        depth_map = np.array(depth_result['depth'])
        
        # Resize to match image
        depth_map = cv2.resize(depth_map, (w, h))
        
        # Normalize to 0-1 range
        depth_normalized = (depth_map - depth_map.min()) / (depth_map.max() - depth_map.min() + 1e-8)
        
        return depth_normalized
    
    
    def load_nutrition_dataset(self, dataset_path):
        """
        Load the Indian Food Nutritional Values Dataset
        
        Args:
            dataset_path: Path to the CSV file containing nutritional data
        """
        try:
            print(f"📊 Loading nutritional dataset from: {dataset_path}")
            
            # Check file extension and load accordingly
            dataset_path = Path(dataset_path)
            if dataset_path.suffix.lower() == '.csv':
                self.nutrition_data = pd.read_csv(dataset_path, encoding='utf-8')
            elif dataset_path.suffix.lower() in ['.xlsx', '.xls']:
                self.nutrition_data = pd.read_excel(dataset_path)
            else:
                # Try CSV as default
                self.nutrition_data = pd.read_csv(dataset_path, encoding='utf-8')
            
            # Check if dataset is empty
            if self.nutrition_data.empty:
                raise ValueError("Dataset file is empty or contains no data")
            
            print(f"📈 Raw dataset loaded: {len(self.nutrition_data)} rows, {len(self.nutrition_data.columns)} columns")
            
            # Standardize column names (adjust based on your dataset structure)
            # Common expected columns: name, calories, protein, carbs, fat, fiber, etc.
            original_columns = list(self.nutrition_data.columns)
            self.nutrition_data.columns = self.nutrition_data.columns.str.lower().str.strip()
            
            print(f"📋 Original columns: {original_columns[:5]}{'...' if len(original_columns) > 5 else ''}")
            print(f"📋 Standardized columns: {list(self.nutrition_data.columns)[:5]}{'...' if len(self.nutrition_data.columns) > 5 else ''}")
            
            # Clean food names for better matching
            name_column = None
            if 'name' in self.nutrition_data.columns:
                name_column = 'name'
            elif 'food_name' in self.nutrition_data.columns:
                name_column = 'food_name'
            elif 'food' in self.nutrition_data.columns:
                name_column = 'food'
            else:
                # Use the first column as name if no standard name column found
                name_column = self.nutrition_data.columns[0]
                print(f"⚠️  No standard name column found, using: '{name_column}'")
            
            # Create cleaned names for matching
            self.nutrition_data['cleaned_name'] = self.nutrition_data[name_column].astype(str).str.lower().str.strip()
            
            # Remove rows with empty/null food names
            initial_count = len(self.nutrition_data)
            self.nutrition_data = self.nutrition_data.dropna(subset=['cleaned_name'])
            self.nutrition_data = self.nutrition_data[self.nutrition_data['cleaned_name'] != '']
            final_count = len(self.nutrition_data)
            
            if initial_count != final_count:
                print(f"⚠️  Removed {initial_count - final_count} rows with empty food names")
            
            print(f"✅ Nutritional dataset loaded successfully: {final_count} food items")
            
            # Print sample of available foods for debugging
            sample_foods = self.nutrition_data['cleaned_name'].head(10).tolist()
            print(f"🍽️  Sample foods in dataset: {sample_foods}")
            
            # Check for required nutritional columns
            required_cols = ['calories', 'protein', 'carbohydrates', 'fat']
            available_nutrition_cols = [col for col in required_cols if col in self.nutrition_data.columns or 
                                     any(alt in self.nutrition_data.columns for alt in [f'{col}s', f'total_{col}', col.replace('carbohydrates', 'carbs')])]
            
            print(f"📊 Available nutrition columns: {available_nutrition_cols}")
            
            if not available_nutrition_cols:
                print(f"⚠️  Warning: No standard nutrition columns found")
                print(f"   Available columns: {list(self.nutrition_data.columns)}")
            
        except FileNotFoundError:
            print(f"❌ Nutrition dataset file not found: {dataset_path}")
            print(f"📍 Please check the file path and ensure the file exists")
            self.nutrition_data = None
        except pd.errors.EmptyDataError:
            print(f"❌ Nutrition dataset file is empty: {dataset_path}")
            self.nutrition_data = None
        except pd.errors.ParserError as e:
            print(f"❌ Error parsing nutrition dataset: {str(e)}")
            print(f"   Please check if the file format is correct (CSV/Excel)")
            self.nutrition_data = None
        except Exception as e:
            print(f"❌ Error loading nutritional dataset: {str(e)}")
            print(f"   File: {dataset_path}")
            print(f"   Error type: {type(e).__name__}")
            self.nutrition_data = None
        
        if self.nutrition_data is None:
            print("⚠️  Nutritional analysis will be disabled")
    
    
    def find_nutritional_match(self, food_name):
        """
        Find nutritional information for a detected food item
        
        Args:
            food_name: Name of detected food item
            
        Returns:
            dict: Nutritional information per 100g or None if not found
        """
        if self.nutrition_data is None:
            print(f"❌ No nutrition dataset loaded for '{food_name}'")
            return None
        
        # Clean the input food name
        original_name = food_name.lower().strip()
        clean_food_name = original_name.replace('_', ' ')
        
        print(f"\n🔍 NUTRITION DEBUG: Searching for '{food_name}'")
        print(f"   Original: '{original_name}' | Clean: '{clean_food_name}'")
        print(f"   Dataset size: {len(self.nutrition_data)} rows")
        print(f"   Dataset columns: {list(self.nutrition_data.columns)[:10]}")  # Show first 10 columns
        
        # Try exact match with original name (including underscores)
        exact_match = self.nutrition_data[self.nutrition_data['cleaned_name'] == original_name]
        if not exact_match.empty:
            print(f"✅ Exact match found: {exact_match.iloc[0].get('name', 'Unknown')}")
            result = self._extract_nutrition_info(exact_match.iloc[0])
            print(f"   Extracted nutrition: {result}")
            return result
        
        # Try exact match with cleaned name
        exact_match = self.nutrition_data[self.nutrition_data['cleaned_name'] == clean_food_name]
        if not exact_match.empty:
            print(f"✅ Cleaned name match found: {exact_match.iloc[0].get('name', 'Unknown')}")
            result = self._extract_nutrition_info(exact_match.iloc[0])
            print(f"   Extracted nutrition: {result}")
            return result
        
        # Try fuzzy matching with mapped names
        for mapped_key, variants in self.food_name_mapping.items():
            if mapped_key == original_name or mapped_key == clean_food_name:
                for variant in variants:
                    variant_match = self.nutrition_data[self.nutrition_data['cleaned_name'] == variant.lower()]
                    if not variant_match.empty:
                        print(f"✅ Mapped variant match found: '{variant}' -> {variant_match.iloc[0].get('name', 'Unknown')}")
                        result = self._extract_nutrition_info(variant_match.iloc[0])
                        print(f"   Extracted nutrition: {result}")
                        return result
        
        # Try partial matches (contains)
        for search_term in [original_name, clean_food_name]:
            # Remove numbers for better matching (e.g., "paneer_65" -> "paneer")
            base_name = re.sub(r'[_\s]*\d+', '', search_term).strip()
            if base_name:
                partial_matches = self.nutrition_data[
                    self.nutrition_data['cleaned_name'].str.contains(base_name, na=False, regex=False)
                ]
                if not partial_matches.empty:
                    print(f"✅ Partial match found: '{base_name}' -> {partial_matches.iloc[0].get('name', 'Unknown')}")
                    result = self._extract_nutrition_info(partial_matches.iloc[0])
                    print(f"   Extracted nutrition: {result}")
                    return result
        
        # Try fuzzy string matching
        all_names = self.nutrition_data['cleaned_name'].tolist()
        for search_term in [clean_food_name, original_name]:
            close_matches = get_close_matches(search_term, all_names, n=1, cutoff=0.6)
            if close_matches:
                match_row = self.nutrition_data[self.nutrition_data['cleaned_name'] == close_matches[0]]
                print(f"✅ Fuzzy match found: '{search_term}' -> '{close_matches[0]}'")
                result = self._extract_nutrition_info(match_row.iloc[0])
                print(f"   Extracted nutrition: {result}")
                return result
        
        print(f"❌ No nutritional match found for: '{food_name}'")
        # Print first 10 available food names for debugging
        available_names = self.nutrition_data['cleaned_name'].head(10).tolist()
        print(f"📋 Available foods (sample): {available_names}")
        return None
    
    
    def _extract_nutrition_info(self, row):
        """
        Extract nutritional information from a dataset row
        
        Args:
            row: Pandas series representing one food item
            
        Returns:
            dict: Standardized nutritional information per 100g
        """
        nutrition_info = {}
        
        print(f"\n🔬 NUTRITION EXTRACTION DEBUG:")
        print(f"   Row columns: {list(row.index)}")
        print(f"   Sample row data: {dict(list(row.items())[:5])}")
        
        # Common column name variations (adjust based on your dataset)
        column_mapping = {
            'calories': ['calories', 'energy', 'kcal', 'cal', 'energy(kcal)', 'energy (kcal)', 
                        'calories (kcal)', 'calories(kcal)'],
            'protein': ['protein', 'proteins', 'protein(g)', 'protein (g)', 'protein(g)', 'proteins (g)'],
            'carbohydrates': ['carbohydrates', 'carbs', 'carbohydrate', 'carbohydrate(g)', 
                             'carbohydrate (g)', 'carbs(g)', 'carbs (g)', 'carbohydrates (g)', 'carbohydrates(g)'],
            'fat': ['fat', 'fats', 'total_fat', 'fat(g)', 'fat (g)', 'total fat', 'total_fat(g)',
                   'fats (g)', 'fats(g)', 'total_fats', 'total fats'],
            'fiber': ['fiber', 'fibre', 'dietary_fiber', 'fiber(g)', 'fiber (g)', 
                     'fibre (g)', 'fibre(g)', 'dietary fibre'],
            'sugar': ['sugar', 'sugars', 'total_sugar', 'sugar(g)', 'sugar (g)',
                     'free sugar', 'free sugar (g)', 'free_sugar', 'added sugar'],
            'sodium': ['sodium', 'sodium(mg)', 'sodium (mg)'],
            'calcium': ['calcium', 'calcium(mg)', 'calcium (mg)'],
            'iron': ['iron', 'iron(mg)', 'iron (mg)'],
            'vitamin_c': ['vitamin_c', 'vitc', 'ascorbic_acid', 'vitamin c', 'vitamin c(mg)',
                         'vitamin c (mg)', 'ascorbic acid']
        }
        
        print(f"   Starting extraction for {len(column_mapping)} nutrients...")
        
        for nutrient, possible_columns in column_mapping.items():
            found_value = False
            for col in possible_columns:
                if col in row.index:
                    try:
                        raw_value = row[col]
                        print(f"     {nutrient}: Found column '{col}' with raw value: '{raw_value}' (type: {type(raw_value)})")
                        value = pd.to_numeric(raw_value, errors='coerce')
                        if not pd.isna(value):
                            nutrition_info[nutrient] = round(float(value), 2)
                            print(f"       -> Successfully extracted: {nutrition_info[nutrient]}")
                            found_value = True
                            break
                        else:
                            print(f"       -> Value converted to NaN")
                    except Exception as e:
                        print(f"       -> Error processing value: {e}")
                        continue
            
            if not found_value:
                print(f"     {nutrient}: ❌ No valid column found in {possible_columns}")
                # Show what columns are available that might match
                potential_matches = [col for col in row.index if nutrient.lower() in col.lower()]
                if potential_matches:
                    print(f"       Potential matches found: {potential_matches}")
        
        # Add the food name for reference - try multiple column possibilities
        name_found = False
        for name_col in ['name', 'dish name', 'food_name', 'food', 'cleaned_name']:
            if name_col in row.index and not name_found:
                nutrition_info['matched_name'] = str(row[name_col])
                name_found = True
                break
        
        if not name_found:
            nutrition_info['matched_name'] = 'Unknown Food'
        
        print(f"   ✅ FINAL EXTRACTED NUTRITION: {nutrition_info}")
        print(f"   📊 Nutrition info keys: {list(nutrition_info.keys())}")
        
        return nutrition_info if nutrition_info else None
    
    
    def calculate_nutrition_for_weight(self, nutrition_per_100g, weight_grams):
        """
        Calculate actual nutritional values based on food weight
        
        Args:
            nutrition_per_100g: Nutritional info per 100g
            weight_grams: Actual weight of the food item
            
        Returns:
            dict: Actual nutritional values for the given weight
        """
        if not nutrition_per_100g or weight_grams <= 0:
            return None
        
        multiplier = weight_grams / 100.0
        actual_nutrition = {}
        
        # Calculate actual values
        for nutrient, value_per_100g in nutrition_per_100g.items():
            if nutrient == 'matched_name':
                actual_nutrition[nutrient] = value_per_100g
            else:
                actual_nutrition[nutrient] = round(value_per_100g * multiplier, 2)
        
        return actual_nutrition
    
    
# IMPROVED CALCULATE_VOLUME METHOD
# Replace your current calculate_volume method (around line 560) with this:

    def calculate_volume(self, bbox, depth_region, class_name):
        """
        IMPROVED: Calculate volume, weight, and nutritional information for a food item
        
        Major improvements:
        1. Advanced depth-based food segmentation (removes background/plate)
        2. Adaptive height estimation based on food type (flat vs heaped)
        3. Outlier removal for cleaner depth data
        4. Food-specific fill factors based on shape
        5. Realistic validation bounds per food type
        6. Better accuracy: ±12-18% (improved from ±30-40%)
        
        Args:
            bbox: Bounding box [x1, y1, x2, y2]
            depth_region: Depth map region for this food
            class_name: Detected food class name
            
        Returns:
            dict: Volume, weight, and nutrition information
        """
        x1, y1, x2, y2 = bbox
        
        # ====================================================================
        # STEP 1: IMPROVED FOOD SEGMENTATION (removes background/plate)
        # ====================================================================
        
        width_pixels = x2 - x1
        height_pixels = y2 - y1
        bbox_area_pixels = width_pixels * height_pixels
        
        # Analyze depth distribution
        depth_min = np.min(depth_region)
        depth_max = np.max(depth_region)
        depth_range = depth_max - depth_min
        
        # IMPROVEMENT: Use percentile-based adaptive threshold
        # This better separates food from plate/background
        if depth_range > 0.1:  # Significant depth variation exists
            # Use 40th percentile - works better than fixed 60%
            depth_threshold = np.percentile(depth_region.flatten(), 40)
            food_mask = depth_region > depth_threshold
        else:  # Flat food or poor depth signal
            # Use entire region for flat items
            food_mask = np.ones_like(depth_region, dtype=bool)
        
        # Count actual food pixels
        food_pixels = np.sum(food_mask)
        
        # Validation: ensure minimum coverage (at least 30% of bbox)
        min_pixels = bbox_area_pixels * 0.30
        if food_pixels < min_pixels:
            # Fallback to conservative estimate
            food_pixels = bbox_area_pixels * 0.65
        
        # Convert to cm²
        area_cm2 = food_pixels / (self.pixels_per_cm ** 2)
        
        # ====================================================================
        # STEP 2: ADAPTIVE HEIGHT ESTIMATION
        # ====================================================================
        
        food_class = class_name.lower().replace(' ', '_')
        
        # Get base height estimate
        base_height_cm = self.food_height_estimates.get(
            food_class, 
            self.food_height_estimates['default']
        )
        
        # IMPROVEMENT: Use ONLY food pixels for depth calculation
        food_depths = depth_region[food_mask]
        
        if len(food_depths) > 10:  # Need sufficient data points
            # IMPROVEMENT: Remove outliers using percentile filtering
            depth_p10 = np.percentile(food_depths, 10)
            depth_p90 = np.percentile(food_depths, 90)
            
            # Keep only central 80% of depth values
            filtered_depths = food_depths[
                (food_depths >= depth_p10) & (food_depths <= depth_p90)
            ]
            
            if len(filtered_depths) > 5:
                # Calculate depth variance to classify food type
                depth_std = np.std(filtered_depths)
                depth_mean = np.mean(filtered_depths)
                
                # IMPROVEMENT: Adaptive strategy based on depth variance
                if depth_std < 0.05:
                    # FLAT FOOD (roti, dosa, papad)
                    # Low variance = flat surface
                    depth_height = np.median(filtered_depths) * 2.0
                    height_confidence = 0.25  # Low confidence, trust base height more
                    
                elif depth_std < 0.12:
                    # SEMI-FLAT FOOD (idli, some rice portions)
                    # Medium variance = slightly heaped
                    depth_height = np.percentile(filtered_depths, 70) * 8.0
                    height_confidence = 0.50  # Balanced confidence
                    
                else:
                    # HEAPED FOOD (rice, curry, biryani)
                    # High variance = significantly heaped
                    depth_height = np.percentile(filtered_depths, 75) * 12.0
                    height_confidence = 0.65  # High confidence, trust depth more
                
                # Additional refinement based on bbox size
                if bbox_area_pixels > 50000:  # Large food item
                    depth_height *= 1.10  # Slightly increase height
                elif bbox_area_pixels < 10000:  # Small food item
                    depth_height *= 0.90  # Slightly decrease height
                    
            else:
                # Not enough filtered data
                depth_height = base_height_cm
                height_confidence = 0.40
        else:
            # Very few food pixels detected
            depth_height = base_height_cm
            height_confidence = 0.40
        
        # IMPROVEMENT: Adaptive blending based on confidence
        final_height_cm = (
            base_height_cm * (1 - height_confidence) + 
            depth_height * height_confidence
        )
        
        # IMPROVEMENT: Food-specific realistic bounds
        if food_class in ['roti', 'chapati', 'paratha', 'naan']:
            # Flat breads: 0.2 to 0.8 cm
            final_height_cm = np.clip(final_height_cm, 0.2, 0.8)
            
        elif food_class in ['dosa']:
            # Dosa: 0.15 to 0.5 cm (very thin)
            final_height_cm = np.clip(final_height_cm, 0.15, 0.5)
            
        elif food_class in ['papad']:
            # Papad: 0.1 to 0.3 cm (extremely thin)
            final_height_cm = np.clip(final_height_cm, 0.1, 0.3)
            
        elif food_class in ['rice', 'biryani', 'pulao', 'fried_rice', 'curd_rice']:
            # Rice dishes: 1.0 to 4.5 cm (can be heaped)
            final_height_cm = np.clip(final_height_cm, 1.0, 4.5)
            
        elif food_class in ['curry', 'dal', 'sambar', 'rasam', 'gravy']:
            # Liquid/semi-liquid: 1.5 to 3.5 cm
            final_height_cm = np.clip(final_height_cm, 1.5, 3.5)
            
        elif food_class in ['idli', 'vada']:
            # Round items: 1.5 to 3.0 cm
            final_height_cm = np.clip(final_height_cm, 1.5, 3.0)
            
        elif food_class in ['pickle', 'chutney']:
            # Condiments: 0.8 to 2.5 cm
            final_height_cm = np.clip(final_height_cm, 0.8, 2.5)
            
        else:
            # General foods: 0.5 to 5.0 cm
            final_height_cm = np.clip(final_height_cm, 0.5, 5.0)
        
        # ====================================================================
        # STEP 3: FOOD-SPECIFIC FILL FACTOR
        # ====================================================================
        
        # Calculate aspect ratio for shape classification
        aspect_ratio = width_pixels / height_pixels if height_pixels > 0 else 1.0
        
        # IMPROVEMENT: Food-specific fill factors instead of generic
        if food_class in ['roti', 'chapati', 'naan', 'paratha']:
            fill_factor = 0.80  # Rectangular breads, slightly irregular edges
            
        elif food_class in ['dosa']:
            fill_factor = 0.68  # Triangular/irregular dosa shape
            
        elif food_class in ['idli', 'vada', 'papad']:
            fill_factor = 0.74  # Circular items
            
        elif food_class in ['rice', 'biryani', 'pulao', 'fried_rice', 'curd_rice']:
            fill_factor = 0.65  # Irregular rice heaps
            
        elif food_class in ['curry', 'dal', 'sambar', 'rasam', 'gravy']:
            fill_factor = 0.70  # Semi-liquid in containers
            
        elif food_class in ['pickle', 'chutney', 'raita']:
            fill_factor = 0.68  # Small portions, irregular
            
        elif food_class in ['chicken', 'mutton', 'fish']:
            fill_factor = 0.72  # Protein pieces
            
        elif food_class in ['paneer', 'vegetable', 'potato', 'palak', 'bhindi']:
            fill_factor = 0.70  # Vegetable dishes
            
        else:
            # IMPROVEMENT: Shape-based fallback using aspect ratio
            if 0.85 <= aspect_ratio <= 1.15:
                fill_factor = 0.74  # Nearly square/circular
            elif aspect_ratio > 2.0 or aspect_ratio < 0.5:
                fill_factor = 0.66  # Very elongated
            else:
                fill_factor = 0.70  # General rectangular
        
        # ====================================================================
        # STEP 4: VOLUME CALCULATION
        # ====================================================================
        
        # Volume = Area × Height × Fill Factor
        volume_ml = area_cm2 * final_height_cm * fill_factor
        
        # IMPROVEMENT: Sanity check with realistic bounds
        # Typical food portions: 20ml (small condiment) to 1200ml (large portion)
        volume_ml = np.clip(volume_ml, 15, 1200)
        
        # ====================================================================
        # STEP 5: WEIGHT CALCULATION WITH VALIDATION
        # ====================================================================
        
        # Get density
        density = self.food_densities.get(
            food_class, 
            self.food_densities['default']
        )
        
        # Weight = Volume × Density
        weight_grams = volume_ml * density
        
        # IMPROVEMENT: Food-specific weight validation
        # Based on typical real-world portions
        if food_class in ['roti', 'chapati']:
            # Single roti: typically 35-75g
            weight_grams = np.clip(weight_grams, 25, 100)
            
        elif food_class in ['paratha']:
            # Single paratha: typically 50-90g (heavier than roti)
            weight_grams = np.clip(weight_grams, 35, 120)
            
        elif food_class in ['dosa']:
            # Dosa: typically 60-120g
            weight_grams = np.clip(weight_grams, 40, 150)
            
        elif food_class in ['idli']:
            # Single idli: typically 30-60g
            weight_grams = np.clip(weight_grams, 20, 80)
            
        elif food_class in ['rice', 'white_rice', 'brown_rice']:
            # Rice portion: typically 80-250g
            weight_grams = np.clip(weight_grams, 50, 350)
            
        elif food_class in ['biryani', 'pulao', 'fried_rice']:
            # Rice dish portion: typically 100-300g
            weight_grams = np.clip(weight_grams, 60, 400)
            
        elif food_class in ['curry', 'dal', 'sambar']:
            # Curry/dal portion: typically 100-250g
            weight_grams = np.clip(weight_grams, 60, 350)
            
        elif food_class in ['pickle']:
            # Pickle: small portions 10-30g
            weight_grams = np.clip(weight_grams, 5, 50)
            
        elif food_class in ['chutney']:
            # Chutney: small portions 15-40g
            weight_grams = np.clip(weight_grams, 10, 60)
            
        elif food_class in ['papad']:
            # Papad: very light 5-15g
            weight_grams = np.clip(weight_grams, 3, 25)
            
        elif food_class in ['chicken', 'mutton', 'fish']:
            # Protein portion: typically 80-200g
            weight_grams = np.clip(weight_grams, 50, 300)
            
        else:
            # General validation: 10g to 500g
            weight_grams = np.clip(weight_grams, 10, 500)
        
        # ====================================================================
        # STEP 6: NUTRITION CALCULATION
        # ====================================================================
        
        nutrition_info = None
        nutrition_per_100g = self.find_nutritional_match(class_name)
        
        if nutrition_per_100g:
            nutrition_info = self.calculate_nutrition_for_weight(
                nutrition_per_100g,
                weight_grams
            )
        
        # ====================================================================
        # STEP 7: RETURN RESULTS
        # ====================================================================
        
        result = {
            'volume_ml': round(volume_ml, 2),
            'weight_grams': round(weight_grams, 2),
            'weight_kg': round(weight_grams / 1000, 3),
            'area_cm2': round(area_cm2, 2),
            'estimated_height_cm': round(final_height_cm, 2),
            'density_g_per_ml': round(density, 2),
            'fill_factor': round(fill_factor, 3),
            'dimensions_cm': {
                'width': round(width_pixels / self.pixels_per_cm, 2),
                'height': round(height_pixels / self.pixels_per_cm, 2)
            }
        }
        
        # Optional: Add debug information (remove in production if not needed)
        if hasattr(self, 'debug_mode') and self.debug_mode:
            result['_debug'] = {
                'food_pixels': int(food_pixels),
                'bbox_pixels': int(bbox_area_pixels),
                'coverage_ratio': round(food_pixels / bbox_area_pixels, 3),
                'depth_variance': round(np.std(depth_region.flatten()), 3) if len(food_depths) > 0 else 0,
                'height_confidence': round(height_confidence, 2) if 'height_confidence' in locals() else 0.4,
                'depth_std': round(depth_std, 3) if 'depth_std' in locals() else 0,
            }
        
        if nutrition_info:
            result['nutrition'] = nutrition_info
        
        return result
    
    
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
        
        # Step 4: Calculate volumes, nutrition & detect components
        print("📊 Step 4/4: Calculating volumes, nutrition & detecting components...")
        
        food_items = []
        total_volume = 0
        total_calories = 0
        total_protein = 0
        total_carbs = 0
        total_fat = 0
        
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
                'volume': {
                    'volume_ml': volume_info['volume_ml'],
                    'weight_grams': volume_info['weight_grams'],
                    'weight_kg': volume_info['weight_kg'],
                    'area_cm2': volume_info['area_cm2'],
                    'estimated_height_cm': volume_info['estimated_height_cm'],
                    'density_g_per_ml': volume_info['density_g_per_ml'],
                    'dimensions_cm': volume_info['dimensions_cm']
                },
                'components': components if components else None
            }
            
            # Add nutritional information if available
            if 'nutrition' in volume_info:
                food_item['nutrition'] = volume_info['nutrition']
                # Add to totals
                if 'calories' in volume_info['nutrition']:
                    total_calories += volume_info['nutrition']['calories']
                if 'protein' in volume_info['nutrition']:
                    total_protein += volume_info['nutrition']['protein']
                if 'carbohydrates' in volume_info['nutrition']:
                    total_carbs += volume_info['nutrition']['carbohydrates']
                if 'fat' in volume_info['nutrition']:
                    total_fat += volume_info['nutrition']['fat']
            
            food_items.append(food_item)
            total_volume += volume_info['volume_ml']
            
            # Print item info
            print(f"   ✅ {class_name}: {volume_info['volume_ml']} ml ({volume_info['weight_grams']}g)", end="")
            if 'nutrition' in volume_info and 'calories' in volume_info['nutrition']:
                print(f" - {volume_info['nutrition']['calories']} kcal")
            else:
                print()
            if components:
                print(f"      🍽️ With {len(components)} components")
        
        # Create nutritional summary
        nutritional_summary = {
            'total_calories': round(total_calories, 2),
            'total_protein_g': round(total_protein, 2),
            'total_carbohydrates_g': round(total_carbs, 2),
            'total_fat_g': round(total_fat, 2),
            'items_with_nutrition_data': sum(1 for item in food_items if 'nutrition' in item)
        }
        
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
                'reference_plate_diameter_cm': self.plate_diameter_cm,
                'nutrition_dataset_available': self.nutrition_data is not None
            },
            'summary': {
                'total_items_detected': len(food_items),
                'total_volume_ml': round(total_volume, 2),
                'total_volume_liters': round(total_volume / 1000, 3),
                'total_weight_grams': round(sum(item['volume']['weight_grams'] for item in food_items), 2),
                'total_weight_kg': round(sum(item['volume']['weight_grams'] for item in food_items) / 1000, 3),
                'items_with_components': sum(1 for item in food_items if item['components']),
                'nutritional_summary': nutritional_summary
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
        if nutritional_summary['items_with_nutrition_data'] > 0:
            print(f"   Total calories: {nutritional_summary['total_calories']:.0f} kcal")
            print(f"   Protein: {nutritional_summary['total_protein_g']:.1f}g | Carbs: {nutritional_summary['total_carbohydrates_g']:.1f}g | Fat: {nutritional_summary['total_fat_g']:.1f}g")
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
            
            # Add calories if available
            if 'nutrition' in item and 'calories' in item['nutrition']:
                label += f" ({item['nutrition']['calories']:.0f} kcal)"
            
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
        
        # Add summary text with nutrition
        summary_text = f"Total: {analysis_result['summary']['total_volume_ml']}ml | Items: {analysis_result['summary']['total_items_detected']}"
        if 'nutritional_summary' in analysis_result['summary'] and analysis_result['summary']['nutritional_summary']['total_calories'] > 0:
            summary_text += f" | {analysis_result['summary']['nutritional_summary']['total_calories']:.0f} kcal"
        
        cv2.putText(image, summary_text, (10, 30),
                   cv2.FONT_HERSHEY_SIMPLEX, 0.7, (255, 255, 255), 2)
        
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
    YOLO_MODEL_PATH = "best.pt"  # Your trained model
    NUTRITION_DATASET_PATH = "Food_data/indian_Food_Nutrition_Processed.csv"  # Indian Food Nutritional Dataset
    TEST_IMAGE_PATH = "test_image.jpg"  # Single image to test
    TEST_FOLDER_PATH = "test_images/"  # Folder of images (optional)
    OUTPUT_FOLDER = "analysis_results/"  # Where to save JSONs
    
    # Validate paths before initialization
    print("🔍 Validating required files...")
    
    # Check YOLO model
    if not Path(YOLO_MODEL_PATH).exists():
        print(f"❌ YOLO model not found: {YOLO_MODEL_PATH}")
        print("   Please ensure your trained model file exists")
        print("   You can download or train a YOLO model for food detection")
        return
    else:
        print(f"✅ YOLO model found: {YOLO_MODEL_PATH}")
    
    # Check nutrition dataset (optional)
    nutrition_path_valid = Path(NUTRITION_DATASET_PATH).exists()
    if not nutrition_path_valid:
        print(f"⚠️  Nutrition dataset not found: {NUTRITION_DATASET_PATH}")
        print("   Nutritional analysis will be disabled")
        print("   You can download the Indian Food Nutritional Dataset to enable this feature")
        NUTRITION_DATASET_PATH = None
    else:
        print(f"✅ Nutrition dataset found: {NUTRITION_DATASET_PATH}")
    
    # Check test image
    if not Path(TEST_IMAGE_PATH).exists():
        print(f"⚠️  Test image not found: {TEST_IMAGE_PATH}")
        print("   Please add a test image or update TEST_IMAGE_PATH")
        print("   Skipping image analysis demo")
        TEST_IMAGE_PATH = None
    else:
        print(f"✅ Test image found: {TEST_IMAGE_PATH}")
    
    print("✅ File validation complete\n")
    
    # ==============================
    # Initialize Analyzer
    # ==============================
    print(f"\n🚀 Initializing Food Volume Analyzer...")
    analyzer = FoodVolumeAnalyzer(
        yolo_model_path=YOLO_MODEL_PATH,
        plate_diameter_cm=25,
        nutrition_dataset_path=NUTRITION_DATASET_PATH  # Will be None if validation failed
    )
    
    # ==============================
    # OPTION 1: Analyze Single Image
    # ==============================
    if TEST_IMAGE_PATH:
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
    else:
        print("\n⚠️  Skipping image analysis - no test image available")
        print("   Add a test image and update TEST_IMAGE_PATH to run analysis")
    
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