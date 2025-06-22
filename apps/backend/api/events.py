from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session
from typing import List

from models import get_db, Event
from services.events import EventsService

router = APIRouter(prefix="/events", tags=["events"])

@router.get("/")
async def get_events(db: Session = Depends(get_db)):
    try:
        # First try to get events from external API
        external_events = await EventsService.fetch_events()
        
        # Store external events in database
        for event_data in external_events:
            # Check if event already exists
            existing = db.query(Event).filter(
                Event.title == event_data["title"],
                Event.date == event_data["date"]
            ).first()
            
            if not existing:
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
        
        # Return latest 10 events from database, sorted by date descending
        db_events = db.query(Event).order_by(Event.date.desc()).limit(10).all()
        return [
            {
                "id": event.id,
                "title": event.title,
                "date": event.date,
                "time": event.time,
                "venue": event.venue,
                "category": event.category,
                "description": event.description,
                "image_url": event.image_url,
                "external_url": event.external_url,
            }
            for event in db_events
        ]
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