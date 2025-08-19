"use client";
import { useParams } from "next/navigation";

interface Event {
  id: string;
  title: string;
  description: string;
}

export default function EventPage() {
  const { id } = useParams();
  // const event = events.find((e) => e.id === id);
  const event: Event[] = [];

  if (!event) {
    return <p>Event not found!</p>;
  }

  return (
    <div className="bg-white p-6 rounded shadow">
      {/* <h1 className="text-3xl font-bold mb-4">{event.title}</h1>
      <p className="text-gray-700">{event.description}</p> */}
    </div>
  );
}
