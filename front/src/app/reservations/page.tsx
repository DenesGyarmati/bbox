import { apiGet } from "@/lib/api/axios";
import Link from "next/link";

interface Reservation {
  id: number;
  event_title: string;
  event_id: number;
  quantity: number;
}

export default async function ReservationsPage() {
  const { data, error } = await apiGet(`/reservations`);
  const reservations: Reservation[] = data.data;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold mb-6">My Reservations</h1>
      {reservations.map((res) => (
        <div
          key={res.id}
          className="p-6 bg-white rounded shadow hover:shadow-lg transition w-full"
        >
          <h2 className="text-xl font-semibold">{res.event_title}</h2>
          <div className="mt-2 space-y-1 text-gray-700">
            <Link href={`/event/${res.event_id}`}>
              <p>
                <strong>Quantity:</strong> {res.quantity}
              </p>
            </Link>
          </div>
        </div>
      ))}
    </div>
  );
}
