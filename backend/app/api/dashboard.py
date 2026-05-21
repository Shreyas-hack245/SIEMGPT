from io import BytesIO
from typing import List

from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.responses import StreamingResponse
from sqlalchemy.orm import Session

from app.core.auth import get_current_user
from app.db.database import get_db
from app.models.alert import Alert
from app.models.investigation import InvestigationHistory
from app.schemas.dashboard import (
    DashboardSummary,
    InvestigationHistoryItem,
    ReputationResponse,
    ReportExportRequest,
    ThreatIntelCard,
)
from app.services.mitre_mapper import build_mitre_overview
from app.services.report_export import create_pdf_report
from app.services.reputation import check_ip_reputation
from app.services.threat_classifier import classify_threat_score
from app.services.timeline import build_attack_timeline

router = APIRouter()


def _build_summary(alerts: List[Alert]) -> DashboardSummary:
    severity_counts = {"Critical": 0, "High": 0, "Medium": 0, "Low": 0}
    top_sources = {}
    technique_counts = {}

    for alert in alerts:
        severity_counts[alert.severity] = severity_counts.get(alert.severity, 0) + 1
        top_sources[alert.source_ip] = top_sources.get(alert.source_ip, 0) + 1
        key = alert.technique or "unknown"
        technique_counts[key] = technique_counts.get(key, 0) + 1

    severity_distribution = [
        {"severity": name, "count": count}
        for name, count in severity_counts.items()
    ]

    return DashboardSummary(
        total_alerts=len(alerts),
        active_incidents=sum(count for count in severity_counts.values() if count > 0),
        open_investigations=min(len(alerts), 12),
        analyst_confidence=88,
        severity_distribution=severity_distribution,
        top_sources=[
            {"source_ip": ip, "count": count, "last_seen": "Just now"}
            for ip, count in sorted(top_sources.items(), key=lambda item: item[1], reverse=True)[:5]
        ],
        technique_breakdown=[
            {"technique": name, "count": count, "mitre_id": build_mitre_overview([{"technique_key": name}])[0]["id"]}
            for name, count in sorted(technique_counts.items(), key=lambda item: item[1], reverse=True)[:5]
        ],
        threat_intel=[
            ThreatIntelCard(
                title="External IP Reputation",
                status="Active",
                summary="Suspicious IPs are being correlated across intelligence feeds.",
                score=72,
            ),
            ThreatIntelCard(
                title="MITRE ATT&CK Coverage",
                status="Updated",
                summary="New techniques mapped to the investigation workflow.",
                score=81,
            ),
            ThreatIntelCard(
                title="SOC Risk Index",
                status="Stable",
                summary="Overall risk posture is elevated but contained.",
                score=58,
            ),
        ],
        timeline=build_attack_timeline(),
    )


@router.get("/summary", response_model=DashboardSummary, tags=["dashboard"])
def get_dashboard_summary(
    db: Session = Depends(get_db), current_user=Depends(get_current_user)
):
    alerts = db.query(Alert).order_by(Alert.created_at.desc()).limit(50).all()
    if not alerts:
        alerts = [
            Alert(
                title="Malware Detected",
                severity="Critical",
                source_ip="203.0.113.5",
                technique="malware",
                description="High confidence malware event detected in outbound traffic.",
            ),
            Alert(
                title="Failed Login Spike",
                severity="High",
                source_ip="10.0.0.5",
                technique="failed_login",
                description="Multiple authentication failures from a single external source.",
            ),
            Alert(
                title="Suspicious VPN Activity",
                severity="Medium",
                source_ip="172.16.0.42",
                technique="suspicious_vpn",
                description="Unexpected remote VPN connection pattern matched risk profile.",
            ),
        ]
    return _build_summary(alerts)


@router.get("/reputation", response_model=ReputationResponse, tags=["dashboard"])
def get_ip_reputation(ip: str, current_user=Depends(get_current_user)):
    return check_ip_reputation(ip)


@router.get("/timeline", tags=["dashboard"])
def get_attack_timeline(current_user=Depends(get_current_user)):
    return build_attack_timeline()


@router.get("/history", response_model=List[InvestigationHistoryItem], tags=["dashboard"])
def get_investigation_history(
    db: Session = Depends(get_db), current_user=Depends(get_current_user)
):
    history = (
        db.query(InvestigationHistory)
        .order_by(InvestigationHistory.created_at.desc())
        .limit(12)
        .all()
    )
    return [
        InvestigationHistoryItem(
            id=item.id,
            query=item.query,
            result_summary=item.result_summary,
            severity=item.severity,
            technique=item.technique,
            created_at=item.created_at.isoformat(),
        )
        for item in history
    ]


@router.post("/reports/pdf", tags=["dashboard"])
def export_threat_report(
    request: ReportExportRequest,
    current_user=Depends(get_current_user),
):
    buffer = create_pdf_report(request.query, request.summary, request.findings)
    return StreamingResponse(
        buffer,
        media_type="application/pdf",
        headers={"Content-Disposition": "attachment; filename=siemgpt-threat-report.pdf"},
    )
