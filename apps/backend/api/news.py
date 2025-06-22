from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from ..models import get_db, News
from ..services.news import NewsService

router = APIRouter(prefix="/news", tags=["news"])

@router.get("/")
async def get_news(db: Session = Depends(get_db)):
    try:
        # First try to get news from external API
        external_news = await NewsService.fetch_news()
        
        # Store external news in database
        for news_data in external_news:
            # Check if news already exists
            existing = db.query(News).filter(
                News.title == news_data["title"],
                News.url == news_data["url"]
            ).first()
            
            if not existing:
                news_item = News(
                    title=news_data["title"],
                    url=news_data["url"],
                    source=news_data["source"],
                    published_at=news_data["publishedAt"],
                    image_url=news_data.get("image")
                )
                db.add(news_item)
        
        db.commit()
        
        # Return all news from database
        db_news = db.query(News).order_by(News.created_at.desc()).limit(10).all()
        return [
            {
                "id": news_item.id,
                "title": news_item.title,
                "url": news_item.url,
                "source": news_item.source,
                "publishedAt": news_item.published_at,
                "image": news_item.image_url
            }
            for news_item in db_news
        ]
    except Exception as exc:
        # Fallback to database-only if external API fails
        db_news = db.query(News).order_by(News.created_at.desc()).limit(10).all()
        return [
            {
                "id": news_item.id,
                "title": news_item.title,
                "url": news_item.url,
                "source": news_item.source,
                "publishedAt": news_item.published_at,
                "image": news_item.image_url
            }
            for news_item in db_news
        ] 
 