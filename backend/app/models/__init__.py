from sqlalchemy import Column, Integer, String, Float, DateTime, Boolean, Enum, ForeignKey, Text, JSON, Date
from sqlalchemy.orm import relationship
from datetime import datetime
from app.database import Base
import enum

class User(Base):
    __tablename__ = "users"
    
    id = Column(Integer, primary_key=True, index=True)
    username = Column(String(50), unique=True, nullable=False, index=True)
    email = Column(String(100), unique=True, nullable=False, index=True)
    password_hash = Column(String(255), nullable=False)
    full_name = Column(String(100))
    profile_picture = Column(String(255))
    height_cm = Column(Float)
    weight_kg = Column(Float)
    age = Column(Integer)
    dietary_preferences = Column(String(255))
    oauth_provider = Column(String(50))  # google, facebook, etc.
    oauth_id = Column(String(255))  # OAuth provider's user ID
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    last_login = Column(DateTime)
    is_active = Column(Boolean, default=True)
    
    # Relationships
    analysis_results = relationship("AnalysisResult", back_populates="user", cascade="all, delete-orphan")
    food_items = relationship("FoodItem", back_populates="user", cascade="all, delete-orphan")
    analysis_summaries = relationship("AnalysisSummary", back_populates="user", cascade="all, delete-orphan")
    audit_logs = relationship("AuditLog", back_populates="user")


class AnalysisResult(Base):
    __tablename__ = "analysis_results"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    image_filename = Column(String(255))
    image_path = Column(String(500))
    analysis_date = Column(DateTime, default=datetime.utcnow)
    total_volume_ml = Column(Float, nullable=False)
    total_weight_grams = Column(Float, nullable=False)
    total_items_detected = Column(Integer, nullable=False)
    avg_confidence = Column(Float)
    analysis_json = Column(Text)  # Store complete analysis result as JSON
    model_used = Column(String(100))
    calibration_method = Column(String(50))
    plate_diameter_cm = Column(Float)
    status = Column(String(20), default="pending")  # success, failed, pending
    notes = Column(Text)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    user = relationship("User", back_populates="analysis_results")
    food_items = relationship("FoodItem", back_populates="analysis", cascade="all, delete-orphan")


class FoodItem(Base):
    __tablename__ = "food_items"
    
    id = Column(Integer, primary_key=True, index=True)
    analysis_id = Column(Integer, ForeignKey("analysis_results.id", ondelete="CASCADE"), nullable=False, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    food_name = Column(String(100), nullable=False, index=True)
    confidence = Column(Float)
    volume_ml = Column(Float, nullable=False)
    weight_grams = Column(Float, nullable=False)
    area_cm2 = Column(Float)
    height_cm = Column(Float)
    dimensions_width_cm = Column(Float)
    dimensions_height_cm = Column(Float)
    density_g_per_ml = Column(Float)
    bbox_x1 = Column(Integer)
    bbox_y1 = Column(Integer)
    bbox_x2 = Column(Integer)
    bbox_y2 = Column(Integer)
    components = Column(JSON)  # Sub-components detected
    nutritional_info = Column(JSON)  # Cached nutrition data
    created_at = Column(DateTime, default=datetime.utcnow)
    
    # Relationships
    analysis = relationship("AnalysisResult", back_populates="food_items")
    user = relationship("User", back_populates="food_items")


class AnalysisSummary(Base):
    __tablename__ = "analysis_summaries"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    summary_date = Column(Date, nullable=False)
    total_analyses = Column(Integer, default=0)
    total_volume_ml = Column(Float, default=0)
    total_weight_grams = Column(Float, default=0)
    avg_confidence = Column(Float, default=0)
    summary_type = Column(String(20), default="daily")  # daily, weekly, monthly
    created_at = Column(DateTime, default=datetime.utcnow)
    
    # Relationships
    user = relationship("User", back_populates="analysis_summaries")


class AuditLog(Base):
    __tablename__ = "audit_logs"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="SET NULL"))
    action = Column(String(50), nullable=False)
    resource_type = Column(String(50))
    resource_id = Column(Integer)
    details = Column(JSON)
    ip_address = Column(String(45))
    user_agent = Column(String(500))
    created_at = Column(DateTime, default=datetime.utcnow, index=True)
    
    # Relationships
    user = relationship("User", back_populates="audit_logs")
