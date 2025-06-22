"use client";

import Link from "next/link";

export default function AdminDashboard() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container py-16">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Admin Dashboard</h1>
          <p className="text-gray-600 text-lg">Manage your events and content</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          <Link href="/admin/events" className="card hover:shadow-lg">
            <div className="card-content text-center">
              <div className="text-6xl mb-4">🎪</div>
              <h2 className="text-2xl font-bold mb-2">Manage Events</h2>
              <p className="text-gray-600 mb-4">
                View, add, and manage events in Chandigarh
              </p>
              <span className="btn btn-primary w-full">
                Go to Events
              </span>
            </div>
          </Link>

          <div className="card">
            <div className="card-content text-center">
              <div className="text-6xl mb-4">👥</div>
              <h2 className="text-2xl font-bold mb-2">User Management</h2>
              <p className="text-gray-600 mb-4">
                Manage user accounts and permissions
              </p>
              <button className="btn btn-secondary w-full">
                Coming Soon
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 