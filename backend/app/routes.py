from fastapi import APIRouter
from app.nlp_engine import generate_elasticsearch_query
from app.siem_connector import search_logs

router = APIRouter()

@router.post("/chat")
def chat(query: dict):

    user_message = query.get("message")

    elastic_query = generate_elasticsearch_query(user_message)

    logs = search_logs(
        index_name="logs-*",
        query=elastic_query
    )

    return {
        "user_query": user_message,
        "generated_query": elastic_query,
        "siem_response": logs
    }