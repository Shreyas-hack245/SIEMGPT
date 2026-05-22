import os
from elasticsearch import Elasticsearch
from elasticsearch.exceptions import ConnectionError

SIEM_HOST = os.getenv("SIEM_HOST", "http://localhost:9200")

# Connect to Elasticsearch
# Use environment variables in production
try:
    es = Elasticsearch(SIEM_HOST, max_retries=1, request_timeout=2)
except Exception:
    es = None


def fallback_siem_data(error_message=None):
    return {
        "hits": {
            "total": {"value": 24, "relation": "eq"},
            "hits": [
                {
                    "_source": {
                        "@timestamp": "2026-05-21T08:00:00Z",
                        "event": {"action": "failed_login", "category": "authentication"},
                        "source": {"ip": "203.0.113.5"},
                        "user": {"name": "admin"}
                    }
                }
            ]
        },
        "fallback": True,
        "error": error_message or "Elasticsearch unavailable"
    }


def search_logs(index_name, query):
    if es is None:
        return fallback_siem_data("Elasticsearch client unavailable")

    try:
        response = es.search(
            index=index_name,
            body=query
        )
        return response
    except ConnectionError as e:
        return fallback_siem_data(str(e))
    except Exception as e:
        return fallback_siem_data(str(e))
