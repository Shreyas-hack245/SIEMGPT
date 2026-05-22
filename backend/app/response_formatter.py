def generate_threat_report(query, siem_data):

    if siem_data.get("fallback"):
        total_hits = 0
        try:
            total_hits = siem_data["hits"]["total"]["value"]
        except Exception:
            total_hits = 0

        return {
            "report_title": "Threat Investigation Report",
            "investigation_query": query,
            "summary": (
                f"Detected {total_hits} matching security events using demo SIEM data because the live SIEM connection failed."
            ),
            "error": siem_data.get("error"),
            "recommendation": (
                "Start Elasticsearch at the configured SIEM_HOST or update SIEM_HOST to your Elasticsearch endpoint. "
                "For now, this report is based on fallback sample data."
            )
        }

    if "error" in siem_data:
        return {
            "report_title": "Threat Investigation Report",
            "investigation_query": query,
            "summary": "Unable to retrieve SIEM logs.",
            "error": siem_data["error"],
            "recommendation": "Verify your Elasticsearch connection and index settings."
        }

    total_hits = 0
    try:
        total_hits = siem_data["hits"]["total"]["value"]
    except Exception:
        total_hits = 0

    return {
        "report_title": "Threat Investigation Report",
        "investigation_query": query,
        "summary": f"Detected {total_hits} matching security events.",
        "recommendation": "Investigate the returned events and tune detection rules as needed."
    }


def build_siem_analytics(siem_data):
    if siem_data.get("fallback"):
        total_hits = 0
        try:
            total_hits = siem_data["hits"]["total"]["value"]
        except Exception:
            total_hits = 0

        return {
            "status": "demo",
            "total_hits": total_hits,
            "error": siem_data.get("error")
        }

    if "error" in siem_data:
        return {
            "status": "error",
            "error": siem_data["error"],
            "total_hits": 0
        }

    total_hits = 0
    try:
        total_hits = siem_data["hits"]["total"]["value"]
    except Exception:
        total_hits = 0

    return {
        "status": "ok",
        "total_hits": total_hits
    }
