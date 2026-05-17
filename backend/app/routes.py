from fastapi import APIRouter
from app.nlp_engine import generate_elasticsearch_query

router = APIRouter()

@router.post("/chat")
def chat(query: dict):

    user_message = query.get("message")

    elastic_query = generate_elasticsearch_query(user_message)

    return {
        "user_query": user_message,
        "generated_query": elastic_query,
        "response": "Query generated successfully"
    }