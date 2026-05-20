# SIEMGPT

AI-Powered Conversational SIEM Assistant for Threat Investigation and Automated Reporting.

---

## Features

- Conversational Threat Investigation
- NLP-based Elasticsearch Query Generation
- Automated Threat Report Generation
- Context-Aware Conversations
- FastAPI Backend
- React + Tailwind Frontend Dashboard
- Swagger API Documentation

---

## Tech Stack

### Backend
- FastAPI
- Python
- Elasticsearch
- OpenAI API

### Frontend
- React
- Tailwind CSS
- Axios
- Vite

---

## Project Structure

SIEMGPT/
│
├── backend/
├── frontend/
├── ai-engine/
├── siem-connector/
├── reports/
├── docs/
├── docker/
└── README.md

---

## Installation

### Backend Setup

```bash
cd backend

python -m venv venv

venv\Scripts\activate

pip install fastapi uvicorn openai python-dotenv elasticsearch

uvicorn app.main:app --reload