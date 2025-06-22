import os
import json
from datetime import datetime, timedelta
from typing import List, Dict, Any

import httpx
from sqlalchemy.orm import Session
from models import Event

CACHE_TTL = timedelta(minutes=20)

class _Cache:
    def __init__(self):
        self.items: List[Dict[str, Any]] = []
        self.expires: datetime = datetime.min

    def valid(self) -> bool:
        return datetime.utcnow() < self.expires

    def set(self, data: List[Dict[str, Any]]):
        self.items = data
        self.expires = datetime.utcnow() + CACHE_TTL

_CACHE = _Cache()

TICKETMASTER_API_KEY = os.getenv("TICKETMASTER_API_KEY")
TICKETMASTER_API_URL = "https://app.ticketmaster.com/discovery/v2/events.json"

class EventsService:
    @staticmethod
    async def fetch_events_from_api():
        """Fetches upcoming events in Chandigarh from the Ticketmaster API."""
        if not TICKETMASTER_API_KEY:
            return []

        params = {
            "apikey": TICKETMASTER_API_KEY,
            "city": "Chandigarh",
            "size": 10,
        }
        async with httpx.AsyncClient() as client:
            response = await client.get(TICKETMASTER_API_URL, params=params)
            response.raise_for_status()
            return response.json().get("_embedded", {}).get("events", [])

    @staticmethod
    def get_events_from_db(db: Session, limit: int = 10):
        """Retrieves the latest events from the database."""
        return db.query(Event).order_by(Event.date.desc()).limit(limit).all()

    @staticmethod
    def save_events_to_db(db: Session, events_data: list):
        """Saves a list of events to the database, avoiding duplicates."""
        for event_data in events_data:
            existing = db.query(Event).filter(Event.external_url == event_data.get("url")).first()
            if not existing:
                event = Event(
                    title=event_data["name"],
                    date=event_data["dates"]["start"]["localDate"],
                    time=event_data["dates"]["start"].get("localTime"),
                    venue=event_data.get("_embedded", {}).get("venues", [{}])[0].get("name"),
                    image_url=event_data.get("images", [{}])[0].get("url"),
                    external_url=event_data.get("url"),
                )
                db.add(event)
        db.commit()

# Backward compatibility
async def fetch_events(limit: int = 20) -> List[Dict[str, Any]]:
    return await EventsService.fetch_events(limit) 