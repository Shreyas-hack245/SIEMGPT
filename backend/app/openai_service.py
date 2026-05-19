def generate_query_with_ai(user_input, history):

    user_input = user_input.lower()

    if "malware" in user_input:

        return {
            "query": {
                "bool": {
                    "must": [
                        {
                            "match": {
                                "event.category": "malware"
                            }
                        }
                    ],
                    "filter": [
                        {
                            "range": {
                                "@timestamp": {
                                    "gte": "now-7d"
                                }
                            }
                        }
                    ]
                }
            }
        }

    elif "failed login" in user_input:

        return {
            "query": {
                "match": {
                    "event.action": "failed_login"
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