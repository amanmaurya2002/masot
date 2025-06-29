import httpx
import asyncio
from datetime import datetime, timedelta
from typing import List, Dict, Any, Optional
import re
from urllib.parse import quote


class MultiSourceService:
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
        
        self.client = httpx.AsyncClient(timeout=30.0)

    async def fetch_from_pubmed_central(self, query: str, max_results: int = 20) -> List[Dict[str, Any]]:
        """Fetch papers from PubMed Central"""
        try:
            # PMC API endpoint
            base_url = "https://eutils.ncbi.nlm.nih.gov/entrez/eutils/"
            
            # Search for papers
            search_url = f"{base_url}esearch.fcgi"
            search_params = {
                "db": "pmc",
                "term": query,
                "retmax": max_results,
                "retmode": "json",
                "sort": "date"
            }
            
            response = await self.client.get(search_url, params=search_params)
            response.raise_for_status()
            
            data = response.json()
            id_list = data.get("esearchresult", {}).get("idlist", [])
            
            if not id_list:
                return []
            
            # Fetch details for each paper
            papers = []
            for pmc_id in id_list[:max_results]:
                paper = await self._fetch_pmc_paper_details(pmc_id)
                if paper:
                    papers.append(paper)
            
            return papers
            
        except Exception as e:
            print(f"Error fetching from PubMed Central: {e}")
            return []

    async def _fetch_pmc_paper_details(self, pmc_id: str) -> Optional[Dict[str, Any]]:
        """Fetch detailed information for a specific PMC paper"""
        try:
            base_url = "https://eutils.ncbi.nlm.nih.gov/entrez/eutils/"
            
            # Fetch summary
            summary_url = f"{base_url}esummary.fcgi"
            summary_params = {
                "db": "pmc",
                "id": pmc_id,
                "retmode": "json"
            }
            
            response = await self.client.get(summary_url, params=summary_params)
            response.raise_for_status()
            
            data = response.json()
            paper_data = data.get("result", {}).get(pmc_id, {})
            
            if not paper_data:
                return None
            
            # Extract authors
            authors = []
            if "authors" in paper_data:
                for author in paper_data["authors"]:
                    if "name" in author:
                        authors.append(author["name"])
            
            # Create paper object
            paper = {
                "title": paper_data.get("title", ""),
                "authors": authors,
                "abstract": paper_data.get("abstract", ""),
                "journal": paper_data.get("fulljournalname", "PubMed Central"),
                "published_at": paper_data.get("pubdate", ""),
                "pmc_id": pmc_id,
                "doi": paper_data.get("elocationid", ""),
                "keywords": self.extract_keywords(paper_data.get("abstract", "")),
                "materials_focus": self.identify_materials_focus(paper_data.get("abstract", "")),
                "pdf_url": f"https://www.ncbi.nlm.nih.gov/pmc/articles/PMC{pmc_id}/pdf/",
                "url": f"https://www.ncbi.nlm.nih.gov/pmc/articles/PMC{pmc_id}/",
                "source": "PubMed Central"
            }
            
            return paper
            
        except Exception as e:
            print(f"Error fetching PMC paper details: {e}")
            return None

    async def fetch_from_core(self, query: str, max_results: int = 20) -> List[Dict[str, Any]]:
        """Fetch papers from CORE repository"""
        try:
            # CORE API endpoint
            api_url = "https://api.core.ac.uk/v3/search/works"
            
            # Build search query
            search_query = f"({query}) AND (materials OR nanotechnology OR graphene OR polymer)"
            
            payload = {
                "q": search_query,
                "limit": max_results,
                "scroll": False,
                "fields": ["title", "authors", "abstract", "downloadUrl", "doi", "publishedDate", "sourceFulltextUrl"]
            }
            
            headers = {
                "Authorization": "Bearer YOUR_CORE_API_KEY",  # Note: CORE requires API key for production
                "Content-Type": "application/json"
            }
            
            # For demo purposes, we'll use a mock response
            # In production, you'd need to get a free API key from CORE
            return await self._mock_core_response(query, max_results)
            
        except Exception as e:
            print(f"Error fetching from CORE: {e}")
            return []

    async def _mock_core_response(self, query: str, max_results: int) -> List[Dict[str, Any]]:
        """Mock response for CORE (since it requires API key)"""
        # This is a placeholder - in production you'd use the real CORE API
        return []

    async def fetch_from_doaj(self, query: str, max_results: int = 20) -> List[Dict[str, Any]]:
        """Fetch papers from Directory of Open Access Journals"""
        try:
            # DOAJ API endpoint
            api_url = "https://doaj.org/api/v2/search/articles"
            
            # Build search query
            search_query = f"({query}) AND (materials OR nanotechnology)"
            
            params = {
                "q": search_query,
                "page": 1,
                "pageSize": max_results,
                "sort": "publishedDate:desc"
            }
            
            response = await self.client.get(api_url, params=params)
            response.raise_for_status()
            
            data = response.json()
            papers = []
            
            for article in data.get("results", []):
                # Extract authors
                authors = []
                if "bibjson" in article and "author" in article["bibjson"]:
                    for author in article["bibjson"]["author"]:
                        if "name" in author:
                            authors.append(author["name"])
                
                # Create paper object
                paper = {
                    "title": article.get("bibjson", {}).get("title", ""),
                    "authors": authors,
                    "abstract": article.get("bibjson", {}).get("abstract", ""),
                    "journal": article.get("bibjson", {}).get("journal", {}).get("title", "DOAJ"),
                    "published_at": article.get("bibjson", {}).get("year", ""),
                    "doi": article.get("bibjson", {}).get("identifier", [{}])[0].get("id", ""),
                    "keywords": self.extract_keywords(article.get("bibjson", {}).get("abstract", "")),
                    "materials_focus": self.identify_materials_focus(article.get("bibjson", {}).get("abstract", "")),
                    "pdf_url": article.get("bibjson", {}).get("link", [{}])[0].get("url", ""),
                    "url": article.get("bibjson", {}).get("link", [{}])[0].get("url", ""),
                    "source": "DOAJ"
                }
                
                papers.append(paper)
            
            return papers
            
        except Exception as e:
            print(f"Error fetching from DOAJ: {e}")
            return []

    def extract_keywords(self, text: str) -> List[str]:
        """Extract potential keywords from text"""
        keywords = []
        
        technical_terms = [
            "nanoparticle", "nanostructure", "nanocomposite", "nanotechnology",
            "quantum", "electronic", "optical", "magnetic", "thermal",
            "mechanical", "electrochemical", "photovoltaic", "catalytic",
            "synthesis", "characterization", "fabrication", "processing"
        ]
        
        for term in technical_terms:
            if term.lower() in text.lower():
                keywords.append(term)
        
        return keywords[:10]

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
        
        return list(set(focus_areas))

    async def fetch_all_sources(self, query: str = "materials science", max_results: int = 10) -> Dict[str, List[Dict[str, Any]]]:
        """Fetch papers from all available sources"""
        tasks = [
            self.fetch_from_pubmed_central(query, max_results),
            self.fetch_from_doaj(query, max_results),
            # self.fetch_from_core(query, max_results),  # Requires API key
        ]
        
        results = await asyncio.gather(*tasks, return_exceptions=True)
        
        return {
            "pubmed_central": results[0] if not isinstance(results[0], Exception) else [],
            "doaj": results[1] if not isinstance(results[1], Exception) else [],
            "core": results[2] if not isinstance(results[2], Exception) else [],
        }

    async def close(self):
        """Close the HTTP client"""
        await self.client.aclose() 