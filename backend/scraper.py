import asyncio
from datetime import datetime, timedelta
from typing import List, Dict, Any

import httpx
from bs4 import BeautifulSoup

CACHE_TTL = timedelta(minutes=30)

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

HEADERS = {
    "User-Agent": "Mozilla/5.0 (compatible; EventsBot/1.0; +https://example.com/bot)"
}

async def fetch_events(limit: int = 20) -> List[Dict[str, Any]]:
    """Scrapes AllEvents.in Chandigarh page for upcoming events."""
    if _CACHE.valid():
        return _CACHE.items[:limit]

    url = "https://allevents.in/chandigarh/all"
    async with httpx.AsyncClient(timeout=30, headers=HEADERS) as client:
        resp = await client.get(url)
        resp.raise_for_status()

    soup = BeautifulSoup(resp.text, "lxml")

    events: List[Dict[str, Any]] = []

    # Most event cards embed JSON-LD inside a <script type="application/ld+json"> tag
    for script in soup.select("script[type='application/ld+json']"):
        try:
            import json
            data = json.loads(script.string or "{}")
            if isinstance(data, dict) and data.get("@type") == "Event":
                events.append(_normalise(data))
            elif isinstance(data, list):
                events.extend(_normalise(obj) for obj in data if obj.get("@type") == "Event")
        except Exception:
            # Skip malformed entries
            continue

    # Fallback simple parsing if JSON-LD missing
    if not events:
        for card in soup.select("div.event-card"):
            title = card.select_one(".event-card-title")
            date = card.select_one(".event-card-date")
            if not title:
                continue
            events.append({
                "id": card.get("data-event-id") or title.text.strip(),
                "title": title.text.strip(),
                "date": (date or {}).get_text(strip=True),
                "time": "",
                "venue": "",
                "description": "",
                "category": "",
                "price": "",
            })

    events = events[:limit]
    _CACHE.set(events)
    return events

def _normalise(obj: dict) -> Dict[str, Any]:
    return {
        "id": obj.get("@id") or obj.get("url") or obj.get("name"),
        "title": obj.get("name", ""),
        "date": obj.get("startDate", "").split("T")[0],
        "time": obj.get("startDate", "").split("T")[1][:5] if "T" in obj.get("startDate", "") else "",
        "venue": (obj.get("location") or {}).get("name", "") if isinstance(obj.get("location"), dict) else "",
        "description": obj.get("description", ""),
        "category": obj.get("eventStatus", ""),
        "price": "",
    } 