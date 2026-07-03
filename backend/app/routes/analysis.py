from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, status, Query, Form
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
import gc
import torch
import numpy as np
from typing import Optional

def convert_numpy(obj):
    """Recursively convert numpy types to native Python types for PostgreSQL compatibility."""
    if isinstance(obj, np.integer):
        return int(obj)
    elif isinstance(obj, np.floating):
        return float(obj)
    elif isinstance(obj, np.ndarray):
        return obj.tolist()
    elif isinstance(obj, dict):
        return {k: convert_numpy(v) for k, v in obj.items()}
    elif isinstance(obj, list):
        return [convert_numpy(i) for i in obj]
    return obj


# Add parent directory to path for volumetric_food_analysis
sys.path.insert(0, str(Path(__file__).parent.parent.parent.parent))

router = APIRouter(prefix="/api/v1/analysis", tags=["Analysis"])

# Try to import the analyzer
try:
    from volumetric_food_analysis import FoodVolumeAnalyzer
    ANALYZER = None
    ANALYZER_INITIALIZED = False
    print("✓ Volumetric analysis module imported successfully")
except ImportError as e:
    print(f"⚠️ Warning: Could not import volumetric_food_analysis: {e}")
    print("⚠️ Analysis functionality will be limited")
    ANALYZER = None
    ANALYZER_INITIALIZED = False
except Exception as e:
    print(f"⚠️ Warning: Error importing volumetric_food_analysis: {e}")
    ANALYZER = None
    ANALYZER_INITIALIZED = False

def get_analyzer(nutrition_dataset_path: Optional[str] = None):
    """Initialize or get analyzer instance with optional nutrition dataset"""
    global ANALYZER, ANALYZER_INITIALIZED
    
    # Check if FoodVolumeAnalyzer is available
    if 'FoodVolumeAnalyzer' not in globals():
        raise HTTPException(
            status_code=503, 
            detail="Food analysis service unavailable. Please ensure all dependencies are installed."
        )
    
    # If requesting nutrition analysis but current analyzer doesn't have it, reinitialize
    if nutrition_dataset_path and (ANALYZER is None or not hasattr(ANALYZER, 'nutrition_data') or ANALYZER.nutrition_data is None):
        ANALYZER_INITIALIZED = False
    
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
            
            # Handle nutrition dataset path
            nutrition_path = None
            if nutrition_dataset_path:
                # Check if it's an absolute path
                if Path(nutrition_dataset_path).is_absolute():
                    nutrition_path = nutrition_dataset_path
                else:
                    # Look for nutrition dataset in multiple locations
                    possible_nutrition_paths = [
                        nutrition_dataset_path,  # As provided
                        str(Path(__file__).parent.parent.parent.parent / nutrition_dataset_path),  # Relative to Food folder
                        str(Path(__file__).parent.parent.parent.parent / "Food_data" / nutrition_dataset_path),
                        "indian_Food_Nutrition_Processed.csv",  # Default name
                        str(Path(__file__).parent.parent.parent.parent / "indian_Food_Nutrition_Processed.csv"),
                    ]
                    
                    for path in possible_nutrition_paths:
                        if Path(path).exists():
                            nutrition_path = path
                            print(f"Found nutrition dataset at: {path}")
                            break
            
            ANALYZER = FoodVolumeAnalyzer(
                yolo_model_path=model_path,
                plate_diameter_cm=plate_diameter,
                nutrition_dataset_path=nutrition_path
            )
            ANALYZER_INITIALIZED = True
            nutrition_status = "with nutrition analysis" if nutrition_path else "without nutrition analysis"
            print(f"YOLO analyzer initialized successfully {nutrition_status}")
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


