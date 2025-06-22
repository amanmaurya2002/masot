import { fetchEvents, fetchNews } from '$lib/api';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
  try {
    const [events, news] = await Promise.all([
      fetchEvents(), 
      fetchNews()
    ]);

    return {
      events,
      news,
    };
  } catch (error) {
    console.error('Failed to load data:', error);
    // You can return an error state to be handled by the page
    return {
      events: [],
      news: [],
      error: 'Could not load data from the server. Please try again later.',
    };
  }
}; 