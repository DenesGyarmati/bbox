import { apiGet } from "@/lib/api/axios";
import EventActions from "@/components/EventActions";
import { formatDate } from "@/lib/helpers/formatDate";
import { Event } from "@/lib/commonTypes";
import AdminPagination from "@/components/AdminPagination";
import { EventEP } from "@/lib/api/ep";

interface MyEventsPageProps {
  searchParams: { page?: string };
}

export default async function MyEventsPage({
  searchParams,
}: MyEventsPageProps) {
  const params = await searchParams;
  const page = Number(params?.page) || 1;
  const { data } = await apiGet(`${EventEP.MY}?page=${page}`);
  const events: Event[] = data.data;
  const totalPages = data.last_page;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">My Events</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {events.map((event) => (
          <div
            key={event.id}
            className="p-6 bg-white rounded shadow hover:shadow-lg transition flex flex-col"
          >
            <h2 className="text-xl font-semibold text-gray-900">
              {event.title}
            </h2>
            <p className="mt-2 text-gray-600 line-clamp-3">
              {event.description || "-"}
            </p>

            <div className="mt-3 space-y-1 text-gray-700 text-sm flex-1">
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
                <strong>Price:</strong> ${event.price || "-"}
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

            <div className="mt-4 flex gap-2">
              <a
                href={`/event/${event.id}/edit`}
                className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                Edit
              </a>
              <EventActions event={event} />
            </div>
          </div>
        ))}
      </div>
      <AdminPagination page={page} totalPages={totalPages} />
    </div>
  );
}
