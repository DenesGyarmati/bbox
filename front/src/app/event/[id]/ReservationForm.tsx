"use client";

import { useState } from "react";
import { usePopup } from "@/context/PopupContext";

interface Props {
  eventId: number;
}

export default function ReservationForm({ eventId }: Props) {
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(false);

  const { showPopup } = usePopup();

  const handleReserve = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/reservation/${eventId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ event_id: eventId, quantity }),
      });
      if (!res.ok) {
        const err = await res.json();
        console.error("Failed to reserve:", err);
        return;
      }

      const result = await res.json();
      showPopup({
        title: "Modal Title",
        body: "This is a modal popup 🎉",
        status: "info",
        type: "modal",
      });
    } catch (err) {
      console.error("Unexpected error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="border rounded-lg p-4 shadow mt-4">
      <h2 className="text-xl font-semibold mb-2">Reserve Tickets</h2>
      <div className="flex items-center gap-3">
        <input
          type="number"
          min={1}
          max={5}
          value={quantity}
          onChange={(e) => setQuantity(Number(e.target.value))}
          className="border rounded p-2 w-20"
        />
        <button
          onClick={handleReserve}
          disabled={loading}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? "Reserving..." : "Reserve"}
        </button>
      </div>
    </div>
  );
}
