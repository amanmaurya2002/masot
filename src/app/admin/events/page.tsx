"use client";

import { useEffect, useState } from "react";

interface Event {
  id: number;
  title: string;
  date: string;
  time: string;
  venue: string;
  description?: string;
  category?: string;
  price?: string;
  custom?: boolean; // user-added event
  disabled?: boolean; // hidden from public list
}

export default function AdminEvents() {
  const [fetched, setFetched] = useState<Event[]>([]);
  const [custom, setCustom] = useState<Event[]>([]);
  const [disabledIds, setDisabledIds] = useState<number[]>([]);
  const [loading, setLoading] = useState(true);

  // Form state for adding a new custom event
  const [form, setForm] = useState<Omit<Event, "id" | "custom" | "disabled">>({
    title: "",
    date: "",
    time: "",
    venue: "",
    description: "",
    category: "",
    price: ""
  });

  // Helpers to persist local edits
  const persistCustom = (list: Event[]) => {
    setCustom(list);
    if (typeof window !== "undefined") {
      localStorage.setItem("customEvents", JSON.stringify(list));
    }
  };

  const persistDisabled = (ids: number[]) => {
    setDisabledIds(ids);
    if (typeof window !== "undefined") {
      localStorage.setItem("disabledEventIds", JSON.stringify(ids));
    }
  };

  // Initial load (remote + local)
  useEffect(() => {
    const load = async () => {
      const backend = process.env.NEXT_PUBLIC_BACKEND_URL;
      const endpoint = backend ? `${backend.replace(/\/$/, "")}/events` : "/api/events";

      try {
        const res = await fetch(endpoint);
        if (res.ok) {
          setFetched(await res.json());
        }
      } catch (err) {
        console.error("Failed to fetch remote events", err);
      }

      // Local state
      if (typeof window !== "undefined") {
        try {
          const c = localStorage.getItem("customEvents");
          if (c) setCustom(JSON.parse(c));
        } catch {}
        try {
          const d = localStorage.getItem("disabledEventIds");
          if (d) setDisabledIds(JSON.parse(d));
        } catch {}
      }

      setLoading(false);
    };

    load();
  }, []);

  const addCustom = () => {
    if (!form.title.trim()) return;
    const newEv: Event = { ...form, id: Date.now(), custom: true };
    persistCustom([...custom, newEv]);
    setForm({ title: "", date: "", time: "", venue: "", description: "", category: "", price: "" });
  };

  const deleteCustom = (id: number) => {
    persistCustom(custom.filter((e) => e.id !== id));
  };

  const toggleDisable = (ev: Event) => {
    if (ev.custom) {
      const updated = custom.map((c) => (c.id === ev.id ? { ...c, disabled: !c.disabled } : c));
      persistCustom(updated);
    } else {
      const ids = disabledIds.includes(ev.id)
        ? disabledIds.filter((i) => i !== ev.id)
        : [...disabledIds, ev.id];
      persistDisabled(ids);
    }
  };

  const allEvents = [...fetched, ...custom];

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 p-6">
      <div className="max-w-5xl mx-auto bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
        <h1 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">Admin – Events</h1>

        {/* Add Event Form */}
        <div className="mb-10">
          <h2 className="text-lg font-semibold mb-4">Add Custom Event</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input className="border p-2 rounded" placeholder="Title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
            <input className="border p-2 rounded" placeholder="Date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} />
            <input className="border p-2 rounded" placeholder="Time" value={form.time} onChange={(e) => setForm({ ...form, time: e.target.value })} />
            <input className="border p-2 rounded" placeholder="Venue" value={form.venue} onChange={(e) => setForm({ ...form, venue: e.target.value })} />
            <input className="border p-2 rounded" placeholder="Category" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} />
            <input className="border p-2 rounded" placeholder="Price" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} />
          </div>
          <button className="mt-4 px-4 py-2 bg-blue-600 text-white rounded" onClick={addCustom}>
            Add Event
          </button>
        </div>

        {loading ? (
          <p className="text-gray-500 dark:text-gray-400">Loading…</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700 text-sm">
              <thead className="bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100">
                <tr>
                  <th className="px-3 py-2 text-left">Title</th>
                  <th className="px-3 py-2 text-left">Date</th>
                  <th className="px-3 py-2 text-left">Time</th>
                  <th className="px-3 py-2 text-left">Venue</th>
                  <th className="px-3 py-2 text-left">Status</th>
                  <th className="px-3 py-2 text-left">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {allEvents.map((ev) => {
                  const isDisabled = ev.custom ? ev.disabled : disabledIds.includes(ev.id);
                  return (
                    <tr key={ev.id} className="text-gray-700 dark:text-gray-300">
                      <td className="px-3 py-2 whitespace-nowrap">{ev.title}</td>
                      <td className="px-3 py-2 whitespace-nowrap">{ev.date}</td>
                      <td className="px-3 py-2 whitespace-nowrap">{ev.time}</td>
                      <td className="px-3 py-2 whitespace-nowrap">{ev.venue}</td>
                      <td className="px-3 py-2 whitespace-nowrap">{isDisabled ? "Disabled" : "Enabled"}</td>
                      <td className="px-3 py-2 whitespace-nowrap space-x-2">
                        <button
                          className="px-2 py-1 text-xs bg-yellow-500 text-white rounded"
                          onClick={() => toggleDisable(ev)}
                        >
                          {isDisabled ? "Enable" : "Disable"}
                        </button>
                        {ev.custom && (
                          <button
                            className="px-2 py-1 text-xs bg-red-600 text-white rounded"
                            onClick={() => deleteCustom(ev.id)}
                          >
                            Delete
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
} 