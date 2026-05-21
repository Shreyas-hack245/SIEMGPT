from elasticsearch import Elasticsearch
from elasticsearch.exceptions import ConnectionError

# Connect to Elasticsearch
# Use environment variables in production
es = Elasticsearch("http://localhost:9200", max_retries=1, request_timeout=2)

def search_logs(index_name, query):
    try:
        response = es.search(
            index=index_name,
            body=query
        )
        return response
    except ConnectionError:
        # Fallback for UI testing when ES is not running
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
            }
        }
    except Exception as e:
        return {
            "error": str(e)
        }