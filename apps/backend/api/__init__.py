# API package 
from fastapi import APIRouter

from . import materials

router = APIRouter()
router.include_router(materials.router) 