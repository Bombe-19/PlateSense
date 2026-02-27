from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, status, Query
from sqlalchemy.orm import Session
from sqlalchemy import desc
from app.database import get_db
from app.models import User, AnalysisResult, FoodItem
from app.schemas import AnalysisResultResponse, AnalysisDetailResponse, AnalysisResultCreate
from pathlib import Path
from datetime import datetime
import json
import os
import sys

# Add parent directory to path for volumetric_food_analysis
sys.path.insert(0, str(Path(__file__).parent.parent.parent.parent))

router = APIRouter(prefix="/api/v1/analysis", tags=["Analysis"])

# Try to import the analyzer
try:
    from volumetric_food_analysis import FoodVolumeAnalyzer
    ANALYZER = None
    ANALYZER_INITIALIZED = False
except ImportError:
    ANALYZER = None
    ANALYZER_INITIALIZED = False

def get_analyzer():
    """Initialize or get analyzer instance"""
    global ANALYZER, ANALYZER_INITIALIZED
    
    if not ANALYZER_INITIALIZED:
        try:
            # Try to find the model in multiple locations
            possible_paths = [
                r"D:\Ganesh\Bombe\Learnings\Food\food_detection_model\model_v3\best.pt",  # Direct path
                os.getenv("YOLO_MODEL_PATH", "best.pt"),  # Environment variable or default
                "../best.pt",  # Parent directory (Food folder)
                "../../best.pt",  # Two levels up
                str(Path(__file__).parent.parent.parent.parent / "best.pt"),  # Absolute path
                str(Path(__file__).parent.parent.parent.parent / "food_detection_model" / "food_detector_best.pt"),
                str(Path(__file__).parent.parent.parent.parent / "food_detection_model" / "merged_food_model" / "multiclass_model_best.pt"),
            ]
            
            model_path = None
            for path in possible_paths:
                if Path(path).exists():
                    model_path = path
                    print(f"Found YOLO model at: {path}")
                    break
            
            if not model_path:
                raise FileNotFoundError(
                    f"YOLO model not found. Looked in:\n" + 
                    "\n".join(possible_paths)
                )
            
            plate_diameter = float(os.getenv("PLATE_DIAMETER_CM", "25"))
            
            ANALYZER = FoodVolumeAnalyzer(
                yolo_model_path=model_path,
                plate_diameter_cm=plate_diameter
            )
            ANALYZER_INITIALIZED = True
            print(f"YOLO analyzer initialized successfully with model: {model_path}")
        except Exception as e:
            print(f"Failed to initialize analyzer: {str(e)}")
            return None
    
    return ANALYZER

def get_current_user(user_id: int = Query(...), db: Session = Depends(get_db)):
    """Get current user by user_id from query parameter"""
    
    user = db.query(User).filter(User.id == user_id).first()
    
    if not user or not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="User not found or inactive"
        )
    
    return user
