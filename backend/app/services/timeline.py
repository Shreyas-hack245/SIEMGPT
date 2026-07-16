from datetime import datetime, timedelta
from typing import List, Dict, Any

from app.services.elasticsearch_service import get_es_client
from app.core.settings import settings
import logging

logger = logging.getLogger(__name__)


def _index_available(es_client, pattern: str) -> bool:
    try:
        indices = es_client.get_indices().get("indices", [])
        # Basic substring match against available indices
        return any(pattern.strip("*") in idx for idx in indices)
    except Exception:
        return False


def build_attack_timeline(window: str = "24h", interval: str = "30m") -> List[Dict[str, Any]]:
    """
    Build an attack timeline from Elasticsearch aggregations.

    Returns a list of timeline buckets with timestamp and top techniques.
    If Elasticsearch is unavailable or no indices match, returns an empty list.
    """
    es_client = get_es_client()

    if not es_client.is_available:
        logger.warning("Elasticsearch unavailable for timeline; returning empty timeline")
        return []

    # Check for at least one matching index (best-effort)
    if not _index_available(es_client, settings.SIEM_INDEX_PATTERN):
        logger.warning(f"No indices matching pattern {settings.SIEM_INDEX_PATTERN}; timeline disabled")
        return []

    # Build aggregation body
    aggs = {
        "timeline": {
            "date_histogram": {
                "field": "@timestamp",
                "fixed_interval": interval,
                "min_doc_count": 0,
                "extended_bounds": {
                    # extended_bounds will be set by ES based on request timeframe - leave out for now
                }
            },
            "aggs": {
                "top_techniques": {
                    "terms": {"field": "technique.keyword", "size": 5}
                },
                "severity_counts": {
                    "terms": {"field": "severity.keyword", "size": 4}
                }
            }
        }
    }

    # Query timeframe
    query = {
        "bool": {
            "filter": [
                {"range": {"@timestamp": {"gte": f"now-{window}"}}}
            ]
        }
    }

    result = es_client.aggregate(index=settings.SIEM_INDEX_PATTERN, aggs=aggs, query=query)

    if not result.get("success"):
        logger.error(f"Timeline aggregation failed: {result.get('error')}")
        return []

    aggs_data = result.get("data", {})
    timeline_buckets = []

    # Navigate the aggregation structure produced by ES
    timeline = aggs_data.get("timeline", {})
    buckets = timeline.get("buckets", []) if isinstance(timeline, dict) else []

    for b in buckets:
        ts = b.get("key_as_string") or b.get("key")
        top_tech = []
        for t in b.get("top_techniques", {}).get("buckets", []):
            top_tech.append({"technique": t.get("key"), "count": t.get("doc_count")})

        severity = {item.get("key"): item.get("doc_count") for item in b.get("severity_counts", {}).get("buckets", [])}

        timeline_buckets.append({
            "timestamp": ts,
            "techniques": top_tech,
            "severity_counts": severity,
        })

    return timeline_buckets
