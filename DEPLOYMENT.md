# SIEMGPT Enterprise - Professional Deployment Guide

## Overview

SIEMGPT is a production-grade conversational SIEM platform that integrates with real Elasticsearch security logs and OpenAI for intelligent threat analysis.

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                       Frontend (React/Vite)                  │
│                    http://localhost:5173                     │
└────────────────┬────────────────────────────────────────────┘
                 │ HTTP/WebSocket
┌────────────────▼────────────────────────────────────────────┐
│                    Backend (FastAPI)                         │
│                  http://localhost:8000                       │
│  ┌──────────────┬──────────────┬──────────────────────────┐ │
│  │  Auth APIs   │  Dashboard   │  Investigation APIs      │ │
│  └──────────────┴──────────────┴──────────────────────────┘ │
└────────┬──────────────┬────────────────┬───────────────────┘
         │              │                │
    ┌────▼───┐  ┌──────▼──────┐  ┌──────▼──────┐
    │    DB   │  │Elasticsearch│  │   OpenAI    │
    │ (PgSQL) │  │    (ES 8.9) │  │   (GPT-4)   │
    └─────────┘  └─────────────┘  └─────────────┘
```

## Prerequisites

- **Docker & Docker Compose** (recommended for production)
- **Python 3.11+** (for development)
- **Node.js 18+** (for frontend)
- **Elasticsearch 8.9+** (real SIEM data source)
- **OpenAI API Key** (for AI features)
- **PostgreSQL 15+** (production database)

## Quick Start with Docker

### 1. Configure Environment

```bash
cd SIEMGPT
cp .env.example .env

# Edit .env with your settings:
# - ELASTICSEARCH_HOST: Your Elasticsearch instance
# - OPENAI_API_KEY: Your OpenAI API key
# - DATABASE_URL: PostgreSQL connection string (for production)
```

### 2. Start Services

```bash
# All-in-one with Docker Compose (includes ES, PostgreSQL, etc.)
docker-compose up -d

# Wait for services to be healthy
docker-compose ps
```

### 3. Run Database Migrations

```bash
docker-compose exec backend alembic upgrade head
```

### 4. Access the Application

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:8000
- **Elasticsearch**: http://localhost:9200 (elastic/changeme)
- **Kibana**: http://localhost:5601 (optional - for SIEM visualization)
- **API Docs**: http://localhost:8000/docs

## Development Setup

### Backend

```bash
cd SIEMGPT/backend

# Create virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Create .env from .env.example
cp ../.env.example ../.env
# Edit .env with your Elasticsearch and OpenAI keys

# Run migrations
alembic upgrade head

# Start development server
python -m uvicorn app.main:app --reload --host 127.0.0.1 --port 8000
```

### Frontend

```bash
cd SIEMGPT/frontend

# Install dependencies
npm install

# Create .env
cp ../.env.example .env
# Ensure VITE_API_URL=/api/v1

# Start dev server
npm run dev
```

## Configuration

### Essential Environment Variables

```env
# Database (PostgreSQL recommended for production)
DATABASE_URL=postgresql://user:pass@localhost:5432/siemgpt

# Elasticsearch (your real SIEM system)
ELASTICSEARCH_HOST=http://your-es-instance:9200
ELASTICSEARCH_USER=elastic
ELASTICSEARCH_PASSWORD=your-password

# OpenAI (for AI features)
OPENAI_API_KEY=sk-...

# Security
SECRET_KEY=generate-a-long-random-string

# Optional: Threat Intelligence APIs
ABUSEIPDB_API_KEY=
VIRUSTOTAL_API_KEY=
```

### Application Settings

```env
LOG_LEVEL=INFO          # DEBUG, INFO, WARNING, ERROR
DEBUG=false            # Set to true only for development
OPENAI_MODEL=gpt-4     # or gpt-3.5-turbo for cost reduction
```

## Real-World Data Integration

### 1. Elasticsearch SIEM Connection

The system expects Elasticsearch indices with security events. Create sample indices:

```bash
# Example: Create a security logs index
curl -X PUT "localhost:9200/security-logs-2026.05.23" \
  -H 'Content-Type: application/json' \
  -d '{
    "mappings": {
      "properties": {
        "@timestamp": {"type": "date"},
        "event": {
          "properties": {
            "action": {"type": "keyword"},
            "category": {"type": "keyword"},
            "outcome": {"type": "keyword"}
          }
        },
        "source": {
          "properties": {
            "ip": {"type": "ip"},
            "user": {"type": "keyword"}
          }
        },
        "destination": {
          "properties": {
            "ip": {"type": "ip"},
            "port": {"type": "long"}
          }
        },
        "user": {
          "properties": {
            "name": {"type": "keyword"},
            "domain": {"type": "keyword"}
          }
        },
        "severity": {"type": "keyword"},
        "message": {"type": "text"}
      }
    }
  }'
