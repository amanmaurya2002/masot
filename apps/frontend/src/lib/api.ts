import type { News, Event } from './types';

const API_BASE_HOSTPORT = import.meta.env.VITE_BACKEND_URL;
const API_BASE = `http://${API_BASE_HOSTPORT}`;

export async function fetchNews(): Promise<News[]> {
  const response = await fetch(`${API_BASE}/news`);
  if (!response.ok) {
    throw new Error('Failed to fetch news');
  }
  return await response.json();
}

export async function fetchEvents(): Promise<Event[]> {
  const response = await fetch(`${API_BASE}/events`);
  if (!response.ok) {
    throw new Error('Failed to fetch events');
  }
  return await response.json();
}

export async function fetchArxivPapers(limit = 10, daysBack = 30) {
  const response = await fetch(`${API_BASE}/api/papers/arxiv/fetch?max_results=${limit}&days_back=${daysBack}`);
  if (!response.ok) throw new Error('Failed to fetch ArXiv papers');
  const data = await response.json();
  return data.papers;
}
