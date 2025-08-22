"use client";

import { useState, useTransition } from "react";
import axios from "axios";

interface Event {
  id: number;
  status: "draft" | "published" | "cancelled";
}

export default function EventActions({ event }: { event: Event }) {
  const [status, setStatus] = useState(event.status);
  const [isPending, startTransition] = useTransition();

  const updateStatus = async (newStatus: Event["status"]) => {
    try {
      const res = await axios.patch(`/api/events/${event.id}`, {
        status: newStatus,
      });
      console.log(res, event.id);
      startTransition(() => setStatus(newStatus));
    } catch {
      alert("Failed to update status");
    }
  };

  const getPublishButtonLabel = () => {
    if (status === "published") return "Unpublish";
    if (status === "draft") return "Publish";
    return null;
  };

  if (status === "cancelled") return null;

  return (
    <>
      <button
        onClick={() => updateStatus("cancelled")}
        disabled={isPending}
        className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 disabled:opacity-50"
      >
        Cancel
      </button>

      {getPublishButtonLabel() && (
        <button
          onClick={() =>
            updateStatus(status === "published" ? "draft" : "published")
          }
          disabled={isPending}
          className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600 disabled:opacity-50"
        >
          {getPublishButtonLabel()}
        </button>
      )}
    </>
  );
}
