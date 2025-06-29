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

export interface MaterialsNews {
  id: number;
  title: string;
  summary: string;
  content: string;
  source: string;
  published_at: string;
  image_url: string | null;
  url: string;
  category: 'research' | 'industry' | 'breakthrough' | 'conference' | 'publication';
  tags: string[];
}

export interface ResearchPaper {
  id: number;
  title: string;
  authors: string[];
  abstract: string;
  journal: string;
  published_at: string;
  doi: string;
  impact_factor: number | null;
  keywords: string[];
  materials_focus: string[];
} 