from sqlalchemy import Column, Integer, String, Text, DateTime
from sqlalchemy.sql import func
from app.db.database import Base


class InvestigationHistory(Base):
    __tablename__ = "investigation_history"

    id = Column(Integer, primary_key=True, index=True)
    query = Column(Text, nullable=False)
    result_summary = Column(Text, nullable=False)
    severity = Column(String, nullable=False)
    technique = Column(String, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
