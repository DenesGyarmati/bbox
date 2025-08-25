import { useState, useEffect } from "react";
import { usePopup } from "@/context/PopupContext";

interface Event {
  id: number;
  title: string;
  description: string;
}

interface UseEventsProps {
  query: string;
  location: string;
  category: string;
  perPage?: number;
}

export function useEvents({
  query,
  location,
  category,
  perPage = 12,
}: UseEventsProps) {
  const { showError } = usePopup();
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    let active = true;

    const fetchEvents = async () => {
      setLoading(true);
      try {
        const params = new URLSearchParams();
        if (query) params.append("search", query);
        if (location) params.append("location", location);
        if (category) params.append("category", category);
        params.append("page", page.toString());
        params.append("per_page", perPage.toString());

        const res = await fetch(`/api/events?${params.toString()}`);
        if (!res.ok) throw new Error(res.statusText);

        const data = await res.json();
        if (!active) return;

        setEvents(data.data || []);
        setTotalPages(Math.ceil((data.total || 0) / perPage));
      } catch (err) {
        showError({ body: err?.toString() });
        if (active) setEvents([]);
      } finally {
        if (active) setLoading(false);
      }
    };

    fetchEvents();
    return () => {
      active = false;
    };
  }, [query, location, category, page, perPage]);

  return { events, loading, page, setPage, totalPages };
}
