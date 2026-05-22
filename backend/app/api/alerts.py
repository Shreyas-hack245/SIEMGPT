import asyncio
import json
import random
from datetime import datetime

from fastapi import APIRouter, WebSocket, WebSocketDisconnect, Depends
from sqlalchemy.orm import Session

from app.core.auth import get_current_user
from app.db.database import get_db
from app.models.alert import Alert
from app.services.threat_classifier import classify_threat_score

router = APIRouter()


class ConnectionManager:
    def __init__(self):
        self.active_connections: list[WebSocket] = []

    async def connect(self, websocket: WebSocket):
        await websocket.accept()
        self.active_connections.append(websocket)

    def disconnect(self, websocket: WebSocket):
        self.active_connections.remove(websocket)

    async def broadcast(self, message: str):
        for connection in self.active_connections:
            await connection.send_text(message)


manager = ConnectionManager()


@router.websocket("/live")
async def websocket_endpoint(websocket: WebSocket):
    await manager.connect(websocket)
    try:
        while True:
            await websocket.receive_text()
    except WebSocketDisconnect:
        manager.disconnect(websocket)


@router.get("/recent", tags=["alerts"])
def get_recent_alerts(
    db: Session = Depends(get_db)
):
    alerts = db.query(Alert).order_by(Alert.created_at.desc()).limit(12).all()
    return [
        {
            "id": alert.id,
            "title": alert.title,
            "severity": alert.severity,
            "source_ip": alert.source_ip,
            "technique": alert.technique,
            "description": alert.description,
            "created_at": alert.created_at.isoformat(),
        }
        for alert in alerts
    ]


async def alert_generator():
    alert_types = [
        {"title": "Malware Detected", "technique": "malware"},
        {"title": "Failed Login Spike", "technique": "failed_login"},
        {"title": "Suspicious VPN Activity", "technique": "suspicious_vpn"},
        {"title": "Data Exfiltration Attempt", "technique": "data_exfiltration"},
    ]
    ips = ["192.168.1.100", "10.0.0.5", "172.16.0.42", "203.0.113.5"]

    while True:
        await asyncio.sleep(random.randint(6, 14))
        event = random.choice(alert_types)
        severity = classify_threat_score(random.randint(38, 96))
        alert = {
            "title": event["title"],
            "source_ip": random.choice(ips),
            "severity": severity,
            "technique": event["technique"],
            "description": f"Detected {event['title']} across the SOC sensor grid.",
            "timestamp": datetime.utcnow().isoformat() + "Z",
        }
        await manager.broadcast(json.dumps(alert))
