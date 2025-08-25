import { cookies } from "next/headers";
import { apiGet } from "@/lib/api/axios";
import ReservationForm from "./ReservationForm";
import Link from "next/link";
import { formatDate } from "@/lib/helpers/formatDate";
import { Event } from "@/lib/commonTypes";
import Reservation from "@/components/Reservation";
import { EventEP } from "@/lib/api/ep";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function EventPage({ params }: Props) {
  const { id } = await params;
  const cookieStore = await cookies();
  const userCookie = cookieStore.get("user_id");
  const userId = userCookie ? parseInt(userCookie.value) : 0;
  const { data, error } = await apiGet(`${EventEP.EVENT}/${id}`);
  const event: Event = data;

  const userReservationsCount =
    event.reservations
      ?.filter((res) => res.user_id === userId)
      .reduce((sum, res) => sum + res.quantity, 0) || 0;

  const showReservationForm =
    userId !== 0 &&
    userId !== event.owner_id &&
    event.remaining_capacity > 0 &&
    userReservationsCount < 5;

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
      {event.remaining_capacity > 0 && (
        <p>
          <strong>Remaining:</strong> {event.remaining_capacity}
        </p>
      )}
      <div className="mt-6">
        {userId === 0 && (
          <h4>
            <Link href="/login" className="underline">
              Login
            </Link>{" "}
            to make reservation for this event!
          </h4>
        )}
        {userId !== 0 && userId === event.owner_id && (
          <p className="text-green-600 font-semibold">
            You are the owner of this event.
          </p>
        )}
        {showReservationForm && <ReservationForm eventId={event.id} />}

        {event.reservations?.length != 0 && (
          <div className="mt-6">
            <p className="font-semibold text-2xl mb-2">Reservations</p>
            <div className="space-y-2 bg-white p-2">
              {event.reservations?.map((res) => {
                const converted = {
                  id: res.id,
                  user_id: res.user_id,
                  quantity: res.quantity,
                  event_title: event.title,
                  event_id: event.id,
                  user_name: res.user.name,
                  event: { price: event.price || 0, id: event.id, title: "" },
                };
                return <Reservation key={res.id} res={converted} />;
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
