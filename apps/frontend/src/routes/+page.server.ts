import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ fetch }) => {
  const backendUrl = process.env.VITE_BACKEND_URL || 'backend:8000';
  const response = await fetch(`http://${backendUrl}/api/papers/arxiv/fetch?max_results=10&days_back=30`);
  if (!response.ok) throw new Error('Failed to fetch ArXiv papers');
  const data = await response.json();
  return { papers: data.papers };
}; 