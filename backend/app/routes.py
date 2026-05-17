from fastapi import APIRouter
from pydantic import BaseModel
from app.nlp_engine import generate_elasticsearch_query

router = APIRouter()

class ChatRequest(BaseModel):
    message: str

@router.post("/chat")
def chat(query: ChatRequest):

    user_message = query.message

    elastic_query = generate_elasticsearch_query(user_message)

    return {
        "user_query": user_message,
        "generated_query": elastic_query,
        "response": "Query generated successfully"
    }