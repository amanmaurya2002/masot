import os
import json
from datetime import datetime, timedelta
from typing import List, Dict, Any

import httpx
from fastapi import HTTPException
from sqlalchemy.orm import Session
from models import News

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

NEWS_API_KEY = os.getenv("NEWS_API_KEY")
NEWS_API_URL = "https://newsapi.org/v2/top-headlines"

class NewsService:
    @staticmethod
    async def fetch_news_from_api():
        """Fetches latest news about Chandigarh from the NewsAPI."""
        if not NEWS_API_KEY:
            print("NEWS_API_KEY is not configured. News feature will not work.") # Added for easier debugging
            raise HTTPException(status_code=503, detail="NEWS_API_KEY is not configured. Please contact administrator.")

        params = {"q": "Chandigarh", "apiKey": NEWS_API_KEY, "pageSize": 10}
        try:
            async with httpx.AsyncClient() as client:
                response = await client.get(NEWS_API_URL, params=params)
                response.raise_for_status()  # Raises HTTPStatusError for 4xx/5xx responses
                return response.json().get("articles", [])
        except httpx.HTTPStatusError as exc:
            # Forward the error from NewsAPI
            error_detail = f"Error fetching news from external API: {exc.response.status_code} - {exc.response.text}"
            if exc.response.status_code == 401: # Unauthorized - likely invalid API key
                error_detail = "Error fetching news: Invalid NEWS_API_KEY."
            elif exc.response.status_code == 429: # Too many requests
                error_detail = "Error fetching news: Rate limit exceeded for the external news API."
            raise HTTPException(status_code=exc.response.status_code, detail=error_detail) from exc
        except httpx.RequestError as exc:
            # For other request errors like network issues
            raise HTTPException(status_code=503, detail=f"Error connecting to external news API: {exc}") from exc


    @staticmethod
    def get_news_from_db(db: Session, limit: int = 10):
        """Retrieves the latest news articles from the database."""
        return db.query(News).order_by(News.published_at.desc()).limit(limit).all()

    @staticmethod
    def save_news_to_db(db: Session, news_articles: list):
        """Saves a list of news articles to the database, avoiding duplicates."""
        for article in news_articles:
            existing = db.query(News).filter(News.url == article["url"]).first()
            if not existing:
                news_item = News(
                    title=article["title"],
                    url=article["url"],
                    source=article.get("source", {}).get("name"),
                    published_at=article["publishedAt"],
                    image_url=article.get("urlToImage"),
                )
                db.add(news_item)
        db.commit()

    @staticmethod
    async def fetch_news(limit: int = 10) -> List[Dict[str, Any]]:
        """Fetch latest news articles about Chandigarh using NewsAPI."""
        if _CACHE.valid():
            return _CACHE.items[:limit]

        if not NEWS_API_KEY:
            return []

        url = (
            "https://newsapi.org/v2/everything"
            f"?q=chandigarh&language=en&sortBy=publishedAt&pageSize={limit}&apiKey={NEWS_API_KEY}"
        )

        try:
            async with httpx.AsyncClient() as client:
                response = await client.get(url)
                response.raise_for_status()
                data = response.json()

                articles = []
                for article in data.get("articles", []):
                    articles.append({
                        "title": article.get("title", ""),
                        "url": article.get("url", ""),
                        "source": article.get("source", {}).get("name", "Unknown"),
                        "publishedAt": article.get("publishedAt", ""),
                        "image": article.get("urlToImage", "")
                    })

                _CACHE.set(articles)
                return articles[:limit]

        except Exception as e:
            print(f"Error fetching news: {e}")
            return []

# Backward compatibility
async def fetch_news(limit: int = 10) -> List[Dict[str, Any]]:
    return await NewsService.fetch_news(limit) 