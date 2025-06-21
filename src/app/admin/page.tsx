"use client";

import Link from "next/link";

export default function AdminPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900 p-4">
      <div className="max-w-2xl w-full bg-white dark:bg-gray-800 rounded-lg shadow-md p-8">
        <h1 className="text-3xl font-bold mb-4 text-gray-900 dark:text-white">Admin Dashboard</h1>
        <p className="text-gray-700 dark:text-gray-300 mb-4">
          Welcome to the admin dashboard. This page is a placeholder and can be expanded with administrative
          functionalities such as managing events, users, and settings.
        </p>
        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
          <Link href="/admin/events" className="w-full">
            <span className="block w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-md text-center transition-colors">
              Manage Events
            </span>
          </Link>
          <button className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-md transition-colors">
            Manage Users
          </button>
        </div>
      </div>
    </div>
  );
} 