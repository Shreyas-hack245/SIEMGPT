"""
Conversation context management with database persistence
"""
import logging
from typing import List, Dict, Any
from sqlalchemy.orm import Session
from app.db.database import get_db
from app.models.conversation import ConversationHistory, InvestigationQuery

logger = logging.getLogger(__name__)


def save_message(
    db: Session,
    user_id: int,
    role: str,
    content: str,
    metadata: Dict[str, Any] = None
) -> ConversationHistory:
    """
    Save a conversation message to the database
    
    Args:
        db: Database session
        user_id: User ID
        role: "user" or "assistant"
        content: Message content
        metadata: Optional metadata
        
    Returns:
        Created ConversationHistory record
    """
    message = ConversationHistory(
        user_id=user_id,
        message_type=role,
        content=content,
        meta_data=metadata
    )
    
    db.add(message)
    db.commit()
    db.refresh(message)
    
    logger.debug(f"Saved message for user {user_id}: {role}")
    return message


def get_conversation_history(
    db: Session,
    user_id: int,
    limit: int = 50
) -> List[Dict[str, Any]]:
    """
    Get conversation history for a user
    
    Args:
        db: Database session
        user_id: User ID
        limit: Maximum number of messages
        
    Returns:
        List of conversation messages
    """
    messages = db.query(ConversationHistory).filter(
        ConversationHistory.user_id == user_id
    ).order_by(
        ConversationHistory.created_at.desc()
    ).limit(limit).all()
    
    return [
        {
            "id": msg.id,
            "role": msg.message_type,
            "content": msg.content,
            "timestamp": msg.created_at.isoformat(),
            "metadata": msg.meta_data
        }
        for msg in reversed(messages)
    ]


def save_investigation_query(
    db: Session,
    user_id: int,
    query: str,
    es_query: Dict[str, Any] = None,
    result_count: int = 0,
    result_preview: str = None
) -> InvestigationQuery:
    """Save an investigation query for audit and future reference"""
    investigation = InvestigationQuery(
        user_id=user_id,
        query=query,
        es_query=es_query,
        result_count=result_count,
        result_preview=result_preview
    )
    
    db.add(investigation)
    db.commit()
    db.refresh(investigation)
    
    logger.info(f"Saved investigation query for user {user_id}")
    return investigation


def get_investigation_history(
    db: Session,
    user_id: int,
    limit: int = 20
) -> List[Dict[str, Any]]:
    """Get investigation history for a user"""
    investigations = db.query(InvestigationQuery).filter(
        InvestigationQuery.user_id == user_id
    ).order_by(
        InvestigationQuery.created_at.desc()
    ).limit(limit).all()
    
    return [
        {
            "id": inv.id,
            "query": inv.query,
            "result_count": inv.result_count,
            "timestamp": inv.created_at.isoformat(),
            "preview": inv.result_preview
        }
        for inv in investigations
    ]


def clear_conversation(db: Session, user_id: int) -> int:
    """Clear all conversation history for a user"""
    count = db.query(ConversationHistory).filter(
        ConversationHistory.user_id == user_id
    ).delete()
    
    db.commit()
    logger.info(f"Cleared {count} messages for user {user_id}")
    return count