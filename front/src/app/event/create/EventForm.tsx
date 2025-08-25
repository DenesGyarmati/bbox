"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { EventFormValues, eventSchema } from "@/lib/validation/eventSchema";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { usePopup } from "@/context/PopupContext";

interface Props {
  eventId?: string;
  initialData?: Partial<EventFormValues>;
}

export default function EventForm({ eventId, initialData }: Props) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const { showError, showPopup } = usePopup();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<EventFormValues>({
    resolver: zodResolver(eventSchema),
    defaultValues: {
      status: "draft",
      ...initialData,
    },
  });

  const onSubmit = async (data: EventFormValues) => {
    setLoading(true);
    try {
      const url = eventId ? `/api/events/${eventId}` : "/api/events";
      const method = eventId ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        showError({
          title: "Error",
          body: `Failed to ${eventId ? "update" : "create"} event`,
        });
        return;
      }
      const savedEvent = await res.json();
      if (eventId) {
        router.push(`/event/${eventId}`);
      } else {
        router.push(`/event/${savedEvent.event.id}`);
      }
      showPopup({
        title: "Success!",
        body: `Successfuly ${eventId ? "updated" : "created"} event`,
        type: "toast",
        status: "success",
      });
    } catch (err) {
      showError();
    } finally {
      setLoading(false);
    }
  };

  return (
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
        {...register("capacity", { valueAsNumber: true })}
        type="number"
        placeholder="Capacity"
        className="w-full p-2 border rounded"
      />

      <input
        {...register("price", { valueAsNumber: true })}
        type="number"
        placeholder="Price"
        className="w-full p-2 border rounded"
        disabled={!!eventId}
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
        {loading
          ? eventId
            ? "Updating..."
            : "Creating..."
          : eventId
          ? "Update Event"
          : "Create Event"}
      </button>
    </form>
  );
}
