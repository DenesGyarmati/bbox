"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { apiGet } from "@/lib/api/axios";

interface Event {
  id: number;
  title: string;
  description: string;
}

export default function EventSearch() {
  const [query, setQuery] = useState("");
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(false);

  // Fetch events (initial + when query changes)
  useEffect(() => {
    let active = true;

    const fetchEvents = async () => {
      setLoading(true);
      try {
        // 👇 this calls your Next.js API route: app/api/events/route.ts
        const res = await fetch(
          `/api/events?page=1&per_page=12&search=${encodeURIComponent(query)}`
        );

        if (!res.ok) {
          throw new Error(`Failed to fetch events: ${res.statusText}`);
        }

        const data = await res.json();

        if (active) {
          setEvents(data?.data || []); // depends on your API response shape
        }
      } catch (err) {
        console.error("Failed to fetch events", err);
        if (active) setEvents([]);
      } finally {
        if (active) setLoading(false);
      }
    };

    fetchEvents();
    return () => {
      active = false;
    };
  }, [query]);

  return (
    <div>
      {/* Header with search */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Upcoming Events</h1>
        <input
          type="text"
          placeholder="Search events..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Loading state */}
      {loading && <p className="text-gray-500">Loading...</p>}

      {/* Event grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {events.map((event) => (
          <Link key={event.id} href={`/event/${event.id}`}>
            <div className="p-6 bg-white rounded shadow hover:shadow-lg transition cursor-pointer">
              <h2 className="text-xl font-semibold">{event.title}</h2>
              <p className="mt-2 text-gray-600">{event.description}</p>
            </div>
          </Link>
        ))}
      </div>

      {/* Empty state */}
      {!loading && events.length === 0 && (
        <p className="text-gray-500">No events found</p>
      )}
    </div>
  );
}
