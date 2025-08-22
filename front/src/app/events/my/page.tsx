import { apiGet } from "@/lib/api/axios";
import EventActions from "@/components/EventActions"; // client component

interface Event {
  id: number;
  title: string;
  description: string | null;
  starts_at: string;
  location: string | null;
  capacity: number | null;
  price: number | null;
  category: string | null;
  status: "draft" | "published" | "cancelled";
}

export default async function MyEventsPage() {
  const { data } = await apiGet("/events/my");
  const events: Event[] = data.data;

  const formatDate = (dateStr: string) =>
    new Date(dateStr).toLocaleString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold mb-6">My Events</h1>

      {events.map((event) => (
        <div
          key={event.id}
          className="p-6 bg-white rounded shadow hover:shadow-lg transition w-full"
        >
          <h2 className="text-xl font-semibold">{event.title}</h2>
          <p className="mt-2 text-gray-600">{event.description || "-"}</p>

          <div className="mt-2 space-y-1 text-gray-700">
            <p>
              <strong>Starts at:</strong> {formatDate(event.starts_at)}
            </p>
            <p>
              <strong>Location:</strong> {event.location || "-"}
            </p>
            <p>
              <strong>Category:</strong> {event.category || "-"}
            </p>
            <p>
              <strong>Capacity:</strong> {event.capacity || "-"}
            </p>
            <p>
              <strong>Price:</strong> {event.price || "-"}
            </p>
            <p>
              <strong>Status:</strong>{" "}
              <span
                className={
                  event.status === "published"
                    ? "text-green-600"
                    : event.status === "draft"
                    ? "text-yellow-600"
                    : "text-red-600"
                }
              >
                {event.status}
              </span>
            </p>
          </div>

          {/* Edit button stays in server component */}
          <div className="mt-4 flex gap-2">
            <a
              href={`/event/${event.id}/edit`}
              className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Edit
            </a>

            {/* Only the interactive buttons are client-side */}
            <EventActions event={event} />
          </div>
        </div>
      ))}
    </div>
  );
}
