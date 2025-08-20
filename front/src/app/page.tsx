import { apiGet } from "@/lib/api/axios";
import Link from "next/link";

interface Event {
  id: number;
  title: string;
  description: string;
}

export default async function HomePage() {
  const { data, error } = await apiGet("/events?page=1&per_page=12");
  const events: Event[] = data.data;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Upcoming Events</h1>
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
    </div>
  );
}