```

### 2. OpenAI Integration

The system uses GPT-4 for:
- **Threat Analysis**: Analyze security events and incidents
- **Natural Language Queries**: Convert questions to Elasticsearch queries
- **Report Generation**: Create professional security reports

### 3. Authentication

- **Default role**: `user` (analyst access)
- **Admin role**: Full system access
- **Token-based auth**: JWT tokens with configurable expiration

## API Documentation

Auto-generated API docs available at: **http://localhost:8000/docs**

### Key Endpoints

#### Authentication
```
POST   /api/v1/auth/register         - Register new user
POST   /api/v1/auth/login/access-token - Login
GET    /api/v1/auth/me               - Get current user
```

#### Dashboard
```
GET    /api/v1/dashboard/summary     - Dashboard statistics
GET    /api/v1/dashboard/timeline    - Attack timeline
GET    /api/v1/dashboard/history     - Investigation history
```

#### Alerts
```
GET    /api/v1/alerts/recent         - Recent alerts
WS     /api/v1/alerts/live           - Live alert stream
```

#### Investigation
```
POST   /api/v1/chat                  - Natural language investigation
GET    /api/v1/reports               - Generated reports
```

## Security Features

### Implemented
- ✅ JWT authentication with refresh tokens
- ✅ Role-based access control (RBAC)
- ✅ Password hashing with bcrypt
- ✅ CORS security headers
- ✅ SQL injection prevention (SQLAlchemy ORM)
- ✅ Rate limiting ready (add with middleware)
- ✅ Comprehensive error handling
- ✅ Request/response validation (Pydantic)

### Recommended for Production
- [ ] Add rate limiting (slowapi)
- [ ] Implement API key authentication
- [ ] Use HTTPS/TLS
- [ ] Set up WAF (Web Application Firewall)
- [ ] Configure SSH key authentication for services
- [ ] Implement request signing for sensitive operations
- [ ] Add audit logging to database
- [ ] Regular security scanning (OWASP ZAP, Trivy)

## Monitoring & Logging

### Logging

All components log to console and file:
```bash
# View backend logs
docker-compose logs -f backend

# View all services
docker-compose logs -f
```

### Health Checks

```bash
# Backend health
curl http://localhost:8000/

# Elasticsearch health
curl http://localhost:9200/_cluster/health

# Database health
curl http://localhost:8000/health/db
```

## Performance Optimization

### Database Indexes
```sql
CREATE INDEX idx_alerts_timestamp ON alerts(@timestamp DESC);
CREATE INDEX idx_alerts_severity ON alerts(severity);
CREATE INDEX idx_conversation_user_id ON conversation_history(user_id);
```

### Elasticsearch Optimization
- Use index templates for time-series data
- Set appropriate shard/replica counts
- Enable query caching for common searches

### Caching Strategy
- Implement Redis for session/threat intelligence caching
- Cache MITRE ATT&CK mappings (updated monthly)
- Cache API responses with appropriate TTL

## Production Deployment

### Using Kubernetes

See `k8s/` directory for manifests:
```bash
kubectl apply -f k8s/
kubectl port-forward svc/siemgpt-backend 8000:8000
```

### Using Systemd (Single Server)

```bash
# Create service file at /etc/systemd/system/siemgpt.service
[Unit]
Description=SIEMGPT Enterprise Backend
After=network.target

[Service]
Type=simple
User=siemgpt
WorkingDirectory=/opt/siemgpt
Environment="DATABASE_URL=postgresql://..."
Environment="OPENAI_API_KEY=..."
ExecStart=/opt/siemgpt/venv/bin/python -m uvicorn app.main:app --host 0.0.0.0 --port 8000

[Install]
WantedBy=multi-user.target
```

## Troubleshooting

### Elasticsearch Connection Issues

```bash
# Check ES is running
curl -u elastic:changeme http://localhost:9200/_cluster/health

# Check network connectivity
docker exec siemgpt-backend curl -v http://elasticsearch:9200/
```

### Database Migration Errors

```bash
# Reset migrations (development only!)
alembic downgrade base
alembic upgrade head
```

### OpenAI API Errors

```bash
# Verify API key
curl https://api.openai.com/v1/models \
  -H "Authorization: Bearer $OPENAI_API_KEY"
```

## Cost Optimization

### OpenAI
- Use `gpt-3.5-turbo` instead of `gpt-4` for cost reduction
- Implement response caching
- Batch queries where possible
- Monitor token usage

### Infrastructure
- Use Elasticsearch warm/cold indices for old data
- Implement data retention policies
- Use PostgreSQL read replicas for high load
- Consider spot instances for non-critical workloads

## Support & Documentation

- **API Docs**: http://localhost:8000/docs (Swagger UI)
- **Elasticsearch**: https://www.elastic.co/guide/
- **OpenAI**: https://platform.openai.com/docs/
- **MITRE ATT&CK**: https://attack.mitre.org/

## License

See LICENSE file in repository

---

**Last Updated**: May 23, 2026
**Version**: 2.0.0 Professional Edition
