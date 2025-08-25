"use client";
import { useState } from "react";
import Pagination from "./Pagination";
import { useEvents } from "@/hooks/useEvents";
import EventTile from "./EventTile";
import Filters from "./Filters";

interface Props {
  locations: string[];
  categories: string[];
}

export default function EventSearch({ locations, categories }: Props) {
  const [filters, setFilters] = useState({
    query: "",
    location: "",
    category: "",
  });

  const { events, loading, page, setPage, totalPages } = useEvents({
    query: filters.query,
    location: filters.location,
    category: filters.category,
  });

  return (
    <div className="fixed inset-0 flex top-[73px]">
      <aside className="w-64 bg-white p-6 border-r border-gray-200 flex-shrink-0 h-full overflow-y-auto">
        <h2 className="text-xl font-bold mb-4 text-gray-900">Filters</h2>
        <Filters
          locations={locations}
          categories={categories}
          loading={loading}
          onChange={(newFilters) => {
            setFilters(newFilters);
            setPage(1);
          }}
        />
      </aside>
      <main className="flex-1 flex flex-col h-full overflow-y-auto p-6">
        <div className="overflow-y-auto flex-1 p-6">
          <h1 className="text-2xl font-bold mb-8">Upcoming Events</h1>
          {events.length === 0 && !loading && (
            <p className="text-gray-500 mb-4">No events found</p>
          )}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {events.map((event) => (
              <EventTile key={event.id} event={event} />
            ))}
          </div>

          {totalPages > 1 && (
            <Pagination page={page} totalPages={totalPages} setPage={setPage} />
          )}
        </div>
      </main>
    </div>
  );
}
