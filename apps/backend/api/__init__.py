# API package 
from fastapi import APIRouter

from . import events, news

router = APIRouter()
router.include_router(events.router)
router.include_router(news.router) 