import type { News, Event } from './types';

const API_BASE = import.meta.env.VITE_BACKEND_URL;

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
