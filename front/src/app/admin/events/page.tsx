import AdminPagination from "@/components/AdminPagination";
import { apiGet } from "@/lib/api/axios";
import { AdminEP } from "@/lib/api/ep";
import { Event } from "@/lib/commonTypes";
import { formatDate } from "@/lib/helpers/formatDate";

interface EventsPageProps {
  searchParams: { page?: string };
}

export default async function EventsPage({ searchParams }: EventsPageProps) {
  const params = await searchParams;
  const page = Number(params?.page) || 1;
  const { data, status, error } = await apiGet(
    `${AdminEP.EVENTS}?page=${page}`
  );
  const events: Event[] = data.data;
  const totalPages = data.last_page;

  return (
    <>
      <h1 className="text-3xl font-bold mb-6">Admin - Events</h1>

      {error && (
        <p className="text-red-500 mb-4">Failed to load events: {status}</p>
      )}

      {events.length > 0 ? (
        <div className="space-y-8">
          {events.map((event) => (
            <div
              key={event.id}
              className="bg-white rounded-lg shadow-md p-6 space-y-4"
            >
              <div>
                <h2 className="text-2xl font-semibold mb-2 text-gray-900">
                  {event.title}
                </h2>
                <p className="mb-2 text-gray-900">{event.description}</p>
                <p className="text-gray-900">
                  <strong>Starts at:</strong> {formatDate(event.starts_at)}
                </p>
                <p className="text-gray-900">
                  <strong>Location:</strong> {event.location || "N/A"}
                </p>
                <p className="text-gray-900">
                  <strong>Capacity:</strong> {event.capacity || "N/A"}
                </p>
                <p className="text-gray-900">
                  <strong>Price:</strong> {event.price ?? "Free"}
                </p>
                <p className="text-gray-900">
                  <strong>Category:</strong> {event.category || "N/A"}
                </p>
                <p className="text-gray-900">
                  <strong>Status:</strong> {event.status}
                </p>
              </div>
              {event.reservations && event.reservations.length > 0 ? (
                <div>
                  <h3 className="text-xl font-semibold mb-3 text-gray-900">
                    Reservations
                  </h3>
                  <table className="w-full border-collapse bg-gray-50 rounded-lg overflow-hidden">
                    <thead className="bg-gray-200">
                      <tr>
                        <th className="p-3 text-left text-gray-900">User</th>
                        <th className="p-3 text-left text-gray-900">User ID</th>
                        <th className="p-3 text-left text-gray-900">
                          Quantity
                        </th>
                        <th className="p-3 text-left text-gray-900">
                          Created At
                        </th>
                        <th className="p-3 text-left text-gray-900">
                          Updated At
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {event.reservations?.map((res) => (
                        <tr key={res.id} className="border-b hover:bg-gray-100">
                          <td className="p-3 text-gray-900">
                            {res.user?.name}
                          </td>
                          <td className="p-3 text-gray-900">{res.user?.id}</td>
                          <td className="p-3 text-gray-900">{res.quantity}</td>
                          <td className="p-3 text-gray-900">
                            {formatDate(res.created_at)}
                          </td>
                          <td className="p-3 text-gray-900">
                            {formatDate(res.updated_at)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p className="text-gray-500">No reservations yet</p>
              )}
            </div>
          ))}
          <AdminPagination page={page} totalPages={totalPages} />
        </div>
      ) : !error ? (
        <p>Loading events...</p>
      ) : null}
    </>
  );
}
