"use client";
import { useEffect, useState } from "react";

interface Event {
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

interface NewsItem {
  id: number;
  title: string;
  url: string;
  source: string;
  publishedAt: string;
  image?: string;
}

// Category colors
const categoryColors = {
  Sports: "category-sports",
  Culture: "category-culture",
  Music: "category-music",
  Food: "category-food",
  Art: "category-art"
};

export default function Home() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [news, setNews] = useState<NewsItem[]>([]);
  const [newsLoading, setNewsLoading] = useState(true);

  useEffect(() => {
    const loadEvents = async () => {
      const backend = process.env.NEXT_PUBLIC_BACKEND_URL;
      const endpoint = backend ? `${backend.replace(/\/$/, "")}/events` : "/api/events";

      try {
        const res = await fetch(endpoint);
        if (res.ok) {
          setEvents(await res.json());
        }
      } catch (err) {
        console.error("Failed to fetch events", err);
      } finally {
        setLoading(false);
      }
    };

    loadEvents();
  }, []);

  // Fetch news once on mount
  useEffect(() => {
    const loadNews = async () => {
      const backend = process.env.NEXT_PUBLIC_BACKEND_URL;
      const endpoint = backend ? `${backend.replace(/\/$/, "")}/news` : "/api/news";

      try {
        const res = await fetch(endpoint);
        if (res.ok) {
          setNews(await res.json());
        }
      } catch (err) {
        console.error("Failed to fetch news", err);
      } finally {
        setNewsLoading(false);
      }
    };
    loadNews();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-green-600 to-lime-600 text-white">
        <div className="container">
          <div className="text-center">
            <h1 className="text-4xl font-bold mb-4">
              Discover Amazing Events in Chandigarh
            </h1>
            <p className="text-xl mb-8">
              Your gateway to the best events, concerts, and activities in the City Beautiful
            </p>
            <a href="#events" className="btn bg-white text-green-600 hover:bg-gray-100">
              Explore Events
            </a>
          </div>
        </div>
      </section>

      {/* Events Section */}
      <section id="events" className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="container">
          <h2 className="text-3xl font-bold text-center mb-12">Upcoming Events</h2>
          
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="card">
                  <div className="skeleton h-48"></div>
                  <div className="card-content">
                    <div className="skeleton h-6 mb-2"></div>
                    <div className="skeleton h-4 mb-4"></div>
                    <div className="skeleton h-4"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : events.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {events.map((event) => (
                <div key={event.id} className="card">
                  {event.image ? (
                    <img 
                      src={event.image} 
                      alt={event.title}
                      className="card-image"
                    />
                  ) : (
                    <div className="card-image bg-gradient-to-br from-green-400 to-lime-400 flex items-center justify-center">
                      <span className="text-white font-bold text-lg">Event</span>
                    </div>
                  )}
                  <div className="card-content">
                    <h3 className="text-lg font-semibold mb-2 line-clamp-2">{event.title}</h3>
                    <div className="text-gray-600 text-sm mb-2">
                      <p>📅 {event.date} at {event.time}</p>
                      <p>📍 {event.venue}</p>
                    </div>
                    {event.category && (
                      <span className={`category-badge ${categoryColors[event.category as keyof typeof categoryColors] || 'category-sports'}`}>
                        {event.category}
                      </span>
                    )}
                    {event.description && (
                      <p className="text-gray-600 mt-2 line-clamp-2">{event.description}</p>
                    )}
                    {event.url && (
                      <a 
                        href={event.url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-green-600 hover:underline mt-2 inline-block"
                      >
                        Learn More →
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">No events available at the moment.</p>
            </div>
          )}
        </div>
      </section>

      {/* Latest News Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-100">
        <div className="container">
          <h2 className="text-3xl font-bold text-center mb-12">Latest News</h2>
          
          {newsLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="card">
                  <div className="skeleton h-32"></div>
                  <div className="card-content">
                    <div className="skeleton h-5 mb-2"></div>
                    <div className="skeleton h-4 mb-2"></div>
                    <div className="skeleton h-3"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : news.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {news.map((item) => (
                <div key={item.id} className="card">
                  {item.image ? (
                    <img 
                      src={item.image} 
                      alt={item.title}
                      className="card-image"
                    />
                  ) : (
                    <div className="card-image bg-gradient-to-br from-green-400 to-lime-400 flex items-center justify-center">
                      <span className="text-white font-bold">News</span>
                    </div>
                  )}
                  <div className="card-content">
                    <h3 className="text-lg font-semibold mb-2 line-clamp-2">{item.title}</h3>
                    <div className="text-gray-600 text-sm mb-2">
                      <p>📰 {item.source}</p>
                      <p>📅 {new Date(item.publishedAt).toLocaleDateString()}</p>
                    </div>
                    <a 
                      href={item.url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-green-600 hover:underline"
                    >
                      Read More →
                    </a>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">No news available at the moment.</p>
            </div>
          )}
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-green-600 text-white">
        <div className="container">
          <div className="text-center">
            <h2 className="text-3xl font-bold mb-4">Stay Updated</h2>
            <p className="text-xl mb-8">
              Get notified about the latest events and news in Chandigarh
            </p>
            <div className="flex justify-center gap-4">
              <input 
                type="email" 
                placeholder="Enter your email"
                className="form-input rounded-md px-4 py-3 text-gray-900"
              />
              <button className="btn bg-white text-green-600 hover:bg-gray-100">
                Subscribe
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
