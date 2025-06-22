"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

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

export default function AdminEvents() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [news, setNews] = useState<NewsItem[]>([]);
  const [newsLoading, setNewsLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
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

    load();

    // Fetch news in parallel
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

  const addCustom = () => {
    const customEvent = {
      title: "Custom Event",
      date: "2024-01-15",
      time: "7:00 PM",
      venue: "Chandigarh",
      category: "Culture",
      description: "A custom event added by admin"
    };

    const backend = process.env.NEXT_PUBLIC_BACKEND_URL;
    const endpoint = backend ? `${backend.replace(/\/$/, "")}/events` : "/api/events";

    fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(customEvent)
    })
    .then(res => res.json())
    .then(newEvent => {
      setEvents(prev => [...prev, newEvent]);
    })
    .catch(err => console.error("Failed to add event", err));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">Events Management</h1>
            <p className="text-gray-600">Manage events and view latest news</p>
          </div>
          <Link href="/admin" className="btn btn-secondary">
            ← Back to Dashboard
          </Link>
        </div>

        {/* Events Section */}
        <div className="card mb-8">
          <div className="card-content">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold">Events ({events.length})</h2>
              <button className="btn btn-primary" onClick={addCustom}>
                Add Event
              </button>
            </div>

            {loading ? (
              <div className="text-center py-8">
                <p className="text-gray-500">Loading events...</p>
              </div>
            ) : events.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="table">
                  <thead>
                    <tr>
                      <th>Title</th>
                      <th>Date</th>
                      <th>Time</th>
                      <th>Venue</th>
                      <th>Category</th>
                    </tr>
                  </thead>
                  <tbody>
                    {events.map((event) => (
                      <tr key={event.id}>
                        <td className="font-semibold">{event.title}</td>
                        <td>{event.date}</td>
                        <td>{event.time}</td>
                        <td>{event.venue}</td>
                        <td>
                          {event.category && (
                            <span className="category-badge category-sports">
                              {event.category}
                            </span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-500">No events available.</p>
              </div>
            )}
          </div>
        </div>

        {/* News Section */}
        <div className="card">
          <div className="card-content">
            <h2 className="text-2xl font-bold mb-6">Latest News</h2>
            
            {newsLoading ? (
              <div className="text-center py-8">
                <p className="text-gray-500">Loading news...</p>
              </div>
            ) : news.length > 0 ? (
              <div className="space-y-4">
                {news.map((item) => (
                  <div key={item.id} className="border-b border-gray-200 pb-4 last:border-b-0">
                    <h3 className="font-semibold mb-1 line-clamp-2">{item.title}</h3>
                    <div className="text-sm text-gray-600 mb-2">
                      <span>{item.source}</span> • <span>{new Date(item.publishedAt).toLocaleDateString()}</span>
                    </div>
                    <a 
                      href={item.url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-green-600 hover:underline"
                    >
                      Read full article →
                    </a>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-500">No news available.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 