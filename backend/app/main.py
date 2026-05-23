from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import asyncio

from app.routes import router
from app.api.auth import router as auth_router
from app.api.alerts import router as alerts_router
from app.api.alerts import alert_generator
from app.api.dashboard import router as dashboard_router
from app.db.database import Base, engine
import app.models.user
import app.models.alert
import app.models.investigation

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

@app.on_event("startup")
async def startup_event():
    asyncio.create_task(alert_generator())

app.include_router(auth_router, prefix="/api/v1/auth", tags=["auth"])
app.include_router(alerts_router, prefix="/api/v1/alerts", tags=["alerts"])
app.include_router(dashboard_router, prefix="/api/v1/dashboard", tags=["dashboard"])
app.include_router(router, prefix="/api/v1")

@app.get("/")
def home():
    return {
        "message": "SIEMGPT Enterprise Backend Running"
    }