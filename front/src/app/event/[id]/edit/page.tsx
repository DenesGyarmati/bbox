import { apiGet } from "@/lib/api/axios";
import EventForm from "../../create/EventForm";
import { notFound } from "next/navigation";
import { EventEP } from "@/lib/api/ep";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function EditEventPage({ params }: Props) {
  const { id } = await params;
  const { data, error } = await apiGet(`${EventEP.EVENT}/${id}`);

  if (error) {
    return notFound();
  }

  const mappedData = {
    title: data.title,
    description: data.description || "",
    startsAt: new Date(data.starts_at).toISOString().slice(0, 16),
    location: data.location || "",
    category: data.category || "",
    capacity: data.capacity || "",
    price: data.price || "",
    status: data.status,
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Update Event</h1>
      <EventForm eventId={id} initialData={mappedData} />
    </div>
  );
}
