from fastapi import APIRouter
from app.openai_service import generate_query_with_ai

router = APIRouter()

@router.post("/chat")
def chat(query: dict):

    user_message = query.get("message")

    ai_generated_query = generate_query_with_ai(user_message)

    return {
        "user_query": user_message,
        "generated_query": ai_generated_query
    }