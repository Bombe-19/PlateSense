from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from dotenv import load_dotenv
import os

load_dotenv()

DATABASE_URL = os.getenv(
    "DATABASE_URL",
    "mysql+pymysql://root:root@localhost:3306/food_caliper_db"
)

# Standardize postgres protocol for SQLAlchemy compatibility
if DATABASE_URL and DATABASE_URL.startswith("postgres://"):
    DATABASE_URL = DATABASE_URL.replace("postgres://", "postgresql://", 1)

# Detect if using PostgreSQL (Render / Neon)
is_postgres = DATABASE_URL and ("postgresql" in DATABASE_URL or "postgres" in DATABASE_URL)

if is_postgres:
    engine = create_engine(
        DATABASE_URL,
        pool_pre_ping=True,        # Test connection before using from pool
        pool_recycle=300,           # Recycle connections every 5 min (before SSL timeout)
        pool_size=3,                # Small pool for HF Spaces free tier
        max_overflow=5,
        pool_timeout=30,
        connect_args={
            "sslmode": "require",   # Force SSL
            "connect_timeout": 10,  # Fail fast if DB unreachable
            "keepalives": 1,        # Enable TCP keepalives
            "keepalives_idle": 30,  # Send keepalive after 30s idle
            "keepalives_interval": 10,
            "keepalives_count": 5,
        },
        echo=False
    )
else:
    engine = create_engine(
        DATABASE_URL,
        pool_pre_ping=True,
        pool_size=10,
        max_overflow=20,
        echo=False
    )

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
