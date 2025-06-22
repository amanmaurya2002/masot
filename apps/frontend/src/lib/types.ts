export interface News {
  id: number;
  title: string;
  url: string;
  source: string;
  published_at: string;
  image_url: string | null;
}

export interface Event {
  id: number;
  title: string;
  date: string;
  time: string;
  venue: string;
  category: string | null;
  description: string | null;
  image_url: string | null;
  external_url: string | null;
} 