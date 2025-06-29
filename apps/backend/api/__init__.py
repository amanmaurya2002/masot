# API package 
from fastapi import APIRouter

from . import events, news, materials

router = APIRouter()
router.include_router(events.router)
router.include_router(news.router)
router.include_router(materials.router) 