import Link from "next/link";

interface Event {
  id: string | number;
  title: string;
  description: string;
  location?: string;
  category?: string;
  price?: number;
}

export default function EventTile({ event }: { event: Event }) {
  return (
    <Link key={event.id} href={`/event/${event.id}`}>
      <div className="p-6 bg-white rounded shadow hover:shadow-lg transition cursor-pointer flex flex-col h-full">
        <h2 className="text-xl font-semibold mb-2 text-gray-900">
          {event.title}
        </h2>

        <p className="text-gray-600 line-clamp-3 flex-1">{event.description}</p>

        <div className="mt-4 text-sm text-gray-500 space-y-1">
          {event.location && (
            <p>
              <span className="font-medium text-gray-700">Location:</span>{" "}
              {event.location}
            </p>
          )}
          {event.category && (
            <p>
              <span className="font-medium text-gray-700">Category:</span>{" "}
              {event.category}
            </p>
          )}
          {event.price && (
            <p>
              <span className="font-medium text-gray-700">Price:</span>{" "}
              {event.price > 0 ? `$${event.price}` : "Free"}
            </p>
          )}
        </div>
      </div>
    </Link>
  );
}
