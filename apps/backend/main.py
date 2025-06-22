from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from models.database import create_tables
from api import router as api_router

app = FastAPI(title="MaSOT API")

# Create database tables on startup
@app.on_event("startup")
def on_startup():
    create_tables()

# Add CORS middleware to allow cross-origin requests
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include the main API router
app.include_router(api_router)

@app.get("/")
async def root():
    return {"message": "MASOT API is running!"}