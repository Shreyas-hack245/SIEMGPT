import requests

class ReputationService:
    def __init__(self, api_key: str = None):
        # E.g., VirusTotal API key or AbuseIPDB key
        self.api_key = api_key or "DEMO_KEY"

    def lookup_ip(self, ip_address: str) -> dict:
        """
        Simulate a lookup to a threat intelligence service.
        In a real scenario, this would use self.api_key to query VirusTotal/AbuseIPDB.
        """
        # Mock logic
        malicious_ips = ["203.0.113.5", "10.0.0.5", "192.168.1.100"]
        if ip_address in malicious_ips:
            return {
                "ip": ip_address,
                "reputation": "malicious",
                "confidence_score": 85,
                "threat_type": "botnet"
            }
        
        return {
            "ip": ip_address,
            "reputation": "safe",
            "confidence_score": 99,
            "threat_type": "none"
        }

reputation_service = ReputationService()
