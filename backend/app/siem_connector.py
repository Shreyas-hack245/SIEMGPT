from elasticsearch import Elasticsearch

def connect_elasticsearch():

    es = Elasticsearch(
        "http://localhost:9200"
    )

    return es