@router.post("/upload")
async def upload_and_analyze(
    file: UploadFile = File(...),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Upload image and perform volumetric analysis"""
    
    try:
        # Create temporary uploads directory for analysis processing only
        upload_dir = Path("backend/uploads")
        upload_dir.mkdir(parents=True, exist_ok=True)
        
        # Read file contents
        file_contents = await file.read()
        
        # Save to temp location for analysis processing
        temp_file_path = upload_dir / f"{datetime.utcnow().timestamp()}_{file.filename}"
        with open(temp_file_path, "wb") as buffer:
            buffer.write(file_contents)
        
        # Get analyzer
        analyzer = get_analyzer()
        if not analyzer:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="YOLO model not initialized"
            )
        
        # Run analysis
        analysis_result = analyzer.analyze_image(str(temp_file_path))
        
        # Create analysis record with image stored as BLOB
        db_analysis = AnalysisResult(
            user_id=current_user.id,
            image_filename=file.filename,
            image_path=str(temp_file_path),  # Keep for now, can be removed later
            image_data=file_contents,  # Store image as binary in database
            analysis_date=datetime.utcnow(),
            total_volume_ml=analysis_result["summary"]["total_volume_ml"],
            total_weight_grams=analysis_result["summary"]["total_weight_grams"],
            total_items_detected=analysis_result["summary"]["total_items_detected"],
            avg_confidence=sum(item["confidence"] for item in analysis_result["food_items"]) / max(len(analysis_result["food_items"]), 1),
            analysis_json=json.dumps(analysis_result),
            model_used=analysis_result["analysis_metadata"].get("model_used"),
            calibration_method=analysis_result["analysis_metadata"].get("calibration_method"),
            plate_diameter_cm=analysis_result["analysis_metadata"].get("reference_plate_diameter_cm"),
            status="success",
            created_at=datetime.utcnow()
        )
        
        db.add(db_analysis)
        db.flush()  # Get the ID without committing
        
        # Create food items records
        for food_item in analysis_result["food_items"]:
            db_food = FoodItem(
                analysis_id=db_analysis.id,
                user_id=current_user.id,
                food_name=food_item["name"],
                confidence=food_item["confidence"],
                volume_ml=food_item["volume"]["volume_ml"],
                weight_grams=food_item["volume"]["weight_grams"],
                area_cm2=food_item["volume"].get("area_cm2"),
                height_cm=food_item["volume"].get("estimated_height_cm"),
                dimensions_width_cm=food_item["volume"]["dimensions_cm"].get("width"),
                dimensions_height_cm=food_item["volume"]["dimensions_cm"].get("height"),
                density_g_per_ml=food_item["volume"].get("density_g_per_ml"),
                bbox_x1=food_item["bounding_box"]["x1"],
                bbox_y1=food_item["bounding_box"]["y1"],
                bbox_x2=food_item["bounding_box"]["x2"],
                bbox_y2=food_item["bounding_box"]["y2"],
                components=food_item.get("components"),
                created_at=datetime.utcnow()
            )
            db.add(db_food)
        
        db.commit()
        db.refresh(db_analysis)
        
        # Clean up temporary file
        try:
            temp_file_path.unlink()
        except:
            pass
        
        return {
            "id": db_analysis.id,
            "user_id": current_user.id,
            "image_filename": db_analysis.image_filename,
            "analysis_date": db_analysis.analysis_date,
            "total_volume_ml": db_analysis.total_volume_ml,
            "total_weight_grams": db_analysis.total_weight_grams,
            "total_items_detected": db_analysis.total_items_detected,
            "avg_confidence": db_analysis.avg_confidence,
            "status": db_analysis.status,
            "foods": [
                {
                    "id": f.id,
                    "name": f.food_name,
                    "volume": f.volume_ml,
                    "weight": f.weight_grams,
                    "confidence": f.confidence,
                    "area": f.area_cm2,
                    "height": f.height_cm,
                    "components": f.components or [],
                    "bbox": {
                        "x": f.bbox_x1,
                        "y": f.bbox_y1,
                        "width": f.bbox_x2 - f.bbox_x1,
                        "height": f.bbox_y2 - f.bbox_y1,
                    } if f.bbox_x1 is not None and f.bbox_y1 is not None and f.bbox_x2 is not None and f.bbox_y2 is not None else None
                }
                for f in db_analysis.food_items
            ]
        }
        
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Analysis failed: {str(e)}"
        )

@router.get("/{analysis_id}", response_model=AnalysisDetailResponse)
async def get_analysis(
    analysis_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get analysis details by ID"""
    
    analysis = db.query(AnalysisResult).filter(
        (AnalysisResult.id == analysis_id) &
        (AnalysisResult.user_id == current_user.id)
    ).first()
    
    if not analysis:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Analysis not found"
        )
    
    return AnalysisDetailResponse.from_orm(analysis)

@router.get("/image/{analysis_id}")
async def get_analysis_image(
    analysis_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get analysis image as base64"""
    
    analysis = db.query(AnalysisResult).filter(
        (AnalysisResult.id == analysis_id) &
        (AnalysisResult.user_id == current_user.id)
    ).first()
    
    if not analysis:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Analysis not found"
        )
    
    if not analysis.image_data:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Image data not found"
        )
    
    import base64
    image_base64 = base64.b64encode(analysis.image_data).decode("utf-8")
    
    return {
        "id": analysis.id,
        "image_filename": analysis.image_filename,
        "image_data": f"data:image/jpeg;base64,{image_base64}"
    }

@router.get("/history/all")
async def get_analysis_history(
    limit: int = 30,
    offset: int = 0,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get user's analysis history with food items"""
    
    analyses = db.query(AnalysisResult).filter(
        AnalysisResult.user_id == current_user.id
    ).order_by(desc(AnalysisResult.analysis_date)).offset(offset).limit(limit).all()
    
    total = db.query(AnalysisResult).filter(
        AnalysisResult.user_id == current_user.id
    ).count()
    
    import base64
    analyses_data = []
    
    for a in analyses:
        image_base64 = None
        if a.image_data:
            image_base64 = f"data:image/jpeg;base64,{base64.b64encode(a.image_data).decode('utf-8')}"
        
        analyses_data.append({
            "id": a.id,
            "date": a.analysis_date,
            "total_volume_ml": a.total_volume_ml,
            "total_weight_grams": a.total_weight_grams,
            "total_items": a.total_items_detected,
            "avg_confidence": a.avg_confidence,
            "image_filename": a.image_filename,
            "image_data": image_base64,
            "foods": [
                {
                    "id": f.id,
                    "name": f.food_name,
                    "volume": f.volume_ml,
                    "weight": f.weight_grams,
                    "confidence": f.confidence,
                }
                for f in a.food_items
            ]
        })
    
    return {
        "total": total,
        "limit": limit,
        "offset": offset,
        "analyses": analyses_data
    }

@router.delete("/{analysis_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_analysis(
    analysis_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Delete analysis record"""
    
    analysis = db.query(AnalysisResult).filter(
        (AnalysisResult.id == analysis_id) &
        (AnalysisResult.user_id == current_user.id)
    ).first()
    
    if not analysis:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Analysis not found"
        )
    
    # Delete file if exists
    if analysis.image_path and Path(analysis.image_path).exists():
        Path(analysis.image_path).unlink()
    
    db.delete(analysis)
    db.commit()
    
    return None
