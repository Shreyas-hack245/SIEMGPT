from typing import Literal

INVESTIGATION_KEYWORDS = [
    "show",
    "generate",
    "search",
    "find",
    "report",
    "activity",
    "events",
    "traffic",
    "alerts",
    "logs",
    "failed",
    "malware",
    "vpn",
    "threat",
    "attack",
    "ransomware",
    "brute force",
    "scan",
    "investigate",
    "detected",
]

EXPLANATION_KEYWORDS = [
    "what is",
    "what are",
    "explain",
    "how does",
    "how do",
    "why",
    "define",
    "describe",
    "difference",
    "meaning",
    "why is",
    "tell me about",
]


def detect_intent(user_input: str) -> Literal["investigation", "assistant"]:
    text = user_input.strip().lower()

    if any(keyword in text for keyword in EXPLANATION_KEYWORDS):
        return "assistant"

    if any(keyword in text for keyword in INVESTIGATION_KEYWORDS):
        return "investigation"

    if any(term in text for term in ["malware", "phishing", "sql injection", "vpn", "ransomware", "failed login"]):
        return "investigation"

    return "assistant"


def generate_elasticsearch_query(user_input: str) -> dict:
    text = user_input.lower()

    if "failed login" in text or "failed logins" in text:
        return {
            "query": {
                "bool": {
                    "must": [
                        {"match": {"event.action": "failed_login"}}
                    ],
                    "filter": [
                        {"range": {"@timestamp": {"gte": "now-7d"}}}
                    ]
                }
            }
        }

    if "malware" in text:
        return {
            "query": {
                "bool": {
                    "must": [
                        {"match": {"event.category": "malware"}}
                    ],
                    "filter": [
                        {"range": {"@timestamp": {"gte": "now-7d"}}}
                    ]
                }
            }
        }

    if "vpn" in text or "virtual private network" in text:
        return {
            "query": {
                "bool": {
                    "must": [
                        {"match": {"network.application": "vpn"}}
                    ],
                    "filter": [
                        {"range": {"@timestamp": {"gte": "now-7d"}}}
                    ]
                }
            }
        }

    if "brute force" in text or "bruteforce" in text:
        return {
            "query": {
                "bool": {
                    "must": [
                        {"match": {"attack.type": "brute_force"}}
                    ],
                    "filter": [
                        {"range": {"@timestamp": {"gte": "now-7d"}}}
                    ]
                }
            }
        }

    if "ransomware" in text:
        return {
            "query": {
                "bool": {
                    "must": [
                        {"match": {"event.category": "malware"}},
                        {"match": {"event.action": "ransomware"}}
                    ],
                    "filter": [
                        {"range": {"@timestamp": {"gte": "now-30d"}}}
                    ]
                }
            }
        }

    return {
        "query": {
            "match_all": {}
        }
    }


def generate_educational_explanation(user_input: str) -> str:
    text = user_input.strip().lower()

    if "sql injection" in text:
        return (
            "SQL injection is a web application attack that allows an attacker to execute malicious SQL code "
            "against a database. It occurs when user input is not properly validated or escaped, allowing attackers "
            "to read, modify, or delete sensitive data, bypass authentication, or execute administrative operations."
        )

    if "phishing" in text:
        return (
            "Phishing is a social engineering technique where attackers send fraudulent messages or emails designed "
            "to trick users into revealing credentials, financial information, or installing malware. Effective phishing "
            "attacks often mimic trusted brands and create a sense of urgency to deceive victims."
        )

    if "ransomware" in text:
        return (
            "Ransomware is malware that encrypts files or systems and demands payment for the decryption key. "
            "It often spreads through phishing emails, unpatched software, or exposed remote access services, and can "
            "cause severe business disruption until the ransom is paid or the system is restored."
        )

    if "malware" in text:
        return (
            "Malware is malicious software designed to disrupt, damage, or gain unauthorized access to a system. "
            "It includes viruses, worms, trojans, ransomware, spyware, and backdoors, and can be delivered through "
            "email attachments, drive-by downloads, or infected installers."
        )

    if "vpn" in text:
        return (
            "A VPN, or Virtual Private Network, encrypts traffic between a user and a remote network, providing "
            "privacy and secure access. In cybersecurity, suspicious VPN activity can indicate unauthorized remote "
            "access or exfiltration attempts."
        )

    if "failed login" in text or "failed logins" in text:
        return (
            "Failed login attempts are authentication events that did not complete successfully. A high volume of "
            "failed logins can indicate brute force attacks, credential stuffing, or unauthorized access attempts. "
            "Security teams should correlate these failures with source IPs and user accounts."
        )

    return (
        "This looks like a cybersecurity explanation request. In general, the best practice is to review the "
        "threat type, understand its attack vector, and then apply the appropriate defensive controls. If you have "
        "a specific term or attack type, I can explain how it works and how to protect against it."
    )
