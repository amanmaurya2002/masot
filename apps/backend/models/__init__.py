from .database import get_db, create_tables
from .materials import MaterialsNews, ResearchPaper

__all__ = ['MaterialsNews', 'ResearchPaper', 'get_db', 'create_tables'] 