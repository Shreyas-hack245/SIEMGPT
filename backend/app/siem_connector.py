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
        logger.warning(f"Elasticsearch unavailable, returning mock results")
        
        # Simple mock matching the query if possible, or generic
        mock_hits = []
        is_failed_login = "failed_login" in str(query)
        is_malware = "malware" in str(query)
        is_vpn = "vpn" in str(query)
        is_brute = "brute_force" in str(query)
        
        if is_failed_login:
            mock_hits = [
                {"_source": {"@timestamp": "2026-05-28T10:00:00Z", "event": {"action": "failed_login"}, "user": {"name": "admin"}, "source": {"ip": "172.16.0.42"}}},
                {"_source": {"@timestamp": "2026-05-28T10:05:00Z", "event": {"action": "failed_login"}, "user": {"name": "root"}, "source": {"ip": "172.16.0.42"}}}
            ]
        elif is_malware:
            mock_hits = [
                {"_source": {"@timestamp": "2026-05-28T09:15:00Z", "event": {"category": "malware", "action": "ransomware"}, "file": {"name": "invoice.exe"}}}
            ]
        elif is_vpn:
            mock_hits = [
                {"_source": {"@timestamp": "2026-05-28T08:30:00Z", "network": {"application": "vpn"}, "source": {"ip": "192.168.1.100", "geo": {"country_name": "Russia"}}}}
            ]
        elif is_brute:
            mock_hits = [
                {"_source": {"@timestamp": "2026-05-28T11:20:00Z", "attack": {"type": "brute_force"}, "source": {"ip": "10.0.0.55"}}}
            ]
        else:
            mock_hits = [
                {"_source": {"@timestamp": "2026-05-28T12:00:00Z", "event": {"category": "authentication"}, "user": {"name": "system"}}}
            ]
            
        return {
            "hits": {"total": {"value": len(mock_hits) * 14}, "hits": mock_hits},
            "available": False,
            "fallback": True,
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
