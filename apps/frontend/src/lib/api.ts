export async function fetchArxivPapers(limit = 10, daysBack = 30) {
  const API_BASE_HOSTPORT = import.meta.env.VITE_BACKEND_URL;
  const API_BASE = `http://${API_BASE_HOSTPORT}`;
  const response = await fetch(`${API_BASE}/api/papers/arxiv/fetch?max_results=${limit}&days_back=${daysBack}`);
  if (!response.ok) throw new Error('Failed to fetch ArXiv papers');
  const data = await response.json();
  return data.papers;
}

export async function fetchPubMedPapers(query = "materials science", limit = 10) {
  const API_BASE_HOSTPORT = import.meta.env.VITE_BACKEND_URL;
  const API_BASE = `http://${API_BASE_HOSTPORT}`;
  const response = await fetch(`${API_BASE}/api/papers/pubmed?query=${encodeURIComponent(query)}&max_results=${limit}`);
  if (!response.ok) throw new Error('Failed to fetch PubMed papers');
  const data = await response.json();
  return data.papers;
}

export async function fetchDOAJPapers(query = "materials science", limit = 10) {
  const API_BASE_HOSTPORT = import.meta.env.VITE_BACKEND_URL;
  const API_BASE = `http://${API_BASE_HOSTPORT}`;
  const response = await fetch(`${API_BASE}/api/papers/doaj?query=${encodeURIComponent(query)}&max_results=${limit}`);
  if (!response.ok) throw new Error('Failed to fetch DOAJ papers');
  const data = await response.json();
  return data.papers;
}

export async function fetchAllSourcesPapers(query = "materials science", limit = 15) {
  const API_BASE_HOSTPORT = import.meta.env.VITE_BACKEND_URL;
  const API_BASE = `http://${API_BASE_HOSTPORT}`;
  const response = await fetch(`${API_BASE}/api/papers/all-sources?query=${encodeURIComponent(query)}&max_results=${limit}`);
  if (!response.ok) throw new Error('Failed to fetch papers from all sources');
  const data = await response.json();
  return data;
}
