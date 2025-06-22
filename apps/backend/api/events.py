from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session
from typing import List

from models import get_db, Event
from services.events import EventsService

router = APIRouter(prefix="/events", tags=["events"])

@router.get("/")
async def get_events(db: Session = Depends(get_db)):
    """
    Fetches upcoming events in Chandigarh.

    This endpoint first fetches fresh event data from the Ticketmaster API,
    updates the local database, and then returns a list of the latest events.
    """
    try:
        # 1. Fetch fresh events from the external API
        external_events = await EventsService.fetch_events_from_api()

        # 2. Save the new events to the database
        if external_events:
            EventsService.save_events_to_db(db, external_events)

        # 3. Retrieve and return the latest events from the database
        db_events = EventsService.get_events_from_db(db, limit=10)
        
        return db_events

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/")
async def create_event(event_data: dict, db: Session = Depends(get_db)):
    try:
        event = Event(
            title=event_data["title"],
            date=event_data["date"],
            time=event_data["time"],
            venue=event_data["venue"],
            category=event_data.get("category"),
            description=event_data.get("description"),
            image_url=event_data.get("image"),
            external_url=event_data.get("url")
        )
        db.add(event)
        db.commit()
        db.refresh(event)
        
        return {
            "id": event.id,
            "title": event.title,
            "date": event.date,
            "time": event.time,
            "venue": event.venue,
            "category": event.category,
            "description": event.description,
            "image": event.image_url,
            "url": event.external_url
        }
    except Exception as exc:
        raise HTTPException(status_code=500, detail=str(exc))