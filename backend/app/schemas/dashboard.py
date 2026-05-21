from typing import List, Optional
from pydantic import BaseModel


class TechniqueBreakdown(BaseModel):
    technique: str
    count: int
    mitre_id: Optional[str] = None


class SeverityDistribution(BaseModel):
    severity: str
    count: int


class TopSource(BaseModel):
    source_ip: str
    count: int
    last_seen: str


class ThreatTimelineEvent(BaseModel):
    timestamp: str
    stage: str
    technique_id: str
    description: str
    severity: str


class ThreatIntelCard(BaseModel):
    title: str
    status: str
    summary: str
    score: int


class InvestigationHistoryItem(BaseModel):
    id: int
    query: str
    result_summary: str
    severity: str
    technique: Optional[str] = None
    created_at: str


class DashboardSummary(BaseModel):
    total_alerts: int
    active_incidents: int
    open_investigations: int
    analyst_confidence: int
    severity_distribution: List[SeverityDistribution]
    top_sources: List[TopSource]
    technique_breakdown: List[TechniqueBreakdown]
    threat_intel: List[ThreatIntelCard]
    timeline: List[ThreatTimelineEvent]


class ReputationResponse(BaseModel):
    ip: str
    risk_score: int
    source: str
    confidence: str
    summary: str
    abuse_categories: Optional[List[str]] = None


class ReportExportRequest(BaseModel):
    query: str
    summary: str
    findings: List[dict]