@router.get("/validate-nutrition-dataset")
async def validate_nutrition_dataset(
    dataset_path: str = Query(..., description="Path to nutrition dataset file")
):
    """Validate nutrition dataset path and return dataset info (no auth required for validation)"""
    
    try:
        # Check if it's an absolute path
        if not Path(dataset_path).is_absolute():
            # Look for nutrition dataset in multiple locations
            possible_paths = [
                dataset_path,  # As provided
                str(Path(__file__).parent.parent.parent.parent / dataset_path),  # Relative to Food folder
                str(Path(__file__).parent.parent.parent.parent / "Food_data" / dataset_path),
                "indian_Food_Nutrition_Processed.csv",  # Default name
                str(Path(__file__).parent.parent.parent.parent / "indian_Food_Nutrition_Processed.csv"),
            ]
            
            dataset_path_resolved = None
            for path in possible_paths:
                if Path(path).exists():
                    dataset_path_resolved = path
                    break
            
            if not dataset_path_resolved:
                return {
                    "valid": False,
                    "error": f"Dataset file not found",
                    "searched_paths": possible_paths
                }
            
            dataset_path = dataset_path_resolved
        
        # Validate file exists and is readable
        dataset_file = Path(dataset_path)
        if not dataset_file.exists():
            return {
                "valid": False,
                "error": f"Dataset file does not exist: {dataset_path}"
            }
        
        if not dataset_file.is_file():
            return {
                "valid": False,
                "error": f"Path exists but is not a file: {dataset_path}"
            }
        
        # Check file extension
        if dataset_file.suffix.lower() not in ['.csv', '.xlsx', '.xls']:
            return {
                "valid": False,
                "error": f"Unsupported file format: {dataset_file.suffix}. Expected: .csv, .xlsx, .xls"
            }
        
        # Try to load and validate dataset structure
        try:
            import pandas as pd
            
            if dataset_file.suffix.lower() == '.csv':
                df = pd.read_csv(dataset_path, encoding='utf-8', nrows=5)  # Just load first 5 rows for validation
            else:
                df = pd.read_excel(dataset_path, nrows=5)
            
            if df.empty:
                return {
                    "valid": False,
                    "error": "Dataset file is empty"
                }
            
            # Check for expected columns
            columns = df.columns.tolist()
            expected_nutrition_cols = ['calories', 'protein', 'carbohydrate', 'fat']
            found_nutrition_cols = []
            
            for col in columns:
                col_lower = col.lower()
                for expected in expected_nutrition_cols:
                    if expected in col_lower:
                        found_nutrition_cols.append(col)
                        break
            
            file_size = dataset_file.stat().st_size
            
            return {
                "valid": True,
                "info": {
                    "file_path": str(dataset_path),
                    "file_size_bytes": file_size,
                    "file_size_kb": round(file_size / 1024, 1),
                    "total_columns": len(columns),
                    "columns": columns[:10],  # Show first 10 columns
                    "nutrition_columns_found": found_nutrition_cols,
                    "sample_food_names": df.iloc[:3, 0].tolist() if len(df) > 0 else [],
                    "has_nutrition_data": len(found_nutrition_cols) >= 2
                }
            }
            
        except Exception as e:
            return {
                "valid": False,
                "error": f"Error reading dataset file: {str(e)}"
            }
        
    except Exception as e:
        return {
            "valid": False,
            "error": f"Validation error: {str(e)}"
        }


