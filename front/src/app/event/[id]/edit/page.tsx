import { apiGet } from "@/lib/api/axios";
import EditEventForm from "./EditEventForm";
import { notFound } from "next/navigation";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function EditEventPage({ params }: Props) {
  const { id } = await params;
  const { data, error } = await apiGet(`/event/${id}`);

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

  return <EditEventForm eventId={id} initialData={mappedData} />;
}
