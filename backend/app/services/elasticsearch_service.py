"""
Production-grade Elasticsearch integration with error handling and retries
"""
import logging
from typing import Dict, Any, Optional
from elasticsearch import Elasticsearch
from elasticsearch.exceptions import ElasticsearchException, ConnectionError
from app.core.settings import settings

logger = logging.getLogger(__name__)


class ElasticsearchClient:
    """Manages Elasticsearch connection and queries with proper error handling"""
    
    def __init__(self):
        self.client: Optional[Elasticsearch] = None
        self._is_available = False
        self._initialize_connection()
    
    def _initialize_connection(self):
        """Initialize Elasticsearch connection with retry logic"""
        try:
            # Configure authentication if provided
            kwargs = {
                "timeout": settings.ELASTICSEARCH_TIMEOUT,
                "max_retries": settings.ELASTICSEARCH_RETRY,
                "request_timeout": settings.ELASTICSEARCH_TIMEOUT
            }
            
            if settings.ELASTICSEARCH_USER and settings.ELASTICSEARCH_PASSWORD:
                kwargs["basic_auth"] = (
                    settings.ELASTICSEARCH_USER,
                    settings.ELASTICSEARCH_PASSWORD
                )
            
            self.client = Elasticsearch(
                [settings.ELASTICSEARCH_HOST],
                **kwargs
            )
            
            # Test connection
            info = self.client.info()
            self._is_available = True
            logger.info(f"Connected to Elasticsearch: {info.get('version', {}).get('number', 'unknown')}")
            
        except Exception as e:
            self._is_available = False
            logger.warning(f"Failed to connect to Elasticsearch: {str(e)}")
            self.client = None
    
    @property
    def is_available(self) -> bool:
        """Check if Elasticsearch is available"""
        if not self.client:
            return False
        
        try:
            self.client.info()
            return True
        except Exception:
            self._is_available = False
            return False
    
    def search(
        self,
        index: str,
        query: Dict[str, Any],
        size: int = 100,
        from_: int = 0
    ) -> Dict[str, Any]:
        """
        Execute a search query with error handling
        
        Args:
            index: Index name or pattern
            query: Elasticsearch query body
            size: Number of results
            from_: Starting offset
            
        Returns:
            Search results or structured error response
        """
        if not self.is_available:
            logger.error("Elasticsearch is not available")
            return self._error_response("Elasticsearch service unavailable")
        
        try:
            response = self.client.search(
                index=index,
                body=query,
                size=size,
                from_=from_
            )
            logger.debug(f"ES Query successful: {response['hits']['total']}")
            return {
                "success": True,
                "data": response,
                "error": None
            }
            
        except ConnectionError as e:
            logger.error(f"Elasticsearch connection error: {str(e)}")
            return self._error_response(f"Connection error: {str(e)}")
        
        except ElasticsearchException as e:
            logger.error(f"Elasticsearch query error: {str(e)}")
            return self._error_response(f"Query error: {str(e)}")
        
        except Exception as e:
            logger.error(f"Unexpected error querying Elasticsearch: {str(e)}")
            return self._error_response(f"Unexpected error: {str(e)}")
    
    def aggregate(
        self,
        index: str,
        aggs: Dict[str, Any],
        query: Optional[Dict[str, Any]] = None
    ) -> Dict[str, Any]:
        """Execute aggregation query"""
        if not self.is_available:
            return self._error_response("Elasticsearch service unavailable")
        
        try:
            body = {"aggs": aggs}
            if query:
                body["query"] = query
            
            response = self.client.search(
                index=index,
                body=body,
                size=0
            )
            
            return {
                "success": True,
                "data": response.get("aggregations", {}),
                "error": None
            }
            
        except Exception as e:
            logger.error(f"Aggregation error: {str(e)}")
            return self._error_response(str(e))
    
    def get_indices(self) -> Dict[str, Any]:
        """Get list of available indices"""
        if not self.is_available:
            return {"indices": [], "error": "Elasticsearch unavailable"}
        
        try:
            indices = self.client.indices.get(index="*")
            return {"indices": list(indices.keys()), "error": None}
        except Exception as e:
            logger.error(f"Failed to get indices: {str(e)}")
            return {"indices": [], "error": str(e)}
    
    def health(self) -> Dict[str, Any]:
        """Get Elasticsearch cluster health"""
        if not self.client:
            return {"status": "unavailable", "error": "Client not initialized"}
        
        try:
            health = self.client.cluster.health()
            return {
                "status": health.get("status"),
                "nodes": health.get("number_of_nodes"),
                "error": None
            }
        except Exception as e:
            logger.error(f"Health check failed: {str(e)}")
            return {"status": "error", "error": str(e)}
    
    @staticmethod
    def _error_response(error_message: str) -> Dict[str, Any]:
        """Create standardized error response"""
        return {
            "success": False,
            "data": None,
            "error": error_message
        }


# Global instance
es_client = ElasticsearchClient()


def get_es_client() -> ElasticsearchClient:
    """Dependency injection for Elasticsearch client"""
    return es_client