@router.get("/validate-nutrition-dataset")
async def validate_nutrition_dataset(
    dataset_path: str = Query(..., description="Path to nutrition dataset file"),
    current_user: User = Depends(get_current_user)
):
    """Validate nutrition dataset path and return dataset info"""
    
    try:
        # Check if it's an absolute path
        if not Path(dataset_path).is_absolute():
            # Look for nutrition dataset in multiple locations
            possible_paths = [
                dataset_path,  # As provided
                str(Path(__file__).parent.parent.parent.parent / dataset_path),  # Relative to Food folder
                str(Path(__file__).parent.parent.parent.parent / "Food_data" / dataset_path),
                "indian_Food_Nutrition_Processed.csv",  # Default name
                str(Path(__file__).parent.parent.parent.parent / "indian_Food_Nutrition_Processed.csv"),
            ]
            
            dataset_path_resolved = None
            for path in possible_paths:
                if Path(path).exists():
                    dataset_path_resolved = path
                    break
            
            if not dataset_path_resolved:
                return {
                    "valid": False,
                    "error": f"Dataset file not found. Searched in: {possible_paths}",
                    "searched_paths": possible_paths
                }
            
            dataset_path = dataset_path_resolved
        
        # Validate file exists and is readable
        dataset_file = Path(dataset_path)
        if not dataset_file.exists():
            return {
                "valid": False,
                "error": f"Dataset file does not exist: {dataset_path}"
            }
        
        if not dataset_file.is_file():
            return {
                "valid": False,
                "error": f"Path exists but is not a file: {dataset_path}"
            }
        
        # Check file extension
        if dataset_file.suffix.lower() not in ['.csv', '.xlsx', '.xls']:
            return {
                "valid": False,
                "error": f"Unsupported file format: {dataset_file.suffix}. Expected: .csv, .xlsx, .xls"
            }
        
        # Try to load and validate dataset structure
        try:
            import pandas as pd
            
            if dataset_file.suffix.lower() == '.csv':
                df = pd.read_csv(dataset_path, encoding='utf-8', nrows=5)  # Just load first 5 rows for validation
            else:
                df = pd.read_excel(dataset_path, nrows=5)
            
            if df.empty:
                return {
                    "valid": False,
                    "error": "Dataset file is empty"
                }
            
            # Check for expected columns
            columns = df.columns.tolist()
            expected_nutrition_cols = ['calories', 'protein', 'carbohydrate', 'fat']
            found_nutrition_cols = []
            
            for col in columns:
                col_lower = col.lower()
                for expected in expected_nutrition_cols:
                    if expected in col_lower:
                        found_nutrition_cols.append(col)
                        break
            
            file_size = dataset_file.stat().st_size
            
            return {
                "valid": True,
                "info": {
                    "file_path": str(dataset_path),
                    "file_size_bytes": file_size,
                    "file_size_kb": round(file_size / 1024, 1),
                    "total_rows": len(df),
                    "total_columns": len(columns),
                    "columns": columns,
                    "nutrition_columns_found": found_nutrition_cols,
                    "sample_food_names": df.iloc[:3, 0].tolist() if len(df) > 0 else [],
                    "has_nutrition_data": len(found_nutrition_cols) >= 2
                }
            }
            
        except Exception as e:
            return {
                "valid": False,
                "error": f"Error reading dataset file: {str(e)}"
            }
        
    except Exception as e:
        return {
            "valid": False,
            "error": f"Validation error: {str(e)}"
        }

