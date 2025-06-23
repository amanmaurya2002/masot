import { fetchEvents, fetchNews, ApiError } from '$lib/api';
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
      error: null, // Explicitly set error to null on success
    };
  } catch (error) {
    let userFriendlyMessage = 'Could not load data from the server. Please try again later.';

    if (error instanceof ApiError) {
      console.error(`API Error (${error.status}) while fetching data: ${error.message}. Details:`, error.details);
      // Optionally, customize user message based on status
      if (error.status === 503) {
        userFriendlyMessage = 'The service is temporarily unavailable. Please try again later.';
      }
      // For other specific statuses like 401 or 429 from the news API key handling
      // we can keep the generic "Could not load data..." or make them more specific if desired,
      // but the key point is the console gets the rich `error.details`.
    } else if (error instanceof Error) {
      console.error('Failed to load data due to an unexpected error:', error.message, error.stack);
    } else {
      console.error('Failed to load data due to an unknown error:', error);
    }

    return {
      events: [],
      news: [],
      error: userFriendlyMessage,
    };
  }
};