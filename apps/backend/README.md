# Chandigarh Events Scraper (FastAPI)

A lightweight FastAPI micro-service that scrapes AllEvents.in to provide a free JSON feed of upcoming events in Chandigarh.

## Quick start (development)

```bash
cd backend
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
uvicorn main:app --reload --port 8000
```

Then query: `http://localhost:8000/events`

## Notes
* Results are cached in-memory for 30 minutes to avoid hammering the source site.
* CORS is wide-open for convenience; restrict `allow_origins` in production.
* No third-party APIs nor keys required.

## Deploying
This is a standard ASGI app – you can host it on any platform that supports Python 3.10+ (Render, Railway, Fly.io, etc.) or containerise it:

```dockerfile
FROM python:3.11-slim
WORKDIR /app
COPY backend/requirements.txt ./
RUN pip install --no-cache-dir -r requirements.txt
COPY backend ./
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
``` 