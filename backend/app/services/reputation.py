import requests
from typing import Any, Dict

from app.core.config import settings

ABUSEIPDB_BASE = "https://api.abuseipdb.com/api/v2/check"
VIRUSTOTAL_BASE = "https://www.virustotal.com/api/v3/ip_addresses"


def check_ip_reputation(ip_address: str) -> Dict[str, Any]:
    reputation = {
        "ip": ip_address,
        "risk_score": 40,
        "source": "mock",
        "confidence": "Medium",
        "summary": "No threat intelligence API keys configured. Showing sample enrichment.",
        "abuse_categories": ["ssh", "botnet"],
    }

    if settings.ABUSEIPDB_API_KEY:
        headers = {
            "Key": settings.ABUSEIPDB_API_KEY,
            "Accept": "application/json",
        }
        try:
            response = requests.get(
                ABUSEIPDB_BASE,
                headers=headers,
                params={"ipAddress": ip_address, "maxAgeInDays": 90},
                timeout=8,
            )
            if response.ok:
                payload = response.json().get("data", {})
                reputation.update({
                    "risk_score": payload.get("abuseConfidenceScore", reputation["risk_score"]),
                    "source": "AbuseIPDB",
                    "confidence": "High",
                    "summary": payload.get("abuseConfidenceScore", 0) > 20
                    and "AbuseIPDB reports recent suspicious activity."
                    or reputation["summary"],
                    "abuse_categories": [payload.get("usageType", "unknown")],
                })
        except Exception:
            pass

    if settings.VIRUSTOTAL_API_KEY:
        headers = {"x-apikey": settings.VIRUSTOTAL_API_KEY}
        try:
            response = requests.get(
                f"{VIRUSTOTAL_BASE}/{ip_address}", headers=headers, timeout=8
            )
            if response.ok:
                vt_data = response.json().get("data", {}).get("attributes", {})
                reputation.update({
                    "risk_score": vt_data.get("reputation", reputation["risk_score"]),
                    "source": "VirusTotal",
                    "confidence": "High",
                    "summary": vt_data.get("last_analysis_stats", {}).get("malicious", 0) > 0
                    and "VirusTotal detection indicates a suspicious IP."
                    or reputation["summary"],
                    "abuse_categories": vt_data.get("tags", []),
                })
        except Exception:
            pass

    return reputation
