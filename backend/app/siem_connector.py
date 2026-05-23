"""
SIEM data connector - interfaces with Elasticsearch for security logs
"""
import logging
from typing import Dict, Any, List
from app.services.elasticsearch_service import get_es_client
from app.core.settings import settings

logger = logging.getLogger(__name__)


def search_logs(
    index_name: str,
    query: Dict[str, Any],
    size: int = 100,
    from_: int = 0
) -> Dict[str, Any]:
    """
    Search SIEM logs in Elasticsearch
    
    Args:
        index_name: Elasticsearch index name or pattern
        query: ES query DSL
        size: Number of results
        from_: Starting offset for pagination
        
    Returns:
        Search results with hits and metadata
    """
    es_client = get_es_client()
    
    if not es_client.is_available:
        logger.warning(f"Elasticsearch unavailable, returning empty results")
        return {
            "hits": {"total": {"value": 0}, "hits": []},
            "available": False,
            "error": "Elasticsearch service unavailable"
        }
    
    result = es_client.search(
        index=index_name,
        query=query,
        size=size,
        from_=from_
    )
    
    if result["success"]:
        return {
            "hits": result["data"]["hits"],
            "available": True,
            "total": result["data"]["hits"]["total"]["value"],
            "error": None
        }
    else:
        logger.error(f"Search failed: {result['error']}")
        return {
            "hits": {"total": {"value": 0}, "hits": []},
            "available": False,
            "error": result["error"]
        }


def get_alerts(
    severity_filter: List[str] = None,
    limit: int = 100
) -> Dict[str, Any]:
    """
    Get recent security alerts
    
    Args:
        severity_filter: Filter by severity levels (critical, high, medium, low)
        limit: Maximum number of alerts
        
    Returns:
        Alert records
    """
    query = {
        "bool": {
            "filter": [
                {"range": {"@timestamp": {"gte": "now-24h"}}}
            ]
        }
    }
    
    if severity_filter:
        query["bool"]["must"] = [
            {"terms": {"severity": severity_filter}}
        ]
    
    return search_logs(
        index_name=settings.SIEM_ALERTS_INDEX,
        query={"query": query},
        size=limit
    )


def get_failed_logins(time_range: str = "24h", limit: int = 50) -> Dict[str, Any]:
    """Get failed login attempts"""
    query = {
        "query": {
            "bool": {
                "must": [
                    {"match": {"event.action": "failed_login"}},
                    {"range": {"@timestamp": {"gte": f"now-{time_range}"}}}
                ]
            }
        },
        "aggs": {
            "by_user": {
                "terms": {"field": "user.name", "size": 10}
            },
            "by_source_ip": {
                "terms": {"field": "source.ip", "size": 10}
            }
        }
    }
    
    return search_logs(
        index_name=settings.SIEM_INDEX_PATTERN,
        query=query,
        size=limit
    )


def get_malware_detections(time_range: str = "7d", limit: int = 50) -> Dict[str, Any]:
    """Get malware detection events"""
    query = {
        "query": {
            "bool": {
                "must": [
                    {"match": {"event.category": "malware"}},
                    {"range": {"@timestamp": {"gte": f"now-{time_range}"}}}
                ]
            }
        }
    }
    
    return search_logs(
        index_name=settings.SIEM_INDEX_PATTERN,
        query=query,
        size=limit
    )


def health_check() -> Dict[str, Any]:
    """Check SIEM connector health"""
    es_client = get_es_client()
    return es_client.health()
