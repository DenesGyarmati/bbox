"use client";

import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { eventSchema, EventFormValues } from "@/lib/validation/eventSchema";
import { useState } from "react";

export default function CreateEventPage() {
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<EventFormValues>({
    resolver: zodResolver(eventSchema),
    defaultValues: {
      status: "draft",
      tickets: [{ name: "", price: 0, quantity: 1 }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "tickets",
  });

  const onSubmit = async (data: EventFormValues) => {
    setLoading(true);
    try {
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Create New Event</h1>

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
          {...register("capacity", { valueAsNumber: true })}
          type="number"
          placeholder="Capacity"
          className="w-full p-2 border rounded"
        />

        <input
          {...register("category")}
          placeholder="Category"
          className="w-full p-2 border rounded"
        />

        <select {...register("status")} className="w-full p-2 border rounded">
          <option value="draft">Draft</option>
          <option value="published">Published</option>
          <option value="cancelled">Cancelled</option>
        </select>
        <div className="space-y-3">
          <h2 className="font-semibold">Tickets</h2>
          {fields.map((field, index) => (
            <div key={field.id} className="flex gap-2 items-center">
              <input
                {...register(`tickets.${index}.name`)}
                placeholder="Ticket Name"
                className="flex-1 p-2 border rounded"
              />
              <input
                {...register(`tickets.${index}.price`, { valueAsNumber: true })}
                type="number"
                placeholder="Price"
                className="w-28 p-2 border rounded"
              />
              <input
                {...register(`tickets.${index}.quantity`, {
                  valueAsNumber: true,
                })}
                type="number"
                placeholder="Qty"
                className="w-20 p-2 border rounded"
              />
              <button
                type="button"
                onClick={() => remove(index)}
                className="text-red-500"
              >
                ✕
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={() => append({ name: "", price: 0, quantity: 1 })}
            className="px-3 py-1 bg-blue-500 text-white rounded"
          >
            + Add Ticket
          </button>
          {errors.tickets && (
            <p className="text-red-500">{errors.tickets.message as string}</p>
          )}
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-green-600 text-white p-2 rounded"
        >
          {loading ? "Creating..." : "Create Event"}
        </button>
      </form>
    </div>
  );
}
