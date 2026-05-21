from datetime import datetime, timedelta
from random import randint, choice

TECHNIQUE_MAP = [
    {"label": "Credential Access", "marker": "T1110"},
    {"label": "Execution", "marker": "T1059"},
    {"label": "Lateral Movement", "marker": "T1021"},
    {"label": "Exfiltration", "marker": "T1041"},
    {"label": "Persistence", "marker": "T1053"},
]


def build_attack_timeline() -> list[dict]:
    base_time = datetime.utcnow() - timedelta(hours=6)
    timeline = []
    for index in range(8):
        event_time = base_time + timedelta(minutes=index * 45)
        technique = choice(TECHNIQUE_MAP)
        timeline.append({
            "timestamp": event_time.isoformat() + "Z",
            "stage": technique["label"],
            "technique_id": technique["marker"],
            "description": f"Detected {technique['label']} behavior in network traffic.",
            "severity": choice(["Low", "Medium", "High", "Critical"]),
        })
    return timeline
