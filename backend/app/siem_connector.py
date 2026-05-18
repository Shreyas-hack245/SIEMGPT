from elasticsearch import Elasticsearch

# Connect to Elasticsearch
es = Elasticsearch("http://localhost:9200")

def search_logs(index_name, query):

    try:
        response = es.search(
            index=index_name,
            body=query
        )

        return response

    except Exception as e:
        return {
            "error": str(e)
        }