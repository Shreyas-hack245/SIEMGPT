from fastapi import APIRouter
from pydantic import BaseModel
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
def chat(request: ChatRequest):
    user_message = request.message
    save_message("user", user_message)
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
        save_message("assistant", assistant_response)

        history = get_conversation_history()
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
    save_message("assistant", assistant_response)

    history = get_conversation_history()
    return {
        "mode": "assistant",
        "intent": intent,
        "message": user_message,
        "explanation": explanation,
        "conversation_history": history
    }
