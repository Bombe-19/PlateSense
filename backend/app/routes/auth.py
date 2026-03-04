from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.database import get_db
from app.models import User
from app.schemas import UserRegister, UserLogin, UserResponse
from app.utils.auth import hash_password, verify_password
from datetime import datetime
from pydantic import BaseModel
import jwt
import json
from urllib.request import urlopen

router = APIRouter(prefix="/api/v1/auth", tags=["Authentication"])

# Google OAuth configuration
GOOGLE_OAUTH_CONFIG = {
    "client_id": "YOUR_GOOGLE_CLIENT_ID",  # Replace with actual Google Client ID
    "algorithms": ["RS256"]
}

class GoogleTokenRequest(BaseModel):
    token: str

def verify_google_token(token: str):
    """Verify Google OAuth token and return user info"""
    try:
        # Get Google's public keys
        google_keys_url = "https://www.googleapis.com/oauth2/v1/certs"
        response = urlopen(google_keys_url)
        google_keys = json.loads(response.read())
        
        # Decode the token header to get the key ID
        unverified_header = jwt.get_unverified_header(token)
        
        # Find the matching key
        rsa_key = {}
        for key in google_keys['keys']:
            if key['kid'] == unverified_header['kid']:
                rsa_key = {
                    'kty': key['kty'],
                    'kid': key['kid'],
                    'use': key['use'],
                    'n': key['n'],
                    'e': key['e']
                }
        
        if not rsa_key:
            return None
        
        # Decode and verify the token
        payload = jwt.decode(
            token,
            rsa_key,
            algorithms=["RS256"],
            audience="YOUR_GOOGLE_CLIENT_ID"  # Replace with actual Google Client ID
        )
        
        return payload
    except Exception as e:
        print(f"Token verification failed: {str(e)}")
        return None

@router.post("/google-login", response_model=UserResponse)
async def google_login(request: GoogleTokenRequest, db: Session = Depends(get_db)):
    """Login or register user via Google OAuth"""
    
    try:
        # Try to verify the token
        payload = verify_google_token(request.token)
        
        if not payload:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid Google token"
            )
        
        email = payload.get("email")
        name = payload.get("name", "")
        picture = payload.get("picture", "")
        
        if not email:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Email not found in token"
            )
        
        # Check if user exists
        user = db.query(User).filter(User.email == email).first()
        
        if not user:
            # Create new user from Google data
            username = email.split("@")[0]  # Use email prefix as username
            
            # Make sure username is unique
            existing_username = db.query(User).filter(User.username == username).first()
            if existing_username:
                username = f"{username}_{datetime.utcnow().timestamp()}"
            
            new_user = User(
                username=username,
                email=email,
                password_hash=hash_password(f"google_oauth_{datetime.utcnow().timestamp()}"),
                full_name=name,
                is_active=True,
                created_at=datetime.utcnow(),
                oauth_provider="google",
                oauth_id=payload.get("sub")
            )
            db.add(new_user)
            db.commit()
            db.refresh(new_user)
            user = new_user
        else:
            # Update OAuth info if needed
            if not user.oauth_provider:
                user.oauth_provider = "google"
                user.oauth_id = payload.get("sub")
                db.commit()
        
        # Update last login
        user.last_login = datetime.utcnow()
        db.commit()
        
        return UserResponse.from_orm(user)
    
    except HTTPException:
        raise
    except Exception as e:
        print(f"Google login error: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Google authentication failed"
        )

@router.post("/register", response_model=UserResponse, status_code=status.HTTP_201_CREATED)
async def register(user_data: UserRegister, db: Session = Depends(get_db)):
    """Register new user with username, email, full_name, and password"""
    
    # Check if user already exists
    existing_user = db.query(User).filter(
        (User.email == user_data.email) | (User.username == user_data.username)
    ).first()
    
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Email or username already registered"
        )
    
    # Create new user
    hashed_password = hash_password(user_data.password)
    new_user = User(
        username=user_data.username,
        email=user_data.email,
        password_hash=hashed_password,
        full_name=user_data.full_name,
        is_active=True,
        created_at=datetime.utcnow()
    )
    
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    
    return UserResponse.from_orm(new_user)

@router.post("/login", response_model=UserResponse)
async def login(credentials: UserLogin, db: Session = Depends(get_db)):
    """Login user with email and password"""
    
    # Find user by email
    user = db.query(User).filter(User.email == credentials.email).first()
    
    if not user or not verify_password(credentials.password, user.password_hash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password"
        )
    
    if not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="User account is inactive"
        )
    
    # Update last login
    user.last_login = datetime.utcnow()
    db.commit()
    
    return UserResponse.from_orm(user)

@router.get("/profile/{user_id}", response_model=UserResponse)
async def get_user_profile(user_id: int, db: Session = Depends(get_db)):
    """Get user profile by user ID"""
    
    user = db.query(User).filter(User.id == user_id).first()
    
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )
    
    return UserResponse.from_orm(user)
@router.put("/profile/{user_id}", response_model=UserResponse)
async def update_user_profile(user_id: int, data: dict, db: Session = Depends(get_db)):
    """Update user profile by user ID"""
    
    user = db.query(User).filter(User.id == user_id).first()
    
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )
    
    # Update fields if provided
    if "username" in data:
        user.username = data["username"]
    if "email" in data:
        user.email = data["email"]
    if "full_name" in data:
        user.full_name = data["full_name"]
    if "profile_picture" in data:
        user.profile_picture = data["profile_picture"]
    if "height_cm" in data:
        user.height_cm = data["height_cm"]
    if "weight_kg" in data:
        user.weight_kg = data["weight_kg"]
    if "age" in data:
        user.age = data["age"]
    if "dietary_preferences" in data:
        user.dietary_preferences = data["dietary_preferences"]
    
    user.updated_at = datetime.utcnow()
    db.commit()
    db.refresh(user)
    
    return UserResponse.from_orm(user)