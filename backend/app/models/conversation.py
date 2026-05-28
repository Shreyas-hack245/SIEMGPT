"""
Database models for conversation history and investigations
"""
from sqlalchemy import Column, Integer, String, Text, DateTime, Boolean, ForeignKey, JSON
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.db.database import Base


class ConversationHistory(Base):
    """Stores conversation messages for context and audit"""
    __tablename__ = "conversation_history"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("user.id"), nullable=False)
    message_type = Column(String, nullable=False)  # "user", "assistant"
    content = Column(Text, nullable=False)
    meta_data = Column(JSON, nullable=True)  # Store additional context
    created_at = Column(DateTime, server_default=func.now())
    
    # Relationships
    user = relationship("User", back_populates="conversations")


class InvestigationQuery(Base):
    """Stores investigation queries and results"""
    __tablename__ = "investigation_queries"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("user.id"), nullable=False)
    query = Column(Text, nullable=False)
    es_query = Column(JSON, nullable=True)
    result_count = Column(Integer, default=0)
    result_preview = Column(Text, nullable=True)
    created_at = Column(DateTime, server_default=func.now())
    
    # Relationships
    user = relationship("User", back_populates="investigations")


class ThreatIndicator(Base):
    """Cache for threat intelligence data"""
    __tablename__ = "threat_indicators"
    
    id = Column(Integer, primary_key=True, index=True)
    indicator_type = Column(String, nullable=False)  # "ip", "domain", "hash", "file"
    indicator_value = Column(String, nullable=False, unique=True)
    is_malicious = Column(Boolean, default=False)
    severity = Column(String)  # "critical", "high", "medium", "low"
    source = Column(String)  # "virustotal", "abuseipdb", "custom"
    details = Column(JSON, nullable=True)
    last_checked = Column(DateTime)
    created_at = Column(DateTime, server_default=func.now())


# Update User model in models/user.py to add relationships
