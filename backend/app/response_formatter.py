def generate_threat_report(query, siem_data):

    # Handle Elasticsearch connection errors
    if "error" in siem_data:

        return {
            "report_title": "Threat Investigation Report",
            "investigation_query": query,
            "summary": "Unable to retrieve SIEM logs.",
            "error": siem_data["error"],
            "recommendation": "Ensure Elasticsearch is running."
        }

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