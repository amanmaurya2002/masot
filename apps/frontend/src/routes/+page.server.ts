import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ fetch }) => {
  const backendUrl = process.env.VITE_BACKEND_URL || 'backend:8000';
  
  try {
    // Fetch papers from all sources
    const response = await fetch(`http://${backendUrl}/api/papers/all-sources?query=materials science&max_results=15`);
    if (!response.ok) throw new Error('Failed to fetch papers from all sources');
    const data = await response.json();
    
    return { 
      papers: data.papers,
      sourceStats: data.source_counts,
      totalCount: data.count
    };
  } catch (error) {
    console.error('Error fetching papers:', error);
    // Fallback to ArXiv only
    const arxivResponse = await fetch(`http://${backendUrl}/api/papers/arxiv/fetch?max_results=10&days_back=30`);
    if (arxivResponse.ok) {
      const arxivData = await arxivResponse.json();
      return { 
        papers: arxivData.papers,
        sourceStats: { 'ArXiv': arxivData.count },
        totalCount: arxivData.count
      };
    }
    return { papers: [], sourceStats: {}, totalCount: 0 };
  }
}; 