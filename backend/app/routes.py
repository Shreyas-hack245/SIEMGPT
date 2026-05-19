from fastapi import APIRouter
from app.openai_service import generate_query_with_ai
from app.context_manager import (
    save_message,
    get_conversation_history
)

router = APIRouter()

@router.post("/chat")
def chat(query: dict):

    user_message = query.get("message")

    history = get_conversation_history()

    ai_generated_query = generate_query_with_ai(
        user_message,
        history
    )

    save_message("user", user_message)

    save_message("assistant", ai_generated_query)

    return {
        "user_query": user_message,
        "generated_query": ai_generated_query,
        "conversation_history": history
    }