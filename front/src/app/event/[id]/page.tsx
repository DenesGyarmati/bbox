import { cookies } from "next/headers";
import { apiGet } from "@/lib/api/axios";
import ReservationForm from "./ReservationForm";
import Link from "next/link";
import { formatDate } from "@/lib/helpers/formatDate";
import { Event } from "@/lib/commonTypes";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function EventPage({ params }: Props) {
  const { id } = await params;
  const cookieStore = await cookies();
  const userCookie = cookieStore.get("user_id");
  const userId = userCookie ? parseInt(userCookie.value) : 0;
  const { data, error } = await apiGet(`/event/${id}`);
  const event: Event = data;

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-4">{event.title}</h1>
      <p className="mb-2">{event.description}</p>
      <p>
        <strong>Starts at:</strong> {formatDate(event.starts_at)}
      </p>
      <p>
        <strong>Location:</strong> {event.location || "N/A"}
      </p>
      <p>
        <strong>Price:</strong> {event.price || "N/A"}
      </p>
      <p>
        <strong>Category:</strong> {event.category || "N/A"}
      </p>
      <div className="mt-6">
        {userId === 0 && (
          <h4>
            <Link href="/login" className="underline">
              Login
            </Link>{" "}
            to make reservation for this event!
          </h4>
        )}
        {userId != 0 &&
          (userId === event.owner_id ? (
            <p className="text-green-600 font-semibold">
              You are the owner of this event.
            </p>
          ) : (
            <ReservationForm eventId={event.id} />
          ))}
        {event.reservations?.length != 0 && (
          <>
            <p className="font-semibold text-3xl">Reservations</p>
            {event.reservations?.map((res) => (
              <div key={res.id}>
                <p>{res.user.name}</p>
                <p>{res.quantity}</p>
              </div>
            ))}
          </>
        )}
      </div>
    </div>
  );
}
