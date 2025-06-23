from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from models import get_db, News
from services.news import NewsService

router = APIRouter(prefix="/news", tags=["news"])

@router.get("/")
async def get_news(db: Session = Depends(get_db)):
    """
    Fetches the latest news about Chandigarh.

    It first tries to get fresh news from an external API, stores them
    in the database, and then returns the latest articles from the database.
    """
    try:
        # 1. Fetch fresh news from the external API
        external_news = await NewsService.fetch_news_from_api()

        # 2. Save the new articles to the database
        if external_news:
            NewsService.save_news_to_db(db, external_news)

        # 3. Retrieve and return the latest news from the database
        db_news = NewsService.get_news_from_db(db, limit=10)
        
        return db_news

    except HTTPException:
        # Re-raise HTTPException directly if it's already one
        # This preserves the status code and detail from the service layer
        raise
    except Exception as e:
        # For any other unexpected errors, return a 500 server error
        # Log the exception for debugging purposes (optional, but good practice)
        # import logging
        # logging.exception("Unexpected error in get_news endpoint")
        raise HTTPException(status_code=500, detail=f"An unexpected error occurred: {str(e)}")
