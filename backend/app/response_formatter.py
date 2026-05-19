def generate_threat_report(query, siem_data):

    total_hits = 0

    try:
        total_hits = siem_data["hits"]["total"]["value"]
    except:
        total_hits = 0

    report = {
        "report_title": "Threat Investigation Report",
        "investigation_query": query,
        "summary": f"Detected {total_hits} matching security events.",
        "recommendation": "Investigate suspicious activities immediately."
    }

    return report