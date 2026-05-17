def generate_elasticsearch_query(user_input: str):

    user_input = user_input.lower()

    if "failed login" in user_input:
        return {
            "query": {
                "match": {
                    "event.action": "failed_login"
                }
            }
        }

    elif "malware" in user_input:
        return {
            "query": {
                "match": {
                    "event.category": "malware"
                }
            }
        }

    elif "vpn" in user_input:
        return {
            "query": {
                "match": {
                    "network.application": "vpn"
                }
            }
        }

    else:
        return {
            "query": {
                "match_all": {}
            }
        }