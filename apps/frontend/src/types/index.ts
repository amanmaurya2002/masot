export interface Event {
  id: number;
  title: string;
  date: string;
  time: string;
  venue: string;
  category?: string;
  description?: string;
  image?: string;
  url?: string;
}

export interface NewsItem {
  id: number;
  title: string;
  url: string;
  source: string;
  publishedAt: string;
  image?: string;
}

export interface ApiResponse<T> {
  data?: T;
  error?: string;
  status: number;
} 