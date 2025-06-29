export async function fetchArxivPapers(limit = 10, daysBack = 30) {
  const API_BASE_HOSTPORT = import.meta.env.VITE_BACKEND_URL;
  const API_BASE = `http://${API_BASE_HOSTPORT}`;
  const response = await fetch(`${API_BASE}/api/papers/arxiv/fetch?max_results=${limit}&days_back=${daysBack}`);
  if (!response.ok) throw new Error('Failed to fetch ArXiv papers');
  const data = await response.json();
  return data.papers;
}
