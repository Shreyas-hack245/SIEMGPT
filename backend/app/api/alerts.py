import asyncio
import json
from datetime import datetime

from fastapi import APIRouter, WebSocket, WebSocketDisconnect, Depends
from sqlalchemy.orm import Session

from app.core.auth import get_current_user
from app.db.database import get_db, SessionLocal
from app.models.alert import Alert
from app.services.threat_classifier import classify_threat_score
import logging

router = APIRouter()
logger = logging.getLogger(__name__)


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
    """
    Poll the database for new alerts and broadcast them to active websocket connections.
    This replaces the previous synthetic alert generator and uses real persisted alerts.
    """
    last_seen_id = None
    while True:
        try:
            db = SessionLocal()
            # fetch newest alerts up to 50
            alerts = db.query(Alert).order_by(Alert.created_at.desc()).limit(50).all()
            db.close()

            if not alerts:
                await asyncio.sleep(5)
                continue

            # alerts are in descending order; determine new ones
            newest_id = alerts[0].id
            new_alerts = []
            for a in reversed(alerts):
                if last_seen_id is None or a.id > last_seen_id:
                    new_alerts.append(a)

            if newest_id:
                last_seen_id = newest_id

            for a in new_alerts:
                payload = {
                    "id": a.id,
                    "title": a.title,
                    "source_ip": a.source_ip,
                    "severity": a.severity,
                    "technique": a.technique,
                    "description": a.description,
                    "timestamp": a.created_at.isoformat() if hasattr(a, "created_at") else datetime.utcnow().isoformat() + "Z",
                }
                await manager.broadcast(json.dumps(payload))

        except Exception as e:
            logger.exception(f"Alert poller encountered an error: {e}")

        await asyncio.sleep(5)
