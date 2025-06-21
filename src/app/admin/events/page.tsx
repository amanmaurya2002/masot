"use client";

import { useEffect, useState, ChangeEvent, FormEvent } from "react";

interface Event {
  id: number;
  title: string;
  date: string;
  time: string;
  venue: string;
  description: string;
  category: string;
  price: string;
}

const emptyForm: Omit<Event, "id"> = {
  title: "",
  date: "",
  time: "",
  venue: "",
  description: "",
  category: "",
  price: "",
};

export default function EventManager() {
  const [events, setEvents] = useState<Event[]>([]);
  const [form, setForm] = useState<Omit<Event, "id">>(emptyForm);
  const [editingId, setEditingId] = useState<number | null>(null);

  // Load events from localStorage on mount
  useEffect(() => {
    if (typeof window === "undefined") return;
    const stored = localStorage.getItem("events");
    if (stored) {
      try {
        setEvents(JSON.parse(stored));
      } catch {
        console.error("Failed to parse stored events");
      }
    }
  }, []);

  // Persist events to localStorage whenever they change
  useEffect(() => {
    if (typeof window === "undefined") return;
    localStorage.setItem("events", JSON.stringify(events));
  }, [events]);

  // Handle input changes
  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  // Add or update event
  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    if (
      !form.title ||
      !form.date ||
      !form.time ||
      !form.venue ||
      !form.category
    ) {
      alert("Please fill in the required fields.");
      return;
    }

    if (editingId !== null) {
      // Update existing
      setEvents((prev) =>
        prev.map((ev) => (ev.id === editingId ? { id: editingId, ...form } : ev))
      );
      setEditingId(null);
    } else {
      // Create new
      const id = Date.now();
      setEvents((prev) => [...prev, { id, ...form }]);
    }

    setForm(emptyForm);
  };

  const handleEdit = (id: number) => {
    const ev = events.find((e) => e.id === id);
    if (!ev) return;
    const { id: _id, ...rest } = ev;
    setForm(rest);
    setEditingId(id);
  };

  const handleDelete = (id: number) => {
    if (!confirm("Are you sure you want to delete this event?")) return;
    setEvents((prev) => prev.filter((ev) => ev.id !== id));
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 p-6">
      <div className="max-w-4xl mx-auto bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
        <h1 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">
          Event Manager
        </h1>

        {/* Event Form */}
        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-10"
        >
          <input
            name="title"
            value={form.title}
            onChange={handleChange}
            placeholder="Title *"
            className="border border-gray-300 dark:border-gray-600 rounded p-2"
          />
          <input
            name="category"
            value={form.category}
            onChange={handleChange}
            placeholder="Category *"
            className="border border-gray-300 dark:border-gray-600 rounded p-2"
          />
          <input
            name="date"
            value={form.date}
            onChange={handleChange}
            placeholder="Date (e.g. Apr 5, 2025) *"
            className="border border-gray-300 dark:border-gray-600 rounded p-2"
          />
          <input
            name="time"
            value={form.time}
            onChange={handleChange}
            placeholder="Time (e.g. 7:30 PM) *"
            className="border border-gray-300 dark:border-gray-600 rounded p-2"
          />
          <input
            name="venue"
            value={form.venue}
            onChange={handleChange}
            placeholder="Venue *"
            className="border border-gray-300 dark:border-gray-600 rounded p-2 md:col-span-2"
          />
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            placeholder="Description"
            className="border border-gray-300 dark:border-gray-600 rounded p-2 md:col-span-2"
            rows={3}
          />
          <input
            name="price"
            value={form.price}
            onChange={handleChange}
            placeholder="Price"
            className="border border-gray-300 dark:border-gray-600 rounded p-2 md:col-span-2"
          />
          <button
            type="submit"
            className="md:col-span-2 py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded"
          >
            {editingId ? "Update Event" : "Add Event"}
          </button>
        </form>

        {/* Events Table */}
        <div className="overflow-x-auto">
          {events.length === 0 ? (
            <p className="text-gray-500 dark:text-gray-400">No events added yet.</p>
          ) : (
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700 text-sm">
              <thead className="bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100">
                <tr>
                  <th className="px-3 py-2 text-left">Title</th>
                  <th className="px-3 py-2 text-left">Date</th>
                  <th className="px-3 py-2 text-left">Time</th>
                  <th className="px-3 py-2 text-left">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {events.map((ev) => (
                  <tr key={ev.id} className="text-gray-700 dark:text-gray-300">
                    <td className="px-3 py-2 whitespace-nowrap">{ev.title}</td>
                    <td className="px-3 py-2 whitespace-nowrap">{ev.date}</td>
                    <td className="px-3 py-2 whitespace-nowrap">{ev.time}</td>
                    <td className="px-3 py-2 whitespace-nowrap space-x-2">
                      <button
                        onClick={() => handleEdit(ev.id)}
                        className="px-2 py-1 bg-indigo-600 hover:bg-indigo-700 text-white rounded"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(ev.id)}
                        className="px-2 py-1 bg-red-600 hover:bg-red-700 text-white rounded"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
} 