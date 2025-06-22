import os
import json
from datetime import datetime, timedelta
from typing import List, Dict, Any

import httpx

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

TICKETMASTER_API_KEY = os.getenv("TICKETMASTER_API_KEY", "")

class EventsService:
    @staticmethod
    async def fetch_events(limit: int = 20) -> List[Dict[str, Any]]:
        """Fetch latest events for Chandigarh using Ticketmaster API."""
        if _CACHE.valid():
            return _CACHE.items[:limit]

        if not TICKETMASTER_API_KEY:
            return []

        url = (
            "https://app.ticketmaster.com/discovery/v2/events.json"
            f"?city=Chandigarh&countryCode=IN&apikey={TICKETMASTER_API_KEY}&size={limit}"
        )

        try:
            async with httpx.AsyncClient() as client:
                response = await client.get(url)
                response.raise_for_status()
                data = response.json()

                events = []
                for event in data.get("_embedded", {}).get("events", []):
                    events.append({
                        "title": event.get("name", ""),
                        "date": event.get("dates", {}).get("start", {}).get("localDate", ""),
                        "time": event.get("dates", {}).get("start", {}).get("localTime", ""),
                        "venue": event.get("_embedded", {}).get("venues", [{}])[0].get("name", "TBD"),
                        "category": event.get("classifications", [{}])[0].get("segment", {}).get("name", ""),
                        "description": f"Event in Chandigarh",
                        "image": event.get("images", [{}])[0].get("url", ""),
                        "url": event.get("url", "")
                    })

                _CACHE.set(events)
                return events[:limit]

        except Exception as e:
            print(f"Error fetching events: {e}")
            return []

# Backward compatibility
async def fetch_events(limit: int = 20) -> List[Dict[str, Any]]:
    return await EventsService.fetch_events(limit) 