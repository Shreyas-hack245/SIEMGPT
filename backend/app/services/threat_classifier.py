from typing import Dict

SEVERITY_THRESHOLDS = {
    "Critical": 90,
    "High": 70,
    "Medium": 45,
    "Low": 0,
}


def classify_threat_score(score: int) -> str:
    for severity, threshold in SEVERITY_THRESHOLDS.items():
        if score >= threshold:
            return severity
    return "Low"


def get_severity_color(severity: str) -> str:
    return {
        "Critical": "#ff3864",
        "High": "#f97316",
        "Medium": "#facc15",
        "Low": "#22c55e",
    }.get(severity, "#94a3b8")


def classify_event(event: Dict[str, any]) -> str:
    score = event.get("risk_score", 30)
    return classify_threat_score(score)
