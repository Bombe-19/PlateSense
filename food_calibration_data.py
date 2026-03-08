# Comprehensive Food Height Estimates and Densities for all 116 food items
# Based on real-world measurements and food science data
# No recalibration - accurate baseline values

# FOOD HEIGHT ESTIMATES (in cm) - Based on typical plate portions
FOOD_HEIGHT_ESTIMATES = {
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
    'naan_dal': 2.5,
    
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
    'aloo_gobi': 2.0,
    'kachori': 1.0,
    'pani_puri': 1.2,
    'french_fries': 2.0,
    'pizza': 1.2,
    'burger': 2.0,
    'pancakes': 2.0,
    
    # Beverages
    'filter_coffee': 0.0,  # Liquid, ignore height
    'masala_chai': 0.0,   # Liquid, ignore height
    'buttermilk': 0.0,    # Liquid, ignore height
    'lassi': 0.0,         # Liquid, ignore height
    'milkshake': 0.0,     # Liquid, ignore height
    
    # Default
    'default': 2.0
}

# FOOD DENSITY DATABASE (grams per ml)
# Based on food composition and typical Indian food densities
FOOD_DENSITIES = {
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
    
    # Beverages (should be mostly ignored with height=0, but listed for completeness)
    'filter_coffee': 1.00,
    'masala_chai': 1.00,
    'buttermilk': 1.02,
    'lassi': 1.05,
    'milkshake': 0.95,
    
    # Default
    'default': 0.85
}

# Mapping of alternate names to standard names
FOOD_NAME_MAPPING = {
    'chicken': 'chicken_curry',
    'mutton': 'mutton_curry',
    'fish': 'fish_curry',
    'egg': 'egg_curry',
    'paneer': 'paneer_butter_masala',
    'vegetable': 'aloo_gobi',
    'potato': 'aloo_tikki',
    'vada': 'medu_vada',
    'sweet': 'gulab_jamun',
    'coffee': 'filter_coffee',
    'chai': 'masala_chai',
}

if __name__ == "__main__":
    print(f"Total food items with height estimates: {len(FOOD_HEIGHT_ESTIMATES)}")
    print(f"Total food items with densities: {len(FOOD_DENSITIES)}")
