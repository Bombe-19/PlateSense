from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from sqlalchemy import desc, and_
from app.database import get_db
from app.models import User, AnalysisResult, FoodItem
from app.schemas import UserProfile, UserProfileUpdate
from datetime import datetime, timedelta

router = APIRouter(prefix="/api/v1/user", tags=["User"])

def get_current_user(user_id: int = Query(...), db: Session = Depends(get_db)):
    """Get current user by user_id from query parameter"""
    
    user = db.query(User).filter(User.id == user_id).first()
    
    if not user or not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="User not found or inactive"
        )
    
    return user
@router.get("/profile", response_model=UserProfile)
async def get_profile(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get user profile"""
    return UserProfile.from_orm(current_user)

@router.put("/profile", response_model=UserProfile)
async def update_profile(
    profile_data: UserProfileUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Update user profile"""
    
    update_data = profile_data.dict(exclude_unset=True)
    
    for field, value in update_data.items():
        setattr(current_user, field, value)
    
    current_user.updated_at = datetime.utcnow()
    db.commit()
    db.refresh(current_user)
    
    return UserProfile.from_orm(current_user)

@router.get("/dashboard")
async def get_dashboard(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get user dashboard with statistics"""
    
    # All-time statistics
    all_analyses = db.query(AnalysisResult).filter(
        AnalysisResult.user_id == current_user.id
    ).all()
    
    total_analyses_all_time = len(all_analyses)
    total_volume_all_time = sum(a.total_volume_ml for a in all_analyses) if all_analyses else 0
    total_weight_all_time = sum(a.total_weight_grams for a in all_analyses) if all_analyses else 0
    avg_confidence_all_time = (
        sum(a.avg_confidence for a in all_analyses if a.avg_confidence) / 
        len([a for a in all_analyses if a.avg_confidence])
    ) if all_analyses else 0
    
    # Recent analyses (last 10)
    recent_analyses = db.query(AnalysisResult).filter(
        AnalysisResult.user_id == current_user.id
    ).order_by(desc(AnalysisResult.analysis_date)).limit(10).all()
    
    # Weekly data (last 7 days)
    today = datetime.utcnow().date()
    weekly_data = []
    
    for i in range(6, -1, -1):
        day = today - timedelta(days=i)
        day_start = datetime.combine(day, datetime.min.time())
        day_end = datetime.combine(day, datetime.max.time())
        
        day_analyses = db.query(AnalysisResult).filter(
            and_(
                AnalysisResult.user_id == current_user.id,
                AnalysisResult.analysis_date >= day_start,
                AnalysisResult.analysis_date <= day_end
            )
        ).all()
        
        weekly_data.append({
            "date": day.isoformat(),
            "day": day.strftime("%a"),
            "total_volume_ml": sum(a.total_volume_ml for a in day_analyses),
            "total_weight_grams": sum(a.total_weight_grams for a in day_analyses),
            "analyses_count": len(day_analyses)
        })
    
    # Top foods (most detected)
    food_counts = db.query(
        FoodItem.food_name,
        FoodItem.confidence
    ).filter(
        FoodItem.user_id == current_user.id
    ).all()
    
    food_frequency = {}
    for food_name, confidence in food_counts:
        if food_name not in food_frequency:
            food_frequency[food_name] = {"count": 0, "avg_confidence": 0, "confidences": []}
        food_frequency[food_name]["count"] += 1
        food_frequency[food_name]["confidences"].append(confidence)
    
    top_foods = sorted(
        [
            {
                "name": name,
                "count": data["count"],
                "avg_confidence": sum(data["confidences"]) / len(data["confidences"])
            }
            for name, data in food_frequency.items()
        ],
        key=lambda x: x["count"],
        reverse=True
    )[:10]
    
    return {
        "total_analyses_all_time": total_analyses_all_time,
        "total_volume_all_time_ml": round(total_volume_all_time, 2),
        "total_weight_all_time_grams": round(total_weight_all_time, 2),
        "avg_confidence_all_time": round(avg_confidence_all_time, 2),
        "recent_analyses": [
            {
                "id": a.id,
                "date": a.analysis_date.isoformat(),
                "total_volume_ml": a.total_volume_ml,
                "total_weight_grams": a.total_weight_grams,
                "total_items": a.total_items_detected,
                "avg_confidence": a.avg_confidence,
                "image_filename": a.image_filename
            }
            for a in recent_analyses
        ],
        "weekly_data": weekly_data,
        "top_foods": top_foods
    }

@router.get("/stats/weekly")
async def get_weekly_stats(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get weekly statistics"""
    
    today = datetime.utcnow().date()
    week_start = today - timedelta(days=today.weekday())
    
    week_analyses = db.query(AnalysisResult).filter(
        and_(
            AnalysisResult.user_id == current_user.id,
            AnalysisResult.analysis_date >= datetime.combine(week_start, datetime.min.time())
        )
    ).all()
    
    daily_stats = {}
    for i in range(7):
        day = week_start + timedelta(days=i)
        daily_stats[day.strftime("%a")] = {
            "volume": 0,
            "weight": 0,
            "count": 0
        }
    
    for analysis in week_analyses:
        day_key = analysis.analysis_date.strftime("%a")
        if day_key in daily_stats:
            daily_stats[day_key]["volume"] += analysis.total_volume_ml
            daily_stats[day_key]["weight"] += analysis.total_weight_grams
            daily_stats[day_key]["count"] += 1
    
    return {
        "period": f"{week_start.isoformat()} to {today.isoformat()}",
        "weekly_total_volume_ml": sum(a.total_volume_ml for a in week_analyses),
        "weekly_total_weight_grams": sum(a.total_weight_grams for a in week_analyses),
        "total_analyses": len(week_analyses),
        "daily_breakdown": [
            {"day": day, "data": stats}
            for day, stats in daily_stats.items()
        ]
    }

@router.get("/stats/monthly")
async def get_monthly_stats(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get monthly statistics"""
    
    today = datetime.utcnow().date()
    month_start = today.replace(day=1)
    
    if today.month == 12:
        month_end = today.replace(year=today.year + 1, month=1, day=1)
    else:
        month_end = today.replace(month=today.month + 1, day=1)
    
    month_analyses = db.query(AnalysisResult).filter(
        and_(
            AnalysisResult.user_id == current_user.id,
            AnalysisResult.analysis_date >= datetime.combine(month_start, datetime.min.time()),
            AnalysisResult.analysis_date < datetime.combine(month_end, datetime.min.time())
        )
    ).all()
    
    return {
        "period": today.strftime("%B %Y"),
        "monthly_total_volume_ml": sum(a.total_volume_ml for a in month_analyses),
        "monthly_total_weight_grams": sum(a.total_weight_grams for a in month_analyses),
        "monthly_avg_confidence": (
            sum(a.avg_confidence for a in month_analyses if a.avg_confidence) /
            len([a for a in month_analyses if a.avg_confidence])
        ) if month_analyses else 0,
        "total_analyses": len(month_analyses),
        "average_volume_per_analysis": (
            sum(a.total_volume_ml for a in month_analyses) / len(month_analyses)
        ) if month_analyses else 0,
        "average_weight_per_analysis": (
            sum(a.total_weight_grams for a in month_analyses) / len(month_analyses)
        ) if month_analyses else 0
    }
