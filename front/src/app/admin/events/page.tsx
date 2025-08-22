import { apiGet } from "@/lib/api/axios";

interface Reservation {
  id: number;
  quantity: number;
  created_at: string;
  updated_at: string;
  user: {
    id: number;
    name: string;
  };
}

interface Event {
  id: number;
  title: string;
  description: string;
  starts_at: string;
  location: string;
  capacity: number;
  price: number;
  category: string;
  status: string;
  reservations: Reservation[];
}

export default async function EventsPage() {
  let events: Event[] = [];
  let error = "";

  try {
    const { data } = await apiGet("/admin/events");
    events = data ? data.data : [];
  } catch (err: any) {
    console.log(err);
    error =
      err.response?.data?.error ||
      err.message ||
      "Failed to fetch users from API";
  }

  console.log(events);

  return (
    <>
      <h1 className="text-3xl font-bold mb-6">Admin - Events</h1>

      {error && <p className="text-red-500 mb-4">{error}</p>}

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
                  <strong>Starts at:</strong>{" "}
                  {new Date(event.starts_at).toLocaleString()}
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
              {event.reservations.length > 0 ? (
                <div>
                  <h3 className="text-xl font-semibold mb-3">Reservations</h3>
                  <table className="w-full border-collapse bg-gray-50 rounded-lg overflow-hidden">
                    <thead className="bg-gray-200">
                      <tr>
                        <th className="p-3 text-left text-gray-900">User</th>
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
                      {event.reservations.map((res: Reservation) => (
                        <tr key={res.id} className="border-b hover:bg-gray-100">
                          <td className="p-3 text-gray-900">
                            {res.user?.name || "Unknown"}
                          </td>
                          <td className="p-3 text-gray-900">{res.quantity}</td>
                          <td className="p-3 text-gray-900">
                            {new Date(res.created_at).toLocaleString()}
                          </td>
                          <td className="p-3 text-gray-900">
                            {new Date(res.updated_at).toLocaleString()}
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
        </div>
      ) : !error ? (
        <p>Loading events...</p>
      ) : null}
    </>
  );
}
