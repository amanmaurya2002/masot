from datetime import datetime
from sqlalchemy import Column, Integer, String, DateTime, Text, DECIMAL, ARRAY
from sqlalchemy.sql import func
from .database import Base


class MaterialsNews(Base):
    __tablename__ = "materials_news"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(500), nullable=False)
    summary = Column(Text, nullable=False)
    content = Column(Text, nullable=False)
    source = Column(String(100), nullable=False)
    published_at = Column(DateTime, nullable=False)
    image_url = Column(String(500), nullable=True)
    url = Column(String(500), nullable=False)
    category = Column(String(50), nullable=False)  # research, industry, breakthrough, conference, publication
    tags = Column(ARRAY(String), nullable=True)
    created_at = Column(DateTime, default=func.now())
    updated_at = Column(DateTime, default=func.now(), onupdate=func.now())


class ResearchPaper(Base):
    __tablename__ = "research_papers"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(500), nullable=False)
    authors = Column(ARRAY(String), nullable=False)
    abstract = Column(Text, nullable=False)
    journal = Column(String(200), nullable=False)
    published_at = Column(DateTime, nullable=False)
    doi = Column(String(100), unique=True, nullable=True)
    arxiv_id = Column(String(50), unique=True, nullable=True)
    impact_factor = Column(DECIMAL(5, 3), nullable=True)
    keywords = Column(ARRAY(String), nullable=True)
    materials_focus = Column(ARRAY(String), nullable=True)
    pdf_url = Column(String(500), nullable=True)
    created_at = Column(DateTime, default=func.now())
    updated_at = Column(DateTime, default=func.now(), onupdate=func.now()) 