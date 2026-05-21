from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routes import router
from app.api.auth import router as auth_router
from app.db.database import Base, engine
import app.models.user  # to register the model with Base

# Create tables
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="SIEMGPT Enterprise",
    description="Conversational SIEM Platform",
    version="2.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth_router, prefix="/api/auth", tags=["auth"])
app.include_router(router, prefix="/api/v1")

@app.get("/")
def home():
    return {
        "message": "SIEMGPT Enterprise Backend Running"
    }