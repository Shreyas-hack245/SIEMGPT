# SIEMGPT Enterprise 2.0

**AI-Powered Conversational SIEM Platform for Intelligent Threat Detection and Automated Reporting**

[![License](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Python](https://img.shields.io/badge/Python-3.11+-green.svg)](https://www.python.org/)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.101+-darkgreen.svg)](https://fastapi.tiangolo.com/)
[![Node.js](https://img.shields.io/badge/Node.js-18+-blue.svg)](https://nodejs.org/)

## 🚀 Overview

SIEMGPT is a production-grade conversational SIEM platform that transforms security investigations through:

- **AI-Powered Analysis**: GPT-4 integration for intelligent threat analysis and report generation
- **Natural Language Queries**: Ask questions in plain English, get Elasticsearch results
- **Real-Time Monitoring**: Live alert streams and conversation-based investigations
- **Enterprise Security**: Role-based access control, audit trails, and persistent history
- **Cloud-Ready**: Docker containerization and Kubernetes-ready

### Key Capabilities

| Feature | Capability |
|---------|-----------|
| **Data Integration** | Real Elasticsearch SIEM data, multi-index support |
| **Intelligence** | GPT-4 powered threat analysis and report generation |
| **Scalability** | Stateless API, database-backed persistence, horizontal scaling |
| **Security** | JWT auth, RBAC, password hashing, audit logging |
| **Deployment** | Docker Compose, Kubernetes, cloud platforms |

## 📋 Prerequisites

- **Docker & Docker Compose** (recommended)
- **Python 3.11+** or **Node.js 18+** (for development)
- **Elasticsearch 8.9+** (real SIEM system)
- **OpenAI API Key** (for AI features)
- **PostgreSQL 15+** (production database)

## 🏃 Quick Start

### Option 1: Docker Compose (Recommended)

```bash
# Clone the repository
git clone https://github.com/your-org/siemgpt.git
cd SIEMGPT

# Configure environment
cp .env.example .env
# Edit .env with your Elasticsearch host and OpenAI API key

# Start all services
docker-compose up -d

# Services are now available:
# Frontend:      http://localhost:5173
# Backend API:   http://localhost:8000
# API Docs:      http://localhost:8000/docs
# Kibana:        http://localhost:5601
```

### Option 2: Local Development

```bash
# Backend
cd SIEMGPT/backend
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
python -m uvicorn app.main:app --reload

# Frontend (in another terminal)
cd SIEMGPT/frontend
npm install
npm run dev
```

## 🔧 Configuration

### Essential Environment Variables

Create `.env` from `.env.example`:

```env
# Database
DATABASE_URL=postgresql://user:pass@localhost:5432/siemgpt

# Elasticsearch (your SIEM system)
ELASTICSEARCH_HOST=http://your-es.example.com:9200
ELASTICSEARCH_USER=elastic
ELASTICSEARCH_PASSWORD=your-password

# OpenAI (for AI features)
OPENAI_API_KEY=sk-...

# Security
SECRET_KEY=generate-strong-random-string
DEBUG=false
```

See [.env.example](.env.example) for all available options.

## 🏗️ Architecture

```
┌─────────────────────────────────────┐
│     Frontend (React + Vite)          │
│     http://localhost:5173            │
└────────────┬────────────────────────┘
             │
┌────────────▼────────────────────────┐
│    Backend API (FastAPI)             │
│    http://localhost:8000             │
│  • Authentication                    │
│  • Dashboard & Alerts                │
│  • Investigation Engine              │
│  • AI Analysis                       │
└───┬──────────────┬──────────────┬───┘
    │              │              │
    │              │              │
┌───▼──┐  ┌───────▼────┐  ┌──────▼──────┐
│ PostgreSQL  │ Elasticsearch  │   OpenAI   │
│  (Users,    │  (Security     │  (GPT-4)   │
│ Conversations) Logs)        │            │
└────────┘  └────────────┘  └────────────┘
```

## 📚 Documentation

- **[DEPLOYMENT.md](DEPLOYMENT.md)** - Complete deployment guide with Kubernetes, systemd, etc.
- **[IMPLEMENTATION_SUMMARY.md](IMPLEMENTATION_SUMMARY.md)** - What changed from dummy to professional
- **[API Docs](http://localhost:8000/docs)** - Interactive Swagger documentation (after starting server)

## 🔑 Core Features

### 1. Conversational Investigation
Ask natural language questions about security events:
```
"Show me all failed logins from external IPs in the last 24 hours"
"What malware was detected this week?"
"Analyze suspicious VPN activities"
```

### 2. AI-Powered Analysis
- Automatic threat assessment
- MITRE ATT&CK technique mapping
- Incident timeline generation
- Professional report generation

### 3. Real-Time Monitoring
- Live alert streams via WebSocket
- Configurable alert rules
- Multi-severity tracking
- Investigation history

### 4. Enterprise Security
- Role-based access control (Admin, Analyst, User)
- Persistent conversation history with audit trail
- User authentication with JWT tokens
- Input validation and SQL injection prevention

### 5. Integration
- **Elasticsearch**: Real SIEM logs and alerts
- **OpenAI**: GPT-4 for intelligent analysis
- **Threat Intelligence**: VirusTotal, AbuseIPDB support
- **MITRE ATT&CK**: Automated framework mapping

## 🚀 API Endpoints

Auto-generated docs at `http://localhost:8000/docs`

### Authentication
```
POST   /api/v1/auth/register              Register new user
POST   /api/v1/auth/login/access-token    Login
GET    /api/v1/auth/me                    Current user info
```

### Dashboard
```
GET    /api/v1/dashboard/summary          Statistics
GET    /api/v1/dashboard/timeline         Attack timeline
GET    /api/v1/dashboard/history          Investigation history
```

### Alerts
```
GET    /api/v1/alerts/recent              Recent alerts
WS     /api/v1/alerts/live                Live stream
```

### Investigation
```
POST   /api/v1/chat                       Natural language query
GET    /api/v1/reports                    Generated reports
POST   /api/v1/reports/pdf                Export as PDF
```

## 🔒 Security

### Implemented
- ✅ JWT authentication with refresh tokens
- ✅ Password hashing with bcrypt
- ✅ Role-based access control (RBAC)
- ✅ CORS security headers
- ✅ SQL injection prevention (ORM)
- ✅ Input validation (Pydantic v2)
- ✅ Audit logging
- ✅ Error handling

### Recommended for Production
- Set up HTTPS/TLS
- Configure firewall rules
- Enable WAF (Web Application Firewall)
- Regular security scanning
- Implement rate limiting
- Set up SSH key authentication
- Regular dependency updates

## 📈 Performance

Expected baseline performance:
- Dashboard load: **< 500ms**
- Alert search (100 events): **< 2 seconds**
- AI analysis: **2-5 seconds** (depends on complexity)
- Conversation history: **< 100ms**

## 🐛 Troubleshooting

### Elasticsearch Connection Issues
```bash
# Check Elasticsearch is running
curl -u elastic:changeme http://localhost:9200/_cluster/health

# From backend container
docker exec siemgpt-backend curl http://elasticsearch:9200/
```

### Database Migration Errors
```bash
# Reset migrations (dev only!)
docker-compose exec backend alembic downgrade base
docker-compose exec backend alembic upgrade head
```

### OpenAI API Errors
```bash
# Verify API key and quota
curl -H "Authorization: Bearer $OPENAI_API_KEY" \
  https://api.openai.com/v1/models
```

See [DEPLOYMENT.md](DEPLOYMENT.md#troubleshooting) for more solutions.

## 💰 Cost Optimization

- Use `gpt-3.5-turbo` instead of `gpt-4` for 90% cost reduction
- Implement response caching
- Use Elasticsearch warm/cold indices for old data
- Monitor token usage per user/query
- Batch operations where possible

## 🤝 Contributing

Contributions are welcome! Please:
1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🔗 Resources

- **Elasticsearch**: [docs.elastic.co](https://www.elastic.co/guide/)
- **OpenAI**: [platform.openai.com/docs](https://platform.openai.com/docs/)
- **FastAPI**: [fastapi.tiangolo.com](https://fastapi.tiangolo.com/)
- **React**: [react.dev](https://react.dev/)
- **MITRE ATT&CK**: [attack.mitre.org](https://attack.mitre.org/)

## 📞 Support

For issues and questions:
- GitHub Issues: [github.com/your-org/siemgpt/issues](https://github.com/your-org/siemgpt/issues)
- Documentation: [DEPLOYMENT.md](DEPLOYMENT.md)
- API Docs: http://localhost:8000/docs (after starting)

---

**Version**: 2.0.0 Professional Edition  
**Last Updated**: May 23, 2026  
**Status**: Production Ready ✅

### Backend Setup

```bash
cd backend

python -m venv venv

venv\Scripts\activate

pip install fastapi uvicorn openai python-dotenv elasticsearch

uvicorn app.main:app --reload