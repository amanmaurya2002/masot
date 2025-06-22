from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from .models import create_tables
from .api import events, news

app = FastAPI(title="MASOT API", version="1.0.0")

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Create tables on startup
@app.on_event("startup")
async def startup_event():
    create_tables()

# Include routers
app.include_router(events.router)
app.include_router(news.router)

@app.get("/")
async def root():
    return {"message": "MASOT API is running!"} 