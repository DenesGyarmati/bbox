"use client";
import { useState } from "react";
import Link from "next/link";
import Pagination from "./Pagination";
import { useEvents } from "@/hooks/useEvents";

interface Props {
  locations: string[];
  categories: string[];
}

export default function EventSearch({ locations, categories }: Props) {
  const [query, setQuery] = useState("");
  const [selectedLocation, setSelectedLocation] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");

  const { events, loading, page, setPage, totalPages } = useEvents({
    query,
    location: selectedLocation,
    category: selectedCategory,
  });

  return (
    <div className="fixed inset-0 flex top-[73px]">
      <aside className="w-64 bg-white p-6 border-r border-gray-200 flex-shrink-0">
        <h2 className="text-xl font-bold mb-4 text-gray-900">Filters</h2>
        <input
          type="text"
          placeholder="Search events..."
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setPage(1);
          }}
          className="w-full mb-4 px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-500 text-black"
        />
        <label className="block mb-2 font-medium text-gray-700">Location</label>
        <select
          value={selectedLocation}
          onChange={(e) => {
            setSelectedLocation(e.target.value);
            setPage(1);
          }}
          className="w-full mb-4 px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-500 text-black"
        >
          <option value="">All Locations</option>
          {locations.map((loc) => (
            <option key={loc} value={loc}>
              {loc}
            </option>
          ))}
        </select>
        <label className="block mb-2 font-medium text-gray-700">Category</label>
        <select
          value={selectedCategory}
          onChange={(e) => {
            setSelectedCategory(e.target.value);
            setPage(1);
          }}
          className="w-full mb-4 px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-500 text-black"
        >
          <option value="">All Categories</option>
          {categories.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>
        {loading && <p className="text-gray-500 mt-2">Loading...</p>}
      </aside>
      <main className="flex-1 overflow-y-auto p-6 flex flex-col">
        <h1 className="text-2xl font-bold mb-8">Upcoming Events</h1>
        {events.length === 0 && !loading && (
          <p className="text-gray-500 mb-4">No events found</p>
        )}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 flex-1">
          {events.map((event) => (
            <Link key={event.id} href={`/event/${event.id}`}>
              <div className="p-6 bg-white rounded shadow hover:shadow-lg transition cursor-pointer">
                <h2 className="text-xl font-semibold">{event.title}</h2>
                <p className="mt-2 text-gray-600">{event.description}</p>
              </div>
            </Link>
          ))}
        </div>

        {totalPages > 1 && (
          <Pagination page={page} totalPages={totalPages} setPage={setPage} />
        )}
      </main>
    </div>
  );
}
