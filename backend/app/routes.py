from fastapi import APIRouter

router = APIRouter()

@router.post("/chat")
def chat(query: dict):
    user_message = query.get("message")

    return {
        "user_query": user_message,
        "generated_query": {
            "match": {
                "event.action": "failed_login"
            }
        },
        "response": "Showing failed login attempts"
    }