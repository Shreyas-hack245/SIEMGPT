import asyncio
from fastapi import APIRouter, WebSocket, WebSocketDisconnect
import json

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
            # We don't expect much input from the client, just keep the connection alive
            data = await websocket.receive_text()
    except WebSocketDisconnect:
        manager.disconnect(websocket)

# A background task to simulate or push live alerts to connected clients
async def alert_generator():
    import random
    alert_types = ["Malware Detected", "Failed Login Spike", "Suspicious VPN Activity", "Data Exfiltration Attempt"]
    ips = ["192.168.1.100", "10.0.0.5", "172.16.0.42", "203.0.113.5"]
    while True:
        await asyncio.sleep(random.randint(5, 15))
        alert = {
            "type": random.choice(alert_types),
            "source_ip": random.choice(ips),
            "severity": random.choice(["Low", "Medium", "High", "Critical"]),
            "timestamp": "now"
        }
        await manager.broadcast(json.dumps(alert))
