import type { News, Event } from './types';

const API_BASE_HOSTPORT = import.meta.env.VITE_BACKEND_URL;
const API_BASE = `http://${API_BASE_HOSTPORT}`;

export class ApiError extends Error {
  status: number;
  details: any; // Can be string or an object, depending on backend error structure

  constructor(message: string, status: number, details?: any) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.details = details;
    // Set the prototype explicitly.
    Object.setPrototypeOf(this, ApiError.prototype);
  }
}

async function handleResponse<T>(response: Response, entityName: string): Promise<T> {
  if (!response.ok) {
    let errorDetails;
    try {
      // Try to parse the error response from the backend
      const errorData = await response.json();
      errorDetails = errorData.detail || errorData.message || response.statusText;
    } catch (e) {
      // If parsing fails, use the status text
      errorDetails = response.statusText;
    }
    throw new ApiError(`Failed to fetch ${entityName}`, response.status, errorDetails);
  }
  return await response.json() as T;
}

export async function fetchNews(): Promise<News[]> {
  const response = await fetch(`${API_BASE}/news`);
  return handleResponse<News[]>(response, 'news');
}

export async function fetchEvents(): Promise<Event[]> {
  const response = await fetch(`${API_BASE}/events`);
  return handleResponse<Event[]>(response, 'events');
}
