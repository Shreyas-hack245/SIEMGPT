from fastapi import APIRouter
from app.openai_service import generate_query_with_ai
from app.context_manager import (
    save_message,
    get_conversation_history
)
from app.siem_connector import search_logs
from app.response_formatter import generate_threat_report

router = APIRouter()

@router.post("/chat")
def chat(query: dict):

    user_message = query.get("message")

    history = get_conversation_history()

    ai_generated_query = generate_query_with_ai(
        user_message,
        history
    )

    logs = search_logs(
        index_name="logs-*",
        query=ai_generated_query
    )

    report = generate_threat_report(
        user_message,
        logs
    )

    save_message("user", user_message)

    save_message("assistant", str(report))

    return {
        "generated_query": ai_generated_query,
        "report": report
    }