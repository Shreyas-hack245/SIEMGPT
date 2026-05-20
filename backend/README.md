# SIEMGPT Backend

This folder contains the FastAPI backend for SIEMGPT — a hybrid SIEM investigation and cybersecurity assistant.

Requirements

- Python 3.9+
- Elasticsearch running and reachable (default at `http://localhost:9200`)

Install

```bash
python -m venv venv
venv\Scripts\activate    # Windows
pip install -r requirements.txt
```

Run

```bash
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

Usage

- POST `/chat` with JSON: `{ "message": "show malware activity" }`
- Response JSON contains `mode` either `investigation` or `assistant`.

Notes

- Default SIEM index: `security-logs` (change in `app/routes.py`)
- Conversation memory is kept in `app/context_manager.py` (in-memory).
- For production, switch to a persistent conversation store and secure the OpenSearch/Elasticsearch credentials.
