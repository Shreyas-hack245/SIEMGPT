from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
import json
from pydantic import BaseModel
from app.db.database import get_db
from app.models.user import User as UserModel
from app.context_manager import save_message, get_conversation_history
from app.nlp_engine import (
    detect_intent,
    generate_elasticsearch_query,
    generate_educational_explanation
)
from app.response_formatter import generate_threat_report, build_siem_analytics
from app.siem_connector import search_logs

router = APIRouter()

DEFAULT_SIEM_INDEX = "security-logs"


class ChatRequest(BaseModel):
    message: str


@router.post("/chat")
def chat(request: ChatRequest, db: Session = Depends(get_db)):
    user_message = request.message
    
    user = db.query(UserModel).filter(UserModel.email == "demo@siemgpt.local").first()
    if not user:
        user = UserModel(
            email="demo@siemgpt.local",
            full_name="Demo User",
            hashed_password="mock",
            role="admin"
        )
        db.add(user)
        db.commit()
        db.refresh(user)

    save_message(db, user.id, "user", user_message)
    intent = detect_intent(user_message)

    if intent == "investigation":
        generated_query = generate_elasticsearch_query(user_message)
        siem_data = search_logs(DEFAULT_SIEM_INDEX, generated_query)
        report = generate_threat_report(user_message, siem_data)
        analytics = build_siem_analytics(siem_data)

        assistant_response = {
            "mode": "investigation",
            "query": generated_query,
            "report": report,
            "analytics": analytics
        }
        save_message(db, user.id, "assistant", json.dumps(assistant_response))

        history = get_conversation_history(db, user.id)
        return {
            "mode": "investigation",
            "intent": intent,
            "message": user_message,
            "generated_query": generated_query,
            "report": report,
            "analytics": analytics,
            "conversation_history": history
        }

    explanation = generate_educational_explanation(user_message)
    assistant_response = {
        "mode": "assistant",
        "explanation": explanation
    }
    save_message(db, user.id, "assistant", json.dumps(assistant_response))

    history = get_conversation_history(db, user.id)
    return {
        "mode": "assistant",
        "intent": intent,
        "message": user_message,
        "explanation": explanation,
        "conversation_history": history
    }
