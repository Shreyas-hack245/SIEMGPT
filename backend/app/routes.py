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
from app.services.openai_service import get_openai_service
from app.core.settings import settings
import logging

logger = logging.getLogger(__name__)
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
        # First attempt to get a constrained ES query via OpenAIService (if enabled)
        openai = get_openai_service()
        generated_query = None

        if openai.enabled:
            qa = openai.query_security_logs(user_message)
            if qa.get("success") and qa.get("es_query"):
                candidate = qa.get("es_query")
                # Validate candidate query shape before executing
                def _validate_node(node):
                    """Recursively ensure the node uses only a whitelisted set of operators/keys."""
                    allowed_keys = {"bool", "must", "should", "must_not", "filter", "match", "term", "terms", "range", "query_string", "nested", "exists", "match_phrase"}
                    if isinstance(node, dict):
                        for k, v in node.items():
                            if k not in allowed_keys and k not in {"query", "bool", "range", "terms", "match", "aggs", "size", "sort"}:
                                return False
                            if isinstance(v, (dict, list)) and not _validate_node(v):
                                return False
                    elif isinstance(node, list):
                        for item in node:
                            if not _validate_node(item):
                                return False
                    return True

                try:
                    # Ensure base shape and whitelist
                    if isinstance(candidate, dict) and _validate_node(candidate.get("query", candidate)):
                        # enforce time range filter to prevent long-unbounded queries
                        q = candidate
                        # If no range on @timestamp present, add a default last-7d filter
                        def _has_time_range(n):
                            if not isinstance(n, dict):
                                return False
                            if "range" in n and "@timestamp" in str(n.get("range")):
                                return True
                            for v in n.values():
                                if isinstance(v, (dict, list)) and _has_time_range(v):
                                    return True
                            return False

                        if not _has_time_range(q):
                            # inject time filter
                            q = {"query": {"bool": {"filter": [{"range": {"@timestamp": {"gte": "now-7d"}}}], **(q.get("query", {}) if isinstance(q.get("query", {}), dict) else {})}}}

                        generated_query = q
                    else:
                        logger.warning("OpenAI returned a query that failed validation; falling back to heuristic generator")
                except Exception as e:
                    logger.exception(f"Error validating OpenAI ES query: {e}")

        if generated_query is None:
            # Fallback to safe heuristic generator
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