@router.post("/upload", response_model=AnalysisResultResponse)
async def upload_and_analyze(
    file: UploadFile = File(...),
    nutrition_dataset_path: Optional[str] = Form(None),
    plate_diameter_cm: Optional[float] = Form(25.0),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Upload image and perform volumetric analysis with optional nutritional analysis"""
    
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
        
        # Get analyzer with nutrition support
        analyzer = get_analyzer(nutrition_dataset_path)
        if not analyzer:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="YOLO model not initialized"
            )
        
        # Run analysis inside no_grad to avoid storing gradients (saves RAM)
        with torch.no_grad():
            analysis_result = analyzer.analyze_image(str(temp_file_path))
        
        # Free memory immediately after inference
        gc.collect()
        
        # Convert all numpy types to native Python types before DB insert
        analysis_result = convert_numpy(analysis_result)
        
        # Extract nutritional summary
        nutritional_summary = analysis_result["summary"].get("nutritional_summary", {})
        
        # Create analysis record with image stored as BLOB and nutritional data
        db_analysis = AnalysisResult(
            user_id=current_user.id,
            image_filename=file.filename,
            image_path=str(temp_file_path),  # Keep for now, can be removed later
            image_data=file_contents,  # Store image as binary in database
            analysis_date=datetime.now(),  # Use local time instead of UTC
            total_volume_ml=analysis_result["summary"]["total_volume_ml"],
            total_weight_grams=analysis_result["summary"]["total_weight_grams"],
            total_items_detected=analysis_result["summary"]["total_items_detected"],
            avg_confidence=sum(item["confidence"] for item in analysis_result["food_items"]) / max(len(analysis_result["food_items"]), 1),
            analysis_json=json.dumps(analysis_result),
            model_used=analysis_result["analysis_metadata"].get("model_used"),
            calibration_method=analysis_result["analysis_metadata"].get("calibration_method"),
            plate_diameter_cm=analysis_result["analysis_metadata"].get("reference_plate_diameter_cm"),
            # Nutritional summary data
            total_calories=nutritional_summary.get("total_calories", 0),
            total_protein_g=nutritional_summary.get("total_protein_g", 0),
            total_carbohydrates_g=nutritional_summary.get("total_carbohydrates_g", 0),
            total_fat_g=nutritional_summary.get("total_fat_g", 0),
            total_fiber_g=nutritional_summary.get("total_fiber_g", 0),
            items_with_nutrition_data=nutritional_summary.get("items_with_nutrition_data", 0),
            nutrition_dataset_used=nutrition_dataset_path if nutrition_dataset_path else None,
            status="success",
            created_at=datetime.now()  # Use local time
        )
        
        db.add(db_analysis)
        db.flush()  # Get the ID without committing
        
        # Create food items records with nutritional data
        for food_item in analysis_result["food_items"]:
            # Extract nutrition data if available
            nutrition = food_item.get("nutrition", {})
            
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
                nutritional_info=nutrition if nutrition else None,
                # Individual nutritional values for this food portion
                calories=nutrition.get("calories"),
                protein_g=nutrition.get("protein"),
                carbohydrates_g=nutrition.get("carbohydrates"),
                fat_g=nutrition.get("fat"),
                fiber_g=nutrition.get("fiber"),
                sugar_g=nutrition.get("sugar"),
                sodium_mg=nutrition.get("sodium"),
                calcium_mg=nutrition.get("calcium"),
                iron_mg=nutrition.get("iron"),
                vitamin_c_mg=nutrition.get("vitamin_c"),
                matched_food_name=nutrition.get("matched_name"),
                created_at=datetime.now()
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
            "created_at": db_analysis.analysis_date,  # Add created_at field
            "total_volume_ml": db_analysis.total_volume_ml,
            "total_weight_grams": db_analysis.total_weight_grams,
            "total_items_detected": db_analysis.total_items_detected,
            "avg_confidence": db_analysis.avg_confidence,
            "status": db_analysis.status,
            # Nutritional summary
            "nutritional_summary": {
                "total_calories": db_analysis.total_calories,
                "total_protein_g": db_analysis.total_protein_g,
                "total_carbohydrates_g": db_analysis.total_carbohydrates_g,
                "total_fat_g": db_analysis.total_fat_g,
                "total_fiber_g": db_analysis.total_fiber_g,
                "items_with_nutrition_data": db_analysis.items_with_nutrition_data,
            },
            "foods": [
                {
                    "id": f.id,
                    "name": f.food_name,
                    "volume_ml": f.volume_ml,            # Fixed field name
                    "weight_grams": f.weight_grams,      # Fixed field name
                    "confidence": f.confidence,
                    "area_cm2": f.area_cm2,              # Fixed field name
                    "height_cm": f.height_cm,            # Fixed field name
                    "components": f.components or [],
                    # Add bbox fields expected by schema
                    "bbox_x1": f.bbox_x1,
                    "bbox_y1": f.bbox_y1,
                    "bbox_x2": f.bbox_x2,
                    "bbox_y2": f.bbox_y2,
                    # Nutritional data
                    "nutritional_info": {
                        "calories": f.calories,
                        "protein_g": f.protein_g,
                        "carbohydrates_g": f.carbohydrates_g,
                        "fat_g": f.fat_g,
                        "fiber_g": f.fiber_g,
                        "sugar_g": f.sugar_g,
                        "sodium_mg": f.sodium_mg,
                        "calcium_mg": f.calcium_mg,
                        "iron_mg": f.iron_mg,
                        "vitamin_c_mg": f.vitamin_c_mg,
                        "matched_food_name": f.matched_food_name,
                    } if f.calories is not None else None,
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
            "total_calories": a.total_calories or 0,
            "total_protein_g": a.total_protein_g or 0,
            "total_carbohydrates_g": a.total_carbohydrates_g or 0,
            "total_fat_g": a.total_fat_g or 0,
            "total_fiber_g": a.total_fiber_g or 0,
            "items_with_nutrition_data": a.items_with_nutrition_data or 0,
            "image_filename": a.image_filename,
            "image_data": image_base64,
            "foods": [
                {
                    "id": f.id,
                    "name": f.food_name,
                    "volume_ml": f.volume_ml,
                    "weight_grams": f.weight_grams,
                    "confidence": f.confidence,
                    "calories": f.calories or 0,
                    "protein_g": f.protein_g or 0,
                    "carbohydrates_g": f.carbohydrates_g or 0,
                    "fat_g": f.fat_g or 0,
                    "fiber_g": f.fiber_g or 0,
                    "sugar_g": f.sugar_g or 0,
                    "sodium_mg": f.sodium_mg or 0,
                    "calcium_mg": f.calcium_mg or 0,
                    "iron_mg": f.iron_mg or 0,
                    "vitamin_c_mg": f.vitamin_c_mg or 0,
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
