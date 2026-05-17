from fastapi import FastAPI
from app.routes import router

app = FastAPI(
    title="SIEMGPT",
    description="Conversational SIEM Assistant",
    version="1.0.0"
)

app.include_router(router)

@app.get("/")
def home():
    return {
        "message": "SIEMGPT Backend Running"
    }