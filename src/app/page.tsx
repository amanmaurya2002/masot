"use client";
import { useEffect, useState } from "react";
import Image from "next/image";

// Event data
const initialEvents = [
  {
    id: 1,
    title: "IPL 2025: Punjab Kings vs. Rajasthan Royals",
    date: "April 5, 2025",
    time: "7:30 PM",
    venue: "Maharaja Yadavindra Singh Cricket Stadium, Mohali",
    description: "An exciting IPL match featuring Punjab Kings and Rajasthan Royals.",
    category: "Sports",
    price: "₹500 - ₹5000"
  },
  {
    id: 2,
    title: "IPL 2025: Punjab Kings vs. Chennai Super Kings",
    date: "April 8, 2025",
    time: "7:30 PM",
    venue: "Maharaja Yadavindra Singh Cricket Stadium, Mohali",
    description: "A thrilling encounter between Punjab Kings and Chennai Super Kings.",
    category: "Sports",
    price: "₹500 - ₹5000"
  },
  {
    id: 3,
    title: "IPL 2025: Punjab Kings vs. Kolkata Knight Riders",
    date: "April 15, 2025",
    time: "7:30 PM",
    venue: "Maharaja Yadavindra Singh Cricket Stadium, Mohali",
    description: "A high-energy match between Punjab Kings and Kolkata Knight Riders.",
    category: "Sports",
    price: "₹500 - ₹5000"
  },
  {
    id: 4,
    title: "IPL 2025: Punjab Kings vs. Royal Challengers Bengaluru",
    date: "April 20, 2025",
    time: "7:30 PM",
    venue: "Maharaja Yadavindra Singh Cricket Stadium, Mohali",
    description: "A must-watch game between Punjab Kings and Royal Challengers Bengaluru.",
    category: "Sports",
    price: "₹500 - ₹5000"
  },
  {
    id: 5,
    title: "Chandigarh Literature Festival",
    date: "April 12, 2025",
    time: "10:00 AM",
    venue: "Tagore Theatre, Sector 18",
    description: "A celebration of literature featuring renowned authors, poets, and literary discussions.",
    category: "Culture",
    price: "Free"
  },
  {
    id: 6,
    title: "Rock Garden Music Festival",
    date: "April 18, 2025",
    time: "6:00 PM",
    venue: "Rock Garden, Sector 1",
    description: "An evening of live music performances in the beautiful Rock Garden setting.",
    category: "Music",
    price: "₹300"
  },
  {
    id: 7,
    title: "Food Festival at Sukhna Lake",
    date: "April 25, 2025",
    time: "5:00 PM",
    venue: "Sukhna Lake, Sector 1",
    description: "Experience the best of Punjabi cuisine and street food by the lake.",
    category: "Food",
    image: "/food-festival.jpg",
    price: "₹200"
  },
  {
    id: 8,
    title: "Art Exhibition: Modern Chandigarh",
    date: "April 30, 2025",
    time: "11:00 AM",
    venue: "Government Museum and Art Gallery, Sector 10",
    description: "Contemporary art exhibition showcasing local and national artists.",
    category: "Art",
    image: "/art-exhibition.jpg",
    price: "₹100"
  }
];

// Category colors
const categoryColors = {
  Sports: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
  Culture: "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200",
  Music: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
  Food: "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200",
  Art: "bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-200"
};

export default function Home() {
  const [events, setEvents] = useState(initialEvents);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const stored = localStorage.getItem("events");
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setEvents(parsed);
        }
      } catch {
        console.error("Failed to parse stored events");
      }
    }
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      {/* Header */}
      <header className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border-b border-gray-200 dark:border-gray-700 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">EC</span>
              </div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                Events Chandigarh
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <button className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors">
                About
              </button>
              <button className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors">
                Contact
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-4xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6">
            Discover Amazing Events in
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
              {" "}Chandigarh
            </span>
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto mb-8">
            From thrilling IPL matches to cultural festivals, explore the best events happening in the City Beautiful.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            {Object.keys(categoryColors).map((category) => (
              <span
                key={category}
                className={`px-4 py-2 rounded-full text-sm font-medium ${categoryColors[category as keyof typeof categoryColors]}`}
              >
                {category}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Events Grid */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {events.map((event) => (
              <div
                key={event.id}
                className="bg-white dark:bg-gray-800 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group"
              >
                {/* Event Image Placeholder */}
                <div className="h-48 bg-gradient-to-br from-blue-400 to-indigo-500 relative overflow-hidden">
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors duration-300"></div>
                  <div className="absolute top-4 left-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${categoryColors[event.category as keyof typeof categoryColors]}`}>
                      {event.category}
                    </span>
                  </div>
                  <div className="absolute bottom-4 right-4">
                    <span className="px-3 py-1 rounded-full text-xs font-medium bg-white/90 text-gray-900">
                      {event.price}
                    </span>
                  </div>
                </div>

                {/* Event Content */}
                <div className="p-6">
                  <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mb-3">
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    {event.date} • {event.time}
                  </div>
                  
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3 line-clamp-2">
                    {event.title}
                  </h3>
                  
                  <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mb-3">
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <span className="line-clamp-1">{event.venue}</span>
                  </div>
                  
                  <p className="text-gray-600 dark:text-gray-300 mb-4 line-clamp-2">
                    {event.description}
                  </p>
                  
                  <button className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-medium py-3 px-4 rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 transform hover:scale-105">
                    Book Tickets
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white dark:bg-gray-800">
        <div className="max-w-4xl mx-auto text-center">
          <h3 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            Stay Updated
          </h3>
          <p className="text-gray-600 dark:text-gray-300 mb-8">
            Subscribe to our newsletter to get notified about upcoming events in Chandigarh.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
            />
            <button className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-medium rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all duration-300">
              Subscribe
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h4 className="text-lg font-bold mb-4">Events Chandigarh</h4>
              <p className="text-gray-400">
                Your gateway to the best events in the City Beautiful.
              </p>
            </div>
            <div>
              <h5 className="font-semibold mb-4">Quick Links</h5>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Sports Events</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Cultural Events</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Music Events</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Food Festivals</a></li>
              </ul>
            </div>
            <div>
              <h5 className="font-semibold mb-4">Venues</h5>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Cricket Stadium</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Tagore Theatre</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Rock Garden</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Sukhna Lake</a></li>
              </ul>
            </div>
            <div>
              <h5 className="font-semibold mb-4">Contact</h5>
              <ul className="space-y-2 text-gray-400">
                <li>Email: info@eventschandigarh.com</li>
                <li>Phone: +91 98765 43210</li>
                <li>Address: Sector 17, Chandigarh</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2025 Events Chandigarh. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
