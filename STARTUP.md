# SIEMGPT Dashboard - Startup Guide

## Issues Fixed

The enterprise SOC dashboard was unable to load due to **API route mismatches** between frontend and backend:

### Problem
- Frontend was calling `/api/v1/alerts/recent` but backend had alerts router at `/api/alerts`
- This caused 404 errors when loading dashboard data
- Missing frontend environment configuration

### Solution Applied
1. **Backend (main.py)** - Unified all API routes under `/api/v1/` prefix:
   ```
   ✓ Auth routes: /api/v1/auth
   ✓ Alerts routes: /api/v1/alerts
   ✓ Dashboard routes: /api/v1/dashboard
   ```

2. **Frontend (.env)** - Created environment configuration:
   ```
   VITE_API_URL=/api/v1
   VITE_WS_URL=ws://127.0.0.1:8000/api/v1/alerts/live
   ```

## How to Run

### Terminal 1 - Start Backend Server
```powershell
cd d:\SIEM-GPT\SIEMGPT\backend
python -m uvicorn app.main:app --reload --host 127.0.0.1 --port 8000
```
✓ Backend will start on http://127.0.0.1:8000

### Terminal 2 - Start Frontend Dev Server
```powershell
cd d:\SIEM-GPT\SIEMGPT\frontend
npm install  # if dependencies not installed
npm run dev
```
✓ Frontend will start on http://localhost:5173

### Access the Dashboard
Open your browser to: **http://localhost:5173**

## API Connectivity Flow
1. Frontend (port 5173) makes requests to `/api/v1/dashboard/summary`
2. Vite proxy (vite.config.js) routes `/api/*` → `http://127.0.0.1:8000`
3. Full URL becomes: `http://127.0.0.1:8000/api/v1/dashboard/summary`
4. Backend FastAPI routes handle the request

## Testing Connectivity
- Check browser console (F12) for network errors
- Verify backend is running: http://127.0.0.1:8000/
- Verify CORS headers are present in responses

## If Issues Persist
- Clear browser cache and reload
- Check that both servers show no errors in terminal
- Ensure no other services are using ports 8000 or 5173
- Check network tab in browser DevTools for actual requests/responses
