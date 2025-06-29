#!/usr/bin/env python3
"""
Test script for ArXiv integration
Run this to verify that we can fetch materials science papers from ArXiv
"""

import sys
import os
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from services.arxiv_service import ArxivService

def test_arxiv_integration():
    """Test the ArXiv service"""
    print("Testing ArXiv integration...")
    
    arxiv_service = ArxivService()
    
    # Test 1: Fetch recent materials papers
    print("\n1. Fetching recent materials science papers...")
    papers = arxiv_service.fetch_materials_papers(max_results=5, days_back=30)
    
    if papers:
        print(f"✅ Successfully fetched {len(papers)} papers")
        for i, paper in enumerate(papers[:3], 1):
            print(f"   {i}. {paper['title'][:80]}...")
            print(f"      Authors: {', '.join(paper['authors'][:3])}")
            print(f"      Materials Focus: {paper['materials_focus']}")
            print()
    else:
        print("❌ No papers fetched")
    
    # Test 2: Search by specific topic
    print("\n2. Searching for graphene papers...")
    graphene_papers = arxiv_service.search_by_topic("graphene", max_results=3)
    
    if graphene_papers:
        print(f"✅ Found {len(graphene_papers)} graphene papers")
        for i, paper in enumerate(graphene_papers, 1):
            print(f"   {i}. {paper['title'][:80]}...")
    else:
        print("❌ No graphene papers found")
    
    # Test 3: Test keyword extraction
    print("\n3. Testing keyword extraction...")
    sample_text = "This paper presents novel nanomaterials with quantum properties for energy storage applications."
    keywords = arxiv_service.extract_keywords(sample_text)
    print(f"✅ Extracted keywords: {keywords}")
    
    # Test 4: Test materials focus identification
    print("\n4. Testing materials focus identification...")
    materials_focus = arxiv_service.identify_materials_focus(sample_text)
    print(f"✅ Identified materials focus: {materials_focus}")
    
    print("\n🎉 ArXiv integration test completed!")

if __name__ == "__main__":
    test_arxiv_integration() 