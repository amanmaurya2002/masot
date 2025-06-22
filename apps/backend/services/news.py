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

NEWS_API_KEY = os.getenv("NEWS_API_KEY", "")

class NewsService:
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