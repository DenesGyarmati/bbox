import { cookies } from "next/headers";
import { apiGet } from "@/lib/api/axios";

interface Event {
  id: number;
  title: string;
  description?: string;
  starts_at: string;
  location?: string;
  capacity?: number;
  category?: string;
  status: string;
  owner_id: number;
}

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
        <strong>Starts at:</strong> {new Date(event.starts_at).toLocaleString()}
      </p>
      <p>
        <strong>Location:</strong> {event.location || "N/A"}
      </p>
      <p>
        <strong>Capacity:</strong> {event.capacity || "N/A"}
      </p>
      <p>
        <strong>Category:</strong> {event.category || "N/A"}
      </p>
      <p>
        <strong>Status:</strong> {event.status}
      </p>
    </div>
  );
}
