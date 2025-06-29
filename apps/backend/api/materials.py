from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from datetime import datetime, timedelta

from models.database import get_db
from models.materials import MaterialsNews, ResearchPaper
from services.arxiv_service import ArxivService
from services.multi_source_service import MultiSourceService

router = APIRouter(prefix="/api", tags=["materials"])

# Initialize services
arxiv_service = ArxivService()
multi_source_service = MultiSourceService()


@router.get("/papers")
async def get_papers(
    page: int = Query(1, ge=1),
    limit: int = Query(10, ge=1, le=100),
    journal: Optional[str] = None,
    materials_focus: Optional[str] = None,
    db: Session = Depends(get_db)
):
    """Get research papers with pagination and filtering"""
    try:
        # Calculate offset
        offset = (page - 1) * limit
        
        # Build query
        query = db.query(ResearchPaper)
        
        # Apply filters
        if journal:
            query = query.filter(ResearchPaper.journal.ilike(f"%{journal}%"))
        
        if materials_focus:
            query = query.filter(ResearchPaper.materials_focus.contains([materials_focus]))
        
        # Get total count
        total = query.count()
        
        # Get paginated results
        papers = query.order_by(ResearchPaper.published_at.desc()).offset(offset).limit(limit).all()
        
        return {
            "papers": papers,
            "total": total,
            "page": page,
            "limit": limit,
            "pages": (total + limit - 1) // limit
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching papers: {str(e)}")


@router.get("/papers/recent")
async def get_recent_papers(
    days: int = Query(7, ge=1, le=365),
    db: Session = Depends(get_db)
):
    """Get recent papers from the last N days"""
    try:
        cutoff_date = datetime.utcnow() - timedelta(days=days)
        
        papers = db.query(ResearchPaper)\
            .filter(ResearchPaper.published_at >= cutoff_date)\
            .order_by(ResearchPaper.published_at.desc())\
            .limit(20)\
            .all()
        
        return {"papers": papers, "days": days}
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching recent papers: {str(e)}")


@router.get("/papers/search")
async def search_papers(
    q: str = Query(..., min_length=2),
    max_results: int = Query(20, ge=1, le=100),
    db: Session = Depends(get_db)
):
    """Search papers by title, abstract, or keywords"""
    try:
        search_term = f"%{q}%"
        
        papers = db.query(ResearchPaper)\
            .filter(
                (ResearchPaper.title.ilike(search_term)) |
                (ResearchPaper.abstract.ilike(search_term)) |
                (ResearchPaper.keywords.any(lambda x: x.ilike(search_term)))
            )\
            .order_by(ResearchPaper.published_at.desc())\
            .limit(max_results)\
            .all()
        
        return {"papers": papers, "query": q, "count": len(papers)}
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error searching papers: {str(e)}")


@router.get("/papers/arxiv/fetch")
async def fetch_arxiv_papers(
    max_results: int = Query(20, ge=1, le=100),
    days_back: int = Query(30, ge=1, le=365)
):
    """Fetch latest materials science papers from ArXiv"""
    try:
        papers = arxiv_service.fetch_materials_papers(max_results=max_results, days_back=days_back)
        
        return {
            "papers": papers,
            "count": len(papers),
            "source": "ArXiv",
            "days_back": days_back
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching from ArXiv: {str(e)}")


@router.get("/papers/arxiv/topic/{topic}")
async def search_arxiv_by_topic(
    topic: str,
    max_results: int = Query(20, ge=1, le=100)
):
    """Search ArXiv for papers on a specific topic"""
    try:
        papers = arxiv_service.search_by_topic(topic, max_results=max_results)
        
        return {
            "papers": papers,
            "topic": topic,
            "count": len(papers),
            "source": "ArXiv"
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error searching ArXiv: {str(e)}")


@router.get("/papers/pubmed")
async def fetch_pubmed_papers(
    query: str = Query("materials science", description="Search query"),
    max_results: int = Query(20, ge=1, le=100)
):
    """Fetch materials science papers from PubMed Central"""
    try:
        papers = await multi_source_service.fetch_from_pubmed_central(query, max_results)
        
        return {
            "papers": papers,
            "count": len(papers),
            "source": "PubMed Central",
            "query": query
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching from PubMed Central: {str(e)}")


@router.get("/papers/doaj")
async def fetch_doaj_papers(
    query: str = Query("materials science", description="Search query"),
    max_results: int = Query(20, ge=1, le=100)
):
    """Fetch materials science papers from Directory of Open Access Journals"""
    try:
        papers = await multi_source_service.fetch_from_doaj(query, max_results)
        
        return {
            "papers": papers,
            "count": len(papers),
            "source": "DOAJ",
            "query": query
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching from DOAJ: {str(e)}")


@router.get("/papers/all-sources")
async def fetch_all_sources(
    query: str = Query("materials science", description="Search query"),
    max_results: int = Query(10, ge=1, le=50)
):
    """Fetch papers from all available sources"""
    try:
        results = await multi_source_service.fetch_all_sources(query, max_results)
        
        # Combine all papers
        all_papers = []
        for source, papers in results.items():
            for paper in papers:
                paper["source"] = source.replace("_", " ").title()
                all_papers.append(paper)
        
        # Sort by published date (newest first)
        all_papers.sort(key=lambda x: x.get("published_at", ""), reverse=True)
        
        return {
            "papers": all_papers,
            "count": len(all_papers),
            "sources": list(results.keys()),
            "query": query,
            "source_counts": {source: len(papers) for source, papers in results.items()}
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching from all sources: {str(e)}")


@router.get("/news")
async def get_news(
    page: int = Query(1, ge=1),
    limit: int = Query(10, ge=1, le=100),
    category: Optional[str] = None,
    db: Session = Depends(get_db)
):
    """Get materials science news with pagination and filtering"""
    try:
        offset = (page - 1) * limit
        
        query = db.query(MaterialsNews)
        
        if category:
            query = query.filter(MaterialsNews.category == category)
        
        total = query.count()
        news = query.order_by(MaterialsNews.published_at.desc()).offset(offset).limit(limit).all()
        
        return {
            "news": news,
            "total": total,
            "page": page,
            "limit": limit,
            "pages": (total + limit - 1) // limit
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching news: {str(e)}")


@router.get("/stats/papers")
async def get_paper_stats(db: Session = Depends(get_db)):
    """Get statistics about research papers"""
    try:
        total_papers = db.query(ResearchPaper).count()
        
        # Papers by journal
        journals = db.query(ResearchPaper.journal, db.func.count(ResearchPaper.id))\
            .group_by(ResearchPaper.journal)\
            .order_by(db.func.count(ResearchPaper.id).desc())\
            .limit(10)\
            .all()
        
        # Papers by materials focus
        materials_stats = {}
        papers = db.query(ResearchPaper.materials_focus).all()
        for paper in papers:
            if paper[0]:  # materials_focus is not None
                for material in paper[0]:
                    materials_stats[material] = materials_stats.get(material, 0) + 1
        
        return {
            "total_papers": total_papers,
            "top_journals": [{"journal": j[0], "count": j[1]} for j in journals],
            "materials_distribution": materials_stats
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching stats: {str(e)}")


@router.get("/stats/news")
async def get_news_stats(db: Session = Depends(get_db)):
    """Get statistics about materials science news"""
    try:
        total_news = db.query(MaterialsNews).count()
        
        # News by category
        categories = db.query(MaterialsNews.category, db.func.count(MaterialsNews.id))\
            .group_by(MaterialsNews.category)\
            .all()
        
        # News by source
        sources = db.query(MaterialsNews.source, db.func.count(MaterialsNews.id))\
            .group_by(MaterialsNews.source)\
            .order_by(db.func.count(MaterialsNews.id).desc())\
            .limit(10)\
            .all()
        
        return {
            "total_news": total_news,
            "categories": [{"category": c[0], "count": c[1]} for c in categories],
            "top_sources": [{"source": s[0], "count": s[1]} for s in sources]
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching news stats: {str(e)}") 