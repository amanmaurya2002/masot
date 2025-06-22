import { Event, NewsItem, ApiResponse } from '../types';

const API_BASE = process.env.NEXT_PUBLIC_BACKEND_URL || '';

class ApiClient {
  private baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  private async request<T>(endpoint: string, options?: RequestInit): Promise<ApiResponse<T>> {
    const url = this.baseUrl ? `${this.baseUrl}${endpoint}` : endpoint;
    
    try {
      const response = await fetch(url, {
        headers: {
          'Content-Type': 'application/json',
          ...options?.headers,
        },
        ...options,
      });

      if (!response.ok) {
        return {
          error: `HTTP ${response.status}: ${response.statusText}`,
          status: response.status,
        };
      }

      const data = await response.json();
      return { data, status: response.status };
    } catch (error) {
      return {
        error: error instanceof Error ? error.message : 'Unknown error',
        status: 500,
      };
    }
  }

  async getEvents(): Promise<ApiResponse<Event[]>> {
    return this.request<Event[]>('/events');
  }

  async createEvent(eventData: Omit<Event, 'id'>): Promise<ApiResponse<Event>> {
    return this.request<Event>('/events', {
      method: 'POST',
      body: JSON.stringify(eventData),
    });
  }

  async getNews(): Promise<ApiResponse<NewsItem[]>> {
    return this.request<NewsItem[]>('/news');
  }
}

export const apiClient = new ApiClient(API_BASE); 