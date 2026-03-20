from pydantic import BaseModel, EmailStr, Field
from typing import Optional, List, Dict, Any
from datetime import datetime

# ==================== AUTH SCHEMAS ====================

class UserRegister(BaseModel):
    username: str = Field(..., min_length=3, max_length=50)
    email: EmailStr
    password: str = Field(..., min_length=6)
    full_name: Optional[str] = None

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class UserResponse(BaseModel):
    id: int
    username: str
    email: str
    full_name: Optional[str]
    profile_picture: Optional[str]
    created_at: datetime
    
    class Config:
        from_attributes = True

# ==================== USER PROFILE SCHEMAS ====================

class UserProfileUpdate(BaseModel):
    full_name: Optional[str] = None
    profile_picture: Optional[str] = None
    height_cm: Optional[float] = None
    weight_kg: Optional[float] = None
    age: Optional[int] = None
    dietary_preferences: Optional[str] = None

class UserProfile(BaseModel):
    id: int
    username: str
    email: str
    full_name: Optional[str]
    profile_picture: Optional[str]
    height_cm: Optional[float]
    weight_kg: Optional[float]
    age: Optional[int]
    dietary_preferences: Optional[str]
    created_at: datetime
    last_login: Optional[datetime]
    
    class Config:
        from_attributes = True

# ==================== FOOD ITEM SCHEMAS ====================

class FoodItemDetail(BaseModel):
    name: str
    confidence: float
    volume_ml: float
    weight_grams: float
    area_cm2: Optional[float] = None
    height_cm: Optional[float] = None
    dimensions_width_cm: Optional[float] = None
    dimensions_height_cm: Optional[float] = None
    density_g_per_ml: Optional[float] = None
    components: Optional[List[str]] = None
    nutritional_info: Optional[Dict[str, Any]] = None
    # Individual nutritional values for this food portion
    calories: Optional[float] = None
    protein_g: Optional[float] = None
    carbohydrates_g: Optional[float] = None
    fat_g: Optional[float] = None
    fiber_g: Optional[float] = None
    sugar_g: Optional[float] = None
    sodium_mg: Optional[float] = None
    calcium_mg: Optional[float] = None
    iron_mg: Optional[float] = None
    vitamin_c_mg: Optional[float] = None
    matched_food_name: Optional[str] = None

class FoodItemResponse(FoodItemDetail):
    id: int
    bbox_x1: Optional[int] = None
    bbox_y1: Optional[int] = None
    bbox_x2: Optional[int] = None
    bbox_y2: Optional[int] = None
    
    class Config:
        from_attributes = True

# ==================== ANALYSIS SCHEMAS ====================

class AnalysisResultCreate(BaseModel):
    image_filename: str
    image_path: str
    total_volume_ml: float
    total_weight_grams: float
    total_items_detected: int
    avg_confidence: Optional[float] = None
    analysis_json: str
    model_used: Optional[str] = None
    calibration_method: Optional[str] = None
    plate_diameter_cm: Optional[float] = None
    notes: Optional[str] = None

class AnalysisResultResponse(BaseModel):
    id: int
    user_id: int
    image_filename: Optional[str]
    analysis_date: datetime
    total_volume_ml: float
    total_weight_grams: float
    total_items_detected: int
    avg_confidence: Optional[float]
    status: str
    created_at: datetime
    total_calories: Optional[float] = 0
    total_protein_g: Optional[float] = 0
    total_carbohydrates_g: Optional[float] = 0
    total_fat_g: Optional[float] = 0
    total_fiber_g: Optional[float] = 0
    items_with_nutrition_data: Optional[int] = 0
    foods: List[FoodItemResponse] = []
    
    class Config:
        from_attributes = True

class AnalysisDetailResponse(AnalysisResultResponse):
    model_used: Optional[str]
    calibration_method: Optional[str]
    plate_diameter_cm: Optional[float]
    notes: Optional[str]
    analysis_json: Optional[Dict[str, Any]] = None

# ==================== DASHBOARD SCHEMAS ====================

class DailySummary(BaseModel):
    summary_date: datetime
    total_analyses: int
    total_volume_ml: float
    total_weight_grams: float
    avg_confidence: float

class WeeklySummary(BaseModel):
    week_start: datetime
    week_end: datetime
    total_analyses: int
    total_volume_ml: float
    total_weight_grams: float
    daily_data: List[Dict[str, Any]]

class DashboardResponse(BaseModel):
    total_analyses_all_time: int
    total_volume_all_time_ml: float
    total_weight_all_time_grams: float
    recent_analyses: List[AnalysisResultResponse]
    weekly_data: List[Dict[str, Any]]
    top_foods: List[Dict[str, Any]]
    average_confidence: float

# ==================== STATISTICS SCHEMAS ====================

class StatisticsResponse(BaseModel):
    period: str
    total_analyses: int
    total_volume_ml: float
    total_weight_grams: float
    average_volume_per_analysis: float
    average_weight_per_analysis: float
    average_confidence: float
    most_detected_foods: List[Dict[str, Any]]
    data_points: List[Dict[str, Any]]

# ==================== ERROR SCHEMAS ====================

class ErrorResponse(BaseModel):
    detail: str
    status_code: int
    timestamp: datetime = Field(default_factory=datetime.utcnow)

# ==================== HEALTH CHECK ====================

class HealthResponse(BaseModel):
    status: str
    message: str
    timestamp: datetime = Field(default_factory=datetime.utcnow)
