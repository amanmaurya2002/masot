import { useState, useEffect } from 'react';
import { NewsItem } from '../types';
import { apiClient } from '../lib/api';

export function useNews() {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await apiClient.getNews();
        
        if (response.error) {
          setError(response.error);
        } else if (response.data) {
          setNews(response.data);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch news');
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
  }, []);

  return {
    news,
    loading,
    error,
  };
} 