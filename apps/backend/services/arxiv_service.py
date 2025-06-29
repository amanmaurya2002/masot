import arxiv
from datetime import datetime, timedelta
from typing import List, Dict, Any
import re


class ArxivService:
    def __init__(self):
        self.materials_keywords = [
            "materials science",
            "nanomaterials",
            "graphene",
            "carbon nanotubes",
            "quantum dots",
            "perovskite",
            "metal organic frameworks",
            "MOF",
            "2D materials",
            "composite materials",
            "polymer",
            "ceramic",
            "metallic",
            "semiconductor",
            "superconductor",
            "catalyst",
            "battery materials",
            "solar cell materials",
            "biomaterials",
            "smart materials"
        ]

    def build_search_query(self, days_back: int = 30) -> str:
        """Build a comprehensive search query for materials science papers"""
        # Base query for materials science
        base_query = " OR ".join([f'"{keyword}"' for keyword in self.materials_keywords])
        
        # Add innovation-related terms
        innovation_terms = [
            "breakthrough",
            "novel",
            "innovative",
            "new material",
            "discovery",
            "advancement",
            "improvement",
            "enhanced",
            "superior",
            "revolutionary"
        ]
        
        innovation_query = " OR ".join([f'"{term}"' for term in innovation_terms])
        
        # Combine queries
        full_query = f"({base_query}) AND ({innovation_query})"
        
        return full_query

    def fetch_materials_papers(self, max_results: int = 50, days_back: int = 30) -> List[Dict[str, Any]]:
        """Fetch materials science papers from ArXiv"""
        try:
            # Build search query
            query = self.build_search_query(days_back)
            
            # Search ArXiv
            search = arxiv.Search(
                query=query,
                max_results=max_results,
                sort_by=arxiv.SortCriterion.SubmittedDate,
                sort_order=arxiv.SortOrder.Descending
            )
            
            papers = []
            for result in search.results():
                # Extract authors
                authors = [author.name for author in result.authors]
                
                # Extract keywords from summary
                keywords = self.extract_keywords(result.summary)
                
                # Determine materials focus
                materials_focus = self.identify_materials_focus(result.summary)
                
                # Create paper object
                paper = {
                    "title": result.title,
                    "authors": authors,
                    "abstract": result.summary,
                    "journal": "ArXiv",
                    "published_at": result.published,
                    "arxiv_id": result.entry_id.split('/')[-1],
                    "doi": self.extract_doi(result.summary),
                    "keywords": keywords,
                    "materials_focus": materials_focus,
                    "pdf_url": result.pdf_url,
                    "url": result.entry_id
                }
                
                papers.append(paper)
            
            return papers
            
        except Exception as e:
            print(f"Error fetching papers from ArXiv: {e}")
            return []

    def extract_keywords(self, text: str) -> List[str]:
        """Extract potential keywords from text"""
        # Common materials science terms
        keywords = []
        
        # Look for technical terms
        technical_terms = [
            "nanoparticle", "nanostructure", "nanocomposite", "nanotechnology",
            "quantum", "electronic", "optical", "magnetic", "thermal",
            "mechanical", "electrochemical", "photovoltaic", "catalytic",
            "synthesis", "characterization", "fabrication", "processing"
        ]
        
        for term in technical_terms:
            if term.lower() in text.lower():
                keywords.append(term)
        
        return keywords[:10]  # Limit to 10 keywords

    def identify_materials_focus(self, text: str) -> List[str]:
        """Identify the main materials focus from text"""
        materials_categories = {
            "metals": ["metal", "alloy", "steel", "aluminum", "copper", "titanium"],
            "ceramics": ["ceramic", "oxide", "nitride", "carbide"],
            "polymers": ["polymer", "plastic", "resin", "composite"],
            "nanomaterials": ["nanoparticle", "nanotube", "nanowire", "quantum dot"],
            "2D materials": ["graphene", "molybdenum disulfide", "boron nitride"],
            "biomaterials": ["biomaterial", "biocompatible", "tissue engineering"],
            "energy materials": ["battery", "solar cell", "fuel cell", "supercapacitor"],
            "electronic materials": ["semiconductor", "conductor", "insulator"]
        }
        
        focus_areas = []
        text_lower = text.lower()
        
        for category, terms in materials_categories.items():
            for term in terms:
                if term in text_lower:
                    focus_areas.append(category)
                    break
        
        return list(set(focus_areas))  # Remove duplicates

    def extract_doi(self, text: str) -> str:
        """Extract DOI from text if present"""
        doi_pattern = r'10\.\d{4,}/[-._;()/:\w]+'
        match = re.search(doi_pattern, text)
        return match.group() if match else None

    def get_recent_papers(self, days: int = 7) -> List[Dict[str, Any]]:
        """Get papers from the last N days"""
        return self.fetch_materials_papers(max_results=20, days_back=days)

    def search_by_topic(self, topic: str, max_results: int = 20) -> List[Dict[str, Any]]:
        """Search for papers on a specific topic"""
        try:
            search = arxiv.Search(
                query=f'"{topic}" AND materials',
                max_results=max_results,
                sort_by=arxiv.SortCriterion.SubmittedDate
            )
            
            papers = []
            for result in search.results():
                authors = [author.name for author in result.authors]
                
                paper = {
                    "title": result.title,
                    "authors": authors,
                    "abstract": result.summary,
                    "journal": "ArXiv",
                    "published_at": result.published,
                    "arxiv_id": result.entry_id.split('/')[-1],
                    "doi": self.extract_doi(result.summary),
                    "keywords": self.extract_keywords(result.summary),
                    "materials_focus": self.identify_materials_focus(result.summary),
                    "pdf_url": result.pdf_url,
                    "url": result.entry_id
                }
                
                papers.append(paper)
            
            return papers
            
        except Exception as e:
            print(f"Error searching for topic '{topic}': {e}")
            return [] 