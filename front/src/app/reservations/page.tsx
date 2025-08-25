import AdminPagination from "@/components/AdminPagination";
import Reservation from "@/components/Reservation";
import { apiGet } from "@/lib/api/axios";
import { ResEP } from "@/lib/api/ep";
import { Reserve } from "@/lib/commonTypes";
import Link from "next/link";

interface ReservationsPageProps {
  searchParams: { page?: string };
}

export default async function ReservationsPage({
  searchParams,
}: ReservationsPageProps) {
  const params = await searchParams;
  const page = Number(params?.page) || 1;
  const { data, error } = await apiGet(`${ResEP.BASE}?page=${page}`);
  const reservations: Reserve[] = data.data;
  const totalPages = data.last_page;

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold mb-6">My Reservations</h1>
      {reservations.map((res) => (
        <Link
          key={res.id}
          href={`/event/${res.event_id}`}
          className="block p-4 bg-white rounded shadow hover:shadow-lg transition w-full"
        >
          <Reservation key={res.id} res={res} />
        </Link>
      ))}
      <AdminPagination page={page} totalPages={totalPages} />
    </div>
  );
}
