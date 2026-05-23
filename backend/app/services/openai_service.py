"""
OpenAI integration for AI-powered security analysis
"""
import logging
import json
from typing import Optional, Dict, Any, List
from openai import OpenAI, OpenAIError
from app.core.settings import settings

logger = logging.getLogger(__name__)


class OpenAIService:
    """Manages OpenAI API interactions for security analysis"""
    
    def __init__(self):
        self.enabled = bool(settings.OPENAI_API_KEY)
        self.client: Optional[OpenAI] = None
        
        if self.enabled:
            try:
                self.client = OpenAI(api_key=settings.OPENAI_API_KEY)
                logger.info("OpenAI API initialized")
            except Exception as e:
                logger.error(f"Failed to initialize OpenAI: {str(e)}")
                self.enabled = False
    
    def analyze_security_event(
        self,
        event_data: Dict[str, Any],
        context: str = ""
    ) -> Dict[str, Any]:
        """
        Analyze a security event using OpenAI
        
        Args:
            event_data: Security event details
            context: Additional context about the investigation
            
        Returns:
            Analysis results
        """
        if not self.enabled:
            return {
                "success": False,
                "error": "OpenAI API not configured",
                "analysis": None
            }
        
        try:
            prompt = self._build_analysis_prompt(event_data, context)
            
            response = self.client.chat.completions.create(
                model=settings.OPENAI_MODEL,
                messages=[
                    {
                        "role": "system",
                        "content": "You are a cybersecurity expert analyzing security events. Provide detailed, actionable analysis."
                    },
                    {
                        "role": "user",
                        "content": prompt
                    }
                ],
                temperature=settings.OPENAI_TEMPERATURE,
                max_tokens=settings.OPENAI_MAX_TOKENS
            )
            
            analysis = response.choices[0].message.content
            
            logger.info(f"Security analysis completed")
            
            return {
                "success": True,
                "error": None,
                "analysis": analysis,
                "tokens_used": response.usage.total_tokens
            }
            
        except OpenAIError as e:
            logger.error(f"OpenAI API error: {str(e)}")
            return {
                "success": False,
                "error": f"OpenAI error: {str(e)}",
                "analysis": None
            }
        
        except Exception as e:
            logger.error(f"Unexpected error in security analysis: {str(e)}")
            return {
                "success": False,
                "error": f"Unexpected error: {str(e)}",
                "analysis": None
            }
    
    def generate_threat_report(
        self,
        alerts: List[Dict[str, Any]],
        investigation_notes: str = ""
    ) -> Dict[str, Any]:
        """Generate a threat report from alerts"""
        if not self.enabled:
            return {
                "success": False,
                "error": "OpenAI API not configured",
                "report": None
            }
        
        try:
            alert_summary = self._summarize_alerts(alerts)
            
            prompt = f"""
Generate a professional threat report based on the following security incidents:

Alerts Summary:
{alert_summary}

Investigation Notes:
{investigation_notes or "None provided"}

Please provide:
1. Executive Summary
2. Threat Assessment
3. Affected Systems and Users
4. Recommended Actions
5. MITRE ATT&CK Techniques Involved
"""
            
            response = self.client.chat.completions.create(
                model=settings.OPENAI_MODEL,
                messages=[
                    {
                        "role": "system",
                        "content": "You are a cybersecurity analyst. Create professional threat reports."
                    },
                    {
                        "role": "user",
                        "content": prompt
                    }
                ],
                temperature=settings.OPENAI_TEMPERATURE,
                max_tokens=settings.OPENAI_MAX_TOKENS * 2
            )
            
            report = response.choices[0].message.content
            
            return {
                "success": True,
                "error": None,
                "report": report,
                "tokens_used": response.usage.total_tokens
            }
            
        except Exception as e:
            logger.error(f"Report generation failed: {str(e)}")
            return {
                "success": False,
                "error": str(e),
                "report": None
            }
    
    def query_security_logs(
        self,
        natural_language_query: str,
        available_fields: List[str] = None
    ) -> Dict[str, Any]:
        """
        Convert natural language to Elasticsearch query
        
        Args:
            natural_language_query: User's natural language question
            available_fields: Available Elasticsearch fields for the index
            
        Returns:
            Elasticsearch query
        """
        if not self.enabled:
            return {
                "success": False,
                "error": "OpenAI API not configured",
                "es_query": None
            }
        
        try:
            field_info = ""
            if available_fields:
                field_info = f"\nAvailable fields: {', '.join(available_fields)}"
            
            prompt = f"""
Convert this security question to an Elasticsearch query:

Question: {natural_language_query}{field_info}

Respond with a valid JSON Elasticsearch query body (without wrapping in 'query' key for the POST body).
Use nested queries for nested fields. Include filters for the last 7 days.
"""
            
            response = self.client.chat.completions.create(
                model=settings.OPENAI_MODEL,
                messages=[
                    {
                        "role": "system",
                        "content": "You are an Elasticsearch expert. Convert natural language to valid ES queries."
                    },
                    {
                        "role": "user",
                        "content": prompt
                    }
                ],
                temperature=0.3,  # Lower temperature for more consistent queries
                max_tokens=500
            )
            
            query_text = response.choices[0].message.content
            
            # Extract JSON from response
            import re
            json_match = re.search(r'\{.*\}', query_text, re.DOTALL)
            if json_match:
                es_query = json.loads(json_match.group())
                return {
                    "success": True,
                    "error": None,
                    "es_query": {"query": es_query},
                    "tokens_used": response.usage.total_tokens
                }
            else:
                return {
                    "success": False,
                    "error": "Could not extract valid JSON from response",
                    "es_query": None
                }
            
        except json.JSONDecodeError as e:
            logger.error(f"Failed to parse Elasticsearch query: {str(e)}")
            return {
                "success": False,
                "error": f"Query parsing error: {str(e)}",
                "es_query": None
            }
        
        except Exception as e:
            logger.error(f"Query generation failed: {str(e)}")
            return {
                "success": False,
                "error": str(e),
                "es_query": None
            }
    
    @staticmethod
    def _build_analysis_prompt(event_data: Dict[str, Any], context: str) -> str:
        """Build a prompt for security event analysis"""
        event_json = json.dumps(event_data, indent=2, default=str)
        
        return f"""
Analyze this security event:

Event Data:
{event_json}

Context:
{context or "No additional context provided"}

Provide a detailed analysis including:
1. What happened
2. Severity level and reasoning
3. Potential impact
4. Recommended immediate actions
5. Investigation recommendations
"""
    
    @staticmethod
    def _summarize_alerts(alerts: List[Dict[str, Any]]) -> str:
        """Create a summary of alerts for the report"""
        if not alerts:
            return "No alerts provided"
        
        summary_lines = []
        for i, alert in enumerate(alerts[:10], 1):  # Limit to first 10
            title = alert.get("title", "Unknown")
            severity = alert.get("severity", "Unknown")
            source = alert.get("source_ip", "Unknown")
            summary_lines.append(f"{i}. {title} (Severity: {severity}, Source: {source})")
        
        if len(alerts) > 10:
            summary_lines.append(f"\n... and {len(alerts) - 10} more alerts")
        
        return "\n".join(summary_lines)


# Global instance
openai_service = OpenAIService()


def get_openai_service() -> OpenAIService:
    """Dependency injection for OpenAI service"""
    return openai_service
