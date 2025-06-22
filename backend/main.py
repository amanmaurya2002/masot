from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware

from scraper import fetch_events

app = FastAPI(title="Chandigarh Events Scraper API")

# Allow the Next.js frontend to call this API locally (adjust origins as needed)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # in production specify exact origins
    allow_credentials=True,
    allow_methods=["GET"],
    allow_headers=["*"]
)

@app.get("/events")
async def events():
    try:
        data = await fetch_events()
        return data
    except Exception as exc:
        raise HTTPException(status_code=500, detail=str(exc)) 