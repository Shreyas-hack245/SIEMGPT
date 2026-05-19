from fastapi import APIRouter
from app.openai_service import generate_query_with_ai
from app.context_manager import (
    save_message,
    get_conversation_history
)
from app.response_formatter import generate_threat_report

router = APIRouter()

@router.post("/chat")
def chat(query: dict):

    try:

        user_message = query.get("message")

        history = get_conversation_history()

        ai_generated_query = generate_query_with_ai(
            user_message,
            history
        )

        # Fake SIEM response for testing
        fake_logs = {
            "hits": {
                "total": {
                    "value": 25
                }
            }
        }

        report = generate_threat_report(
            user_message,
            fake_logs
        )

        save_message("user", user_message)

        save_message("assistant", str(report))

        return {
            "generated_query": ai_generated_query,
            "report": report
        }

    except Exception as e:

        return {
            "error": str(e)
        }