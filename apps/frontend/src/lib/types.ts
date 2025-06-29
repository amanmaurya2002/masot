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
  id?: number;
  title: string;
  authors: string[];
  abstract: string;
  journal: string;
  published_at: string;
  doi?: string;
  arxiv_id?: string;
  pmc_id?: string;
  impact_factor?: number | null;
  keywords: string[];
  materials_focus: string[];
  pdf_url?: string;
  url?: string;
  source?: string;
}

export interface AllSourcesResponse {
  papers: ResearchPaper[];
  count: number;
  sources: string[];
  query: string;
  source_counts: Record<string, number>;
} 