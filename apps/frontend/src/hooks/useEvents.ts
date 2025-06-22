import { useState, useEffect } from 'react';
import { Event } from '../types';
import { apiClient } from '../lib/api';

export function useEvents() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await apiClient.getEvents();
        
        if (response.error) {
          setError(response.error);
        } else if (response.data) {
          setEvents(response.data);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch events');
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  const addEvent = async (eventData: Omit<Event, 'id'>) => {
    try {
      const response = await apiClient.createEvent(eventData);
      
      if (response.error) {
        throw new Error(response.error);
      }
      
      if (response.data) {
        setEvents(prev => [...prev, response.data!]);
        return response.data;
      }
    } catch (err) {
      throw err;
    }
  };

  return {
    events,
    loading,
    error,
    addEvent,
  };
} 