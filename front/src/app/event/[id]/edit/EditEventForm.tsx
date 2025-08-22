"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { EventFormValues, eventSchema } from "@/lib/validation/eventSchema";
import { useState } from "react";
import { useRouter } from "next/navigation";

interface Props {
  eventId: string;
  initialData: EventFormValues;
}

export default function EditEventForm({ eventId, initialData }: Props) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<EventFormValues>({
    resolver: zodResolver(eventSchema),
    defaultValues: initialData,
  });

  const onSubmit = async (data: EventFormValues) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/events/${eventId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) {
        const err = await res.json();
        console.error("Failed to update event:", err);
        return;
      }
      const createdEvent = await res.json();
      console.log("Event updated:", createdEvent);
      router.push(`/event/${eventId}`);
    } catch (err) {
      console.error("Unexpected error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Edit Event</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <input
          {...register("title")}
          placeholder="Title"
          className="w-full p-2 border rounded"
        />
        {errors.title && <p className="text-red-500">{errors.title.message}</p>}

        <textarea
          {...register("description")}
          placeholder="Description"
          className="w-full p-2 border rounded"
        />

        <input
          {...register("startsAt")}
          type="datetime-local"
          className="w-full p-2 border rounded"
        />
        {errors.startsAt && (
          <p className="text-red-500">{errors.startsAt.message}</p>
        )}

        <input
          {...register("location")}
          placeholder="Location"
          className="w-full p-2 border rounded"
        />
        <input
          {...register("category")}
          placeholder="Category"
          className="w-full p-2 border rounded"
        />

        <input
          {...register("capacity", {
            valueAsNumber: true,
            min: initialData.capacity,
          })}
          type="number"
          placeholder="Capacity"
          className="w-full p-2 border rounded"
        />
        <input
          {...register("price", { valueAsNumber: true })}
          type="number"
          placeholder="Price"
          className="w-full p-2 border rounded"
          disabled
        />

        <select {...register("status")} className="w-full p-2 border rounded">
          <option value="draft">Draft</option>
          <option value="published">Published</option>
          <option value="cancelled">Cancelled</option>
        </select>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-green-600 text-white p-2 rounded"
        >
          {loading ? "Updating..." : "Update Event"}
        </button>
      </form>
    </div>
  );
}
