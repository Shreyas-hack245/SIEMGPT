from typing import Dict, List

MITRE_TECHNIQUES = {
    "failed_login": {"id": "T1110", "name": "Brute Force", "kill_chain": "Credential Access"},
    "malware": {"id": "T1059", "name": "Command and Scripting Interpreter", "kill_chain": "Execution"},
    "data_exfiltration": {"id": "T1041", "name": "Exfiltration Over C2 Channel", "kill_chain": "Exfiltration"},
    "suspicious_vpn": {"id": "T1021", "name": "Remote Services", "kill_chain": "Lateral Movement"},
}


def map_to_mitre(technique_key: str) -> Dict[str, str]:
    return MITRE_TECHNIQUES.get(technique_key.lower(), {
        "id": "T1598",
        "name": "Data from a Local System",
        "kill_chain": "Collection",
    })


def build_mitre_overview(events: List[Dict[str, any]]) -> List[Dict[str, str]]:
    mapped = []
    for event in events:
        technique_key = event.get("technique_key", event.get("event_type", "unknown"))
        mapped.append(map_to_mitre(technique_key))
    return mapped
